"""Celery tasks for processing GitHub webhook events."""

from __future__ import annotations

import json
import logging

from celery import shared_task

from app.db import SessionLocal

logger = logging.getLogger(__name__)


@shared_task
def process_github_push(repo_id: str, payload_json: str) -> dict[str, object]:
    """Process a GitHub push event asynchronously."""
    from uuid import UUID

    logger.info("Processing GitHub push for repo %s", repo_id)

    with SessionLocal() as db:
        from app.services.git_repo_service import GitRepoService
        from app.services.github_webhook_service import GitHubWebhookService

        repo = GitRepoService(db).get_by_id(UUID(repo_id))
        if not repo:
            logger.warning("Repo %s not found", repo_id)
            return {"success": False, "error": "Repo not found"}

        try:
            payload = json.loads(payload_json)
        except (json.JSONDecodeError, TypeError) as exc:
            logger.warning("Invalid payload JSON for repo %s: %s", repo_id, exc)
            return {"success": False, "error": "Invalid payload"}

        svc = GitHubWebhookService(db)
        log = svc.process_push_event(repo, payload)
        db.commit()

        return {
            "success": True,
            "log_id": str(log.log_id),
            "status": log.status,
            "deployments_triggered": log.deployments_triggered,
        }


@shared_task(bind=True, max_retries=2, default_retry_delay=10)
def update_github_commit_status(
    self: object,
    repo_id: str,
    commit_sha: str,
    state: str,
    description: str,
    target_url: str | None = None,
) -> dict[str, object]:
    """Post a commit status back to GitHub."""
    from uuid import UUID

    logger.info("Posting commit status %s for %s/%s", state, repo_id, commit_sha[:12])

    with SessionLocal() as db:
        from app.services.git_repo_service import GitRepoService
        from app.services.github_webhook_service import GitHubWebhookService

        repo = GitRepoService(db).get_by_id(UUID(repo_id))
        if not repo:
            return {"success": False, "error": "Repo not found"}

        svc = GitHubWebhookService(db)
        ok = svc.update_commit_status(repo, commit_sha, state, description, target_url)

        if not ok:
            try:
                self.retry()  # type: ignore[attr-defined]
            except Exception:
                logger.warning("Exhausted retries for commit status %s/%s", repo_id, commit_sha[:12])

        return {"success": ok}
