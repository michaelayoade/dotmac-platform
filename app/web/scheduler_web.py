"""
Scheduler — Web routes for scheduled tasks.
"""
import json
from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.schemas.scheduler import ScheduledTaskCreate, ScheduledTaskUpdate
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/scheduler")


@router.get("", response_class=HTMLResponse)
def scheduler_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    error: str | None = None,
):
    require_admin(auth)
    from app.services.scheduler import scheduled_tasks

    tasks = scheduled_tasks.list(db, enabled=None, order_by="created_at", order_dir="desc", limit=200, offset=0)
    return templates.TemplateResponse(
        "scheduler/list.html",
        ctx(request, auth, "Scheduler", active_page="scheduler", tasks=tasks, error=error),
    )


@router.post("/new")
def scheduler_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    name: str = Form(...),
    task_name: str = Form(...),
    interval_seconds: int = Form(3600),
    args_json: str = Form("[]"),
    kwargs_json: str = Form("{}"),
    enabled: bool = Form(False),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.scheduler import scheduled_tasks

    try:
        args = json.loads(args_json) if args_json.strip() else None
        kwargs = json.loads(kwargs_json) if kwargs_json.strip() else None
    except json.JSONDecodeError:
        return scheduler_list(request, auth, db, error="Invalid JSON for args/kwargs")

    payload = ScheduledTaskCreate(
        name=name.strip(),
        task_name=task_name.strip(),
        interval_seconds=interval_seconds,
        args_json=args,
        kwargs_json=kwargs,
        enabled=enabled,
    )
    scheduled_tasks.create(db, payload)
    return RedirectResponse("/scheduler", status_code=302)


@router.post("/{task_id}/toggle")
def scheduler_toggle(
    request: Request,
    task_id: str,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    enabled: str = Form("false"),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.scheduler import scheduled_tasks

    enabled_bool = enabled.lower() in ("true", "1", "on")
    scheduled_tasks.update(db, task_id, ScheduledTaskUpdate(enabled=enabled_bool))
    return RedirectResponse("/scheduler", status_code=302)


@router.post("/{task_id}/delete")
def scheduler_delete(
    request: Request,
    task_id: str,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.scheduler import scheduled_tasks

    scheduled_tasks.delete(db, task_id)
    return RedirectResponse("/scheduler", status_code=302)
