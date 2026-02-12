from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_org_access, require_role, require_user_auth
from app.schemas.common import ListResponse
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationMemberCreate,
    OrganizationMemberRead,
    OrganizationRead,
    OrganizationUpdate,
)
from app.services.organization_service import OrganizationService

router = APIRouter(prefix="/orgs", tags=["organizations"])


@router.get("", response_model=ListResponse[OrganizationRead])
def list_orgs(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    org_id = auth.get("org_id")
    if not org_id:
        raise HTTPException(status_code=401, detail="Organization context required")
    svc = OrganizationService(db)
    org = svc.get_by_id(UUID(org_id))
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return {"items": [svc.serialize(org)], "count": 1, "limit": limit, "offset": offset}


@router.get("/{org_id}", response_model=OrganizationRead)
def get_org(
    org_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    org = require_org_access(org_id, db=db, auth=auth)
    return OrganizationService(db).serialize(org)


@router.post(
    "",
    response_model=OrganizationRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("admin"))],
)
def create_org(payload: OrganizationCreate, db: Session = Depends(get_db)):
    svc = OrganizationService(db)
    org = svc.create(payload.org_code, payload.org_name)
    db.commit()
    return svc.serialize(org)


@router.patch(
    "/{org_id}",
    response_model=OrganizationRead,
    dependencies=[Depends(require_role("admin"))],
)
def update_org(
    org_id: UUID, payload: OrganizationUpdate, db: Session = Depends(get_db), auth=Depends(require_user_auth)
):
    require_org_access(org_id, db=db, auth=auth)
    svc = OrganizationService(db)
    org = svc.update(org_id, payload)
    db.commit()
    return svc.serialize(org)


@router.get("/{org_id}/members", response_model=ListResponse[OrganizationMemberRead])
def list_members(
    org_id: UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    require_org_access(org_id, db=db, auth=auth)
    svc = OrganizationService(db)
    members = svc.list_members(org_id, limit=limit, offset=offset)
    return {
        "items": [svc.serialize_member(m) for m in members],
        "count": len(members),
        "limit": limit,
        "offset": offset,
    }


@router.post(
    "/{org_id}/members",
    response_model=OrganizationMemberRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("admin"))],
)
def add_member(
    org_id: UUID,
    payload: OrganizationMemberCreate = Body(...),
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    require_org_access(org_id, db=db, auth=auth)
    svc = OrganizationService(db)
    member = svc.add_member(org_id, payload.person_id)
    db.commit()
    return svc.serialize_member(member)


@router.delete(
    "/{org_id}/members/{person_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_role("admin"))],
)
def remove_member(
    org_id: UUID,
    person_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_user_auth),
):
    require_org_access(org_id, db=db, auth=auth)
    svc = OrganizationService(db)
    svc.remove_member(org_id, person_id)
    db.commit()
