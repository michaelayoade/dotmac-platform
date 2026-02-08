"""
Instance API — Modules, feature flags, plans, backups, domains, lifecycle, and batch deploys.
"""

from __future__ import annotations

import re
from datetime import UTC
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role, require_user_auth

router = APIRouter(prefix="/instances", tags=["instances"])

_GIT_REF_RE = re.compile(r"^[A-Za-z0-9._/-]{1,120}$")


def _validate_git_ref(value: str, label: str) -> str:
    if not _GIT_REF_RE.match(value) or ".." in value or value.startswith("-"):
        raise HTTPException(status_code=400, detail=f"Invalid {label}")
    return value


def _paginate_list(items: list, limit: int, offset: int) -> list:
    return items[offset : offset + limit]


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
    return _paginate_list(modules, limit, offset)


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
    return [
        {
            "module_id": str(m.module_id),
            "name": m.name,
            "slug": m.slug,
            "description": m.description,
            "schemas": m.schemas,
            "dependencies": m.dependencies,
            "is_core": m.is_core,
        }
        for m in _paginate_list(modules, limit, offset)
    ]


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
    return _paginate_list(flags, limit, offset)


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
    return [
        {
            "plan_id": str(p.plan_id),
            "name": p.name,
            "description": p.description,
            "max_users": p.max_users,
            "max_storage_gb": p.max_storage_gb,
            "allowed_modules": p.allowed_modules,
            "allowed_flags": p.allowed_flags,
        }
        for p in _paginate_list(plans, limit, offset)
    ]


