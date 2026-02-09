"""
Approvals — Web routes for deployment approvals.
"""

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Form, HTTPException, Request
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
    history = list(db.scalars(select(DeployApproval).order_by(DeployApproval.created_at.desc()).limit(100)).all())

    instances = InstanceService(db).list_all()
    inst_map = {i.instance_id: i for i in instances}
    upgrade_map: dict[UUID, dict] = {}
    upgrade_ids = {a.upgrade_id for a in pending + history if a.upgrade_id}
    if upgrade_ids:
        from app.models.app_upgrade import AppUpgrade
        from app.models.catalog import AppCatalogItem, AppRelease

        upgrades = list(db.scalars(select(AppUpgrade).where(AppUpgrade.upgrade_id.in_(upgrade_ids))).all())
        catalog_ids = {u.catalog_item_id for u in upgrades}
        items = list(db.scalars(select(AppCatalogItem).where(AppCatalogItem.catalog_id.in_(catalog_ids))).all())
        item_map = {i.catalog_id: i for i in items}
        release_ids = {i.release_id for i in items}
        releases = list(db.scalars(select(AppRelease).where(AppRelease.release_id.in_(release_ids))).all())
        release_map = {r.release_id: r for r in releases}

        for up in upgrades:
            item = item_map.get(up.catalog_item_id)
            release = release_map.get(item.release_id) if item else None
            upgrade_map[up.upgrade_id] = {
                "catalog_label": item.label if item else None,
                "release_version": release.version if release else None,
                "release_name": release.name if release else None,
            }

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
            upgrade_map=upgrade_map,
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
        upgrade_eta = None
        upgrade_id = None
        if approval.deployment_type == "upgrade" and approval.upgrade_id:
            from app.models.app_upgrade import AppUpgrade

            upgrade = db.get(AppUpgrade, approval.upgrade_id)
            if upgrade:
                upgrade_id = str(upgrade.upgrade_id)
                upgrade_eta = upgrade.scheduled_for
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
