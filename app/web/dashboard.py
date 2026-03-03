"""
Dashboard — Main landing page showing instance grid and health summary.
"""

import logging

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse, Response
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx

logger = logging.getLogger(__name__)
templates = Jinja2Templates(directory="templates")
router = APIRouter()


@router.get("/", response_class=HTMLResponse)
def home(request: Request) -> RedirectResponse:
    return RedirectResponse("/dashboard", status_code=302)


@router.get("/dashboard", response_class=HTMLResponse)
def dashboard(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
) -> Response:
    from app.services.common import coerce_uuid
    from app.services.domain_service import DomainService
    from app.services.health_service import HealthService
    from app.services.instance_service import InstanceService
    from app.services.onboarding_service import OnboardingService
    from app.services.organization_service import OrganizationService
    from app.services.server_service import ServerService

    health_svc = HealthService(db)
    instance_svc = InstanceService(db)
    server_svc = ServerService(db)
    org_svc = OrganizationService(db)
    expiring_certs = DomainService(db).get_expiring_certs(14)

    stats = health_svc.get_dashboard_stats()
    instances = instance_svc.list_all()
    servers = server_svc.list_all()

    # Organization data for org-first dashboard
    org_list = org_svc.list_all(active_only=True)
    org_ids = [o.org_id for o in org_list]
    org_instance_counts = org_svc.instance_counts_batch(org_ids) if org_ids else {}

    # Onboarding
    show_onboarding = False
    onboarding_checklist = None
    person_id = coerce_uuid(auth.person_id)
    if person_id:
        onboarding_svc = OnboardingService(db)
        show_onboarding = onboarding_svc.should_show_onboarding(person_id)
        if show_onboarding:
            onboarding_checklist = onboarding_svc.get_checklist(person_id)

    instance_data, etag = health_svc.get_dashboard_instances(instances)

    # ETag for HTMX polling — skip re-render if nothing changed
    is_htmx = request.headers.get("hx-request") == "true"
    if is_htmx:
        if_none_match = request.headers.get("if-none-match")
        if if_none_match and if_none_match == etag:
            return Response(status_code=304, headers={"ETag": etag})

    response = templates.TemplateResponse(
        "dashboard.html",
        ctx(
            request,
            auth,
            "Fleet Overview",
            active_page="dashboard",
            stats=stats,
            instances=instance_data,
            servers=servers,
            org_list=org_list,
            org_instance_counts=org_instance_counts,
            expiring_certs=expiring_certs,
            show_onboarding=show_onboarding,
            onboarding_checklist=onboarding_checklist,
        ),
    )
    response.headers["ETag"] = etag
    return response
