from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse, Response
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.services.instance_service import InstanceService
from app.services.otel_export_service import OtelExportService
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

logger = logging.getLogger(__name__)
templates = Jinja2Templates(directory="templates")
router = APIRouter()


@router.get("/instances/{instance_id}/otel", response_class=HTMLResponse)
def otel_configure_page(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> Response:
    require_admin(auth)
    svc = OtelExportService(db)
    config = svc.get_config(instance_id)

    instance = InstanceService(db).get_by_id(instance_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")

    return templates.TemplateResponse(
        "otel/configure.html",
        ctx(
            request,
            auth,
            "OTel Export",
            active_page="instances",
            instance=instance,
            config=config,
        ),
    )


@router.post("/instances/{instance_id}/otel")
async def otel_configure_submit(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> Response:
    require_admin(auth)
    form = await request.form()
    validate_csrf_token(request, str(form.get("csrf_token", "")))

    endpoint_url = str(form.get("endpoint_url", "")).strip()
    protocol = str(form.get("protocol", "http/protobuf"))
    interval_str = str(form.get("export_interval_seconds", "60"))

    try:
        interval = int(interval_str)
    except ValueError:
        interval = 60

    # Parse header key-value pairs
    headers: dict[str, str] = {}
    header_keys = form.getlist("header_key")
    header_vals = form.getlist("header_value")
    for k, v in zip(header_keys, header_vals, strict=False):
        k_str, v_str = str(k).strip(), str(v).strip()
        if k_str and v_str:
            headers[k_str] = v_str

    svc = OtelExportService(db)
    try:
        svc.configure(
            instance_id=instance_id,
            endpoint_url=endpoint_url,
            protocol=protocol,
            headers=headers or None,
            export_interval_seconds=interval,
        )
        db.commit()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return RedirectResponse(f"/instances/{instance_id}/otel", status_code=303)
