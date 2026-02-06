"""
Clone — Web routes for cloning instances.
"""
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/clone")


@router.get("", response_class=HTMLResponse)
def clone_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    error: str | None = None,
):
    require_admin(auth)
    from app.services.instance_service import InstanceService

    instances = InstanceService(db).list_all()
    return templates.TemplateResponse(
        "clone/index.html",
        ctx(
            request,
            auth,
            "Clone Instance",
            active_page="clone",
            instances=instances,
            error=error,
        ),
    )


@router.post("")
def clone_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    source_instance_id: UUID = Form(...),
    new_org_code: str = Form(""),
    new_org_name: str | None = Form(None),
    include_data: str | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.clone_service import CloneService

    svc = CloneService(db)
    try:
        clone = svc.clone_instance(
            source_instance_id,
            new_org_code.strip(),
            new_org_name.strip() if new_org_name else None,
            include_data=include_data == "on",
        )
        db.commit()
        return RedirectResponse(f"/instances/{clone.instance_id}", status_code=302)
    except ValueError as e:
        db.rollback()
        instances = []
        from app.services.instance_service import InstanceService
        instances = InstanceService(db).list_all()
        return templates.TemplateResponse(
            "clone/index.html",
            ctx(
                request,
                auth,
                "Clone Instance",
                active_page="clone",
                instances=instances,
                error=str(e),
            ),
        )
    except Exception:
        db.rollback()
        instances = []
        from app.services.instance_service import InstanceService
        instances = InstanceService(db).list_all()
        return templates.TemplateResponse(
            "clone/index.html",
            ctx(
                request,
                auth,
                "Clone Instance",
                active_page="clone",
                instances=instances,
                error="Clone failed.",
            ),
        )
