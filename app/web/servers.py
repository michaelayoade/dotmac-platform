"""
Server Management — Web routes for VPS server CRUD and connectivity testing.
"""
import logging
from uuid import UUID

logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/servers")


@router.get("", response_class=HTMLResponse)
def server_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    from app.services.server_service import ServerService

    svc = ServerService(db)
    servers = svc.list_all()
    # Batch-fetch instance counts to avoid N+1
    counts = svc.instance_counts_batch([s.server_id for s in servers])
    server_data = [
        {"server": s, "instance_count": counts.get(s.server_id, 0)}
        for s in servers
    ]

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
            ctx(request, auth, "Add Server", active_page="servers", server=None, errors=["An unexpected error occurred. Please try again."]),
        )


@router.get("/{server_id}", response_class=HTMLResponse)
def server_detail(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    from app.services.instance_service import InstanceService
    from app.services.server_service import ServerService

    svc = ServerService(db)
    server = svc.get_or_404(server_id)
    instances = InstanceService(db).list_for_server(server_id)

    return templates.TemplateResponse(
        "servers/detail.html",
        ctx(request, auth, server.name, active_page="servers", server=server, instances=instances),
    )


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

    from app.services.instance_service import InstanceService
    from app.services.server_service import ServerService

    svc = ServerService(db)
    try:
        svc.delete(server_id)
        db.commit()
        return RedirectResponse("/servers", status_code=302)
    except ValueError:
        db.rollback()
        server = svc.get_or_404(server_id)
        instances = InstanceService(db).list_for_server(server_id)
        return templates.TemplateResponse(
            "servers/detail.html",
            ctx(
                request, auth, server.name, active_page="servers",
                server=server, instances=instances,
                errors=["Cannot delete server while it has instances. Remove all instances first."],
            ),
        )
