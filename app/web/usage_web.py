"""
Usage — Web routes for usage and billing summaries.
"""

from datetime import UTC, datetime, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.models.usage_record import UsageMetric
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/usage")


@router.get("", response_class=HTMLResponse)
def usage_page(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    instance_id: UUID | None = None,
    days: int = 30,
):
    require_admin(auth)
    from app.services.instance_service import InstanceService
    from app.services.usage_service import UsageService

    instances = InstanceService(db).list_all()
    if not instance_id and instances:
        instance_id = instances[0].instance_id

    now = datetime.now(UTC)
    period_start = now - timedelta(days=max(days, 1))
    period_end = now
    summary = {}
    records = []
    if instance_id:
        svc = UsageService(db)
        summary = svc.get_billing_summary(instance_id, period_start, period_end)
        records = svc.get_usage(instance_id, metric=None, since=period_start, limit=200)

    return templates.TemplateResponse(
        "usage/index.html",
        ctx(
            request,
            auth,
            "Usage",
            active_page="usage",
            instances=instances,
            instance_id=instance_id,
            summary=summary,
            records=records,
            days=days,
            metrics=[m.value for m in UsageMetric],
            period_start=period_start,
            period_end=period_end,
        ),
    )
