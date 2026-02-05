"""
Instance Management — Web routes for ERP instance CRUD, deployment, and operations.
"""
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

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
    from app.services.health_service import HealthService
    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    health_svc = HealthService(db)
    instances = svc.list_all()

    # Batch-fetch latest health checks to avoid N+1
    instance_ids = [inst.instance_id for inst in instances]
    health_map = health_svc.get_latest_checks_batch(instance_ids)
    instance_data = [
        {"instance": inst, "health": health_map.get(inst.instance_id)}
        for inst in instances
    ]

    return templates.TemplateResponse(
        "instances/list.html",
        ctx(request, auth, "Instances", active_page="instances", instances=instance_data),
    )


@router.get("/new", response_class=HTMLResponse)
def instance_form(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.server_service import ServerService

    servers = ServerService(db).list_all()
    return templates.TemplateResponse(
        "instances/form.html",
        ctx(request, auth, "New Instance", active_page="instances", servers=servers, errors=None),
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
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.instance_service import InstanceService
    from app.services.server_service import ServerService

    svc = InstanceService(db)
    try:
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
        )
        db.commit()
        return RedirectResponse(
            f"/instances/{instance.instance_id}", status_code=302
        )
    except Exception as e:
        db.rollback()
        servers = ServerService(db).list_all()
        return templates.TemplateResponse(
            "instances/form.html",
            ctx(request, auth, "New Instance", active_page="instances", servers=servers, errors=[str(e)]),
        )


@router.get("/{instance_id}", response_class=HTMLResponse)
def instance_detail(
    request: Request,
    instance_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    from app.services.deploy_service import DeployService
    from app.services.health_service import HealthService
    from app.services.instance_service import InstanceService

    svc = InstanceService(db)
    instance = svc.get_or_404(instance_id)

    health_svc = HealthService(db)
    latest_health = health_svc.get_latest_check(instance_id)
    recent_checks = health_svc.get_recent_checks(instance_id, limit=10)

    deploy_svc = DeployService(db)
    latest_deploy_id = deploy_svc.get_latest_deployment_id(instance_id)
    deploy_logs = []
    if latest_deploy_id:
        deploy_logs = deploy_svc.get_deployment_logs(instance_id, latest_deploy_id)

    return templates.TemplateResponse(
        "instances/detail.html",
        ctx(
            request, auth, instance.org_code, active_page="instances",
            instance=instance,
            latest_health=latest_health,
            recent_checks=recent_checks,
            deploy_logs=deploy_logs,
            latest_deploy_id=latest_deploy_id,
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
    deployment_id = deploy_svc.create_deployment(instance_id, admin_password)
    db.commit()

    # Kick off async deployment via Celery (password stored in DB, not task args)
    deploy_instance.delay(str(instance_id), deployment_id)

    return RedirectResponse(
        f"/instances/{instance_id}/deploy-log?deployment_id={deployment_id}",
        status_code=302,
    )


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
    is_running = any(
        log.status in ("pending", "running") for log in logs
    )

    return templates.TemplateResponse(
        "instances/deploy_log.html",
        ctx(
            request, auth, f"Deploy - {instance.org_code}", active_page="instances",
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

    from app.models.instance import InstanceStatus
    from app.models.server import Server
    from app.services.instance_service import InstanceService
    from app.services.ssh_service import get_ssh_for_server

    svc = InstanceService(db)
    instance = svc.get_or_404(instance_id)
    server = db.get(Server, instance.server_id)
    ssh = get_ssh_for_server(server)
    result = ssh.exec_command("docker compose up -d", cwd=instance.deploy_path)
    if result.ok:
        instance.status = InstanceStatus.running
    else:
        instance.status = InstanceStatus.error
    db.commit()
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

    from app.models.instance import InstanceStatus
    from app.models.server import Server
    from app.services.instance_service import InstanceService
    from app.services.ssh_service import get_ssh_for_server

    svc = InstanceService(db)
    instance = svc.get_or_404(instance_id)
    server = db.get(Server, instance.server_id)
    ssh = get_ssh_for_server(server)
    result = ssh.exec_command("docker compose down", cwd=instance.deploy_path)
    if result.ok:
        instance.status = InstanceStatus.stopped
    else:
        instance.status = InstanceStatus.error
    db.commit()
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

    from app.models.server import Server
    from app.services.instance_service import InstanceService
    from app.services.ssh_service import get_ssh_for_server

    svc = InstanceService(db)
    instance = svc.get_or_404(instance_id)
    server = db.get(Server, instance.server_id)
    ssh = get_ssh_for_server(server)
    ssh.exec_command("docker compose restart", cwd=instance.deploy_path)
    db.commit()
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

    import re
    from app.models.server import Server
    from app.services.instance_service import InstanceService
    from app.services.ssh_service import get_ssh_for_server

    svc = InstanceService(db)
    instance = svc.get_or_404(instance_id)
    slug = instance.org_code.lower()
    if not re.match(r'^[a-zA-Z0-9_-]+$', slug):
        raise ValueError(f"Invalid org_code slug: {slug!r}")
    server = db.get(Server, instance.server_id)
    ssh = get_ssh_for_server(server)
    ssh.exec_command(
        f"docker exec dotmac_{slug}_app alembic upgrade heads",
        timeout=120,
    )
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
        raise ValueError("Cannot delete a running instance. Stop it first.")

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
    """HTMX partial: health status badge."""
    from app.services.health_service import HealthService

    svc = HealthService(db)
    check = svc.get_latest_check(instance_id)

    return templates.TemplateResponse(
        "partials/health_badge.html",
        {"request": request, "health": check},
    )
