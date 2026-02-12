"""Clone Service — async clone pipeline with optional data restore."""

from __future__ import annotations

import logging
import os
import re
import shlex
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.clone_operation import CloneOperation, CloneStatus
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server
from app.services.settings_crypto import decrypt_value, encrypt_value
from app.services.ssh_service import get_ssh_for_server

logger = logging.getLogger(__name__)

_ORG_CODE_RE = re.compile(r"^[A-Z0-9_-]+$")


def _safe_slug(value: str) -> str:
    if not re.match(r"^[a-zA-Z0-9_-]+$", value):
        raise ValueError(f"Invalid slug: {value!r}")
    return value


class CloneService:
    def __init__(self, db: Session):
        self.db = db

    def clone_instance(
        self,
        source_instance_id: UUID,
        new_org_code: str,
        new_org_name: str | None = None,
        *,
        include_data: bool = True,
        target_server_id: UUID | None = None,
        admin_password: str | None = None,
    ) -> CloneOperation:
        new_org_code = new_org_code.strip().upper()
        if not _ORG_CODE_RE.match(new_org_code):
            raise ValueError(f"Invalid org_code {new_org_code!r}: must match [A-Z0-9_-]+")

        source = self.db.get(Instance, source_instance_id)
        if not source:
            raise ValueError("Source instance not found")
        if source.status not in (InstanceStatus.running, InstanceStatus.stopped):
            raise ValueError(f"Cannot clone instance in {source.status.value} state")
        if not admin_password:
            raise ValueError("Admin password is required to clone")

        op = CloneOperation(
            source_instance_id=source_instance_id,
            target_server_id=target_server_id or source.server_id,
            new_org_code=new_org_code,
            new_org_name=new_org_name or f"Clone of {source.org_name}",
            admin_password_encrypted=encrypt_value(admin_password),
            status=CloneStatus.pending,
            include_data=include_data,
            progress_pct=0.0,
            current_step="Queued",
        )
        self.db.add(op)
        self.db.flush()
        return op

    def get_clone_operation(self, clone_id: UUID) -> CloneOperation | None:
        return self.db.get(CloneOperation, clone_id)

    def list_clone_operations(self, instance_id: UUID, limit: int = 50, offset: int = 0) -> list[CloneOperation]:
        stmt = (
            select(CloneOperation)
            .where(CloneOperation.source_instance_id == instance_id)
            .order_by(CloneOperation.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(stmt).all())

    @staticmethod
    def serialize_operation(op: CloneOperation) -> dict:
        return {
            "clone_id": str(op.clone_id),
            "source_instance_id": str(op.source_instance_id),
            "target_instance_id": str(op.target_instance_id) if op.target_instance_id else None,
            "status": op.status.value,
            "progress_pct": op.progress_pct,
            "current_step": op.current_step,
            "error_message": op.error_message,
            "created_at": op.created_at.isoformat() if op.created_at else None,
            "completed_at": op.completed_at.isoformat() if op.completed_at else None,
        }

    def run_clone(self, clone_id: UUID) -> dict:
        op = self.db.get(CloneOperation, clone_id)
        if not op:
            raise ValueError("Clone operation not found")
        if op.status in (CloneStatus.completed, CloneStatus.failed):
            return {"success": op.status == CloneStatus.completed, "clone_id": str(op.clone_id)}

        try:
            source = self.db.get(Instance, op.source_instance_id)
            if not source:
                raise ValueError("Source instance not found")
            if source.status not in (InstanceStatus.running, InstanceStatus.stopped):
                raise ValueError(f"Cannot clone instance in {source.status.value} state")

            self._update_progress(op, CloneStatus.cloning_config, 10.0, "Creating instance record")
            from app.services.instance_service import InstanceService

            inst_svc = InstanceService(self.db)
            target_server_id = op.target_server_id or source.server_id
            clone_instance = inst_svc.create(
                server_id=target_server_id,
                org_code=op.new_org_code,
                org_name=op.new_org_name or f"Clone of {source.org_name}",
                sector_type=source.sector_type.value,
                framework=source.framework.value,
                currency=source.currency,
                admin_email=source.admin_email,
                admin_username=source.admin_username,
                git_repo_id=source.git_repo_id,
                catalog_item_id=source.catalog_item_id,
            )
            clone_instance.plan_id = source.plan_id
            clone_instance.git_branch = source.git_branch
            clone_instance.git_tag = source.git_tag
            op.target_instance_id = clone_instance.instance_id
            self._copy_modules(source.instance_id, clone_instance.instance_id)
            self._copy_flags(source.instance_id, clone_instance.instance_id)
            self._copy_tags(source.instance_id, clone_instance.instance_id)
            self.db.flush()

            if op.include_data:
                self._update_progress(op, CloneStatus.backing_up, 30.0, "Creating source backup")
                from app.services.backup_service import BackupService

                backup_svc = BackupService(self.db)
                backup = backup_svc.create_backup(source.instance_id)
                if backup.status.value != "completed":
                    raise ValueError(backup.error_message or "Backup failed")
                op.backup_id = backup.backup_id
                self.db.flush()

            self._update_progress(op, CloneStatus.deploying, 50.0, "Deploying clone")
            from app.services.deploy_service import DeployService

            deploy_svc = DeployService(self.db)
            admin_password = decrypt_value(op.admin_password_encrypted or "")
            if not admin_password:
                raise ValueError("Admin password missing")
            deployment_id = deploy_svc.create_deployment(clone_instance.instance_id, admin_password)
            self.db.flush()

            result = deploy_svc.run_deployment(
                clone_instance.instance_id,
                deployment_id,
                admin_password,
                deployment_type="full",
            )
            deploy_svc.clear_deploy_secret(clone_instance.instance_id, deployment_id)
            if not result.get("success"):
                raise ValueError(result.get("error", "Clone deployment failed"))

            if op.include_data and op.backup_id:
                self._update_progress(op, CloneStatus.restoring_data, 70.0, "Restoring data")
                self._restore_backup_to_instance(op.backup_id, clone_instance.instance_id)

                self._update_progress(op, CloneStatus.verifying, 90.0, "Running migrations")
                inst_svc.migrate_instance(clone_instance.instance_id)

            op.admin_password_encrypted = None
            op.status = CloneStatus.completed
            op.progress_pct = 100.0
            op.current_step = "Completed"
            op.completed_at = datetime.now(UTC)
            self.db.commit()
            return {"success": True, "clone_id": str(op.clone_id), "instance_id": str(clone_instance.instance_id)}

        except Exception as e:
            logger.exception("Clone %s failed", op.clone_id)
            op.status = CloneStatus.failed
            op.error_message = str(e)[:2000]
            op.admin_password_encrypted = None
            op.completed_at = datetime.now(UTC)
            self.db.commit()
            return {"success": False, "clone_id": str(op.clone_id), "error": str(e)}

    def _update_progress(self, op: CloneOperation, status: CloneStatus, pct: float, step: str) -> None:
        op.status = status
        op.progress_pct = pct
        op.current_step = step
        self.db.commit()

    def _restore_backup_to_instance(self, backup_id: UUID, target_instance_id: UUID) -> None:
        from app.services.backup_service import BackupService

        backup_svc = BackupService(self.db)
        backup = backup_svc.get_by_id(backup_id)
        if not backup or not backup.file_path:
            raise ValueError("Backup not found")
        if backup.status.value != "completed":
            raise ValueError("Backup not completed")

        source_instance = self.db.get(Instance, backup.instance_id)
        if not source_instance:
            raise ValueError("Source instance not found")
        target_instance = self.db.get(Instance, target_instance_id)
        if not target_instance:
            raise ValueError("Target instance not found")

        source_server = self.db.get(Server, source_instance.server_id)
        target_server = self.db.get(Server, target_instance.server_id)
        if not source_server or not target_server:
            raise ValueError("Server not found")

        source_ssh = get_ssh_for_server(source_server)
        target_ssh = get_ssh_for_server(target_server)

        backup_path = backup.file_path
        target_backup_path = backup_path
        local_tmp = None

        if source_server.server_id != target_server.server_id:
            local_tmp = f"/tmp/clone_{backup.backup_id}.sql.gz"
            source_ssh.sftp_get(backup_path, local_tmp)
            target_backup_path = f"/tmp/clone_{backup.backup_id}.sql.gz"
            target_ssh.sftp_put(local_tmp, target_backup_path)

        slug = _safe_slug(target_instance.org_code.lower())
        db_container = f"dotmac_{slug}_db"
        db_name = f"dotmac_{slug}"

        q_db_name = shlex.quote(db_name)
        q_file = shlex.quote(target_backup_path)
        drop_sql = f'DROP DATABASE IF EXISTS "{db_name}" WITH (FORCE); CREATE DATABASE "{db_name}";'
        drop_cmd = f"docker exec {shlex.quote(db_container)} psql -U postgres -d postgres -c {shlex.quote(drop_sql)}"
        drop_result = target_ssh.exec_command(drop_cmd, timeout=60)
        if not drop_result.ok:
            raise ValueError((drop_result.stderr or drop_result.stdout or "Drop failed")[:2000])

        restore_inner = (
            f"set -o pipefail; "
            f"gunzip -c {q_file} | "
            f"docker exec -i {shlex.quote(db_container)} "
            f"psql -U postgres -d {q_db_name}"
        )
        restore_cmd = f"bash -lc {shlex.quote(restore_inner)}"
        result = target_ssh.exec_command(restore_cmd, timeout=600)
        if not result.ok:
            raise ValueError((result.stderr or result.stdout or "Restore failed")[:2000])

        if local_tmp:
            try:
                os.remove(local_tmp)
            except OSError:
                logger.debug("Failed to remove temp clone backup %s", local_tmp)

    def _copy_modules(self, source_id: UUID, target_id: UUID) -> None:
        from app.models.module import InstanceModule

        stmt = select(InstanceModule).where(InstanceModule.instance_id == source_id)
        for im in self.db.scalars(stmt).all():
            self.db.add(
                InstanceModule(
                    instance_id=target_id,
                    module_id=im.module_id,
                    enabled=im.enabled,
                )
            )

    def _copy_flags(self, source_id: UUID, target_id: UUID) -> None:
        from app.models.feature_flag import InstanceFlag

        stmt = select(InstanceFlag).where(InstanceFlag.instance_id == source_id)
        for flag in self.db.scalars(stmt).all():
            self.db.add(
                InstanceFlag(
                    instance_id=target_id,
                    flag_key=flag.flag_key,
                    flag_value=flag.flag_value,
                )
            )

    def _copy_tags(self, source_id: UUID, target_id: UUID) -> None:
        from app.models.instance_tag import InstanceTag

        stmt = select(InstanceTag).where(InstanceTag.instance_id == source_id)
        for tag in self.db.scalars(stmt).all():
            self.db.add(
                InstanceTag(
                    instance_id=target_id,
                    key=tag.key,
                    value=tag.value,
                )
            )
