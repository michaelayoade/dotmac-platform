"""
Audit — Web routes for viewing audit events.
"""
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.services import audit as audit_service
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/audit")


@router.get("", response_class=HTMLResponse)
def audit_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    actor_id: str | None = None,
    actor_type: str | None = None,
    action: str | None = None,
    entity_type: str | None = None,
    request_id: str | None = None,
    is_success: str | None = None,
    status_code: int | None = None,
    order_by: str = Query(default="occurred_at"),
    order_dir: str = Query(default="desc"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=10, le=200),
):
    require_admin(auth)
    resolved_actor_type = audit_service.audit_events.parse_actor_type(actor_type)

    # Normalize booleans
    is_success_val = None
    if is_success in {"true", "false"}:
        is_success_val = is_success == "true"

    events = audit_service.audit_events.list(
        db,
        actor_id=actor_id,
        actor_type=resolved_actor_type,
        action=action,
        entity_type=entity_type,
        request_id=request_id,
        is_success=is_success_val,
        status_code=status_code,
        is_active=True,
        order_by=order_by,
        order_dir=order_dir,
        limit=page_size,
        offset=(page - 1) * page_size,
    )

    return templates.TemplateResponse(
        "audit/list.html",
        ctx(
            request,
            auth,
            "Audit Logs",
            active_page="audit",
            events=events,
            actor_id=actor_id or "",
            actor_type=actor_type or "",
            action=action or "",
            entity_type=entity_type or "",
            request_id=request_id or "",
            is_success=is_success or "",
            status_code=status_code or "",
            order_by=order_by,
            order_dir=order_dir,
            page=page,
            page_size=page_size,
        ),
    )


@router.get("/{event_id}", response_class=HTMLResponse)
def audit_detail(
    request: Request,
    event_id: str,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    try:
        event = audit_service.audit_events.get(db, event_id)
    except HTTPException:
        return RedirectResponse("/audit", status_code=302)
    return templates.TemplateResponse(
        "audit/detail.html",
        ctx(
            request,
            auth,
            "Audit Event",
            active_page="audit",
            event=event,
        ),
    )
