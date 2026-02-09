"""Catalog Service — manage app releases, bundles, and catalog items."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
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

    def list_catalog_items(self, active_only: bool = True) -> list[AppCatalogItem]:
        stmt = select(AppCatalogItem)
        if active_only:
            stmt = stmt.where(AppCatalogItem.is_active.is_(True))
        stmt = stmt.order_by(AppCatalogItem.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_catalog_item(self, catalog_id: UUID) -> AppCatalogItem | None:
        return self.db.get(AppCatalogItem, catalog_id)

    def deactivate_catalog_item(self, catalog_id: UUID) -> None:
        item = self.db.get(AppCatalogItem, catalog_id)
        if not item:
            raise ValueError("Catalog item not found")
        item.is_active = False
        self.db.flush()
