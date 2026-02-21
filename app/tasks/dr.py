"""Disaster Recovery Tasks — Celery tasks for DR operations and scheduled backups."""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from uuid import UUID

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


def _cron_field_matches(field: str, value: int) -> bool:
    """Check if a single cron field matches the given value."""
    for part in field.split(","):
        part = part.strip()
        step = 1
        if "/" in part:
            base, step_s = part.split("/", 1)
            step = int(step_s)
            part = base
        if part == "*":
            if step == 1 or value % step == 0:
                return True
            continue
        if "-" in part:
            start, end = part.split("-", 1)
            if int(start) <= value <= int(end) and (value - int(start)) % step == 0:
                return True
            continue
        if int(part) == value:
            return True
    return False


def _cron_matches(cron_expr: str, dt: datetime) -> bool:
    """Check if a datetime matches all five cron fields (minute, hour, dom, month, dow)."""
    parts = cron_expr.strip().split()
    if len(parts) != 5:
        return False
    minute, hour, dom, month, dow = parts
    # isoweekday: Mon=1..Sun=7; cron: Sun=0, Mon=1..Sat=6
    cron_dow = dt.isoweekday() % 7
    return (
        _cron_field_matches(minute, dt.minute)
        and _cron_field_matches(hour, dt.hour)
        and _cron_field_matches(dom, dt.day)
        and _cron_field_matches(month, dt.month)
        and _cron_field_matches(dow, cron_dow)
    )


def _cron_is_due(cron_expr: str, last_run: datetime | None, now: datetime) -> bool:
    """Check if a cron expression is due for execution.

    Returns True when ``now`` matches the cron pattern AND the plan hasn't
    already run in the current minute (prevents double-dispatch when the
    periodic check runs multiple times within the same minute).
    """
    parts = cron_expr.strip().split()
    if len(parts) != 5:
        logger.warning("Invalid cron expression %r, skipping", cron_expr)
        return False

    if not _cron_matches(cron_expr, now):
        return False

    # Never run before — it's due
    if last_run is None:
        return True

    # Already ran in this exact calendar minute — skip
    if last_run.replace(second=0, microsecond=0) == now.replace(second=0, microsecond=0):
        return False

    return True


@shared_task(bind=True, max_retries=2, default_retry_delay=120)
def run_scheduled_backups(self) -> dict:
    """Periodic task: check all active DR plans and trigger backups that are due.

    This task is designed to run every minute via Celery beat.  For each active
    DR plan whose cron schedule matches, it dispatches an individual
    ``run_dr_backup`` task so that backups execute concurrently.
    """
    now = datetime.now(UTC)
    dispatched: list[str] = []
    skipped = 0
    errors = 0

    with SessionLocal() as db:
        from sqlalchemy import select

        from app.models.dr_plan import DisasterRecoveryPlan

        stmt = select(DisasterRecoveryPlan).where(DisasterRecoveryPlan.is_active.is_(True))
        plans = list(db.scalars(stmt).all())

    for plan in plans:
        try:
            if _cron_is_due(plan.backup_schedule_cron, plan.last_backup_at, now):
                run_dr_backup.delay(str(plan.dr_plan_id))
                dispatched.append(str(plan.dr_plan_id))
            else:
                skipped += 1
        except Exception:
            logger.exception("Error checking DR plan %s", plan.dr_plan_id)
            errors += 1

    logger.info(
        "Scheduled backup check: %d dispatched, %d skipped, %d errors",
        len(dispatched),
        skipped,
        errors,
    )
    return {"dispatched": dispatched, "skipped": skipped, "errors": errors}


@shared_task(bind=True, max_retries=2, default_retry_delay=120)
def prune_expired_backups(self) -> dict:
    """Periodic task: prune old backups beyond retention for all instances with DR plans."""
    pruned_total = 0

    with SessionLocal() as db:
        from sqlalchemy import select

        from app.models.dr_plan import DisasterRecoveryPlan
        from app.services.backup_service import BackupService

        stmt = select(DisasterRecoveryPlan).where(DisasterRecoveryPlan.is_active.is_(True))
        plans = list(db.scalars(stmt).all())

        svc = BackupService(db)
        for plan in plans:
            try:
                pruned = svc.prune_old_backups(plan.instance_id, keep=plan.retention_days)
                pruned_total += pruned
            except Exception:
                logger.exception("Error pruning backups for instance %s", plan.instance_id)

        db.commit()

    logger.info("Pruned %d expired backups across %d plans", pruned_total, len(plans))
    return {"pruned": pruned_total, "plans_checked": len(plans)}


@shared_task
def run_dr_backup(dr_plan_id: str) -> dict:
    with SessionLocal() as db:
        from app.services.dr_service import DisasterRecoveryService

        backup = DisasterRecoveryService(db).run_scheduled_backup(UUID(dr_plan_id))
        db.commit()
        return {"backup_id": str(backup.backup_id), "status": backup.status.value}


@shared_task
def run_dr_test(dr_plan_id: str) -> dict:
    with SessionLocal() as db:
        from app.services.dr_service import DisasterRecoveryService

        result = DisasterRecoveryService(db).test_dr(UUID(dr_plan_id))
        db.commit()
        return result


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
        db.commit()
        return {"instance_id": str(instance.instance_id)}
