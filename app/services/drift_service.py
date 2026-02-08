"""Config Drift Detection Service — compare expected vs running config."""

from __future__ import annotations

import json
import logging
import shlex
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.drift_report import DriftReport
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server

logger = logging.getLogger(__name__)

SENSITIVE_PATTERNS = (
    "password",
    "secret",
    "key",
    "token",
    "pass",
    "cert",
    "database_url",
    "redis_url",
    "broker_url",
)


class DriftService:
    def __init__(self, db: Session):
        self.db = db

    def detect_drift(self, instance_id: UUID) -> DriftReport:
        """Compare expected env vars with running container env vars."""
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError("Instance not found")
        if instance.status != InstanceStatus.running:
            raise ValueError(f"Instance is {instance.status.value}, not running")

        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found")

        # Get expected config
        expected = self._get_expected_env(instance)
        # Get running config
        running = self._get_running_env(instance, server)

        diffs = self._compute_diffs(expected, running)
        report = DriftReport(
            instance_id=instance_id,
            diffs=diffs,
            has_drift=bool(diffs.get("added") or diffs.get("removed") or diffs.get("changed")),
        )
        self.db.add(report)
        self.db.flush()
        return report

    def get_latest_report(self, instance_id: UUID) -> DriftReport | None:
        stmt = (
            select(DriftReport)
            .where(DriftReport.instance_id == instance_id)
            .order_by(DriftReport.detected_at.desc())
            .limit(1)
        )
        return self.db.scalar(stmt)

    def get_reports(self, instance_id: UUID, limit: int = 20) -> list[DriftReport]:
        stmt = (
            select(DriftReport)
            .where(DriftReport.instance_id == instance_id)
            .order_by(DriftReport.detected_at.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def detect_all_drift(self) -> int:
        """Run drift detection across all running instances."""
        stmt = select(Instance).where(Instance.status == InstanceStatus.running)
        instances = list(self.db.scalars(stmt).all())
        count = 0
        for inst in instances:
            try:
                report = self.detect_drift(inst.instance_id)
                if report.has_drift:
                    count += 1
            except Exception:
                logger.warning("Drift detection failed for %s", inst.org_code, exc_info=True)
        if instances:
            self.db.commit()
        return count

    def _get_expected_env(self, instance: Instance) -> dict[str, str]:
        """Generate expected .env key-values from instance config."""
        from app.services.instance_service import InstanceService

        svc = InstanceService(self.db)
        env_content = svc.generate_env(instance, admin_password="__PLACEHOLDER__")
        result = {}
        for line in env_content.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, _, value = line.partition("=")
                # Skip sensitive values
                if any(s in key.lower() for s in SENSITIVE_PATTERNS):
                    continue
                result[key.strip()] = value.strip()
        return result

    def _get_running_env(self, instance: Instance, server: Server) -> dict[str, str]:
        """Fetch env vars from running container via docker inspect."""
        from app.services.ssh_service import get_ssh_for_server

        ssh = get_ssh_for_server(server)
        slug = instance.org_code.lower()
        container = f"dotmac_{slug}_app"

        result = ssh.exec_command(
            f"docker inspect --format='{{{{json .Config.Env}}}}' {shlex.quote(container)}",
            timeout=10,
        )
        if not result.ok:
            return {}

        try:
            env_list = json.loads(result.stdout.strip().strip("'"))
        except (json.JSONDecodeError, ValueError):
            return {}

        env_dict = {}
        for item in env_list:
            if "=" in item:
                key, _, value = item.partition("=")
                # Skip sensitive values
                if any(s in key.lower() for s in SENSITIVE_PATTERNS):
                    continue
                env_dict[key] = value
        return env_dict

    def _compute_diffs(self, expected: dict[str, str], running: dict[str, str]) -> dict:
        added = {k: v for k, v in running.items() if k not in expected}
        removed = {k: v for k, v in expected.items() if k not in running}
        changed = {}
        for k in expected:
            if k in running and expected[k] != running[k]:
                changed[k] = {"expected": expected[k], "actual": running[k]}
        return {"added": added, "removed": removed, "changed": changed}
