"""
Drift — Web routes for configuration drift reports.
"""

from urllib.parse import urlencode
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/drift")


def _redirect_with(instance_id: UUID | None, message: str | None = None, error: str | None = None):
    params = {}
    if instance_id:
        params["instance_id"] = str(instance_id)
    if message:
        params["message"] = message
    if error:
        params["error"] = error
    if params:
        return RedirectResponse(f"/drift?{urlencode(params)}", status_code=302)
    return RedirectResponse("/drift", status_code=302)


@router.get("", response_class=HTMLResponse)
def drift_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID | None = None,
    message: str | None = None,
    error: str | None = None,
):
    require_admin(auth)
    from app.services.drift_service import DriftService

    svc = DriftService(db)
    bundle = svc.get_index_bundle(instance_id)

    return templates.TemplateResponse(
        "drift/index.html",
        ctx(
            request,
            auth,
            "Config Drift",
            active_page="drift",
            instances=bundle["instances"],
            instance_id=bundle["instance_id"],
            reports=bundle["reports"],
            latest=bundle["latest"],
            message=message,
            error=error,
        ),
    )


@router.post("/{instance_id}/detect")
def drift_detect(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.drift_service import DriftService

    ok, message_or_error = DriftService(db).detect_for_web(instance_id)
    if ok:
        return _redirect_with(instance_id, message=message_or_error)
    return _redirect_with(instance_id, error=message_or_error)
