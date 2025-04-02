from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.modules.audit.models import AuditLog, AuditLogCreate


class AuditService:
    """
    Service for managing audit logs.
    """

    @staticmethod
    async def create_audit_log(db: Session, audit_log: AuditLogCreate) -> AuditLog:
        """
        Create a new audit log entry.
        """
        db_audit_log = AuditLog(
            actor_id=audit_log.actor_id,
            event_type=audit_log.event_type,
            resource_type=audit_log.resource_type,
            resource_id=audit_log.resource_id,
            action=audit_log.action,
            old_value=audit_log.old_value,
            new_value=audit_log.new_value,
            event_metadata=audit_log.event_metadata,
            ip_address=audit_log.ip_address,
        )

        db.add(db_audit_log)
        db.commit()
        db.refresh(db_audit_log)

        return db_audit_log

    @staticmethod
    async def get_audit_logs(
        db: Session,
        actor_id: Optional[str] = None,
        event_type: Optional[str] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        action: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[AuditLog]:
        """
        Get audit logs with optional filtering.
        """
        query = db.query(AuditLog)

        # Apply filters
        if actor_id:
            query = query.filter(AuditLog.actor_id == actor_id)

        if event_type:
            query = query.filter(AuditLog.event_type == event_type)

        if resource_type:
            query = query.filter(AuditLog.resource_type == resource_type)

        if resource_id:
            query = query.filter(AuditLog.resource_id == resource_id)

        if action:
            query = query.filter(AuditLog.action == action)

        if start_date:
            query = query.filter(AuditLog.created_at >= start_date)

        if end_date:
            query = query.filter(AuditLog.created_at <= end_date)

        # Order by created_at desc (newest first)
        query = query.order_by(AuditLog.created_at.desc())

        # Apply pagination
        return query.offset(skip).limit(limit).all()

    @staticmethod
    async def get_audit_log_by_id(db: Session, audit_log_id: int) -> Optional[AuditLog]:
        """
        Get an audit log by ID.
        """
        return db.query(AuditLog).filter(AuditLog.id == audit_log_id).first()

    @staticmethod
    async def record_config_change(
        db: Session,
        actor_id: str,
        scope_name: str,
        key: str,
        old_value: Optional[str],
        new_value: str,
        action: str,
        ip_address: Optional[str] = None,
    ) -> AuditLog:
        """
        Record a configuration change in the audit log.
        """
        audit_log = AuditLogCreate(
            actor_id=actor_id,
            event_type="config_change",
            resource_type="config",
            resource_id=f"{scope_name}.{key}",
            action=action,
            old_value=old_value,
            new_value=new_value,
            event_metadata={"scope": scope_name, "key": key},
            ip_address=ip_address,
        )

        return await AuditService.create_audit_log(db, audit_log)

    @staticmethod
    async def record_feature_flag_change(
        db: Session,
        actor_id: str,
        flag_key: str,
        old_value: Optional[bool],
        new_value: bool,
        action: str,
        ip_address: Optional[str] = None,
    ) -> AuditLog:
        """
        Record a feature flag change in the audit log.
        """
        audit_log = AuditLogCreate(
            actor_id=actor_id,
            event_type="feature_flag_change",
            resource_type="feature_flag",
            resource_id=flag_key,
            action=action,
            old_value=str(old_value) if old_value is not None else None,
            new_value=str(new_value),
            event_metadata={"flag_key": flag_key},
            ip_address=ip_address,
        )

        return await AuditService.create_audit_log(db, audit_log)

    @staticmethod
    async def record_webhook_change(
        db: Session,
        actor_id: str,
        webhook_id: str,
        action: str,
        old_value: Optional[Dict[str, Any]] = None,
        new_value: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
    ) -> AuditLog:
        """
        Record a webhook change in the audit log.
        """
        audit_log = AuditLogCreate(
            actor_id=actor_id,
            event_type="webhook_change",
            resource_type="webhook",
            resource_id=webhook_id,
            action=action,
            old_value=str(old_value) if old_value else None,
            new_value=str(new_value) if new_value else None,
            event_metadata={"webhook_id": webhook_id},
            ip_address=ip_address,
        )

        return await AuditService.create_audit_log(db, audit_log)
