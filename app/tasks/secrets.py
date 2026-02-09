"""Secret Rotation Tasks — Celery tasks for rotating instance secrets."""

from __future__ import annotations

import logging
from uuid import UUID

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def rotate_secret_task(
    instance_id: str,
    secret_name: str,
    rotated_by: str | None = None,
    confirm_destructive: bool = False,
) -> dict:
    with SessionLocal() as db:
        from app.services.secret_rotation_service import SecretRotationService

        svc = SecretRotationService(db)
        log = svc.rotate_secret(
            UUID(instance_id),
            secret_name,
            rotated_by=rotated_by,
            confirm_destructive=confirm_destructive,
        )
        db.commit()
        return {"rotation_id": log.id, "status": log.status.value}


@shared_task
def rotate_all_secrets_task(
    instance_id: str,
    rotated_by: str | None = None,
    confirm_destructive: bool = False,
) -> dict:
    with SessionLocal() as db:
        from app.services.secret_rotation_service import SecretRotationService

        svc = SecretRotationService(db)
        logs = svc.rotate_all(UUID(instance_id), rotated_by=rotated_by, confirm_destructive=confirm_destructive)
        db.commit()
        return {"rotations": [{"rotation_id": log.id, "status": log.status.value} for log in logs]}
