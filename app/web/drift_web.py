"""
Drift — Web routes for configuration drift reports.
"""
from uuid import UUID
from urllib.parse import urlencode

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
    from app.services.instance_service import InstanceService

    instances = InstanceService(db).list_all()
    if not instance_id and instances:
        instance_id = instances[0].instance_id

    reports = []
    latest = None
    if instance_id:
        svc = DriftService(db)
        reports = svc.get_reports(instance_id, limit=20)
        latest = reports[0] if reports else None

    return templates.TemplateResponse(
        "drift/index.html",
        ctx(
            request,
            auth,
            "Config Drift",
            active_page="drift",
            instances=instances,
            instance_id=instance_id,
            reports=reports,
            latest=latest,
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

    svc = DriftService(db)
    try:
        report = svc.detect_drift(instance_id)
        db.commit()
        if report.has_drift:
            return _redirect_with(instance_id, message="Drift detected. Review details below.")
        return _redirect_with(instance_id, message="No drift detected.")
    except ValueError as e:
        db.rollback()
        return _redirect_with(instance_id, error=str(e))
    except Exception:
        db.rollback()
        return _redirect_with(instance_id, error="Drift detection failed.")
