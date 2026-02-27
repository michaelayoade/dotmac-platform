from datetime import datetime
from uuid import UUID

# Pydantic imports
from pydantic import BaseModel, ConfigDict, Field

from app.models.scheduler import ScheduleType


class ScheduledTaskBase(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    task_name: str = Field(min_length=1, max_length=200)
    schedule_type: ScheduleType = ScheduleType.interval
    interval_seconds: int = Field(default=3600, ge=1)
    args_json: list | None = None
    kwargs_json: dict | None = None
    enabled: bool = True


class ScheduledTaskCreate(ScheduledTaskBase):
    pass


class ScheduledTaskUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=160)
    task_name: str | None = Field(default=None, max_length=200)
    schedule_type: ScheduleType | None = None
    interval_seconds: int | None = Field(default=None, ge=1)
    args_json: list | None = None
    kwargs_json: dict | None = None
    enabled: bool | None = None


class ScheduledTaskRead(ScheduledTaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    last_run_at: datetime | None
    created_at: datetime
    updated_at: datetime


class SchedulerStatusResponse(BaseModel):
    pending: int = Field(ge=0)
    running: int = Field(ge=0)
    completed: int = Field(ge=0)
