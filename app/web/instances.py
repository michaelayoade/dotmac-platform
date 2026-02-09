"""
Instance Management — Web routes for ERP instance CRUD, deployment, and operations.
"""

import logging
from typing import TypedDict
from uuid import UUID

logger = logging.getLogger(__name__)

from datetime import UTC

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.models.health_check import HealthCheck
from app.models.instance import Instance
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/instances")


@router.get("", response_class=HTMLResponse)
def instance_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    from sqlalchemy import select

    from app.models.catalog import AppCatalogItem, AppRelease
    from app.services.health_service import HealthService
    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    health_svc = HealthService(db)
    instances = svc.list_all()

    # Batch-fetch latest health checks to avoid N+1
    instance_ids = [inst.instance_id for inst in instances]
    health_map = health_svc.get_latest_checks_batch(instance_ids)
    from datetime import datetime

    now = datetime.now(UTC)

    class _InstanceRow(TypedDict):
        instance: Instance
        health: HealthCheck | None
        health_state: str
        health_checked_at: datetime | None
        catalog_label: str | None
        release_version: str | None

    catalog_ids = {inst.catalog_item_id for inst in instances if inst.catalog_item_id}
    item_map: dict[UUID, AppCatalogItem] = {}
    release_map: dict[UUID, AppRelease] = {}
    if catalog_ids:
        items = list(db.scalars(select(AppCatalogItem).where(AppCatalogItem.catalog_id.in_(catalog_ids))).all())
        item_map = {item.catalog_id: item for item in items}
        release_ids = {item.release_id for item in items}
        if release_ids:
            releases = list(db.scalars(select(AppRelease).where(AppRelease.release_id.in_(release_ids))).all())
            release_map = {rel.release_id: rel for rel in releases}

    instance_data: list[_InstanceRow] = []
    for inst in instances:
        check = health_map.get(inst.instance_id)
        health_state = health_svc.classify_health(check, now) if inst.status.value == "running" else "n/a"
        catalog_item = item_map.get(inst.catalog_item_id) if inst.catalog_item_id else None
        release = release_map.get(catalog_item.release_id) if catalog_item else None
        instance_data.append(
            {
                "instance": inst,
                "health": check,
                "health_state": health_state,
                "health_checked_at": check.checked_at if check else None,
                "catalog_label": catalog_item.label if catalog_item else None,
                "release_version": release.version if release else None,
            }
        )

    # Filters
    params = request.query_params
    q = (params.get("q") or "").strip().lower()
    status_filter = (params.get("status") or "").strip().lower()
    health_filter = (params.get("health") or "").strip().lower()
    view = (params.get("view") or "table").strip().lower()
    sort_key = (params.get("sort") or "org_code").strip().lower()
    sort_dir = (params.get("dir") or "asc").strip().lower()

    if q:
        instance_data = [
            item
            for item in instance_data
            if q in item["instance"].org_code.lower() or q in item["instance"].org_name.lower()
        ]
    if status_filter:
        instance_data = [item for item in instance_data if item["instance"].status.value.lower() == status_filter]
    if health_filter:
        instance_data = [item for item in instance_data if item["health_state"] == health_filter]

    # Sorting
    health_rank = {"healthy": 0, "unhealthy": 1, "unknown": 2, "n/a": 3}

    def _sort_value(item: _InstanceRow):
        inst = item["instance"]
        if sort_key == "status":
            return inst.status.value
        if sort_key == "health":
            return health_rank.get(item["health_state"], 99)
        if sort_key == "last_check":
            return item["health_checked_at"] or datetime.min.replace(tzinfo=UTC)
        if sort_key == "port":
            return inst.app_port or 0
        return inst.org_code

    reverse = sort_dir == "desc"
    instance_data.sort(key=_sort_value, reverse=reverse)

    # Pagination
    try:
        page = max(int(params.get("page") or 1), 1)
    except ValueError:
        page = 1
    try:
        page_size = min(max(int(params.get("page_size") or 25), 10), 100)
    except ValueError:
        page_size = 25

    total = len(instance_data)
    start = (page - 1) * page_size
    end = start + page_size
    paginated = instance_data[start:end]

    return templates.TemplateResponse(
        "instances/list.html",
        ctx(
            request,
            auth,
            "Instances",
            active_page="instances",
            instances=paginated,
            total=total,
            page=page,
            page_size=page_size,
            q=q,
            status_filter=status_filter,
            health_filter=health_filter,
            view=view if view in {"table", "cards"} else "table",
            sort=sort_key,
            sort_dir=sort_dir if sort_dir in {"asc", "desc"} else "asc",
        ),
    )


