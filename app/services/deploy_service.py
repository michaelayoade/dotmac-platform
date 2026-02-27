"""
Deploy Service — 10-step deployment pipeline for ERP instances.

Each step updates DeploymentLog records in the database for real-time
progress tracking via HTMX polling.
"""

from __future__ import annotations

import logging
import re
import shlex
import time
import uuid
from datetime import UTC, datetime, timedelta
from uuid import UUID

from cryptography.fernet import InvalidToken
from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.deployment_log import DeploymentLog, DeployStepStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.services.auth_flow import _decrypt_secret as _decrypt_auth_secret
from app.services.auth_flow import _encrypt_secret as _encrypt_auth_secret
from app.services.ssh_service import SSHService, get_ssh_for_server

logger = logging.getLogger(__name__)

DEPLOY_STEPS = [
    "backup",
    "generate",
    "transfer",
    "pull_image",
    "start_infra",
    "start_app",
    "migrate",
    "bootstrap",
    "caddy",
    "verify",
]

RECONFIGURE_STEPS = [
    "generate",
    "transfer",
    "restart",
    "verify",
]

UPGRADE_STEPS = [
    "backup",
    "generate",
    "transfer",
    "pull_image",
    "start_infra",
    "start_app",
    "migrate",
    "verify",
]

STEP_LABELS = {
    "backup": "Pre-deploy database backup",
    "generate": "Generate instance files",
    "transfer": "Transfer files to server",
    "pull_image": "Pull container image from registry",
    "start_infra": "Start infrastructure (DB, Redis, OpenBao)",
    "start_app": "Start application containers",
    "migrate": "Run database migrations",
    "bootstrap": "Bootstrap organization and admin",
    "caddy": "Configure Caddy reverse proxy + SSL",
    "verify": "Verify instance health",
    "restart": "Restart application containers",
}


def _safe_slug(value: str) -> str:
    """Validate and return a safe alphanumeric slug for use in shell commands."""
    if not re.match(r"^[a-zA-Z0-9_-]+$", value):
        raise ValueError(f"Invalid slug: {value!r} — must be alphanumeric, hyphens, or underscores")
    return value


def _safe_schema_name(value: str) -> str:
    """Validate and return a safe PostgreSQL schema identifier."""
    if not re.match(r"^[a-z][a-z0-9_]*$", value):
        raise ValueError(f"Invalid schema name: {value!r}")
    return value


def _redact_git_url(url: str) -> str:
    if url.startswith(("http://", "https://")) and "@" in url:
        scheme, rest = url.split("://", 1)
        if "@" in rest:
            return f"{scheme}://***@{rest.split('@', 1)[1]}"
    return url


def _encrypt_deploy_secret(db: Session, value: str) -> str:
    return _encrypt_auth_secret(db, value)


def _decrypt_deploy_secret(db: Session, value: str) -> str:
    try:
        return _decrypt_auth_secret(db, value)
    except (HTTPException, ValueError, InvalidToken) as exc:
        # Backward compatibility for existing plaintext secrets.
        logger.warning("Failed to decrypt deploy secret, treating as plaintext: %s", type(exc).__name__)
        return value


