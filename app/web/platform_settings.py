"""
Platform Settings — Web routes for configuring deployment settings.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/settings")


@router.get("", response_class=HTMLResponse)
def settings_page(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> HTMLResponse:
    require_admin(auth)

    from app.services.platform_settings import PlatformSettingsService

    svc = PlatformSettingsService(db)
    platform_settings = svc.get_all()

    return templates.TemplateResponse(
        "settings.html",
        ctx(request, auth, "Settings", active_page="settings", platform_settings=platform_settings, saved=False),
    )


@router.post("", response_class=HTMLResponse)
def settings_save(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    default_deploy_path: str = Form("/opt/dotmac/instances"),
    csrf_token: str = Form(""),
) -> HTMLResponse:
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.platform_settings import PlatformSettingsService

    svc = PlatformSettingsService(db)
    svc.set_many(
        {
            "default_deploy_path": default_deploy_path.strip(),
        }
    )
    db.commit()

    platform_settings = svc.get_all()
    return templates.TemplateResponse(
        "settings.html",
        ctx(request, auth, "Settings", active_page="settings", platform_settings=platform_settings, saved=True),
    )
