"""
Health Service — Poll running instances and record health status.

Includes resource monitoring: CPU, memory, disk, DB size, active connections.
"""
from __future__ import annotations

import json
import logging
import shlex
import time
from datetime import datetime, timezone
from uuid import UUID

import httpx
from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.config import settings as platform_settings
from app.models.health_check import HealthCheck, HealthStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server

logger = logging.getLogger(__name__)


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
            return self._poll_local(instance)
        return self._poll_remote(instance, server)

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
            from app.services.ssh_service import get_ssh_for_server

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
                    data = {}
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
                f"-t -c \"SELECT pg_database_size(current_database()) / 1048576\"",
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
                f"-t -c \"SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()\"",
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

        stmt = (
            select(HealthCheck)
            .join(
                latest_sub,
                (HealthCheck.instance_id == latest_sub.c.instance_id)
                & (HealthCheck.checked_at == latest_sub.c.max_checked_at),
            )
        )
        checks = list(self.db.scalars(stmt).all())
        return {check.instance_id: check for check in checks}

    def get_recent_checks(
        self, instance_id: UUID, limit: int = 20
    ) -> list[HealthCheck]:
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
            self.db.execute(
                delete(HealthCheck).where(HealthCheck.id.in_(old_ids))
            )
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

        stats = {
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
            now = datetime.now(timezone.utc)
            for iid in running_ids:
                check = checks.get(iid)
                state = self.classify_health(check, now)
                if state == "healthy":
                    stats["healthy"] += 1
                elif state == "unhealthy":
                    stats["unhealthy"] += 1
                else:
                    stats["unknown"] += 1

        stats["total_servers"] = self.db.scalar(
            select(func.count(Server.server_id))
        ) or 0

        return stats

    def classify_health(self, check: HealthCheck | None, now: datetime | None = None) -> str:
        """Classify health as healthy, unhealthy, or unknown (missing/stale/unreachable)."""
        if not check:
            return "unknown"
        now = now or datetime.now(timezone.utc)
        if not check.checked_at:
            return "unknown"
        age = (now - check.checked_at).total_seconds()
        if age > platform_settings.health_stale_seconds:
            return "unknown"
        if check.status == HealthStatus.healthy:
            return "healthy"
        return "unhealthy"

    def get_top_resource_consumers(self, limit: int = 5) -> list[dict]:
        """Get instances with highest resource usage from latest health checks."""
        stmt = select(Instance).where(Instance.status == InstanceStatus.running)
        running = list(self.db.scalars(stmt).all())
        if not running:
            return []

        ids = [i.instance_id for i in running]
        checks = self.get_latest_checks_batch(ids)

        consumers = []
        for inst in running:
            check = checks.get(inst.instance_id)
            if check:
                consumers.append({
                    "instance": inst,
                    "cpu_percent": check.cpu_percent or 0,
                    "memory_mb": check.memory_mb or 0,
                    "db_size_mb": check.db_size_mb or 0,
                    "active_connections": check.active_connections or 0,
                })

        consumers.sort(key=lambda x: x["cpu_percent"], reverse=True)
        return consumers[:limit]