@router.put("/{instance_id}/plan")
def assign_plan(
    instance_id: UUID,
    plan_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.models.instance import Instance

    instance = db.get(Instance, instance_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
    instance.plan_id = plan_id
    db.commit()
    return {"instance_id": str(instance_id), "plan_id": str(plan_id)}


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
    return [
        {
            "backup_id": str(b.backup_id),
            "backup_type": b.backup_type.value,
            "status": b.status.value,
            "file_path": b.file_path,
            "size_bytes": b.size_bytes,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        }
        for b in _paginate_list(backups, limit, offset)
    ]


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
        return {
            "backup_id": str(backup.backup_id),
            "status": backup.status.value,
            "file_path": backup.file_path,
        }
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
    return [
        {
            "domain_id": str(d.domain_id),
            "domain": d.domain,
            "is_primary": d.is_primary,
            "status": d.status.value,
            "verification_token": d.verification_token,
            "ssl_expires_at": d.ssl_expires_at.isoformat() if d.ssl_expires_at else None,
        }
        for d in _paginate_list(domains, limit, offset)
    ]


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
        return {
            "domain_id": str(d.domain_id),
            "domain": d.domain,
            "verification_token": d.verification_token,
            "status": d.status.value,
        }
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
        return {
            "status": instance.status.value,
            "trial_expires_at": instance.trial_expires_at.isoformat(),
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
    from app.models.instance import Instance

    instance = db.get(Instance, instance_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
    if git_branch is not None:
        instance.git_branch = _validate_git_ref(git_branch, "git_branch")
    if git_tag is not None:
        instance.git_tag = _validate_git_ref(git_tag, "git_tag")
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
    batch = svc.create_batch(instance_ids, strategy=strategy)
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
    return [
        {
            "batch_id": str(b.batch_id),
            "strategy": b.strategy.value,
            "status": b.status.value,
            "total_instances": b.total_instances,
            "completed_count": b.completed_count,
            "failed_count": b.failed_count,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        }
        for b in batches
    ]


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
    consumers = _paginate_list(consumers, limit, offset)
    return [
        {
            "org_code": c["instance"].org_code,
            "instance_id": str(c["instance"].instance_id),
            "cpu_percent": c["cpu_percent"],
            "memory_mb": c["memory_mb"],
            "db_size_mb": c["db_size_mb"],
            "active_connections": c["active_connections"],
        }
        for c in consumers
    ]


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
    return [
        {
            "endpoint_id": str(e.endpoint_id),
            "url": e.url,
            "events": e.events,
            "description": e.description,
            "instance_id": str(e.instance_id) if e.instance_id else None,
            "is_active": e.is_active,
        }
        for e in _paginate_list(endpoints, limit, offset)
    ]


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
    return {"endpoint_id": str(ep.endpoint_id), "url": ep.url}


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
    return [
        {
            "delivery_id": str(d.delivery_id),
            "event": d.event,
            "status": d.status.value,
            "response_code": d.response_code,
            "attempts": d.attempts,
            "created_at": d.created_at.isoformat() if d.created_at else None,
        }
        for d in deliveries
    ]


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
    return [
        {
            "id": l.id,
            "action": l.action,
            "user_name": l.user_name,
            "details": l.details,
            "created_at": l.created_at.isoformat() if l.created_at else None,
        }
        for l in logs
    ]


# ──────────────────────────── Instance Cloning ───────────────────


@router.post("/{instance_id}/clone", status_code=status.HTTP_201_CREATED)
def clone_instance(
    instance_id: UUID,
    new_org_code: str,
    new_org_name: str | None = None,
    include_data: bool = True,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.clone_service import CloneService

    svc = CloneService(db)
    try:
        clone = svc.clone_instance(instance_id, new_org_code, new_org_name, include_data=include_data)
        db.commit()
        return {
            "instance_id": str(clone.instance_id),
            "org_code": clone.org_code,
            "status": clone.status.value,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


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
    return [
        {
            "window_id": str(w.window_id),
            "day_of_week": w.day_of_week,
            "start_time": w.start_time.isoformat(),
            "end_time": w.end_time.isoformat(),
            "timezone": w.timezone,
        }
        for w in _paginate_list(windows, limit, offset)
    ]


@router.post("/{instance_id}/maintenance-windows", status_code=status.HTTP_201_CREATED)
def set_maintenance_window(
    instance_id: UUID,
    day_of_week: int,
    start_hour: int,
    start_minute: int = 0,
    end_hour: int = 6,
    end_minute: int = 0,
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
    m = UsageMetric(metric) if metric else None
    records = svc.get_usage(instance_id, metric=m)
    return [
        {
            "metric": r.metric.value,
            "value": r.value,
            "period_start": r.period_start.isoformat(),
            "period_end": r.period_end.isoformat(),
        }
        for r in _paginate_list(records, limit, offset)
    ]


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
    return [
        {
            "key": t.key,
            "value": t.value,
        }
        for t in _paginate_list(tags, limit, offset)
    ]


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
    return [
        {
            "approval_id": str(a.approval_id),
            "instance_id": str(a.instance_id),
            "requested_by_name": a.requested_by_name,
            "deployment_type": a.deployment_type,
            "git_ref": a.git_ref,
            "reason": a.reason,
            "status": a.status.value,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in _paginate_list(approvals, limit, offset)
    ]


@router.post("/{instance_id}/approvals", status_code=status.HTTP_201_CREATED)
def request_deploy_approval(
    instance_id: UUID,
    deployment_type: str = "full",
    git_ref: str | None = None,
    reason: str | None = None,
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
        approval = svc.approve(
            approval_id,
            approved_by=str(auth.get("person_id", "")) if isinstance(auth, dict) else "unknown",
        )
        db.commit()
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
    return {
        "has_drift": report.has_drift,
        "diffs": report.diffs,
        "detected_at": report.detected_at.isoformat() if report.detected_at else None,
    }


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
        return {
            "has_drift": report.has_drift,
            "diffs": report.diffs,
            "detected_at": report.detected_at.isoformat() if report.detected_at else None,
        }
    except ValueError as e:
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
    return [
        {
            "rule_id": str(r.rule_id),
            "name": r.name,
            "metric": r.metric.value,
            "operator": r.operator.value,
            "threshold": r.threshold,
            "channel": r.channel.value,
            "instance_id": str(r.instance_id) if r.instance_id else None,
            "is_active": r.is_active,
            "cooldown_minutes": r.cooldown_minutes,
        }
        for r in _paginate_list(rules, limit, offset)
    ]


@router.post("/alerts/rules", status_code=status.HTTP_201_CREATED)
def create_alert_rule(
    name: str,
    metric: str,
    operator: str,
    threshold: float,
    channel: str = "webhook",
    instance_id: UUID | None = None,
    cooldown_minutes: int = 15,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.models.alert_rule import AlertChannel, AlertMetric, AlertOperator
    from app.services.alert_service import AlertService

    svc = AlertService(db)
    rule = svc.create_rule(
        name,
        AlertMetric(metric),
        AlertOperator(operator),
        threshold,
        AlertChannel(channel),
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
    return [
        {
            "event_id": str(e.event_id),
            "rule_id": str(e.rule_id),
            "instance_id": str(e.instance_id) if e.instance_id else None,
            "metric_value": e.metric_value,
            "threshold": e.threshold,
            "triggered_at": e.triggered_at.isoformat() if e.triggered_at else None,
            "resolved_at": e.resolved_at.isoformat() if e.resolved_at else None,
            "notified": e.notified,
        }
        for e in events
    ]


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
    return [
        {
            "status": c.status.value,
            "response_ms": c.response_ms,
            "db_healthy": c.db_healthy,
            "redis_healthy": c.redis_healthy,
            "checked_at": c.checked_at.isoformat() if c.checked_at else None,
        }
        for c in checks
    ]


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
    return _paginate_list(flags, limit, offset)


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
    return [
        {
            "backup_id": str(b.backup_id),
            "backup_type": b.backup_type.value,
            "status": b.status.value,
            "size_bytes": b.size_bytes,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        }
        for b in _paginate_list(backups, limit, offset)
    ]
