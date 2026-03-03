"""
Server Management — Web routes for VPS server CRUD and connectivity testing.
"""

import logging
from urllib.parse import quote_plus
from uuid import UUID

from celery.result import AsyncResult

logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.models.server import Server
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/servers")


def _render_server_detail(
    request: Request,
    auth: WebAuthContext,
    db: Session,
    server_id: UUID,
    *,
    errors: list[str] | None = None,
):
    from app.services.server_service import ServerService

    bundle = ServerService(db).get_detail_bundle(server_id)
    app_registered = any(
        item.get("key") == "catalog" and bool(item.get("ready"))
        for item in (bundle.get("checklist") or [])
        if isinstance(item, dict)
    )
    return templates.TemplateResponse(
        "servers/detail.html",
        ctx(
            request,
            auth,
            bundle["server"].name,
            active_page="servers",
            server=bundle["server"],
            instances=bundle["instances"],
            ssh_key=bundle["ssh_key"],
            ssh_key_label=bundle["ssh_key_label"],
            checklist=bundle["checklist"],
            app_registered=app_registered,
            errors=errors,
        ),
    )


def _render_job_status(request: Request, server_id: UUID, task_id: str):
    result = AsyncResult(task_id)
    state = result.state
    done = state in {"SUCCESS", "FAILURE", "REVOKED"}
    success = False
    message = ""
    output = ""

    if state in {"PENDING", "RECEIVED"}:
        message = "Queued..."
    elif state in {"STARTED", "PROGRESS", "RETRY"}:
        meta = result.info if isinstance(result.info, dict) else {}
        message = str(meta.get("message") or "Running...")
    elif state == "SUCCESS":
        payload = result.result if isinstance(result.result, dict) else {}
        success = bool(payload.get("success", True))
        message = str(payload.get("message") or ("Completed" if success else "Completed with issues"))
        output = str(payload.get("output") or payload.get("error") or "")
        if not output and payload.get("public_key"):
            output = f"Public key to install:\n{payload['public_key']}"
    else:
        message = "Task failed."
        output = str(result.result) if result.result else ""

    return templates.TemplateResponse(
        "partials/server_job_status.html",
        {
            "request": request,
            "server_id": server_id,
            "task_id": task_id,
            "state": state,
            "done": done,
            "success": success,
            "message": message,
            "output": output,
        },
    )


@router.get("", response_class=HTMLResponse)
def server_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    from app.services.server_service import ServerService

    server_data = ServerService(db).get_list_bundle()

    return templates.TemplateResponse(
        "servers/list.html", ctx(request, auth, "Servers", active_page="servers", servers=server_data)
    )


@router.get("/new", response_class=HTMLResponse)
def server_form(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
):
    require_admin(auth)
    return templates.TemplateResponse(
        "servers/form.html",
        ctx(request, auth, "Add Server", active_page="servers", server=None, errors=None),
    )


@router.post("/new", response_class=HTMLResponse)
def server_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    name: str = Form(...),
    hostname: str = Form(...),
    ssh_port: int = Form(22),
    ssh_user: str = Form("root"),
    ssh_key_path: str = Form("/root/.ssh/id_rsa"),
    base_domain: str = Form(""),
    is_local: bool = Form(False),
    notes: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.server_service import ServerService

    svc = ServerService(db)
    try:
        server = svc.create(
            name=name,
            hostname=hostname,
            ssh_port=ssh_port,
            ssh_user=ssh_user,
            ssh_key_path=ssh_key_path,
            base_domain=base_domain or None,
            is_local=is_local,
            notes=notes or None,
        )
        db.commit()
        return RedirectResponse(f"/servers/{server.server_id}", status_code=302)
    except ValueError as e:
        db.rollback()
        return templates.TemplateResponse(
            "servers/form.html",
            ctx(request, auth, "Add Server", active_page="servers", server=None, errors=[str(e)]),
        )
    except Exception:
        db.rollback()
        logger.exception("Failed to create server")
        return templates.TemplateResponse(
            "servers/form.html",
            ctx(
                request,
                auth,
                "Add Server",
                active_page="servers",
                server=None,
                errors=["An unexpected error occurred. Please try again."],
            ),
        )


