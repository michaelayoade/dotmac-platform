"""
Instance API — Modules, feature flags, plans, backups, domains, lifecycle, and batch deploys.
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role, require_user_auth

router = APIRouter(prefix="/instances", tags=["instances"])


# ──────────────────────────── Modules ────────────────────────────


@router.get("/{instance_id}/modules")
def list_instance_modules(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.module_service import ModuleService
    svc = ModuleService(db)
    return svc.get_instance_modules(instance_id)


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
        for m in modules
    ]


# ──────────────────────────── Feature Flags ──────────────────────


@router.get("/{instance_id}/flags")
def list_instance_flags(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.feature_flag_service import FeatureFlagService
    svc = FeatureFlagService(db)
    return svc.list_for_instance(instance_id)


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
        for p in plans
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
        for b in backups
    ]


@router.post("/{instance_id}/backups")
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


@router.post("/{instance_id}/backups/{backup_id}/restore")
def restore_backup(
    instance_id: UUID,
    backup_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.backup_service import BackupService
    svc = BackupService(db)
    try:
        result = svc.restore_backup(backup_id)
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
        svc.delete_backup(backup_id)
        db.commit()
        return {"deleted": str(backup_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────── Domains ────────────────────────────


@router.get("/{instance_id}/domains")
def list_domains(
    instance_id: UUID,
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
        for d in domains
    ]


@router.post("/{instance_id}/domains")
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
        result = svc.verify_domain(domain_id)
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
        result = svc.provision_ssl(domain_id)
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
        svc.remove_domain(domain_id)
        db.commit()
        return {"deleted": str(domain_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ──────────────────────────── Lifecycle ──────────────────────────


@router.post("/{instance_id}/trial")
def start_trial(
    instance_id: UUID,
    days: int = 14,
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


@router.post("/{instance_id}/suspend")
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


@router.post("/{instance_id}/reactivate")
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


@router.post("/{instance_id}/archive")
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


@router.post("/{instance_id}/reconfigure")
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
        deployment_id = svc.create_deployment(
            instance_id, deployment_type="reconfigure"
        )
        db.commit()
        deploy_instance.delay(
            str(instance_id), deployment_id, deployment_type="reconfigure"
        )
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
        instance.git_branch = git_branch
    if git_tag is not None:
        instance.git_tag = git_tag
    db.commit()
    return {
        "git_branch": instance.git_branch,
        "git_tag": instance.git_tag,
        "deployed_git_ref": instance.deployed_git_ref,
    }


# ──────────────────────────── Batch Deploy ───────────────────────


@router.post("/batch-deploy")
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
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.batch_deploy_service import BatchDeployService
    svc = BatchDeployService(db)
    batches = svc.list_batches()
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
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    from app.services.health_service import HealthService
    svc = HealthService(db)
    consumers = svc.get_top_resource_consumers()
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
