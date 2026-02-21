"""Notification Channel — external dispatch targets for notifications."""

from __future__ import annotations

import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class ChannelType(str, enum.Enum):
    email = "email"
    slack = "slack"
    telegram = "telegram"


class NotificationChannel(Base):
    __tablename__ = "notification_channels"

    channel_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    person_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("people.id"), nullable=True, index=True
    )
    channel_type: Mapped[ChannelType] = mapped_column(Enum(ChannelType, name="channeltype"), nullable=False)
    label: Mapped[str] = mapped_column(String(120), nullable=False)
    config_encrypted: Mapped[str | None] = mapped_column(Text)
    events: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )
