"""Notification Channels — Web routes for managing external notification preferences."""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.models.notification_channel import ChannelType
from app.services.common import coerce_uuid
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

logger = logging.getLogger(__name__)


def _auth_person_uuid(auth: WebAuthContext) -> UUID | None:
    """Convert auth.person_id (str) to UUID | None."""
    return coerce_uuid(auth.person_id) if auth and auth.person_id else None


templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/notification-preferences")


@router.get("", response_class=HTMLResponse)
def channels_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> HTMLResponse:
    from app.services.notification_channel_service import NotificationChannelService

    svc = NotificationChannelService(db)
    person_id = _auth_person_uuid(auth)
    channel_data = svc.list_channels_enriched(person_id)

    return templates.TemplateResponse(
        "notification_channels/index.html",
        ctx(
            request,
            auth,
            "Notification Preferences",
            active_page="notification-preferences",
            channels=channel_data,
            channel_types=[t.value for t in ChannelType],
        ),
    )


@router.post("")
def channels_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    channel_type: str = Form(""),
    label: str = Form(""),
    config_email: str = Form(""),
    config_webhook_url: str = Form(""),
    config_bot_token: str = Form(""),
    config_chat_id: str = Form(""),
    is_global: bool = Form(False),
    csrf_token: str = Form(""),
) -> RedirectResponse:
    validate_csrf_token(request, csrf_token)
    from app.services.notification_channel_service import NotificationChannelService

    try:
        ct = ChannelType(channel_type)
    except ValueError:
        return RedirectResponse("/notification-preferences", status_code=302)

    config: dict[str, str] = {}
    if ct == ChannelType.email:
        config["email"] = config_email
    elif ct == ChannelType.slack:
        config["webhook_url"] = config_webhook_url
    elif ct == ChannelType.telegram:
        config["bot_token"] = config_bot_token
        config["chat_id"] = config_chat_id

    person_id = None if is_global else _auth_person_uuid(auth)
    if is_global:
        require_admin(auth)

    try:
        svc = NotificationChannelService(db)
        svc.create_channel(person_id=person_id, channel_type=ct, label=label, config=config)
        db.commit()
    except (ValueError, Exception) as e:
        db.rollback()
        logger.exception("Failed to create notification channel: %s", e)

    return RedirectResponse("/notification-preferences", status_code=302)


@router.post("/{channel_id}/delete")
def channels_delete(
    request: Request,
    channel_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
) -> RedirectResponse:
    validate_csrf_token(request, csrf_token)
    from app.services.notification_channel_service import NotificationChannelService

    person_id = _auth_person_uuid(auth)
    svc = NotificationChannelService(db)
    try:
        svc.delete_channel(channel_id, person_id)
        db.commit()
    except ValueError:
        pass
    return RedirectResponse("/notification-preferences", status_code=302)


@router.post("/{channel_id}/test")
def channels_test(
    request: Request,
    channel_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
) -> RedirectResponse:
    validate_csrf_token(request, csrf_token)
    from app.services.notification_channel_service import NotificationChannelService

    person_id = _auth_person_uuid(auth)
    svc = NotificationChannelService(db)
    try:
        svc.test_channel(channel_id, person_id)
    except ValueError:
        pass
    return RedirectResponse("/notification-preferences", status_code=302)


@router.post("/{channel_id}/toggle")
def channels_toggle(
    request: Request,
    channel_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
) -> RedirectResponse:
    validate_csrf_token(request, csrf_token)
    from app.services.notification_channel_service import NotificationChannelService

    person_id = _auth_person_uuid(auth)
    svc = NotificationChannelService(db)
    try:
        svc.toggle_active(channel_id, person_id)
        db.commit()
    except ValueError:
        pass
    return RedirectResponse("/notification-preferences", status_code=302)
