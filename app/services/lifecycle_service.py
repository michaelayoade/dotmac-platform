"""
Lifecycle Service — Manage tenant instance lifecycle transitions.

Handles trial expiry, suspension, archival, and associated container management.
"""
from __future__ import annotations

import logging
import shlex
from datetime import datetime, timedelta, timezone
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

    def start_trial(self, instance_id: UUID, days: int = DEFAULT_TRIAL_DAYS) -> Instance:
        """Set an instance to trial status with an expiry date."""
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError(f"Instance {instance_id} not found")
        instance.status = InstanceStatus.trial
        instance.trial_expires_at = datetime.now(timezone.utc) + timedelta(days=days)
        self.db.flush()
        logger.info("Started %d-day trial for %s", days, instance.org_code)
        return instance

    def suspend_instance(self, instance_id: UUID, reason: str | None = None) -> Instance:
        """Suspend an instance — stops containers but preserves data."""
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError(f"Instance {instance_id} not found")

        # Stop containers
        server = self.db.get(Server, instance.server_id)
        if server and instance.deploy_path:
            try:
                ssh = get_ssh_for_server(server)
                ssh.exec_command(
                    "docker compose stop",
                    timeout=60,
                    cwd=instance.deploy_path,
                )
            except Exception:
                logger.warning("Could not stop containers for %s", instance.org_code)

        instance.status = InstanceStatus.suspended
        instance.suspended_at = datetime.now(timezone.utc)
        if reason:
            instance.notes = f"Suspended: {reason}\n{instance.notes or ''}"
        self.db.flush()
        logger.info("Suspended instance %s", instance.org_code)
        return instance

    def reactivate_instance(self, instance_id: UUID) -> Instance:
        """Reactivate a suspended instance — restarts containers."""
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError(f"Instance {instance_id} not found")
        if instance.status != InstanceStatus.suspended:
            raise ValueError("Instance is not suspended")

        server = self.db.get(Server, instance.server_id)
        if server and instance.deploy_path:
            try:
                ssh = get_ssh_for_server(server)
                ssh.exec_command(
                    "docker compose start",
                    timeout=60,
                    cwd=instance.deploy_path,
                )
            except Exception:
                logger.warning("Could not restart containers for %s", instance.org_code)

        instance.status = InstanceStatus.running
        instance.suspended_at = None
        self.db.flush()
        logger.info("Reactivated instance %s", instance.org_code)
        return instance

    def archive_instance(self, instance_id: UUID) -> Instance:
        """Archive an instance — stops and removes containers, preserves data volumes."""
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError(f"Instance {instance_id} not found")

        server = self.db.get(Server, instance.server_id)
        if server and instance.deploy_path:
            try:
                ssh = get_ssh_for_server(server)
                # Stop containers but preserve volumes
                ssh.exec_command(
                    "docker compose down",
                    timeout=60,
                    cwd=instance.deploy_path,
                )
            except Exception:
                logger.warning("Could not remove containers for %s", instance.org_code)

        instance.status = InstanceStatus.archived
        instance.archived_at = datetime.now(timezone.utc)
        self.db.flush()
        logger.info("Archived instance %s", instance.org_code)
        return instance

    def check_expired_trials(self) -> list[Instance]:
        """Find and suspend instances whose trial has expired."""
        now = datetime.now(timezone.utc)
        stmt = select(Instance).where(
            Instance.status == InstanceStatus.trial,
            Instance.trial_expires_at.isnot(None),
            Instance.trial_expires_at <= now,
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
