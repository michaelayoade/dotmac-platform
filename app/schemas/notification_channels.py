"""Pydantic schemas for notification channels."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.notification_channel import ChannelType


class NotificationChannelCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    channel_type: ChannelType
    label: str = Field(..., min_length=1, max_length=120)
    config: dict[str, str]
    events: dict[str, list[str]] | None = None

    @field_validator("config")
    @classmethod
    def config_not_empty(cls, v: dict[str, str]) -> dict[str, str]:
        if not v:
            raise ValueError("Config must not be empty")
        return v


class NotificationChannelUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    label: str | None = Field(None, min_length=1, max_length=120)
    config: dict[str, str] | None = None
    events: dict[str, list[str]] | None = None
    is_active: bool | None = None


class NotificationChannelRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    channel_id: UUID
    channel_type: ChannelType
    label: str
    config_masked: str = ""
    events: dict[str, list[str]] | None = None
    is_active: bool
    created_at: datetime | None = None
