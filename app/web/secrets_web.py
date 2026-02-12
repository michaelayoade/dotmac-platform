"""
Secrets — Web routes for secret resolution status.
"""

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
    from app.services.secrets import get_openbao_status

    status = get_openbao_status()

    return templates.TemplateResponse(
        "secrets/index.html",
        ctx(
            request,
            auth,
            "Secrets",
            active_page="secrets",
            configured=status["configured"],
            addr=status["addr"],
            namespace=status["namespace"],
            kv_version=status["kv_version"],
            token_set=status["token_set"],
        ),
    )
