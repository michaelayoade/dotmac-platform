"""Notification Channels API — CRUD for external notification dispatch targets."""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_user_auth
from app.models.notification_channel import ChannelType
from app.schemas.notification_channels import (
    NotificationChannelCreate,
    NotificationChannelRead,
    NotificationChannelUpdate,
)
from app.services.common import coerce_uuid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/notification-channels", tags=["notification-channels"])
TEST_NOTIFICATION_MESSAGE = "Seabone test notification"


def _person_id(auth: dict[str, object]) -> UUID:
    raw = auth.get("person_id")
    pid = coerce_uuid(str(raw) if raw else None)
    if pid is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return pid


@router.get("", response_model=list[NotificationChannelRead])
def list_channels(
    db: Session = Depends(get_db),
    auth: dict[str, object] = Depends(require_user_auth),
) -> list[dict[str, object]]:
    from app.services.notification_channel_service import NotificationChannelService

    pid = _person_id(auth)
    svc = NotificationChannelService(db)
    channels = svc.list_channels(pid)
    return [svc.serialize_channel(ch, config_masked=svc.mask_config(ch)) for ch in channels]


@router.post("", status_code=status.HTTP_201_CREATED, response_model=NotificationChannelRead)
def create_channel(
    payload: NotificationChannelCreate,
    db: Session = Depends(get_db),
    auth: dict[str, object] = Depends(require_user_auth),
) -> dict[str, object]:
    from app.services.notification_channel_service import NotificationChannelService

    pid = _person_id(auth)
    svc = NotificationChannelService(db)
    try:
        channel = svc.create_channel(
            person_id=pid,
            channel_type=payload.channel_type,
            label=payload.label,
            config=payload.config,
            events=payload.events,
        )
        db.commit()
        return svc.serialize_channel(channel, config_masked=svc.mask_config(channel))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{channel_id}", response_model=NotificationChannelRead)
def update_channel(
    channel_id: UUID,
    payload: NotificationChannelUpdate,
    db: Session = Depends(get_db),
    auth: dict[str, object] = Depends(require_user_auth),
) -> dict[str, object]:
    from app.services.notification_channel_service import NotificationChannelService

    pid = _person_id(auth)
    svc = NotificationChannelService(db)
    try:
        channel = svc.update_channel(
            channel_id,
            pid,
            **payload.model_dump(exclude_unset=True),
        )
        db.commit()
        return svc.serialize_channel(channel, config_masked=svc.mask_config(channel))
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def delete_channel(
    channel_id: UUID,
    db: Session = Depends(get_db),
    auth: dict[str, object] = Depends(require_user_auth),
) -> None:
    from app.services.notification_channel_service import NotificationChannelService

    pid = _person_id(auth)
    svc = NotificationChannelService(db)
    try:
        svc.delete_channel(channel_id, pid)
        db.commit()
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{channel_id}/test")
def test_channel(
    channel_id: UUID,
    db: Session = Depends(get_db),
    auth: dict[str, object] = Depends(require_user_auth),
) -> dict[str, bool]:
    from app.services.notification_channel_service import NotificationChannelService

    pid = _person_id(auth)
    svc = NotificationChannelService(db)
    try:
        channel = svc.get_by_id(channel_id)
        if not channel:
            raise ValueError("Channel not found")
        if channel.channel_type not in {ChannelType.email, ChannelType.slack, ChannelType.telegram}:
            raise ValueError("Unsupported channel type")
        ok = svc.test_channel(
            channel_id,
            pid,
            title=TEST_NOTIFICATION_MESSAGE,
            message=TEST_NOTIFICATION_MESSAGE,
        )
        return {"success": ok}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
