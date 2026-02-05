"""
Cleanup Task — Periodically clean up expired sessions and old health checks.
"""
import logging
from datetime import datetime, timezone

from celery import shared_task
from sqlalchemy import delete, select

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def cleanup_expired_sessions() -> dict:
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


@shared_task
def cleanup_old_health_checks() -> dict:
    """Prune old health checks for all running instances."""
    with SessionLocal() as db:
        from app.services.health_service import HealthService

        svc = HealthService(db)
        pruned = svc.prune_all_old_checks()

    logger.info("Pruned %d old health checks", pruned)
    return {"pruned_health_checks": pruned}
