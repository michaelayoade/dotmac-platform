"""Disaster Recovery — Web routes for DR plan management."""

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
router = APIRouter(prefix="/dr")


@router.get("", response_class=HTMLResponse)
def dr_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.dr_service import DisasterRecoveryService

    bundle = DisasterRecoveryService(db).get_index_bundle()
    return templates.TemplateResponse(
        "dr/index.html",
        ctx(
            request,
            auth,
            "Disaster Recovery",
            active_page="dr",
            plans=bundle["plans"],
            instances=bundle["instances"],
            servers=bundle["servers"],
        ),
    )


@router.post("/create")
def dr_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID = Form(...),
    backup_schedule_cron: str = Form("0 2 * * *"),
    retention_days: int = Form(30),
    target_server_id: UUID | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.dr_service import DisasterRecoveryService

    try:
        DisasterRecoveryService(db).create_dr_plan(
            instance_id,
            backup_schedule_cron=backup_schedule_cron,
            retention_days=retention_days,
            target_server_id=target_server_id,
        )
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create DR plan: %s", e)
    return RedirectResponse("/dr", status_code=302)


@router.post("/{dr_plan_id}/backup")
def dr_backup(
    request: Request,
    dr_plan_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.tasks.dr import run_dr_backup

    run_dr_backup.delay(str(dr_plan_id))
    return RedirectResponse("/dr", status_code=302)


@router.post("/{dr_plan_id}/test")
def dr_test(
    request: Request,
    dr_plan_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.tasks.dr import run_dr_test

    run_dr_test.delay(str(dr_plan_id))
    return RedirectResponse("/dr", status_code=302)


@router.post("/{dr_plan_id}/restore")
def dr_restore(
    request: Request,
    dr_plan_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    backup_id: UUID = Form(...),
    target_server_id: UUID = Form(...),
    new_org_code: str = Form(...),
    new_org_name: str | None = Form(None),
    admin_password: str | None = Form(None),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.tasks.dr import run_dr_restore

    run_dr_restore.delay(
        str(backup_id),
        str(target_server_id),
        new_org_code,
        new_org_name=new_org_name,
        admin_password=admin_password,
    )
    return RedirectResponse("/dr", status_code=302)


@router.post("/{dr_plan_id}/delete")
def dr_delete(
    request: Request,
    dr_plan_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.dr_service import DisasterRecoveryService

    try:
        DisasterRecoveryService(db).delete_dr_plan(dr_plan_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete DR plan: %s", e)
    return RedirectResponse("/dr", status_code=302)
