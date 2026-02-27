"""Git Repos API — manage git repositories and deploy auth."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.schemas.git_repos import GitRepoRead

router = APIRouter(prefix="/git-repos", tags=["git-repos"])


@router.get("", response_model=list[GitRepoRead])
def list_repos(
    active_only: bool = True,
    db: Session = Depends(get_db),
    auth: object = Depends(require_role("admin")),
) -> list[dict[str, object]]:
    from app.services.git_repo_service import GitRepoService

    svc = GitRepoService(db)
    repos = svc.list_repos(active_only=active_only)
    return [svc.serialize_repo(r) for r in repos]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_repo(
    label: str = Body(...),
    auth_type: str = Body("none"),
    credential: str | None = Body(None),
    default_branch: str = Body("main"),
    is_platform_default: bool = Body(False),
    registry_url: str = Body(...),
    db: Session = Depends(get_db),
    auth: object = Depends(require_role("admin")),
) -> dict[str, object]:
    from app.services.git_repo_service import GitRepoService

    try:
        auth_enum = GitRepoService.parse_auth_type(auth_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        repo = GitRepoService(db).create_repo(
            label=label,
            auth_type=auth_enum,
            credential=credential,
            default_branch=default_branch,
            is_platform_default=is_platform_default,
            registry_url=registry_url,
        )
        db.commit()
        return GitRepoService.serialize_repo(repo)
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{repo_id}", response_model=GitRepoRead)
def update_repo(
    repo_id: UUID,
    label: str | None = Body(None),
    auth_type: str | None = Body(None),
    credential: str | None = Body(None),
    default_branch: str | None = Body(None),
    is_platform_default: bool | None = Body(None),
    is_active: bool | None = Body(None),
    registry_url: str | None = Body(None),
    db: Session = Depends(get_db),
    auth: object = Depends(require_role("admin")),
) -> dict[str, object]:
    from app.services.git_repo_service import GitRepoService

    kwargs: dict[str, object] = {
        "label": label,
        "credential": credential,
        "default_branch": default_branch,
        "is_platform_default": is_platform_default,
        "is_active": is_active,
        "registry_url": registry_url,
    }
    if auth_type is not None:
        try:
            kwargs["auth_type"] = GitRepoService.parse_auth_type(auth_type)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    try:
        repo = GitRepoService(db).update_repo(repo_id, **kwargs)
        db.commit()
        return GitRepoService.serialize_repo(repo)
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{repo_id}")
def delete_repo(
    repo_id: UUID,
    db: Session = Depends(get_db),
    auth: object = Depends(require_role("admin")),
) -> dict[str, str]:
    from app.services.git_repo_service import GitRepoService

    try:
        GitRepoService(db).delete_repo(repo_id)
        db.commit()
        return {"deleted": str(repo_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
