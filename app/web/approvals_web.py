"""
Approvals — Web routes for deployment approvals.
"""
import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.deploy_approval import DeployApproval
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
    from app.services.instance_service import InstanceService

    svc = ApprovalService(db)
    pending = svc.get_pending()
    history = list(
        db.scalars(
            select(DeployApproval).order_by(DeployApproval.created_at.desc()).limit(100)
        ).all()
    )

    instances = InstanceService(db).list_all()
    inst_map = {i.instance_id: i for i in instances}

    return templates.TemplateResponse(
        "approvals/list.html",
        ctx(
            request,
            auth,
            "Approvals",
            active_page="approvals",
            pending=pending,
            history=history,
            inst_map=inst_map,
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
        svc = ApprovalService(db)
        svc.approve(approval_id, auth.person_id, auth.user_name)
        db.commit()
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
        svc = ApprovalService(db)
        svc.reject(approval_id, auth.person_id, auth.user_name, reason=reason or None)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to reject %s: %s", approval_id, e)
    return RedirectResponse("/approvals", status_code=302)
