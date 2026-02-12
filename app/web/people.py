"""
People — Web routes for managing users.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.schemas.person import PersonCreate, PersonUpdate
from app.schemas.rbac import PersonRoleCreate
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/people")


@router.get("", response_class=HTMLResponse)
def people_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.person import people as people_service

    params = request.query_params
    q = (params.get("q") or "").strip()
    status = (params.get("status") or "").strip() or None
    is_active = params.get("is_active")
    is_active_val = None
    if is_active in {"true", "false"}:
        is_active_val = is_active == "true"

    try:
        page = max(int(params.get("page") or 1), 1)
    except ValueError:
        page = 1
    try:
        page_size = min(max(int(params.get("page_size") or 25), 10), 100)
    except ValueError:
        page_size = 25

    items, total, roles_map = people_service.list_for_web(
        db,
        q=q,
        status=status,
        is_active=is_active_val,
        page=page,
        page_size=page_size,
        org_id=auth.org_id,
    )

    return templates.TemplateResponse(
        "people/list.html",
        ctx(
            request,
            auth,
            "People",
            active_page="people",
            people=items,
            roles_map=roles_map,
            q=q,
            status=status or "",
            is_active=is_active or "",
            page=page,
            page_size=page_size,
            total=total,
        ),
    )


@router.post("/new", response_class=HTMLResponse)
def people_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    status: str = Form("active"),
    is_active: bool = Form(False),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.person import people as people_service

    payload = PersonCreate(
        first_name=first_name.strip(),
        last_name=last_name.strip(),
        email=email.strip(),
        status=status,
        is_active=is_active,
        gender="unknown",
        org_id=auth.org_id,
    )
    people_service.create(db, payload)
    return RedirectResponse("/people", status_code=302)


@router.get("/{person_id}", response_class=HTMLResponse)
def people_detail(
    request: Request,
    person_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.person import people as people_service
    from app.services.rbac import person_roles as person_roles_service
    from app.services.rbac import roles as role_service

    person = people_service.get(db, str(person_id), org_id=auth.org_id)
    roles = role_service.list(db, is_active=None, order_by="name", order_dir="asc", limit=200, offset=0)
    assigned = person_roles_service.list(
        db, person_id=str(person_id), role_id=None, order_by="assigned_at", order_dir="desc", limit=200, offset=0
    )
    assigned_role_ids = {a.role_id for a in assigned}
    roles_map = {role.id: role for role in roles}

    return templates.TemplateResponse(
        "people/detail.html",
        ctx(
            request,
            auth,
            "Person",
            active_page="people",
            person=person,
            roles=roles,
            assigned=assigned,
            roles_map=roles_map,
            assigned_role_ids=assigned_role_ids,
        ),
    )


@router.post("/{person_id}/update", response_class=HTMLResponse)
def people_update(
    request: Request,
    person_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    display_name: str = Form(""),
    status: str = Form("active"),
    is_active: bool = Form(False),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.person import people as people_service

    payload = PersonUpdate(
        display_name=display_name.strip() or None,
        status=status,
        is_active=is_active,
    )
    people_service.update(db, str(person_id), payload, org_id=auth.org_id)
    return RedirectResponse(f"/people/{person_id}", status_code=302)


@router.post("/{person_id}/roles", response_class=HTMLResponse)
def people_assign_role(
    request: Request,
    person_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    role_id: str = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.rbac import person_roles as person_roles_service

    payload = PersonRoleCreate(person_id=person_id, role_id=UUID(role_id))
    person_roles_service.create(db, payload)
    return RedirectResponse(f"/people/{person_id}", status_code=302)


@router.post("/{person_id}/roles/{link_id}/delete", response_class=HTMLResponse)
def people_remove_role(
    request: Request,
    person_id: UUID,
    link_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.rbac import person_roles as person_roles_service

    person_roles_service.delete(db, str(link_id))
    return RedirectResponse(f"/people/{person_id}", status_code=302)
