"""Usage Metering — tracks resource usage per instance for billing."""
import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class UsageMetric(str, enum.Enum):
    active_users = "active_users"
    storage_gb = "storage_gb"
    api_calls = "api_calls"
    cpu_hours = "cpu_hours"
    bandwidth_gb = "bandwidth_gb"


class UsageRecord(Base):
    __tablename__ = "usage_records"
    __table_args__ = (
        UniqueConstraint("instance_id", "metric", "period_start", name="uq_usage_instance_metric_period"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    instance_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=False, index=True
    )
    metric: Mapped[UsageMetric] = mapped_column(Enum(UsageMetric), nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
