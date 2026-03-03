"""Catalog Service — manage catalog items (deployable app configurations)."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.catalog import AppCatalogItem


class CatalogService:
    def __init__(self, db: Session) -> None:
        self.db = db

    # ── Catalog items ──

    def create_catalog_item(
        self,
        label: str,
        version: str,
        git_ref: str,
        git_repo_id: UUID,
        module_slugs: list[str] | None = None,
        flag_keys: list[str] | None = None,
        notes: str | None = None,
    ) -> AppCatalogItem:
        if not label.strip():
            raise ValueError("Catalog label is required")
        if not version.strip():
            raise ValueError("Version is required")
        if not git_ref.strip():
            raise ValueError("Git ref is required")

        from app.models.git_repository import GitRepository

        repo = self.db.get(GitRepository, git_repo_id)
        if not repo or not repo.is_active:
            raise ValueError("Git repository not found or inactive")

        item = AppCatalogItem(
            label=label.strip(),
            version=version.strip(),
            git_ref=git_ref.strip(),
            git_repo_id=git_repo_id,
            module_slugs=module_slugs or [],
            flag_keys=flag_keys or [],
            notes=notes,
        )
        self.db.add(item)
        self.db.flush()
        return item

    def list_catalog_items(self, active_only: bool = True, search: str | None = None) -> list[AppCatalogItem]:
        stmt = select(AppCatalogItem)
        if search and search.strip():
            q = f"%{search.strip()}%"
            stmt = stmt.join(AppCatalogItem.bundle).where(or_(AppBundle.name.ilike(q), AppBundle.description.ilike(q)))
        if active_only:
            stmt = stmt.where(AppCatalogItem.is_active.is_(True))
        stmt = stmt.order_by(AppCatalogItem.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_index_bundle(self) -> dict[str, object]:
        from app.services.git_repo_service import GitRepoService

        repo_svc = GitRepoService(self.db)
        items = self.list_catalog_items(active_only=False)
        repos = repo_svc.list_for_web(active_only=False)
        active_repos = [r for r in repos if r.is_active]
        return {"items": items, "repos": repos, "active_repos": active_repos}

    @staticmethod
    def split_csv(value: str | None) -> list[str]:
        if not value:
            return []
        return [v.strip() for v in value.split(",") if v.strip()]

    def get_catalog_item(self, catalog_id: UUID) -> AppCatalogItem | None:
        return self.db.get(AppCatalogItem, catalog_id)

    def deactivate_catalog_item(self, catalog_id: UUID) -> None:
        item = self.db.get(AppCatalogItem, catalog_id)
        if not item:
            raise ValueError("Catalog item not found")
        item.is_active = False
        self.db.flush()

    def delete_catalog_item(self, catalog_id: UUID) -> None:
        from app.models.app_upgrade import AppUpgrade
        from app.models.instance import Instance
        from app.models.signup_request import SignupRequest

        item = self.db.get(AppCatalogItem, catalog_id)
        if not item:
            raise ValueError("Catalog item not found")
        if item.is_active:
            raise ValueError("Catalog item must be inactive before deletion")

        has_instances = self.db.scalar(
            select(Instance.instance_id).where(Instance.catalog_item_id == catalog_id).limit(1)
        )
        if has_instances:
            raise ValueError("Catalog item is still referenced by instances")
        has_signups = self.db.scalar(
            select(SignupRequest.signup_id).where(SignupRequest.catalog_item_id == catalog_id).limit(1)
        )
        if has_signups:
            raise ValueError("Catalog item is still referenced by signup requests")
        has_upgrades = self.db.scalar(
            select(AppUpgrade.upgrade_id).where(AppUpgrade.catalog_item_id == catalog_id).limit(1)
        )
        if has_upgrades:
            raise ValueError("Catalog item is still referenced by upgrades")

        self.db.delete(item)
        self.db.flush()

    def serialize_item(self, item: AppCatalogItem) -> dict[str, object]:
        return {
            "catalog_id": str(item.catalog_id),
            "label": item.label,
            "version": item.version,
            "git_ref": item.git_ref,
            "git_repo_id": str(item.git_repo_id),
            "notes": item.notes,
            "module_slugs": item.module_slugs or [],
            "flag_keys": item.flag_keys or [],
            "is_active": item.is_active,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }
