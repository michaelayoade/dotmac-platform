"""Resource Enforcement Service — plan limits and compliance checks."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.instance import Instance
from app.models.module import InstanceModule, Module
from app.models.notification import Notification, NotificationCategory, NotificationSeverity
from app.models.plan import Plan
from app.models.usage_record import UsageMetric
from app.services.feature_flag_service import FeatureFlagService
from app.services.plan_service import PlanService
from app.services.usage_service import UsageService

logger = logging.getLogger(__name__)


@dataclass
class PlanViolation:
    kind: str
    message: str
    current: float | int | str | None = None
    limit: float | int | list[str] | None = None
    percent: float | None = None


class ResourceEnforcementService:
    def __init__(self, db: Session):
        self.db = db

    def check_plan_compliance(self, instance_id: UUID) -> list[PlanViolation]:
        instance, plan = self._get_instance_and_plan(instance_id)
        if not instance or not plan:
            return []

        violations: list[PlanViolation] = []

        # Modules
        if plan.allowed_modules:
            enabled_modules = self._get_enabled_module_slugs(instance_id)
            disallowed = [m for m in enabled_modules if m not in plan.allowed_modules]
            for slug in disallowed:
                violations.append(
                    PlanViolation(
                        kind="module",
                        message=f"Module '{slug}' is not allowed for plan '{plan.name}'",
                        current=slug,
                        limit=plan.allowed_modules,
                    )
                )

        # Flags (only if enabled/true)
        if plan.allowed_flags:
            flag_entries = FeatureFlagService(self.db).list_for_instance(instance_id)
            for entry in flag_entries:
                if _is_truthy(entry["value"]) and entry["key"] not in plan.allowed_flags:
                    violations.append(
                        PlanViolation(
                            kind="flag",
                            message=f"Flag '{entry['key']}' is not allowed for plan '{plan.name}'",
                            current=entry["key"],
                            limit=plan.allowed_flags,
                        )
                    )

        # Usage limits
        summary = self.get_usage_summary(instance_id)
        users_violation = _limit_violation(
            kind="users",
            label="Active users",
            current=summary.get("current_users") or 0,
            limit=summary.get("max_users"),
        )
        if users_violation:
            violations.append(users_violation)

        storage_violation = _limit_violation(
            kind="storage",
            label="Storage (GB)",
            current=summary.get("current_storage_gb") or 0,
            limit=summary.get("max_storage_gb"),
        )
        if storage_violation:
            violations.append(storage_violation)

        return violations

    def enforce_module_access(self, instance_id: UUID, module_slug: str) -> None:
        instance, plan = self._get_instance_and_plan(instance_id)
        if not instance or not plan:
            return
        if not PlanService(self.db).is_module_allowed(plan, module_slug):
            raise ValueError(f"Module '{module_slug}' is not allowed for plan '{plan.name}'")

    def enforce_flag_access(self, instance_id: UUID, flag_key: str) -> None:
        instance, plan = self._get_instance_and_plan(instance_id)
        if not instance or not plan:
            return
        if not PlanService(self.db).is_flag_allowed(plan, flag_key):
            raise ValueError(f"Flag '{flag_key}' is not allowed for plan '{plan.name}'")

    def enforce_user_limit(self, instance_id: UUID, current_users: int) -> None:
        instance, plan = self._get_instance_and_plan(instance_id)
        if not instance or not plan:
            return
        if plan.max_users and current_users > plan.max_users:
            raise ValueError(f"User limit exceeded: {current_users} > {plan.max_users}")

    def enforce_storage_limit(self, instance_id: UUID, current_storage_gb: float) -> None:
        instance, plan = self._get_instance_and_plan(instance_id)
        if not instance or not plan:
            return
        if plan.max_storage_gb and current_storage_gb > plan.max_storage_gb:
            raise ValueError(f"Storage limit exceeded: {current_storage_gb} > {plan.max_storage_gb}")

    def get_usage_summary(self, instance_id: UUID) -> dict:
        instance, plan = self._get_instance_and_plan(instance_id)
        if not instance:
            raise ValueError("Instance not found")

        now = datetime.now(UTC)
        period_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        usage_svc = UsageService(self.db)
        current_users = usage_svc.get_current_period_total(instance_id, UsageMetric.active_users, period_start)
        current_storage_gb = usage_svc.get_current_period_total(instance_id, UsageMetric.storage_gb, period_start)

        max_users = plan.max_users if plan else 0
        max_storage_gb = plan.max_storage_gb if plan else 0

        return {
            "plan_name": plan.name if plan else None,
            "max_users": max_users,
            "max_storage_gb": max_storage_gb,
            "current_users": current_users,
            "current_storage_gb": current_storage_gb,
            "users_percent": _percent(current_users, max_users),
            "storage_percent": _percent(current_storage_gb, max_storage_gb),
            "users_over_limit": bool(max_users and current_users > max_users),
            "storage_over_limit": bool(max_storage_gb and current_storage_gb > max_storage_gb),
        }

    @staticmethod
    def serialize_violation(violation: PlanViolation) -> dict:
        return {
            "kind": violation.kind,
            "message": violation.message,
            "current": violation.current,
            "limit": violation.limit,
            "percent": violation.percent,
        }

    def check_and_fire_alerts(self, instance_id: UUID) -> None:
        instance, plan = self._get_instance_and_plan(instance_id)
        if not instance or not plan:
            return
        summary = self.get_usage_summary(instance_id)

        self._notify_threshold(
            instance,
            "users",
            summary.get("users_percent"),
            summary.get("current_users"),
            summary.get("max_users"),
        )
        self._notify_threshold(
            instance,
            "storage",
            summary.get("storage_percent"),
            summary.get("current_storage_gb"),
            summary.get("max_storage_gb"),
        )

    def _notify_threshold(
        self,
        instance: Instance,
        label: str,
        percent: float | None,
        current: float | int | None,
        limit: float | int | None,
    ) -> None:
        if not percent or not limit:
            return

        threshold = None
        severity = NotificationSeverity.info
        if percent >= 1.0:
            threshold = 100
            severity = NotificationSeverity.critical
        elif percent >= 0.9:
            threshold = 90
            severity = NotificationSeverity.warning
        elif percent >= 0.8:
            threshold = 80
            severity = NotificationSeverity.info

        if threshold is None:
            return

        title = f"Plan limit {threshold}%: {instance.org_code}"
        message = f"{label} usage at {int(percent * 100)}% ({current}/{limit})."

        if self._recent_notification_exists(title, within_hours=24):
            return

        from app.services.notification_service import NotificationService

        NotificationService(self.db).create_for_admins(
            category=NotificationCategory.system,
            severity=severity,
            title=title,
            message=message,
            link=f"/instances/{instance.instance_id}",
        )

    def _recent_notification_exists(self, title: str, within_hours: int = 24) -> bool:
        cutoff = datetime.now(UTC) - timedelta(hours=within_hours)
        stmt = select(Notification).where(
            Notification.title == title,
            Notification.created_at >= cutoff,
        )
        return self.db.scalar(stmt) is not None

    def _get_instance_and_plan(self, instance_id: UUID) -> tuple[Instance | None, Plan | None]:
        instance = self.db.get(Instance, instance_id)
        if not instance:
            return None, None
        if not instance.plan_id:
            return instance, None
        plan = self.db.get(Plan, instance.plan_id)
        return instance, plan

    def _get_enabled_module_slugs(self, instance_id: UUID) -> list[str]:
        stmt = (
            select(Module.slug)
            .join(InstanceModule, InstanceModule.module_id == Module.module_id)
            .where(InstanceModule.instance_id == instance_id)
            .where(InstanceModule.enabled.is_(True))
        )
        slugs = [row[0] for row in self.db.execute(stmt).all()]

        # Include core modules (implicitly enabled)
        core_stmt = select(Module.slug).where(Module.is_core.is_(True))
        slugs.extend([row[0] for row in self.db.execute(core_stmt).all()])
        return sorted(set(slugs))


def _percent(current: float | int, limit: float | int) -> float | None:
    if not limit:
        return None
    try:
        return float(current) / float(limit)
    except ZeroDivisionError:
        return None


def _is_truthy(value: str | None) -> bool:
    if value is None:
        return False
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _limit_violation(
    *,
    kind: str,
    label: str,
    current: float | int,
    limit: float | int | None,
) -> PlanViolation | None:
    if not limit:
        return None
    if current <= limit:
        return None
    return PlanViolation(
        kind=kind,
        message=f"{label} exceeds plan limit ({current} > {limit})",
        current=current,
        limit=limit,
        percent=_percent(current, limit),
    )