@router.get("/new", response_class=HTMLResponse)
def instance_form(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.catalog_service import CatalogService
    from app.services.git_repo_service import GitRepoService
    from app.services.server_service import ServerService

    servers = ServerService(db).list_all()
    repos = GitRepoService(db).list_repos(active_only=True)
    catalog_items = CatalogService(db).list_catalog_items(active_only=True)
    return templates.TemplateResponse(
        "instances/form.html",
        ctx(
            request,
            auth,
            "New Instance",
            active_page="instances",
            servers=servers,
            repos=repos,
            catalog_items=catalog_items,
            errors=None,
        ),
    )


@router.post("/new", response_class=HTMLResponse)
def instance_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    server_id: str = Form(...),
    org_code: str = Form(...),
    org_name: str = Form(...),
    sector_type: str = Form("PRIVATE"),
    framework: str = Form("IFRS"),
    currency: str = Form("NGN"),
    admin_email: str = Form(""),
    admin_username: str = Form("admin"),
    domain: str = Form(""),
    catalog_item_id: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.catalog_service import CatalogService
    from app.services.git_repo_service import GitRepoService
    from app.services.instance_service import InstanceService
    from app.services.server_service import ServerService

    svc = InstanceService(db)
    try:
        if not catalog_item_id:
            raise ValueError("Catalog item is required")
        catalog_id = UUID(catalog_item_id)
        catalog_item = CatalogService(db).get_catalog_item(catalog_id)
        if not catalog_item or not catalog_item.is_active:
            raise ValueError("Selected catalog item is invalid")
        release = catalog_item.release
        if not release or not release.is_active:
            raise ValueError("Catalog release is invalid")
        git_repo_id = str(release.git_repo_id)
        repo = GitRepoService(db).get_by_id(UUID(git_repo_id))
        if not repo or not repo.is_active:
            raise ValueError("Catalog release repo is invalid")
        instance = svc.create(
            server_id=UUID(server_id),
            org_code=org_code,
            org_name=org_name,
            sector_type=sector_type,
            framework=framework,
            currency=currency,
            admin_email=admin_email or None,
            admin_username=admin_username or "admin",
            domain=domain or None,
            git_repo_id=UUID(git_repo_id),
            catalog_item_id=catalog_id,
        )
        db.commit()
        return RedirectResponse(f"/instances/{instance.instance_id}", status_code=302)
    except ValueError as e:
        db.rollback()
        servers = ServerService(db).list_all()
        repos = GitRepoService(db).list_repos(active_only=True)
        catalog_items = CatalogService(db).list_catalog_items(active_only=True)
        return templates.TemplateResponse(
            "instances/form.html",
            ctx(
                request,
                auth,
                "New Instance",
                active_page="instances",
                servers=servers,
                repos=repos,
                catalog_items=catalog_items,
                errors=[str(e)],
            ),
        )
    except Exception:
        db.rollback()
        logger.exception("Failed to create instance")
        servers = ServerService(db).list_all()
        repos = GitRepoService(db).list_repos(active_only=True)
        catalog_items = CatalogService(db).list_catalog_items(active_only=True)
        return templates.TemplateResponse(
            "instances/form.html",
            ctx(
                request,
                auth,
                "New Instance",
                active_page="instances",
                servers=servers,
                repos=repos,
                catalog_items=catalog_items,
                errors=["An unexpected error occurred. Please try again."],
            ),
        )


@router.get("/{instance_id}", response_class=HTMLResponse)
def instance_detail(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    from app.services.backup_service import BackupService
    from app.services.catalog_service import CatalogService
    from app.services.deploy_service import DeployService
    from app.services.domain_service import DomainService
    from app.services.feature_flag_service import FeatureFlagService
    from app.services.git_repo_service import GitRepoService
    from app.services.health_service import HealthService
    from app.services.instance_service import InstanceService
    from app.services.module_service import ModuleService
    from app.services.plan_service import PlanService
    from app.services.resource_enforcement import ResourceEnforcementService
    from app.services.secret_rotation_service import SecretRotationService
    from app.services.tenant_audit_service import TenantAuditService
    from app.services.upgrade_service import UpgradeService

    svc = InstanceService(db)
    instance = svc.get_or_404(instance_id)
    active_tab = (request.query_params.get("tab") or "modules").strip().lower()

    health_svc = HealthService(db)
    latest_health = health_svc.get_latest_check(instance_id)
    recent_checks = health_svc.get_recent_checks(instance_id, limit=10)

    deploy_svc = DeployService(db)
    latest_deploy_id = deploy_svc.get_latest_deployment_id(instance_id)
    deploy_logs = []
    if latest_deploy_id:
        deploy_logs = deploy_svc.get_deployment_logs(instance_id, latest_deploy_id)

    # New feature data
    modules = ModuleService(db).get_instance_modules(instance_id)
    flags = FeatureFlagService(db).list_for_instance(instance_id)
    plans = PlanService(db).list_all()
    backups = BackupService(db).list_for_instance(instance_id)
    domains = DomainService(db).list_for_instance(instance_id)
    audit_logs = TenantAuditService(db).get_logs(instance_id, limit=20)
    enforcement_svc = ResourceEnforcementService(db)
    usage_summary = enforcement_svc.get_usage_summary(instance_id)
    compliance_violations = enforcement_svc.check_plan_compliance(instance_id)
    rotation_history = SecretRotationService(db).get_rotation_history(instance_id, limit=20)
    repos = GitRepoService(db).list_repos(active_only=True)
    catalog_items = CatalogService(db).list_catalog_items(active_only=True)
    catalog_map = {item.catalog_id: item for item in catalog_items}
    upgrades = UpgradeService(db).list_upgrades(instance_id, limit=20)
    from app.services.approval_service import ApprovalService

    pending_upgrade_ids = {a.upgrade_id for a in ApprovalService(db).get_pending(instance_id) if a.upgrade_id}

    return templates.TemplateResponse(
        "instances/detail.html",
        ctx(
            request,
            auth,
            instance.org_code,
            active_page="instances",
            instance=instance,
            latest_health=latest_health,
            recent_checks=recent_checks,
            deploy_logs=deploy_logs,
            latest_deploy_id=latest_deploy_id,
            modules=modules,
            flags=flags,
            plans=plans,
            backups=backups,
            domains=domains,
            audit_logs=audit_logs,
            usage_summary=usage_summary,
            compliance_violations=compliance_violations,
            rotation_history=rotation_history,
            active_tab=active_tab,
            repos=repos,
            catalog_items=catalog_items,
            catalog_map=catalog_map,
            upgrades=upgrades,
            pending_upgrade_ids=pending_upgrade_ids,
        ),
    )


@router.post("/{instance_id}/deploy", response_class=HTMLResponse)
def instance_deploy(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    admin_password: str = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.deploy_service import DeployService
    from app.tasks.deploy import deploy_instance

    deploy_svc = DeployService(db)
    deployment_id = deploy_svc.create_deployment(
        instance_id,
        admin_password,
        git_ref=request.query_params.get("git_ref"),
    )
    db.commit()

    # Kick off async deployment via Celery (password stored in DB, not task args)
    deploy_instance.delay(
        str(instance_id),
        deployment_id,
        git_ref=request.query_params.get("git_ref"),
    )

    return RedirectResponse(
        f"/instances/{instance_id}/deploy-log?deployment_id={deployment_id}",
        status_code=302,
    )


@router.post("/{instance_id}/git-repo")
def instance_set_git_repo(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    git_repo_id: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.git_repo_service import GitRepoService
    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    instance = svc.get_or_404(instance_id)
    try:
        if not git_repo_id:
            raise ValueError("Git repository is required")
        repo = GitRepoService(db).get_by_id(UUID(git_repo_id))
        if not repo or not repo.is_active:
            raise ValueError("Selected git repository is invalid")
        instance.git_repo_id = repo.repo_id
        db.commit()
    except ValueError:
        db.rollback()
    return RedirectResponse(f"/instances/{instance_id}", status_code=302)


@router.post("/{instance_id}/upgrades")
def instance_create_upgrade(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    catalog_item_id: str = Form(""),
    scheduled_for: str | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from datetime import UTC as _UTC
    from datetime import datetime

    from app.services.upgrade_service import UpgradeService
    from app.tasks.upgrade import run_upgrade

    try:
        if not catalog_item_id:
            raise ValueError("Catalog item is required")
        scheduled_dt = None
        if scheduled_for:
            scheduled_dt = datetime.fromisoformat(scheduled_for)
            if scheduled_dt.tzinfo is None:
                scheduled_dt = scheduled_dt.replace(tzinfo=_UTC)

        upgrade = UpgradeService(db).create_upgrade(
            instance_id,
            UUID(catalog_item_id),
            scheduled_for=scheduled_dt,
            requested_by=auth.person_id,
        )
        from app.services.approval_service import ApprovalService
        from app.services.catalog_service import CatalogService

        approval_svc = ApprovalService(db)
        catalog_item = CatalogService(db).get_catalog_item(UUID(catalog_item_id))
        release = catalog_item.release if catalog_item else None
        if approval_svc.requires_approval(instance_id):
            reason = None
            if catalog_item:
                reason = f"Upgrade to {catalog_item.label}"
                if release and release.version:
                    reason = f"{reason} ({release.version})"
            approval_svc.request_approval(
                instance_id,
                requested_by=auth.person_id or "unknown",
                requested_by_name=auth.user_name,
                deployment_type="upgrade",
                git_ref=release.git_ref if release else None,
                reason=reason,
                upgrade_id=upgrade.upgrade_id,
            )
            db.commit()
        else:
            db.commit()
            if scheduled_dt:
                run_upgrade.apply_async(args=[str(upgrade.upgrade_id)], eta=scheduled_dt)
            else:
                run_upgrade.delay(str(upgrade.upgrade_id))
    except Exception:
        db.rollback()
    return RedirectResponse(f"/instances/{instance_id}?tab=upgrades", status_code=302)


@router.post("/{instance_id}/upgrades/{upgrade_id}/cancel")
def instance_cancel_upgrade(
    request: Request,
    instance_id: UUID,
    upgrade_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    reason: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.upgrade_service import UpgradeService

    try:
        upgrade = UpgradeService(db).cancel_upgrade(
            upgrade_id,
            reason=reason or None,
            cancelled_by=auth.person_id,
            cancelled_by_name=auth.user_name,
        )
        if upgrade.instance_id != instance_id:
            raise ValueError("Upgrade does not match instance")
        db.commit()
    except Exception:
        db.rollback()
    return RedirectResponse(f"/instances/{instance_id}?tab=upgrades", status_code=302)


@router.get("/{instance_id}/deploy-log", response_class=HTMLResponse)
def instance_deploy_log(
    request: Request,
    instance_id: UUID,
    deployment_id: str | None = None,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    from app.services.deploy_service import DeployService
    from app.services.instance_service import InstanceService

    instance = InstanceService(db).get_or_404(instance_id)
    deploy_svc = DeployService(db)

    if not deployment_id:
        deployment_id = deploy_svc.get_latest_deployment_id(instance_id)

    logs = []
    if deployment_id:
        logs = deploy_svc.get_deployment_logs(instance_id, deployment_id)

    # Check if deployment is still running
    is_running = any(log.status in ("pending", "running") for log in logs)

    return templates.TemplateResponse(
        "instances/deploy_log.html",
        ctx(
            request,
            auth,
            f"Deploy - {instance.org_code}",
            active_page="instances",
            instance=instance,
            logs=logs,
            deployment_id=deployment_id,
            is_running=is_running,
        ),
    )


@router.post("/{instance_id}/start")
def instance_start(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    try:
        svc.start_instance(instance_id)
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Failed to start instance %s", instance_id)
    return RedirectResponse(f"/instances/{instance_id}", status_code=302)


@router.post("/{instance_id}/stop")
def instance_stop(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    try:
        svc.stop_instance(instance_id)
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Failed to stop instance %s", instance_id)
    return RedirectResponse(f"/instances/{instance_id}", status_code=302)


@router.post("/{instance_id}/restart")
def instance_restart(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    try:
        svc.restart_instance(instance_id)
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Failed to restart instance %s", instance_id)
    return RedirectResponse(f"/instances/{instance_id}", status_code=302)


@router.post("/{instance_id}/migrate")
def instance_migrate(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    svc.migrate_instance(instance_id)
    db.commit()
    return RedirectResponse(f"/instances/{instance_id}", status_code=302)


@router.post("/{instance_id}/delete")
def instance_delete(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.models.instance import InstanceStatus
    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    instance = svc.get_or_404(instance_id)

    if instance.status == InstanceStatus.running:
        return RedirectResponse(f"/instances/{instance_id}", status_code=302)

    svc.delete(instance_id)
    db.commit()
    return RedirectResponse("/instances", status_code=302)


@router.get("/{instance_id}/health", response_class=HTMLResponse)
def instance_health_badge(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    """HTMX partial: health status badge with ETag caching."""
    import hashlib
    from datetime import datetime

    from fastapi.responses import Response

    from app.config import settings as platform_settings
    from app.services.health_service import HealthService

    svc = HealthService(db)
    check = svc.get_latest_check(instance_id)

    is_stale = False
    if check and check.checked_at:
        age = (datetime.now(UTC) - check.checked_at).total_seconds()
        is_stale = age > platform_settings.health_stale_seconds

    # Build a content fingerprint for ETag
    tag_parts = f"{check.status.value if check else 'none'}"
    tag_parts += f":{check.response_ms if check else ''}"
    tag_parts += f":{check.checked_at.isoformat() if check and check.checked_at else ''}"
    tag_parts += f":{is_stale}"
    etag = '"' + hashlib.md5(tag_parts.encode()).hexdigest()[:16] + '"'

    # Return 304 if client already has this version
    if_none_match = request.headers.get("if-none-match")
    if if_none_match and if_none_match == etag:
        return Response(status_code=304, headers={"ETag": etag})

    response = templates.TemplateResponse(
        "partials/health_badge.html",
        {"request": request, "health": check, "is_stale": is_stale},
    )
    response.headers["ETag"] = etag
    return response


# ──────────────────── Reconfigure (lightweight deploy) ───────────


@router.post("/{instance_id}/reconfigure")
def instance_reconfigure(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.deploy_service import DeployService
    from app.tasks.deploy import deploy_instance

    deploy_svc = DeployService(db)
    deployment_id = deploy_svc.create_deployment(instance_id, deployment_type="reconfigure")
    db.commit()
    deploy_instance.delay(str(instance_id), deployment_id, deployment_type="reconfigure")
    return RedirectResponse(
        f"/instances/{instance_id}/deploy-log?deployment_id={deployment_id}",
        status_code=302,
    )


# ──────────────────── Module toggle ──────────────────────────────


@router.post("/{instance_id}/modules/{module_id}/toggle")
def toggle_module(
    request: Request,
    instance_id: UUID,
    module_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    enabled: str = Form("off"),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.module_service import ModuleService

    svc = ModuleService(db)
    try:
        svc.set_module_enabled(instance_id, module_id, enabled == "on")
        db.commit()
    except ValueError as e:
        logger.warning("Module toggle failed: %s", e)
    return RedirectResponse(f"/instances/{instance_id}#modules", status_code=302)


# ──────────────────── Feature flag toggle ────────────────────────


@router.post("/{instance_id}/flags/{flag_key}/toggle")
def toggle_flag(
    request: Request,
    instance_id: UUID,
    flag_key: str,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    value: str = Form("false"),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.feature_flag_service import FeatureFlagService

    svc = FeatureFlagService(db)
    svc.set_flag(instance_id, flag_key, value)
    db.commit()
    return RedirectResponse(f"/instances/{instance_id}#flags", status_code=302)


# ──────────────────── Plan assignment ────────────────────────────


@router.post("/{instance_id}/plan")
def assign_plan(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    plan_id: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    instance = svc.get_or_404(instance_id)
    instance.plan_id = UUID(plan_id) if plan_id else None
    db.commit()
    return RedirectResponse(f"/instances/{instance_id}#plan", status_code=302)


# ──────────────────── Backups ────────────────────────────────────


@router.post("/{instance_id}/backup")
def create_backup(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.backup_service import BackupService

    svc = BackupService(db)
    svc.create_backup(instance_id)
    db.commit()
    return RedirectResponse(f"/instances/{instance_id}#backups", status_code=302)


# ──────────────────── Lifecycle actions ──────────────────────────


@router.post("/{instance_id}/suspend")
def suspend_instance(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    reason: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.lifecycle_service import LifecycleService

    svc = LifecycleService(db)
    svc.suspend_instance(instance_id, reason or None)
    db.commit()
    return RedirectResponse(f"/instances/{instance_id}", status_code=302)


@router.post("/{instance_id}/secrets/rotate")
def instance_rotate_secret(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    secret_name: str = Form(...),
    confirm_destructive: str | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.tasks.secrets import rotate_secret_task

    rotate_secret_task.delay(
        str(instance_id),
        secret_name,
        rotated_by=str(auth.person_id) if auth else None,
        confirm_destructive=bool(confirm_destructive),
    )
    return RedirectResponse(f"/instances/{instance_id}?tab=secrets", status_code=302)


@router.post("/{instance_id}/secrets/rotate-all")
def instance_rotate_all_secrets(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    confirm_destructive: str | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.tasks.secrets import rotate_all_secrets_task

    rotate_all_secrets_task.delay(
        str(instance_id),
        rotated_by=str(auth.person_id) if auth else None,
        confirm_destructive=bool(confirm_destructive),
    )
    return RedirectResponse(f"/instances/{instance_id}?tab=secrets", status_code=302)


@router.post("/{instance_id}/reactivate")
def reactivate_instance(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.lifecycle_service import LifecycleService

    svc = LifecycleService(db)
    svc.reactivate_instance(instance_id)
    db.commit()
    return RedirectResponse(f"/instances/{instance_id}", status_code=302)


@router.post("/{instance_id}/archive")
def archive_instance(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.lifecycle_service import LifecycleService

    svc = LifecycleService(db)
    svc.archive_instance(instance_id)
    db.commit()
    return RedirectResponse(f"/instances/{instance_id}", status_code=302)


# ──────────────────── Domain management ──────────────────────────


@router.post("/{instance_id}/domains/add")
def add_domain(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    domain: str = Form(...),
    is_primary: str = Form("off"),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.domain_service import DomainService

    svc = DomainService(db)
    try:
        svc.add_domain(instance_id, domain, is_primary == "on")
        db.commit()
    except ValueError as e:
        logger.warning("Domain add failed: %s", e)
    return RedirectResponse(f"/instances/{instance_id}#domains", status_code=302)


@router.post("/{instance_id}/domains/{domain_id}/verify")
def verify_domain(
    request: Request,
    instance_id: UUID,
    domain_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.domain_service import DomainService

    svc = DomainService(db)
    svc.verify_domain(instance_id, domain_id)
    db.commit()
    return RedirectResponse(f"/instances/{instance_id}#domains", status_code=302)


@router.post("/{instance_id}/domains/{domain_id}/delete")
def delete_domain(
    request: Request,
    instance_id: UUID,
    domain_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.domain_service import DomainService

    svc = DomainService(db)
    svc.remove_domain(instance_id, domain_id)
    db.commit()
    return RedirectResponse(f"/instances/{instance_id}#domains", status_code=302)
