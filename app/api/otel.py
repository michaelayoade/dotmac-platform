from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.schemas.otel import OtelConfigCreate, OtelConfigRead
from app.services.otel_export_service import OtelExportService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/instances/{instance_id}/otel-export", tags=["otel"])


@router.put("", response_model=OtelConfigRead, dependencies=[Depends(require_role("admin"))])
def configure_otel(
    instance_id: UUID,
    body: OtelConfigCreate,
    db: Session = Depends(get_db),
) -> OtelConfigRead:
    svc = OtelExportService(db)
    try:
        config = svc.configure(
            instance_id=instance_id,
            endpoint_url=body.endpoint_url,
            protocol=body.protocol,
            headers=body.headers,
            export_interval_seconds=body.export_interval_seconds,
        )
        db.commit()
        return OtelConfigRead.model_validate(config)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("", response_model=OtelConfigRead | None, dependencies=[Depends(require_role("admin"))])
def get_otel_config(
    instance_id: UUID,
    db: Session = Depends(get_db),
) -> OtelConfigRead | None:
    svc = OtelExportService(db)
    config = svc.get_config(instance_id)
    if not config:
        return None
    return OtelConfigRead.model_validate(config)


@router.delete("", status_code=204, dependencies=[Depends(require_role("admin"))])
def delete_otel_config(
    instance_id: UUID,
    db: Session = Depends(get_db),
) -> None:
    svc = OtelExportService(db)
    svc.delete_config(instance_id)
    db.commit()


@router.post("/test", dependencies=[Depends(require_role("admin"))])
def test_otel_export(
    instance_id: UUID,
    db: Session = Depends(get_db),
) -> dict:
    svc = OtelExportService(db)
    try:
        result = svc.export_metrics(instance_id)
        db.commit()
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
