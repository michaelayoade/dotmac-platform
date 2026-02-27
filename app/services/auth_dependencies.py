import logging
from datetime import UTC, datetime

import jwt
from fastapi import Depends, Header, HTTPException, Request
from jwt.exceptions import PyJWTError as JWTError
from sqlalchemy import select
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.db import SessionLocal
from app.models.auth import ApiKey, SessionStatus
from app.models.auth import Session as AuthSession
from app.models.rbac import Permission, PersonRole, Role, RolePermission
from app.services.auth import hash_api_key_candidates
from app.services.auth_flow import decode_access_token, hash_session_token
from app.services.common import coerce_uuid


def _make_aware(dt: datetime | None) -> datetime | None:
    """Ensure datetime is timezone-aware (UTC). SQLite doesn't preserve tz info."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=UTC)
    return dt


def _get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _extract_bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    parts = authorization.split(" ", 1)
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1].strip()
    return None


def _is_jwt(token: str) -> bool:
    try:
        jwt.get_unverified_header(token)
        return True
    except JWTError:
        return False
    except Exception:
        return False


def _has_audit_scope(payload: dict) -> bool:
    scopes: set[str] = set()
    scope_value = payload.get("scope")
    if isinstance(scope_value, str):
        scopes.update(scope_value.split())
    scopes_value = payload.get("scopes")
    if isinstance(scopes_value, list):
        scopes.update(str(item) for item in scopes_value)
    role_value = payload.get("role")
    roles_value = payload.get("roles")
    roles: set[str] = set()
    if isinstance(role_value, str):
        roles.add(role_value)
    if isinstance(roles_value, list):
        roles.update(str(item) for item in roles_value)
    return "audit:read" in scopes or "audit:*" in scopes or "admin" in roles or "auditor" in roles


def require_audit_auth(
    request: Request,
    authorization: str | None = Header(default=None),
    x_session_token: str | None = Header(default=None),
    x_api_key: str | None = Header(default=None),
    db: Session = Depends(_get_db),
):
    token = _extract_bearer_token(authorization) or x_session_token
    now = datetime.now(UTC)
    if token:
        if _is_jwt(token):
            payload = decode_access_token(db, token)
            if not _has_audit_scope(payload):
                raise HTTPException(status_code=403, detail="Insufficient scope")
            session_id = payload.get("session_id")
            if session_id:
                session = db.get(AuthSession, coerce_uuid(session_id))
                if not session:
                    raise HTTPException(status_code=401, detail="Invalid session")
                if session.status != SessionStatus.active or session.revoked_at:
                    raise HTTPException(status_code=401, detail="Invalid session")
                expires_at = _make_aware(session.expires_at)
                if not expires_at or expires_at <= now:
                    raise HTTPException(status_code=401, detail="Session expired")
            actor_id = str(payload.get("sub"))
            org_id = payload.get("org_id")
            request.state.actor_id = actor_id
            request.state.actor_type = "user"
            if org_id:
                request.state.org_id = str(org_id)
            return {"actor_type": "user", "actor_id": actor_id, "org_id": org_id}
        stmt = (
            select(AuthSession)
            .where(AuthSession.token_hash == hash_session_token(token))
            .where(AuthSession.status == SessionStatus.active)
            .where(AuthSession.revoked_at.is_(None))
            .where(AuthSession.expires_at > now)
        )
        session = db.scalar(stmt)
        if session:
            request.state.actor_id = str(session.person_id)
            request.state.actor_type = "user"
            if session.org_id:
                request.state.org_id = str(session.org_id)
            return {
                "actor_type": "user",
                "actor_id": str(session.person_id),
                "org_id": str(session.org_id) if session.org_id else None,
            }
    if x_api_key:
        candidates = hash_api_key_candidates(x_api_key)
        api_key_stmt = (
            select(ApiKey)
            .where(ApiKey.key_hash.in_(candidates))
            .where(ApiKey.is_active.is_(True))
            .where(ApiKey.revoked_at.is_(None))
            .where((ApiKey.expires_at.is_(None)) | (ApiKey.expires_at > now))
        )
        api_key = db.scalar(api_key_stmt)
        if api_key:
            request.state.actor_id = str(api_key.id)
            request.state.actor_type = "api_key"
            if api_key.org_id:
                request.state.org_id = str(api_key.org_id)
            return {
                "actor_type": "api_key",
                "actor_id": str(api_key.id),
                "org_id": str(api_key.org_id) if api_key.org_id else None,
            }
    raise HTTPException(status_code=401, detail="Unauthorized")


def require_user_auth(
    request: Request,
    authorization: str | None = Header(default=None),
    db: Session = Depends(_get_db),
):
    token = _extract_bearer_token(authorization)
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    payload = decode_access_token(db, token)
    person_id = payload.get("sub")
    session_id = payload.get("session_id")
    org_id = payload.get("org_id")
    if not person_id or not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if not org_id:
        raise HTTPException(status_code=401, detail="Organization context required")

    now = datetime.now(UTC)
    person_uuid = coerce_uuid(person_id)
    session_uuid = coerce_uuid(session_id)
    stmt = (
        select(AuthSession)
        .where(AuthSession.id == session_uuid)
        .where(AuthSession.person_id == person_uuid)
        .where(AuthSession.status == SessionStatus.active)
        .where(AuthSession.revoked_at.is_(None))
        .where(AuthSession.expires_at > now)
    )
    session = db.scalar(stmt)
    if not session:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if session.org_id and str(session.org_id) != str(org_id):
        raise HTTPException(status_code=401, detail="Unauthorized")
    expires_at = _make_aware(session.expires_at)
    if expires_at and expires_at <= now:
        raise HTTPException(status_code=401, detail="Unauthorized")
    roles_value = payload.get("roles")
    scopes_value = payload.get("scopes")
    roles = [str(role) for role in roles_value] if isinstance(roles_value, list) else []
    scopes = [str(scope) for scope in scopes_value] if isinstance(scopes_value, list) else []
    actor_id = str(person_id)
    request.state.actor_id = actor_id
    request.state.actor_type = "user"
    request.state.org_id = str(org_id)
    return {
        "person_id": str(person_id),
        "session_id": str(session_id),
        "org_id": str(org_id),
        "roles": roles,
        "scopes": scopes,
    }


def require_role(role_name: str):
    def _require_role(
        auth=Depends(require_user_auth),
        db: Session = Depends(_get_db),
    ):
        person_id = coerce_uuid(auth["person_id"])
        roles = set(auth.get("roles") or [])
        if role_name in roles:
            return auth
        role = db.scalar(select(Role).where(Role.name == role_name).where(Role.is_active.is_(True)))
        if not role:
            raise HTTPException(status_code=403, detail="Role not found")
        link = db.scalar(
            select(PersonRole).where(PersonRole.person_id == person_id).where(PersonRole.role_id == role.id)
        )
        if not link:
            raise HTTPException(status_code=403, detail="Forbidden")
        return auth

    return _require_role


def require_permission(permission_key: str):
    def _require_permission(
        auth=Depends(require_user_auth),
        db: Session = Depends(_get_db),
    ):
        person_id = coerce_uuid(auth["person_id"])
        roles = set(auth.get("roles") or [])
        scopes = set(auth.get("scopes") or [])
        if "admin" in roles or permission_key in scopes:
            return auth
        permission = db.scalar(
            select(Permission).where(Permission.key == permission_key).where(Permission.is_active.is_(True))
        )
        if not permission:
            raise HTTPException(status_code=403, detail="Permission not found")
        has_permission = db.scalar(
            select(RolePermission)
            .join(Role, RolePermission.role_id == Role.id)
            .join(PersonRole, PersonRole.role_id == Role.id)
            .where(PersonRole.person_id == person_id)
            .where(RolePermission.permission_id == permission.id)
            .where(Role.is_active.is_(True))
        )
        if not has_permission:
            raise HTTPException(status_code=403, detail="Forbidden")
        return auth

    return _require_permission
