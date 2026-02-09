"""Disaster Recovery Tasks — Celery tasks for DR operations."""

import logging
from uuid import UUID

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def run_dr_backup(dr_plan_id: str) -> dict:
    with SessionLocal() as db:
        from app.services.dr_service import DisasterRecoveryService

        backup = DisasterRecoveryService(db).run_scheduled_backup(UUID(dr_plan_id))
        return {"backup_id": str(backup.backup_id), "status": backup.status.value}


@shared_task
def run_dr_test(dr_plan_id: str) -> dict:
    with SessionLocal() as db:
        from app.services.dr_service import DisasterRecoveryService

        return DisasterRecoveryService(db).test_dr(UUID(dr_plan_id))


@shared_task
def run_dr_restore(
    backup_id: str,
    target_server_id: str,
    new_org_code: str,
    new_org_name: str | None = None,
    admin_password: str | None = None,
) -> dict:
    with SessionLocal() as db:
        from app.services.dr_service import DisasterRecoveryService

        instance = DisasterRecoveryService(db).restore_to_server(
            UUID(backup_id),
            UUID(target_server_id),
            new_org_code,
            new_org_name=new_org_name,
            admin_password=admin_password,
        )
        return {"instance_id": str(instance.instance_id)}
