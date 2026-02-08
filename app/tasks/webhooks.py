"""Webhook delivery tasks."""

import logging
from uuid import UUID

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)

_MAX_RETRIES = 3


@shared_task(bind=True, max_retries=_MAX_RETRIES, default_retry_delay=5)
def deliver_webhook(self, delivery_id: str) -> dict:
    """Deliver a webhook with retries handled by Celery."""
    from app.services.webhook_service import WebhookService

    with SessionLocal() as db:
        svc = WebhookService(db)
        attempt = self.request.retries + 1
        ok = svc.attempt_delivery_by_id(UUID(delivery_id), attempt)
        db.commit()
        if ok:
            return {"success": True, "delivery_id": delivery_id}
        if attempt < _MAX_RETRIES:
            raise self.retry()
        return {"success": False, "delivery_id": delivery_id}
