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
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.deployment_log import DeploymentLog, DeployStepStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.config import settings as platform_settings
from app.services.ssh_service import SSHResult, get_ssh_for_server

logger = logging.getLogger(__name__)

DEPLOY_STEPS = [
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

STEP_LABELS = {
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
}


def _safe_slug(value: str) -> str:
    """Validate and return a safe alphanumeric slug for use in shell commands."""
    if not re.match(r'^[a-zA-Z0-9_-]+$', value):
        raise ValueError(f"Invalid slug: {value!r} — must be alphanumeric, hyphens, or underscores")
    return value


class DeployService:
    def __init__(self, db: Session):
        self.db = db

    def has_active_deployment(self, instance_id: UUID) -> bool:
        """Check if there is already an active (pending/running) deployment."""
        from sqlalchemy import select, func

        stmt = select(func.count(DeploymentLog.id)).where(
            DeploymentLog.instance_id == instance_id,
            DeploymentLog.status.in_([
                DeployStepStatus.pending,
                DeployStepStatus.running,
            ]),
        )
        return (self.db.scalar(stmt) or 0) > 0

    def create_deployment(self, instance_id: UUID, admin_password: str | None = None) -> str:
        """Create pending deployment log entries for all steps.

        If admin_password is provided, it's stored on the first step's
        deploy_secret field and cleared after the deploy task reads it.
        This avoids passing passwords through Celery task arguments.

        Raises ValueError if a deployment is already in progress.
        """
        if self.has_active_deployment(instance_id):
            raise ValueError("A deployment is already in progress for this instance")

        deployment_id = str(uuid.uuid4())[:8]

        for i, step in enumerate(DEPLOY_STEPS):
            log = DeploymentLog(
                instance_id=instance_id,
                deployment_id=deployment_id,
                step=step,
                status=DeployStepStatus.pending,
                message=STEP_LABELS.get(step, step),
                deploy_secret=admin_password if i == 0 and admin_password else None,
            )
            self.db.add(log)

        self.db.flush()
        logger.info("Created deployment %s for instance %s", deployment_id, instance_id)
        return deployment_id

    def get_deploy_secret(self, instance_id: UUID, deployment_id: str) -> str | None:
        """Retrieve and clear the deploy secret (admin password) for a deployment."""
        from sqlalchemy import select

        stmt = select(DeploymentLog).where(
            DeploymentLog.instance_id == instance_id,
            DeploymentLog.deployment_id == deployment_id,
            DeploymentLog.step == DEPLOY_STEPS[0],
        )
        log = self.db.scalar(stmt)
        if not log or not log.deploy_secret:
            return None
        secret = log.deploy_secret
        log.deploy_secret = None  # Clear after reading
        self.db.flush()
        self.db.commit()
        return secret

    def get_deployment_logs(
        self, instance_id: UUID, deployment_id: str | None = None
    ) -> list[DeploymentLog]:
        """Get deployment logs for an instance."""
        from sqlalchemy import select

        stmt = select(DeploymentLog).where(
            DeploymentLog.instance_id == instance_id
        )
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

        now = datetime.now(timezone.utc)
        log.status = status
        if message:
            log.message = message
        if output:
            log.output = output[:10000]  # Cap output length

        if status == DeployStepStatus.running:
            log.started_at = now
        elif status in (DeployStepStatus.success, DeployStepStatus.failed):
            log.completed_at = now

        self.db.flush()
        self.db.commit()

    def run_deployment(
        self,
        instance_id: UUID,
        deployment_id: str,
        admin_password: str,
    ) -> dict:
        """Execute the full deployment pipeline."""
        instance = self.db.get(Instance, instance_id)
        if not instance:
            return {"success": False, "error": "Instance not found"}

        server = self.db.get(Server, instance.server_id)
        if not server:
            return {"success": False, "error": "Server not found"}

        instance.status = InstanceStatus.deploying
        self.db.commit()

        ssh = get_ssh_for_server(server)
        results = {}

        try:
            # Step 1: Generate instance files
            results["generate"] = self._step_generate(
                instance, deployment_id, admin_password
            )
            if not results["generate"]:
                raise DeployError("generate", "File generation failed")

            # Step 2: Transfer files (already done by generate for local/SFTP)
            results["transfer"] = self._step_transfer(
                instance, deployment_id, ssh
            )
            if not results["transfer"]:
                raise DeployError("transfer", "File transfer failed")

            # Step 3: Ensure DotMac source exists on target
            results["ensure_source"] = self._step_ensure_source(
                instance, deployment_id, ssh
            )
            if not results["ensure_source"]:
                raise DeployError("ensure_source", "Failed to ensure source code on server")

            # Step 4: Docker build
            results["build"] = self._step_build(
                instance, deployment_id, ssh
            )
            if not results["build"]:
                raise DeployError("build", "Docker build failed")

            # Step 5: Start infrastructure
            results["start_infra"] = self._step_start_infra(
                instance, deployment_id, ssh
            )
            if not results["start_infra"]:
                raise DeployError("start_infra", "Infrastructure start failed")

            # Step 6: Start app containers
            results["start_app"] = self._step_start_app(
                instance, deployment_id, ssh
            )
            if not results["start_app"]:
                raise DeployError("start_app", "App containers failed to start")

            # Step 7: Run migrations
            results["migrate"] = self._step_migrate(
                instance, deployment_id, ssh
            )
            if not results["migrate"]:
                raise DeployError("migrate", "Migration failed")

            # Step 8: Bootstrap org + admin
            results["bootstrap"] = self._step_bootstrap(
                instance, deployment_id, ssh
            )
            if not results["bootstrap"]:
                raise DeployError("bootstrap", "Bootstrap failed")

            # Step 9: Nginx + certbot (non-fatal — DNS may not be ready)
            results["nginx"] = self._step_nginx(
                instance, deployment_id, ssh
            )
            if not results["nginx"]:
                logger.warning("Nginx config failed for %s — continuing", instance.org_code)

            # Step 10: Verify health
            results["verify"] = self._step_verify(
                instance, deployment_id, ssh
            )
            if not results["verify"]:
                instance.status = InstanceStatus.error
                self.db.commit()
                return {"success": False, "error": "Health check failed", "results": results}

            instance.status = InstanceStatus.running
            self.db.commit()
            return {"success": True, "results": results}

        except DeployError as e:
            logger.error("Deployment failed at step %s: %s", e.step, e.message)
            # Mark remaining steps as skipped
            for step in DEPLOY_STEPS:
                if step not in results:
                    self._update_step(
                        instance_id, deployment_id, step,
                        DeployStepStatus.skipped, "Skipped due to earlier failure"
                    )
            # Best-effort rollback: stop any containers that were started
            self._rollback_containers(instance, ssh, e.step)
            instance.status = InstanceStatus.error
            self.db.commit()
            return {"success": False, "error": str(e), "step": e.step}

        except Exception as e:
            logger.exception("Unexpected deployment error")
            try:
                self._rollback_containers(instance, ssh, "unknown")
            except Exception:
                logger.exception("Rollback also failed")
            instance.status = InstanceStatus.error
            self.db.commit()
            return {"success": False, "error": str(e)}

    def _step_generate(
        self, instance: Instance, deployment_id: str, admin_password: str
    ) -> bool:
        step = "generate"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running
        )
        try:
            from app.services.instance_service import InstanceService

            svc = InstanceService(self.db)
            result = svc.provision_files(instance, admin_password)
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success,
                f"Generated {len(result['files'])} files at {result['deploy_path']}"
            )
            return True
        except Exception as e:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.failed, str(e)
            )
            return False

    def _step_transfer(
        self, instance: Instance, deployment_id: str, ssh
    ) -> bool:
        step = "transfer"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running
        )
        # Files are already transferred during generate step via SFTP
        result = ssh.exec_command(f"ls -la {shlex.quote(instance.deploy_path)}/")
        if result.ok:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success, "Files verified on server",
                result.stdout
            )
            return True
        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.failed, "Files not found", result.stderr
        )
        return False

    def _step_ensure_source(
        self, instance: Instance, deployment_id: str, ssh
    ) -> bool:
        step = "ensure_source"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running
        )

        from app.services.platform_settings import PlatformSettingsService

        ps = PlatformSettingsService(self.db)
        src_path = ps.get("dotmac_source_path")
        git_repo_url = ps.get("dotmac_git_repo_url")
        git_branch = ps.get("dotmac_git_branch")

        q_src = shlex.quote(src_path)
        q_branch = shlex.quote(git_branch)

        # Check if source already exists
        result = ssh.exec_command(f"test -d {q_src}/.git && echo 'exists'")
        if "exists" in result.stdout:
            # Pull latest changes
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.running, f"Updating source at {src_path}..."
            )
            pull_result = ssh.exec_command(
                f"git -C {q_src} fetch origin && git -C {q_src} checkout {q_branch} && git -C {q_src} pull origin {q_branch}",
                timeout=120,
            )
            if pull_result.ok:
                self._update_step(
                    instance.instance_id, deployment_id, step,
                    DeployStepStatus.success,
                    f"Source updated at {src_path} (branch: {git_branch})",
                    pull_result.stdout[-2000:] if pull_result.stdout else None,
                )
                return True
            # Pull failed — log but continue (source still exists)
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success,
                f"Source exists at {src_path} (pull failed, using existing)",
                pull_result.stderr[-2000:] if pull_result.stderr else None,
            )
            return True

        # Source doesn't exist — need to clone
        if not git_repo_url:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.failed,
                "No git repo URL configured. Go to Settings to set the repository URL."
            )
            return False

        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.running,
            f"Cloning {git_repo_url} (branch: {git_branch})..."
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
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success,
                f"Cloned to {src_path} (branch: {git_branch})",
                clone_result.stdout[-2000:] if clone_result.stdout else None,
            )
            return True

        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.failed,
            f"Git clone failed",
            clone_result.stderr[-2000:] if clone_result.stderr else None,
        )
        return False

    def _step_build(
        self, instance: Instance, deployment_id: str, ssh
    ) -> bool:
        step = "build"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running,
            "Building Docker images..."
        )
        result = ssh.exec_command(
            "docker compose build",
            timeout=600,
            cwd=instance.deploy_path,
        )
        if result.ok:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success, "Build complete",
                result.stdout[-2000:] if result.stdout else None,
            )
            return True
        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.failed, "Build failed",
            result.stderr[-2000:] if result.stderr else None,
        )
        return False

    def _step_start_infra(
        self, instance: Instance, deployment_id: str, ssh
    ) -> bool:
        step = "start_infra"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running
        )
        result = ssh.exec_command(
            "docker compose up -d db redis openbao",
            timeout=120,
            cwd=instance.deploy_path,
        )
        if not result.ok:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.failed, "Failed to start infra", result.stderr
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
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success,
                f"Infrastructure started. DB: healthy"
            )
            return True

        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.failed,
            f"DB did not become healthy within 30s (last: {health_status})",
            check.stderr if check else None,
        )
        return False

    def _step_start_app(
        self, instance: Instance, deployment_id: str, ssh
    ) -> bool:
        step = "start_app"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running
        )
        result = ssh.exec_command(
            "docker compose up -d app worker beat",
            timeout=120,
            cwd=instance.deploy_path,
        )
        if not result.ok:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.failed, "Failed to start app", result.stderr
            )
            return False

        time.sleep(5)
        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.success, "App containers started"
        )
        return True

    def _step_migrate(
        self, instance: Instance, deployment_id: str, ssh
    ) -> bool:
        step = "migrate"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running,
            "Creating database schemas..."
        )

        # Pre-create all PostgreSQL schemas required by ERP migrations.
        # Without this, alembic fails when trying to create types/tables
        # in schemas that don't exist yet.
        schemas = [
            "ap", "ar", "attendance", "audit", "automation", "banking",
            "common", "cons", "core_config", "core_fx", "core_org",
            "exp", "expense", "fa", "fin_inst", "fleet", "gl", "inv",
            "ipsas", "lease", "leave", "payments", "perf", "platform",
            "pm", "proc", "recruit", "rpt", "scheduling", "support",
            "sync", "tax", "training",
        ]
        schema_sql = "; ".join(
            f"CREATE SCHEMA IF NOT EXISTS {s}" for s in schemas
        )
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
                instance.instance_id, deployment_id, step,
                DeployStepStatus.failed, "Failed to create schemas",
                (pre_result.stdout + "\n" + pre_result.stderr)[-2000:]
            )
            return False

        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.running, "Running alembic migrations..."
        )
        app_container = f"dotmac_{slug}_app"
        result = ssh.exec_command(
            f"docker exec {app_container} alembic upgrade heads",
            timeout=180,
        )
        if result.ok:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success,
                f"Migrations applied ({len(schemas)} schemas created)",
                result.stdout[-2000:] if result.stdout else None,
            )
            return True
        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.failed, "Migration failed",
            (result.stdout + "\n" + result.stderr)[-2000:]
        )
        return False

    def _step_bootstrap(
        self, instance: Instance, deployment_id: str, ssh
    ) -> bool:
        step = "bootstrap"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running
        )
        slug = _safe_slug(instance.org_code.lower())
        app_container = f"dotmac_{slug}_app"
        deploy_path = shlex.quote(instance.deploy_path)
        # Copy bootstrap script into container (it's generated at deploy path, not in the image)
        cp_result = ssh.exec_command(
            f"docker cp {deploy_path}/bootstrap_db.py {app_container}:/app/bootstrap_db.py",
            timeout=15,
        )
        if not cp_result.ok:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.failed, "Failed to copy bootstrap script",
                (cp_result.stdout + "\n" + cp_result.stderr)[-2000:]
            )
            return False
        result = ssh.exec_command(
            f"docker exec {app_container} python bootstrap_db.py",
            timeout=60,
        )
        if result.ok:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success, "Bootstrap complete",
                result.stdout[-2000:] if result.stdout else None,
            )
            return True
        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.failed, "Bootstrap failed",
            (result.stdout + "\n" + result.stderr)[-2000:]
        )
        return False

    def _step_nginx(
        self, instance: Instance, deployment_id: str, ssh
    ) -> bool:
        step = "nginx"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running
        )

        if not instance.domain:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.skipped, "No domain configured, skipping nginx"
            )
            return True

        from app.services.nginx_service import NginxService

        nginx_svc = NginxService()
        try:
            nginx_svc.configure_instance(instance, ssh)
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success,
                f"Nginx configured for {instance.domain}"
            )
            return True
        except Exception as e:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.failed, str(e)
            )
            return False

    def _step_verify(
        self, instance: Instance, deployment_id: str, ssh
    ) -> bool:
        step = "verify"
        self._update_step(
            instance.instance_id, deployment_id, step, DeployStepStatus.running
        )

        # Try health endpoint via curl on the server
        port = int(instance.app_port)
        result = ssh.exec_command(
            f"curl -sf http://localhost:{port}/health || echo 'FAIL'",
            timeout=15,
        )

        if result.ok and "FAIL" not in result.stdout:
            self._update_step(
                instance.instance_id, deployment_id, step,
                DeployStepStatus.success,
                "Health check passed", result.stdout
            )
            return True

        self._update_step(
            instance.instance_id, deployment_id, step,
            DeployStepStatus.failed, "Health check failed",
            result.stdout + "\n" + result.stderr
        )
        return False


    def _rollback_containers(
        self, instance: Instance, ssh, failed_step: str
    ) -> None:
        """Best-effort rollback: stop containers started during this deploy."""
        # Only roll back if we got past the build step (containers may be running)
        container_steps = {"start_infra", "start_app", "migrate", "bootstrap", "nginx", "verify"}
        if failed_step not in container_steps:
            return
        try:
            logger.info("Rolling back containers for %s", instance.org_code)
            ssh.exec_command(
                "docker compose down",
                timeout=60,
                cwd=instance.deploy_path,
            )
        except Exception:
            logger.exception("Failed to roll back containers for %s", instance.org_code)


class DeployError(Exception):
    def __init__(self, step: str, message: str):
        self.step = step
        self.message = message
        super().__init__(f"Deploy failed at {step}: {message}")
