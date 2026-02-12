"""
Maintenance — Web routes for maintenance windows.
"""

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
router = APIRouter(prefix="/maintenance")


@router.get("", response_class=HTMLResponse)
def maintenance_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID | None = None,
    error: str | None = None,
):
    require_admin(auth)
    from app.services.maintenance_service import MaintenanceService

    bundle = MaintenanceService(db).get_index_bundle(instance_id)

    return templates.TemplateResponse(
        "maintenance/list.html",
        ctx(
            request,
            auth,
            "Maintenance",
            active_page="maintenance",
            instances=bundle["instances"],
            instance_id=bundle["instance_id"],
            windows=bundle["windows"],
            error=error,
        ),
    )


@router.post("/set")
def maintenance_set(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID = Form(...),
    day_of_week: int = Form(...),
    start_time: str = Form(...),
    end_time: str = Form(...),
    timezone: str = Form("UTC"),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.maintenance_service import MaintenanceService

    svc = MaintenanceService(db)
    try:
        start, end = svc.parse_times(start_time, end_time)
        svc.set_window(instance_id, day_of_week, start, end, timezone)
        db.commit()
    except ValueError as e:
        db.rollback()
        return maintenance_list(request, auth, db, instance_id, error=str(e))
    return RedirectResponse(f"/maintenance?instance_id={instance_id}", status_code=302)


@router.post("/{window_id}/delete")
def maintenance_delete(
    request: Request,
    window_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.maintenance_service import MaintenanceService

    try:
        MaintenanceService(db).delete_window(instance_id, window_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete maintenance window %s: %s", window_id, e)
    return RedirectResponse(f"/maintenance?instance_id={instance_id}", status_code=302)
