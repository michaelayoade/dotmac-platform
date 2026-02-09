import os
import secrets
from contextlib import asynccontextmanager
from threading import Lock
from time import monotonic

from fastapi import Depends, FastAPI, Request
from fastapi.staticfiles import StaticFiles
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.api.audit import router as audit_router
from app.api.auth import router as auth_router
from app.api.auth_flow import router as auth_flow_router
from app.api.deps import require_role, require_user_auth
from app.api.dr import router as dr_api_router
from app.api.git_repos import router as git_repos_api_router
from app.api.observability import router as observability_api_router
from app.api.persons import router as people_router
from app.api.rbac import router as rbac_router
from app.api.scheduler import router as scheduler_router
from app.api.settings import router as settings_router
from app.api.ssh_keys import router as ssh_keys_api_router
from app.config import settings
from app.db import SessionLocal
from app.errors import register_error_handlers
from app.logging import configure_logging
from app.models.domain_settings import DomainSetting, SettingDomain
from app.observability import ObservabilityMiddleware
from app.services import audit as audit_service
from app.services.settings_seed import (
    seed_audit_settings,
    seed_auth_settings,
    seed_scheduled_tasks,
    seed_scheduler_settings,
)
from app.telemetry import setup_otel
from app.web.alerts_web import router as alerts_web_router
from app.web.approvals_web import router as approvals_web_router
from app.web.audit_web import router as audit_web_router
from app.web.auth_web import router as auth_web_router
from app.web.clone_web import router as clone_web_router
from app.web.dashboard import router as dashboard_router
from app.web.domains_web import router as domains_web_router
from app.web.dr_web import router as dr_web_router
from app.web.drift_web import router as drift_web_router
from app.web.git_repos_web import router as git_repos_web_router
from app.web.helpers import CSRF_COOKIE_NAME
from app.web.instances import router as instances_router
from app.web.logs_web import router as logs_web_router
from app.web.maintenance_web import router as maintenance_web_router
from app.web.notifications_web import router as notifications_web_router
from app.web.people import router as people_web_router
from app.web.platform_settings import router as platform_settings_router
from app.web.rbac_web import router as rbac_web_router
from app.web.scheduler_web import router as scheduler_web_router
from app.web.secrets_web import router as secrets_web_router
from app.web.servers import router as servers_router
from app.web.ssh_keys_web import router as ssh_keys_web_router
from app.web.usage_web import router as usage_web_router
from app.web.webhooks_web import router as webhooks_web_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        seed_auth_settings(db)
        seed_audit_settings(db)
        seed_scheduler_settings(db)
        seed_scheduled_tasks(db)
        # Seed modules and plans
        from app.services.module_service import ModuleService
        from app.services.plan_service import PlanService

        ModuleService(db).seed_modules()
        PlanService(db).seed_plans()
        db.commit()
    finally:
        db.close()
    yield


app = FastAPI(title="DotMac Platform API", lifespan=lifespan)

_AUDIT_SETTINGS_CACHE: dict | None = None
_AUDIT_SETTINGS_CACHE_AT: float | None = None
_AUDIT_SETTINGS_CACHE_TTL_SECONDS = 30.0
_AUDIT_SETTINGS_LOCK = Lock()
configure_logging()
setup_otel(app)
app.add_middleware(ObservabilityMiddleware)
register_error_handlers(app)


@app.middleware("http")
async def csrf_middleware(request: Request, call_next):
    if not request.cookies.get("access_token") and not request.cookies.get(CSRF_COOKIE_NAME):
        request.state.csrf_session = secrets.token_urlsafe(32)
    response = await call_next(request)
    # Issue CSRF session cookie for anonymous users.
    if not request.cookies.get("access_token") and not request.cookies.get(CSRF_COOKIE_NAME):
        response.set_cookie(
            CSRF_COOKIE_NAME,
            request.state.csrf_session,
            httponly=True,
            samesite="lax",
            secure=not settings.testing,
            max_age=3600 * 4,
        )
    return response


@app.middleware("http")
async def audit_middleware(request: Request, call_next):
    response: Response
    if settings.testing:
        return await call_next(request)
    path = request.url.path
    db = SessionLocal()
    try:
        audit_settings = _load_audit_settings(db)
        if not audit_settings["enabled"]:
            return await call_next(request)
        header_key = audit_settings.get("read_trigger_header") or ""
        header_value = request.headers.get(header_key, "") if header_key else ""
        track_read = request.method == "GET" and (
            (header_value or "").lower() == "true"
            or request.query_params.get(audit_settings["read_trigger_query"]) == "true"
        )
        should_log = request.method in audit_settings["methods"] or track_read
        if _is_audit_path_skipped(path, audit_settings["skip_paths"]):
            should_log = False
        try:
            response = await call_next(request)
        except Exception:
            if should_log:
                audit_service.audit_events.log_request(db, request, Response(status_code=500))
            raise
        if should_log:
            audit_service.audit_events.log_request(db, request, response)
        return response
    finally:
        db.close()


