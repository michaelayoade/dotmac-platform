"""
Dashboard — Main landing page showing instance grid and health summary.
"""

import hashlib
import logging
from datetime import UTC

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse, Response
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx

logger = logging.getLogger(__name__)
templates = Jinja2Templates(directory="templates")
router = APIRouter()


@router.get("/", response_class=HTMLResponse)
def home(request: Request) -> RedirectResponse:
    return RedirectResponse("/dashboard", status_code=302)


@router.get("/dashboard", response_class=HTMLResponse)
def dashboard(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> Response:
    from datetime import datetime

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
    now = datetime.now(UTC)
    instance_data = []
    etag_parts: list[str] = []
    for inst in instances:
        check = health_map.get(inst.instance_id)
        health_state = health_svc.classify_health(check, now)
        instance_data.append(
            {
                "instance": inst,
                "health": check,
                "health_state": health_state,
            }
        )
        etag_parts.append(f"{inst.instance_id}:{inst.status.value}:{health_state}:{check.response_ms if check else ''}")

    # ETag for HTMX polling — skip re-render if nothing changed
    is_htmx = request.headers.get("hx-request") == "true"
    etag = '"' + hashlib.md5("|".join(etag_parts).encode()).hexdigest()[:16] + '"'

    if is_htmx:
        if_none_match = request.headers.get("if-none-match")
        if if_none_match and if_none_match == etag:
            return Response(status_code=304, headers={"ETag": etag})

    response = templates.TemplateResponse(
        "dashboard.html",
        ctx(
            request,
            auth,
            "Dashboard",
            active_page="dashboard",
            stats=stats,
            instances=instance_data,
            servers=servers,
        ),
    )
    response.headers["ETag"] = etag
    return response
