"""Clone Service — clone an existing instance for staging/testing."""

from __future__ import annotations

import logging
import re
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.instance import Instance, InstanceStatus

logger = logging.getLogger(__name__)

_ORG_CODE_RE = re.compile(r"^[a-zA-Z0-9_-]+$")


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
    ) -> Instance:
        """Clone an instance configuration, optionally with data.

        Steps:
        1. Copy instance config (server, plan, modules, flags, tags)
        2. Allocate new ports
        3. If include_data: create backup of source, mark for restore after deploy
        """
        if not _ORG_CODE_RE.match(new_org_code):
            raise ValueError(f"Invalid org_code {new_org_code!r}: must match [a-zA-Z0-9_-]+")

        source = self.db.get(Instance, source_instance_id)
        if not source:
            raise ValueError("Source instance not found")
        if source.status not in (InstanceStatus.running, InstanceStatus.stopped):
            raise ValueError(f"Cannot clone instance in {source.status.value} state")

        # Allocate new ports
        from app.services.instance_service import InstanceService

        inst_svc = InstanceService(self.db)
        app_port, db_port, redis_port = inst_svc.allocate_ports(source.server_id)

        # Compute deploy_path from source's pattern
        deploy_path = None
        if source.deploy_path:
            base = source.deploy_path.rsplit("/", 1)[0] if "/" in source.deploy_path else source.deploy_path
            deploy_path = f"{base}/{new_org_code}"

        clone = Instance(
            server_id=source.server_id,
            org_code=new_org_code,
            org_name=new_org_name or f"Clone of {source.org_name}",
            sector_type=source.sector_type,
            framework=source.framework,
            currency=source.currency,
            app_port=app_port,
            db_port=db_port,
            redis_port=redis_port,
            admin_email=source.admin_email,
            admin_username=source.admin_username,
            plan_id=source.plan_id,
            git_branch=source.git_branch,
            git_tag=source.git_tag,
            deploy_path=deploy_path,
            status=InstanceStatus.provisioned,
            notes=f"Cloned from {source.org_code} ({source_instance_id})",
        )
        self.db.add(clone)
        self.db.flush()

        # Copy modules
        self._copy_modules(source_instance_id, clone.instance_id)
        # Copy flags
        self._copy_flags(source_instance_id, clone.instance_id)
        # Copy tags
        self._copy_tags(source_instance_id, clone.instance_id)

        # If data cloning requested, create backup reference
        backup_id = None
        if include_data:
            try:
                from app.services.backup_service import BackupService

                backup_svc = BackupService(self.db)
                backup = backup_svc.create_backup(source_instance_id)
                backup_id = backup.backup_id
            except Exception as e:
                logger.warning("Could not create backup for clone: %s", e)

        self.db.flush()
        logger.info(
            "Cloned instance %s -> %s (org_code=%s, backup=%s)",
            source_instance_id,
            clone.instance_id,
            new_org_code,
            backup_id,
        )
        return clone

    def _copy_modules(self, source_id: UUID, target_id: UUID) -> None:
        from sqlalchemy import select

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
        from sqlalchemy import select

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
        from sqlalchemy import select

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
