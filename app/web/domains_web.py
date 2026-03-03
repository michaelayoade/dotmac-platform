"""
Domains — Web routes for domain management.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/domains")


def _redirect_with(instance_id: UUID | None, message: str | None = None, error: str | None = None):
    """Redirect to the instance detail domains tab after a domain mutation."""
    if instance_id:
        return RedirectResponse(f"/instances/{instance_id}?tab=domains", status_code=302)
    return RedirectResponse("/instances", status_code=302)


@router.get("", response_class=HTMLResponse)
def domains_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID | None = None,
):
    """Redirect to instance detail domains tab (standalone page removed)."""
    if instance_id:
        return RedirectResponse(f"/instances/{instance_id}?tab=domains", status_code=302)
    return RedirectResponse("/instances", status_code=302)


@router.post("/add")
def domains_add(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID = Form(...),
    domain: str = Form(""),
    is_primary: str = Form("off"),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        svc.add_domain(instance_id, domain, is_primary == "on")
        db.commit()
        return _redirect_with(instance_id, message="Domain added. Add the TXT record to verify.")
    except ValueError as e:
        db.rollback()
        return _redirect_with(instance_id, error=str(e))


@router.post("/{domain_id}/verify")
def domains_verify(
    request: Request,
    domain_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        result = svc.verify_domain(instance_id, domain_id)
        db.commit()
        if result.get("verified"):
            return _redirect_with(instance_id, message="Domain verified.")
        return _redirect_with(instance_id, error=result.get("message", "Verification failed"))
    except ValueError as e:
        db.rollback()
        return _redirect_with(instance_id, error=str(e))


@router.post("/{domain_id}/provision-ssl")
def domains_provision_ssl(
    request: Request,
    domain_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        result = svc.provision_ssl(instance_id, domain_id)
        db.commit()
        if result.get("success"):
            return _redirect_with(instance_id, message="Domain activated — Caddy will provision SSL automatically.")
        return _redirect_with(instance_id, error=result.get("error", "Domain activation failed"))
    except ValueError as e:
        db.rollback()
        return _redirect_with(instance_id, error=str(e))


@router.post("/{domain_id}/activate")
def domains_activate(
    request: Request,
    domain_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        svc.activate_domain(instance_id, domain_id)
        db.commit()
        return _redirect_with(instance_id, message="Domain activated.")
    except ValueError as e:
        db.rollback()
        return _redirect_with(instance_id, error=str(e))


@router.post("/{domain_id}/primary")
def domains_primary(
    request: Request,
    domain_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        svc.set_primary(instance_id, domain_id)
        db.commit()
        return _redirect_with(instance_id, message="Primary domain updated.")
    except ValueError as e:
        db.rollback()
        return _redirect_with(instance_id, error=str(e))


@router.post("/{domain_id}/delete")
def domains_delete(
    request: Request,
    domain_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        svc.remove_domain(instance_id, domain_id)
        db.commit()
        return _redirect_with(instance_id, message="Domain removed.")
    except ValueError as e:
        db.rollback()
        return _redirect_with(instance_id, error=str(e))
