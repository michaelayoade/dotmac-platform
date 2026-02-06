import logging

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.models.person import Person
from app.models.rbac import Permission, PersonRole, Role, RolePermission
from app.schemas.rbac import (
    PermissionCreate,
    PermissionUpdate,
    PersonRoleCreate,
    PersonRoleUpdate,
    RoleCreate,
    RolePermissionCreate,
    RolePermissionUpdate,
    RoleUpdate,
)
from app.services.common import apply_ordering, apply_pagination, coerce_uuid
from app.services.response import ListResponseMixin


class Roles(ListResponseMixin):
    @staticmethod
    def create(db: Session, payload: RoleCreate):
        role = Role(**payload.model_dump())
        db.add(role)
        db.flush()
        db.refresh(role)
        return role

    @staticmethod
    def get(db: Session, role_id: str):
        role = db.get(Role, coerce_uuid(role_id))
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        return role

    @staticmethod
    def list(
        db: Session,
        is_active: bool | None,
        order_by: str,
        order_dir: str,
        limit: int,
        offset: int,
    ):
        stmt = select(Role)
        if is_active is None:
            stmt = stmt.where(Role.is_active.is_(True))
        else:
            stmt = stmt.where(Role.is_active == is_active)
        stmt = apply_ordering(
            stmt,
            order_by,
            order_dir,
            {"created_at": Role.created_at, "name": Role.name},
        )
        stmt = apply_pagination(stmt, limit, offset)
        return list(db.scalars(stmt).all())

    @staticmethod
    def update(db: Session, role_id: str, payload: RoleUpdate):
        role = db.get(Role, coerce_uuid(role_id))
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(role, key, value)
        db.flush()
        db.refresh(role)
        return role

    @staticmethod
    def delete(db: Session, role_id: str):
        role = db.get(Role, coerce_uuid(role_id))
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        role.is_active = False
        db.flush()


class Permissions(ListResponseMixin):
    @staticmethod
    def create(db: Session, payload: PermissionCreate):
        permission = Permission(**payload.model_dump())
        db.add(permission)
        db.flush()
        db.refresh(permission)
        return permission

    @staticmethod
    def get(db: Session, permission_id: str):
        permission = db.get(Permission, coerce_uuid(permission_id))
        if not permission:
            raise HTTPException(status_code=404, detail="Permission not found")
        return permission

    @staticmethod
    def list(
        db: Session,
        is_active: bool | None,
        order_by: str,
        order_dir: str,
        limit: int,
        offset: int,
    ):
        stmt = select(Permission)
        if is_active is None:
            stmt = stmt.where(Permission.is_active.is_(True))
        else:
            stmt = stmt.where(Permission.is_active == is_active)
        stmt = apply_ordering(
            stmt,
            order_by,
            order_dir,
            {"created_at": Permission.created_at, "key": Permission.key},
        )
        stmt = apply_pagination(stmt, limit, offset)
        return list(db.scalars(stmt).all())

    @staticmethod
    def update(db: Session, permission_id: str, payload: PermissionUpdate):
        permission = db.get(Permission, coerce_uuid(permission_id))
        if not permission:
            raise HTTPException(status_code=404, detail="Permission not found")
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(permission, key, value)
        db.flush()
        db.refresh(permission)
        return permission

    @staticmethod
    def delete(db: Session, permission_id: str):
        permission = db.get(Permission, coerce_uuid(permission_id))
        if not permission:
            raise HTTPException(status_code=404, detail="Permission not found")
        permission.is_active = False
        db.flush()


