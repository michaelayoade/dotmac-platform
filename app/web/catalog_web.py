"""Catalog — Web routes for registries and catalog items."""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/catalog")


@router.get("", response_class=HTMLResponse)
def catalog_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.catalog_service import CatalogService

    bundle = CatalogService(db).get_index_bundle()
    return templates.TemplateResponse(
        "catalog/index.html",
        ctx(
            request,
            auth,
            "Catalog",
            active_page="catalog",
            items=bundle["items"],
            repos=bundle["repos"],
            active_repos=bundle["active_repos"],
        ),
    )


@router.post("/items/create")
def catalog_create_item(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    label: str = Form(...),
    version: str = Form(...),
    git_ref: str = Form(...),
    git_repo_id: UUID = Form(...),
    module_slugs: str | None = Form(None),
    flag_keys: str | None = Form(None),
    notes: str | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).create_catalog_item(
            label,
            version,
            git_ref,
            git_repo_id,
            module_slugs=CatalogService.split_csv(module_slugs),
            flag_keys=CatalogService.split_csv(flag_keys),
            notes=notes,
        )
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create catalog item: %s", e)
    return RedirectResponse("/catalog", status_code=302)


@router.post("/items/{catalog_id}/deactivate")
def catalog_deactivate_item(
    request: Request,
    catalog_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).deactivate_catalog_item(catalog_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to deactivate catalog item: %s", e)
    return RedirectResponse("/catalog", status_code=302)


@router.post("/items/{catalog_id}/delete")
def catalog_delete_item(
    request: Request,
    catalog_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).delete_catalog_item(catalog_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete catalog item: %s", e)
    return RedirectResponse("/catalog", status_code=302)
