"""
Platform Settings — Web routes for configuring deployment settings.
"""
from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
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
):
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
    dotmac_git_repo_url: str = Form(""),
    dotmac_git_branch: str = Form("main"),
    dotmac_source_path: str = Form("/opt/dotmac"),
    default_deploy_path: str = Form("/opt/dotmac/instances"),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)

    from app.services.platform_settings import PlatformSettingsService

    svc = PlatformSettingsService(db)
    svc.set_many({
        "dotmac_git_repo_url": dotmac_git_repo_url.strip(),
        "dotmac_git_branch": dotmac_git_branch.strip(),
        "dotmac_source_path": dotmac_source_path.strip(),
        "default_deploy_path": default_deploy_path.strip(),
    })
    db.commit()

    platform_settings = svc.get_all()
    return templates.TemplateResponse(
        "settings.html",
        ctx(request, auth, "Settings", active_page="settings", platform_settings=platform_settings, saved=True),
    )
