"""Upgrade Tasks — Celery tasks for app upgrades."""

import logging
from uuid import UUID

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def run_upgrade(upgrade_id: str) -> dict:
    with SessionLocal() as db:
        from app.services.upgrade_service import UpgradeService

        return UpgradeService(db).run_upgrade(UUID(upgrade_id))
