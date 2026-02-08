"""Alert Service — evaluate rules against health data and fire notifications."""

from __future__ import annotations

import logging
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

                op_fn = OPERATOR_FNS.get(rule.operator)
                if op_fn and op_fn(value, rule.threshold):
                    if not self._in_cooldown(rule.rule_id, inst.instance_id):
                        self._fire_alert(rule, inst.instance_id, value)
                        alert_count += 1

        if alert_count:
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
        stmt = select(func.count(HealthCheck.check_id)).where(
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
            logger.warning(
                "ALERT [%s] email channel not yet configured — instance=%s metric=%s value=%.2f threshold=%.2f",
                rule.name,
                instance_id,
                rule.metric.value,
                value,
                rule.threshold,
            )
            event.notified = False
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

        self.db.flush()
        return event

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
