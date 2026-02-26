"""Deploy Approval Service — two-person approval workflow."""

from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.deploy_approval import ApprovalStatus, DeployApproval

logger = logging.getLogger(__name__)


class ApprovalService:
    _pending_upgrade: tuple[str, datetime | None] | None

    def __init__(self, db: Session):
        self.db = db
        self._pending_upgrade = None

    def request_approval(
        self,
        instance_id: UUID,
        requested_by: str,
        requested_by_name: str | None = None,
        *,
        deployment_type: str = "full",
        git_ref: str | None = None,
        reason: str | None = None,
        upgrade_id: UUID | None = None,
    ) -> DeployApproval:
        # Check no pending approval already exists
        existing = self._get_pending(instance_id)
        if existing:
            raise ValueError("An approval request is already pending for this instance")

        approval = DeployApproval(
            instance_id=instance_id,
            upgrade_id=upgrade_id,
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
        approval.resolved_at = datetime.now(UTC)
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
        approval.resolved_at = datetime.now(UTC)
        self.db.flush()
        return approval

    def get_pending(
        self,
        instance_id: UUID | None = None,
        *,
        org_id: UUID | str | None = None,
    ) -> list[DeployApproval]:
        from app.models.instance import Instance

        self.expire_pending(max_age_days=7)
        stmt = select(DeployApproval).where(DeployApproval.status == ApprovalStatus.pending)
        if org_id is not None:
            org_uuid = org_id if isinstance(org_id, UUID) else UUID(str(org_id))
            stmt = stmt.join(Instance, Instance.instance_id == DeployApproval.instance_id).where(
                Instance.org_id == org_uuid
            )
        if instance_id:
            stmt = stmt.where(DeployApproval.instance_id == instance_id)
        stmt = stmt.order_by(DeployApproval.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_history(self, instance_id: UUID, limit: int = 50) -> list[DeployApproval]:
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

    def is_upgrade_approved(self, upgrade_id: UUID) -> bool:
        stmt = select(DeployApproval).where(
            DeployApproval.upgrade_id == upgrade_id,
            DeployApproval.status == ApprovalStatus.approved,
        )
        return self.db.scalar(stmt) is not None

    def expire_pending(self, max_age_days: int = 7) -> int:
        cutoff = datetime.now(UTC) - timedelta(days=max_age_days)
        stmt = select(DeployApproval).where(
            DeployApproval.status == ApprovalStatus.pending,
            DeployApproval.created_at < cutoff,
        )
        approvals = list(self.db.scalars(stmt).all())
        for approval in approvals:
            approval.status = ApprovalStatus.expired
            approval.resolved_at = datetime.now(UTC)
        if approvals:
            self.db.flush()
        return len(approvals)

    def _get_pending(self, instance_id: UUID) -> DeployApproval | None:
        stmt = select(DeployApproval).where(
            DeployApproval.instance_id == instance_id,
            DeployApproval.status == ApprovalStatus.pending,
        )
        return self.db.scalar(stmt)

    def get_list_bundle(self, history_limit: int = 100) -> dict:
        from app.models.app_upgrade import AppUpgrade
        from app.models.catalog import AppCatalogItem, AppRelease
        from app.services.instance_service import InstanceService

        pending = self.get_pending()
        history = list(
            self.db.scalars(
                select(DeployApproval).order_by(DeployApproval.created_at.desc()).limit(history_limit)
            ).all()
        )
        instances = InstanceService(self.db).list_all()
        inst_map = {i.instance_id: i for i in instances}

        upgrade_map: dict[UUID, dict] = {}
        upgrade_ids = {a.upgrade_id for a in pending + history if a.upgrade_id}
        if upgrade_ids:
            upgrades = list(self.db.scalars(select(AppUpgrade).where(AppUpgrade.upgrade_id.in_(upgrade_ids))).all())
            catalog_ids = {u.catalog_item_id for u in upgrades}
            items = list(
                self.db.scalars(select(AppCatalogItem).where(AppCatalogItem.catalog_id.in_(catalog_ids))).all()
            )
            item_map = {i.catalog_id: i for i in items}
            release_ids = {i.release_id for i in items}
            releases = list(self.db.scalars(select(AppRelease).where(AppRelease.release_id.in_(release_ids))).all())
            release_map = {r.release_id: r for r in releases}

            for up in upgrades:
                item = item_map.get(up.catalog_item_id)
                release = release_map.get(item.release_id) if item else None
                upgrade_map[up.upgrade_id] = {
                    "catalog_label": item.label if item else None,
                    "release_version": release.version if release else None,
                    "release_name": release.name if release else None,
                }

        return {
            "pending": pending,
            "history": history,
            "inst_map": inst_map,
            "upgrade_map": upgrade_map,
        }

    def approve_and_dispatch(
        self,
        approval_id: UUID,
        approved_by: str,
        approved_by_name: str | None = None,
    ) -> DeployApproval:
        """Approve a deployment and dispatch the upgrade task if applicable.

        Caller must call db.commit() first, then call dispatch_upgrade() on
        the returned object (or use the helper after commit).
        """
        approval = self.approve(approval_id, approved_by, approved_by_name)
        upgrade_id, upgrade_eta = self.resolve_upgrade_schedule(approval)
        # Stash for post-commit dispatch
        self._pending_upgrade = (upgrade_id, upgrade_eta) if upgrade_id else None
        return approval

    def dispatch_upgrade(self) -> None:
        """Dispatch the upgrade task queued by approve_and_dispatch.

        Must be called AFTER db.commit().
        """
        if not self._pending_upgrade:
            return
        upgrade_id, upgrade_eta = self._pending_upgrade
        from app.tasks.upgrade import run_upgrade

        if upgrade_eta:
            run_upgrade.apply_async(args=[upgrade_id], eta=upgrade_eta)
        else:
            run_upgrade.delay(upgrade_id)
        self._pending_upgrade = None

    def resolve_upgrade_schedule(self, approval: DeployApproval) -> tuple[str | None, datetime | None]:
        if approval.deployment_type != "upgrade" or not approval.upgrade_id:
            return None, None
        from app.models.app_upgrade import AppUpgrade

        upgrade = self.db.get(AppUpgrade, approval.upgrade_id)
        if not upgrade:
            return None, None
        return str(upgrade.upgrade_id), upgrade.scheduled_for

    @staticmethod
    def serialize_approval(approval: DeployApproval) -> dict:
        return {
            "approval_id": str(approval.approval_id),
            "instance_id": str(approval.instance_id),
            "upgrade_id": str(approval.upgrade_id) if approval.upgrade_id else None,
            "requested_by_name": approval.requested_by_name,
            "deployment_type": approval.deployment_type,
            "git_ref": approval.git_ref,
            "reason": approval.reason,
            "status": approval.status.value,
            "created_at": approval.created_at.isoformat() if approval.created_at else None,
        }
