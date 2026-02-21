"""Disaster Recovery Service — scheduled backups and restore/testing."""

from __future__ import annotations

import logging
import secrets
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.backup import Backup, BackupStatus
from app.models.dr_plan import DisasterRecoveryPlan, DRTestStatus
from app.models.instance import Instance
from app.models.server import Server

logger = logging.getLogger(__name__)


class DisasterRecoveryService:
    def __init__(self, db: Session):
        self.db = db

    def create_dr_plan(
        self,
        instance_id: UUID,
        backup_schedule_cron: str = "0 2 * * *",
        retention_days: int = 30,
        target_server_id: UUID | None = None,
    ) -> DisasterRecoveryPlan:
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError("Instance not found")
        _validate_cron(backup_schedule_cron)

        plan = DisasterRecoveryPlan(
            instance_id=instance_id,
            backup_schedule_cron=backup_schedule_cron,
            retention_days=retention_days,
            target_server_id=target_server_id,
            is_active=True,
        )
        self.db.add(plan)
        self.db.flush()
        return plan

    def update_dr_plan(self, dr_plan_id: UUID, **kwargs) -> DisasterRecoveryPlan:
        plan = self.get_by_id(dr_plan_id)
        if not plan:
            raise ValueError("DR plan not found")
        if "backup_schedule_cron" in kwargs and kwargs["backup_schedule_cron"]:
            _validate_cron(str(kwargs["backup_schedule_cron"]))
        for key, value in kwargs.items():
            if hasattr(plan, key) and value is not None:
                setattr(plan, key, value)
        self.db.flush()
        return plan

    def delete_dr_plan(self, dr_plan_id: UUID) -> None:
        plan = self.get_by_id(dr_plan_id)
        if not plan:
            raise ValueError("DR plan not found")
        self.db.delete(plan)
        self.db.flush()

    def list_for_org(self, org_id: UUID, limit: int = 200, offset: int = 0) -> list[DisasterRecoveryPlan]:
        """List DR plans for instances belonging to a specific organization."""
        stmt = (
            select(DisasterRecoveryPlan)
            .join(Instance, Instance.instance_id == DisasterRecoveryPlan.instance_id)
            .where(Instance.org_id == org_id)
            .order_by(DisasterRecoveryPlan.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(stmt).all())

    def list_plans(self, limit: int = 200, offset: int = 0) -> list[DisasterRecoveryPlan]:
        stmt = select(DisasterRecoveryPlan).order_by(DisasterRecoveryPlan.created_at.desc()).limit(limit).offset(offset)
        return list(self.db.scalars(stmt).all())

    def serialize_plan(self, plan: DisasterRecoveryPlan) -> dict:
        return {
            "dr_plan_id": str(plan.dr_plan_id),
            "instance_id": str(plan.instance_id),
            "backup_schedule_cron": plan.backup_schedule_cron,
            "retention_days": plan.retention_days,
            "target_server_id": str(plan.target_server_id) if plan.target_server_id else None,
            "is_active": plan.is_active,
            "last_backup_at": plan.last_backup_at.isoformat() if plan.last_backup_at else None,
            "last_tested_at": plan.last_tested_at.isoformat() if plan.last_tested_at else None,
            "last_test_status": plan.last_test_status.value if plan.last_test_status else None,
            "last_test_message": plan.last_test_message,
            "created_at": plan.created_at.isoformat() if plan.created_at else None,
        }

    def get_index_bundle(self) -> dict:
        from app.services.instance_service import InstanceService
        from app.services.server_service import ServerService

        plans = self.list_plans(limit=200, offset=0)
        instances = InstanceService(self.db).list_all()
        servers = ServerService(self.db).list_all()
        return {"plans": plans, "instances": instances, "servers": servers}

    def get_by_id(self, dr_plan_id: UUID) -> DisasterRecoveryPlan | None:
        return self.db.get(DisasterRecoveryPlan, dr_plan_id)

    def run_scheduled_backup(self, dr_plan_id: UUID) -> Backup:
        plan = self.get_by_id(dr_plan_id)
        if not plan:
            raise ValueError("DR plan not found")
        if not plan.is_active:
            raise ValueError("DR plan is inactive")

        from app.services.backup_service import BackupService

        backup = BackupService(self.db).create_backup(plan.instance_id)
        if backup.status == BackupStatus.completed:
            plan.last_backup_at = backup.completed_at or datetime.now(UTC)
        self.db.flush()
        return backup

    def transfer_backup(self, backup: Backup, source_server: Server, target_server: Server) -> str:
        from app.services.backup_service import BackupService

        return BackupService(self.db).transfer_backup_file(backup, source_server, target_server)

    def restore_to_server(
        self,
        backup_id: UUID,
        target_server_id: UUID,
        new_org_code: str,
        new_org_name: str | None = None,
        admin_password: str | None = None,
    ) -> Instance:
        backup = self.db.get(Backup, backup_id)
        if not backup or backup.status != BackupStatus.completed:
            raise ValueError("Backup not found or not completed")
        source_instance = self.db.get(Instance, backup.instance_id)
        if not source_instance:
            raise ValueError("Source instance not found")

        target_server = self.db.get(Server, target_server_id)
        if not target_server:
            raise ValueError("Target server not found")

        admin_password = admin_password or secrets.token_urlsafe(16)

        from app.services.backup_service import BackupService
        from app.services.deploy_service import DeployService
        from app.services.instance_service import InstanceService

        inst_svc = InstanceService(self.db)
        new_instance = inst_svc.create(
            server_id=target_server_id,
            org_code=new_org_code,
            org_name=new_org_name or f"Restore of {source_instance.org_name}",
            sector_type=source_instance.sector_type.value if source_instance.sector_type else None,
            framework=source_instance.framework.value if source_instance.framework else None,
            currency=source_instance.currency,
            admin_email=source_instance.admin_email,
            admin_username=source_instance.admin_username,
            git_repo_id=source_instance.git_repo_id,
            catalog_item_id=source_instance.catalog_item_id,
        )
        new_instance.plan_id = source_instance.plan_id
        new_instance.git_branch = source_instance.git_branch
        new_instance.git_tag = source_instance.git_tag
        self.db.flush()

        # Transfer backup file if cross-server
        source_server = self.db.get(Server, source_instance.server_id)
        if not source_server:
            raise ValueError("Source server not found")

        backup_path_override = None
        if source_server.server_id != target_server.server_id:
            backup_path_override = self.transfer_backup(backup, source_server, target_server)

        if backup_path_override:
            backup.file_path = backup_path_override
            self.db.flush()

        deploy_svc = DeployService(self.db)
        deployment_id = deploy_svc.create_deployment(new_instance.instance_id, admin_password)
        self.db.flush()

        result = deploy_svc.run_deployment(new_instance.instance_id, deployment_id, admin_password)
        deploy_svc.clear_deploy_secret(new_instance.instance_id, deployment_id)
        if not result.get("success"):
            raise ValueError(result.get("error", "Deploy failed"))

        BackupService(self.db).restore_backup_clean(new_instance.instance_id, backup.backup_id)
        inst_svc.migrate_instance(new_instance.instance_id)

        return new_instance

    def test_dr(self, dr_plan_id: UUID) -> dict:
        plan = self.get_by_id(dr_plan_id)
        if not plan:
            raise ValueError("DR plan not found")
        plan.last_test_status = DRTestStatus.running
        plan.last_test_message = None
        self.db.flush()

        try:
            from app.services.backup_service import BackupService

            backup = BackupService(self.db).create_backup(plan.instance_id)
            if backup.status != BackupStatus.completed:
                raise ValueError(backup.error_message or "Backup failed")

            target_server_id = plan.target_server_id
            if not target_server_id:
                raise ValueError("Target server not set for DR plan")

            base_code = f"DRTEST{backup.backup_id.hex[:6]}".upper()
            test_org_code = _next_available_org_code(self.db, base_code)
            instance = self.restore_to_server(
                backup.backup_id,
                target_server_id,
                test_org_code,
                new_org_name="DR Test",
                admin_password=secrets.token_urlsafe(16),
            )

            # Mark test passed
            plan.last_test_status = DRTestStatus.passed
            plan.last_test_message = f"Restored to {instance.org_code}"
            plan.last_tested_at = datetime.now(UTC)
            self.db.flush()
            return {"success": True, "instance_id": str(instance.instance_id)}

        except Exception as e:
            logger.exception("DR test failed")
            plan.last_test_status = DRTestStatus.failed
            plan.last_test_message = str(e)[:2000]
            plan.last_tested_at = datetime.now(UTC)
            self.db.flush()
            return {"success": False, "error": str(e)}

    def get_dr_status(self, instance_id: UUID) -> dict:
        plan = self.db.scalar(select(DisasterRecoveryPlan).where(DisasterRecoveryPlan.instance_id == instance_id))
        if not plan:
            return {"configured": False}
        return {
            "configured": True,
            "dr_plan_id": str(plan.dr_plan_id),
            "backup_schedule_cron": plan.backup_schedule_cron,
            "retention_days": plan.retention_days,
            "target_server_id": str(plan.target_server_id) if plan.target_server_id else None,
            "last_backup_at": plan.last_backup_at.isoformat() if plan.last_backup_at else None,
            "last_tested_at": plan.last_tested_at.isoformat() if plan.last_tested_at else None,
            "last_test_status": plan.last_test_status.value if plan.last_test_status else None,
            "last_test_message": plan.last_test_message,
            "is_active": plan.is_active,
        }


def _next_available_org_code(db: Session, base: str) -> str:
    candidate = base.upper()
    for i in range(10):
        exists = db.scalar(select(Instance).where(Instance.org_code == candidate))
        if not exists:
            return candidate
        candidate = f"{base}_{i + 1}"
    raise ValueError("Unable to allocate DR test org code")


def _validate_cron(expr: str) -> None:
    parts = (expr or "").strip().split()
    if len(parts) != 5:
        raise ValueError("Invalid cron expression: must have 5 fields")

    ranges = [
        (0, 59),  # minute
        (0, 23),  # hour
        (1, 31),  # day of month
        (1, 12),  # month
        (0, 6),  # day of week
    ]

    for idx, part in enumerate(parts):
        _validate_cron_field(part, ranges[idx][0], ranges[idx][1])


def _validate_cron_field(field: str, min_val: int, max_val: int) -> None:
    for token in field.split(","):
        token = token.strip()
        if token == "*":
            continue
        if "/" in token:
            base, step = token.split("/", 1)
            if not step.isdigit() or int(step) < 1:
                raise ValueError("Invalid cron step")
            if base == "*":
                continue
            token = base
        if "-" in token:
            start, end = token.split("-", 1)
            if not (start.isdigit() and end.isdigit()):
                raise ValueError("Invalid cron range")
            start_i = int(start)
            end_i = int(end)
            if start_i > end_i or start_i < min_val or end_i > max_val:
                raise ValueError("Invalid cron range")
            continue
        if not token.isdigit():
            raise ValueError("Invalid cron field")
        value = int(token)
        if value < min_val or value > max_val:
            raise ValueError("Invalid cron value")
