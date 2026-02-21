"""GitHub Webhook Service — validate and process incoming GitHub push events."""

from __future__ import annotations

import hashlib
import hmac
import json
import logging
import urllib.parse
from uuid import UUID

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.git_repository import GitAuthType, GitRepository
from app.models.github_webhook_log import GitHubWebhookLog
from app.models.instance import Instance, InstanceStatus
from app.services.settings_crypto import decrypt_value

logger = logging.getLogger(__name__)


class GitHubWebhookService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def validate_signature(self, repo: GitRepository, body: bytes, signature_header: str) -> bool:
        """Validate X-Hub-Signature-256 HMAC."""
        if not repo.webhook_secret_encrypted:
            return False
        secret = decrypt_value(repo.webhook_secret_encrypted)
        if not secret:
            return False
        if not signature_header.startswith("sha256="):
            return False
        expected = "sha256=" + hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, signature_header)

    def find_repo_by_url(self, clone_url: str) -> GitRepository | None:
        """Find an active git repository by URL (exact or normalized match)."""
        normalized = clone_url.rstrip("/").removesuffix(".git")
        stmt = select(GitRepository).where(GitRepository.is_active.is_(True))
        for repo in self.db.scalars(stmt).all():
            repo_norm = repo.url.rstrip("/").removesuffix(".git")
            if repo_norm == normalized:
                return repo
        return None

    def process_push_event(self, repo: GitRepository, payload: dict[str, object]) -> GitHubWebhookLog:
        """Process a GitHub push event and trigger deployments for matching instances."""
        ref = str(payload.get("ref", ""))
        if not ref.startswith("refs/heads/"):
            log = self._create_log(repo, "push", branch=ref, status="ignored", error_message="Not a branch push")
            return log

        branch = ref.removeprefix("refs/heads/")
        head_commit = payload.get("head_commit") or {}
        commit_sha = str(head_commit.get("id", "")) if isinstance(head_commit, dict) else ""
        sender_info = payload.get("sender") or {}
        sender = str(sender_info.get("login", "")) if isinstance(sender_info, dict) else ""

        # Find instances with auto_deploy on this repo + branch
        stmt = select(Instance).where(
            Instance.git_repo_id == repo.repo_id,
            Instance.git_branch == branch,
            Instance.auto_deploy.is_(True),
            Instance.status.notin_(
                [
                    InstanceStatus.deploying,
                    InstanceStatus.suspended,
                    InstanceStatus.archived,
                ]
            ),
        )
        instances = list(self.db.scalars(stmt).all())

        deploy_count = 0
        for instance in instances:
            try:
                from app.services.deploy_service import DeployService

                svc = DeployService(self.db)
                if svc.has_active_deployment(instance.instance_id):
                    logger.info("Skipping auto-deploy for %s — deployment already active", instance.org_code)
                    continue
                # Use "full" for first deploy (needs bootstrap), "upgrade" for subsequent
                deploy_type = "full" if not instance.deployed_git_ref else "upgrade"
                deployment_id = svc.create_deployment(
                    instance.instance_id,
                    admin_password="",
                    deployment_type=deploy_type,
                    git_ref=branch,
                )
                self.db.flush()

                from app.tasks.deploy import deploy_instance

                deploy_instance.delay(
                    str(instance.instance_id),
                    deployment_id,
                    deployment_type=deploy_type,
                    git_ref=branch,
                )
                deploy_count += 1
                logger.info(
                    "Auto-deploy triggered for %s (deployment %s, branch %s)",
                    instance.org_code,
                    deployment_id,
                    branch,
                )
            except Exception:
                logger.exception("Failed to trigger auto-deploy for %s", instance.org_code)

        summary = json.dumps(
            {
                "ref": ref,
                "head_commit": commit_sha[:12],
                "sender": sender,
                "commits_count": len(commits) if isinstance((commits := payload.get("commits")), list) else 0,
            }
        )[:2000]

        log = self._create_log(
            repo,
            "push",
            branch=branch,
            commit_sha=commit_sha[:64],
            sender=sender[:200] if sender else None,
            payload_summary=summary,
            status="processed",
            deployments_triggered=deploy_count,
        )
        return log

    def update_commit_status(
        self,
        repo: GitRepository,
        sha: str,
        state: str,
        description: str,
        target_url: str | None = None,
    ) -> bool:
        """Post a commit status to GitHub (requires token auth)."""
        if repo.auth_type != GitAuthType.token or not repo.token_encrypted:
            return False

        token = decrypt_value(repo.token_encrypted)
        if not token:
            return False

        owner_repo = _extract_owner_repo(repo.url)
        if not owner_repo:
            logger.warning("Cannot extract owner/repo from URL: %s", repo.url)
            return False

        url = f"https://api.github.com/repos/{owner_repo}/statuses/{sha}"
        body: dict[str, str] = {
            "state": state,
            "description": description[:140],
            "context": "dotmac/deploy",
        }
        if target_url:
            body["target_url"] = target_url

        try:
            resp = httpx.post(
                url,
                json=body,
                headers={
                    "Authorization": f"token {token}",
                    "Accept": "application/vnd.github.v3+json",
                },
                timeout=10.0,
            )
            if resp.status_code in (200, 201):
                logger.info("Commit status %s posted for %s/%s", state, owner_repo, sha[:12])
                return True
            logger.warning("GitHub commit status API returned %d: %s", resp.status_code, resp.text[:500])
            return False
        except Exception:
            logger.exception("Failed to post commit status for %s", sha[:12])
            return False

    def receive_push_event(
        self,
        repo_id: UUID,
        body: bytes,
        signature: str,
        event_type: str,
    ) -> dict[str, str]:
        """Validate and process an incoming GitHub webhook push event.

        Returns a dict with 'action' key: 'ignored', 'queued', or raises ValueError.
        """
        from app.services.git_repo_service import GitRepoService

        repo = GitRepoService(self.db).get_by_id(repo_id)
        if not repo or not repo.is_active:
            raise ValueError("Repository not found")

        if not self.validate_signature(repo, body, signature):
            raise PermissionError("Invalid signature")

        import json as _json

        try:
            payload = _json.loads(body)
        except (_json.JSONDecodeError, TypeError):
            raise ValueError("Invalid JSON")

        if event_type != "push":
            self._create_log(repo, event_type, status="ignored", error_message=f"Event type: {event_type}")
            return {"ok": "true", "action": "ignored"}

        from app.tasks.github_webhooks import process_github_push

        process_github_push.delay(str(repo_id), _json.dumps(payload))
        return {"ok": "true", "action": "queued"}

    def get_recent_logs(
        self,
        repo_id: UUID | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[GitHubWebhookLog]:
        """Get recent webhook logs, optionally filtered by repo."""
        stmt = select(GitHubWebhookLog).order_by(GitHubWebhookLog.created_at.desc())
        if repo_id is not None:
            stmt = stmt.where(GitHubWebhookLog.repo_id == repo_id)
        stmt = stmt.limit(limit).offset(offset)
        return list(self.db.scalars(stmt).all())

    def _create_log(
        self,
        repo: GitRepository | None,
        event_type: str,
        *,
        branch: str | None = None,
        commit_sha: str | None = None,
        sender: str | None = None,
        payload_summary: str | None = None,
        status: str = "received",
        error_message: str | None = None,
        deployments_triggered: int = 0,
    ) -> GitHubWebhookLog:
        log = GitHubWebhookLog(
            repo_id=repo.repo_id if repo else None,
            event_type=event_type,
            branch=branch,
            commit_sha=commit_sha,
            sender=sender,
            payload_summary=payload_summary[:2000] if payload_summary else None,
            status=status,
            error_message=error_message,
            deployments_triggered=deployments_triggered,
        )
        self.db.add(log)
        self.db.flush()
        return log


def _extract_owner_repo(url: str) -> str | None:
    """Extract 'owner/repo' from a GitHub URL."""
    parsed = urllib.parse.urlparse(url)
    path = parsed.path.strip("/").removesuffix(".git")
    parts = path.split("/")
    if len(parts) >= 2:
        return f"{parts[0]}/{parts[1]}"
    return None
