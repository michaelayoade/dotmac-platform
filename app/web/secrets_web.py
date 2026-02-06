"""
Secrets — Web routes for secret resolution status.
"""
import os

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/secrets")


@router.get("", response_class=HTMLResponse)
def secrets_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    addr = os.getenv("OPENBAO_ADDR") or os.getenv("VAULT_ADDR")
    namespace = os.getenv("OPENBAO_NAMESPACE") or os.getenv("VAULT_NAMESPACE")
    kv_version = os.getenv("OPENBAO_KV_VERSION", "2")
    token = os.getenv("OPENBAO_TOKEN") or os.getenv("VAULT_TOKEN")

    configured = bool(addr and token)

    return templates.TemplateResponse(
        "secrets/index.html",
        ctx(
            request,
            auth,
            "Secrets",
            active_page="secrets",
            configured=configured,
            addr=addr,
            namespace=namespace,
            kv_version=kv_version,
            token_set=bool(token),
        ),
    )
