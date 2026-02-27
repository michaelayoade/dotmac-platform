"""
Instance Service — CRUD, provisioning, and file generation for ERP instances.

Generates docker-compose.yml, .env, bootstrap_db.py, and setup.sh for each
instance, based on the patterns in dotmac's bootstrap_instance.py.
"""

from __future__ import annotations

import logging
import os
import re
import secrets
import textwrap
import uuid
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import String, case, cast, func, literal, or_, select
from sqlalchemy.orm import Session

from app.models.instance import (
    AccountingFramework,
    Instance,
    InstanceStatus,
    SectorType,
)
from app.models.server import Server
from app.services.ssh_service import get_ssh_for_server
from app.services.view_models import InstanceListItem, PagedResult

logger = logging.getLogger(__name__)

_DOMAIN_RE = re.compile(r"^[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?$")


def _validate_domain(domain: str) -> str:
    domain = domain.strip().lower()
    if not domain or len(domain) > 253 or not _DOMAIN_RE.match(domain):
        raise ValueError(f"Invalid domain: {domain!r}")
    return domain


# Port allocation base
BASE_APP_PORT = 8010
BASE_DB_PORT = 5440
BASE_REDIS_PORT = 6390


# Secrets that MUST be preserved across redeploys.
# Regenerating these would break running infrastructure or corrupt encrypted data.
_PRESERVE_SECRETS = {
    "TOTP_ENCRYPTION_KEY",  # Encrypts data at rest — changing corrupts stored credentials
    "POSTGRES_PASSWORD",  # DB already initialised with this password
    "REDIS_PASSWORD",  # Redis already running with this password
    "JWT_SECRET",  # Active JWTs would be invalidated
    "OPENBAO_TOKEN",  # Must match running OpenBao container's root token
}

# Derived secrets — recomputed from the preserved base secrets above.
_DERIVED_FROM_PG = {"DATABASE_URL"}
_DERIVED_FROM_REDIS = {"REDIS_URL", "CELERY_BROKER_URL", "CELERY_RESULT_BACKEND"}


def parse_env_file(content: str) -> dict[str, str]:
    """Parse a .env file into a dict, ignoring comments and blank lines.

    Strips surrounding single or double quotes from values, matching the
    behaviour of ``docker compose`` and ``python-dotenv``.
    """
    env: dict[str, str] = {}
    for line in content.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, _, value = line.partition("=")
        value = value.strip()
        # Strip matching quotes
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
            value = value[1:-1]
        env[key.strip()] = value
    return env


def _quote_env_value(value: str | None) -> str:
    """Quote/escape a value for safe inclusion in a .env assignment."""
    text = "" if value is None else str(value)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace('"', r"\"").replace("\n", r"\n")
    return f'"{text}"'


def _sanitize_env_comment(value: str | None) -> str:
    """Prevent comment/header interpolation from introducing new env lines."""
    text = "" if value is None else str(value)
    return text.replace("\r\n", " ").replace("\r", " ").replace("\n", " ")


