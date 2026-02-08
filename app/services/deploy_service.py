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
    "ensure_source",
    "build",
    "start_infra",
    "start_app",
    "migrate",
    "bootstrap",
    "nginx",
    "verify",
]

RECONFIGURE_STEPS = [
    "generate",
    "transfer",
    "restart",
    "verify",
]

STEP_LABELS = {
    "backup": "Pre-deploy database backup",
    "generate": "Generate instance files",
    "transfer": "Transfer files to server",
    "ensure_source": "Ensure DotMac source on target",
    "build": "Build Docker images",
    "start_infra": "Start infrastructure (DB, Redis, OpenBao)",
    "start_app": "Start application containers",
    "migrate": "Run database migrations",
    "bootstrap": "Bootstrap organization and admin",
    "nginx": "Configure nginx + SSL",
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

        deployment_id = uuid.uuid4().hex
        steps = RECONFIGURE_STEPS if deployment_type == "reconfigure" else DEPLOY_STEPS

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

        instance.status = InstanceStatus.deploying
        self.db.commit()
        self._dispatch_webhook("deploy_started", instance, deployment_id)

        ssh = get_ssh_for_server(server)
        results: dict[str, dict[str, object]] = {}
        steps = RECONFIGURE_STEPS if deployment_type == "reconfigure" else DEPLOY_STEPS

        try:
            if deployment_type == "reconfigure":
                return self._run_reconfigure(
                    instance,
                    deployment_id,
                    admin_password,
                    ssh,
                    results,
                    steps,
                )

            # Full deployment pipeline

            # Step 0: Pre-deploy backup (non-fatal for first deploy)
            results["backup"] = self._step_backup(instance, deployment_id)
            if not results["backup"]:
                logger.warning("Pre-deploy backup failed for %s — continuing", instance.org_code)

            # Step 1: Generate instance files
            results["generate"] = self._step_generate(instance, deployment_id, admin_password)
            if not results["generate"]:
                raise DeployError("generate", "File generation failed")

            # Step 2: Transfer files (already done by generate for local/SFTP)
            results["transfer"] = self._step_transfer(instance, deployment_id, ssh)
            if not results["transfer"]:
                raise DeployError("transfer", "File transfer failed")

            # Step 3: Ensure DotMac source exists on target
            results["ensure_source"] = self._step_ensure_source(
                instance,
                deployment_id,
                ssh,
                git_ref=git_ref,
            )
            if not results["ensure_source"]:
                raise DeployError("ensure_source", "Failed to ensure source code on server")

            # Step 4: Docker build
            results["build"] = self._step_build(instance, deployment_id, ssh)
            if not results["build"]:
                raise DeployError("build", "Docker build failed")

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

            # Step 8: Bootstrap org + admin
            results["bootstrap"] = self._step_bootstrap(instance, deployment_id, ssh)
            if not results["bootstrap"]:
                raise DeployError("bootstrap", "Bootstrap failed")

            # Step 9: Nginx + certbot (non-fatal — DNS may not be ready)
            results["nginx"] = self._step_nginx(instance, deployment_id, ssh)
            if not results["nginx"]:
                logger.warning("Nginx config failed for %s — continuing", instance.org_code)

            # Step 10: Verify health
            results["verify"] = self._step_verify(instance, deployment_id, ssh)
            if not results["verify"]:
                instance.status = InstanceStatus.error
                self.db.commit()
                return {"success": False, "error": "Health check failed", "results": results}

            # Record deployed git ref
            if git_ref:
                instance.deployed_git_ref = git_ref
            instance.status = InstanceStatus.running
            self.db.commit()
            self.clear_deploy_secret(instance_id, deployment_id)
            self._dispatch_webhook("deploy_success", instance, deployment_id)
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
            if instance.status == InstanceStatus.provisioned:
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

            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                f"Backup failed: {backup.error_message or 'unknown error'}",
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

    def _step_generate(self, instance: Instance, deployment_id: str, admin_password: str | None) -> bool:
        step = "generate"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)
        try:
            from app.services.instance_service import InstanceService

            svc = InstanceService(self.db)
            result = svc.provision_files(instance, admin_password)
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

    def _step_ensure_source(
        self,
        instance: Instance,
        deployment_id: str,
        ssh: SSHService,
        git_ref: str | None = None,
    ) -> bool:
        step = "ensure_source"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)

        from app.services.platform_settings import PlatformSettingsService

        ps = PlatformSettingsService(self.db)
        src_path = ps.get("dotmac_source_path")
        git_repo_url = ps.get("dotmac_git_repo_url")
        # Version pinning: per-instance override > deployment arg > platform default
        git_branch = git_ref or instance.git_branch or instance.git_tag or ps.get("dotmac_git_branch")

        q_src = shlex.quote(src_path)
        q_branch = shlex.quote(git_branch)

        # Check if source already exists
        result = ssh.exec_command(f"test -d {q_src}/.git && echo 'exists'")
        if "exists" in result.stdout:
            # Pull latest changes
            self._update_step(
                instance.instance_id, deployment_id, step, DeployStepStatus.running, f"Updating source at {src_path}..."
            )
            git_cmd = (
                f"git -C {q_src} fetch origin"
                f" && git -C {q_src} checkout {q_branch}"
                f" && git -C {q_src} pull origin {q_branch}"
            )
            pull_result = ssh.exec_command(git_cmd, timeout=120)
            if pull_result.ok:
                self._update_step(
                    instance.instance_id,
                    deployment_id,
                    step,
                    DeployStepStatus.success,
                    f"Source updated at {src_path} (branch: {git_branch})",
                    pull_result.stdout[-2000:] if pull_result.stdout else None,
                )
                return True
            # Pull failed — log but continue (source still exists)
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                f"Source exists at {src_path} (pull failed, using existing)",
                pull_result.stderr[-2000:] if pull_result.stderr else None,
            )
            return True

        # Source doesn't exist — need to clone
        if not git_repo_url:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.failed,
                "No git repo URL configured. Go to Settings to set the repository URL.",
            )
            return False

        self._update_step(
            instance.instance_id,
            deployment_id,
            step,
            DeployStepStatus.running,
            f"Cloning {git_repo_url} (branch: {git_branch})...",
        )

        # Ensure parent directory exists
        parent_dir = "/".join(src_path.rstrip("/").split("/")[:-1])
        ssh.exec_command(f"mkdir -p {shlex.quote(parent_dir)}")

        clone_result = ssh.exec_command(
            f"git clone --branch {q_branch} {shlex.quote(git_repo_url)} {q_src}",
            timeout=300,
        )
        if clone_result.ok:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                f"Cloned to {src_path} (branch: {git_branch})",
                clone_result.stdout[-2000:] if clone_result.stdout else None,
            )
            return True

        self._update_step(
            instance.instance_id,
            deployment_id,
            step,
            DeployStepStatus.failed,
            "Git clone failed",
            clone_result.stderr[-2000:] if clone_result.stderr else None,
        )
        return False

    def _step_build(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        step = "build"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running, "Building Docker images..."
        )
        result = ssh.exec_command(
            "docker compose build",
            timeout=600,
            cwd=instance.deploy_path,
        )
        if result.ok:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                "Build complete",
                result.stdout[-2000:] if result.stdout else None,
            )
            return True
        self._update_step(
            instance.instance_id,
            deployment_id,
            step,
            DeployStepStatus.failed,
            "Build failed",
            result.stderr[-2000:] if result.stderr else None,
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

    def _step_nginx(self, instance: Instance, deployment_id: str, ssh: SSHService) -> bool:
        step = "nginx"
        self._update_step(instance.instance_id, deployment_id, step, DeployStepStatus.running)

        if not instance.domain:
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.skipped,
                "No domain configured, skipping nginx",
            )
            return True

        from app.services.nginx_service import NginxService

        nginx_svc = NginxService()
        try:
            nginx_svc.configure_instance(instance, ssh)
            self._update_step(
                instance.instance_id,
                deployment_id,
                step,
                DeployStepStatus.success,
                f"Nginx configured for {instance.domain}",
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
        container_steps = {"start_infra", "start_app", "migrate", "bootstrap", "nginx", "verify"}
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