@router.get("/{server_id}", response_class=HTMLResponse)
def server_detail(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    return _render_server_detail(request, auth, db, server_id)


@router.post("/{server_id}/setup-ssh", response_class=HTMLResponse)
def server_setup_ssh(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.tasks.server_setup import setup_server_ssh_key

    if not db.get(Server, server_id):
        return RedirectResponse("/servers", status_code=302)

    task = setup_server_ssh_key.delay(str(server_id), auth.person_id)
    if request.headers.get("HX-Request") == "true":
        return _render_job_status(request, server_id, task.id)
    return RedirectResponse(f"/servers/{server_id}?success={quote_plus('SSH setup started.')}", status_code=302)


@router.post("/{server_id}/initialize", response_class=HTMLResponse)
def server_initialize(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    ssh_password: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.server_service import ServerService
    from app.services.ssh_key_service import SSHKeyService
    from app.services.ssh_service import SSHService
    from app.tasks.server_setup import bootstrap_server_dependencies, initialize_server

    server = db.get(Server, server_id)
    if not server:
        return RedirectResponse("/servers", status_code=302)

    # Minimal secure password bootstrap path:
    # use password in-request to install per-server key, then queue bootstrap task.
    if ssh_password.strip():
        try:
            bootstrap_ssh = SSHService(
                hostname=server.hostname,
                port=server.ssh_port,
                username=server.ssh_user,
                password=ssh_password.strip(),
                expected_host_key_fingerprint=server.ssh_host_key_fingerprint,
                is_local=server.is_local,
                server_id=None,
            )
            probe = bootstrap_ssh.exec_command("echo DOTMAC_SSH_OK", timeout=12)
            if not (probe.ok and "DOTMAC_SSH_OK" in (probe.stdout or "")):
                detail = (probe.stderr or probe.stdout or "SSH authentication failed").strip()
                return templates.TemplateResponse(
                    "partials/server_job_status.html",
                    {
                        "request": request,
                        "server_id": server_id,
                        "task_id": "inline",
                        "state": "FAILURE",
                        "done": True,
                        "success": False,
                        "message": "Unable to authenticate with provided SSH password.",
                        "output": detail,
                    },
                )

            key_svc = SSHKeyService(db)
            if not server.ssh_key_id:
                key = key_svc.generate_key(
                    label=f"{server.name}-auto-{str(server.server_id)[:8]}",
                    key_type="ed25519",
                    created_by=auth.person_id,
                )
                db.commit()
                key_svc.deploy_to_server(key.key_id, server.server_id, ssh=bootstrap_ssh)
                db.commit()
            else:
                # Repair path: re-install currently assigned key via password bootstrap.
                key_svc.deploy_to_server(server.ssh_key_id, server.server_id, ssh=bootstrap_ssh)
                db.commit()

            test_result = ServerService(db).test_connectivity(server.server_id)
            db.commit()
            if not test_result.get("success"):
                return templates.TemplateResponse(
                    "partials/server_job_status.html",
                    {
                        "request": request,
                        "server_id": server_id,
                        "task_id": "inline",
                        "state": "FAILURE",
                        "done": True,
                        "success": False,
                        "message": "SSH key configured, but connectivity verification failed.",
                        "output": str(test_result.get("message", "unknown")),
                    },
                )

            task = bootstrap_server_dependencies.delay(str(server_id))
            if request.headers.get("HX-Request") == "true":
                return _render_job_status(request, server_id, task.id)
            return RedirectResponse(
                f"/servers/{server_id}?success={quote_plus('Server initialization started.')}",
                status_code=302,
            )
        except Exception as exc:
            db.rollback()
            return templates.TemplateResponse(
                "partials/server_job_status.html",
                {
                    "request": request,
                    "server_id": server_id,
                    "task_id": "inline",
                    "state": "FAILURE",
                    "done": True,
                    "success": False,
                    "message": "Server initialization failed during SSH bootstrap.",
                    "output": str(exc),
                },
            )

    task = initialize_server.delay(str(server_id), auth.person_id)
    if request.headers.get("HX-Request") == "true":
        return _render_job_status(request, server_id, task.id)
    return RedirectResponse(
        f"/servers/{server_id}?success={quote_plus('Server initialization started.')}", status_code=302
    )


@router.post("/{server_id}/bootstrap", response_class=HTMLResponse)
def server_bootstrap(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.tasks.server_setup import bootstrap_server_dependencies

    if not db.get(Server, server_id):
        return RedirectResponse("/servers", status_code=302)

    task = bootstrap_server_dependencies.delay(str(server_id))
    if request.headers.get("HX-Request") == "true":
        return _render_job_status(request, server_id, task.id)
    return RedirectResponse(
        f"/servers/{server_id}?success={quote_plus('Dependency bootstrap started.')}", status_code=302
    )


@router.get("/{server_id}/jobs/{task_id}", response_class=HTMLResponse)
def server_job_status(
    request: Request,
    server_id: UUID,
    task_id: str,
    auth: WebAuthContext = Depends(require_web_auth),
):
    require_admin(auth)
    return _render_job_status(request, server_id, task_id)


@router.post("/{server_id}/register-app")
def server_register_app(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    repo_label: str = Form(...),
    registry_url: str = Form(...),
    default_branch: str = Form("main"),
    item_label: str = Form(...),
    version: str = Form(...),
    git_ref: str = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from sqlalchemy import select

    from app.models.catalog import AppCatalogItem
    from app.models.git_repository import GitAuthType, GitRepository
    from app.services.catalog_service import CatalogService
    from app.services.git_repo_service import GitRepoService

    server = db.get(Server, server_id)
    if not server:
        return RedirectResponse("/servers", status_code=302)

    try:
        repo_svc = GitRepoService(db)
        catalog_svc = CatalogService(db)

        repo = db.scalar(
            select(GitRepository)
            .where(GitRepository.registry_url == registry_url.strip())
            .where(GitRepository.is_active.is_(True))
            .limit(1)
        )
        if not repo:
            repo = repo_svc.create_repo(
                label=repo_label,
                auth_type=GitAuthType.none,
                registry_url=registry_url,
                default_branch=default_branch,
            )

        item = db.scalar(
            select(AppCatalogItem)
            .where(AppCatalogItem.label == item_label.strip())
            .where(AppCatalogItem.git_repo_id == repo.repo_id)
            .where(AppCatalogItem.version == version.strip())
            .where(AppCatalogItem.is_active.is_(True))
            .limit(1)
        )
        if not item:
            item = catalog_svc.create_catalog_item(
                label=item_label,
                version=version,
                git_ref=git_ref,
                git_repo_id=repo.repo_id,
            )

        db.commit()
        success = quote_plus("App registered successfully. Continue by creating an instance.")
        return RedirectResponse(
            f"/instances/new?server_id={server_id}&catalog_item_id={item.catalog_id}&success={success}",
            status_code=302,
        )
    except Exception as e:
        db.rollback()
        logger.exception("Failed to register app stack for server %s", server_id)
        return RedirectResponse(f"/servers/{server_id}?error={quote_plus(str(e))}", status_code=302)


@router.post("/{server_id}/edit", response_class=HTMLResponse)
def server_update(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    name: str = Form(...),
    hostname: str = Form(...),
    ssh_port: int = Form(22),
    ssh_user: str = Form("root"),
    ssh_key_path: str = Form("/root/.ssh/id_rsa"),
    base_domain: str = Form(""),
    notes: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.server_service import ServerService

    svc = ServerService(db)
    svc.update(
        server_id,
        name=name,
        hostname=hostname,
        ssh_port=ssh_port,
        ssh_user=ssh_user,
        ssh_key_path=ssh_key_path,
        base_domain=base_domain or None,
        notes=notes or None,
    )
    db.commit()
    return RedirectResponse(f"/servers/{server_id}", status_code=302)


@router.post("/{server_id}/test", response_class=HTMLResponse)
def server_test(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.server_service import ServerService

    svc = ServerService(db)
    result = svc.test_connectivity(server_id)
    db.commit()

    return templates.TemplateResponse(
        "partials/test_result.html",
        {
            "request": request,
            "success": result.get("success", False),
            "hostname": result.get("hostname"),
            "error": result.get("message") if not result.get("success") else None,
        },
    )


@router.post("/{server_id}/delete")
def server_delete(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.server_service import ServerService

    svc = ServerService(db)
    try:
        svc.delete(server_id)
        db.commit()
        return RedirectResponse("/servers", status_code=302)
    except ValueError:
        db.rollback()
        return _render_server_detail(
            request,
            auth,
            db,
            server_id,
            errors=["Cannot delete server while it has instances. Remove all instances first."],
        )
