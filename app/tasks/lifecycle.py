"""
Lifecycle Tasks — Celery tasks for trial expiry and domain cert monitoring.
"""

import logging

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def check_trial_expiry(self) -> int:
    """Check for expired trial instances and suspend them."""
    logger.info("Checking for expired trials")
    with SessionLocal() as db:
        from app.services.lifecycle_service import LifecycleService

        svc = LifecycleService(db)
        expired = svc.check_expired_trials()
        db.commit()
        count = len(expired)
        if count:
            logger.info("Suspended %d expired trial instances", count)
        return count


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def check_ssl_expiry(self) -> int:
    """Monitor SSL certificate expiry — Caddy renews automatically.

    Caddy handles Let's Encrypt renewal, so this task only logs warnings
    for domains whose tracked expiry dates are approaching.  This provides
    an early alert if Caddy's auto-renewal has silently failed.
    """
    logger.info("Checking SSL certificate expiry")
    with SessionLocal() as db:
        from app.services.domain_service import DomainService

        svc = DomainService(db)
        expiring = svc.get_expiring_certs(days_until_expiry=14)
        for domain in expiring:
            logger.warning(
                "SSL certificate expiring soon for %s (expires %s) — verify Caddy auto-renewal",
                domain.domain,
                domain.ssl_expires_at,
            )
        if expiring:
            logger.warning("%d domain(s) have certificates expiring within 14 days", len(expiring))
        return len(expiring)
