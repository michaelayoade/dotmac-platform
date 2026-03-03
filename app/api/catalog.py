"""Catalog API — manage catalog items."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role, require_user_auth

router = APIRouter(prefix="/catalog", tags=["catalog"])


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
    version: str = Body(...),
    git_ref: str = Body(...),
    git_repo_id: UUID = Body(...),
    module_slugs: list[str] | None = Body(None),
    flag_keys: list[str] | None = Body(None),
    notes: str | None = Body(None),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        item = CatalogService(db).create_catalog_item(
            label, version, git_ref, git_repo_id, module_slugs, flag_keys, notes
        )
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


@router.delete("/items/{catalog_id}/purge")
def delete_catalog_item(
    catalog_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).delete_catalog_item(catalog_id)
        db.commit()
        return {"deleted": str(catalog_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
