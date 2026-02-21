"""Alert Service — evaluate rules against health data and fire notifications."""

from __future__ import annotations

import html
import logging
import os
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.alert_rule import (
    AlertChannel,
    AlertEvent,
    AlertMetric,
    AlertOperator,
    AlertRule,
)
from app.models.health_check import HealthCheck
from app.models.instance import Instance, InstanceStatus

logger = logging.getLogger(__name__)


METRIC_TO_FIELD = {
    AlertMetric.cpu_percent: "cpu_percent",
    AlertMetric.memory_mb: "memory_mb",
    AlertMetric.db_size_mb: "db_size_mb",
    AlertMetric.active_connections: "active_connections",
    AlertMetric.response_ms: "response_ms",
    AlertMetric.disk_usage_mb: "disk_usage_mb",
}

OPERATOR_FNS = {
    AlertOperator.gt: lambda v, t: v > t,
    AlertOperator.gte: lambda v, t: v >= t,
    AlertOperator.lt: lambda v, t: v < t,
    AlertOperator.lte: lambda v, t: v <= t,
    AlertOperator.eq: lambda v, t: v == t,
}


class AlertService:
    def __init__(self, db: Session):
        self.db = db

    def create_rule(
        self,
        name: str,
        metric: AlertMetric,
        operator: AlertOperator,
        threshold: float,
        channel: AlertChannel = AlertChannel.webhook,
        channel_config: dict | None = None,
        instance_id: UUID | None = None,
        cooldown_minutes: int = 15,
    ) -> AlertRule:
        rule = AlertRule(
            name=name,
            metric=metric,
            operator=operator,
            threshold=threshold,
            channel=channel,
            channel_config=channel_config,
            instance_id=instance_id,
            cooldown_minutes=cooldown_minutes,
        )
        self.db.add(rule)
        self.db.flush()
        return rule

    def delete_rule(self, rule_id: UUID) -> None:
        rule = self.db.get(AlertRule, rule_id)
        if rule:
            rule.is_active = False
            self.db.flush()

    def list_rules(self, active_only: bool = True) -> list[AlertRule]:
        stmt = select(AlertRule)
        if active_only:
            stmt = stmt.where(AlertRule.is_active.is_(True))
        return list(self.db.scalars(stmt).all())

    def get_index_bundle(self) -> dict:
        from app.services.instance_service import InstanceService

        rules = self.list_rules(active_only=False)
        events = self.get_events(limit=50)
        instances = InstanceService(self.db).list_all()
        return {
            "rules": rules,
            "events": events,
            "instances": instances,
            "metrics": [m.value for m in AlertMetric],
            "operators": [o.value for o in AlertOperator],
            "channels": [c.value for c in AlertChannel],
        }

    @staticmethod
    def serialize_rule(rule: AlertRule) -> dict:
        return {
            "rule_id": str(rule.rule_id),
            "name": rule.name,
            "metric": rule.metric.value,
            "operator": rule.operator.value,
            "threshold": rule.threshold,
            "channel": rule.channel.value,
            "instance_id": str(rule.instance_id) if rule.instance_id else None,
            "is_active": rule.is_active,
            "cooldown_minutes": rule.cooldown_minutes,
        }

    @staticmethod
    def serialize_event(event: AlertEvent) -> dict:
        return {
            "event_id": str(event.event_id),
            "rule_id": str(event.rule_id),
            "instance_id": str(event.instance_id) if event.instance_id else None,
            "metric_value": event.metric_value,
            "threshold": event.threshold,
            "triggered_at": event.triggered_at.isoformat() if event.triggered_at else None,
            "resolved_at": event.resolved_at.isoformat() if event.resolved_at else None,
            "notified": event.notified,
        }

    def create_rule_from_form(
        self,
        *,
        name: str,
        metric: str,
        operator: str,
        threshold: float,
        channel: str,
        instance_id: str | None,
        cooldown_minutes: int,
        email_recipients: str,
    ) -> AlertRule:
        from app.services.common import coerce_uuid

        channel_config: dict[str, list[str]] | None = None
        if channel == "email" and email_recipients.strip():
            channel_config = {
                "recipients": [r.strip() for r in email_recipients.split(",") if r.strip()],
            }

        return self.create_rule(
            name=name.strip(),
            metric=AlertMetric(metric),
            operator=AlertOperator(operator),
            threshold=threshold,
            channel=AlertChannel(channel),
            channel_config=channel_config,
            instance_id=coerce_uuid(instance_id) if instance_id else None,
            cooldown_minutes=cooldown_minutes,
        )

    def evaluate_all(self) -> int:
        """Evaluate all active rules against latest health data. Returns alert count."""
        rules = self.list_rules(active_only=True)
        if not rules:
            return 0

        # Get all running instances + their latest health checks
        stmt = select(Instance).where(Instance.status == InstanceStatus.running)
        instances = list(self.db.scalars(stmt).all())

        from app.services.health_service import HealthService

        health_svc = HealthService(self.db)
        checks_map = health_svc.get_latest_checks_batch([i.instance_id for i in instances])

        alert_count = 0
        evaluated_pairs: set[tuple[UUID, UUID]] = set()
        triggered_pairs: set[tuple[UUID, UUID]] = set()
        for rule in rules:
            targets = instances
            if rule.instance_id:
                targets = [i for i in instances if i.instance_id == rule.instance_id]

            for inst in targets:
                check = checks_map.get(inst.instance_id)
                if not check:
                    continue

                value = self._extract_metric(check, rule.metric)
                if value is None:
                    continue
                evaluated_pairs.add((rule.rule_id, inst.instance_id))

                op_fn = OPERATOR_FNS.get(rule.operator)
                if op_fn and op_fn(value, rule.threshold):
                    triggered_pairs.add((rule.rule_id, inst.instance_id))
                    if not self._in_cooldown(rule.rule_id, inst.instance_id):
                        self._fire_alert(rule, inst.instance_id, value)
                        alert_count += 1

        resolved_count = 0
        to_resolve = evaluated_pairs - triggered_pairs
        if to_resolve:
            now = datetime.now(UTC)
            for rule_id, instance_id in to_resolve:
                resolve_stmt = select(AlertEvent).where(
                    AlertEvent.rule_id == rule_id,
                    AlertEvent.instance_id == instance_id,
                    AlertEvent.resolved_at.is_(None),
                )
                events = list(self.db.scalars(resolve_stmt).all())
                for event in events:
                    event.resolved_at = now
                    resolved_count += 1

        if alert_count or resolved_count:
            self.db.commit()
        return alert_count

    def _extract_metric(self, check: HealthCheck, metric: AlertMetric) -> float | None:
        if metric == AlertMetric.health_failures:
            return self._count_recent_failures(check.instance_id)
        field = METRIC_TO_FIELD.get(metric)
        if field:
            return getattr(check, field, None)
        return None

    def _count_recent_failures(self, instance_id: UUID) -> float:
        """Count unhealthy checks in the last 30 minutes."""
        from app.models.health_check import HealthStatus

        cutoff = datetime.now(UTC) - timedelta(minutes=30)
        stmt = select(func.count(HealthCheck.id)).where(
            HealthCheck.instance_id == instance_id,
            HealthCheck.status == HealthStatus.unhealthy,
            HealthCheck.checked_at >= cutoff,
        )
        return float(self.db.scalar(stmt) or 0)

    def _in_cooldown(self, rule_id: UUID, instance_id: UUID) -> bool:
        """Check if this rule already fired recently for this instance."""
        rule = self.db.get(AlertRule, rule_id)
        cooldown = timedelta(minutes=rule.cooldown_minutes if rule else 15)
        cutoff = datetime.now(UTC) - cooldown
        stmt = select(AlertEvent).where(
            AlertEvent.rule_id == rule_id,
            AlertEvent.instance_id == instance_id,
            AlertEvent.triggered_at >= cutoff,
        )
        return self.db.scalar(stmt) is not None

    def _fire_alert(self, rule: AlertRule, instance_id: UUID, value: float) -> AlertEvent:
        event = AlertEvent(
            rule_id=rule.rule_id,
            instance_id=instance_id,
            metric_value=value,
            threshold=rule.threshold,
        )
        self.db.add(event)

        # Dispatch notification
        if rule.channel == AlertChannel.webhook:
            self._notify_webhook(rule, instance_id, value)
            event.notified = True
        elif rule.channel == AlertChannel.email:
            self._notify_email(rule, instance_id, value)
            event.notified = True
        elif rule.channel == AlertChannel.log:
            logger.warning(
                "ALERT [%s] instance=%s metric=%s value=%.2f threshold=%.2f",
                rule.name,
                instance_id,
                rule.metric.value,
                value,
                rule.threshold,
            )
            event.notified = True

        # Best-effort in-app notification
        try:
            from app.models.notification import NotificationCategory, NotificationSeverity
            from app.services.notification_service import NotificationService

            sev = NotificationSeverity.critical if value >= rule.threshold * 1.5 else NotificationSeverity.warning
            NotificationService(self.db).create_for_admins(
                category=NotificationCategory.alert,
                severity=sev,
                title=f"Alert: {rule.name}",
                message=f"{rule.metric.value} {rule.operator.value} {rule.threshold} (actual: {value:.2f})",
                link="/alerts",
            )
        except Exception:
            logger.debug("Failed to create alert notification", exc_info=True)

        self.db.flush()
        return event

    def _notify_email(self, rule: AlertRule, instance_id: UUID, value: float) -> None:
        """Send alert email to configured recipients."""
        try:
            from app.services.email import send_email

            # Determine recipients
            recipients: list[str] = []
            if rule.channel_config and isinstance(rule.channel_config.get("recipients"), list):
                recipients = [r.strip() for r in rule.channel_config["recipients"] if isinstance(r, str) and r.strip()]
            if not recipients:
                env_recipients = os.getenv("ALERT_EMAIL_RECIPIENTS", "")
                recipients = [r.strip() for r in env_recipients.split(",") if r.strip()]

            if not recipients:
                logger.warning("Alert [%s] email channel has no recipients configured", rule.name)
                return

            # Look up instance for context
            org_code = "unknown"
            instance = self.db.get(Instance, instance_id) if instance_id else None
            if instance:
                org_code = instance.org_code

            safe_name = html.escape(rule.name)
            safe_org = html.escape(org_code)
            subject = f"Alert: {rule.name} — {org_code}"
            body_html = (
                f"<h3>Alert: {safe_name}</h3>"
                f"<p><strong>Instance:</strong> {safe_org}</p>"
                f"<p><strong>Metric:</strong> {html.escape(rule.metric.value)} "
                f"{html.escape(rule.operator.value)} {rule.threshold}</p>"
                f"<p><strong>Actual value:</strong> {value:.2f}</p>"
            )
            body_text = (
                f"Alert: {rule.name}\n"
                f"Instance: {org_code}\n"
                f"Metric: {rule.metric.value} {rule.operator.value} {rule.threshold}\n"
                f"Actual value: {value:.2f}"
            )

            for recipient in recipients:
                try:
                    send_email(None, recipient, subject, body_html, body_text)
                except Exception:
                    logger.warning("Failed to send alert email to %s for rule %s", recipient, rule.name, exc_info=True)
        except Exception:
            logger.warning("Failed to send alert emails for rule %s", rule.name, exc_info=True)

    def _notify_webhook(self, rule: AlertRule, instance_id: UUID, value: float) -> None:
        try:
            from app.services.webhook_service import WebhookService

            wh_svc = WebhookService(self.db)
            wh_svc.dispatch(
                "alert_triggered",
                {
                    "rule_name": rule.name,
                    "metric": rule.metric.value,
                    "operator": rule.operator.value,
                    "threshold": rule.threshold,
                    "actual_value": value,
                    "instance_id": str(instance_id),
                },
                instance_id=instance_id,
            )
        except Exception:
            logger.warning("Failed to dispatch alert webhook for rule %s", rule.name, exc_info=True)

    def get_events(
        self,
        instance_id: UUID | None = None,
        rule_id: UUID | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[AlertEvent]:
        stmt = select(AlertEvent)
        if instance_id:
            stmt = stmt.where(AlertEvent.instance_id == instance_id)
        if rule_id:
            stmt = stmt.where(AlertEvent.rule_id == rule_id)
        stmt = stmt.order_by(AlertEvent.triggered_at.desc()).limit(limit).offset(offset)
        return list(self.db.scalars(stmt).all())
