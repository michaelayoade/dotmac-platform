"""Catalog API — manage releases, bundles, and catalog items."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role, require_user_auth

router = APIRouter(prefix="/catalog", tags=["catalog"])


@router.get("/releases")
def list_releases(
    active_only: bool = True,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.catalog_service import CatalogService

    releases = CatalogService(db).list_releases(active_only=active_only)
    return [
        {
            "release_id": str(r.release_id),
            "name": r.name,
            "version": r.version,
            "git_ref": r.git_ref,
            "git_repo_id": str(r.git_repo_id),
            "notes": r.notes,
            "is_active": r.is_active,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in releases
    ]


@router.post("/releases", status_code=status.HTTP_201_CREATED)
def create_release(
    name: str = Body(...),
    version: str = Body(...),
    git_ref: str = Body(...),
    git_repo_id: UUID = Body(...),
    notes: str | None = Body(None),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        release = CatalogService(db).create_release(name, version, git_ref, git_repo_id, notes)
        db.commit()
        return {"release_id": str(release.release_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/releases/{release_id}")
def deactivate_release(
    release_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).deactivate_release(release_id)
        db.commit()
        return {"deactivated": str(release_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/bundles")
def list_bundles(
    active_only: bool = True,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.catalog_service import CatalogService

    bundles = CatalogService(db).list_bundles(active_only=active_only)
    return [
        {
            "bundle_id": str(b.bundle_id),
            "name": b.name,
            "description": b.description,
            "module_slugs": b.module_slugs or [],
            "flag_keys": b.flag_keys or [],
            "is_active": b.is_active,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        }
        for b in bundles
    ]


@router.post("/bundles", status_code=status.HTTP_201_CREATED)
def create_bundle(
    name: str = Body(...),
    description: str | None = Body(None),
    module_slugs: list[str] | None = Body(None),
    flag_keys: list[str] | None = Body(None),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        bundle = CatalogService(db).create_bundle(name, description, module_slugs, flag_keys)
        db.commit()
        return {"bundle_id": str(bundle.bundle_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/bundles/{bundle_id}")
def deactivate_bundle(
    bundle_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).deactivate_bundle(bundle_id)
        db.commit()
        return {"deactivated": str(bundle_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/items")
def list_catalog_items(
    active_only: bool = True,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.catalog_service import CatalogService

    items = CatalogService(db).list_catalog_items(active_only=active_only)
    return [
        {
            "catalog_id": str(i.catalog_id),
            "label": i.label,
            "release_id": str(i.release_id),
            "bundle_id": str(i.bundle_id),
            "is_active": i.is_active,
            "created_at": i.created_at.isoformat() if i.created_at else None,
        }
        for i in items
    ]


@router.post("/items", status_code=status.HTTP_201_CREATED)
def create_catalog_item(
    label: str = Body(...),
    release_id: UUID = Body(...),
    bundle_id: UUID = Body(...),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        item = CatalogService(db).create_catalog_item(label, release_id, bundle_id)
        db.commit()
        return {"catalog_id": str(item.catalog_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/items/{catalog_id}")
def deactivate_catalog_item(
    catalog_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).deactivate_catalog_item(catalog_id)
        db.commit()
        return {"deactivated": str(catalog_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
