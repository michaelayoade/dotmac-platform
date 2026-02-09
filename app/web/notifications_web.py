"""Notifications — web routes for in-app notification bell (HTMX fragments)."""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.services.common import coerce_uuid
from app.web.deps import WebAuthContext, get_db, optional_web_auth, require_web_auth
from app.web.helpers import validate_csrf_token

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/notifications")


def _pid(auth: WebAuthContext) -> UUID:
    """Extract person UUID from authenticated context."""
    pid = coerce_uuid(auth.person_id)
    if pid is None:
        raise ValueError("person_id required")
    return pid


@router.get("/badge", response_class=HTMLResponse)
def notifications_badge(
    request: Request,
    auth: WebAuthContext = Depends(optional_web_auth),
    db: Session = Depends(get_db),
) -> str:
    """Return HTML badge span with unread count, or empty string if 0."""
    if not auth.is_authenticated or not auth.person_id:
        return ""

    from app.services.notification_service import NotificationService

    svc = NotificationService(db)
    count = svc.get_unread_count(_pid(auth))
    if count == 0:
        return ""
    display = "99+" if count > 99 else str(count)
    return (
        f'<span class="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center '
        f'rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{display}</span>'
    )


@router.get("/panel", response_class=HTMLResponse)
def notifications_panel(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> HTMLResponse:
    """Return the notification panel fragment."""
    from app.services.notification_service import NotificationService

    pid = _pid(auth)
    svc = NotificationService(db)
    notifications = svc.get_recent(pid, limit=20)
    return templates.TemplateResponse(
        "notifications/_panel.html",
        {"request": request, "notifications": notifications, "auth": auth},
    )


@router.post("/mark-all-read")
def notifications_mark_all_read(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = "",
) -> RedirectResponse:
    """Mark all notifications as read and redirect back."""
    validate_csrf_token(request, csrf_token)
    from app.services.notification_service import NotificationService

    pid = _pid(auth)
    svc = NotificationService(db)
    svc.mark_all_read(pid)
    db.commit()
    return RedirectResponse(request.headers.get("referer", "/"), status_code=302)
