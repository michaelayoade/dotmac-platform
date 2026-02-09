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
    def __init__(self, db: Session):
        self.db = db

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
