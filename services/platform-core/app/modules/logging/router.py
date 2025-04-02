"""
Router for the logging module.
"""

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.logging.models import (
    ExportRequest,
    ExportResponse,
    LogEntryCreate,
    LogEntryResponse,
    LogQueryParams,
)
from app.modules.logging.service import LogEntryService

router = APIRouter()


@router.post("/", response_model=LogEntryResponse, status_code=201)
async def create_log_entry(log_entry: LogEntryCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new log entry.
    """
    return await LogEntryService.create_log_entry(db=db, log_entry_data=log_entry)


@router.get("/", response_model=List[LogEntryResponse])
async def get_log_entries(
    level: Optional[str] = Query(None, description="Filter by log level"),
    service: Optional[str] = Query(None, alias="service", description="Filter by service name"),
    start_time: Optional[datetime] = Query(None, description="Start time (ISO format)"),
    end_time: Optional[datetime] = Query(None, description="End time (ISO format)"),
    skip: int = Query(0, description="Number of logs to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of logs to return"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get log entries with optional filtering.
    """
    # Create filters object
    filters = LogQueryParams(
        level=level,
        service=service,
    )

    # Create time_range dictionary
    time_range = None
    if start_time or end_time:
        time_range = {"start_time": start_time, "end_time": end_time}

    # Call service with correct parameter names
    logs, total = await LogEntryService.get_log_entries(
        db=db, filters=filters, time_range=time_range, skip=skip, limit=limit
    )

    return logs


@router.get("/{log_id}", response_model=LogEntryResponse)
async def get_log_entry(log_id: int, db: AsyncSession = Depends(get_db)):
    """
    Get a specific log entry by ID.
    """
    log_entry = await LogEntryService.get_log_entry_by_id(db=db, log_id=log_id)
    if not log_entry:
        raise HTTPException(status_code=404, detail="Log entry not found")
    return log_entry


@router.post("/export", response_model=ExportResponse)
async def export_logs(
    export_request: ExportRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Export log entries based on criteria.
    """
    # In a real scenario, this might trigger a background task
    # For simplicity, we'll just return the count for now
    count = await LogEntryService.count_log_entries(
        db=db,
        level=export_request.level,
        service_name=export_request.service_name,
        start_time=export_request.start_time,
        end_time=export_request.end_time,
    )
    # Here you would typically generate a file (CSV, JSON) and provide a download link
    # or send it via email, etc.
    return ExportResponse(
        message=f"Export initiated for {count} log entries.",
        export_id="temp_export_id",
    )


@router.get("/export/json", response_model=List[LogEntryResponse])
async def export_logs_direct(
    level: Optional[str] = Query(None, description="Filter by log level"),
    service: Optional[str] = Query(None, description="Filter by service name"),
    start_time: Optional[datetime] = Query(None, description="Start time (ISO format)"),
    end_time: Optional[datetime] = Query(None, description="End time (ISO format)"),
    limit: int = Query(1000, ge=1, le=10000, description="Maximum number of logs to export"),
    db: AsyncSession = Depends(get_db),
):
    """
    Export log entries directly as JSON.
    """
    # Create filters object
    filters = LogQueryParams(
        level=level,
        service=service,
    )

    # Create time_range dictionary
    time_range = None
    if start_time or end_time:
        time_range = {"start_time": start_time, "end_time": end_time}

    # Get logs with correct parameter names
    logs, _ = await LogEntryService.get_log_entries(db=db, filters=filters, time_range=time_range, limit=limit)

    # Generate filename with timestamp
    filename = f"logs_export_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"

    # Convert SQLAlchemy models to Pydantic models
    pydantic_logs = [LogEntryResponse.model_validate(log, from_attributes=True) for log in logs]

    # Create response with Content-Disposition header
    from fastapi.responses import JSONResponse

    return JSONResponse(
        content=[log.model_dump(mode="json") for log in pydantic_logs],
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/stats/summary")
async def get_log_statistics(
    start_time: Optional[datetime] = Query(None, description="Start time (ISO format)"),
    end_time: Optional[datetime] = Query(None, description="End time (ISO format)"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get statistics about log entries.
    """
    return await LogEntryService.get_log_statistics(db=db, start_time=start_time, end_time=end_time)
