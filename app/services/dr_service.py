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

    def list_plans(self, limit: int = 200, offset: int = 0) -> list[DisasterRecoveryPlan]:
        stmt = select(DisasterRecoveryPlan).order_by(DisasterRecoveryPlan.created_at.desc()).limit(limit).offset(offset)
        return list(self.db.scalars(stmt).all())

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
            sector_type=source_instance.sector_type.value,
            framework=source_instance.framework.value,
            currency=source_instance.currency,
            admin_email=source_instance.admin_email,
            admin_username=source_instance.admin_username,
        )
        new_instance.plan_id = source_instance.plan_id
        new_instance.git_branch = source_instance.git_branch
        new_instance.git_tag = source_instance.git_tag
        new_instance.git_repo_id = source_instance.git_repo_id
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

            test_org_code = f"DRTEST{backup.backup_id.hex[:6]}".upper()
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
