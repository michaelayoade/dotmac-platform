"""
Instance API — Modules, feature flags, plans, backups, domains, lifecycle, and batch deploys.
"""

from __future__ import annotations

from datetime import UTC
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role, require_user_auth
from app.schemas.instances import InstanceCreateRequest, InstanceCreateResponse
from app.services.common import paginate_list

router = APIRouter(prefix="/instances", tags=["instances"])


# ──────────────────────────── Instance Creation ────────────────────────────


@router.post("", response_model=InstanceCreateResponse, status_code=status.HTTP_201_CREATED)
def create_instance(
    payload: InstanceCreateRequest,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    try:
        instance = svc.create_with_catalog(
            server_id=payload.server_id,
            org_code=payload.org_code,
            org_name=payload.org_name,
            catalog_item_id=payload.catalog_item_id,
            sector_type=payload.sector_type.value if payload.sector_type else None,
            framework=payload.framework.value if payload.framework else None,
            currency=payload.currency,
            admin_email=payload.admin_email,
            admin_username=payload.admin_username,
            domain=payload.domain or None,
            app_port=payload.app_port,
            db_port=payload.db_port,
            redis_port=payload.redis_port,
        )
        db.commit()
        return InstanceCreateResponse(
            instance_id=instance.instance_id,
            server_id=instance.server_id,
            org_code=instance.org_code,
            org_name=instance.org_name,
            app_url=instance.app_url,
            domain=instance.domain,
            status=instance.status.value,
            catalog_item_id=instance.catalog_item_id,
        )
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        db.rollback()
        raise


# ──────────────────────────── Auto-Deploy ─────────────────────────


@router.post("/{instance_id}/auto-deploy")
def toggle_auto_deploy(
    instance_id: UUID,
    enabled: bool = True,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.instance_service import InstanceService

    try:
        instance = InstanceService(db).set_auto_deploy(instance_id, enabled)
        db.commit()
        return {"instance_id": str(instance_id), "auto_deploy": instance.auto_deploy}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ──────────────────────────── Modules ────────────────────────────


@router.get("/{instance_id}/modules")
def list_instance_modules(
    instance_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.module_service import ModuleService

    svc = ModuleService(db)
    modules = svc.get_instance_modules(instance_id)
    return [svc.serialize_instance_module(m) for m in paginate_list(modules, limit, offset)]


@router.put("/{instance_id}/modules/{module_id}")
def set_module_enabled(
    instance_id: UUID,
    module_id: UUID,
    enabled: bool = True,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.module_service import ModuleService

    svc = ModuleService(db)
    try:
        im = svc.set_module_enabled(instance_id, module_id, enabled)
        db.commit()
        return {"module_id": str(module_id), "enabled": im.enabled}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/modules")
def list_all_modules(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.module_service import ModuleService

    svc = ModuleService(db)
    modules = svc.list_all()
    return [svc.serialize_module(m) for m in paginate_list(modules, limit, offset)]


# ──────────────────────────── Feature Flags ──────────────────────


@router.get("/{instance_id}/flags")
def list_instance_flags(
    instance_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.feature_flag_service import FeatureFlagService

    svc = FeatureFlagService(db)
    flags = svc.list_for_instance(instance_id)
    return [svc.serialize_flag_entry(f) for f in paginate_list(flags, limit, offset)]


@router.put("/{instance_id}/flags/{flag_key}")
def set_flag(
    instance_id: UUID,
    flag_key: str,
    value: str = "true",
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.feature_flag_service import FeatureFlagService

    svc = FeatureFlagService(db)
    flag = svc.set_flag(instance_id, flag_key, value)
    db.commit()
    return {"key": flag.flag_key, "value": flag.flag_value}


@router.delete("/{instance_id}/flags/{flag_key}")
def delete_flag(
    instance_id: UUID,
    flag_key: str,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.feature_flag_service import FeatureFlagService

    svc = FeatureFlagService(db)
    svc.delete_flag(instance_id, flag_key)
    db.commit()
    return {"deleted": flag_key}


# ──────────────────────────── Plans ──────────────────────────────


@router.get("/plans")
def list_plans(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.plan_service import PlanService

    svc = PlanService(db)
    plans = svc.list_all()
    return [svc.serialize_plan(p) for p in paginate_list(plans, limit, offset)]


@router.put("/{instance_id}/plan")
def assign_plan(
    instance_id: UUID,
    plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.instance_service import InstanceService

    try:
        InstanceService(db).assign_plan(instance_id, plan_id)
        db.commit()
        return {"instance_id": str(instance_id), "plan_id": str(plan_id)}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ──────────────────────────── Secret Rotation ────────────────────


@router.post("/{instance_id}/secrets/rotate", status_code=status.HTTP_202_ACCEPTED)
def rotate_secret(
    instance_id: UUID,
    secret_name: str,
    confirm_destructive: bool = False,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.tasks.secrets import rotate_secret_task

    task = rotate_secret_task.delay(
        str(instance_id),
        secret_name,
        rotated_by=auth.get("person_id"),
        confirm_destructive=confirm_destructive,
    )
    return {"task_id": task.id, "instance_id": str(instance_id), "secret_name": secret_name}


@router.post("/{instance_id}/secrets/rotate-all", status_code=status.HTTP_202_ACCEPTED)
def rotate_all_secrets(
    instance_id: UUID,
    confirm_destructive: bool = False,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.tasks.secrets import rotate_all_secrets_task

    task = rotate_all_secrets_task.delay(
        str(instance_id),
        rotated_by=auth.get("person_id"),
        confirm_destructive=confirm_destructive,
    )
    return {"task_id": task.id, "instance_id": str(instance_id)}


@router.get("/{instance_id}/secrets/history")
def secret_rotation_history(
    instance_id: UUID,
    limit: int = Query(25, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.secret_rotation_service import SecretRotationService

    logs = SecretRotationService(db).get_rotation_history(instance_id, limit=limit, offset=offset)
    return [SecretRotationService.serialize_log(log) for log in logs]


# ──────────────────────────── Backups ────────────────────────────


@router.get("/{instance_id}/backups")
def list_backups(
    instance_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.backup_service import BackupService

    svc = BackupService(db)
    backups = svc.list_for_instance(instance_id)
    return [svc.serialize_backup(b) for b in paginate_list(backups, limit, offset)]


@router.post("/{instance_id}/backups", status_code=status.HTTP_201_CREATED)
def create_backup(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.backup_service import BackupService

    svc = BackupService(db)
    try:
        backup = svc.create_backup(instance_id)
        db.commit()
        return svc.serialize_backup(backup, include_file_path=True)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{instance_id}/backups/{backup_id}/restore", status_code=status.HTTP_202_ACCEPTED)
def restore_backup(
    instance_id: UUID,
    backup_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.backup_service import BackupService

    svc = BackupService(db)
    try:
        result = svc.restore_backup(instance_id, backup_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{instance_id}/backups/{backup_id}")
def delete_backup(
    instance_id: UUID,
    backup_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.backup_service import BackupService

    svc = BackupService(db)
    try:
        svc.delete_backup(instance_id, backup_id)
        db.commit()
        return {"deleted": str(backup_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────── Domains ────────────────────────────


@router.get("/{instance_id}/domains")
def list_domains(
    instance_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    domains = svc.list_for_instance(instance_id)
    return [svc.serialize_domain(d) for d in paginate_list(domains, limit, offset)]


@router.post("/{instance_id}/domains", status_code=status.HTTP_201_CREATED)
def add_domain(
    instance_id: UUID,
    domain: str,
    is_primary: bool = False,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        d = svc.add_domain(instance_id, domain, is_primary)
        db.commit()
        return svc.serialize_domain(d, include_token=True)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{instance_id}/domains/{domain_id}/verify")
def verify_domain(
    instance_id: UUID,
    domain_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        result = svc.verify_domain(instance_id, domain_id)
        db.commit()
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{instance_id}/domains/{domain_id}/ssl")
def provision_ssl(
    instance_id: UUID,
    domain_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        result = svc.provision_ssl(instance_id, domain_id)
        db.commit()
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{instance_id}/domains/{domain_id}")
def remove_domain(
    instance_id: UUID,
    domain_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        svc.remove_domain(instance_id, domain_id)
        db.commit()
        return {"deleted": str(domain_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────── Lifecycle ──────────────────────────


@router.post("/{instance_id}/trial", status_code=status.HTTP_200_OK)
def start_trial(
    instance_id: UUID,
    days: int = Query(default=14, ge=1, le=365),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.lifecycle_service import LifecycleService

    svc = LifecycleService(db)
    try:
        instance = svc.start_trial(instance_id, days)
        db.commit()
        trial_expires_at = instance.trial_expires_at.isoformat() if instance.trial_expires_at else None
        return {
            "status": instance.status.value,
            "trial_expires_at": trial_expires_at,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{instance_id}/suspend", status_code=status.HTTP_200_OK)
def suspend_instance(
    instance_id: UUID,
    reason: str | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.lifecycle_service import LifecycleService

    svc = LifecycleService(db)
    try:
        instance = svc.suspend_instance(instance_id, reason)
        db.commit()
        return {"status": instance.status.value}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{instance_id}/reactivate", status_code=status.HTTP_200_OK)
def reactivate_instance(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.lifecycle_service import LifecycleService

    svc = LifecycleService(db)
    try:
        instance = svc.reactivate_instance(instance_id)
        db.commit()
        return {"status": instance.status.value}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{instance_id}/archive", status_code=status.HTTP_200_OK)
def archive_instance(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.lifecycle_service import LifecycleService

    svc = LifecycleService(db)
    try:
        instance = svc.archive_instance(instance_id)
        db.commit()
        return {"status": instance.status.value}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────── Reconfigure ────────────────────────


@router.post("/{instance_id}/reconfigure", status_code=status.HTTP_202_ACCEPTED)
def reconfigure_instance(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    """Lightweight reconfigure: regenerate .env, transfer, restart."""
    from app.services.deploy_service import DeployService
    from app.tasks.deploy import deploy_instance

    svc = DeployService(db)
    try:
        deployment_id = svc.create_deployment(instance_id, deployment_type="reconfigure")
        db.commit()
        deploy_instance.delay(str(instance_id), deployment_id, deployment_type="reconfigure")
        return {"deployment_id": deployment_id, "type": "reconfigure"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────── Version Pinning ────────────────────


@router.put("/{instance_id}/version")
def set_version(
    instance_id: UUID,
    git_branch: str | None = None,
    git_tag: str | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.instance_service import InstanceService

    try:
        instance = InstanceService(db).set_git_refs(
            instance_id,
            git_branch=git_branch,
            git_tag=git_tag,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    db.commit()
    return {
        "git_branch": instance.git_branch,
        "git_tag": instance.git_tag,
        "deployed_git_ref": instance.deployed_git_ref,
    }


# ──────────────────────────── Batch Deploy ───────────────────────


@router.post("/batch-deploy", status_code=status.HTTP_202_ACCEPTED)
def create_batch_deploy(
    instance_ids: list[str],
    strategy: str = "rolling",
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.batch_deploy_service import BatchDeployService
    from app.tasks.deploy import run_batch_deploy

    svc = BatchDeployService(db)
    try:
        batch = svc.create_batch_validated(instance_ids, strategy=strategy)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    db.commit()
    run_batch_deploy.delay(str(batch.batch_id))
    return {
        "batch_id": str(batch.batch_id),
        "total_instances": batch.total_instances,
        "strategy": batch.strategy.value,
    }


@router.get("/batch-deploys")
def list_batch_deploys(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.batch_deploy_service import BatchDeployService

    svc = BatchDeployService(db)
    batches = svc.list_batches(limit=limit, offset=offset)
    return [svc.serialize_batch(b) for b in batches]


# ──────────────────────────── Resource Stats ─────────────────────


@router.get("/resource-stats")
def get_resource_stats(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.health_service import HealthService

    svc = HealthService(db)
    consumers = svc.get_top_resource_consumers()
    consumers = paginate_list(consumers, limit, offset)
    return [svc.serialize_consumer(c) for c in consumers]


# ──────────────────────────── Webhooks ───────────────────────────


@router.get("/webhooks")
def list_webhooks(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.webhook_service import WebhookService

    svc = WebhookService(db)
    endpoints = svc.list_endpoints()
    return [svc.serialize_endpoint(e) for e in paginate_list(endpoints, limit, offset)]


@router.post("/webhooks", status_code=status.HTTP_201_CREATED)
def create_webhook(
    url: str,
    events: list[str] = Query(default=[]),
    secret: str | None = None,
    description: str | None = None,
    instance_id: UUID | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.webhook_service import WebhookService

    svc = WebhookService(db)
    ep = svc.create_endpoint(url, events, secret, description, instance_id)
    db.commit()
    return svc.serialize_endpoint(ep)


@router.delete("/webhooks/{endpoint_id}")
def delete_webhook(
    endpoint_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.webhook_service import WebhookService

    svc = WebhookService(db)
    svc.delete_endpoint(endpoint_id)
    db.commit()
    return {"deleted": str(endpoint_id)}


@router.get("/webhooks/{endpoint_id}/deliveries")
def list_webhook_deliveries(
    endpoint_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.webhook_service import WebhookService

    svc = WebhookService(db)
    deliveries = svc.get_deliveries(endpoint_id, limit=limit, offset=offset)
    return [svc.serialize_delivery(d) for d in deliveries]


# ──────────────────────────── Tenant Audit ───────────────────────


@router.get("/{instance_id}/audit-log")
def get_tenant_audit_log(
    instance_id: UUID,
    action: str | None = None,
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.tenant_audit_service import TenantAuditService

    svc = TenantAuditService(db)
    logs = svc.get_logs(instance_id, action=action, limit=limit, offset=offset)
    return [svc.serialize_log(entry) for entry in logs]


# ──────────────────────────── Instance Cloning ───────────────────


@router.post("/{instance_id}/clone", status_code=status.HTTP_202_ACCEPTED)
def clone_instance(
    instance_id: UUID,
    new_org_code: str,
    new_org_name: str | None = None,
    include_data: bool = True,
    target_server_id: UUID | None = None,
    admin_password: str | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.clone_service import CloneService
    from app.tasks.clone import run_clone_instance

    svc = CloneService(db)
    try:
        clone = svc.clone_instance(
            instance_id,
            new_org_code,
            new_org_name,
            include_data=include_data,
            target_server_id=target_server_id,
            admin_password=admin_password,
        )
        db.commit()
        run_clone_instance.delay(str(clone.clone_id))
        return {
            "clone_id": str(clone.clone_id),
            "source_instance_id": str(clone.source_instance_id),
            "status": clone.status.value,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{instance_id}/clones/{clone_id}")
def get_clone_status(
    instance_id: UUID,
    clone_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.clone_service import CloneService

    op = CloneService(db).get_clone_operation(clone_id)
    if not op or op.source_instance_id != instance_id:
        raise HTTPException(status_code=404, detail="Clone operation not found")
    return CloneService.serialize_operation(op)


# ──────────────────────────── Maintenance Windows ────────────────


@router.get("/{instance_id}/maintenance-windows")
def list_maintenance_windows(
    instance_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.maintenance_service import MaintenanceService

    svc = MaintenanceService(db)
    windows = svc.get_windows(instance_id)
    return [svc.serialize_window(w) for w in paginate_list(windows, limit, offset)]


@router.post("/{instance_id}/maintenance-windows", status_code=status.HTTP_201_CREATED)
def set_maintenance_window(
    instance_id: UUID,
    day_of_week: int = Query(..., ge=0, le=6),
    start_hour: int = Query(..., ge=0, le=23),
    start_minute: int = Query(0, ge=0, le=59),
    end_hour: int = Query(6, ge=0, le=23),
    end_minute: int = Query(0, ge=0, le=59),
    tz: str = "UTC",
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from datetime import time

    from app.services.maintenance_service import MaintenanceService

    svc = MaintenanceService(db)
    try:
        window = svc.set_window(
            instance_id,
            day_of_week,
            time(start_hour, start_minute),
            time(end_hour, end_minute),
            tz,
        )
        db.commit()
        return {"window_id": str(window.window_id), "day_of_week": window.day_of_week}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{instance_id}/maintenance-windows/{window_id}")
def delete_maintenance_window(
    instance_id: UUID,
    window_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.maintenance_service import MaintenanceService

    svc = MaintenanceService(db)
    svc.delete_window(instance_id, window_id)
    db.commit()
    return {"deleted": str(window_id)}


# ──────────────────────────── Usage Metering ─────────────────────


@router.get("/{instance_id}/usage")
def get_instance_usage(
    instance_id: UUID,
    metric: str | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.models.usage_record import UsageMetric
    from app.services.usage_service import UsageService

    svc = UsageService(db)
    try:
        m = UsageMetric(metric) if metric else None
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid usage metric: {metric!r}")
    records = svc.get_usage(instance_id, metric=m)
    return [svc.serialize_record(r) for r in paginate_list(records, limit, offset)]


@router.get("/{instance_id}/billing-summary")
def get_billing_summary(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from datetime import datetime

    from app.services.usage_service import UsageService

    svc = UsageService(db)
    now = datetime.now(UTC)
    period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return svc.get_billing_summary(instance_id, period_start, now)


# ──────────────────────────── Compliance ─────────────────────────


@router.get("/{instance_id}/compliance")
def get_plan_compliance(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.resource_enforcement import ResourceEnforcementService

    svc = ResourceEnforcementService(db)
    violations = svc.check_plan_compliance(instance_id)
    return [svc.serialize_violation(v) for v in violations]


@router.get("/{instance_id}/usage-summary")
def get_usage_summary(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.resource_enforcement import ResourceEnforcementService

    try:
        return ResourceEnforcementService(db).get_usage_summary(instance_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ──────────────────────────── Tags ───────────────────────────────


@router.get("/{instance_id}/tags")
def list_tags(
    instance_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.tag_service import TagService

    svc = TagService(db)
    tags = svc.get_tags(instance_id)
    return [svc.serialize_tag(t) for t in paginate_list(tags, limit, offset)]


@router.put("/{instance_id}/tags/{key}")
def set_tag(
    instance_id: UUID,
    key: str,
    value: str,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.tag_service import TagService

    svc = TagService(db)
    try:
        tag = svc.set_tag(instance_id, key, value)
        db.commit()
        return {"key": tag.key, "value": tag.value}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{instance_id}/tags/{key}")
def delete_tag(
    instance_id: UUID,
    key: str,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.tag_service import TagService

    svc = TagService(db)
    svc.delete_tag(instance_id, key)
    db.commit()
    return {"deleted": key}


# ──────────────────────────── Deploy Approvals ───────────────────


@router.get("/approvals")
def list_pending_approvals(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.approval_service import ApprovalService

    svc = ApprovalService(db)
    approvals = svc.get_pending()
    return [svc.serialize_approval(a) for a in paginate_list(approvals, limit, offset)]


@router.post("/{instance_id}/approvals", status_code=status.HTTP_201_CREATED)
def request_deploy_approval(
    instance_id: UUID,
    deployment_type: str = "full",
    git_ref: str | None = None,
    reason: str | None = None,
    upgrade_id: UUID | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.approval_service import ApprovalService

    svc = ApprovalService(db)
    try:
        approval = svc.request_approval(
            instance_id,
            requested_by=str(auth.get("person_id", "")) if isinstance(auth, dict) else "unknown",
            deployment_type=deployment_type,
            git_ref=git_ref,
            reason=reason,
            upgrade_id=upgrade_id,
        )
        db.commit()
        return {"approval_id": str(approval.approval_id), "status": approval.status.value}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/approvals/{approval_id}/approve", status_code=status.HTTP_200_OK)
def approve_deploy(
    approval_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.approval_service import ApprovalService

    svc = ApprovalService(db)
    try:
        approval = svc.approve_and_dispatch(
            approval_id,
            approved_by=str(auth.get("person_id", "")) if isinstance(auth, dict) else "unknown",
        )
        db.commit()
        svc.dispatch_upgrade()
        return {"approval_id": str(approval.approval_id), "status": approval.status.value}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/approvals/{approval_id}/reject", status_code=status.HTTP_200_OK)
def reject_deploy(
    approval_id: UUID,
    reason: str | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.approval_service import ApprovalService

    svc = ApprovalService(db)
    try:
        approval = svc.reject(
            approval_id,
            rejected_by=str(auth.get("person_id", "")) if isinstance(auth, dict) else "unknown",
            reason=reason,
        )
        db.commit()
        return {"approval_id": str(approval.approval_id), "status": approval.status.value}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────── Config Drift ───────────────────────


@router.get("/{instance_id}/drift")
def get_drift_report(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.drift_service import DriftService

    svc = DriftService(db)
    report = svc.get_latest_report(instance_id)
    if not report:
        return {"has_drift": None, "message": "No drift report yet"}
    return svc.serialize_report(report)


@router.post("/{instance_id}/drift/detect", status_code=status.HTTP_200_OK)
def detect_drift(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.drift_service import DriftService

    svc = DriftService(db)
    try:
        report = svc.detect_drift(instance_id)
        db.commit()
        return svc.serialize_report(report)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────── DR Status ─────────────────────────


@router.get("/{instance_id}/dr-status")
def get_dr_status(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.dr_service import DisasterRecoveryService

    return DisasterRecoveryService(db).get_dr_status(instance_id)


# ──────────────────────────── Upgrades ───────────────────────────


@router.get("/{instance_id}/upgrades")
def list_upgrades(
    instance_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.upgrade_service import UpgradeService

    svc = UpgradeService(db)
    upgrades = svc.list_upgrades(instance_id, limit=limit, offset=offset)
    return [svc.serialize_upgrade(u) for u in upgrades]


@router.post("/{instance_id}/upgrades", status_code=status.HTTP_202_ACCEPTED)
def create_upgrade(
    instance_id: UUID,
    catalog_item_id: UUID,
    scheduled_for: str | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.upgrade_service import UpgradeService

    svc = UpgradeService(db)
    try:
        result = svc.create_and_dispatch(
            instance_id,
            catalog_item_id,
            scheduled_for=scheduled_for,
            requested_by=str(auth.get("person_id", "")) if isinstance(auth, dict) else None,
        )
        db.commit()
        svc.dispatch_pending()
        return result
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{instance_id}/upgrades/{upgrade_id}/cancel", status_code=status.HTTP_200_OK)
def cancel_upgrade(
    instance_id: UUID,
    upgrade_id: UUID,
    reason: str | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.upgrade_service import UpgradeService

    try:
        upgrade = UpgradeService(db).cancel_for_instance(
            instance_id,
            upgrade_id,
            reason=reason,
            cancelled_by=str(auth.get("person_id", "")),
            cancelled_by_name=str(auth.get("user_name", "")) if isinstance(auth, dict) else None,
        )
        db.commit()
        return {"upgrade_id": str(upgrade.upgrade_id), "status": upgrade.status.value}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────── Alerts ─────────────────────────────


@router.get("/alerts/rules")
def list_alert_rules(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.alert_service import AlertService

    svc = AlertService(db)
    rules = svc.list_rules()
    return [svc.serialize_rule(r) for r in paginate_list(rules, limit, offset)]


@router.post("/alerts/rules", status_code=status.HTTP_201_CREATED)
def create_alert_rule(
    name: str,
    metric: str,
    operator: str,
    threshold: float,
    channel: str = "webhook",
    instance_id: UUID | None = None,
    cooldown_minutes: int = 15,
    channel_config: str | None = None,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    import json as _json

    from app.models.alert_rule import AlertChannel, AlertMetric, AlertOperator
    from app.services.alert_service import AlertService

    parsed_config: dict | None = None
    if channel_config:
        try:
            parsed_config = _json.loads(channel_config)
        except (ValueError, TypeError):
            pass

    svc = AlertService(db)
    rule = svc.create_rule(
        name,
        AlertMetric(metric),
        AlertOperator(operator),
        threshold,
        AlertChannel(channel),
        channel_config=parsed_config,
        instance_id=instance_id,
        cooldown_minutes=cooldown_minutes,
    )
    db.commit()
    return {"rule_id": str(rule.rule_id), "name": rule.name}


@router.delete("/alerts/rules/{rule_id}")
def delete_alert_rule(
    rule_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.alert_service import AlertService

    svc = AlertService(db)
    svc.delete_rule(rule_id)
    db.commit()
    return {"deleted": str(rule_id)}


@router.get("/alerts/events")
def list_alert_events(
    instance_id: UUID | None = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.alert_service import AlertService

    svc = AlertService(db)
    events = svc.get_events(instance_id=instance_id, limit=limit, offset=offset)
    return [svc.serialize_event(e) for e in events]


# ──────────────────────────── Tenant Self-Service ────────────────


@router.get("/{instance_id}/self-service/health")
def tenant_health(
    instance_id: UUID,
    limit: int = Query(default=10, ge=1, le=200),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    """Tenant self-service: view instance health (read-only)."""
    from app.services.health_service import HealthService

    svc = HealthService(db)
    checks = svc.get_recent_checks(instance_id, limit=limit)
    return [svc.serialize_check(c) for c in checks]


@router.get("/{instance_id}/self-service/flags")
def tenant_flags(
    instance_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    """Tenant self-service: view feature flags (read-only)."""
    from app.services.feature_flag_service import FeatureFlagService

    svc = FeatureFlagService(db)
    flags = svc.list_for_instance(instance_id)
    return [svc.serialize_flag_entry(f) for f in paginate_list(flags, limit, offset)]


@router.get("/{instance_id}/self-service/backups")
def tenant_backups(
    instance_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    """Tenant self-service: view backups (read-only)."""
    from app.services.backup_service import BackupService

    svc = BackupService(db)
    backups = svc.list_for_instance(instance_id)
    return [svc.serialize_backup(b) for b in paginate_list(backups, limit, offset)]
