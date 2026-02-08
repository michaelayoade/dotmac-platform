"""Usage Metering Service — record and query per-tenant usage for billing."""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.health_check import HealthCheck
from app.models.instance import Instance, InstanceStatus
from app.models.usage_record import UsageMetric, UsageRecord

logger = logging.getLogger(__name__)


class UsageService:
    def __init__(self, db: Session):
        self.db = db

    def record(
        self,
        instance_id: UUID,
        metric: UsageMetric,
        value: float,
        period_start: datetime,
        period_end: datetime,
    ) -> UsageRecord:
        # Upsert: update existing record for same (instance, metric, period_start)
        stmt = select(UsageRecord).where(
            UsageRecord.instance_id == instance_id,
            UsageRecord.metric == metric,
            UsageRecord.period_start == period_start,
        )
        existing = self.db.scalar(stmt)
        if existing:
            existing.value = value
            existing.period_end = period_end
            self.db.flush()
            return existing

        rec = UsageRecord(
            instance_id=instance_id,
            metric=metric,
            value=value,
            period_start=period_start,
            period_end=period_end,
        )
        self.db.add(rec)
        self.db.flush()
        return rec

    def get_usage(
        self,
        instance_id: UUID,
        metric: UsageMetric | None = None,
        *,
        since: datetime | None = None,
        limit: int = 100,
    ) -> list[UsageRecord]:
        stmt = select(UsageRecord).where(UsageRecord.instance_id == instance_id)
        if metric:
            stmt = stmt.where(UsageRecord.metric == metric)
        if since:
            stmt = stmt.where(UsageRecord.period_start >= since)
        stmt = stmt.order_by(UsageRecord.period_end.desc()).limit(limit)
        return list(self.db.scalars(stmt).all())

    def get_current_period_total(
        self,
        instance_id: UUID,
        metric: UsageMetric,
        period_start: datetime,
    ) -> float:
        stmt = select(func.coalesce(func.sum(UsageRecord.value), 0.0)).where(
            UsageRecord.instance_id == instance_id,
            UsageRecord.metric == metric,
            UsageRecord.period_start >= period_start,
        )
        return self.db.scalar(stmt) or 0.0

    def collect_all_usage(self) -> int:
        """Collect usage metrics for all running instances. Called by Celery task."""
        stmt = select(Instance).where(Instance.status == InstanceStatus.running)
        instances = list(self.db.scalars(stmt).all())
        now = datetime.now(UTC)
        period_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        period_end = now
        count = 0

        for inst in instances:
            try:
                self._collect_for_instance(inst, period_start, period_end)
                count += 1
            except Exception:
                logger.warning("Usage collection failed for %s", inst.org_code, exc_info=True)

        if count:
            self.db.commit()
        return count

    def _collect_for_instance(self, instance: Instance, period_start: datetime, period_end: datetime) -> None:
        """Collect storage usage from latest health check data."""
        # DB size from latest health check
        stmt = (
            select(HealthCheck)
            .where(HealthCheck.instance_id == instance.instance_id)
            .order_by(HealthCheck.checked_at.desc())
            .limit(1)
        )
        latest = self.db.scalar(stmt)
        if latest and latest.db_size_mb is not None:
            self.record(
                instance.instance_id,
                UsageMetric.storage_gb,
                round(latest.db_size_mb / 1024, 3),
                period_start,
                period_end,
            )

    def get_billing_summary(self, instance_id: UUID, period_start: datetime, period_end: datetime) -> dict:
        """Get a billing summary for a period."""
        stmt = select(UsageRecord).where(
            UsageRecord.instance_id == instance_id,
            UsageRecord.period_start >= period_start,
            UsageRecord.period_end <= period_end,
        )
        records = list(self.db.scalars(stmt).all())
        summary: dict[str, float] = {}
        for r in records:
            key = r.metric.value
            summary[key] = summary.get(key, 0) + r.value
        return summary
