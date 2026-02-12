"""Tenant Audit Service — log and query tenant-level actions."""

from __future__ import annotations

import logging
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.tenant_audit import TenantAuditLog

logger = logging.getLogger(__name__)

_VALID_ACTIONS = {
    "module_toggled",
    "flag_toggled",
    "plan_assigned",
    "deploy_triggered",
    "reconfigure_triggered",
    "backup_created",
    "backup_restored",
    "backup_deleted",
    "instance_suspended",
    "instance_reactivated",
    "instance_archived",
    "instance_cloned",
    "domain_added",
    "domain_removed",
    "domain_verified",
    "ssl_provisioned",
    "version_pinned",
    "maintenance_window_set",
    "approval_requested",
    "approval_resolved",
    "tag_set",
    "tag_removed",
    "alert_rule_created",
    "alert_rule_deleted",
    "webhook_created",
    "webhook_deleted",
}


class TenantAuditService:
    def __init__(self, db: Session):
        self.db = db

    def log(
        self,
        instance_id: UUID,
        action: str,
        *,
        user_id: str | None = None,
        user_name: str | None = None,
        details: dict | None = None,
        ip_address: str | None = None,
    ) -> TenantAuditLog:
        entry = TenantAuditLog(
            instance_id=instance_id,
            action=action,
            user_id=user_id,
            user_name=user_name,
            details=details,
            ip_address=ip_address,
        )
        self.db.add(entry)
        self.db.flush()
        return entry

    def get_logs(
        self,
        instance_id: UUID,
        *,
        action: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[TenantAuditLog]:
        stmt = select(TenantAuditLog).where(TenantAuditLog.instance_id == instance_id)
        if action:
            stmt = stmt.where(TenantAuditLog.action == action)
        stmt = stmt.order_by(TenantAuditLog.created_at.desc()).offset(offset).limit(limit)
        return list(self.db.scalars(stmt).all())

    def count_logs(self, instance_id: UUID, action: str | None = None) -> int:
        stmt = select(func.count(TenantAuditLog.id)).where(TenantAuditLog.instance_id == instance_id)
        if action:
            stmt = stmt.where(TenantAuditLog.action == action)
        return self.db.scalar(stmt) or 0

    @staticmethod
    def serialize_log(entry: TenantAuditLog) -> dict:
        return {
            "id": entry.id,
            "action": entry.action,
            "user_name": entry.user_name,
            "details": entry.details,
            "created_at": entry.created_at.isoformat() if entry.created_at else None,
        }
