"""Disaster Recovery API schemas."""

from __future__ import annotations

from pydantic import BaseModel


class DRPlanRead(BaseModel):
    dr_plan_id: str
    instance_id: str
    backup_schedule_cron: str
    retention_days: int
    target_server_id: str | None = None
    is_active: bool
    last_backup_at: str | None = None
    last_tested_at: str | None = None
    last_test_status: str | None = None
    last_test_message: str | None = None
    created_at: str | None = None


class DRTaskResponse(BaseModel):
    task_id: str
    status: str
