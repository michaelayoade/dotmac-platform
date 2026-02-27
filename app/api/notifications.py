"""Notification API — list and manage in-app notifications."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_user_auth
from app.schemas.notifications import NotificationListResponse, NotificationUnreadCountResponse
from app.services.common import coerce_uuid

router = APIRouter(prefix="/notifications", tags=["notifications"])


def _person_id(auth: dict) -> UUID:
    pid = coerce_uuid(auth["person_id"])
    if pid is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return pid


@router.get("", response_model=NotificationListResponse)
def list_notifications(
    limit: int = Query(default=25, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth: dict = Depends(require_user_auth),
) -> dict:
    from app.services.notification_service import NotificationService

    pid = _person_id(auth)
    svc = NotificationService(db)
    return svc.get_api_payload(pid, limit=limit, offset=offset)


@router.get("/unread-count", response_model=NotificationUnreadCountResponse)
def unread_count(
    db: Session = Depends(get_db),
    auth: dict = Depends(require_user_auth),
) -> dict:
    from app.services.notification_service import NotificationService

    pid = _person_id(auth)
    svc = NotificationService(db)
    return {"unread_count": svc.get_unread_count(pid)}


@router.post("/{notification_id}/read")
def mark_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
    auth: dict = Depends(require_user_auth),
) -> dict:
    from app.services.notification_service import NotificationService

    pid = _person_id(auth)
    svc = NotificationService(db)
    try:
        svc.mark_read(notification_id, pid)
        db.commit()
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return {"ok": True}


@router.post("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    auth: dict = Depends(require_user_auth),
) -> dict:
    from app.services.notification_service import NotificationService

    pid = _person_id(auth)
    svc = NotificationService(db)
    count = svc.mark_all_read(pid)
    db.commit()
    return {"marked": count}
