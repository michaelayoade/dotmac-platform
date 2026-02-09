"""SSH Keys — Web routes for key management."""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/ssh-keys")


@router.get("", response_class=HTMLResponse)
def ssh_keys_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.server_service import ServerService
    from app.services.ssh_key_service import SSHKeyService

    keys = SSHKeyService(db).list_keys(active_only=False)
    servers = ServerService(db).list_all()

    return templates.TemplateResponse(
        "ssh_keys/index.html",
        ctx(
            request,
            auth,
            "SSH Keys",
            active_page="ssh_keys",
            keys=keys,
            servers=servers,
        ),
    )


@router.post("/generate")
def ssh_keys_generate(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    label: str = Form(...),
    key_type: str = Form("ed25519"),
    bit_size: int | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.ssh_key_service import SSHKeyService

    try:
        SSHKeyService(db).generate_key(label, key_type=key_type, bit_size=bit_size, created_by=auth.person_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to generate SSH key: %s", e)
    return RedirectResponse("/ssh-keys", status_code=302)


@router.post("/import")
def ssh_keys_import(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    label: str = Form(...),
    private_key_pem: str = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.ssh_key_service import SSHKeyService

    try:
        SSHKeyService(db).import_key(label, private_key_pem, created_by=auth.person_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to import SSH key: %s", e)
    return RedirectResponse("/ssh-keys", status_code=302)


@router.post("/{key_id}/deploy")
def ssh_keys_deploy(
    request: Request,
    key_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    server_id: UUID = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.ssh_key_service import SSHKeyService

    try:
        SSHKeyService(db).deploy_to_server(key_id, server_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to deploy SSH key: %s", e)
    return RedirectResponse("/ssh-keys", status_code=302)


@router.post("/servers/{server_id}/rotate")
def ssh_keys_rotate(
    request: Request,
    server_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    new_key_id: UUID = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.ssh_key_service import SSHKeyService

    try:
        SSHKeyService(db).rotate_key(server_id, new_key_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to rotate SSH key: %s", e)
    return RedirectResponse("/ssh-keys", status_code=302)


@router.post("/{key_id}/delete")
def ssh_keys_delete(
    request: Request,
    key_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.ssh_key_service import SSHKeyService

    try:
        SSHKeyService(db).delete_key(key_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete SSH key: %s", e)
    return RedirectResponse("/ssh-keys", status_code=302)