class RolePermissions(ListResponseMixin):
    @staticmethod
    def create(db: Session, payload: RolePermissionCreate):
        role = db.get(Role, coerce_uuid(payload.role_id))
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        permission = db.get(Permission, coerce_uuid(payload.permission_id))
        if not permission:
            raise HTTPException(status_code=404, detail="Permission not found")
        link = RolePermission(**payload.model_dump())
        db.add(link)
        db.flush()
        db.refresh(link)
        return link

    @staticmethod
    def get(db: Session, link_id: str):
        link = db.get(RolePermission, coerce_uuid(link_id))
        if not link:
            raise HTTPException(status_code=404, detail="Role permission not found")
        return link

    @staticmethod
    def list(
        db: Session,
        role_id: str | None,
        permission_id: str | None,
        order_by: str,
        order_dir: str,
        limit: int,
        offset: int,
    ):
        stmt = select(RolePermission)
        if role_id:
            stmt = stmt.where(RolePermission.role_id == coerce_uuid(role_id))
        if permission_id:
            stmt = stmt.where(RolePermission.permission_id == coerce_uuid(permission_id))
        stmt = apply_ordering(
            stmt,
            order_by,
            order_dir,
            {"role_id": RolePermission.role_id},
        )
        stmt = apply_pagination(stmt, limit, offset)
        return list(db.scalars(stmt).all())

    @staticmethod
    def update(db: Session, link_id: str, payload: RolePermissionUpdate):
        link = db.get(RolePermission, coerce_uuid(link_id))
        if not link:
            raise HTTPException(status_code=404, detail="Role permission not found")
        data = payload.model_dump(exclude_unset=True)
        if "role_id" in data:
            role = db.get(Role, data["role_id"])
            if not role:
                raise HTTPException(status_code=404, detail="Role not found")
        if "permission_id" in data:
            permission = db.get(Permission, data["permission_id"])
            if not permission:
                raise HTTPException(status_code=404, detail="Permission not found")
        for key, value in data.items():
            setattr(link, key, value)
        db.flush()
        db.refresh(link)
        return link

    @staticmethod
    def delete(db: Session, link_id: str):
        link = db.get(RolePermission, coerce_uuid(link_id))
        if not link:
            raise HTTPException(status_code=404, detail="Role permission not found")
        db.delete(link)
        db.flush()


class PersonRoles(ListResponseMixin):
    @staticmethod
    def create(db: Session, payload: PersonRoleCreate):
        person = db.get(Person, coerce_uuid(payload.person_id))
        if not person:
            raise HTTPException(status_code=404, detail="Person not found")
        role = db.get(Role, coerce_uuid(payload.role_id))
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        link = PersonRole(**payload.model_dump())
        db.add(link)
        db.flush()
        db.refresh(link)
        return link

    @staticmethod
    def get(db: Session, link_id: str):
        link = db.get(PersonRole, coerce_uuid(link_id))
        if not link:
            raise HTTPException(status_code=404, detail="Person role not found")
        return link

    @staticmethod
    def list(
        db: Session,
        person_id: str | None,
        role_id: str | None,
        order_by: str,
        order_dir: str,
        limit: int,
        offset: int,
    ):
        stmt = select(PersonRole)
        if person_id:
            stmt = stmt.where(PersonRole.person_id == coerce_uuid(person_id))
        if role_id:
            stmt = stmt.where(PersonRole.role_id == coerce_uuid(role_id))
        stmt = apply_ordering(
            stmt,
            order_by,
            order_dir,
            {"assigned_at": PersonRole.assigned_at},
        )
        stmt = apply_pagination(stmt, limit, offset)
        return list(db.scalars(stmt).all())

    @staticmethod
    def update(db: Session, link_id: str, payload: PersonRoleUpdate):
        link = db.get(PersonRole, coerce_uuid(link_id))
        if not link:
            raise HTTPException(status_code=404, detail="Person role not found")
        data = payload.model_dump(exclude_unset=True)
        if "person_id" in data:
            person = db.get(Person, data["person_id"])
            if not person:
                raise HTTPException(status_code=404, detail="Person not found")
        if "role_id" in data:
            role = db.get(Role, data["role_id"])
            if not role:
                raise HTTPException(status_code=404, detail="Role not found")
        for key, value in data.items():
            setattr(link, key, value)
        db.flush()
        db.refresh(link)
        return link

    @staticmethod
    def delete(db: Session, link_id: str):
        link = db.get(PersonRole, coerce_uuid(link_id))
        if not link:
            raise HTTPException(status_code=404, detail="Person role not found")
        db.delete(link)
        db.flush()


roles = Roles()
permissions = Permissions()
role_permissions = RolePermissions()
person_roles = PersonRoles()
