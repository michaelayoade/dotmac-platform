"""
Organizations — Web routes for managing organizations.
"""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/organizations")


@router.get("", response_class=HTMLResponse)
def org_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> HTMLResponse:
    require_admin(auth)
    from app.services.organization_service import OrganizationService

    svc = OrganizationService(db)
    params = request.query_params
    q = (params.get("q") or "").strip()
    is_active_param = (params.get("is_active") or "").strip()
    is_active: bool | None = None
    if is_active_param == "true":
        is_active = True
    elif is_active_param == "false":
        is_active = False

    try:
        page = max(int(params.get("page") or 1), 1)
    except ValueError:
        page = 1
    try:
        page_size = min(max(int(params.get("page_size") or 25), 10), 100)
    except ValueError:
        page_size = 25

    orgs, total = svc.list_for_web(q=q, is_active=is_active, page=page, page_size=page_size)
    org_ids = [o.org_id for o in orgs]
    instance_counts = svc.instance_counts_batch(org_ids)
    member_counts = svc.member_counts_batch(org_ids)

    return templates.TemplateResponse(
        "organizations/list.html",
        ctx(
            request,
            auth,
            "Organizations",
            active_page="organizations",
            orgs=orgs,
            total=total,
            instance_counts=instance_counts,
            member_counts=member_counts,
            q=q,
            is_active=is_active_param,
            page=page,
            page_size=page_size,
        ),
    )


@router.post("/new", response_class=HTMLResponse)
def org_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    org_code: str = Form(...),
    org_name: str = Form(...),
    contact_email: str = Form(""),
    contact_phone: str = Form(""),
    notes: str = Form(""),
    csrf_token: str = Form(""),
) -> RedirectResponse:
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.organization_service import OrganizationService

    OrganizationService(db).create(
        org_code=org_code.strip(),
        org_name=org_name.strip(),
        contact_email=contact_email.strip() or None,
        contact_phone=contact_phone.strip() or None,
        notes=notes.strip() or None,
    )
    db.commit()
    return RedirectResponse("/organizations", status_code=302)


@router.get("/{org_id}", response_class=HTMLResponse)
def org_detail(
    request: Request,
    org_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> HTMLResponse:
    require_admin(auth)
    from app.services.organization_service import OrganizationService
    from app.services.person import people as people_service

    svc = OrganizationService(db)
    org = svc.get_by_id(org_id)
    if not org:
        raise ValueError("Organization not found")
    instances = svc.get_instances(org_id)
    members = svc.list_members(org_id)

    # Get all people for the add-member dropdown
    all_people, _, _ = people_service.list_for_web(db, q="", status=None, is_active=None, page=1, page_size=500)
    current_member_ids = {m.person_id for m in members if m.is_active}

    return templates.TemplateResponse(
        "organizations/detail.html",
        ctx(
            request,
            auth,
            org.org_name,
            active_page="organizations",
            org=org,
            instances=instances,
            members=members,
            all_people=all_people,
            current_member_ids=current_member_ids,
        ),
    )


@router.post("/{org_id}/update", response_class=HTMLResponse)
def org_update(
    request: Request,
    org_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    org_name: str = Form(...),
    contact_email: str = Form(""),
    contact_phone: str = Form(""),
    notes: str = Form(""),
    is_active: bool = Form(False),
    csrf_token: str = Form(""),
) -> RedirectResponse:
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.schemas.organization import OrganizationUpdate
    from app.services.organization_service import OrganizationService

    payload = OrganizationUpdate(
        org_name=org_name.strip(),
        contact_email=contact_email.strip() or None,
        contact_phone=contact_phone.strip() or None,
        notes=notes.strip() or None,
        is_active=is_active,
    )
    OrganizationService(db).update(org_id, payload)
    db.commit()
    return RedirectResponse(f"/organizations/{org_id}", status_code=302)


@router.post("/{org_id}/members", response_class=HTMLResponse)
def org_add_member(
    request: Request,
    org_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    person_id: str = Form(...),
    csrf_token: str = Form(""),
) -> RedirectResponse:
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.organization_service import OrganizationService

    OrganizationService(db).add_member(org_id, UUID(person_id))
    db.commit()
    return RedirectResponse(f"/organizations/{org_id}", status_code=302)


@router.post("/{org_id}/members/{person_id}/remove", response_class=HTMLResponse)
def org_remove_member(
    request: Request,
    org_id: UUID,
    person_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
) -> RedirectResponse:
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.organization_service import OrganizationService

    OrganizationService(db).remove_member(org_id, person_id)
    db.commit()
    return RedirectResponse(f"/organizations/{org_id}", status_code=302)
