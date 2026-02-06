"""Deploy Approval Service — two-person approval workflow."""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.deploy_approval import ApprovalStatus, DeployApproval

logger = logging.getLogger(__name__)


class ApprovalService:
    def __init__(self, db: Session):
        self.db = db

    def request_approval(
        self,
        instance_id: UUID,
        requested_by: str,
        requested_by_name: str | None = None,
        *,
        deployment_type: str = "full",
        git_ref: str | None = None,
        reason: str | None = None,
    ) -> DeployApproval:
        # Check no pending approval already exists
        existing = self._get_pending(instance_id)
        if existing:
            raise ValueError("An approval request is already pending for this instance")

        approval = DeployApproval(
            instance_id=instance_id,
            requested_by=requested_by,
            requested_by_name=requested_by_name,
            deployment_type=deployment_type,
            git_ref=git_ref,
            reason=reason,
        )
        self.db.add(approval)
        self.db.flush()
        return approval

    def approve(
        self,
        approval_id: UUID,
        approved_by: str,
        approved_by_name: str | None = None,
    ) -> DeployApproval:
        approval = self.db.get(DeployApproval, approval_id)
        if not approval:
            raise ValueError("Approval not found")
        if approval.status != ApprovalStatus.pending:
            raise ValueError(f"Approval is already {approval.status.value}")
        if approval.requested_by == approved_by:
            raise ValueError("Cannot approve your own deployment request")

        approval.status = ApprovalStatus.approved
        approval.approved_by = approved_by
        approval.approved_by_name = approved_by_name
        approval.resolved_at = datetime.now(timezone.utc)
        self.db.flush()
        return approval

    def reject(
        self,
        approval_id: UUID,
        rejected_by: str,
        rejected_by_name: str | None = None,
        reason: str | None = None,
    ) -> DeployApproval:
        approval = self.db.get(DeployApproval, approval_id)
        if not approval:
            raise ValueError("Approval not found")
        if approval.status != ApprovalStatus.pending:
            raise ValueError(f"Approval is already {approval.status.value}")

        approval.status = ApprovalStatus.rejected
        approval.approved_by = rejected_by
        approval.approved_by_name = rejected_by_name
        if reason:
            approval.reason = reason
        approval.resolved_at = datetime.now(timezone.utc)
        self.db.flush()
        return approval

    def get_pending(self, instance_id: UUID | None = None) -> list[DeployApproval]:
        stmt = select(DeployApproval).where(
            DeployApproval.status == ApprovalStatus.pending
        )
        if instance_id:
            stmt = stmt.where(DeployApproval.instance_id == instance_id)
        stmt = stmt.order_by(DeployApproval.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_history(
        self, instance_id: UUID, limit: int = 50
    ) -> list[DeployApproval]:
        stmt = (
            select(DeployApproval)
            .where(DeployApproval.instance_id == instance_id)
            .order_by(DeployApproval.created_at.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def requires_approval(self, instance_id: UUID) -> bool:
        """Check if this instance requires deploy approval.

        For now: any instance with a 'requires_approval' tag set to 'true'.
        """
        from app.models.instance_tag import InstanceTag

        stmt = select(InstanceTag).where(
            InstanceTag.instance_id == instance_id,
            InstanceTag.key == "requires_approval",
            InstanceTag.value == "true",
        )
        return self.db.scalar(stmt) is not None

    def _get_pending(self, instance_id: UUID) -> DeployApproval | None:
        stmt = select(DeployApproval).where(
            DeployApproval.instance_id == instance_id,
            DeployApproval.status == ApprovalStatus.pending,
        )
        return self.db.scalar(stmt)
