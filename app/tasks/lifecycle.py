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
    """Check for SSL certificates expiring soon and attempt renewal."""
    logger.info("Checking SSL certificate expiry")
    with SessionLocal() as db:
        from app.services.domain_service import DomainService

        svc = DomainService(db)
        expiring = svc.get_expiring_certs(days_until_expiry=14)
        renewed = 0
        for domain in expiring:
            try:
                result = svc.provision_ssl(domain.instance_id, domain.domain_id)
                if result.get("success"):
                    renewed += 1
            except Exception:
                logger.exception("SSL renewal failed for %s", domain.domain)
        db.commit()
        logger.info("Renewed %d/%d expiring certificates", renewed, len(expiring))
        return renewed
