"""Catalog — Web routes for releases, bundles, and catalog items."""

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

    svc = CatalogService(db)
    releases = svc.list_releases(active_only=False)
    bundles = svc.list_bundles(active_only=False)
    items = svc.list_catalog_items(active_only=False)
    from app.services.git_repo_service import GitRepoService

    repos = GitRepoService(db).list_repos(active_only=True)
    return templates.TemplateResponse(
        "catalog/index.html",
        ctx(
            request,
            auth,
            "Catalog",
            active_page="catalog",
            releases=releases,
            bundles=bundles,
            items=items,
            repos=repos,
        ),
    )


@router.post("/releases/create")
def catalog_create_release(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    name: str = Form(...),
    version: str = Form(...),
    git_ref: str = Form(...),
    git_repo_id: UUID = Form(...),
    notes: str | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).create_release(name, version, git_ref, git_repo_id, notes)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create release: %s", e)
    return RedirectResponse("/catalog", status_code=302)


@router.post("/bundles/create")
def catalog_create_bundle(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    name: str = Form(...),
    description: str | None = Form(None),
    module_slugs: str | None = Form(None),
    flag_keys: str | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.catalog_service import CatalogService

    def _split(value: str | None) -> list[str]:
        if not value:
            return []
        return [v.strip() for v in value.split(",") if v.strip()]

    try:
        CatalogService(db).create_bundle(
            name,
            description,
            module_slugs=_split(module_slugs),
            flag_keys=_split(flag_keys),
        )
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create bundle: %s", e)
    return RedirectResponse("/catalog", status_code=302)


@router.post("/items/create")
def catalog_create_item(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    label: str = Form(...),
    release_id: UUID = Form(...),
    bundle_id: UUID = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).create_catalog_item(label, release_id, bundle_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create catalog item: %s", e)
    return RedirectResponse("/catalog", status_code=302)


@router.post("/releases/{release_id}/deactivate")
def catalog_deactivate_release(
    request: Request,
    release_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).deactivate_release(release_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to deactivate release: %s", e)
    return RedirectResponse("/catalog", status_code=302)


@router.post("/bundles/{bundle_id}/deactivate")
def catalog_deactivate_bundle(
    request: Request,
    bundle_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.catalog_service import CatalogService

    try:
        CatalogService(db).deactivate_bundle(bundle_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to deactivate bundle: %s", e)
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
