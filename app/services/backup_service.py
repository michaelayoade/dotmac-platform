"""
Backup Service — Create and manage database backups for tenant instances.

Uses pg_dump via SSH to create backups of individual tenant databases.
"""

from __future__ import annotations

import logging
import re
import shlex
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.backup import Backup, BackupStatus, BackupType
from app.models.instance import Instance
from app.models.server import Server
from app.services.ssh_service import get_ssh_for_server

logger = logging.getLogger(__name__)

DEFAULT_BACKUP_DIR = "/opt/dotmac/backups"
DEFAULT_RETENTION_COUNT = 5


def _safe_slug(value: str) -> str:
    """Validate and return a safe slug for use in shell commands."""
    if not re.match(r"^[a-zA-Z0-9_-]+$", value):
        raise ValueError(f"Invalid slug: {value!r}")
    return value


class BackupService:
    def __init__(self, db: Session):
        self.db = db

    def list_for_instance(self, instance_id: UUID) -> list[Backup]:
        stmt = select(Backup).where(Backup.instance_id == instance_id).order_by(Backup.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, backup_id: UUID) -> Backup | None:
        return self.db.get(Backup, backup_id)

    def create_backup(
        self,
        instance_id: UUID,
        backup_type: BackupType = BackupType.db_only,
    ) -> Backup:
        """Create a database backup for an instance via SSH pg_dump."""
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError(f"Instance {instance_id} not found")

        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found")

        backup = Backup(
            instance_id=instance_id,
            backup_type=backup_type,
            status=BackupStatus.running,
        )
        self.db.add(backup)
        self.db.flush()

        slug = _safe_slug(instance.org_code.lower())
        db_container = f"dotmac_{slug}_db"
        db_name = f"dotmac_{slug}"
        timestamp = datetime.now(UTC).strftime("%Y%m%d_%H%M%S")
        backup_dir = f"{DEFAULT_BACKUP_DIR}/{slug}"
        backup_file = f"{backup_dir}/{db_name}_{timestamp}.sql.gz"

        try:
            ssh = get_ssh_for_server(server)

            # Ensure backup directory exists
            ssh.exec_command(f"mkdir -p {shlex.quote(backup_dir)}")

            # Run pg_dump inside the db container, pipe through gzip
            q_file = shlex.quote(backup_file)
            dump_inner = (
                f"set -o pipefail; "
                f"docker exec {shlex.quote(db_container)} "
                f"pg_dump -U postgres -d {shlex.quote(db_name)} "
                f"| gzip > {q_file}"
            )
            dump_cmd = f"bash -lc {shlex.quote(dump_inner)}"
            result = ssh.exec_command(dump_cmd, timeout=300)

            if not result.ok:
                backup.status = BackupStatus.failed
                backup.error_message = result.stderr[:2000]
                self.db.flush()
                return backup

            # Get file size
            size_result = ssh.exec_command(f"stat -c%s {q_file}")
            size_bytes = int(size_result.stdout.strip()) if size_result.ok else None

            backup.file_path = backup_file
            backup.size_bytes = size_bytes
            backup.status = BackupStatus.completed
            backup.completed_at = datetime.now(UTC)
            self.db.flush()

            logger.info(
                "Backup completed for %s: %s (%s bytes)",
                instance.org_code,
                backup_file,
                size_bytes,
            )
            self._notify_backup(instance, backup)
            return backup

        except Exception as e:
            backup.status = BackupStatus.failed
            backup.error_message = str(e)[:2000]
            self.db.flush()
            logger.exception("Backup failed for %s", instance.org_code)
            self._notify_backup(instance, backup)
            return backup

    def _notify_backup(self, instance: Instance, backup: Backup) -> None:
        """Best-effort in-app notification for backup results."""
        try:
            from app.models.notification import NotificationCategory, NotificationSeverity
            from app.services.notification_service import NotificationService

            if backup.status == BackupStatus.completed:
                sev = NotificationSeverity.info
                title = f"Backup completed: {instance.org_code}"
                message = f"Backup finished successfully ({backup.size_bytes or 0} bytes)"
            else:
                sev = NotificationSeverity.warning
                title = f"Backup failed: {instance.org_code}"
                message = f"Backup failed: {(backup.error_message or 'unknown error')[:200]}"

            NotificationService(self.db).create_for_admins(
                category=NotificationCategory.backup,
                severity=sev,
                title=title,
                message=message,
                link=f"/instances/{instance.instance_id}",
            )
        except Exception:
            logger.debug("Failed to create backup notification", exc_info=True)

    def restore_backup(self, instance_id: UUID, backup_id: UUID) -> dict:
        """Restore a database from backup."""
        backup = self.get_by_id(backup_id)
        if not backup or backup.instance_id != instance_id or backup.status != BackupStatus.completed:
            raise ValueError("Backup not found or not completed")
        if not backup.file_path:
            raise ValueError("Backup file missing")

        instance = self.db.get(Instance, backup.instance_id)
        if not instance:
            raise ValueError("Instance not found")

        server = self.db.get(Server, instance.server_id)
        if not server:
            raise ValueError("Server not found")

        ssh = get_ssh_for_server(server)
        slug = _safe_slug(instance.org_code.lower())
        db_container = f"dotmac_{slug}_db"
        db_name = f"dotmac_{slug}"

        q_file = shlex.quote(backup.file_path)
        restore_inner = (
            f"set -o pipefail; "
            f"gunzip -c {q_file} | "
            f"docker exec -i {shlex.quote(db_container)} "
            f"psql -U postgres -d {shlex.quote(db_name)}"
        )
        restore_cmd = f"bash -lc {shlex.quote(restore_inner)}"
        result = ssh.exec_command(restore_cmd, timeout=300)

        if result.ok:
            logger.info("Restore completed for %s from %s", instance.org_code, backup.file_path)
            return {"success": True, "message": "Restore completed"}
        return {"success": False, "error": result.stderr[:2000]}

    def delete_backup(self, instance_id: UUID, backup_id: UUID) -> None:
        """Delete a backup record and its file on disk."""
        backup = self.get_by_id(backup_id)
        if not backup or backup.instance_id != instance_id:
            raise ValueError(f"Backup {backup_id} not found")

        # Try to delete the file if it exists
        if backup.file_path:
            instance = self.db.get(Instance, backup.instance_id)
            if instance:
                server = self.db.get(Server, instance.server_id)
                if server:
                    try:
                        ssh = get_ssh_for_server(server)
                        ssh.exec_command(f"rm -f {shlex.quote(backup.file_path)}")
                    except Exception:
                        logger.warning("Could not delete backup file: %s", backup.file_path)

        self.db.delete(backup)
        self.db.flush()

    def prune_old_backups(self, instance_id: UUID, keep: int = DEFAULT_RETENTION_COUNT) -> int:
        """Delete old backups beyond the retention count."""
        backups = self.list_for_instance(instance_id)
        completed = [b for b in backups if b.status == BackupStatus.completed]

        if len(completed) <= keep:
            return 0

        to_delete = completed[keep:]
        for backup in to_delete:
            self.delete_backup(instance_id, backup.backup_id)

        logger.info("Pruned %d old backups for instance %s", len(to_delete), instance_id)
        return len(to_delete)
