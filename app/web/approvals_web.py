"""
Approvals — Web routes for deployment approvals.
"""

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/approvals")


@router.get("", response_class=HTMLResponse)
def approvals_list(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.approval_service import ApprovalService

    bundle = ApprovalService(db).get_list_bundle(history_limit=100)

    return templates.TemplateResponse(
        "approvals/list.html",
        ctx(
            request,
            auth,
            "Approvals",
            active_page="approvals",
            pending=bundle["pending"],
            history=bundle["history"],
            inst_map=bundle["inst_map"],
            upgrade_map=bundle["upgrade_map"],
        ),
    )


@router.post("/{approval_id}/approve")
def approvals_approve(
    request: Request,
    approval_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.approval_service import ApprovalService

    try:
        if not auth.person_id:
            raise HTTPException(status_code=401, detail="Unauthorized")
        svc = ApprovalService(db)
        approval = svc.approve(approval_id, auth.person_id, auth.user_name)
        upgrade_id, upgrade_eta = svc.resolve_upgrade_schedule(approval)
        db.commit()
        if upgrade_id:
            from app.tasks.upgrade import run_upgrade

            if upgrade_eta:
                run_upgrade.apply_async(args=[upgrade_id], eta=upgrade_eta)
            else:
                run_upgrade.delay(upgrade_id)
    except Exception as e:
        db.rollback()
        logger.exception("Failed to approve %s: %s", approval_id, e)
    return RedirectResponse("/approvals", status_code=302)


@router.post("/{approval_id}/reject")
def approvals_reject(
    request: Request,
    approval_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    reason: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.approval_service import ApprovalService

    try:
        if not auth.person_id:
            raise HTTPException(status_code=401, detail="Unauthorized")
        svc = ApprovalService(db)
        svc.reject(approval_id, auth.person_id, auth.user_name, reason=reason or None)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to reject %s: %s", approval_id, e)
    return RedirectResponse("/approvals", status_code=302)
