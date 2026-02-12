"""
Observability Logs — Web routes for per-instance log viewer.
"""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/observability")


@router.get("/instances/{instance_id}/logs", response_class=HTMLResponse)
def instance_logs_page(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    stream: str = Query("app"),
    lines: int = Query(200, ge=1, le=2000),
    since: str | None = Query("1h"),
):
    require_admin(auth)
    from app.services.instance_service import InstanceService
    from app.services.metrics_export import MetricsExportService

    try:
        instance = InstanceService(db).get_or_404(instance_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    streams = []
    try:
        streams = MetricsExportService(db).get_log_streams(instance_id)
    except Exception:
        logger.debug("Failed to list log streams for %s", instance.org_code, exc_info=True)

    return templates.TemplateResponse(
        "logs/instance_logs.html",
        ctx(
            request,
            auth,
            "Instance Logs",
            active_page="instances",
            instance=instance,
            streams=streams,
            stream=stream,
            lines=lines,
            since=since,
        ),
    )


@router.get("/instances/{instance_id}/logs/stream", response_class=HTMLResponse)
def instance_logs_stream(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    stream: str = Query("app"),
    lines: int = Query(200, ge=1, le=2000),
    since: str | None = Query(None),
):
    require_admin(auth)
    from app.services.metrics_export import MetricsExportService

    logs: list[str] = []
    error: str | None = None
    try:
        payload = MetricsExportService(db).get_logs_payload(
            instance_id,
            stream=stream,
            lines=lines,
            since=since,
        )
        logs = payload["entries"]
    except ValueError as e:
        error = str(e)
    except Exception:
        logger.exception("Failed to fetch logs for instance %s", instance_id)
        error = "Failed to fetch logs"

    return templates.TemplateResponse(
        "logs/_log_lines.html",
        {
            "request": request,
            "logs": logs,
            "error": error,
        },
    )
