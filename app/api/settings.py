import json

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import require_role, require_user_auth
from app.db import SessionLocal
from app.models.domain_settings import DomainSetting, SettingDomain
from app.schemas.common import ListResponse
from app.schemas.settings import DomainSettingRead, DomainSettingUpdate
from app.services.platform_settings import PLATFORM_DEFAULTS
from app.services import settings_api as settings_service

router = APIRouter(prefix="/settings", tags=["settings"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/auth",
    response_model=ListResponse[DomainSettingRead],
    tags=["settings-auth"],
    dependencies=[Depends(require_role("admin"))],
)
def list_auth_settings(
    is_active: bool | None = None,
    order_by: str = Query(default="created_at"),
    order_dir: str = Query(default="desc", pattern="^(asc|desc)$"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    return settings_service.list_auth_settings_response(db, is_active, order_by, order_dir, limit, offset)


@router.put(
    "/auth/{key}",
    response_model=DomainSettingRead,
    status_code=status.HTTP_200_OK,
    tags=["settings-auth"],
    dependencies=[Depends(require_role("admin"))],
)
def upsert_auth_setting(key: str, payload: DomainSettingUpdate, db: Session = Depends(get_db)):
    return settings_service.upsert_auth_setting(db, key, payload)


@router.get(
    "/auth/{key}",
    response_model=DomainSettingRead,
    tags=["settings-auth"],
    dependencies=[Depends(require_role("admin"))],
)
def get_auth_setting(key: str, db: Session = Depends(get_db)):
    return settings_service.get_auth_setting(db, key)


@router.get(
    "/audit",
    response_model=ListResponse[DomainSettingRead],
    tags=["settings-audit"],
    dependencies=[Depends(require_user_auth)],
)
def list_audit_settings(
    is_active: bool | None = None,
    order_by: str = Query(default="created_at"),
    order_dir: str = Query(default="desc", pattern="^(asc|desc)$"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    return settings_service.list_audit_settings_response(db, is_active, order_by, order_dir, limit, offset)


@router.put(
    "/audit/{key}",
    response_model=DomainSettingRead,
    status_code=status.HTTP_200_OK,
    tags=["settings-audit"],
    dependencies=[Depends(require_role("admin"))],
)
def upsert_audit_setting(key: str, payload: DomainSettingUpdate, db: Session = Depends(get_db)):
    return settings_service.upsert_audit_setting(db, key, payload)


@router.get(
    "/audit/{key}",
    response_model=DomainSettingRead,
    tags=["settings-audit"],
    dependencies=[Depends(require_user_auth)],
)
def get_audit_setting(key: str, db: Session = Depends(get_db)):
    return settings_service.get_audit_setting(db, key)


@router.get(
    "/scheduler",
    response_model=ListResponse[DomainSettingRead],
    tags=["settings-scheduler"],
    dependencies=[Depends(require_user_auth)],
)
def list_scheduler_settings(
    is_active: bool | None = None,
    order_by: str = Query(default="created_at"),
    order_dir: str = Query(default="desc", pattern="^(asc|desc)$"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    return settings_service.list_scheduler_settings_response(db, is_active, order_by, order_dir, limit, offset)


@router.put(
    "/scheduler/{key}",
    response_model=DomainSettingRead,
    status_code=status.HTTP_200_OK,
    tags=["settings-scheduler"],
    dependencies=[Depends(require_role("admin"))],
)
def upsert_scheduler_setting(key: str, payload: DomainSettingUpdate, db: Session = Depends(get_db)):
    return settings_service.upsert_scheduler_setting(db, key, payload)


@router.get(
    "/scheduler/{key}",
    response_model=DomainSettingRead,
    tags=["settings-scheduler"],
    dependencies=[Depends(require_user_auth)],
)
def get_scheduler_setting(key: str, db: Session = Depends(get_db)):
    return settings_service.get_scheduler_setting(db, key)


@router.get(
    "/export",
    tags=["settings"],
    dependencies=[Depends(require_role("admin"))],
)
def export_platform_settings(db: Session = Depends(get_db)) -> Response:
    # Export defaults plus active non-secret DB overrides. Keys with active secret
    # values are intentionally excluded from this export.
    result = dict(PLATFORM_DEFAULTS)
    active_rows = (
        db.query(DomainSetting)
        .filter(
            DomainSetting.domain == SettingDomain.platform,
            DomainSetting.is_active.is_(True),
        )
        .all()
    )

    for row in active_rows:
        if row.is_secret:
            result.pop(row.key, None)
            continue
        result[row.key] = row.value_json if row.value_json is not None else row.value_text

    body = json.dumps(result, indent=2, sort_keys=True)
    return Response(
        content=body,
        media_type="application/json",
        headers={"Content-Disposition": 'attachment; filename="platform-settings.json"'},
    )