class InstanceService:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self, search: str | None = None) -> list[Instance]:
        stmt = select(Instance).order_by(Instance.created_at.desc())
        if search:
            # Escape special LIKE characters (% and _) in the search term
            escaped_search = re.sub(r"([%_])", r"\\\1", search)
            stmt = stmt.where(Instance.name.ilike(f"%{escaped_search}%", escape="\\"))
        return list(self.db.scalars(stmt).all())

    def list_for_server(self, server_id: UUID) -> list[Instance]:
        stmt = select(Instance).where(Instance.server_id == server_id).order_by(Instance.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, instance_id: UUID) -> Instance | None:
        return self.db.get(Instance, instance_id)

    def get_or_404(self, instance_id: UUID) -> Instance:
        instance = self.get_by_id(instance_id)
        if not instance:
            raise ValueError(f"Instance {instance_id} not found")
        return instance

    def get_running(self) -> list[Instance]:
        stmt = select(Instance).where(Instance.status == InstanceStatus.running)
        return list(self.db.scalars(stmt).all())

    def list_for_web(
        self,
        *,
        q: str,
        status_filter: str | None,
        health_filter: str | None,
        sort_key: str,
        sort_dir: str,
        page: int,
        page_size: int,
    ) -> PagedResult[InstanceListItem]:
        """List instances for the web UI with health + catalog context."""
        from app.config import settings as platform_settings
        from app.models.catalog import AppCatalogItem, AppRelease
        from app.models.health_check import HealthCheck, HealthStatus
        from app.services.health_service import HealthService

        q = (q or "").strip()
        status_value = (status_filter or "").strip().lower() or None
        health_value = (health_filter or "").strip().lower() or None
        sort_key = (sort_key or "").strip().lower()
        now = datetime.now(UTC)
        stale_cutoff = now - timedelta(seconds=platform_settings.health_stale_seconds)

        stmt = select(Instance)
        total_stmt = select(func.count(Instance.instance_id))

        if q:
            escaped_q = re.sub(r"([%_])", r"\\\1", q)
            q_like = f"%{escaped_q}%"
            search_predicate = or_(
                Instance.org_code.ilike(q_like, escape="\\"),
                Instance.org_name.ilike(q_like, escape="\\"),
            )
            stmt = stmt.where(search_predicate)
            total_stmt = total_stmt.where(search_predicate)

        if status_value:
            try:
                status_enum = InstanceStatus(status_value)
            except ValueError:
                return PagedResult(items=[], total=0, page=page, page_size=page_size)
            stmt = stmt.where(Instance.status == status_enum)
            total_stmt = total_stmt.where(Instance.status == status_enum)

        latest_checked_at = None
        health_state_expr = None
        if health_value or sort_key in {"health", "last_check"}:
            latest_checked_at = (
                select(HealthCheck.checked_at)
                .where(HealthCheck.instance_id == Instance.instance_id)
                .order_by(HealthCheck.checked_at.desc(), HealthCheck.id.desc())
                .limit(1)
                .scalar_subquery()
            )
            latest_health_status = (
                select(HealthCheck.status)
                .where(HealthCheck.instance_id == Instance.instance_id)
                .order_by(HealthCheck.checked_at.desc(), HealthCheck.id.desc())
                .limit(1)
                .scalar_subquery()
            )
            health_state_expr = case(
                (Instance.status != InstanceStatus.running, literal("n/a")),
                (
                    or_(latest_checked_at.is_(None), latest_checked_at < stale_cutoff),
                    literal("unknown"),
                ),
                (latest_health_status == HealthStatus.healthy, literal("healthy")),
                else_=literal("unhealthy"),
            )

        if health_value:
            if health_value not in {"healthy", "unhealthy", "unknown", "n/a"}:
                return PagedResult(items=[], total=0, page=page, page_size=page_size)
            stmt = stmt.where(health_state_expr == health_value)
            total_stmt = total_stmt.where(health_state_expr == health_value)

        if sort_key == "status":
            sort_expr = cast(Instance.status, String)
        elif sort_key == "port":
            sort_expr = Instance.app_port
        elif sort_key == "framework":
            sort_expr = func.coalesce(cast(Instance.framework, String), "")
        elif sort_key == "sector":
            sort_expr = func.coalesce(cast(Instance.sector_type, String), "")
        elif sort_key == "catalog":
            catalog_label_expr = (
                select(AppCatalogItem.label)
                .where(AppCatalogItem.catalog_id == Instance.catalog_item_id)
                .limit(1)
                .scalar_subquery()
            )
            sort_expr = func.coalesce(catalog_label_expr, "")
        elif sort_key == "health" and health_state_expr is not None:
            sort_expr = case(
                (health_state_expr == "healthy", 0),
                (health_state_expr == "unhealthy", 1),
                (health_state_expr == "unknown", 2),
                else_=3,
            )
        elif sort_key == "last_check" and latest_checked_at is not None:
            sort_expr = func.coalesce(latest_checked_at, datetime(1970, 1, 1, tzinfo=UTC))
        else:
            sort_expr = Instance.org_code

        reverse = sort_dir == "desc"
        if reverse:
            stmt = stmt.order_by(sort_expr.desc(), Instance.org_code.desc())
        else:
            stmt = stmt.order_by(sort_expr.asc(), Instance.org_code.asc())

        total = self.db.scalar(total_stmt) or 0
        offset = max(page - 1, 0) * page_size
        instances = list(self.db.scalars(stmt.limit(page_size).offset(offset)).all())

        instance_ids = [inst.instance_id for inst in instances]
        health_svc = HealthService(self.db)
        health_map = health_svc.get_latest_checks_batch(instance_ids)

        catalog_ids = {inst.catalog_item_id for inst in instances if inst.catalog_item_id}
        item_map: dict[UUID, AppCatalogItem] = {}
        release_map: dict[UUID, AppRelease] = {}
        if catalog_ids:
            items = list(
                self.db.scalars(select(AppCatalogItem).where(AppCatalogItem.catalog_id.in_(catalog_ids))).all()
            )
            item_map = {item.catalog_id: item for item in items}
            release_ids = {item.release_id for item in items}
            if release_ids:
                releases = list(self.db.scalars(select(AppRelease).where(AppRelease.release_id.in_(release_ids))).all())
                release_map = {rel.release_id: rel for rel in releases}

        rows: list[InstanceListItem] = []
        for inst in instances:
            check = health_map.get(inst.instance_id)
            health_state = health_svc.classify_health(check, now) if inst.status.value == "running" else "n/a"
            catalog_item = item_map.get(inst.catalog_item_id) if inst.catalog_item_id else None
            release = release_map.get(catalog_item.release_id) if catalog_item else None
            rows.append(
                InstanceListItem(
                    instance=inst,
                    health=check,
                    health_state=health_state,
                    health_checked_at=check.checked_at if check else None,
                    catalog_label=catalog_item.label if catalog_item else None,
                    release_version=release.version if release else None,
                )
            )
        return PagedResult(items=rows, total=total, page=page, page_size=page_size)

    def get_detail_bundle(self, instance_id: UUID) -> dict:
        """Collect instance detail data for the web UI."""
        from app.services.approval_service import ApprovalService
        from app.services.backup_service import BackupService
        from app.services.catalog_service import CatalogService
        from app.services.deploy_service import DeployService
        from app.services.domain_service import DomainService
        from app.services.feature_flag_service import FeatureFlagService
        from app.services.git_repo_service import GitRepoService
        from app.services.health_service import HealthService
        from app.services.module_service import ModuleService
        from app.services.plan_service import PlanService
        from app.services.resource_enforcement import ResourceEnforcementService
        from app.services.secret_rotation_service import SecretRotationService
        from app.services.tenant_audit_service import TenantAuditService
        from app.services.upgrade_service import UpgradeService

        instance = self.get_or_404(instance_id)
        created_at = instance.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=UTC)
        uptime_seconds = max(0, int((datetime.now(UTC) - created_at).total_seconds()))

        health_svc = HealthService(self.db)
        latest_health = health_svc.get_latest_check(instance_id)
        recent_checks = health_svc.get_recent_checks(instance_id, limit=10)

        deploy_svc = DeployService(self.db)
        latest_deploy_id = deploy_svc.get_latest_deployment_id(instance_id)
        deploy_logs = []
        if latest_deploy_id:
            deploy_logs = deploy_svc.get_deployment_logs(instance_id, latest_deploy_id)

        modules = ModuleService(self.db).get_instance_modules(instance_id)
        flags = FeatureFlagService(self.db).list_for_instance(instance_id)
        plans = PlanService(self.db).list_all()
        backups = BackupService(self.db).list_for_instance(instance_id)
        domains = DomainService(self.db).list_for_instance(instance_id)
        audit_logs = TenantAuditService(self.db).get_logs(instance_id, limit=20)
        enforcement_svc = ResourceEnforcementService(self.db)
        usage_summary = enforcement_svc.get_usage_summary(instance_id)
        compliance_violations = enforcement_svc.check_plan_compliance(instance_id)
        rotation_history = SecretRotationService(self.db).get_rotation_history(instance_id, limit=20)
        repos = GitRepoService(self.db).list_repos(active_only=True)
        catalog_items = CatalogService(self.db).list_catalog_items(active_only=True)
        catalog_map = {item.catalog_id: item for item in catalog_items}
        upgrades = UpgradeService(self.db).list_upgrades(instance_id, limit=20)

        pending_upgrade_ids = {a.upgrade_id for a in ApprovalService(self.db).get_pending(instance_id) if a.upgrade_id}

        return {
            "instance": instance,
            "latest_health": latest_health,
            "recent_checks": recent_checks,
            "deploy_logs": deploy_logs,
            "latest_deploy_id": latest_deploy_id,
            "modules": modules,
            "flags": flags,
            "plans": plans,
            "backups": backups,
            "domains": domains,
            "audit_logs": audit_logs,
            "usage_summary": usage_summary,
            "compliance_violations": compliance_violations,
            "rotation_history": rotation_history,
            "repos": repos,
            "catalog_items": catalog_items,
            "catalog_map": catalog_map,
            "upgrades": upgrades,
            "pending_upgrade_ids": pending_upgrade_ids,
            "uptime_seconds": uptime_seconds,
        }

    def resolve_catalog_repo(self, catalog_id: UUID) -> UUID:
        from app.services.catalog_service import CatalogService
        from app.services.git_repo_service import GitRepoService

        catalog_item = CatalogService(self.db).get_catalog_item(catalog_id)
        if not catalog_item or not catalog_item.is_active:
            raise ValueError("Selected catalog item is invalid")
        release = catalog_item.release
        if not release or not release.is_active:
            raise ValueError("Catalog release is invalid")
        repo = GitRepoService(self.db).get_by_id(UUID(str(release.git_repo_id)))
        if not repo or not repo.is_active:
            raise ValueError("Catalog release repo is invalid")
        return repo.repo_id

    def set_git_repo(self, instance_id: UUID, git_repo_id: UUID) -> None:
        from app.services.git_repo_service import GitRepoService

        instance = self.get_or_404(instance_id)
        repo = GitRepoService(self.db).get_by_id(git_repo_id)
        if not repo or not repo.is_active:
            raise ValueError("Selected git repository is invalid")
        instance.git_repo_id = repo.repo_id

    def set_auto_deploy(self, instance_id: UUID, enabled: bool) -> Instance:
        instance = self.get_or_404(instance_id)
        instance.auto_deploy = enabled
        self.db.flush()
        return instance

    def assign_plan(self, instance_id: UUID, plan_id: UUID | None) -> Instance:
        instance = self.get_or_404(instance_id)
        if plan_id is not None:
            from app.services.plan_service import PlanService

            plan = PlanService(self.db).get_by_id(plan_id)
            if not plan:
                raise ValueError("Plan not found")
        instance.plan_id = plan_id
        self.db.flush()
        return instance

    def create_with_catalog(
        self,
        *,
        server_id: UUID,
        org_code: str,
        org_name: str,
        catalog_item_id: UUID,
        sector_type: str | None = None,
        framework: str | None = None,
        currency: str | None = None,
        admin_email: str | None = None,
        admin_username: str | None = None,
        domain: str | None = None,
        app_port: int | None = None,
        db_port: int | None = None,
        redis_port: int | None = None,
    ) -> Instance:
        """Validate catalog item and create an instance in one step."""
        git_repo_id = self.resolve_catalog_repo(catalog_item_id)
        return self.create(
            server_id=server_id,
            org_code=org_code,
            org_name=org_name,
            sector_type=sector_type,
            framework=framework,
            currency=currency,
            admin_email=admin_email,
            admin_username=admin_username,
            domain=domain,
            app_port=app_port,
            db_port=db_port,
            redis_port=redis_port,
            git_repo_id=git_repo_id,
            catalog_item_id=catalog_item_id,
        )

    def set_git_refs(
        self,
        instance_id: UUID,
        *,
        git_branch: str | None = None,
        git_tag: str | None = None,
    ) -> Instance:
        from app.services.common import validate_git_ref

        instance = self.get_or_404(instance_id)
        if git_branch:
            instance.git_branch = validate_git_ref(git_branch, "git_branch")
        if git_tag:
            instance.git_tag = validate_git_ref(git_tag, "git_tag")
        self.db.flush()
        return instance

    def allocate_ports(self, server_id: UUID) -> tuple[int, int, int]:
        """Find next available ports for a server.

        Uses SELECT ... FOR UPDATE to prevent concurrent allocations
        from assigning the same ports.
        """
        stmt = select(Instance).where(Instance.server_id == server_id).with_for_update()
        instances = list(self.db.scalars(stmt).all())

        used_app = {inst.app_port for inst in instances}
        used_db = {inst.db_port for inst in instances}
        used_redis = {inst.redis_port for inst in instances}

        def _next_free(base: int, used: set[int]) -> int:
            port = base
            while port in used:
                port += 1
            return port

        return (
            _next_free(BASE_APP_PORT, used_app),
            _next_free(BASE_DB_PORT, used_db),
            _next_free(BASE_REDIS_PORT, used_redis),
        )

    def create(
        self,
        server_id: UUID,
        org_code: str,
        org_name: str,
        sector_type: str | None = None,
        framework: str | None = None,
        currency: str | None = None,
        admin_email: str | None = None,
        admin_username: str | None = None,
        domain: str | None = None,
        app_port: int | None = None,
        db_port: int | None = None,
        redis_port: int | None = None,
        git_repo_id: UUID | None = None,
        catalog_item_id: UUID | None = None,
    ) -> Instance:
        org_code = org_code.upper()

        # Validate org_code — used in container names and shell commands
        if not re.match(r"^[A-Z0-9_-]+$", org_code):
            raise ValueError(f"Invalid org_code: {org_code!r} — must be alphanumeric, hyphens, or underscores")

        # Auto-allocate ports if not specified
        if app_port is None or db_port is None or redis_port is None:
            auto_app, auto_db, auto_redis = self.allocate_ports(server_id)
            app_port = app_port or auto_app
            db_port = db_port or auto_db
            redis_port = redis_port or auto_redis

        slug = org_code.lower()
        org_uuid = str(uuid.uuid4())

        # Resolve deploy path and app URL
        from app.services.platform_settings import PlatformSettingsService

        ps = PlatformSettingsService(self.db)
        default_deploy = ps.get("default_deploy_path")

        from app.services.organization_service import OrganizationService

        org = OrganizationService(self.db).get_or_create(org_code, org_name)

        server = self.db.get(Server, server_id)
        deploy_path = os.path.join(default_deploy, slug)

        if domain:
            domain = _validate_domain(domain)
            app_url = f"https://{domain}"
        elif server and server.base_domain:
            domain = f"{slug}.{server.base_domain}"
            app_url = f"https://{domain}"
        else:
            app_url = f"http://localhost:{app_port}"

        instance = Instance(
            server_id=server_id,
            org_id=org.org_id,
            org_code=org_code,
            org_name=org_name,
            org_uuid=org_uuid,
            sector_type=SectorType(sector_type) if sector_type else None,
            framework=AccountingFramework(framework) if framework else None,
            currency=currency or None,
            app_port=app_port,
            db_port=db_port,
            redis_port=redis_port,
            domain=domain,
            app_url=app_url,
            admin_email=admin_email,
            admin_username=admin_username or "admin",
            deploy_path=deploy_path,
            status=InstanceStatus.provisioned,
            git_repo_id=git_repo_id,
            catalog_item_id=catalog_item_id,
        )
        self.db.add(instance)
        self.db.flush()
        if catalog_item_id:
            try:
                from app.services.catalog_service import CatalogService
                from app.services.feature_flag_service import FeatureFlagService
                from app.services.module_service import ModuleService

                catalog_item = CatalogService(self.db).get_catalog_item(catalog_item_id)
                if catalog_item and catalog_item.bundle:
                    bundle = catalog_item.bundle
                    mod_svc = ModuleService(self.db)
                    flag_svc = FeatureFlagService(self.db)
                    for slug in bundle.module_slugs or []:
                        mod = mod_svc.get_by_slug(slug)
                        if mod:
                            mod_svc.set_module_enabled(instance.instance_id, mod.module_id, True)
                    for flag_key in bundle.flag_keys or []:
                        flag_svc.set_flag(instance.instance_id, flag_key, "true")
            except Exception:
                logger.exception("Failed to apply catalog bundle for instance %s", instance.instance_id)
        logger.info("Created instance: %s (%s)", org_code, instance.instance_id)
        return instance

    def update_status(self, instance_id: UUID, status: InstanceStatus) -> Instance:
        instance = self.get_or_404(instance_id)
        instance.status = status
        self.db.flush()
        return instance

    def _exec_compose(self, instance: Instance, command: str) -> None:
        server = self.db.get(Server, instance.server_id)
        if not server or not instance.deploy_path:
            raise ValueError("Instance server or deploy path not configured")
        ssh = get_ssh_for_server(server)
        result = ssh.exec_command(command, cwd=instance.deploy_path)
        if not result.ok:
            detail = (result.stderr or result.stdout or "Unknown error")[:2000]
            raise ValueError(detail)

    def start_instance(self, instance_id: UUID) -> Instance:
        instance = self.get_or_404(instance_id)
        if instance.status != InstanceStatus.stopped:
            raise ValueError("Instance is not stopped")
        try:
            self._exec_compose(instance, "docker compose up -d")
            instance.status = InstanceStatus.running
        except Exception:
            instance.status = InstanceStatus.error
            self.db.flush()
            raise
        self.db.flush()
        return instance

    def stop_instance(self, instance_id: UUID) -> Instance:
        instance = self.get_or_404(instance_id)
        if instance.status != InstanceStatus.running:
            raise ValueError("Instance is not running")
        try:
            self._exec_compose(instance, "docker compose down")
            instance.status = InstanceStatus.stopped
        except Exception:
            instance.status = InstanceStatus.error
            self.db.flush()
            raise
        self.db.flush()
        return instance

    def restart_instance(self, instance_id: UUID) -> Instance:
        instance = self.get_or_404(instance_id)
        if instance.status != InstanceStatus.running:
            raise ValueError("Instance is not running")
        try:
            self._exec_compose(instance, "docker compose restart")
        except Exception:
            instance.status = InstanceStatus.error
            self.db.flush()
            raise
        self.db.flush()
        return instance

    def migrate_instance(self, instance_id: UUID) -> Instance:
        """Run alembic migrations inside an instance's app container."""
        import shlex

        instance = self.get_or_404(instance_id)
        slug = instance.org_code.lower()
        if not re.match(r"^[a-zA-Z0-9_-]+$", slug):
            raise ValueError(f"Invalid org_code slug: {slug!r}")
        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found for instance")
        ssh = get_ssh_for_server(server)
        container = f"dotmac_{shlex.quote(slug)}_app"
        result = ssh.exec_command(
            f"docker exec {container} alembic upgrade heads",
            timeout=120,
        )
        if not result.ok:
            detail = (result.stderr or result.stdout or "Migration failed")[:2000]
            raise ValueError(detail)
        logger.info("Ran migrations for instance %s", instance.org_code)
        return instance

    def delete(self, instance_id: UUID) -> None:
        instance = self.get_or_404(instance_id)
        self.db.delete(instance)
        self.db.flush()

    # ---------------------------------------------------------------
    # File generation (mirrors bootstrap_instance.py from dotmac ERP)
    # ---------------------------------------------------------------

    def generate_env(
        self,
        instance: Instance,
        admin_password: str,
        existing_env: dict[str, str] | None = None,
        image_ref: str | None = None,
    ) -> str:
        """Generate .env file content for an instance.

        Args:
            instance: The instance to generate for.
            admin_password: Admin password to embed.
            existing_env: Parsed dict from the existing .env file on disk.
                          When provided, critical secrets (TOTP_ENCRYPTION_KEY,
                          POSTGRES_PASSWORD, REDIS_PASSWORD, JWT_SECRET) and
                          any custom variables not in the template are preserved.
            image_ref: Container image reference (e.g. ``ghcr.io/org/repo:tag``).
                       When provided, the ``DOTMAC_IMAGE`` variable is emitted
                       so that ``docker-compose.yml`` can reference it.
        """
        existing = existing_env or {}
        quote = _quote_env_value

        # --- Preserve or generate secrets ---
        pg_password = existing.get("POSTGRES_PASSWORD") or secrets.token_urlsafe(16)
        redis_password = existing.get("REDIS_PASSWORD") or secrets.token_urlsafe(16)
        jwt_secret = existing.get("JWT_SECRET") or secrets.token_urlsafe(32)
        bao_token = existing.get("OPENBAO_TOKEN") or secrets.token_urlsafe(16)

        if existing.get("TOTP_ENCRYPTION_KEY"):
            totp_key = existing["TOTP_ENCRYPTION_KEY"]
        else:
            try:
                from cryptography.fernet import Fernet

                totp_key = Fernet.generate_key().decode()
            except ImportError:
                import base64

                totp_key = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode()

        slug = instance.org_code.lower()
        db_name = f"dotmac_{slug}"
        org_name_comment = _sanitize_env_comment(instance.org_name)
        org_code_comment = _sanitize_env_comment(instance.org_code)

        # --- Build the template env ---
        env_content = textwrap.dedent(f"""\
            # DotMac ERP Instance: {org_name_comment} ({org_code_comment})
            # Generated by DotMac Platform

            INSTANCE_ORG_CODE={quote(instance.org_code)}
            DEFAULT_ORGANIZATION_ID={quote(instance.org_uuid)}

            APP_PORT={instance.app_port}
            DB_PORT={instance.db_port}
            REDIS_PORT={instance.redis_port}
            OPENBAO_PORT=8200

            POSTGRES_USER=postgres
            POSTGRES_PASSWORD={quote(pg_password)}
            POSTGRES_DB={quote(db_name)}
            DATABASE_URL={quote(f"postgresql+psycopg://postgres:{pg_password}@db:5432/{db_name}")}

            REDIS_PASSWORD={quote(redis_password)}
            REDIS_URL={quote(f"redis://:{redis_password}@redis:6379/0")}
            CELERY_BROKER_URL={quote(f"redis://:{redis_password}@redis:6379/0")}
            CELERY_RESULT_BACKEND={quote(f"redis://:{redis_password}@redis:6379/1")}
            CELERY_TIMEZONE=UTC

            JWT_SECRET={quote(jwt_secret)}
            JWT_ALGORITHM=HS256
            JWT_ACCESS_TTL_MINUTES=60
            JWT_REFRESH_TTL_DAYS=30
            TOTP_ISSUER=dotmac_erp
            TOTP_ENCRYPTION_KEY={quote(totp_key)}

            REFRESH_COOKIE_NAME=refresh_token
            REFRESH_COOKIE_SECURE=true
            REFRESH_COOKIE_SAMESITE=strict
            REFRESH_COOKIE_DOMAIN=
            REFRESH_COOKIE_PATH=/

            OPENBAO_ADDR=http://openbao:8200
            OPENBAO_TOKEN={quote(bao_token)}
            OPENBAO_ALLOW_INSECURE=true

            BRAND_NAME={quote(instance.org_name)}
            BRAND_TAGLINE=
            BRAND_LOGO_URL=
            APP_URL={quote(instance.app_url or "")}
            DEFAULT_FUNCTIONAL_CURRENCY_CODE={quote(instance.currency or "")}
            DEFAULT_PRESENTATION_CURRENCY_CODE={quote(instance.currency or "")}

            GUNICORN_WORKERS=2
            GUNICORN_LOG_LEVEL=info

            BOOTSTRAP_ORG_CODE={quote(instance.org_code)}
            BOOTSTRAP_ORG_NAME={quote(instance.org_name)}
            BOOTSTRAP_SECTOR_TYPE={quote(instance.sector_type.value if instance.sector_type else "")}
            BOOTSTRAP_FRAMEWORK={quote(instance.framework.value if instance.framework else "")}
            BOOTSTRAP_CURRENCY={quote(instance.currency or "")}
            BOOTSTRAP_ADMIN_EMAIL={quote(instance.admin_email or "")}
            BOOTSTRAP_ADMIN_USERNAME={quote(instance.admin_username or "admin")}
            BOOTSTRAP_ADMIN_PASSWORD={quote(admin_password)}

            # ERPNext Integration (optional)
            ERPNEXT_URL={quote(existing.get("ERPNEXT_URL", ""))}
            ERPNEXT_API_KEY={quote(existing.get("ERPNEXT_API_KEY", ""))}
            ERPNEXT_API_SECRET={quote(existing.get("ERPNEXT_API_SECRET", ""))}

            # Splynx Integration (optional)
            SPLYNX_API_URL={quote(existing.get("SPLYNX_API_URL", ""))}
            SPLYNX_API_KEY={quote(existing.get("SPLYNX_API_KEY", ""))}
            SPLYNX_API_SECRET={quote(existing.get("SPLYNX_API_SECRET", ""))}
        """)

        # --- Inject pre-built image ref ---
        if image_ref:
            env_content += f"\n# Pre-built container image\nDOTMAC_IMAGE={quote(image_ref)}\n"

        # --- Inject feature flags ---
        try:
            from app.services.feature_flag_service import FeatureFlagService

            flag_svc = FeatureFlagService(self.db)
            flag_vars = flag_svc.get_env_vars(instance.instance_id)
            if flag_vars:
                env_content += "\n# Feature Flags\n"
                for fk, fv in sorted(flag_vars.items()):
                    env_content += f"{fk}={quote(fv)}\n"
        except Exception:
            pass  # Feature flags are optional

        # --- Inject plan limits ---
        if instance.plan_id:
            try:
                from app.services.plan_service import PlanService

                plan_svc = PlanService(self.db)
                plan = plan_svc.get_by_id(instance.plan_id)
                if plan:
                    env_content += "\n# Plan Limits\n"
                    env_content += f"PLAN_NAME={quote(plan.name)}\n"
                    if plan.max_users:
                        env_content += f"MAX_USERS={plan.max_users}\n"
                    if plan.max_storage_gb:
                        env_content += f"MAX_STORAGE_GB={plan.max_storage_gb}\n"
            except Exception:
                pass

        # --- Preserve any custom variables not in the template ---
        template_keys = set(parse_env_file(env_content).keys())
        custom_lines: list[str] = []
        for key, value in existing.items():
            if key not in template_keys:
                custom_lines.append(f"{key}={quote(value)}")

        if custom_lines:
            env_content += "\n# Custom variables (preserved from previous deploy)\n"
            env_content += "\n".join(custom_lines) + "\n"

        return env_content

    def generate_docker_compose(self, instance: Instance) -> str:
        """Generate docker-compose.yml for an instance.

        All deployments use registry images via ``image: ${{DOTMAC_IMAGE}}``.
        """
        slug = instance.org_code.lower()
        _svc_src = "image: ${DOTMAC_IMAGE}"

        return textwrap.dedent(f"""\
            # DotMac ERP Instance: {instance.org_code}
            # Generated by DotMac Platform

            services:
              openbao:
                image: openbao/openbao:2
                container_name: dotmac_{slug}_openbao
                restart: unless-stopped
                cap_add:
                  - IPC_LOCK
                environment:
                  BAO_DEV_ROOT_TOKEN_ID: ${{OPENBAO_TOKEN}}
                  BAO_DEV_LISTEN_ADDRESS: 0.0.0.0:8200
                volumes:
                  - openbao_data:/openbao/data
                command: server -dev
                healthcheck:
                  test: ["CMD", "wget", "--spider", "-q", "http://127.0.0.1:8200/v1/sys/health"]
                  interval: 10s
                  timeout: 5s
                  retries: 3

              app:
                {_svc_src}
                container_name: dotmac_{slug}_app
                restart: unless-stopped
                ports:
                  - "${{APP_PORT}}:8002"
                env_file:
                  - .env
                environment:
                  DATABASE_URL: postgresql+psycopg://postgres:${{POSTGRES_PASSWORD}}@db:5432/${{POSTGRES_DB}}
                  REDIS_URL: redis://:${{REDIS_PASSWORD}}@redis:6379/0
                  CELERY_BROKER_URL: redis://:${{REDIS_PASSWORD}}@redis:6379/0
                  CELERY_RESULT_BACKEND: redis://:${{REDIS_PASSWORD}}@redis:6379/1
                  OPENBAO_ADDR: http://openbao:8200
                  OPENBAO_TOKEN: ${{OPENBAO_TOKEN}}
                  OPENBAO_ALLOW_INSECURE: "true"
                  GUNICORN_WORKERS: "${{GUNICORN_WORKERS:-2}}"
                depends_on:
                  db:
                    condition: service_healthy
                  redis:
                    condition: service_started
                  openbao:
                    condition: service_healthy
                volumes:
                  - dotmac_logs:/var/log/dotmac
                healthcheck:
                  test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8002/health')"]
                  interval: 30s
                  timeout: 10s
                  retries: 3
                  start_period: 40s
                command: ["gunicorn", "-c", "gunicorn.conf.py", "app.main:app"]

              worker:
                {_svc_src}
                container_name: dotmac_{slug}_worker
                restart: unless-stopped
                env_file:
                  - .env
                environment:
                  DATABASE_URL: postgresql+psycopg://postgres:${{POSTGRES_PASSWORD}}@db:5432/${{POSTGRES_DB}}
                  REDIS_URL: redis://:${{REDIS_PASSWORD}}@redis:6379/0
                  CELERY_BROKER_URL: redis://:${{REDIS_PASSWORD}}@redis:6379/0
                  CELERY_RESULT_BACKEND: redis://:${{REDIS_PASSWORD}}@redis:6379/1
                depends_on:
                  db:
                    condition: service_healthy
                  redis:
                    condition: service_started
                command: ["celery", "-A", "app.celery_app", "worker", "-l", "info"]

              beat:
                {_svc_src}
                container_name: dotmac_{slug}_beat
                restart: unless-stopped
                env_file:
                  - .env
                environment:
                  DATABASE_URL: postgresql+psycopg://postgres:${{POSTGRES_PASSWORD}}@db:5432/${{POSTGRES_DB}}
                  REDIS_URL: redis://:${{REDIS_PASSWORD}}@redis:6379/0
                  CELERY_BROKER_URL: redis://:${{REDIS_PASSWORD}}@redis:6379/0
                  CELERY_RESULT_BACKEND: redis://:${{REDIS_PASSWORD}}@redis:6379/1
                depends_on:
                  db:
                    condition: service_healthy
                  redis:
                    condition: service_started
                command: ["celery", "-A", "app.celery_app", "beat", "-l", "info"]

              db:
                image: postgres:16
                container_name: dotmac_{slug}_db
                restart: unless-stopped
                environment:
                  POSTGRES_USER: ${{POSTGRES_USER:-postgres}}
                  POSTGRES_PASSWORD: ${{POSTGRES_PASSWORD}}
                  POSTGRES_DB: ${{POSTGRES_DB}}
                ports:
                  - "${{DB_PORT}}:5432"
                volumes:
                  - db_data:/var/lib/postgresql/data
                healthcheck:
                  test: ["CMD-SHELL", "pg_isready -U ${{POSTGRES_USER:-postgres}} -d ${{POSTGRES_DB}}"]
                  interval: 10s
                  timeout: 5s
                  retries: 5

              redis:
                image: redis:7
                container_name: dotmac_{slug}_redis
                restart: unless-stopped
                command: ["redis-server", "--requirepass", "${{REDIS_PASSWORD}}"]
                ports:
                  - "${{REDIS_PORT}}:6379"

            volumes:
              db_data:
              openbao_data:
              dotmac_logs:
        """)

    def generate_setup_script(self, instance: Instance) -> str:
        """Generate setup.sh for an instance."""
        app_up_cmd = "docker compose up -d app worker beat"
        app_step_label = "Pulling and starting app containers..."
        return textwrap.dedent(f"""\
            #!/usr/bin/env bash
            set -euo pipefail

            SCRIPT_DIR="$(cd "$(dirname "${{BASH_SOURCE[0]}}")" && pwd)"
            cd "$SCRIPT_DIR"

            echo ""
            echo "=== Setting up DotMac ERP instance: {instance.org_code} ==="
            echo ""

            echo "[1/4] Starting infrastructure..."
            docker compose up -d db redis openbao
            echo "  Waiting for database to be healthy..."
            sleep 5

            echo "[2/4] {app_step_label}"
            {app_up_cmd}

            echo "[3/4] Running database migrations..."
            docker compose exec -T app alembic upgrade head

            echo "[4/4] Bootstrapping organization and admin user..."
            docker compose exec -T app python bootstrap_db.py

            echo ""
            echo "=== Instance ready ==="
            APP_PORT=$(grep "^APP_PORT=" .env | cut -d= -f2)
            echo "  URL: {instance.app_url or "http://localhost:$APP_PORT"}"
            echo ""
        """)

    def generate_bootstrap_db_script(self) -> str:
        """Generate bootstrap_db.py that runs inside the container to seed org + admin."""
        return textwrap.dedent('''\
            #!/usr/bin/env python3
            """
            Bootstrap Database — Seeds organization, admin user, and RBAC.

            Runs inside the app container after migrations:
                docker compose exec -T app python bootstrap_db.py
            """
            import os
            import sys

            from dotenv import load_dotenv

            load_dotenv()

            # Add project root to path (we're running from /app inside container)
            sys.path.insert(0, "/app")

            from app.db import SessionLocal
            from app.models.auth import AuthProvider, UserCredential
            from app.models.finance.core_org.organization import (
                AccountingFramework,
                Organization,
                SectorType,
            )
            from app.models.person import Person
            from app.models.rbac import Permission, PersonRole, Role, RolePermission
            from app.services.auth_flow import hash_password
            from scripts.seed_rbac import DEFAULT_PERMISSIONS, DEFAULT_ROLES


            def main():
                org_id = os.environ["DEFAULT_ORGANIZATION_ID"]
                org_code = os.environ["BOOTSTRAP_ORG_CODE"]
                org_name = os.environ["BOOTSTRAP_ORG_NAME"]
                sector_type = os.environ.get("BOOTSTRAP_SECTOR_TYPE", "PRIVATE")
                framework = os.environ.get("BOOTSTRAP_FRAMEWORK", "IFRS")
                currency = os.environ.get("BOOTSTRAP_CURRENCY", "NGN")
                admin_email = os.environ.get("BOOTSTRAP_ADMIN_EMAIL", "")
                admin_username = os.environ.get("BOOTSTRAP_ADMIN_USERNAME", "admin")
                admin_password = os.environ.get("BOOTSTRAP_ADMIN_PASSWORD", "changeme123")

                db = SessionLocal()
                try:
                    # --- 1. Create Organization (only for ERP instances) ---
                    org = None
                    if sector_type and framework and currency:
                        org = db.query(Organization).filter(
                            Organization.organization_code == org_code
                        ).first()

                        if not org:
                            from uuid import UUID
                            is_public = sector_type in ("PUBLIC", "NGO")

                            org = Organization(
                                organization_id=UUID(org_id),
                                organization_code=org_code,
                                legal_name=org_name,
                                sector_type=SectorType(sector_type),
                                accounting_framework=AccountingFramework(framework),
                                fund_accounting_enabled=is_public,
                                commitment_control_enabled=(sector_type == "PUBLIC"),
                                functional_currency_code=currency,
                                presentation_currency_code=currency,
                                fiscal_year_end_month=12,
                                fiscal_year_end_day=31,
                                is_active=True,
                            )
                            db.add(org)
                            db.flush()
                            print(f"  Created organization: {org_name} ({org_code})")
                            print(f"    ID:        {org_id}")
                            print(f"    Sector:    {sector_type}")
                            print(f"    Framework: {framework}")
                            print(f"    Currency:  {currency}")
                        else:
                            print(f"  Organization exists: {org_code}")
                    else:
                        print(f"  Skipping organization creation (non-ERP instance)")

                    # --- 2. Seed RBAC (permissions + roles) ---
                    print("  Setting up RBAC...")
                    for key, description in DEFAULT_PERMISSIONS:
                        perm = db.query(Permission).filter(Permission.key == key).first()
                        if not perm:
                            perm = Permission(key=key, description=description, is_active=True)
                            db.add(perm)
                    db.flush()
                    print(f"    Permissions: {len(DEFAULT_PERMISSIONS)}")

                    for name, description in DEFAULT_ROLES:
                        role = db.query(Role).filter(Role.name == name).first()
                        if not role:
                            role = Role(name=name, description=description, is_active=True)
                            db.add(role)
                    db.flush()
                    print(f"    Roles: {len(DEFAULT_ROLES)}")

                    admin_role = db.query(Role).filter(Role.name == "admin").first()
                    all_perms = db.query(Permission).all()
                    for perm in all_perms:
                        link = (
                            db.query(RolePermission)
                            .filter(
                                RolePermission.role_id == admin_role.id,
                                RolePermission.permission_id == perm.id,
                            )
                            .first()
                        )
                        if not link:
                            db.add(RolePermission(role_id=admin_role.id, permission_id=perm.id))
                    db.flush()
                    print(f"    Admin role: {len(all_perms)} permissions")

                    # --- 3. Create admin user ---
                    if not admin_email:
                        admin_email = f"{admin_username}@{org_code.lower()}.local"

                    person = db.query(Person).filter(Person.email == admin_email).first()
                    if not person:
                        person = Person(
                            first_name="Admin",
                            last_name=org_code.title(),
                            email=admin_email,
                            organization_id=org.organization_id,
                        )
                        db.add(person)
                        db.flush()
                        print(f"  Created admin person: {admin_email}")
                    else:
                        print(f"  Admin person exists: {admin_email}")

                    credential = (
                        db.query(UserCredential)
                        .filter(
                            UserCredential.person_id == person.id,
                            UserCredential.provider == AuthProvider.local,
                        )
                        .first()
                    )
                    if not credential:
                        credential = UserCredential(
                            person_id=person.id,
                            provider=AuthProvider.local,
                            username=admin_username,
                            password_hash=hash_password(admin_password),
                            must_change_password=False,
                        )
                        db.add(credential)
                        db.flush()
                        print(f"  Created credential: {admin_username}")
                    else:
                        print(f"  Credential exists: {credential.username}")

                    # Assign admin role
                    link = (
                        db.query(PersonRole)
                        .filter(
                            PersonRole.person_id == person.id,
                            PersonRole.role_id == admin_role.id,
                        )
                        .first()
                    )
                    if not link:
                        db.add(PersonRole(person_id=person.id, role_id=admin_role.id))

                    db.commit()
                    print("\\n=== Bootstrap complete ===")
                    print(f"  Login at: {os.environ.get('APP_URL', 'http://localhost')}")
                    print(f"  Username: {admin_username}")

                except Exception as e:
                    db.rollback()
                    print(f"Error: {e}")
                    raise
                finally:
                    db.close()


            if __name__ == "__main__":
                main()
        ''')

    def provision_files(self, instance: Instance, admin_password: str, git_ref: str | None = None) -> dict:
        """Generate all instance files and write them to the deploy path.

        Reads the existing .env (if any) so that critical secrets and custom
        variables are preserved across redeploys.

        Args:
            instance: The instance to provision.
            admin_password: Admin password to embed in .env.
            git_ref: Deployment-specific git ref override.  Passed through to
                     ``resolve_image_ref`` so that the ``DOTMAC_IMAGE`` value
                     in ``.env`` matches the tag that will actually be pulled.
        """
        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found")

        ssh = get_ssh_for_server(server)
        deploy_path = instance.deploy_path
        if not deploy_path:
            raise ValueError("Deploy path not configured")

        # Resolve container image ref from the repo's registry URL
        image_ref: str | None = None
        try:
            from app.services.git_repo_service import GitRepoService

            repo = GitRepoService(self.db).get_repo_for_instance(instance.instance_id)
            if repo and repo.registry_url:
                image_ref = GitRepoService.resolve_image_ref(repo, git_ref=git_ref, instance=instance)
                logger.info("Using container image for %s: %s", instance.org_code, image_ref)
        except Exception:
            logger.debug("Could not resolve container image ref for %s", instance.org_code, exc_info=True)

        # Create deploy directory
        ssh.sftp_mkdir_p(deploy_path)

        # Read existing .env to preserve secrets + custom vars
        existing_env: dict[str, str] | None = None
        env_path = os.path.join(deploy_path, ".env")
        existing_content = ssh.sftp_read_string(env_path)
        if existing_content:
            existing_env = parse_env_file(existing_content)
            logger.info(
                "Read existing .env for %s (%d vars, preserving secrets)",
                instance.org_code,
                len(existing_env),
            )

        # Generate and write files
        env_content = self.generate_env(instance, admin_password, existing_env, image_ref=image_ref)
        ssh.sftp_put_string(env_content, env_path)

        compose_content = self.generate_docker_compose(instance)
        ssh.sftp_put_string(compose_content, os.path.join(deploy_path, "docker-compose.yml"))

        setup_content = self.generate_setup_script(instance)
        ssh.sftp_put_string(setup_content, os.path.join(deploy_path, "setup.sh"), mode=0o755)

        bootstrap_content = self.generate_bootstrap_db_script()
        ssh.sftp_put_string(bootstrap_content, os.path.join(deploy_path, "bootstrap_db.py"))

        logger.info("Provisioned files for %s at %s", instance.org_code, deploy_path)
        return {
            "deploy_path": deploy_path,
            "files": [".env", "docker-compose.yml", "setup.sh", "bootstrap_db.py"],
        }
