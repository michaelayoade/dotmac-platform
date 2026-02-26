import csv
import io
import json
from datetime import datetime

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_audit_auth
from app.db import SessionLocal
from app.models.audit import AuditEvent
from app.schemas.audit import AuditEventRead
from app.schemas.common import ListResponse
from app.services import audit as audit_service

router = APIRouter(
    prefix="/audit-events",
    tags=["audit-events"],
    dependencies=[Depends(require_audit_auth)],
)
export_router = APIRouter(
    prefix="/audit",
    tags=["audit-events"],
    dependencies=[Depends(require_audit_auth)],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{event_id}", response_model=AuditEventRead)
def get_audit_event(event_id: str, db: Session = Depends(get_db)):
    return audit_service.audit_events.get(db, event_id)


@router.get("", response_model=ListResponse[AuditEventRead])
def list_audit_events(
    actor_id: str | None = None,
    actor_type: str | None = None,
    action: str | None = None,
    entity_type: str | None = None,
    request_id: str | None = None,
    is_success: bool | None = None,
    status_code: int | None = None,
    is_active: bool | None = None,
    order_by: str = Query(default="occurred_at"),
    order_dir: str = Query(default="desc", pattern="^(asc|desc)$"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    resolved_actor_type = audit_service.audit_events.parse_actor_type(actor_type)
    return audit_service.audit_events.list_response(
        db,
        actor_id,
        resolved_actor_type,
        action,
        entity_type,
        request_id,
        is_success,
        status_code,
        is_active,
        order_by,
        order_dir,
        limit,
        offset,
    )


@export_router.get("/export")
def export_audit_events_csv(
    max_rows: int = Query(default=100000, ge=1, le=1000000),
    started_after: datetime | None = Query(default=None),
    started_before: datetime | None = Query(default=None),
    db: Session = Depends(get_db),
) -> Response:
    stmt = select(AuditEvent).where(AuditEvent.is_active.is_(True))
    if started_after is not None:
        stmt = stmt.where(AuditEvent.occurred_at >= started_after)
    if started_before is not None:
        stmt = stmt.where(AuditEvent.occurred_at <= started_before)
    stmt = stmt.order_by(AuditEvent.occurred_at.desc()).limit(max_rows)
    events = db.scalars(stmt).all()

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["timestamp", "user", "action", "resource", "detail"])
    for event in events:
        resource = event.entity_type if not event.entity_id else f"{event.entity_type}:{event.entity_id}"
        detail = json.dumps(event.metadata_, sort_keys=True) if event.metadata_ else ""
        writer.writerow(
            [
                event.occurred_at.isoformat(),
                event.actor_id or event.actor_type.value,
                event.action,
                resource,
                detail,
            ]
        )

    return Response(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="audit-log.csv"',
            "X-Row-Limit": str(max_rows),
        },
    )
