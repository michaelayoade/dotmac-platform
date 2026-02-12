"""Observability API — per-instance metrics summary and container logs."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role

router = APIRouter(prefix="/observability", tags=["observability"])


@router.get("/instances/{instance_id}/metrics")
def metrics_summary(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
) -> dict:
    from app.services.metrics_export import MetricsExportService

    svc = MetricsExportService(db)
    try:
        return svc.get_metrics_summary(instance_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/instances/{instance_id}/log-streams")
def list_log_streams(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
) -> list[dict]:
    from app.services.metrics_export import MetricsExportService

    svc = MetricsExportService(db)
    try:
        return svc.get_log_streams(instance_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/instances/{instance_id}/logs")
def get_logs(
    instance_id: UUID,
    stream: str = Query("app"),
    lines: int = Query(100, ge=1, le=2000),
    since: str | None = Query(None),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
) -> dict:
    from app.services.metrics_export import MetricsExportService

    svc = MetricsExportService(db)
    try:
        return svc.get_logs_payload(instance_id, stream=stream, lines=lines, since=since)
    except ValueError as e:
        detail = str(e)
        if "not found" in detail.lower():
            raise HTTPException(status_code=404, detail=detail)
        raise HTTPException(status_code=400, detail=detail)
