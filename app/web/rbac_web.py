"""
RBAC — Web routes for roles and permissions management.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.schemas.rbac import PermissionCreate, RoleCreate, RolePermissionCreate
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/rbac")


@router.get("", response_class=HTMLResponse)
def rbac_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.rbac import permissions as permissions_service
    from app.services.rbac import role_permissions as rp_service
    from app.services.rbac import roles as roles_service

    roles = roles_service.list(db, is_active=None, order_by="name", order_dir="asc", limit=200, offset=0)
    permissions = permissions_service.list(db, is_active=None, order_by="key", order_dir="asc", limit=500, offset=0)

    selected_role_id = request.query_params.get("role_id")
    if not selected_role_id and roles:
        selected_role_id = str(roles[0].id)

    role_permissions = []
    if selected_role_id:
        role_permissions = rp_service.list(
            db,
            role_id=selected_role_id,
            permission_id=None,
            order_by="role_id",
            order_dir="asc",
            limit=500,
            offset=0,
        )

    role_map = {r.id: r for r in roles}
    perm_map = {p.id: p for p in permissions}

    selected_role = None
    if selected_role_id:
        try:
            selected_role = role_map.get(UUID(selected_role_id))
        except ValueError:
            selected_role = None
    selected_role_id_uuid = None
    if selected_role_id:
        try:
            selected_role_id_uuid = UUID(selected_role_id)
        except ValueError:
            selected_role_id_uuid = None
    return templates.TemplateResponse(
        "rbac/index.html",
        ctx(
            request,
            auth,
            "RBAC",
            active_page="rbac",
            roles=roles,
            permissions=permissions,
            role_permissions=role_permissions,
            selected_role_id=selected_role_id,
            selected_role_id_uuid=selected_role_id_uuid,
            selected_role=selected_role,
            role_map=role_map,
            perm_map=perm_map,
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

    rp_service.create(db, RolePermissionCreate(role_id=role_id, permission_id=permission_id))
    return RedirectResponse(f"/rbac?role_id={role_id}", status_code=302)


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

    rp_service.delete(db, str(link_id))
    redirect_url = f"/rbac?role_id={role_id}" if role_id else "/rbac"
    return RedirectResponse(redirect_url, status_code=302)
