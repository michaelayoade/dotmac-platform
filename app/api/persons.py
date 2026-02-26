from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db import SessionLocal
from app.schemas.common import ListResponse
from app.schemas.person import PersonCreate, PersonRead, PersonUpdate
from app.services import person as person_service

router = APIRouter(prefix="/people", tags=["people"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=PersonRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("admin"))],
)
def create_person(payload: PersonCreate, request: Request, db: Session = Depends(get_db)):
    org_id = getattr(request.state, "org_id", None)
    if org_id and not payload.org_id:
        payload = payload.model_copy(update={"org_id": org_id})
    return person_service.people.create(db, payload)


@router.get("/{person_id}", response_model=PersonRead)
def get_person(person_id: str, request: Request, db: Session = Depends(get_db)):
    org_id = getattr(request.state, "org_id", None)
    return person_service.people.get(db, person_id, org_id=org_id)


@router.get("", response_model=ListResponse[PersonRead])
def list_people(
    request: Request,
    query: str | None = Query(default=None),
    email: str | None = None,
    status: str | None = None,
    is_active: bool | None = None,
    order_by: str = Query(default="created_at"),
    order_dir: str = Query(default="desc", pattern="^(asc|desc)$"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    org_id = getattr(request.state, "org_id", None)
    return person_service.people.list_response(
        db, query, email, status, is_active, order_by, order_dir, limit, offset, org_id=org_id
    )


@router.patch(
    "/{person_id}",
    response_model=PersonRead,
    dependencies=[Depends(require_role("admin"))],
)
def update_person(person_id: str, payload: PersonUpdate, request: Request, db: Session = Depends(get_db)):
    org_id = getattr(request.state, "org_id", None)
    return person_service.people.update(db, person_id, payload, org_id=org_id)


@router.delete(
    "/{person_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_role("admin"))],
)
def delete_person(person_id: str, request: Request, db: Session = Depends(get_db)):
    org_id = getattr(request.state, "org_id", None)
    person_service.people.delete(db, person_id, org_id=org_id)
