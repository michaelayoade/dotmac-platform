"""
Webhooks — Web routes for webhook endpoints and deliveries.
"""

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.models.webhook import WebhookEndpoint, WebhookEvent
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/webhooks")


@router.get("", response_class=HTMLResponse)
def webhooks_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.instance_service import InstanceService
    from app.services.webhook_service import WebhookService

    svc = WebhookService(db)
    endpoints = svc.list_endpoints()
    instances = InstanceService(db).list_all()
    inst_map = {i.instance_id: i for i in instances}

    return templates.TemplateResponse(
        "webhooks/index.html",
        ctx(
            request,
            auth,
            "Webhooks",
            active_page="webhooks",
            endpoints=endpoints,
            instances=instances,
            inst_map=inst_map,
            events=[e.value for e in WebhookEvent],
        ),
    )


@router.post("")
def webhooks_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    url: str = Form(""),
    description: str | None = Form(None),
    secret: str | None = Form(None),
    instance_id: str | None = Form(None),
    events: list[str] = Form([]),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.webhook_service import WebhookService

    try:
        svc = WebhookService(db)
        instance_uuid = UUID(instance_id) if instance_id else None
        svc.create_endpoint(url, events, secret or None, description or None, instance_uuid)
        db.commit()
    except (ValueError, Exception) as e:
        db.rollback()
        logger.exception("Failed to create webhook: %s", e)
    return RedirectResponse("/webhooks", status_code=302)


@router.post("/{endpoint_id}/delete")
def webhooks_delete(
    request: Request,
    endpoint_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.webhook_service import WebhookService

    svc = WebhookService(db)
    svc.delete_endpoint(endpoint_id)
    db.commit()
    return RedirectResponse("/webhooks", status_code=302)


@router.get("/{endpoint_id}/deliveries", response_class=HTMLResponse)
def webhooks_deliveries(
    request: Request,
    endpoint_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.webhook_service import WebhookService

    endpoint = db.get(WebhookEndpoint, endpoint_id)
    if not endpoint:
        return RedirectResponse("/webhooks", status_code=302)

    svc = WebhookService(db)
    deliveries = svc.get_deliveries(endpoint_id)

    return templates.TemplateResponse(
        "webhooks/deliveries.html",
        ctx(
            request,
            auth,
            "Webhook Deliveries",
            active_page="webhooks",
            endpoint=endpoint,
            deliveries=deliveries,
        ),
    )
