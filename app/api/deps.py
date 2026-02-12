from uuid import UUID

from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models.instance import Instance
from app.models.organization import Organization
from app.services.auth_dependencies import (
    require_audit_auth,
    require_permission,
    require_role,
    require_user_auth,
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def require_instance_access(
    instance_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    org_id = auth.get("org_id")
    instance = db.get(Instance, instance_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
    if not org_id or not instance.org_id or str(instance.org_id) != str(org_id):
        raise HTTPException(status_code=403, detail="Forbidden")
    return instance


def require_org_access(
    org_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    actor_org_id = auth.get("org_id")
    if not actor_org_id or str(actor_org_id) != str(org_id):
        raise HTTPException(status_code=403, detail="Forbidden")
    org = db.get(Organization, org_id)
    if not org or not org.is_active:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


def require_instance_access_from_path(
    request: Request,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    instance_id = request.path_params.get("instance_id")
    if not instance_id:
        return None
    try:
        instance_uuid = UUID(str(instance_id))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid instance_id")
    return require_instance_access(instance_uuid, db=db, auth=auth)


__all__ = [
    "get_db",
    "require_audit_auth",
    "require_permission",
    "require_role",
    "require_user_auth",
    "require_instance_access",
    "require_instance_access_from_path",
    "require_org_access",
]
