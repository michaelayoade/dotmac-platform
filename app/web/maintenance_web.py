"""
Maintenance — Web routes for maintenance windows.
"""
import logging
from datetime import time
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
    from app.services.instance_service import InstanceService
    from app.services.maintenance_service import MaintenanceService

    instances = InstanceService(db).list_all()
    if not instance_id and instances:
        instance_id = instances[0].instance_id
    windows = []
    if instance_id:
        windows = MaintenanceService(db).get_windows(instance_id)

    return templates.TemplateResponse(
        "maintenance/list.html",
        ctx(
            request,
            auth,
            "Maintenance",
            active_page="maintenance",
            instances=instances,
            instance_id=instance_id,
            windows=windows,
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

    try:
        start = time.fromisoformat(start_time)
        end = time.fromisoformat(end_time)
    except ValueError:
        return maintenance_list(request, auth, db, instance_id, error="Invalid time format")

    svc = MaintenanceService(db)
    try:
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