class DeployService:
    def __init__(self, db: Session):
        self.db = db

    def has_active_deployment(self, instance_id: UUID) -> bool:
        """Check if there is already an active (pending/running) deployment."""
        from sqlalchemy import func, select

        stmt = select(func.count(DeploymentLog.id)).where(
            DeploymentLog.instance_id == instance_id,
            DeploymentLog.status.in_(
                [
                    DeployStepStatus.pending,
                    DeployStepStatus.running,
                ]
            ),
        )
        return (self.db.scalar(stmt) or 0) > 0

    def create_deployment(
        self,
        instance_id: UUID,
        admin_password: str | None = None,
        deployment_type: str = "full",
        git_ref: str | None = None,
        upgrade_id: UUID | None = None,
    ) -> str:
        """Create pending deployment log entries for all steps.

        Args:
            instance_id: Instance to deploy.
            admin_password: Stored on first step's deploy_secret (cleared after use).
            deployment_type: "full" for full deploy, "reconfigure" for env-only.
            git_ref: Git branch/tag override for this deployment.

        Uses SELECT FOR UPDATE on the instance row to prevent concurrent
        deployments (TOCTOU race between check and create).

        Raises ValueError if a deployment is already in progress.
        """
        from sqlalchemy import select

        # Lock the instance row to prevent concurrent deployment creation
        stmt = select(Instance).where(Instance.instance_id == instance_id).with_for_update()
        instance = self.db.scalar(stmt)
        if not instance:
            raise ValueError("Instance not found")

        if self.has_active_deployment(instance_id):
            raise ValueError("A deployment is already in progress for this instance")

        if deployment_type == "upgrade":
            from app.services.approval_service import ApprovalService

            approval_svc = ApprovalService(self.db)
            if approval_svc.requires_approval(instance_id):
                if not upgrade_id:
                    raise ValueError("Upgrade approval required before deployment")
                if not approval_svc.is_upgrade_approved(upgrade_id):
                    raise ValueError("Upgrade approval required before deployment")

        deployment_id = uuid.uuid4().hex
        if deployment_type == "reconfigure":
            steps = RECONFIGURE_STEPS
        elif deployment_type == "upgrade":
            steps = UPGRADE_STEPS
        else:
            steps = DEPLOY_STEPS

        for i, step in enumerate(steps):
            log = DeploymentLog(
                instance_id=instance_id,
                deployment_id=deployment_id,
                deployment_type=deployment_type,
                git_ref=git_ref,
                step=step,
                status=DeployStepStatus.pending,
                message=STEP_LABELS.get(step, step),
                deploy_secret=_encrypt_deploy_secret(self.db, admin_password) if i == 0 and admin_password else None,
            )
            self.db.add(log)

        self.db.flush()
        logger.info(
            "Created %s deployment %s for instance %s (git_ref=%s)",
            deployment_type,
            deployment_id,
            instance_id,
            git_ref,
        )
        return deployment_id

    def get_deploy_secret(self, instance_id: UUID, deployment_id: str) -> str | None:
        """Retrieve the deploy secret (admin password) for a deployment."""
        from sqlalchemy import select

        stmt = (
            select(DeploymentLog)
            .where(
                DeploymentLog.instance_id == instance_id,
                DeploymentLog.deployment_id == deployment_id,
                DeploymentLog.deploy_secret.isnot(None),
            )
            .order_by(DeploymentLog.id.asc())
        )
        log = self.db.scalar(stmt)
        if not log or not log.deploy_secret:
            return None
        return _decrypt_deploy_secret(self.db, log.deploy_secret)

    def get_deploy_log_bundle(self, instance_id: UUID, deployment_id: str | None = None) -> dict:
        from app.services.instance_service import InstanceService

        instance = InstanceService(self.db).get_or_404(instance_id)

        if not deployment_id:
            deployment_id = self.get_latest_deployment_id(instance_id)

        logs: list[DeploymentLog] = []
        if deployment_id:
            logs = self.get_deployment_logs(instance_id, deployment_id)

        is_running = any(log.status in (DeployStepStatus.pending, DeployStepStatus.running) for log in logs)

        return {
            "instance": instance,
            "deployment_id": deployment_id,
            "logs": logs,
            "is_running": is_running,
        }

    def clear_deploy_secret(self, instance_id: UUID, deployment_id: str) -> None:
        """Clear deploy secrets after a successful deployment."""
        from sqlalchemy import select

        stmt = select(DeploymentLog).where(
            DeploymentLog.instance_id == instance_id,
            DeploymentLog.deployment_id == deployment_id,
            DeploymentLog.deploy_secret.isnot(None),
        )
        for log in self.db.scalars(stmt).all():
            log.deploy_secret = None
        self.db.commit()

    def get_deployment_logs(self, instance_id: UUID, deployment_id: str | None = None) -> list[DeploymentLog]:
        """Get deployment logs for an instance."""
        from sqlalchemy import select

        stmt = select(DeploymentLog).where(DeploymentLog.instance_id == instance_id)
        if deployment_id:
            stmt = stmt.where(DeploymentLog.deployment_id == deployment_id)
        stmt = stmt.order_by(DeploymentLog.id)
        return list(self.db.scalars(stmt).all())

    def get_latest_deployment_id(self, instance_id: UUID) -> str | None:
        """Get the most recent deployment_id for an instance."""
        from sqlalchemy import select

        stmt = (
            select(DeploymentLog.deployment_id)
            .where(DeploymentLog.instance_id == instance_id)
            .order_by(DeploymentLog.id.desc())
            .limit(1)
        )
        return self.db.scalar(stmt)

    def mark_stuck_deployments(self, max_age_minutes: int = 60) -> int:
        """Mark instances stuck in deploying state as error."""
        cutoff = datetime.now(UTC) - timedelta(minutes=max_age_minutes)
        subq = (
            select(
                DeploymentLog.instance_id,
                func.max(DeploymentLog.created_at).label("last_log_at"),
            )
            .group_by(DeploymentLog.instance_id)
            .subquery()
        )
        stmt = (
            select(Instance)
            .join(subq, subq.c.instance_id == Instance.instance_id)
            .where(Instance.status == InstanceStatus.deploying)
            .where(subq.c.last_log_at < cutoff)
        )
        count = 0
        for inst in self.db.scalars(stmt).all():
            inst.status = InstanceStatus.error
            count += 1
        self.db.flush()
        return count

    def _update_step(
        self,
        instance_id: UUID,
        deployment_id: str,
        step: str,
        status: DeployStepStatus,
        message: str | None = None,
        output: str | None = None,
    ) -> None:
        """Update a deployment step's status."""
        from sqlalchemy import select

        stmt = select(DeploymentLog).where(
            DeploymentLog.instance_id == instance_id,
            DeploymentLog.deployment_id == deployment_id,
            DeploymentLog.step == step,
        )
        log = self.db.scalar(stmt)
        if not log:
            return

        now = datetime.now(UTC)
        log.status = status
        if message:
            log.message = message
        if output:
            if len(output) > 10000:
                logger.warning(
                    "Truncating deploy output for %s/%s step %s (%d chars)",
                    instance_id,
                    deployment_id,
                    step,
                    len(output),
                )
            log.output = output[:10000]

        if status == DeployStepStatus.running:
            log.started_at = now
        elif status in (DeployStepStatus.success, DeployStepStatus.failed):
            log.completed_at = now

        self.db.commit()

    def _record_deploy_metric(self, instance_id: UUID, success: bool) -> None:
        """Record a deployment metric, swallowing any exceptions."""
        try:
            from app.services.metrics_export import MetricsExportService

            MetricsExportService(self.db).record_deployment(instance_id, success)
        except Exception:
            logger.debug(
                "Failed to record deployment metric for %s",
                instance_id,
                exc_info=True,
            )

    def run_deployment(
        self,
        instance_id: UUID,
        deployment_id: str,
        admin_password: str,
        deployment_type: str = "full",
        git_ref: str | None = None,
    ) -> dict:
        """Execute the deployment pipeline (full or reconfigure)."""
        instance = self.db.get(Instance, instance_id)
        if not instance:
            return {"success": False, "error": "Instance not found"}

        server = self.db.get(Server, instance.server_id)
        if not server:
            return {"success": False, "error": "Server not found"}

        try:
            from app.services.resource_enforcement import ResourceEnforcementService

            violations = ResourceEnforcementService(self.db).check_plan_compliance(instance_id)
            for v in violations:
                logger.warning("Plan compliance issue for %s: %s", instance.org_code, v.message)
        except Exception:
            logger.debug("Plan compliance check failed for %s", instance.org_code, exc_info=True)

        instance.status = InstanceStatus.deploying
        self.db.commit()
        self._dispatch_webhook("deploy_started", instance, deployment_id)

        ssh = get_ssh_for_server(server)
        results: dict[str, bool] = {}
        if deployment_type == "reconfigure":
            steps = RECONFIGURE_STEPS
        elif deployment_type == "upgrade":
            steps = UPGRADE_STEPS
        else:
            steps = DEPLOY_STEPS

        try:
            if deployment_type == "reconfigure":
                result = self._run_reconfigure(
                    instance,
                    deployment_id,
                    admin_password,
                    ssh,
                    results,
                    steps,
                )
                self._record_deploy_metric(instance_id, result.get("success", False))
                return result

            # Full deployment pipeline

            # Step 0: Pre-deploy backup (non-fatal for first deploy)
            results["backup"] = self._step_backup(instance, deployment_id)
            if not results["backup"]:
                logger.warning("Pre-deploy backup failed for %s — continuing", instance.org_code)

            # Step 1: Generate instance files
            results["generate"] = self._step_generate(instance, deployment_id, admin_password, git_ref=git_ref)
            if not results["generate"]:
                raise DeployError("generate", "File generation failed")

            # Step 2: Transfer files (already done by generate for local/SFTP)
            results["transfer"] = self._step_transfer(instance, deployment_id, ssh)
            if not results["transfer"]:
                raise DeployError("transfer", "File transfer failed")

            # Step 3: Pull container image from registry
            results["pull_image"] = self._step_pull_image(instance, deployment_id, ssh, git_ref=git_ref)
            if not results["pull_image"]:
                raise DeployError("pull_image", "Failed to pull container image")

            # Step 5: Start infrastructure
            results["start_infra"] = self._step_start_infra(instance, deployment_id, ssh)
            if not results["start_infra"]:
                raise DeployError("start_infra", "Infrastructure start failed")

            # Step 6: Start app containers
            results["start_app"] = self._step_start_app(instance, deployment_id, ssh)
            if not results["start_app"]:
                raise DeployError("start_app", "App containers failed to start")

            # Step 7: Run migrations (use module-aware schema list)
            results["migrate"] = self._step_migrate(instance, deployment_id, ssh)
            if not results["migrate"]:
                raise DeployError("migrate", "Migration failed")

            if deployment_type != "upgrade":
                # Step 8: Bootstrap org + admin
                results["bootstrap"] = self._step_bootstrap(instance, deployment_id, ssh)
                if not results["bootstrap"]:
                    raise DeployError("bootstrap", "Bootstrap failed")

                # Step 9: Caddy reverse proxy (non-fatal — DNS may not be ready)
                results["caddy"] = self._step_caddy(instance, deployment_id, ssh)
                if not results["caddy"]:
                    logger.warning("Caddy config failed for %s — continuing", instance.org_code)

            # Step 10: Verify health
            results["verify"] = self._step_verify(instance, deployment_id, ssh)
            if not results["verify"]:
                instance.status = InstanceStatus.error
                self.db.commit()
                self._record_deploy_metric(instance_id, False)
                return {"success": False, "error": "Health check failed", "results": results}

            # Record deployed git ref
            if git_ref:
                instance.deployed_git_ref = git_ref
            elif instance.catalog_item_id is not None:
                try:
                    from app.services.catalog_service import CatalogService

                    catalog_item = CatalogService(self.db).get_catalog_item(instance.catalog_item_id)
                    if catalog_item and catalog_item.release:
                        instance.deployed_git_ref = catalog_item.release.git_ref
                except Exception:
                    logger.debug("Failed to resolve catalog release for deployed ref", exc_info=True)
            instance.status = InstanceStatus.running
            self.db.commit()
            self.clear_deploy_secret(instance_id, deployment_id)
            self._dispatch_webhook("deploy_success", instance, deployment_id)
            self._record_deploy_metric(instance_id, True)
            return {"success": True, "results": results}

        except DeployError as e:
            logger.error("Deployment failed at step %s: %s", e.step, e.message)
            # Mark remaining steps as skipped
            for step in steps:
                if step not in results:
                    self._update_step(
                        instance_id, deployment_id, step, DeployStepStatus.skipped, "Skipped due to earlier failure"
                    )
            # Best-effort rollback: stop any containers that were started
            self._rollback_containers(instance, ssh, e.step)
            instance.status = InstanceStatus.error
            self.db.commit()
            self._dispatch_webhook("deploy_failed", instance, deployment_id, error=str(e))
            self._record_deploy_metric(instance_id, False)
            return {"success": False, "error": str(e), "step": e.step}

        except Exception as e:
            logger.exception("Unexpected deployment error")
            try:
                self._rollback_containers(instance, ssh, "unknown")
            except Exception:
                logger.exception("Rollback also failed")
            instance.status = InstanceStatus.error
            self.db.commit()
            self._dispatch_webhook("deploy_failed", instance, deployment_id, error=str(e))
            self._record_deploy_metric(instance_id, False)
            return {"success": False, "error": str(e)}

    def _run_reconfigure(
        self,
        instance: Instance,
        deployment_id: str,
        admin_password: str,
        ssh: SSHService,
        results: dict,
        steps: list[str],
    ) -> dict:
        """Lightweight reconfigure: regenerate .env, transfer, restart, verify."""
        instance_id = instance.instance_id

        results["generate"] = self._step_generate(instance, deployment_id, admin_password)
        if not results["generate"]:
            raise DeployError("generate", "File generation failed")

        results["transfer"] = self._step_transfer(instance, deployment_id, ssh)
        if not results["transfer"]:
            raise DeployError("transfer", "File transfer failed")

        # Restart app containers (not infra)
        results["restart"] = self._step_restart(instance, deployment_id, ssh)
        if not results["restart"]:
            raise DeployError("restart", "Restart failed")

        results["verify"] = self._step_verify(instance, deployment_id, ssh)
        if not results["verify"]:
            instance.status = InstanceStatus.error
            self.db.commit()
            return {"success": False, "error": "Health check failed", "results": results}

        instance.status = InstanceStatus.running
        self.db.commit()
        self.clear_deploy_secret(instance_id, deployment_id)
        return {"success": True, "results": results}

    def _step_backup(self, instance: Instance, deployment_id: str) -> bool:
        """Pre-deploy backup step — non-fatal on first deploy."""
        step = "backup"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)
        try:
            # Instance status is set to "deploying" before the pipeline starts, so we can't
            # rely on status to detect first deploy. Use deployed_git_ref as a durable marker.
            if not instance.deployed_git_ref:
                self._update_step(
                    instance.instance_id,
                    deployment_id,
                    step,
                    DeployStepStatus.skipped,
                    "First deploy — no existing data to back up",
                )
                return True

            from app.services.backup_service import BackupService, BackupType

            backup_svc = BackupService(self.db)
            backup = backup_svc.create_backup(instance.instance_id, BackupType.pre_deploy)

            if backup.status.value == "completed":
                self._update_step(
                    instance.instance_id,
                    deployment_id,
                    step,
                    DeployStepStatus.success,
                    f"Backup completed: {backup.file_path} ({backup.size_bytes or 0} bytes)",
                )
                return True

            error = backup.error_message or "unknown error"
            err_lower = error.lower()
            if "no such container" in err_lower and "_db" in err_lower:
                self._update_step(
                    instance.instance_id,
                    deployment_id,
                    step,
                    DeployStepStatus.skipped,
                    "No existing database container found — skipping backup",
                )
                return True

            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                f"Backup failed: {error}",
            )
            return False
        except Exception as e:
            self._update_step(
                instance.instance_id, deployment_id, step, DeployStepStatus.skipped, f"Backup skipped: {e}"
            )
            return True  # Non-fatal

    def _step_restart(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        """Restart app containers only (for reconfigure)."""
        step = "restart"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)
        result = ssh.exec_command(
            "docker compose restart app worker beat",
            timeout=120,
            cwd=instance.deploy_path,
        )
        if result.ok:
            time.sleep(5)
            self._update_step(
                instance.instance_id, deployment_id, step, DeployStepStatus.success, "Containers restarted"
            )
            return True
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.failed, "Restart failed", result.stderr
        )
        return False

    def _step_generate(
        self,
        instance: Instance,
        deployment_id: str,
        admin_password: str | None,
        git_ref: str | None = None,
    ) -> bool:
        step = "generate"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)
        try:
            from app.services.instance_service import InstanceService

            svc = InstanceService(self.db)
            result = svc.provision_files(instance, admin_password or "", git_ref=git_ref)
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                f"Generated {len(result['files'])} files at {result['deploy_path']}",
            )
            return True
        except Exception as e:
            self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.failed, str(e))
            return False

    def _step_transfer(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        step = "transfer"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)
        # Files are already transferred during generate step via SFTP
        if not instance.deploy_path:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                "Deploy path not configured",
            )
            return False
        result = ssh.exec_command(f"ls -la {shlex.quote(instance.deploy_path)}/")
        if result.ok:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                "Files verified on server",
                result.stdout,
            )
            return True
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.failed, "Files not found", result.stderr
        )
        return False

    def _step_pull_image(
        self,
        instance: Instance,
        deployment_id: str,
        ssh: SSHService,
        git_ref: str | None = None,
    ) -> bool:
        """Pull a container image from the registry."""
        from app.models.git_repository import GitAuthType
        from app.services.git_repo_service import GitRepoService
        from app.services.settings_crypto import decrypt_value

        step = "pull_image"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)

        repo_service = GitRepoService(self.db)
        repo = repo_service.get_repo_for_instance(instance.instance_id)
        if not repo or not repo.registry_url:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                "No registry URL configured for this instance's repository",
            )
            return False

        try:
            image_ref = GitRepoService.resolve_image_ref(repo, git_ref=git_ref, instance=instance)
        except ValueError as exc:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                str(exc),
            )
            return False

        self._update_step(
            instance.instance_id,
            deployment_id,
            step,
            DeployStepStatus.running,
            f"Pulling image: {image_ref}...",
        )

        # Authenticate with the container registry if a token is available
        if repo.auth_type == GitAuthType.token and repo.token_encrypted:
            token = decrypt_value(repo.token_encrypted)
            if token:
                registry_host = image_ref.split("/")[0]
                login_cmd = (
                    f"echo {shlex.quote(token)} | "
                    f"docker login {shlex.quote(registry_host)} -u __token__ --password-stdin"
                )
                login_result = ssh.exec_command(login_cmd, timeout=30)
                if not login_result.ok:
                    self._update_step(
                        instance.instance_id,
                        deployment_id,
                        step,
                        DeployStepStatus.failed,
                        "Docker registry login failed",
                        login_result.stderr[-2000:] if login_result.stderr else None,
                    )
                    return False

        pull_result = ssh.exec_command(
            f"docker pull {shlex.quote(image_ref)}",
            timeout=300,
        )
        if pull_result.ok:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                f"Pulled image: {image_ref}",
                pull_result.stdout[-2000:] if pull_result.stdout else None,
            )
            return True

        self._update_step(
            instance.instance_id,
            deployment_id,
            step,
            DeployStepStatus.failed,
            f"Failed to pull image: {image_ref}",
            pull_result.stderr[-2000:] if pull_result.stderr else None,
        )
        return False

    def _step_start_infra(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        step = "start_infra"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)
        result = ssh.exec_command(
            "docker compose up -d db redis openbao",
            timeout=120,
            cwd=instance.deploy_path,
        )
        if not result.ok:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                "Failed to start infra",
                result.stderr,
            )
            return False

        # Wait for DB to be healthy (poll up to 30 seconds)
        slug = _safe_slug(instance.org_code.lower())
        db_container = f"dotmac_{slug}_db"
        db_healthy = False
        for attempt in range(6):
            time.sleep(5)
            check = ssh.exec_command(
                f"docker inspect --format='{{{{.State.Health.Status}}}}' {db_container}",
                timeout=10,
            )
            health_status = check.stdout.strip().strip("'")
            if health_status == "healthy":
                db_healthy = True
                break
            logger.info("DB health attempt %d/6: %s", attempt + 1, health_status)

        if db_healthy:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                "Infrastructure started. DB: healthy",
            )
            return True

        self._update_step(
            instance.instance_id,
            deployment_id,
            step,
            DeployStepStatus.failed,
            f"DB did not become healthy within 30s (last: {health_status})",
            check.stderr if check else None,
        )
        return False

    def _step_start_app(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        step = "start_app"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)
        result = ssh.exec_command(
            "docker compose up -d app worker beat",
            timeout=120,
            cwd=instance.deploy_path,
        )
        if not result.ok:
            self._update_step(
                instance.instance_id, deployment_id, step, DeployStepStatus.failed, "Failed to start app", result.stderr
            )
            return False

        time.sleep(5)
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.success, "App containers started")
        return True

    def _step_migrate(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        step = "migrate"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running, "Creating database schemas..."
        )

        # Pre-create PostgreSQL schemas for enabled modules.
        # Falls back to all schemas if module service is unavailable.
        try:
            from app.services.module_service import ModuleService

            mod_svc = ModuleService(self.db)
            schemas = mod_svc.get_enabled_schemas(instance.instance_id)
        except Exception:
            logger.warning("Could not resolve modules — using all schemas")
            schemas = [
                "ap",
                "ar",
                "attendance",
                "audit",
                "automation",
                "banking",
                "common",
                "cons",
                "core_config",
                "core_fx",
                "core_org",
                "exp",
                "expense",
                "fa",
                "fin_inst",
                "fleet",
                "gl",
                "inv",
                "ipsas",
                "lease",
                "leave",
                "payments",
                "perf",
                "platform",
                "pm",
                "proc",
                "recruit",
                "rpt",
                "scheduling",
                "support",
                "sync",
                "tax",
                "training",
            ]
        try:
            safe_schemas = [_safe_schema_name(s) for s in schemas]
        except ValueError as exc:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                "Invalid schema name",
                str(exc),
            )
            return False
        schema_sql = "; ".join(f'CREATE SCHEMA IF NOT EXISTS "{s}"' for s in safe_schemas)
        slug = _safe_slug(instance.org_code.lower())
        db_container = f"dotmac_{slug}_db"
        q_db_name = shlex.quote(f"dotmac_{slug}")
        q_schema_sql = shlex.quote(schema_sql)
        pre_result = ssh.exec_command(
            f"docker exec {db_container} psql -U postgres -d {q_db_name} -c {q_schema_sql}",
            timeout=30,
        )
        if not pre_result.ok:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                "Failed to create schemas",
                (pre_result.stdout + "\n" + pre_result.stderr)[-2000:],
            )
            return False

        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running, "Running alembic migrations..."
        )
        app_container = f"dotmac_{slug}_app"
        result = ssh.exec_command(
            f"docker exec {app_container} alembic upgrade heads",
            timeout=180,
        )
        if result.ok:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                f"Migrations applied ({len(schemas)} schemas created)",
                result.stdout[-2000:] if result.stdout else None,
            )
            return True
        self._update_step(
            instance.instance_id,
            deployment_id,
            step,
            DeployStepStatus.failed,
            "Migration failed",
            (result.stdout + "\n" + result.stderr)[-2000:],
        )
        return False

    def _step_bootstrap(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        step = "bootstrap"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)
        slug = _safe_slug(instance.org_code.lower())
        app_container = f"dotmac_{slug}_app"
        if not instance.deploy_path:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                "Deploy path not configured",
            )
            return False
        deploy_path = shlex.quote(instance.deploy_path)
        # Copy bootstrap script into container (it's generated at deploy path, not in the image)
        cp_result = ssh.exec_command(
            f"docker cp {deploy_path}/bootstrap_db.py {app_container}:/app/bootstrap_db.py",
            timeout=15,
        )
        if not cp_result.ok:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                "Failed to copy bootstrap script",
                (cp_result.stdout + "\n" + cp_result.stderr)[-2000:],
            )
            return False
        result = ssh.exec_command(
            f"docker exec {app_container} python bootstrap_db.py",
            timeout=60,
        )
        if result.ok:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                "Bootstrap complete",
                result.stdout[-2000:] if result.stdout else None,
            )
            return True
        self._update_step(
            instance.instance_id,
            deployment_id,
            step,
            DeployStepStatus.failed,
            "Bootstrap failed",
            (result.stdout + "\n" + result.stderr)[-2000:],
        )
        return False

    def _step_caddy(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        step = "caddy"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)

        if not instance.domain:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.skipped,
                "No domain configured, skipping Caddy",
            )
            return True

        from app.services.caddy_service import CaddyService

        caddy_svc = CaddyService()
        try:
            caddy_svc.configure_instance(instance, ssh)
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                f"Caddy configured for {instance.domain}",
            )
            return True
        except Exception as e:
            self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.failed, str(e))
            return False

    def _step_verify(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        step = "verify"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)

        # Try health endpoint via curl on the server
        port = int(instance.app_port)
        result = ssh.exec_command(
            f"curl -sf http://localhost:{port}/health || echo 'FAIL'",
            timeout=15,
        )

        if result.ok and "FAIL" not in result.stdout:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                "Health check passed",
                result.stdout,
            )
            return True

        self._update_step(
            instance.instance_id,
            deployment_id,
            step,
            DeployStepStatus.failed,
            "Health check failed",
            result.stdout + "\n" + result.stderr,
        )
        return False

    def _rollback_containers(self, instance: Instance, ssh, failed_step: str) -> None:
        """Best-effort rollback: stop containers started during this deploy."""
        # Only roll back if we got past the build step (containers may be running)
        container_steps = {"start_infra", "start_app", "migrate", "bootstrap", "caddy", "verify"}
        if failed_step not in container_steps:
            logger.info(
                "Rollback skipped for %s — failed at step '%s' (pre-container)",
                instance.org_code,
                failed_step,
            )
            return

        logger.info(
            "Starting rollback for %s (failed at step '%s')",
            instance.org_code,
            failed_step,
        )

        # Capture container state for diagnostics
        try:
            ps_result = ssh.exec_command(
                "docker compose ps --format '{{.Name}} {{.Status}}'",
                timeout=15,
                cwd=instance.deploy_path,
            )
            if ps_result.ok:
                logger.info("Container state before rollback:\n%s", ps_result.stdout.strip())
        except Exception:
            pass

        # Collect logs from failing containers before teardown
        try:
            slug = _safe_slug(instance.org_code.lower())
            for svc in ("app", "worker", "db"):
                container = f"dotmac_{slug}_{svc}"
                log_result = ssh.exec_command(
                    f"docker logs --tail 50 {container} 2>&1",
                    timeout=10,
                )
                if log_result.stdout.strip():
                    logger.info("Rollback logs [%s]:\n%s", container, log_result.stdout[-2000:])
        except Exception:
            logger.debug("Could not collect container logs during rollback")

        # Tear down containers
        try:
            result = ssh.exec_command(
                "docker compose down",
                timeout=60,
                cwd=instance.deploy_path,
            )
            if result.ok:
                logger.info("Rollback complete for %s — containers stopped", instance.org_code)
            else:
                logger.warning(
                    "docker compose down returned non-zero for %s: %s",
                    instance.org_code,
                    result.stderr[:500],
                )
        except Exception:
            logger.exception("Failed to roll back containers for %s", instance.org_code)

        # Clean up pulled images to avoid disk bloat
        try:
            from app.services.git_repo_service import GitRepoService

            repo = GitRepoService(self.db).get_repo_for_instance(instance.instance_id)
            if repo and repo.registry_url:
                image_ref = GitRepoService.resolve_image_ref(repo, instance=instance)
                rmi_result = ssh.exec_command(
                    f"docker rmi {shlex.quote(image_ref)}",
                    timeout=30,
                )
                if rmi_result.ok:
                    logger.info("Removed pulled image %s during rollback for %s", image_ref, instance.org_code)
                else:
                    logger.debug("Could not remove image %s: %s", image_ref, rmi_result.stderr[:200])
        except Exception:
            logger.debug("Image cleanup skipped during rollback for %s", instance.org_code, exc_info=True)

    def _dispatch_webhook(self, event: str, instance: Instance, deployment_id: str, **extra) -> None:
        """Best-effort webhook dispatch for deploy events."""
        try:
            from app.services.webhook_service import WebhookService

            wh_svc = WebhookService(self.db)
            payload = {
                "instance_id": str(instance.instance_id),
                "org_code": instance.org_code,
                "deployment_id": deployment_id,
                **extra,
            }
            wh_svc.dispatch(event, payload, instance_id=instance.instance_id)
            self.db.flush()
        except Exception:
            logger.warning("Webhook dispatch failed for %s event", event, exc_info=True)

        # Best-effort in-app notification
        try:
            from app.models.notification import NotificationCategory, NotificationSeverity
            from app.services.notification_service import NotificationService

            severity_map = {
                "deploy_started": NotificationSeverity.info,
                "deploy_success": NotificationSeverity.info,
                "deploy_failed": NotificationSeverity.critical,
            }
            title_map = {
                "deploy_started": f"Deploy started: {instance.org_code}",
                "deploy_success": f"Deploy succeeded: {instance.org_code}",
                "deploy_failed": f"Deploy failed: {instance.org_code}",
            }
            sev = severity_map.get(event, NotificationSeverity.info)
            title = title_map.get(event, f"Deploy event: {instance.org_code}")
            NotificationService(self.db).create_for_admins(
                category=NotificationCategory.deploy,
                severity=sev,
                title=title,
                message=f"Deployment {deployment_id} for {instance.org_code}",
                link=f"/instances/{instance.instance_id}",
            )
        except Exception:
            logger.debug("Failed to create deploy notification", exc_info=True)

        # Best-effort GitHub commit status update
        try:
            if event in ("deploy_success", "deploy_failed") and instance.git_repo_id:
                from app.models.git_repository import GitAuthType, GitRepository

                repo = self.db.get(GitRepository, instance.git_repo_id) if instance.git_repo_id else None
                if repo and repo.auth_type == GitAuthType.token and repo.token_encrypted:
                    deployed_ref = instance.deployed_git_ref or instance.git_branch
                    if deployed_ref and len(deployed_ref) >= 7:
                        from app.tasks.github_webhooks import update_github_commit_status

                        state = "success" if event == "deploy_success" else "failure"
                        description = f"Deploy {event.split('_')[1]} for {instance.org_code}"
                        target_url = f"/instances/{instance.instance_id}"
                        update_github_commit_status.delay(
                            str(repo.repo_id),
                            deployed_ref,
                            state,
                            description,
                            target_url,
                        )
        except Exception:
            logger.debug("Failed to queue commit status update", exc_info=True)

    def check_maintenance_window(self, instance_id: UUID) -> bool:
        """Check if deployment is allowed based on maintenance windows."""
        try:
            from app.services.maintenance_service import MaintenanceService

            maint_svc = MaintenanceService(self.db)
            return maint_svc.is_deploy_allowed(instance_id)
        except Exception:
            return True  # Default to allowing if service unavailable

    def check_approval_required(self, instance_id: UUID) -> bool:
        """Check if this instance requires deploy approval."""
        try:
            from app.services.approval_service import ApprovalService

            approval_svc = ApprovalService(self.db)
            return approval_svc.requires_approval(instance_id)
        except Exception:
            return False


class DeployError(Exception):
    def __init__(self, step: str, message: str):
        self.step = step
        self.message = message
        super().__init__(f"Deploy failed at {step}: {message}")
