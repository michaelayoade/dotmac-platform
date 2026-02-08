"""Webhook delivery tasks."""
import logging
from uuid import UUID

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def deliver_webhook(self, delivery_id: str) -> dict:
    """Deliver a webhook with retries handled by Celery."""
    with SessionLocal() as db:
        from app.services.webhook_service import WebhookService, MAX_RETRIES

        svc = WebhookService(db)
        attempt = self.request.retries + 1
        ok = svc.attempt_delivery_by_id(UUID(delivery_id), attempt)
        db.commit()
        if ok:
            return {"success": True, "delivery_id": delivery_id}
        if attempt < MAX_RETRIES:
            raise self.retry()
        return {"success": False, "delivery_id": delivery_id}
