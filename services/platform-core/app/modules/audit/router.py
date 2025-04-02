from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.audit.models import AuditLogCreate, AuditLogResponse
from app.modules.audit.service import AuditService

router = APIRouter()


@router.post("/", response_model=AuditLogResponse, status_code=status.HTTP_201_CREATED)
async def create_audit_log(audit_log: AuditLogCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new audit log entry.
    """
    return await AuditService.create_audit_log(db, audit_log)


@router.get("/", response_model=List[AuditLogResponse])
async def get_audit_logs(
    actor_id: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    resource_type: Optional[str] = Query(None),
    resource_id: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """
    Get audit logs with optional filtering.
    """
    return await AuditService.get_audit_logs(
        db,
        actor_id,
        event_type,
        resource_type,
        resource_id,
        action,
        start_date,
        end_date,
        skip,
        limit,
    )


@router.get("/{audit_log_id}", response_model=AuditLogResponse)
async def get_audit_log(audit_log_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get an audit log by ID.
    """
    audit_log = await AuditService.get_audit_log_by_id(db, audit_log_id)
    if not audit_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Audit log with ID {audit_log_id} not found",
        )
    return audit_log
