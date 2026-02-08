"""
Deploy Task — Celery tasks for deployment pipeline and batch deployments.
"""

import logging

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def deploy_instance(
    instance_id: str,
    deployment_id: str,
    deployment_type: str = "full",
    git_ref: str | None = None,
) -> dict:
    """Run the deployment pipeline for an instance.

    The admin password is retrieved from the DB (stored during
    create_deployment) rather than passed as a task argument,
    to avoid persisting it in the Celery broker.
    """
    logger.info(
        "Starting %s deployment %s for instance %s (git_ref=%s)",
        deployment_type,
        deployment_id,
        instance_id,
        git_ref,
    )

    with SessionLocal() as db:
        from uuid import UUID

        from app.services.deploy_service import DeployService

        svc = DeployService(db)
        admin_password = svc.get_deploy_secret(UUID(instance_id), deployment_id)
        if not admin_password and deployment_type == "full":
            logger.error("No deploy secret found for deployment %s", deployment_id)
            return {"success": False, "error": "Deploy secret not found"}

        result = svc.run_deployment(
            UUID(instance_id),
            deployment_id,
            admin_password or "",
            deployment_type=deployment_type,
            git_ref=git_ref,
        )

    logger.info("Deployment %s complete: %s", deployment_id, result.get("success"))
    return result


@shared_task
def run_batch_deploy(batch_id: str) -> dict:
    """Execute a batch deployment across multiple instances."""
    from uuid import UUID

    logger.info("Starting batch deployment %s", batch_id)

    with SessionLocal() as db:
        from app.services.batch_deploy_service import BatchDeployService
        from app.services.deploy_service import DeployService

        batch_svc = BatchDeployService(db)
        deploy_svc = DeployService(db)

        batch = batch_svc.get_by_id(UUID(batch_id))
        if not batch:
            return {"success": False, "error": "Batch not found"}

        batch_svc.start_batch(UUID(batch_id))
        db.commit()

        for instance_id_str in batch.instance_ids:
            try:
                iid = UUID(instance_id_str)
                deployment_id = deploy_svc.create_deployment(iid)
                db.commit()

                admin_password = deploy_svc.get_deploy_secret(iid, deployment_id)
                result = deploy_svc.run_deployment(iid, deployment_id, admin_password or "")
                batch_svc.update_progress(UUID(batch_id), instance_id_str, result.get("success", False))
                db.commit()

                # For rolling strategy, stop on first failure
                if batch.strategy.value == "rolling" and not result.get("success"):
                    logger.warning(
                        "Batch %s: stopping rolling deploy after failure on %s",
                        batch_id,
                        instance_id_str,
                    )
                    break

            except Exception:
                logger.exception("Batch %s: deployment failed for %s", batch_id, instance_id_str)
                batch_svc.update_progress(UUID(batch_id), instance_id_str, False)
                db.commit()

    logger.info("Batch deployment %s complete", batch_id)
    return {"success": True, "batch_id": batch_id}


@shared_task(bind=True, max_retries=2, default_retry_delay=60)
def check_scheduled_batches(self) -> int:
    """Check for scheduled batches that are due and trigger them."""
    with SessionLocal() as db:
        from app.services.batch_deploy_service import BatchDeployService

        svc = BatchDeployService(db)
        pending = svc.get_pending_batches()
        for batch in pending:
            run_batch_deploy.delay(str(batch.batch_id))
        return len(pending)