def _load_audit_settings(db: Session):
    global _AUDIT_SETTINGS_CACHE, _AUDIT_SETTINGS_CACHE_AT
    now = monotonic()
    with _AUDIT_SETTINGS_LOCK:
        if (
            _AUDIT_SETTINGS_CACHE
            and _AUDIT_SETTINGS_CACHE_AT
            and now - _AUDIT_SETTINGS_CACHE_AT < _AUDIT_SETTINGS_CACHE_TTL_SECONDS
        ):
            return _AUDIT_SETTINGS_CACHE

        defaults = {
            "enabled": True,
            "methods": {"POST", "PUT", "PATCH", "DELETE"},
            "skip_paths": ["/static", "/health"],
            "read_trigger_header": "x-audit-read",
            "read_trigger_query": "audit",
        }
        stmt = (
            select(DomainSetting)
            .where(DomainSetting.domain == SettingDomain.audit)
            .where(DomainSetting.is_active.is_(True))
        )
        rows = list(db.scalars(stmt).all())
        values = {row.key: row for row in rows}
        if "enabled" in values:
            defaults["enabled"] = _to_bool(values["enabled"])
        if "methods" in values:
            defaults["methods"] = _to_list(values["methods"], upper=True)
        if "skip_paths" in values:
            defaults["skip_paths"] = _to_list(values["skip_paths"], upper=False)
        if "read_trigger_header" in values:
            defaults["read_trigger_header"] = _to_str(values["read_trigger_header"])
        if "read_trigger_query" in values:
            defaults["read_trigger_query"] = _to_str(values["read_trigger_query"])

        _AUDIT_SETTINGS_CACHE = defaults
        _AUDIT_SETTINGS_CACHE_AT = now
        return defaults


def _to_bool(setting: DomainSetting) -> bool:
    value = setting.value_json if setting.value_json is not None else setting.value_text
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "on"}
    return False


def _to_str(setting: DomainSetting) -> str:
    value = setting.value_text if setting.value_text is not None else setting.value_json
    if value is None:
        return ""
    return str(value)


def _to_list(setting: DomainSetting, upper: bool) -> set[str] | list[str]:
    value = setting.value_json if setting.value_json is not None else setting.value_text
    items: list[str]
    if isinstance(value, list):
        items = [str(item).strip() for item in value if str(item).strip()]
    elif isinstance(value, str):
        items = [item.strip() for item in value.split(",") if item.strip()]
    else:
        items = []
    if upper:
        return {item.upper() for item in items}
    return items


def _is_audit_path_skipped(path: str, skip_paths: list[str]) -> bool:
    return any(path.startswith(prefix) for prefix in skip_paths)


def _include_api_router(router, dependencies=None):
    app.include_router(router, dependencies=dependencies)
    app.include_router(router, prefix="/api/v1", dependencies=dependencies)


_include_api_router(auth_router, dependencies=[Depends(require_role("admin"))])
_include_api_router(auth_flow_router)
_include_api_router(rbac_router, dependencies=[Depends(require_user_auth)])
_include_api_router(people_router, dependencies=[Depends(require_user_auth)])
_include_api_router(audit_router)
_include_api_router(settings_router, dependencies=[Depends(require_user_auth)])
_include_api_router(scheduler_router, dependencies=[Depends(require_user_auth)])

from app.api.instances import router as instances_api_router

_include_api_router(instances_api_router, dependencies=[Depends(require_user_auth)])

from app.api.notifications import router as notifications_api_router

_include_api_router(notifications_api_router, dependencies=[Depends(require_user_auth)])
_include_api_router(observability_api_router, dependencies=[Depends(require_user_auth)])
_include_api_router(ssh_keys_api_router, dependencies=[Depends(require_user_auth)])
_include_api_router(git_repos_api_router, dependencies=[Depends(require_user_auth)])
_include_api_router(dr_api_router, dependencies=[Depends(require_user_auth)])

app.include_router(auth_web_router)
app.include_router(dashboard_router)
app.include_router(servers_router)
app.include_router(instances_router)
app.include_router(platform_settings_router)
app.include_router(people_web_router)
app.include_router(rbac_web_router)
app.include_router(audit_web_router)
app.include_router(approvals_web_router)
app.include_router(alerts_web_router)
app.include_router(scheduler_web_router)
app.include_router(maintenance_web_router)
app.include_router(usage_web_router)
app.include_router(webhooks_web_router)
app.include_router(secrets_web_router)
app.include_router(domains_web_router)
app.include_router(drift_web_router)
app.include_router(clone_web_router)
app.include_router(notifications_web_router)
app.include_router(logs_web_router)
app.include_router(ssh_keys_web_router)
app.include_router(git_repos_web_router)
app.include_router(dr_web_router)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/health")
def health_check():
    checks = {"db": False, "redis": False}

    # Check database connectivity
    try:
        db = SessionLocal()
        db.execute(DomainSetting.__table__.select().limit(1))
        checks["db"] = True
    except Exception:
        pass
    finally:
        try:
            db.close()
        except Exception:
            pass

    # Check Redis connectivity
    try:
        import redis as redis_lib

        redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
        r = redis_lib.from_url(redis_url, socket_timeout=2)
        r.ping()
        checks["redis"] = True
    except Exception:
        pass

    all_ok = all(checks.values())
    return {
        "status": "ok" if all_ok else "degraded",
        "checks": checks,
    }


@app.get("/metrics", dependencies=[Depends(require_user_auth)])
def metrics():
    data = generate_latest()
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)
