"""
RBAC — Web routes for roles and permissions management.
"""

from __future__ import annotations

import uuid
from urllib.parse import urlencode
from uuid import UUID

from fastapi import APIRouter, Depends, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.schemas.rbac import PermissionCreate, RoleCreate, RolePermissionCreate
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/rbac")


def _build_rbac_redirect_url(role_id: str | None = None) -> str:
    if not role_id:
        return "/rbac"

    try:
        parsed_role_id = uuid.UUID(role_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid role_id") from exc

    return f"/rbac?{urlencode({'role_id': str(parsed_role_id)})}"


@router.get("", response_class=HTMLResponse)
def rbac_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.rbac import get_rbac_index_bundle

    bundle = get_rbac_index_bundle(db, request.query_params.get("role_id"))
    return templates.TemplateResponse(
        "rbac/index.html",
        ctx(
            request,
            auth,
            "RBAC",
            active_page="rbac",
            roles=bundle["roles"],
            permissions=bundle["permissions"],
            role_permissions=bundle["role_permissions"],
            selected_role_id=bundle["selected_role_id"],
            selected_role_id_uuid=bundle["selected_role_id_uuid"],
            selected_role=bundle["selected_role"],
            role_map=bundle["role_map"],
            perm_map=bundle["perm_map"],
        ),
    )


@router.post("/roles", response_class=HTMLResponse)
def rbac_create_role(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    name: str = Form(...),
    description: str = Form(""),
    is_active: bool = Form(True),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.rbac import roles as roles_service

    roles_service.create(
        db, RoleCreate(name=name.strip(), description=description.strip() or None, is_active=is_active)
    )
    return RedirectResponse("/rbac", status_code=302)


@router.post("/roles/{role_id}/deactivate", response_class=HTMLResponse)
def rbac_deactivate_role(
    request: Request,
    role_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.rbac import roles as roles_service

    roles_service.delete(db, str(role_id))
    return RedirectResponse("/rbac", status_code=302)


@router.post("/permissions", response_class=HTMLResponse)
def rbac_create_permission(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    key: str = Form(...),
    description: str = Form(""),
    is_active: bool = Form(True),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.rbac import permissions as permissions_service

    permissions_service.create(
        db,
        PermissionCreate(key=key.strip(), description=description.strip() or None, is_active=is_active),
    )
    return RedirectResponse("/rbac", status_code=302)


@router.post("/permissions/{permission_id}/deactivate", response_class=HTMLResponse)
def rbac_deactivate_permission(
    request: Request,
    permission_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.rbac import permissions as permissions_service

    permissions_service.delete(db, str(permission_id))
    return RedirectResponse("/rbac", status_code=302)


@router.post("/role-permissions", response_class=HTMLResponse)
def rbac_add_role_permission(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    role_id: str = Form(...),
    permission_id: str = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.rbac import role_permissions as rp_service

    try:
        parsed_role_id = uuid.UUID(role_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid role_id") from exc

    rp_service.create(
        db,
        RolePermissionCreate(
            role_id=parsed_role_id,
            permission_id=UUID(permission_id),
        ),
    )
    return RedirectResponse(_build_rbac_redirect_url(str(parsed_role_id)), status_code=302)


@router.post("/role-permissions/{link_id}/delete", response_class=HTMLResponse)
def rbac_remove_role_permission(
    request: Request,
    link_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    role_id: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.rbac import role_permissions as rp_service

    redirect_url = _build_rbac_redirect_url(role_id)
    rp_service.delete(db, str(link_id))
    return RedirectResponse(redirect_url, status_code=302)
