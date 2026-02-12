"""
Metrics Export Service — Prometheus gauges and instance log access.
"""

from __future__ import annotations

import logging
import re
import shlex
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.metrics import (
    BACKUP_LAST_SUCCESS,
    DEPLOYMENTS_TOTAL,
    INSTANCE_CONNECTIONS,
    INSTANCE_CPU,
    INSTANCE_DB_SIZE,
    INSTANCE_MEMORY,
    INSTANCE_RESPONSE_MS,
)
from app.models.backup import Backup, BackupStatus
from app.models.health_check import HealthCheck
from app.models.instance import Instance
from app.models.server import Server
from app.services.ssh_service import get_ssh_for_server

logger = logging.getLogger(__name__)

_STREAMS_ORDER = ["app", "worker", "beat", "db", "redis"]
_ALLOWED_STREAMS = set(_STREAMS_ORDER)


def _safe_slug(value: str) -> str:
    if not re.match(r"^[a-zA-Z0-9_-]+$", value):
        raise ValueError(f"Invalid slug: {value!r}")
    return value


class MetricsExportService:
    def __init__(self, db: Session):
        self.db = db

    def update_instance_metrics(self, instance: Instance, check: HealthCheck) -> None:
        if not instance or not check:
            return
        labels = {"instance_id": str(instance.instance_id), "org_code": instance.org_code}
        try:
            if check.cpu_percent is not None:
                INSTANCE_CPU.labels(**labels).set(check.cpu_percent)
            if check.memory_mb is not None:
                INSTANCE_MEMORY.labels(**labels).set(check.memory_mb)
            if check.db_size_mb is not None:
                INSTANCE_DB_SIZE.labels(**labels).set(check.db_size_mb)
            if check.active_connections is not None:
                INSTANCE_CONNECTIONS.labels(**labels).set(check.active_connections)
            if check.response_ms is not None:
                INSTANCE_RESPONSE_MS.labels(**labels).set(check.response_ms)
        except Exception:
            logger.debug("Failed to update instance metrics", exc_info=True)

    def record_deployment(self, instance_id: UUID, success: bool) -> None:
        status = "success" if success else "failed"
        DEPLOYMENTS_TOTAL.labels(instance_id=str(instance_id), status=status).inc()

    def update_backup_metrics(self, instance_id: UUID, completed_at: datetime | None = None) -> None:
        timestamp = completed_at or datetime.now(UTC)
        BACKUP_LAST_SUCCESS.labels(instance_id=str(instance_id)).set(timestamp.timestamp())

    def cleanup_instance_metrics(self, instance_id: UUID, org_code: str) -> None:
        iid = str(instance_id)
        try:
            INSTANCE_CPU.remove(iid, org_code)
            INSTANCE_MEMORY.remove(iid, org_code)
            INSTANCE_DB_SIZE.remove(iid, org_code)
            INSTANCE_CONNECTIONS.remove(iid, org_code)
            INSTANCE_RESPONSE_MS.remove(iid, org_code)
            DEPLOYMENTS_TOTAL.remove(iid, "success")
            DEPLOYMENTS_TOTAL.remove(iid, "failed")
            BACKUP_LAST_SUCCESS.remove(iid)
        except Exception:
            logger.debug("Failed to cleanup metrics for %s", iid, exc_info=True)

    def get_metrics_summary(self, instance_id: UUID) -> dict:
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError("Instance not found")

        check = self.db.scalar(
            select(HealthCheck)
            .where(HealthCheck.instance_id == instance_id)
            .order_by(HealthCheck.checked_at.desc())
            .limit(1)
        )

        backup = self.db.scalar(
            select(Backup)
            .where(Backup.instance_id == instance_id)
            .where(Backup.status == BackupStatus.completed)
            .order_by(desc(Backup.completed_at))
            .limit(1)
        )

        return {
            "instance_id": str(instance.instance_id),
            "org_code": instance.org_code,
            "status": check.status.value if check else None,
            "response_ms": check.response_ms if check else None,
            "cpu_percent": check.cpu_percent if check else None,
            "memory_mb": check.memory_mb if check else None,
            "db_size_mb": check.db_size_mb if check else None,
            "active_connections": check.active_connections if check else None,
            "checked_at": check.checked_at.isoformat() if check and check.checked_at else None,
            "last_backup_at": backup.completed_at.isoformat() if backup and backup.completed_at else None,
        }

    def get_logs_payload(
        self,
        instance_id: UUID,
        *,
        stream: str,
        lines: int,
        since: str | None,
    ) -> dict:
        entries = self.export_instance_logs(instance_id, stream=stream, lines=lines, since=since)
        return {"stream": stream, "lines": lines, "since": since, "entries": entries}

    def export_instance_logs(
        self,
        instance_id: UUID,
        stream: str,
        lines: int = 100,
        since: str | None = None,
    ) -> list[str]:
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError("Instance not found")

        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found")

        if stream not in _ALLOWED_STREAMS:
            raise ValueError("Invalid log stream")

        lines = max(1, min(int(lines), 2000))
        slug = _safe_slug(instance.org_code.lower())
        container = f"dotmac_{slug}_{stream}"

        since_arg = f"--since {shlex.quote(since)}" if since else ""
        cmd = f"docker logs --tail {lines} {since_arg} {shlex.quote(container)}".strip()

        ssh = get_ssh_for_server(server)
        result = ssh.exec_command(cmd, timeout=30)
        if not result.ok:
            raise ValueError((result.stderr or "Failed to fetch logs")[:500])
        return result.stdout.splitlines()

    def get_log_streams(self, instance_id: UUID) -> list[dict]:
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError("Instance not found")

        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found")

        slug = _safe_slug(instance.org_code.lower())
        containers = {stream: f"dotmac_{slug}_{stream}" for stream in _STREAMS_ORDER}

        ssh = get_ssh_for_server(server)
        result = ssh.exec_command("docker ps --format '{{.Names}}'", timeout=10)
        running = set(result.stdout.split()) if result.ok else set()

        return [
            {
                "stream": stream,
                "container": name,
                "running": name in running,
            }
            for stream, name in containers.items()
        ]
