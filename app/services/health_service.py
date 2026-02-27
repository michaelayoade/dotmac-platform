"""
Health Service — Poll running instances and record health status.

Includes resource monitoring: CPU, memory, disk, DB size, active connections.
"""

from __future__ import annotations

import json
import logging
import shlex
import time
from datetime import UTC, datetime, timedelta
from typing import Any, TypedDict
from uuid import UUID

import httpx
from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.config import settings as platform_settings
from app.models.health_check import HealthCheck, HealthStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.services.ssh_service import get_ssh_for_server

logger = logging.getLogger(__name__)


class _ConsumerRow(TypedDict):
    instance: Instance
    cpu_percent: float
    memory_mb: float
    db_size_mb: float
    active_connections: int


def _as_utc(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


class HealthService:
    def __init__(self, db: Session):
        self.db = db

    def poll_instance(self, instance: Instance) -> HealthCheck:
        """Poll a single instance's /health endpoint.

        For local servers, poll directly via localhost.
        For remote servers, SSH to the server and curl the health endpoint.
        """
        server = self.db.get(Server, instance.server_id)
        if server and server.is_local:
            check = self._poll_local(instance)
        else:
            check = self._poll_remote(instance, server)

        try:
            from app.services.metrics_export import MetricsExportService

            MetricsExportService(self.db).update_instance_metrics(instance, check)
        except Exception:
            logger.debug("Failed to update metrics for %s", instance.org_code, exc_info=True)

        return check

    def _poll_local(self, instance: Instance) -> HealthCheck:
        """Poll a local instance directly via HTTP."""
        url = f"http://localhost:{instance.app_port}/health"
        start = time.monotonic()
        try:
            with httpx.Client(timeout=10) as client:
                resp = client.get(url)
                response_ms = int((time.monotonic() - start) * 1000)

                if resp.status_code == 200:
                    data = resp.json()
                    check = HealthCheck(
                        instance_id=instance.instance_id,
                        status=HealthStatus.healthy,
                        response_ms=response_ms,
                        db_healthy=data.get("db", True),
                        redis_healthy=data.get("redis", True),
                    )
                else:
                    check = HealthCheck(
                        instance_id=instance.instance_id,
                        status=HealthStatus.unhealthy,
                        response_ms=response_ms,
                        error_message=f"HTTP {resp.status_code}",
                    )
        except Exception as e:
            response_ms = int((time.monotonic() - start) * 1000)
            check = HealthCheck(
                instance_id=instance.instance_id,
                status=HealthStatus.unreachable,
                response_ms=response_ms,
                error_message=str(e)[:500],
            )

        self.db.add(check)
        self.db.flush()
        return check

    def _poll_remote(self, instance: Instance, server: Server | None) -> HealthCheck:
        """Poll a remote instance by SSH-ing to the server and curling the health endpoint."""
        start = time.monotonic()
        if not server:
            check = HealthCheck(
                instance_id=instance.instance_id,
                status=HealthStatus.unreachable,
                response_ms=0,
                error_message="Server not found",
            )
            self.db.add(check)
            self.db.flush()
            return check

        try:
            ssh = get_ssh_for_server(server)
            port = int(instance.app_port)
            result = ssh.exec_command(
                f"curl -sf --max-time 10 http://localhost:{port}/health",
                timeout=15,
            )
            response_ms = int((time.monotonic() - start) * 1000)

            if result.ok and result.stdout.strip():
                try:
                    data = json.loads(result.stdout)
                except (json.JSONDecodeError, ValueError):
                    check = HealthCheck(
                        instance_id=instance.instance_id,
                        status=HealthStatus.unhealthy,
                        response_ms=response_ms,
                        error_message="Invalid health JSON response",
                    )
                else:
                    check = HealthCheck(
                        instance_id=instance.instance_id,
                        status=HealthStatus.healthy,
                        response_ms=response_ms,
                        db_healthy=data.get("db", True),
                        redis_healthy=data.get("redis", True),
                    )
            else:
                check = HealthCheck(
                    instance_id=instance.instance_id,
                    status=HealthStatus.unhealthy,
                    response_ms=response_ms,
                    error_message=(result.stderr or "No response")[:500],
                )

            # Collect resource stats (best-effort)
            resource_stats = self.collect_resource_stats(instance, ssh)
            self._apply_resource_stats(check, resource_stats)

        except Exception as e:
            response_ms = int((time.monotonic() - start) * 1000)
            check = HealthCheck(
                instance_id=instance.instance_id,
                status=HealthStatus.unreachable,
                response_ms=response_ms,
                error_message=str(e)[:500],
            )

        self.db.add(check)
        self.db.flush()
        return check

    def collect_resource_stats(self, instance: Instance, ssh) -> dict:
        """Collect resource stats for an instance's containers via SSH."""
        stats: dict = {}
        slug = instance.org_code.lower()
        app_container = f"dotmac_{slug}_app"
        db_container = f"dotmac_{slug}_db"

        try:
            # Docker stats for app container (CPU + memory)
            result = ssh.exec_command(
                f"docker stats {shlex.quote(app_container)} --no-stream --format '{{{{.CPUPerc}}}} {{{{.MemUsage}}}}'",
                timeout=10,
            )
            if result.ok and result.stdout.strip():
                parts = result.stdout.strip().split()
                if len(parts) >= 2:
                    cpu_str = parts[0].replace("%", "")
                    try:
                        stats["cpu_percent"] = float(cpu_str)
                    except ValueError:
                        pass
                    mem_str = parts[1]
                    try:
                        if "GiB" in mem_str:
                            stats["memory_mb"] = int(float(mem_str.replace("GiB", "")) * 1024)
                        elif "MiB" in mem_str:
                            stats["memory_mb"] = int(float(mem_str.replace("MiB", "")))
                    except ValueError:
                        pass

            # DB size
            db_name = f"dotmac_{slug}"
            quoted_db = shlex.quote(db_name)
            size_result = ssh.exec_command(
                f"docker exec {shlex.quote(db_container)} psql -U postgres -d {quoted_db} "
                f'-t -c "SELECT pg_database_size(current_database()) / 1048576"',
                timeout=10,
            )
            if size_result.ok and size_result.stdout.strip():
                try:
                    stats["db_size_mb"] = int(size_result.stdout.strip())
                except ValueError:
                    pass

            # Active DB connections
            conn_result = ssh.exec_command(
                f"docker exec {shlex.quote(db_container)} psql -U postgres -d {quoted_db} "
                f'-t -c "SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()"',
                timeout=10,
            )
            if conn_result.ok and conn_result.stdout.strip():
                try:
                    stats["active_connections"] = int(conn_result.stdout.strip())
                except ValueError:
                    pass

        except (OSError, RuntimeError, ValueError) as e:
            logger.debug("Resource stats collection failed for %s: %s", instance.org_code, e)

        return stats

    def _apply_resource_stats(self, check: HealthCheck, stats: dict) -> None:
        """Apply collected resource stats to a health check record."""
        if "cpu_percent" in stats:
            check.cpu_percent = stats["cpu_percent"]
        if "memory_mb" in stats:
            check.memory_mb = stats["memory_mb"]
        if "db_size_mb" in stats:
            check.db_size_mb = stats["db_size_mb"]
        if "active_connections" in stats:
            check.active_connections = stats["active_connections"]

    def poll_all_running(self) -> dict:
        """Poll all running instances. Returns stats."""
        stmt = select(Instance).where(Instance.status == InstanceStatus.running)
        instances = list(self.db.scalars(stmt).all())

        results = {"total": len(instances), "healthy": 0, "unhealthy": 0, "unreachable": 0}

        for instance in instances:
            check = self.poll_instance(instance)
            if check.status == HealthStatus.healthy:
                results["healthy"] += 1
            elif check.status == HealthStatus.unhealthy:
                results["unhealthy"] += 1
            else:
                results["unreachable"] += 1

        self.db.flush()
        return results

    def get_latest_check(self, instance_id: UUID) -> HealthCheck | None:
        """Get the most recent health check for an instance."""
        stmt = (
            select(HealthCheck)
            .where(HealthCheck.instance_id == instance_id)
            .order_by(HealthCheck.checked_at.desc())
            .limit(1)
        )
        return self.db.scalar(stmt)

    def get_latest_checks_batch(self, instance_ids: list[UUID]) -> dict[UUID, HealthCheck]:
        """Get the most recent health check for multiple instances in a single query."""
        if not instance_ids:
            return {}

        # Subquery: max checked_at per instance_id
        latest_sub = (
            select(
                HealthCheck.instance_id,
                func.max(HealthCheck.checked_at).label("max_checked_at"),
            )
            .where(HealthCheck.instance_id.in_(instance_ids))
            .group_by(HealthCheck.instance_id)
            .subquery()
        )

        stmt = select(HealthCheck).join(
            latest_sub,
            (HealthCheck.instance_id == latest_sub.c.instance_id)
            & (HealthCheck.checked_at == latest_sub.c.max_checked_at),
        )
        checks = list(self.db.scalars(stmt).all())
        return {check.instance_id: check for check in checks}

    def get_recent_checks(self, instance_id: UUID, limit: int = 20) -> list[HealthCheck]:
        """Get recent health checks for an instance."""
        stmt = (
            select(HealthCheck)
            .where(HealthCheck.instance_id == instance_id)
            .order_by(HealthCheck.checked_at.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def prune_old_checks(self, instance_id: UUID) -> int:
        """Keep only the latest N checks for a single instance."""
        keep = platform_settings.health_checks_to_keep
        stmt = (
            select(HealthCheck.id)
            .where(HealthCheck.instance_id == instance_id)
            .order_by(HealthCheck.checked_at.desc())
            .offset(keep)
        )
        old_ids = list(self.db.scalars(stmt).all())
        if old_ids:
            self.db.execute(delete(HealthCheck).where(HealthCheck.id.in_(old_ids)))
        return len(old_ids)

    def prune_all_old_checks(self) -> int:
        """Prune old health checks for all instances."""
        stmt = select(Instance.instance_id).where(Instance.status == InstanceStatus.running)
        instance_ids = list(self.db.scalars(stmt).all())
        total = 0
        for iid in instance_ids:
            total += self.prune_old_checks(iid)
        if total:
            self.db.flush()
            logger.info("Pruned %d old health checks across %d instances", total, len(instance_ids))
        return total

    def get_dashboard_stats(self) -> dict:
        """Get aggregated health stats for the dashboard."""
        all_instances = list(self.db.scalars(select(Instance)).all())

        stats: dict[str, Any] = {
            "total_instances": len(all_instances),
            "running": 0,
            "stopped": 0,
            "deploying": 0,
            "error": 0,
            "healthy": 0,
            "unhealthy": 0,
            "unknown": 0,
        }

        running_ids = []
        for inst in all_instances:
            if inst.status == InstanceStatus.running:
                stats["running"] += 1
                running_ids.append(inst.instance_id)
            elif inst.status == InstanceStatus.stopped:
                stats["stopped"] += 1
            elif inst.status == InstanceStatus.deploying:
                stats["deploying"] += 1
            elif inst.status == InstanceStatus.error:
                stats["error"] += 1

        # Batch fetch latest health checks for running instances
        if running_ids:
            checks = self.get_latest_checks_batch(running_ids)
            now = datetime.now(UTC)
            for iid in running_ids:
                check = checks.get(iid)
                state = self.classify_health(check, now)
                if state == "healthy":
                    stats["healthy"] += 1
                elif state == "unhealthy":
                    stats["unhealthy"] += 1
                else:
                    stats["unknown"] += 1

        stats["total_servers"] = self.db.scalar(select(func.count(Server.server_id))) or 0

        # Version matrix: group by deployed_git_ref
        version_matrix: dict[str, int] = {}
        for inst in all_instances:
            ref = inst.deployed_git_ref or "unset"
            version_matrix[ref] = version_matrix.get(ref, 0) + 1
        stats["version_matrix"] = version_matrix

        # Server breakdown: count instances per server
        server_map: dict[UUID, int] = {}
        for inst in all_instances:
            server_map[inst.server_id] = server_map.get(inst.server_id, 0) + 1
        server_breakdown: list[dict] = []
        # Batch fetch servers to avoid N+1 queries
        if server_map:
            server_ids = list(server_map.keys())
            servers = {
                s.server_id: s
                for s in self.db.scalars(
                    select(Server).where(Server.server_id.in_(server_ids))
                )
            }
        else:
            servers = {}
        for sid, count in server_map.items():
            server = servers.get(sid)
            server_breakdown.append(
                {
                    "server_id": str(sid),
                    "name": server.name if server else "Unknown",
                    "hostname": server.hostname if server else "",
                    "instance_count": count,
                }
            )
        stats["server_breakdown"] = server_breakdown

        # Status timeline: health check counts in last 24h
        cutoff = datetime.now(UTC) - timedelta(hours=24)
        timeline_stmt = (
            select(HealthCheck.status, func.count(HealthCheck.id))
            .where(HealthCheck.checked_at >= cutoff)
            .group_by(HealthCheck.status)
        )
        timeline_rows = self.db.execute(timeline_stmt).all()
        status_timeline: dict[str, int] = {}
        for row_status, row_count in timeline_rows:
            status_timeline[row_status.value if hasattr(row_status, "value") else str(row_status)] = row_count
        stats["status_timeline"] = status_timeline

        return stats

    def classify_health(self, check: HealthCheck | None, now: datetime | None = None) -> str:
        """Classify health as healthy, unhealthy, or unknown (missing/stale/unreachable)."""
        if not check:
            return "unknown"
        now = now or datetime.now(UTC)
        checked_at = _as_utc(check.checked_at)
        if not checked_at:
            return "unknown"
        age = (now - checked_at).total_seconds()
        if age > platform_settings.health_stale_seconds:
            return "unknown"
        if check.status == HealthStatus.healthy:
            return "healthy"
        return "unhealthy"

    def get_dashboard_instances(self, instances: list[Instance]) -> tuple[list[dict], str]:
        """Build enriched instance data for the dashboard, plus an ETag string.

        Returns (instance_data, etag) where instance_data is a list of dicts
        with 'instance', 'health', and 'health_state' keys, and etag is a
        content hash for HTMX caching.
        """
        import hashlib

        instance_ids = [inst.instance_id for inst in instances]
        health_map = self.get_latest_checks_batch(instance_ids)
        now = datetime.now(UTC)
        instance_data: list[dict] = []
        etag_parts: list[str] = []
        for inst in instances:
            check = health_map.get(inst.instance_id)
            health_state = self.classify_health(check, now)
            instance_data.append(
                {
                    "instance": inst,
                    "health": check,
                    "health_state": health_state,
                }
            )
            etag_parts.append(
                f"{inst.instance_id}:{inst.status.value}:{health_state}:{check.response_ms if check else ''}"
            )
        etag = '"' + hashlib.sha256("|".join(etag_parts).encode()).hexdigest()[:16] + '"'
        return instance_data, etag

    def get_badge_state(self, instance_id: UUID) -> dict:
        """Return health badge data + ETag payload."""
        import hashlib

        check = self.get_latest_check(instance_id)

        is_stale = False
        if check and check.checked_at:
            age = (datetime.now(UTC) - check.checked_at).total_seconds()
            is_stale = age > platform_settings.health_stale_seconds

        tag_parts = f"{check.status.value if check else 'none'}"
        tag_parts += f":{check.response_ms if check else ''}"
        tag_parts += f":{check.checked_at.isoformat() if check and check.checked_at else ''}"
        tag_parts += f":{is_stale}"
        etag = '"' + hashlib.sha256(tag_parts.encode()).hexdigest()[:16] + '"'

        return {"health": check, "is_stale": is_stale, "etag": etag}

    def get_top_resource_consumers(self, limit: int = 5) -> list[_ConsumerRow]:
        """Get instances with highest resource usage from latest health checks."""
        stmt = select(Instance).where(Instance.status == InstanceStatus.running)
        running = list(self.db.scalars(stmt).all())
        if not running:
            return []

        ids = [i.instance_id for i in running]
        checks = self.get_latest_checks_batch(ids)

        consumers: list[_ConsumerRow] = []
        for inst in running:
            check = checks.get(inst.instance_id)
            if check:
                consumers.append(
                    {
                        "instance": inst,
                        "cpu_percent": check.cpu_percent or 0,
                        "memory_mb": check.memory_mb or 0,
                        "db_size_mb": check.db_size_mb or 0,
                        "active_connections": check.active_connections or 0,
                    }
                )

        consumers.sort(key=lambda x: x["cpu_percent"], reverse=True)
        return consumers[:limit]

    @staticmethod
    def serialize_consumer(row: _ConsumerRow) -> dict:
        return {
            "org_code": row["instance"].org_code,
            "instance_id": str(row["instance"].instance_id),
            "cpu_percent": row["cpu_percent"],
            "memory_mb": row["memory_mb"],
            "db_size_mb": row["db_size_mb"],
            "active_connections": row["active_connections"],
        }

    @staticmethod
    def serialize_check(check: HealthCheck) -> dict:
        return {
            "status": check.status.value,
            "response_ms": check.response_ms,
            "db_healthy": check.db_healthy,
            "redis_healthy": check.redis_healthy,
            "checked_at": check.checked_at.isoformat() if check.checked_at else None,
        }
