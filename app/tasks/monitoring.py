"""
Monitoring Tasks — Celery tasks for alerts, usage metering, and drift detection.
"""
import logging

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def evaluate_alert_rules() -> int:
    """Evaluate all alert rules against latest health data."""
    logger.info("Evaluating alert rules")
    with SessionLocal() as db:
        from app.services.alert_service import AlertService

        svc = AlertService(db)
        count = svc.evaluate_all()
        if count:
            logger.info("Fired %d alerts", count)
        return count


@shared_task
def collect_usage_metrics() -> int:
    """Collect usage metrics for all running instances."""
    logger.info("Collecting usage metrics")
    with SessionLocal() as db:
        from app.services.usage_service import UsageService

        svc = UsageService(db)
        count = svc.collect_all_usage()
        logger.info("Collected usage for %d instances", count)
        return count


@shared_task
def detect_config_drift() -> int:
    """Run drift detection across all running instances."""
    logger.info("Running config drift detection")
    with SessionLocal() as db:
        from app.services.drift_service import DriftService

        svc = DriftService(db)
        drift_count = svc.detect_all_drift()
        if drift_count:
            logger.warning("Config drift detected in %d instances", drift_count)
        return drift_count
