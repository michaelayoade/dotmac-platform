"""
Deploy Task — Celery task to run the 10-step deployment pipeline.
"""
import logging

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def deploy_instance(instance_id: str, deployment_id: str, admin_password: str) -> dict:
    """Run the full deployment pipeline for an instance."""
    logger.info(
        "Starting deployment %s for instance %s", deployment_id, instance_id
    )

    with SessionLocal() as db:
        from app.services.deploy_service import DeployService
        from uuid import UUID

        svc = DeployService(db)
        result = svc.run_deployment(
            UUID(instance_id), deployment_id, admin_password
        )

    logger.info("Deployment %s complete: %s", deployment_id, result.get("success"))
    return result
