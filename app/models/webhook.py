"""Webhook models — endpoints and delivery log."""
from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class WebhookEvent(str, enum.Enum):
    deploy_started = "deploy_started"
    deploy_success = "deploy_success"
    deploy_failed = "deploy_failed"
    health_changed = "health_changed"
    trial_expired = "trial_expired"
    instance_suspended = "instance_suspended"
    instance_archived = "instance_archived"
    backup_completed = "backup_completed"
    alert_triggered = "alert_triggered"


class WebhookEndpoint(Base):
    __tablename__ = "webhook_endpoints"

    endpoint_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    url: Mapped[str] = mapped_column(String(1024), nullable=False)
    secret: Mapped[str | None] = mapped_column(String(256))
    description: Mapped[str | None] = mapped_column(String(500))
    events: Mapped[list[str]] = mapped_column(JSON, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    # Optional: scope to a specific instance
    instance_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instances.instance_id"), nullable=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    deliveries: Mapped[list[WebhookDelivery]] = relationship(
        "WebhookDelivery", back_populates="endpoint"
    )


class DeliveryStatus(str, enum.Enum):
    pending = "pending"
    success = "success"
    failed = "failed"


class WebhookDelivery(Base):
    __tablename__ = "webhook_deliveries"

    delivery_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    endpoint_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("webhook_endpoints.endpoint_id"), nullable=False, index=True
    )
    event: Mapped[str] = mapped_column(String(60), nullable=False)
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    status: Mapped[DeliveryStatus] = mapped_column(
        Enum(DeliveryStatus), default=DeliveryStatus.pending
    )
    response_code: Mapped[int | None] = mapped_column(Integer)
    response_body: Mapped[str | None] = mapped_column(Text)
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    endpoint: Mapped[WebhookEndpoint] = relationship(
        "WebhookEndpoint", back_populates="deliveries"
    )
