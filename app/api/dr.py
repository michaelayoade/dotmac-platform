"""Disaster Recovery API — manage DR plans and runs."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role, require_user_auth

router = APIRouter(prefix="/dr/plans", tags=["disaster-recovery"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_dr_plan(
    instance_id: UUID = Body(...),
    backup_schedule_cron: str = Body("0 2 * * *"),
    retention_days: int = Body(30),
    target_server_id: UUID | None = Body(None),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.dr_service import DisasterRecoveryService

    try:
        plan = DisasterRecoveryService(db).create_dr_plan(
            instance_id,
            backup_schedule_cron=backup_schedule_cron,
            retention_days=retention_days,
            target_server_id=target_server_id,
        )
        db.commit()
        return {"dr_plan_id": str(plan.dr_plan_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("")
def list_dr_plans(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.dr_service import DisasterRecoveryService

    plans = DisasterRecoveryService(db).list_plans(limit=limit, offset=offset)
    return [
        {
            "dr_plan_id": str(p.dr_plan_id),
            "instance_id": str(p.instance_id),
            "backup_schedule_cron": p.backup_schedule_cron,
            "retention_days": p.retention_days,
            "target_server_id": str(p.target_server_id) if p.target_server_id else None,
            "last_backup_at": p.last_backup_at.isoformat() if p.last_backup_at else None,
            "last_tested_at": p.last_tested_at.isoformat() if p.last_tested_at else None,
            "last_test_status": p.last_test_status.value if p.last_test_status else None,
            "last_test_message": p.last_test_message,
            "is_active": p.is_active,
        }
        for p in plans
    ]


@router.get("/{dr_plan_id}")
def get_dr_plan(
    dr_plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.dr_service import DisasterRecoveryService

    plan = DisasterRecoveryService(db).get_by_id(dr_plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="DR plan not found")
    return {
        "dr_plan_id": str(plan.dr_plan_id),
        "instance_id": str(plan.instance_id),
        "backup_schedule_cron": plan.backup_schedule_cron,
        "retention_days": plan.retention_days,
        "target_server_id": str(plan.target_server_id) if plan.target_server_id else None,
        "last_backup_at": plan.last_backup_at.isoformat() if plan.last_backup_at else None,
        "last_tested_at": plan.last_tested_at.isoformat() if plan.last_tested_at else None,
        "last_test_status": plan.last_test_status.value if plan.last_test_status else None,
        "last_test_message": plan.last_test_message,
        "is_active": plan.is_active,
    }


@router.put("/{dr_plan_id}")
def update_dr_plan(
    dr_plan_id: UUID,
    backup_schedule_cron: str | None = Body(None),
    retention_days: int | None = Body(None),
    target_server_id: UUID | None = Body(None),
    is_active: bool | None = Body(None),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.dr_service import DisasterRecoveryService

    try:
        plan = DisasterRecoveryService(db).update_dr_plan(
            dr_plan_id,
            backup_schedule_cron=backup_schedule_cron,
            retention_days=retention_days,
            target_server_id=target_server_id,
            is_active=is_active,
        )
        db.commit()
        return {"dr_plan_id": str(plan.dr_plan_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{dr_plan_id}")
def delete_dr_plan(
    dr_plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.dr_service import DisasterRecoveryService

    try:
        DisasterRecoveryService(db).delete_dr_plan(dr_plan_id)
        db.commit()
        return {"deleted": str(dr_plan_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{dr_plan_id}/backup", status_code=status.HTTP_202_ACCEPTED)
def trigger_dr_backup(
    dr_plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.tasks.dr import run_dr_backup

    run_dr_backup.delay(str(dr_plan_id))
    return {"queued": True, "dr_plan_id": str(dr_plan_id)}


@router.post("/{dr_plan_id}/test", status_code=status.HTTP_202_ACCEPTED)
def trigger_dr_test(
    dr_plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.tasks.dr import run_dr_test

    run_dr_test.delay(str(dr_plan_id))
    return {"queued": True, "dr_plan_id": str(dr_plan_id)}


@router.post("/{dr_plan_id}/restore", status_code=status.HTTP_202_ACCEPTED)
def trigger_dr_restore(
    dr_plan_id: UUID,
    backup_id: UUID = Body(...),
    target_server_id: UUID = Body(...),
    new_org_code: str = Body(...),
    new_org_name: str | None = Body(None),
    admin_password: str | None = Body(None),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.tasks.dr import run_dr_restore

    run_dr_restore.delay(
        str(backup_id),
        str(target_server_id),
        new_org_code,
        new_org_name=new_org_name,
        admin_password=admin_password,
    )
    return {"queued": True, "dr_plan_id": str(dr_plan_id)}
