"""OTel Export Task -- Celery task to push metrics to tenant OTLP endpoints."""

from __future__ import annotations

import logging

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def export_otel_metrics() -> dict:
    """Export metrics for all active OTel configurations."""
    db = SessionLocal()
    try:
        from app.services.otel_export_service import OtelExportService

        svc = OtelExportService(db)
        result = svc.export_all_active()
        db.commit()
        logger.info("OTel export completed: %s", result)
        return result
    except Exception:
        logger.exception("OTel export task failed")
        db.rollback()
        return {"error": "task failed"}
    finally:
        db.close()
