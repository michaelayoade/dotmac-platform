"""
Lifecycle Service — Manage tenant instance lifecycle transitions.

Handles trial expiry, suspension, archival, and associated container management.
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.services.ssh_service import get_ssh_for_server

logger = logging.getLogger(__name__)

DEFAULT_TRIAL_DAYS = 14


class LifecycleService:
    def __init__(self, db: Session):
        self.db = db

    def _get_instance_for_update(self, instance_id: UUID) -> Instance:
        stmt = select(Instance).where(Instance.instance_id == instance_id).with_for_update()
        instance = self.db.scalar(stmt)
        if not instance:
            raise ValueError(f"Instance {instance_id} not found")
        return instance

    def _run_compose(self, instance: Instance, command: str) -> None:
        server = self.db.get(Server, instance.server_id)
        if not server or not instance.deploy_path:
            raise ValueError("Instance server or deploy path not configured")
        ssh = get_ssh_for_server(server)
        result = ssh.exec_command(
            command,
            timeout=60,
            cwd=instance.deploy_path,
        )
        if not result.ok:
            detail = (result.stderr or result.stdout or "Unknown error")[:2000]
            raise ValueError(f"Container operation failed: {detail}")

    def start_trial(self, instance_id: UUID, days: int = DEFAULT_TRIAL_DAYS) -> Instance:
        """Set an instance to trial status with an expiry date."""
        instance = self._get_instance_for_update(instance_id)
        if instance.status not in {InstanceStatus.provisioned, InstanceStatus.trial}:
            raise ValueError("Instance is not eligible for trial")
        instance.status = InstanceStatus.trial
        instance.trial_expires_at = datetime.now(UTC) + timedelta(days=days)
        self.db.flush()
        logger.info("Started %d-day trial for %s", days, instance.org_code)
        return instance

    def suspend_instance(self, instance_id: UUID, reason: str | None = None) -> Instance:
        """Suspend an instance — stops containers but preserves data."""
        instance = self._get_instance_for_update(instance_id)
        if instance.status in {InstanceStatus.deploying, InstanceStatus.archived}:
            raise ValueError("Instance cannot be suspended in its current state")

        # Stop containers
        try:
            self._run_compose(instance, "docker compose stop")
        except Exception as exc:
            logger.warning("Could not stop containers for %s: %s", instance.org_code, exc)
            raise

        instance.status = InstanceStatus.suspended
        instance.suspended_at = datetime.now(UTC)
        if reason:
            instance.notes = f"Suspended: {reason}\n{instance.notes or ''}"
        self.db.flush()
        logger.info("Suspended instance %s", instance.org_code)
        return instance

    def reactivate_instance(self, instance_id: UUID) -> Instance:
        """Reactivate a suspended instance — restarts containers."""
        instance = self._get_instance_for_update(instance_id)
        if instance.status != InstanceStatus.suspended:
            raise ValueError("Instance is not suspended")

        try:
            self._run_compose(instance, "docker compose start")
        except Exception as exc:
            logger.warning("Could not restart containers for %s: %s", instance.org_code, exc)
            raise

        instance.status = InstanceStatus.running
        instance.suspended_at = None
        self.db.flush()
        logger.info("Reactivated instance %s", instance.org_code)
        return instance

    def archive_instance(self, instance_id: UUID) -> Instance:
        """Archive an instance — stops and removes containers, preserves data volumes."""
        instance = self._get_instance_for_update(instance_id)
        if instance.status == InstanceStatus.deploying:
            raise ValueError("Instance cannot be archived while deploying")

        try:
            self._run_compose(instance, "docker compose down")
        except Exception as exc:
            logger.warning("Could not remove containers for %s: %s", instance.org_code, exc)
            raise

        instance.status = InstanceStatus.archived
        instance.archived_at = datetime.now(UTC)
        self.db.flush()
        logger.info("Archived instance %s", instance.org_code)
        return instance

    def check_expired_trials(self) -> list[Instance]:
        """Find and suspend instances whose trial has expired."""
        now = datetime.now(UTC)
        stmt = (
            select(Instance)
            .where(
                Instance.status == InstanceStatus.trial,
                Instance.trial_expires_at.isnot(None),
                Instance.trial_expires_at <= now,
            )
            .with_for_update()
        )
        expired = list(self.db.scalars(stmt).all())

        for instance in expired:
            try:
                self.suspend_instance(
                    instance.instance_id,
                    reason="Trial period expired",
                )
            except Exception:
                logger.exception("Failed to suspend expired trial: %s", instance.org_code)

        if expired:
            logger.info("Suspended %d expired trial instances", len(expired))
        return expired
