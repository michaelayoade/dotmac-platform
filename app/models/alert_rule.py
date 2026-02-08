"""Alert Rules and Events — configurable threshold-based alerting."""

from __future__ import annotations

import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.db import Base


class AlertMetric(str, enum.Enum):
    cpu_percent = "cpu_percent"
    memory_mb = "memory_mb"
    db_size_mb = "db_size_mb"
    active_connections = "active_connections"
    response_ms = "response_ms"
    health_failures = "health_failures"
    disk_usage_mb = "disk_usage_mb"


class AlertOperator(str, enum.Enum):
    gt = "gt"  # greater than
    gte = "gte"
    lt = "lt"
    lte = "lte"
    eq = "eq"


class AlertChannel(str, enum.Enum):
    webhook = "webhook"
    email = "email"
    log = "log"


class AlertRule(Base):
    __tablename__ = "alert_rules"

    rule_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    metric: Mapped[AlertMetric] = mapped_column(Enum(AlertMetric), nullable=False)
    operator: Mapped[AlertOperator] = mapped_column(Enum(AlertOperator), nullable=False)
    threshold: Mapped[float] = mapped_column(Float, nullable=False)
    channel: Mapped[AlertChannel] = mapped_column(Enum(AlertChannel), default=AlertChannel.webhook)
    channel_config: Mapped[dict | None] = mapped_column(JSON)
    # Nullable: if null, applies to all instances
    instance_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=True, index=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    # Cooldown: don't re-trigger for N minutes after firing
    cooldown_minutes: Mapped[int] = mapped_column(Integer, default=15)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    events: Mapped[list[AlertEvent]] = relationship("AlertEvent", back_populates="rule")


class AlertEvent(Base):
    __tablename__ = "alert_events"

    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rule_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("alert_rules.rule_id"), nullable=False, index=True
    )
    instance_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=True, index=True
    )
    metric_value: Mapped[float] = mapped_column(Float, nullable=False)
    threshold: Mapped[float] = mapped_column(Float, nullable=False)
    triggered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    notified: Mapped[bool] = mapped_column(Boolean, default=False)

    rule: Mapped[AlertRule] = relationship("AlertRule", back_populates="events")
