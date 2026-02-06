"""
Alerts — Web routes for alert rules and recent alert events.
"""
import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.models.alert_rule import AlertChannel, AlertMetric, AlertOperator
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
    from app.services.instance_service import InstanceService

    svc = AlertService(db)
    rules = svc.list_rules(active_only=False)
    events = svc.get_events(limit=50)
    instances = InstanceService(db).list_all()

    return templates.TemplateResponse(
        "alerts/index.html",
        ctx(
            request,
            auth,
            "Alerts",
            active_page="alerts",
            rules=rules,
            events=events,
            instances=instances,
            metrics=[m.value for m in AlertMetric],
            operators=[o.value for o in AlertOperator],
            channels=[c.value for c in AlertChannel],
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
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.alert_service import AlertService
    from app.services.common import coerce_uuid

    svc = AlertService(db)
    try:
        svc.create_rule(
            name=name.strip(),
            metric=AlertMetric(metric),
            operator=AlertOperator(operator),
            threshold=threshold,
            channel=AlertChannel(channel),
            instance_id=coerce_uuid(instance_id) if instance_id else None,
            cooldown_minutes=cooldown_minutes,
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
