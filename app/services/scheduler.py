import logging

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.models.scheduler import ScheduledTask, ScheduleType
from app.schemas.scheduler import ScheduledTaskCreate, ScheduledTaskUpdate
from app.services.common import apply_ordering, apply_pagination, coerce_uuid
from app.services.response import ListResponseMixin


def _validate_schedule_type(value):
    if value is None:
        return None
    if isinstance(value, ScheduleType):
        return value
    try:
        return ScheduleType(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid schedule_type") from exc


class ScheduledTasks(ListResponseMixin):
    @staticmethod
    def create(db: Session, payload: ScheduledTaskCreate):
        if payload.interval_seconds < 1:
            raise HTTPException(status_code=400, detail="interval_seconds must be >= 1")
        task = ScheduledTask(**payload.model_dump())
        db.add(task)
        db.flush()
        db.refresh(task)
        return task

    @staticmethod
    def get(db: Session, task_id: str):
        task = db.get(ScheduledTask, coerce_uuid(task_id))
        if not task:
            raise HTTPException(status_code=404, detail="Scheduled task not found")
        return task

    @staticmethod
    def list(
        db: Session,
        enabled: bool | None,
        order_by: str,
        order_dir: str,
        limit: int,
        offset: int,
    ):
        stmt = select(ScheduledTask)
        if enabled is not None:
            stmt = stmt.where(ScheduledTask.enabled == enabled)
        stmt = apply_ordering(
            stmt,
            order_by,
            order_dir,
            {"created_at": ScheduledTask.created_at, "name": ScheduledTask.name},
        )
        stmt = apply_pagination(stmt, limit, offset)
        return list(db.scalars(stmt).all())

    @staticmethod
    def update(db: Session, task_id: str, payload: ScheduledTaskUpdate):
        task = db.get(ScheduledTask, coerce_uuid(task_id))
        if not task:
            raise HTTPException(status_code=404, detail="Scheduled task not found")
        data = payload.model_dump(exclude_unset=True)
        if "schedule_type" in data:
            data["schedule_type"] = _validate_schedule_type(data["schedule_type"])
        if "interval_seconds" in data and data["interval_seconds"] is not None:
            if data["interval_seconds"] < 1:
                raise HTTPException(status_code=400, detail="interval_seconds must be >= 1")
        for key, value in data.items():
            setattr(task, key, value)
        db.flush()
        db.refresh(task)
        return task

    @staticmethod
    def delete(db: Session, task_id: str):
        task = db.get(ScheduledTask, coerce_uuid(task_id))
        if not task:
            raise HTTPException(status_code=404, detail="Scheduled task not found")
        db.delete(task)
        db.flush()


scheduled_tasks = ScheduledTasks()


def refresh_schedule() -> dict:
    return {"detail": "Celery beat refreshes schedules automatically."}


ALLOWED_TASK_PREFIXES = ("app.tasks.",)


def enqueue_task(task_name: str, args: list | None, kwargs: dict | None) -> dict:
    if not any(task_name.startswith(prefix) for prefix in ALLOWED_TASK_PREFIXES):
        raise HTTPException(
            status_code=400,
            detail=f"Task name must start with one of: {', '.join(ALLOWED_TASK_PREFIXES)}",
        )
    from app.celery_app import celery_app

    async_result = celery_app.send_task(task_name, args=args or [], kwargs=kwargs or {})
    return {"queued": True, "task_id": str(async_result.id)}
