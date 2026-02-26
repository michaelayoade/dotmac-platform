"""
Instance Management — Web routes for ERP instance CRUD, deployment, and operations.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING
from uuid import UUID

if TYPE_CHECKING:
    from collections.abc import Sequence

    from app.models.catalog import AppCatalogItem

logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/instances")


def _build_catalog_map_json(catalog_items: Sequence[AppCatalogItem]) -> str:
    """Build a JSON string mapping catalog_id -> summary for the instance form."""
    import json

    catalog_map: dict[str, dict[str, str | None]] = {}
    for c in catalog_items:
        catalog_map[str(c.catalog_id)] = {
            "label": c.label,
            "release_name": c.release.name if c.release else None,
            "release_version": c.release.version if c.release else None,
            "bundle_name": c.bundle.name if c.bundle else None,
        }
    return json.dumps(catalog_map)


@router.get("", response_class=HTMLResponse)
def instance_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    from app.services.instance_service import InstanceService

    svc = InstanceService(db)

    # Filters
    params = request.query_params
    q = (params.get("q") or "").strip()
    status_filter = (params.get("status") or "").strip().lower() or None
    health_filter = (params.get("health") or "").strip().lower() or None
    view = (params.get("view") or "table").strip().lower()
    sort_key = (params.get("sort") or "org_code").strip().lower()
    sort_dir = (params.get("dir") or "asc").strip().lower()

    # Pagination
    try:
        page = max(int(params.get("page") or 1), 1)
    except ValueError:
        page = 1
    try:
        page_size = min(max(int(params.get("page_size") or 25), 10), 100)
    except ValueError:
        page_size = 25

    result = svc.list_for_web(
        q=q,
        status_filter=status_filter,
        health_filter=health_filter,
        sort_key=sort_key,
        sort_dir=sort_dir if sort_dir in {"asc", "desc"} else "asc",
        page=page,
        page_size=page_size,
    )

    return templates.TemplateResponse(
        "instances/list.html",
        ctx(
            request,
            auth,
            "Instances",
            active_page="instances",
            instances=result.items,
            total=result.total,
            page=page,
            page_size=page_size,
            q=q,
            status_filter=status_filter or "",
            health_filter=health_filter or "",
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
    from app.services.server_service import ServerService

    servers = ServerService(db).list_all()
    catalog_items = CatalogService(db).list_catalog_items(active_only=True)
    catalog_map_json = _build_catalog_map_json(catalog_items)
    return templates.TemplateResponse(
        "instances/form.html",
        ctx(
            request,
            auth,
            "New Instance",
            active_page="instances",
            servers=servers,
            catalog_items=catalog_items,
            catalog_map_json=catalog_map_json,
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
    sector_type: str = Form(""),
    framework: str = Form(""),
    currency: str = Form(""),
    admin_email: str = Form(""),
    admin_username: str = Form("admin"),
    domain: str = Form(""),
    catalog_item_id: str = Form(""),
    app_port: str = Form(""),
    db_port: str = Form(""),
    redis_port: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.instance_service import InstanceService
    from app.services.server_service import ServerService

    svc = InstanceService(db)
    try:
        if not catalog_item_id:
            raise ValueError("Catalog item is required")
        catalog_id = UUID(catalog_item_id)
        git_repo_id = svc.resolve_catalog_repo(catalog_id)
        instance = svc.create(
            server_id=UUID(server_id),
            org_code=org_code,
            org_name=org_name,
            sector_type=sector_type or None,
            framework=framework or None,
            currency=currency or None,
            admin_email=admin_email or None,
            admin_username=admin_username or "admin",
            domain=domain or None,
            app_port=int(app_port) if app_port else None,
            db_port=int(db_port) if db_port else None,
            redis_port=int(redis_port) if redis_port else None,
            git_repo_id=git_repo_id,
            catalog_item_id=catalog_id,
        )
        db.commit()
        return RedirectResponse(f"/instances/{instance.instance_id}", status_code=302)
    except ValueError as e:
        db.rollback()
        servers = ServerService(db).list_all()
        from app.services.catalog_service import CatalogService
        from app.services.git_repo_service import GitRepoService

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
                catalog_map_json=_build_catalog_map_json(catalog_items),
                errors=[str(e)],
            ),
        )
    except Exception:
        db.rollback()
        logger.exception("Failed to create instance")
        servers = ServerService(db).list_all()
        from app.services.catalog_service import CatalogService
        from app.services.git_repo_service import GitRepoService

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
                catalog_map_json=_build_catalog_map_json(catalog_items),
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
    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    active_tab = (request.query_params.get("tab") or "modules").strip().lower()
    bundle = svc.get_detail_bundle(instance_id)

    return templates.TemplateResponse(
        "instances/detail.html",
        ctx(
            request,
            auth,
            bundle["instance"].org_code,
            active_page="instances",
            instance=bundle["instance"],
            latest_health=bundle["latest_health"],
            recent_checks=bundle["recent_checks"],
            deploy_logs=bundle["deploy_logs"],
            latest_deploy_id=bundle["latest_deploy_id"],
            modules=bundle["modules"],
            flags=bundle["flags"],
            plans=bundle["plans"],
            backups=bundle["backups"],
            domains=bundle["domains"],
            audit_logs=bundle["audit_logs"],
            usage_summary=bundle["usage_summary"],
            compliance_violations=bundle["compliance_violations"],
            rotation_history=bundle["rotation_history"],
            active_tab=active_tab,
            repos=bundle["repos"],
            catalog_items=bundle["catalog_items"],
            catalog_map=bundle["catalog_map"],
            upgrades=bundle["upgrades"],
            pending_upgrade_ids=bundle["pending_upgrade_ids"],
            uptime_seconds=bundle["uptime_seconds"],
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
    from app.services.instance_service import InstanceService

    try:
        if not git_repo_id:
            raise ValueError("Git repository is required")
        InstanceService(db).set_git_repo(instance_id, UUID(git_repo_id))
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
    from app.services.upgrade_service import UpgradeService

    try:
        if not catalog_item_id:
            raise ValueError("Catalog item is required")
        svc = UpgradeService(db)
        svc.create_and_dispatch(
            instance_id,
            UUID(catalog_item_id),
            scheduled_for=scheduled_for,
            requested_by=auth.person_id or "unknown",
            requested_by_name=auth.user_name,
        )
        db.commit()
        svc.dispatch_pending()
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
        UpgradeService(db).cancel_for_instance(
            instance_id,
            upgrade_id,
            reason=reason or None,
            cancelled_by=auth.person_id,
            cancelled_by_name=auth.user_name,
        )
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

    bundle = DeployService(db).get_deploy_log_bundle(instance_id, deployment_id)

    return templates.TemplateResponse(
        "instances/deploy_log.html",
        ctx(
            request,
            auth,
            f"Deploy - {bundle['instance'].org_code}",
            active_page="instances",
            instance=bundle["instance"],
            logs=bundle["logs"],
            deployment_id=bundle["deployment_id"],
            is_running=bundle["is_running"],
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
    from fastapi.responses import Response

    from app.services.health_service import HealthService

    state = HealthService(db).get_badge_state(instance_id)
    etag = state["etag"]

    # Return 304 if client already has this version
    if_none_match = request.headers.get("if-none-match")
    if if_none_match and if_none_match == etag:
        return Response(status_code=304, headers={"ETag": etag})

    response = templates.TemplateResponse(
        "partials/health_badge.html",
        {"request": request, "health": state["health"], "is_stale": state["is_stale"]},
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

    InstanceService(db).assign_plan(instance_id, UUID(plan_id) if plan_id else None)
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
