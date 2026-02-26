"""Catalog Service — manage app releases, bundles, and catalog items."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.catalog import AppBundle, AppCatalogItem, AppRelease


class CatalogService:
    def __init__(self, db: Session):
        self.db = db

    # Releases
    def create_release(
        self,
        name: str,
        version: str,
        git_ref: str,
        git_repo_id: UUID,
        notes: str | None = None,
    ) -> AppRelease:
        if not name.strip():
            raise ValueError("Release name is required")
        if not version.strip():
            raise ValueError("Version is required")
        if not git_ref.strip():
            raise ValueError("Git ref is required")
        from app.models.git_repository import GitRepository

        repo = self.db.get(GitRepository, git_repo_id)
        if not repo or not repo.is_active:
            raise ValueError("Git repository not found or inactive")
        release = AppRelease(
            name=name.strip(),
            version=version.strip(),
            git_ref=git_ref.strip(),
            git_repo_id=git_repo_id,
            notes=notes,
        )
        self.db.add(release)
        self.db.flush()
        return release

    def list_releases(self, active_only: bool = True) -> list[AppRelease]:
        stmt = select(AppRelease)
        if active_only:
            stmt = stmt.where(AppRelease.is_active.is_(True))
        stmt = stmt.order_by(AppRelease.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_release(self, release_id: UUID) -> AppRelease | None:
        return self.db.get(AppRelease, release_id)

    def deactivate_release(self, release_id: UUID) -> None:
        release = self.get_release(release_id)
        if not release:
            raise ValueError("Release not found")
        release.is_active = False
        self.db.flush()

    # Bundles
    def create_bundle(
        self,
        name: str,
        description: str | None = None,
        module_slugs: list[str] | None = None,
        flag_keys: list[str] | None = None,
    ) -> AppBundle:
        if not name.strip():
            raise ValueError("Bundle name is required")
        bundle = AppBundle(
            name=name.strip(),
            description=description,
            module_slugs=module_slugs or [],
            flag_keys=flag_keys or [],
        )
        self.db.add(bundle)
        self.db.flush()
        return bundle

    def list_bundles(self, active_only: bool = True) -> list[AppBundle]:
        stmt = select(AppBundle)
        if active_only:
            stmt = stmt.where(AppBundle.is_active.is_(True))
        stmt = stmt.order_by(AppBundle.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_bundle(self, bundle_id: UUID) -> AppBundle | None:
        return self.db.get(AppBundle, bundle_id)

    def deactivate_bundle(self, bundle_id: UUID) -> None:
        bundle = self.get_bundle(bundle_id)
        if not bundle:
            raise ValueError("Bundle not found")
        bundle.is_active = False
        self.db.flush()

    # Catalog items
    def create_catalog_item(self, label: str, release_id: UUID, bundle_id: UUID) -> AppCatalogItem:
        if not label.strip():
            raise ValueError("Catalog label is required")
        release = self.get_release(release_id)
        if not release or not release.is_active:
            raise ValueError("Release not found or inactive")
        bundle = self.get_bundle(bundle_id)
        if not bundle or not bundle.is_active:
            raise ValueError("Bundle not found or inactive")
        item = AppCatalogItem(label=label.strip(), release_id=release_id, bundle_id=bundle_id)
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

    def get_index_bundle(self) -> dict:
        from app.services.git_repo_service import GitRepoService

        releases = self.list_releases(active_only=False)
        bundles = self.list_bundles(active_only=False)
        items = self.list_catalog_items(active_only=False)
        repos = GitRepoService(self.db).list_repos(active_only=True)
        return {"releases": releases, "bundles": bundles, "items": items, "repos": repos}

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

    def serialize_release(self, release: AppRelease) -> dict:
        return {
            "release_id": str(release.release_id),
            "name": release.name,
            "version": release.version,
            "git_ref": release.git_ref,
            "git_repo_id": str(release.git_repo_id),
            "notes": release.notes,
            "is_active": release.is_active,
            "created_at": release.created_at.isoformat() if release.created_at else None,
        }

    def serialize_bundle(self, bundle: AppBundle) -> dict:
        return {
            "bundle_id": str(bundle.bundle_id),
            "name": bundle.name,
            "description": bundle.description,
            "module_slugs": bundle.module_slugs or [],
            "flag_keys": bundle.flag_keys or [],
            "is_active": bundle.is_active,
            "created_at": bundle.created_at.isoformat() if bundle.created_at else None,
        }

    def serialize_item(self, item: AppCatalogItem) -> dict:
        return {
            "catalog_id": str(item.catalog_id),
            "label": item.label,
            "release_id": str(item.release_id),
            "bundle_id": str(item.bundle_id),
            "is_active": item.is_active,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }
