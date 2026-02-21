"""Celery tasks for dispatching notifications to external channels."""

from __future__ import annotations

import logging

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def dispatch_notification(notification_id: str) -> dict[str, object]:
    """Load a notification and dispatch to all matching channels."""
    from uuid import UUID

    logger.info("Dispatching notification %s", notification_id)

    with SessionLocal() as db:
        from app.models.notification import Notification
        from app.services.notification_dispatch_service import NotificationDispatchService

        notification = db.get(Notification, UUID(notification_id))
        if not notification:
            logger.warning("Notification %s not found", notification_id)
            return {"success": False, "error": "Not found"}

        svc = NotificationDispatchService(db)
        count = svc.dispatch(notification)
        return {"success": True, "channels_queued": count}


@shared_task(bind=True, max_retries=2, default_retry_delay=10)
def dispatch_to_channel(
    self: object,
    notification_id: str,
    channel_id: str,
) -> dict[str, object]:
    """Dispatch a single notification to a specific channel."""
    from uuid import UUID

    logger.info("Dispatching notification %s to channel %s", notification_id, channel_id)

    with SessionLocal() as db:
        from app.services.notification_dispatch_service import NotificationDispatchService

        svc = NotificationDispatchService(db)
        ok = svc.dispatch_to_channel(UUID(notification_id), UUID(channel_id))

        if not ok:
            try:
                self.retry()  # type: ignore[attr-defined]
            except Exception:
                logger.warning(
                    "Exhausted retries for notification %s -> channel %s",
                    notification_id,
                    channel_id,
                )

        return {"success": ok}
