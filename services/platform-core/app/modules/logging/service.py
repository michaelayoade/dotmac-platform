"""
Service for the logging module.
"""

import json
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.logging.models import LogEntry, LogEntryCreate, LogQueryParams
from app.utils.common import json_serializer


class LogEntryService:
    """
    Service for managing structured application logs using async operations.
    """

    @staticmethod
    async def create_log_entry(db: AsyncSession, log_entry_data: LogEntryCreate) -> LogEntry:
        """
        Create a new log entry asynchronously.

        Args:
            db: Async database session
            log_entry_data: Log entry data

        Returns:
            Created log entry
        """
        db_log_entry = LogEntry(
            # Removed timestamp assignment; rely on DB default (func.now())
            level=log_entry_data.level,
            service=log_entry_data.service,
            message=log_entry_data.message,
            context=log_entry_data.context,
            trace_id=log_entry_data.trace_id,
            span_id=log_entry_data.span_id,
            user_id=log_entry_data.user_id,
            ip_address=log_entry_data.ip_address,
        )
        db.add(db_log_entry)
        await db.commit()  # Use await
        await db.refresh(db_log_entry)  # Use await
        return db_log_entry

    @staticmethod
    async def get_log_entries(
        db: AsyncSession,
        filters: Optional[LogQueryParams] = None,
        time_range: Optional[Dict[str, Optional[datetime]]] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> Tuple[List[LogEntry], int]:
        """
        Get log entries based on filters and time range asynchronously.

        Args:
            db: Async database session
            filters: Optional filtering parameters (LogQueryParams model).
            time_range: Optional dict with 'start_time' and 'end_time'.
            skip: Number of records to skip (pagination).
            limit: Maximum number of records to return (pagination).

        Returns:
            A tuple containing a list of log entries and the total count matching the criteria.
        """
        stmt = select(LogEntry)
        count_stmt = select(func.count()).select_from(LogEntry)

        # Apply filters
        if filters:
            if filters.level:
                stmt = stmt.where(LogEntry.level == filters.level)
                count_stmt = count_stmt.where(LogEntry.level == filters.level)
            if filters.service:
                stmt = stmt.where(LogEntry.service == filters.service)
                count_stmt = count_stmt.where(LogEntry.service == filters.service)
            if filters.trace_id:
                stmt = stmt.where(LogEntry.trace_id == filters.trace_id)
                count_stmt = count_stmt.where(LogEntry.trace_id == filters.trace_id)
            if filters.user_id:
                stmt = stmt.where(LogEntry.user_id == filters.user_id)
                count_stmt = count_stmt.where(LogEntry.user_id == filters.user_id)
            # Add other filters from LogQueryParams as needed

        # Apply time range filters
        if time_range:
            start_time = time_range.get("start_time")
            end_time = time_range.get("end_time")
            if start_time:
                stmt = stmt.where(LogEntry.timestamp >= start_time)
                count_stmt = count_stmt.where(LogEntry.timestamp >= start_time)
            if end_time:
                stmt = stmt.where(LogEntry.timestamp <= end_time)
                count_stmt = count_stmt.where(LogEntry.timestamp <= end_time)

        # Get total count before applying pagination
        total_count_result = await db.execute(count_stmt)
        total_count = total_count_result.scalar_one_or_none() or 0

        # Apply ordering and pagination
        stmt = stmt.order_by(desc(LogEntry.timestamp)).offset(skip).limit(limit)

        # Execute the main query
        result = await db.execute(stmt)
        log_entries = result.scalars().all()

        return list(log_entries), total_count

    @staticmethod
    async def get_log_entry(db: AsyncSession, log_id: int) -> Optional[LogEntry]:
        """
        Get a single log entry by its ID asynchronously.

        Args:
            db: Async database session.
            log_id: The ID of the log entry to retrieve.

        Returns:
            The LogEntry object if found, otherwise None.
        """
        stmt = select(LogEntry).where(LogEntry.id == log_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def export_logs_to_json(
        db: AsyncSession,
        filters: Optional[LogQueryParams] = None,
        time_range: Optional[Dict[str, Optional[datetime]]] = None,
        limit: int = 1000,  # Limit export size for performance
    ) -> str:
        """
        Export logs to JSON format asynchronously.

        Args:
            db: Async database session
            filters: Optional filtering parameters.
            time_range: Optional time range filter.
            limit: Max number of logs to export.

        Returns:
            JSON string of log entries
        """
        log_entries, _ = await LogEntryService.get_log_entries(
            db, filters=filters, time_range=time_range, skip=0, limit=limit
        )

        # Convert to dict format for JSON serialization
        log_dicts = [
            {
                "id": log.id,
                "timestamp": log.timestamp,
                "level": log.level,
                "service": log.service,
                "message": log.message,
                "context": log.context,
                "trace_id": log.trace_id,
                "span_id": log.span_id,
                "user_id": log.user_id,
                "ip_address": log.ip_address,
            }
            for log in log_entries
        ]

        # Serialize to JSON
        return json.dumps(log_dicts, default=json_serializer)

    @staticmethod
    async def get_log_statistics(
        db: AsyncSession,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """
        Get statistics about log entries asynchronously.

        Args:
            db: Async database session
            start_time: Optional start time for filtering
            end_time: Optional end time for filtering

        Returns:
            Dictionary of log statistics
        """
        # Base select for filtering
        base_stmt = select(LogEntry)
        if start_time:
            base_stmt = base_stmt.where(LogEntry.timestamp >= start_time)
        if end_time:
            base_stmt = base_stmt.where(LogEntry.timestamp <= end_time)

        # Apply filters to a counting statement
        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        total_count_res = await db.execute(count_stmt)
        total_count = total_count_res.scalar_one() or 0

        # Get counts by level
        level_stmt = (
            select(LogEntry.level, func.count(LogEntry.id)).select_from(base_stmt.subquery()).group_by(LogEntry.level)
        )
        level_res = await db.execute(level_stmt)
        level_counts = {level: count for level, count in level_res.all()}

        # Get counts by service
        service_stmt = (
            select(LogEntry.service, func.count(LogEntry.id))
            .select_from(base_stmt.subquery())
            .group_by(LogEntry.service)
        )
        service_res = await db.execute(service_stmt)
        service_counts = {service: count for service, count in service_res.all()}

        # Return statistics
        return {
            "total_count": total_count,
            "level_counts": level_counts,
            "service_counts": service_counts,
            "start_time": start_time.isoformat() if start_time else None,
            "end_time": end_time.isoformat() if end_time else None,
        }
