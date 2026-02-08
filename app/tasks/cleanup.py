"""
Cleanup Task — Periodically clean up expired sessions and old health checks.
"""
import logging
from datetime import datetime, timedelta, timezone

from celery import shared_task
from sqlalchemy import delete, select

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def cleanup_expired_sessions(self) -> dict:
    """Remove expired and revoked sessions older than 30 days."""
    from app.models.auth import Session as AuthSession, SessionStatus

    cutoff = datetime.now(timezone.utc)

    with SessionLocal() as db:
        # Delete expired sessions
        stmt = delete(AuthSession).where(
            AuthSession.expires_at < cutoff,
            AuthSession.status.in_([SessionStatus.expired, SessionStatus.revoked]),
        )
        result = db.execute(stmt)
        count = result.rowcount
        db.commit()

    logger.info("Cleaned up %d expired/revoked sessions", count)
    return {"deleted_sessions": count}


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def cleanup_old_health_checks(self) -> dict:
    """Prune old health checks for all running instances."""
    with SessionLocal() as db:
        from app.services.health_service import HealthService

        svc = HealthService(db)
        pruned = svc.prune_all_old_checks()
        db.commit()

    logger.info("Pruned %d old health checks", pruned)
    return {"pruned_health_checks": pruned}


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def cleanup_old_drift_reports(self) -> dict:
    """Delete drift reports older than 30 days."""
    from app.models.drift_report import DriftReport

    cutoff = datetime.now(timezone.utc) - timedelta(days=30)

    with SessionLocal() as db:
        stmt = delete(DriftReport).where(DriftReport.detected_at < cutoff)
        result = db.execute(stmt)
        count = result.rowcount
        db.commit()

    logger.info("Cleaned up %d old drift reports", count)
    return {"deleted_drift_reports": count}


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def cleanup_old_usage_records(self) -> dict:
    """Delete usage records older than 90 days."""
    from app.models.usage_record import UsageRecord

    cutoff = datetime.now(timezone.utc) - timedelta(days=90)

    with SessionLocal() as db:
        stmt = delete(UsageRecord).where(UsageRecord.created_at < cutoff)
        result = db.execute(stmt)
        count = result.rowcount
        db.commit()

    logger.info("Cleaned up %d old usage records", count)
    return {"deleted_usage_records": count}


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def cleanup_old_webhook_deliveries(self) -> dict:
    """Delete webhook deliveries older than 14 days."""
    from app.models.webhook import WebhookDelivery

    cutoff = datetime.now(timezone.utc) - timedelta(days=14)

    with SessionLocal() as db:
        stmt = delete(WebhookDelivery).where(WebhookDelivery.created_at < cutoff)
        result = db.execute(stmt)
        count = result.rowcount
        db.commit()

    logger.info("Cleaned up %d old webhook deliveries", count)
    return {"deleted_webhook_deliveries": count}


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def cleanup_stuck_deployments(self, max_age_minutes: int = 60) -> dict:
    """Mark stuck deploying instances as error."""
    with SessionLocal() as db:
        from app.services.deploy_service import DeployService

        svc = DeployService(db)
        marked = svc.mark_stuck_deployments(max_age_minutes=max_age_minutes)
        db.commit()

    logger.info("Marked %d stuck deployments as error", marked)
    return {"marked_stuck_deployments": marked}
