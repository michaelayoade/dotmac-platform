"""Clone Tasks — Celery tasks for instance cloning."""

import logging
from uuid import UUID

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def run_clone_instance(clone_id: str) -> dict:
    logger.info("Starting clone %s", clone_id)
    with SessionLocal() as db:
        from app.services.clone_service import CloneService

        result = CloneService(db).run_clone(UUID(clone_id))
        return result
