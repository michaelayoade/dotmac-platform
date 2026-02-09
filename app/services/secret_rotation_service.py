"""Secret Rotation Service — rotate per-instance secrets safely."""

from __future__ import annotations

import logging
import re
import secrets
import shlex
import time
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.instance import Instance
from app.models.secret_rotation import RotationStatus, SecretRotationLog
from app.models.server import Server
from app.services.instance_service import parse_env_file
from app.services.ssh_service import get_ssh_for_server

logger = logging.getLogger(__name__)

SECRET_NAMES = [
    "POSTGRES_PASSWORD",
    "REDIS_PASSWORD",
    "JWT_SECRET",
    "TOTP_ENCRYPTION_KEY",
    "OPENBAO_TOKEN",
]
SECRET_NAME_SET = set(SECRET_NAMES)


class SecretRotationService:
    def __init__(self, db: Session):
        self.db = db

    def rotate_secret(
        self,
        instance_id: UUID,
        secret_name: str,
        rotated_by: str | None = None,
        confirm_destructive: bool = False,
    ) -> SecretRotationLog:
        if secret_name not in SECRET_NAME_SET:
            raise ValueError(f"Unknown secret: {secret_name}")
        if secret_name == "TOTP_ENCRYPTION_KEY" and not confirm_destructive:
            raise ValueError("TOTP_ENCRYPTION_KEY rotation is destructive; confirm_destructive=true required")

        instance = self._get_instance(instance_id)
        server = self._get_server(instance)
        ssh = get_ssh_for_server(server)

        log = SecretRotationLog(
            instance_id=instance.instance_id,
            secret_name=secret_name,
            status=RotationStatus.pending,
            rotated_by=rotated_by,
        )
        self.db.add(log)
        self.db.flush()

        log.status = RotationStatus.running
        log.started_at = datetime.now(UTC)
        self.db.flush()

        try:
            env_path = self._env_path(instance)
            env_content = ssh.sftp_read_string(env_path) or ""
            if not env_content.strip():
                raise ValueError("Missing .env file for instance")

            env = parse_env_file(env_content)
            updates = {}

            if secret_name == "POSTGRES_PASSWORD":
                new_password = secrets.token_urlsafe(16)
                self._rotate_postgres_password(instance, ssh, new_password)
                db_name = env.get("POSTGRES_DB") or f"dotmac_{instance.org_code.lower()}"
                updates.update(
                    {
                        "POSTGRES_PASSWORD": new_password,
                        "DATABASE_URL": f"postgresql+psycopg://postgres:{new_password}@db:5432/{db_name}",
                    }
                )
                env_content = _update_env_content(env_content, updates)
                ssh.sftp_put_string(env_content, env_path)
                self._recreate_services(instance, ssh, ["app", "worker", "beat"])

            elif secret_name == "REDIS_PASSWORD":
                new_password = secrets.token_urlsafe(16)
                old_password = env.get("REDIS_PASSWORD")
                self._rotate_redis_password(instance, ssh, old_password, new_password)
                updates.update(
                    {
                        "REDIS_PASSWORD": new_password,
                        "REDIS_URL": f"redis://:{new_password}@redis:6379/0",
                        "CELERY_BROKER_URL": f"redis://:{new_password}@redis:6379/0",
                        "CELERY_RESULT_BACKEND": f"redis://:{new_password}@redis:6379/1",
                    }
                )
                env_content = _update_env_content(env_content, updates)
                ssh.sftp_put_string(env_content, env_path)
                self._recreate_services(instance, ssh, ["app", "worker", "beat"])

            elif secret_name == "JWT_SECRET":
                new_secret = secrets.token_urlsafe(32)
                updates.update({"JWT_SECRET": new_secret})
                env_content = _update_env_content(env_content, updates)
                ssh.sftp_put_string(env_content, env_path)
                self._recreate_services(instance, ssh, ["app"])

            elif secret_name == "TOTP_ENCRYPTION_KEY":
                new_key = _generate_totp_key()
                updates.update({"TOTP_ENCRYPTION_KEY": new_key})
                env_content = _update_env_content(env_content, updates)
                ssh.sftp_put_string(env_content, env_path)
                self._recreate_services(instance, ssh, ["app"])

            elif secret_name == "OPENBAO_TOKEN":
                new_token = secrets.token_urlsafe(16)
                updates.update({"OPENBAO_TOKEN": new_token})
                env_content = _update_env_content(env_content, updates)
                ssh.sftp_put_string(env_content, env_path)
                self._recreate_services(instance, ssh, ["openbao", "app", "worker", "beat"])

            self._verify_health(instance)
            log.status = RotationStatus.success
            log.completed_at = datetime.now(UTC)
            self.db.flush()
            return log

        except Exception as e:
            log.status = RotationStatus.failed
            log.error_message = str(e)[:2000]
            log.completed_at = datetime.now(UTC)
            self.db.flush()
            raise

    def rotate_all(
        self,
        instance_id: UUID,
        rotated_by: str | None = None,
        confirm_destructive: bool = False,
    ) -> list[SecretRotationLog]:
        if not confirm_destructive and "TOTP_ENCRYPTION_KEY" in SECRET_NAME_SET:
            raise ValueError("rotate-all requires confirm_destructive=true (includes TOTP_ENCRYPTION_KEY)")

        logs: list[SecretRotationLog] = []
        for secret_name in SECRET_NAMES:
            try:
                log = self.rotate_secret(
                    instance_id,
                    secret_name,
                    rotated_by=rotated_by,
                    confirm_destructive=confirm_destructive,
                )
                logs.append(log)
            except Exception as e:
                logger.warning("Secret rotation failed for %s: %s", secret_name, e)
                # log already updated to failed in rotate_secret
                log = self.db.scalar(
                    select(SecretRotationLog)
                    .where(SecretRotationLog.instance_id == instance_id)
                    .where(SecretRotationLog.secret_name == secret_name)
                    .order_by(SecretRotationLog.created_at.desc())
                )
                if log:
                    logs.append(log)
        return logs

    def get_rotation_history(
        self,
        instance_id: UUID,
        limit: int = 25,
        offset: int = 0,
    ) -> list[SecretRotationLog]:
        stmt = (
            select(SecretRotationLog)
            .where(SecretRotationLog.instance_id == instance_id)
            .order_by(SecretRotationLog.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(stmt).all())

    def _get_instance(self, instance_id: UUID) -> Instance:
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError("Instance not found")
        if not instance.deploy_path:
            raise ValueError("Instance deploy path not configured")
        return instance

    def _get_server(self, instance: Instance) -> Server:
        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found")
        return server

    def _env_path(self, instance: Instance) -> str:
        return f"{instance.deploy_path.rstrip('/')}/.env"

    def _recreate_services(self, instance: Instance, ssh, services: list[str]) -> None:
        services_str = " ".join(services)
        cmd = f"docker compose up -d --force-recreate {services_str}" if services_str else "docker compose up -d"
        result = ssh.exec_command(cmd, timeout=180, cwd=instance.deploy_path)
        if not result.ok:
            detail = (result.stderr or result.stdout or "Restart failed")[:2000]
            raise ValueError(detail)

    def _rotate_postgres_password(self, instance: Instance, ssh, new_password: str) -> None:
        slug = _safe_slug(instance.org_code.lower())
        db_container = f"dotmac_{slug}_db"
        alter_cmd = f"ALTER ROLE postgres WITH PASSWORD '{new_password}'"
        cmd = (
            f"docker exec {shlex.quote(db_container)} "
            f"psql -U postgres -d postgres -c {shlex.quote(alter_cmd)}"
        )
        result = ssh.exec_command(cmd, timeout=60)
        if not result.ok:
            detail = (result.stderr or result.stdout or "Postgres password update failed")[:2000]
            raise ValueError(detail)

    def _rotate_redis_password(self, instance: Instance, ssh, old_password: str | None, new_password: str) -> None:
        slug = _safe_slug(instance.org_code.lower())
        redis_container = f"dotmac_{slug}_redis"
        auth_arg = f"-a {shlex.quote(old_password)} " if old_password else ""
        cmd = (
            f"docker exec {shlex.quote(redis_container)} "
            f"redis-cli {auth_arg}CONFIG SET requirepass {shlex.quote(new_password)}"
        )
        result = ssh.exec_command(cmd, timeout=30)
        if not result.ok:
            detail = (result.stderr or result.stdout or "Redis password update failed")[:2000]
            raise ValueError(detail)

    def _verify_health(self, instance: Instance) -> None:
        try:
            from app.services.health_service import HealthService

            time.sleep(5)
            check = HealthService(self.db).poll_instance(instance)
            if check.status.value != "healthy":
                raise ValueError(f"Health check failed: {check.status.value}")
        except Exception as e:
            raise ValueError(str(e))


def _safe_slug(value: str) -> str:
    if not re.match(r"^[a-zA-Z0-9_-]+$", value):
        raise ValueError(f"Invalid org_code slug: {value!r}")
    return value


def _generate_totp_key() -> str:
    try:
        from cryptography.fernet import Fernet

        return Fernet.generate_key().decode()
    except ImportError:
        import base64

        return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode()


def _update_env_content(content: str, updates: dict[str, str]) -> str:
    lines = content.splitlines()
    updated = set()
    output_lines: list[str] = []
    for line in lines:
        match = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)=(.*)$", line)
        if not match:
            output_lines.append(line)
            continue
        key = match.group(1)
        if key in updates:
            output_lines.append(f"{key}={updates[key]}")
            updated.add(key)
        else:
            output_lines.append(line)
    for key, value in updates.items():
        if key not in updated:
            output_lines.append(f"{key}={value}")
    return "\n".join(output_lines).rstrip() + "\n"
