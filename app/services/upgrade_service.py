"""Upgrade Service — manage app upgrades (manual/scheduled)."""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.app_upgrade import AppUpgrade, UpgradeStatus
from app.models.catalog import AppCatalogItem
from app.models.instance import Instance

logger = logging.getLogger(__name__)


class UpgradeService:
    _pending_dispatch: tuple[AppUpgrade, datetime | None] | None

    def __init__(self, db: Session):
        self.db = db
        self._pending_dispatch = None

    def create_upgrade(
        self,
        instance_id: UUID,
        catalog_item_id: UUID,
        scheduled_for: datetime | None = None,
        requested_by: str | None = None,
    ) -> AppUpgrade:
        instance = self.db.get(Instance, instance_id)
        if not instance:
            raise ValueError("Instance not found")
        catalog_item = self.db.get(AppCatalogItem, catalog_item_id)
        if not catalog_item or not catalog_item.is_active:
            raise ValueError("Catalog item not found or inactive")

        status = UpgradeStatus.scheduled
        upgrade = AppUpgrade(
            instance_id=instance_id,
            catalog_item_id=catalog_item_id,
            status=status,
            scheduled_for=scheduled_for,
            requested_by=requested_by,
        )
        self.db.add(upgrade)
        self.db.flush()
        return upgrade

    def list_upgrades(self, instance_id: UUID, limit: int = 50, offset: int = 0) -> list[AppUpgrade]:
        stmt = (
            select(AppUpgrade)
            .where(AppUpgrade.instance_id == instance_id)
            .order_by(AppUpgrade.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(self.db.scalars(stmt).all())

    @staticmethod
    def serialize_upgrade(upgrade: AppUpgrade) -> dict:
        return {
            "upgrade_id": str(upgrade.upgrade_id),
            "catalog_item_id": str(upgrade.catalog_item_id),
            "status": upgrade.status.value,
            "scheduled_for": upgrade.scheduled_for.isoformat() if upgrade.scheduled_for else None,
            "started_at": upgrade.started_at.isoformat() if upgrade.started_at else None,
            "completed_at": upgrade.completed_at.isoformat() if upgrade.completed_at else None,
            "cancelled_by": upgrade.cancelled_by,
            "cancelled_by_name": upgrade.cancelled_by_name,
            "error_message": upgrade.error_message,
            "created_at": upgrade.created_at.isoformat() if upgrade.created_at else None,
        }

    def run_upgrade(self, upgrade_id: UUID) -> dict:
        upgrade = self.db.get(AppUpgrade, upgrade_id)
        if not upgrade:
            raise ValueError("Upgrade not found")
        if upgrade.status in (UpgradeStatus.completed, UpgradeStatus.cancelled):
            return {"success": upgrade.status == UpgradeStatus.completed}

        instance = self.db.get(Instance, upgrade.instance_id)
        if not instance:
            raise ValueError("Instance not found")

        catalog_item = self.db.get(AppCatalogItem, upgrade.catalog_item_id)
        if not catalog_item:
            raise ValueError("Catalog item not found")
        release = catalog_item.release
        if not release or not release.is_active:
            raise ValueError("Catalog release not found or inactive")

        try:
            upgrade.status = UpgradeStatus.running
            upgrade.started_at = datetime.now(UTC)
            self.db.commit()

            # Update instance catalog selection
            instance.catalog_item_id = catalog_item.catalog_id
            self.db.flush()

            # Deploy using catalog release git_ref/repo
            from app.services.deploy_service import DeployService

            deploy_svc = DeployService(self.db)
            deployment_id = deploy_svc.create_deployment(
                instance.instance_id,
                deployment_type="upgrade",
                git_ref=release.git_ref,
                upgrade_id=upgrade.upgrade_id,
            )
            self.db.flush()

            result = deploy_svc.run_deployment(
                instance.instance_id,
                deployment_id,
                admin_password="",
                deployment_type="upgrade",
                git_ref=release.git_ref,
            )
            if not result.get("success"):
                raise ValueError(result.get("error", "Upgrade deploy failed"))

            upgrade.status = UpgradeStatus.completed
            upgrade.completed_at = datetime.now(UTC)
            self.db.commit()
            return {"success": True}

        except Exception as e:
            logger.exception("Upgrade failed")
            upgrade.status = UpgradeStatus.failed
            upgrade.error_message = str(e)[:2000]
            upgrade.completed_at = datetime.now(UTC)
            self.db.commit()
            return {"success": False, "error": str(e)}

    def create_and_dispatch(
        self,
        instance_id: UUID,
        catalog_item_id: UUID,
        *,
        scheduled_for: str | None = None,
        requested_by: str | None = None,
        requested_by_name: str | None = None,
    ) -> dict:
        """Create an upgrade, handle approval if needed, and dispatch the task.

        Returns a dict with upgrade_id, status, and approval info.
        """
        from app.services.approval_service import ApprovalService
        from app.services.catalog_service import CatalogService

        scheduled_dt: datetime | None = None
        if scheduled_for:
            scheduled_dt = datetime.fromisoformat(scheduled_for)
            if scheduled_dt.tzinfo is None:
                scheduled_dt = scheduled_dt.replace(tzinfo=UTC)

        upgrade = self.create_upgrade(
            instance_id,
            catalog_item_id,
            scheduled_for=scheduled_dt,
            requested_by=requested_by,
        )

        approval_svc = ApprovalService(self.db)
        if approval_svc.requires_approval(instance_id):
            catalog_item = CatalogService(self.db).get_catalog_item(catalog_item_id)
            release = catalog_item.release if catalog_item else None
            reason: str | None = None
            if catalog_item:
                reason = f"Upgrade to {catalog_item.label}"
                if release and release.version:
                    reason = f"{reason} ({release.version})"
            approval = approval_svc.request_approval(
                instance_id,
                requested_by=requested_by or "unknown",
                requested_by_name=requested_by_name,
                deployment_type="upgrade",
                git_ref=release.git_ref if release else None,
                reason=reason,
                upgrade_id=upgrade.upgrade_id,
            )
            return {
                "upgrade_id": str(upgrade.upgrade_id),
                "status": upgrade.status.value,
                "approval_required": True,
                "approval_id": str(approval.approval_id),
            }

        # No approval needed — dispatch task after caller commits
        self._pending_dispatch = (upgrade, scheduled_dt)
        return {
            "upgrade_id": str(upgrade.upgrade_id),
            "status": upgrade.status.value,
            "approval_required": False,
        }

    def dispatch_pending(self) -> None:
        """Dispatch the upgrade task queued by create_and_dispatch.

        Must be called AFTER db.commit() so the task can read the upgrade row.
        """
        from app.tasks.upgrade import run_upgrade

        if not self._pending_dispatch:
            return
        upgrade, scheduled_dt = self._pending_dispatch
        if scheduled_dt:
            run_upgrade.apply_async(args=[str(upgrade.upgrade_id)], eta=scheduled_dt)
        else:
            run_upgrade.delay(str(upgrade.upgrade_id))
        self._pending_dispatch = None

    def cancel_for_instance(
        self,
        instance_id: UUID,
        upgrade_id: UUID,
        *,
        reason: str | None = None,
        cancelled_by: str | None = None,
        cancelled_by_name: str | None = None,
    ) -> AppUpgrade:
        """Cancel an upgrade, verifying it belongs to the given instance."""
        upgrade = self.cancel_upgrade(
            upgrade_id,
            reason=reason,
            cancelled_by=cancelled_by,
            cancelled_by_name=cancelled_by_name,
        )
        if upgrade.instance_id != instance_id:
            raise ValueError("Upgrade does not match instance")
        return upgrade

    def cancel_upgrade(
        self,
        upgrade_id: UUID,
        reason: str | None = None,
        cancelled_by: str | None = None,
        cancelled_by_name: str | None = None,
    ) -> AppUpgrade:
        upgrade = self.db.get(AppUpgrade, upgrade_id)
        if not upgrade:
            raise ValueError("Upgrade not found")
        if upgrade.status in (UpgradeStatus.completed, UpgradeStatus.failed, UpgradeStatus.cancelled):
            return upgrade

        upgrade.status = UpgradeStatus.cancelled
        upgrade.completed_at = datetime.now(UTC)
        upgrade.cancelled_by = cancelled_by
        upgrade.cancelled_by_name = cancelled_by_name
        if reason:
            upgrade.error_message = reason[:2000]
        self.db.flush()
        return upgrade
