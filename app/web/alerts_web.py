"""
Alerts — Web routes for alert rules and recent alert events.
"""

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
router = APIRouter(prefix="/alerts")


@router.get("", response_class=HTMLResponse)
def alerts_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.alert_service import AlertService

    svc = AlertService(db)
    bundle = svc.get_index_bundle()

    return templates.TemplateResponse(
        "alerts/index.html",
        ctx(
            request,
            auth,
            "Alerts",
            active_page="alerts",
            rules=bundle["rules"],
            events=bundle["events"],
            instances=bundle["instances"],
            metrics=bundle["metrics"],
            operators=bundle["operators"],
            channels=bundle["channels"],
        ),
    )


@router.post("/rules")
def alerts_create_rule(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    name: str = Form(...),
    metric: str = Form(...),
    operator: str = Form(...),
    threshold: float = Form(...),
    channel: str = Form("webhook"),
    instance_id: str = Form(""),
    cooldown_minutes: int = Form(15),
    email_recipients: str = Form(""),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.alert_service import AlertService

    svc = AlertService(db)
    try:
        svc.create_rule_from_form(
            name=name,
            metric=metric,
            operator=operator,
            threshold=threshold,
            channel=channel,
            instance_id=instance_id,
            cooldown_minutes=cooldown_minutes,
            email_recipients=email_recipients,
        )
        db.commit()
    except ValueError:
        return RedirectResponse("/alerts", status_code=302)
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create alert rule: %s", e)
    return RedirectResponse("/alerts", status_code=302)


@router.post("/rules/{rule_id}/deactivate")
def alerts_deactivate_rule(
    request: Request,
    rule_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.alert_service import AlertService

    svc = AlertService(db)
    svc.delete_rule(rule_id)
    db.commit()
    return RedirectResponse("/alerts", status_code=302)
