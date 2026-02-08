"""
Health Task — Celery beat task to poll all running instances.
"""

import logging

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def poll_instance_health(self) -> dict:
    """Poll /health for all running instances."""
    logger.info("Polling instance health")

    with SessionLocal() as db:
        from app.services.health_service import HealthService

        svc = HealthService(db)
        results = svc.poll_all_running()
        svc.prune_all_old_checks()
        db.commit()

    logger.info(
        "Health poll complete: %s healthy, %s unhealthy, %s unreachable (of %s)",
        results["healthy"],
        results["unhealthy"],
        results["unreachable"],
        results["total"],
    )
    return results
