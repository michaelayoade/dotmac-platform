"""
Dashboard — Main landing page showing instance grid and health summary.
"""
from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx

templates = Jinja2Templates(directory="templates")
router = APIRouter()


@router.get("/", response_class=HTMLResponse)
def home(request: Request):
    return RedirectResponse("/dashboard", status_code=302)


@router.get("/dashboard", response_class=HTMLResponse)
def dashboard(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    from app.services.health_service import HealthService
    from app.services.instance_service import InstanceService
    from app.services.server_service import ServerService

    health_svc = HealthService(db)
    instance_svc = InstanceService(db)
    server_svc = ServerService(db)

    stats = health_svc.get_dashboard_stats()
    instances = instance_svc.list_all()
    servers = server_svc.list_all()

    # Batch-fetch latest health checks to avoid N+1
    instance_ids = [inst.instance_id for inst in instances]
    health_map = health_svc.get_latest_checks_batch(instance_ids)
    instance_data = [
        {"instance": inst, "health": health_map.get(inst.instance_id)}
        for inst in instances
    ]

    return templates.TemplateResponse(
        "dashboard.html",
        ctx(
            request, auth, "Dashboard", active_page="dashboard",
            stats=stats,
            instances=instance_data,
            servers=servers,
        ),
    )
