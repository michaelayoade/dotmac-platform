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
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.instance import (
    AccountingFramework,
    Instance,
    InstanceStatus,
    SectorType,
)
from app.models.server import Server
from app.services.ssh_service import get_ssh_for_server

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


class InstanceService:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> list[Instance]:
        stmt = select(Instance).order_by(Instance.created_at.desc())
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
        sector_type: str = "PRIVATE",
        framework: str = "IFRS",
        currency: str = "NGN",
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
            org_code=org_code,
            org_name=org_name,
            org_uuid=org_uuid,
            sector_type=SectorType(sector_type),
            framework=AccountingFramework(framework),
            currency=currency,
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
    ) -> str:
        """Generate .env file content for an instance.

        Args:
            instance: The instance to generate for.
            admin_password: Admin password to embed.
            existing_env: Parsed dict from the existing .env file on disk.
                          When provided, critical secrets (TOTP_ENCRYPTION_KEY,
                          POSTGRES_PASSWORD, REDIS_PASSWORD, JWT_SECRET) and
                          any custom variables not in the template are preserved.
        """
        from app.services.platform_settings import PlatformSettingsService

        ps = PlatformSettingsService(self.db)
        source_path = ps.get("dotmac_source_path")

        existing = existing_env or {}

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

        # --- Build the template env ---
        env_content = textwrap.dedent(f"""\
            # DotMac ERP Instance: {instance.org_name} ({instance.org_code})
            # Generated by DotMac Platform

            INSTANCE_ORG_CODE={instance.org_code}
            DEFAULT_ORGANIZATION_ID={instance.org_uuid}
            APP_BUILD_CONTEXT={source_path}

            APP_PORT={instance.app_port}
            DB_PORT={instance.db_port}
            REDIS_PORT={instance.redis_port}
            OPENBAO_PORT=8200

            POSTGRES_USER=postgres
            POSTGRES_PASSWORD={pg_password}
            POSTGRES_DB={db_name}
            DATABASE_URL=postgresql+psycopg://postgres:{pg_password}@db:5432/{db_name}

            REDIS_PASSWORD={redis_password}
            REDIS_URL=redis://:{redis_password}@redis:6379/0
            CELERY_BROKER_URL=redis://:{redis_password}@redis:6379/0
            CELERY_RESULT_BACKEND=redis://:{redis_password}@redis:6379/1
            CELERY_TIMEZONE=UTC

            JWT_SECRET={jwt_secret}
            JWT_ALGORITHM=HS256
            JWT_ACCESS_TTL_MINUTES=60
            JWT_REFRESH_TTL_DAYS=30
            TOTP_ISSUER=dotmac_erp
            TOTP_ENCRYPTION_KEY={totp_key}

            REFRESH_COOKIE_NAME=refresh_token
            REFRESH_COOKIE_SECURE=true
            REFRESH_COOKIE_SAMESITE=strict
            REFRESH_COOKIE_DOMAIN=
            REFRESH_COOKIE_PATH=/

            OPENBAO_ADDR=http://openbao:8200
            OPENBAO_TOKEN={bao_token}
            OPENBAO_ALLOW_INSECURE=true

            BRAND_NAME={instance.org_name}
            BRAND_TAGLINE=
            BRAND_LOGO_URL=
            APP_URL={instance.app_url or ""}
            DEFAULT_FUNCTIONAL_CURRENCY_CODE={instance.currency}
            DEFAULT_PRESENTATION_CURRENCY_CODE={instance.currency}

            GUNICORN_WORKERS=2
            GUNICORN_LOG_LEVEL=info

            BOOTSTRAP_ORG_CODE={instance.org_code}
            BOOTSTRAP_ORG_NAME={instance.org_name}
            BOOTSTRAP_SECTOR_TYPE={instance.sector_type.value}
            BOOTSTRAP_FRAMEWORK={instance.framework.value}
            BOOTSTRAP_CURRENCY={instance.currency}
            BOOTSTRAP_ADMIN_EMAIL={instance.admin_email or ""}
            BOOTSTRAP_ADMIN_USERNAME={instance.admin_username or "admin"}
            BOOTSTRAP_ADMIN_PASSWORD={admin_password}

            # ERPNext Integration (optional)
            ERPNEXT_URL={existing.get("ERPNEXT_URL", "")}
            ERPNEXT_API_KEY={existing.get("ERPNEXT_API_KEY", "")}
            ERPNEXT_API_SECRET={existing.get("ERPNEXT_API_SECRET", "")}

            # Splynx Integration (optional)
            SPLYNX_API_URL={existing.get("SPLYNX_API_URL", "")}
            SPLYNX_API_KEY={existing.get("SPLYNX_API_KEY", "")}
            SPLYNX_API_SECRET={existing.get("SPLYNX_API_SECRET", "")}
        """)

        # --- Inject feature flags ---
        try:
            from app.services.feature_flag_service import FeatureFlagService

            flag_svc = FeatureFlagService(self.db)
            flag_vars = flag_svc.get_env_vars(instance.instance_id)
            if flag_vars:
                env_content += "\n# Feature Flags\n"
                for fk, fv in sorted(flag_vars.items()):
                    env_content += f"{fk}={fv}\n"
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
                    env_content += f"PLAN_NAME={plan.name}\n"
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
                custom_lines.append(f"{key}={value}")

        if custom_lines:
            env_content += "\n# Custom variables (preserved from previous deploy)\n"
            env_content += "\n".join(custom_lines) + "\n"

        return env_content

    def generate_docker_compose(self, instance: Instance) -> str:
        """Generate docker-compose.yml for an instance."""
        slug = instance.org_code.lower()
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
                build: ${{APP_BUILD_CONTEXT:-./../..}}
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
                build: ${{APP_BUILD_CONTEXT:-./../..}}
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
                build: ${{APP_BUILD_CONTEXT:-./../..}}
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

            echo "[2/4] Building and starting app containers..."
            docker compose up -d --build app worker beat

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
                    # --- 1. Create Organization ---
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

    def provision_files(self, instance: Instance, admin_password: str) -> dict:
        """Generate all instance files and write them to the deploy path.

        Reads the existing .env (if any) so that critical secrets and custom
        variables are preserved across redeploys.
        """
        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found")

        ssh = get_ssh_for_server(server)
        deploy_path = instance.deploy_path
        if not deploy_path:
            raise ValueError("Deploy path not configured")

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
        env_content = self.generate_env(instance, admin_password, existing_env)
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
