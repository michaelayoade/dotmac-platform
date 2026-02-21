from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.services.common import coerce_uuid
from app.services.onboarding_service import OnboardingService
from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, validate_csrf_token

logger = logging.getLogger(__name__)
templates = Jinja2Templates(directory="templates")
router = APIRouter()


@router.get("/onboarding", response_class=HTMLResponse)
def onboarding_page(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> Response:
    svc = OnboardingService(db)
    person_id = coerce_uuid(auth.person_id)
    checklist = svc.get_checklist_safe(person_id)
    return templates.TemplateResponse(
        "onboarding.html",
        ctx(request, auth, "Getting Started", active_page="onboarding", checklist=checklist),
    )


@router.post("/onboarding/dismiss")
async def dismiss_onboarding(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> Response:
    form = await request.form()
    csrf_token = str(form.get("csrf_token") or "") or request.headers.get("x-csrf-token")
    validate_csrf_token(request, csrf_token)
    person_id = coerce_uuid(auth.person_id)
    if person_id:
        svc = OnboardingService(db)
        svc.mark_completed(person_id)
        db.commit()
    return Response(status_code=200, headers={"HX-Trigger": "onboarding-dismissed"})
