"""Notification Channels API — CRUD for external notification dispatch targets."""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_user_auth
from app.schemas.notification_channels import (
    NotificationChannelCreate,
    NotificationChannelUpdate,
)
from app.services.common import coerce_uuid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/notification-channels", tags=["notification-channels"])


def _person_id(auth: dict[str, object]) -> UUID:
    raw = auth.get("person_id")
    pid = coerce_uuid(str(raw) if raw else None)
    if pid is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return pid


@router.get("")
def list_channels(
    db: Session = Depends(get_db),
    auth: dict[str, object] = Depends(require_user_auth),
) -> list[dict[str, object]]:
    from app.services.notification_channel_service import NotificationChannelService

    pid = _person_id(auth)
    svc = NotificationChannelService(db)
    channels = svc.list_channels(pid)
    return [svc.serialize_channel(ch, config_masked=svc.mask_config(ch)) for ch in channels]


@router.post("", status_code=status.HTTP_201_CREATED)
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


@router.put("/{channel_id}")
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
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{channel_id}")
def delete_channel(
    channel_id: UUID,
    db: Session = Depends(get_db),
    auth: dict[str, object] = Depends(require_user_auth),
) -> dict[str, str]:
    from app.services.notification_channel_service import NotificationChannelService

    pid = _person_id(auth)
    svc = NotificationChannelService(db)
    try:
        svc.delete_channel(channel_id, pid)
        db.commit()
        return {"deleted": str(channel_id)}
    except ValueError as e:
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
        ok = svc.test_channel(channel_id, pid)
        return {"success": ok}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
