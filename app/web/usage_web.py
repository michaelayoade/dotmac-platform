"""
Usage — Web routes for usage and billing summaries.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

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
    from app.services.usage_service import UsageService

    bundle = UsageService(db).get_index_bundle(instance_id, days)

    return templates.TemplateResponse(
        "usage/index.html",
        ctx(
            request,
            auth,
            "Usage",
            active_page="usage",
            instances=bundle["instances"],
            instance_id=bundle["instance_id"],
            summary=bundle["summary"],
            records=bundle["records"],
            days=bundle["days"],
            metrics=bundle["metrics"],
            period_start=bundle["period_start"],
            period_end=bundle["period_end"],
        ),
    )
