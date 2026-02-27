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

    svc = CatalogService(db)
    releases = svc.list_releases(active_only=active_only)
    return [svc.serialize_release(r) for r in releases]


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


@router.delete("/releases/{release_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_release(
    release_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).deactivate_release(release_id)
        db.commit()
        return None
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

    svc = CatalogService(db)
    bundles = svc.list_bundles(active_only=active_only)
    return [svc.serialize_bundle(b) for b in bundles]


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


@router.delete("/bundles/{bundle_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_bundle(
    bundle_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).deactivate_bundle(bundle_id)
        db.commit()
        return None
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/items")
def list_catalog_items(
    active_only: bool = True,
    search: str | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.catalog_service import CatalogService

    svc = CatalogService(db)
    items = svc.list_catalog_items(active_only=active_only, search=search)
    return [svc.serialize_item(i) for i in items]


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


@router.delete("/items/{catalog_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_catalog_item(
    catalog_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).deactivate_catalog_item(catalog_id)
        db.commit()
        return None
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
