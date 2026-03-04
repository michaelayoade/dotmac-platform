"""Instance Export API — CSV export of instance data."""

from __future__ import annotations

import csv
import io

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.models.instance import Instance

router = APIRouter(prefix="/instances", tags=["instances"])

_CSV_FIELDS = [
    "instance_id",
    "org_code",
    "org_name",
    "status",
    "domain",
    "admin_email",
    "app_port",
    "sector_type",
    "framework",
    "currency",
    "auto_deploy",
    "deployed_git_ref",
    "created_at",
    "updated_at",
]


@router.get("/export")
def export_instances_csv(
    status_filter: str | None = Query(default=None, alias="status"),
    max_rows: int = Query(default=100000, ge=1, le=1000000),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
) -> Response:
    stmt = select(Instance)
    if status_filter:
        stmt = stmt.where(Instance.status == status_filter)
    stmt = stmt.order_by(Instance.created_at.desc()).limit(max_rows)
    instances = db.scalars(stmt).all()

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(_CSV_FIELDS)
    for inst in instances:
        writer.writerow(
            [
                str(inst.instance_id),
                inst.org_code,
                inst.org_name,
                inst.status.value if inst.status else "",
                inst.domain or "",
                inst.admin_email or "",
                inst.app_port,
                inst.sector_type.value if inst.sector_type else "",
                inst.framework.value if inst.framework else "",
                inst.currency or "",
                inst.auto_deploy,
                inst.deployed_git_ref or "",
                inst.created_at.isoformat() if inst.created_at else "",
                inst.updated_at.isoformat() if inst.updated_at else "",
            ]
        )

    return Response(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="instances.csv"',
            "X-Row-Limit": str(max_rows),
        },
    )
