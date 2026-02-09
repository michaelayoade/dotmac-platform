"""Notification Service — create and manage in-app notifications."""

from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import func, or_, select, update
from sqlalchemy.orm import Session

from app.models.notification import (
    Notification,
    NotificationCategory,
    NotificationSeverity,
)

logger = logging.getLogger(__name__)


class NotificationService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        person_id: UUID,
        category: NotificationCategory,
        severity: NotificationSeverity,
        title: str,
        message: str,
        link: str | None = None,
    ) -> Notification:
        """Create a notification for a specific person."""
        n = Notification(
            person_id=person_id,
            category=category,
            severity=severity,
            title=title[:200],
            message=message,
            link=link,
        )
        self.db.add(n)
        self.db.flush()
        return n

    def create_for_admins(
        self,
        category: NotificationCategory,
        severity: NotificationSeverity,
        title: str,
        message: str,
        link: str | None = None,
    ) -> Notification:
        """Create a broadcast notification (person_id=NULL → visible to all admins)."""
        n = Notification(
            person_id=None,
            category=category,
            severity=severity,
            title=title[:200],
            message=message,
            link=link,
        )
        self.db.add(n)
        self.db.flush()
        return n

    def get_unread_count(self, person_id: UUID) -> int:
        """Count unread notifications for a person, including broadcasts."""
        stmt = select(func.count(Notification.notification_id)).where(
            Notification.is_read.is_(False),
            or_(Notification.person_id == person_id, Notification.person_id.is_(None)),
        )
        return self.db.scalar(stmt) or 0

    def get_recent(
        self,
        person_id: UUID,
        limit: int = 25,
        offset: int = 0,
    ) -> list[Notification]:
        """Get recent notifications for a person, including broadcasts."""
        stmt = (
            select(Notification)
            .where(
                or_(Notification.person_id == person_id, Notification.person_id.is_(None)),
            )
            .order_by(Notification.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(stmt).all())

    def mark_read(self, notification_id: UUID, person_id: UUID) -> None:
        """Mark a single notification as read. Validates ownership or broadcast."""
        n = self.db.get(Notification, notification_id)
        if not n:
            raise ValueError("Notification not found")
        if n.person_id is not None and n.person_id != person_id:
            raise ValueError("Not authorized to mark this notification")
        n.is_read = True
        self.db.flush()

    def mark_all_read(self, person_id: UUID) -> int:
        """Mark all unread notifications as read for a person (including broadcasts)."""
        stmt = (
            update(Notification)
            .where(
                Notification.is_read.is_(False),
                or_(Notification.person_id == person_id, Notification.person_id.is_(None)),
            )
            .values(is_read=True)
        )
        result = self.db.execute(stmt)
        self.db.flush()
        return result.rowcount  # type: ignore[return-value]
