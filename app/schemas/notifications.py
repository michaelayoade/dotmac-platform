from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.notification import NotificationCategory, NotificationSeverity


class NotificationRead(BaseModel):
    notification_id: UUID
    category: NotificationCategory
    severity: NotificationSeverity
    title: str
    message: str
    link: str | None = None
    is_read: bool
    created_at: datetime | None = None


class NotificationListResponse(BaseModel):
    unread_count: int
    notifications: list[NotificationRead]


class NotificationUnreadCountResponse(BaseModel):
    unread_count: int
