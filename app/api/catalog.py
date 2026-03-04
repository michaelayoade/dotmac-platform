"""Catalog API — manage catalog items."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role, require_user_auth
from app.schemas.catalog import CatalogItemRead
from app.schemas.common import ListResponse

router = APIRouter(prefix="/catalog", tags=["catalog"])


@router.get("/items", response_model=ListResponse[CatalogItemRead])
def list_catalog_items(
    active_only: bool = True,
    search: str | None = None,
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.catalog_service import CatalogService

    svc = CatalogService(db)
    items = svc.list_catalog_items(active_only=active_only, search=search)
    page = items[offset : offset + limit]
    return {"items": [svc.serialize_item(i) for i in page], "count": len(items), "limit": limit, "offset": offset}


class CatalogCreateResponse(CatalogItemRead):
    """Response for catalog item creation — inherits all read fields."""


@router.post("/items", status_code=status.HTTP_201_CREATED, response_model=CatalogCreateResponse)
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
        svc = CatalogService(db)
        item = svc.create_catalog_item(label, version, git_ref, git_repo_id, module_slugs, flag_keys, notes)
        db.commit()
        return svc.serialize_item(item)
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/items/{catalog_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
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


@router.delete("/items/{catalog_id}/purge", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def delete_catalog_item(
    catalog_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).delete_catalog_item(catalog_id)
        db.commit()
        return None
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
