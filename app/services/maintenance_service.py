"""Maintenance Window Service — manage and check deploy windows."""

from __future__ import annotations

import logging
from datetime import UTC, datetime, time
from uuid import UUID
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.maintenance_window import MaintenanceWindow

logger = logging.getLogger(__name__)


class MaintenanceService:
    def __init__(self, db: Session):
        self.db = db

    def _get_for_instance(self, instance_id: UUID, window_id: UUID) -> MaintenanceWindow | None:
        window = self.db.get(MaintenanceWindow, window_id)
        if not window or window.instance_id != instance_id:
            return None
        return window

    def get_windows(self, instance_id: UUID) -> list[MaintenanceWindow]:
        stmt = (
            select(MaintenanceWindow)
            .where(MaintenanceWindow.instance_id == instance_id)
            .where(MaintenanceWindow.is_active.is_(True))
            .order_by(MaintenanceWindow.day_of_week)
        )
        return list(self.db.scalars(stmt).all())

    @staticmethod
    def serialize_window(window: MaintenanceWindow) -> dict:
        return {
            "window_id": str(window.window_id),
            "day_of_week": window.day_of_week,
            "start_time": window.start_time.isoformat(),
            "end_time": window.end_time.isoformat(),
            "timezone": window.timezone,
        }

    def set_window(
        self,
        instance_id: UUID,
        day_of_week: int,
        start_time: time,
        end_time: time,
        tz: str = "UTC",
    ) -> MaintenanceWindow:
        if not (0 <= day_of_week <= 6):
            raise ValueError("day_of_week must be 0-6 (Monday-Sunday)")
        if start_time >= end_time:
            raise ValueError("start_time must be before end_time")

        # Upsert: replace existing window for same day
        stmt = select(MaintenanceWindow).where(
            MaintenanceWindow.instance_id == instance_id,
            MaintenanceWindow.day_of_week == day_of_week,
            MaintenanceWindow.is_active.is_(True),
        )
        existing = self.db.scalar(stmt)
        if existing:
            existing.start_time = start_time
            existing.end_time = end_time
            existing.timezone = tz
            self.db.flush()
            return existing

        window = MaintenanceWindow(
            instance_id=instance_id,
            day_of_week=day_of_week,
            start_time=start_time,
            end_time=end_time,
            timezone=tz,
        )
        self.db.add(window)
        self.db.flush()
        return window

    def delete_window(self, instance_id: UUID, window_id: UUID) -> None:
        window = self._get_for_instance(instance_id, window_id)
        if not window:
            raise ValueError(f"Maintenance window {window_id} not found for instance {instance_id}")
        window.is_active = False
        self.db.flush()

    def parse_times(self, start_time: str, end_time: str) -> tuple[time, time]:
        try:
            start = time.fromisoformat(start_time)
            end = time.fromisoformat(end_time)
        except ValueError as exc:
            raise ValueError("Invalid time format") from exc
        return start, end

    def get_index_bundle(self, instance_id: UUID | None) -> dict:
        from app.services.instance_service import InstanceService

        instances = InstanceService(self.db).list_all()
        if not instance_id and instances:
            instance_id = instances[0].instance_id
        windows = []
        if instance_id:
            windows = self.get_windows(instance_id)
        return {
            "instances": instances,
            "instance_id": instance_id,
            "windows": windows,
        }

    def is_deploy_allowed(self, instance_id: UUID, now: datetime | None = None) -> bool:
        """Check if deployment is allowed for this instance right now.

        Returns True if:
        - No maintenance windows are configured (no restrictions)
        - Current time falls outside any maintenance window
        """
        windows = self.get_windows(instance_id)
        if not windows:
            return True  # No restrictions

        now = now or datetime.now(UTC)
        if now.tzinfo is None:
            now = now.replace(tzinfo=UTC)

        for w in windows:
            tz = w.timezone or "UTC"
            try:
                local_now = now.astimezone(ZoneInfo(tz))
            except Exception:
                local_now = now.astimezone(UTC)
            if local_now.weekday() == w.day_of_week:
                local_time = local_now.time()
                if w.start_time <= local_time <= w.end_time:
                    return False

        return True
