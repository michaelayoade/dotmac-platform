"""Disaster Recovery API — manage DR plans and runs."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_instance_access, require_role, require_user_auth
from app.schemas.dr import DRPlanRead, DRTaskResponse

router = APIRouter(prefix="/dr/plans", tags=["disaster-recovery"])


@router.post("", response_model=DRPlanRead, status_code=status.HTTP_201_CREATED)
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
        require_instance_access(instance_id, db=db, auth=auth)
        svc = DisasterRecoveryService(db)
        plan = svc.create_dr_plan(
            instance_id,
            backup_schedule_cron=backup_schedule_cron,
            retention_days=retention_days,
            target_server_id=target_server_id,
        )
        db.commit()
        return svc.serialize_plan(plan)
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=list[DRPlanRead])
def list_dr_plans(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.dr_service import DisasterRecoveryService

    org_id = auth.get("org_id")
    if not org_id:
        raise HTTPException(status_code=401, detail="Organization context required")
    svc = DisasterRecoveryService(db)
    plans = svc.list_for_org(UUID(org_id), limit=limit, offset=offset)
    return [svc.serialize_plan(p) for p in plans]


@router.get("/{dr_plan_id}", response_model=DRPlanRead)
def get_dr_plan(
    dr_plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.dr_service import DisasterRecoveryService

    svc = DisasterRecoveryService(db)
    plan = svc.get_by_id(dr_plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="DR plan not found")
    require_instance_access(plan.instance_id, db=db, auth=auth)
    return svc.serialize_plan(plan)


@router.put("/{dr_plan_id}", response_model=DRPlanRead)
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
        svc = DisasterRecoveryService(db)
        existing = svc.get_by_id(dr_plan_id)
        if not existing:
            raise ValueError("DR plan not found")
        require_instance_access(existing.instance_id, db=db, auth=auth)
        plan = svc.update_dr_plan(
            dr_plan_id,
            backup_schedule_cron=backup_schedule_cron,
            retention_days=retention_days,
            target_server_id=target_server_id,
            is_active=is_active,
        )
        db.commit()
        return svc.serialize_plan(plan)
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{dr_plan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dr_plan(
    dr_plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.dr_service import DisasterRecoveryService

    try:
        svc = DisasterRecoveryService(db)
        existing = svc.get_by_id(dr_plan_id)
        if not existing:
            raise ValueError("DR plan not found")
        require_instance_access(existing.instance_id, db=db, auth=auth)
        svc.delete_dr_plan(dr_plan_id)
        db.commit()
        return None
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{dr_plan_id}/backup", response_model=DRTaskResponse, status_code=status.HTTP_202_ACCEPTED)
def trigger_dr_backup(
    dr_plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.dr_service import DisasterRecoveryService
    from app.tasks.dr import run_dr_backup

    plan = DisasterRecoveryService(db).get_by_id(dr_plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="DR plan not found")
    require_instance_access(plan.instance_id, db=db, auth=auth)
    task = run_dr_backup.delay(str(dr_plan_id))
    return {"task_id": task.id, "status": "queued"}


@router.post("/{dr_plan_id}/test", response_model=DRTaskResponse, status_code=status.HTTP_202_ACCEPTED)
def trigger_dr_test(
    dr_plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.dr_service import DisasterRecoveryService
    from app.tasks.dr import run_dr_test

    plan = DisasterRecoveryService(db).get_by_id(dr_plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="DR plan not found")
    require_instance_access(plan.instance_id, db=db, auth=auth)
    task = run_dr_test.delay(str(dr_plan_id))
    return {"task_id": task.id, "status": "queued"}


@router.post("/{dr_plan_id}/restore", response_model=DRTaskResponse, status_code=status.HTTP_202_ACCEPTED)
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
    from app.services.dr_service import DisasterRecoveryService
    from app.tasks.dr import run_dr_restore

    plan = DisasterRecoveryService(db).get_by_id(dr_plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="DR plan not found")
    require_instance_access(plan.instance_id, db=db, auth=auth)
    task = run_dr_restore.delay(
        str(backup_id),
        str(target_server_id),
        new_org_code,
        new_org_name=new_org_name,
        admin_password=admin_password,
    )
    return {"task_id": task.id, "status": "queued"}
