"""Git Repos API — manage git repositories and deploy auth."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role

router = APIRouter(prefix="/git-repos", tags=["git-repos"])


@router.get("")
def list_repos(
    active_only: bool = True,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.git_repo_service import GitRepoService

    repos = GitRepoService(db).list_repos(active_only=active_only)
    return [
        {
            "repo_id": str(r.repo_id),
            "label": r.label,
            "url": r.url,
            "auth_type": r.auth_type.value,
            "default_branch": r.default_branch,
            "is_platform_default": r.is_platform_default,
            "is_active": r.is_active,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "updated_at": r.updated_at.isoformat() if r.updated_at else None,
        }
        for r in repos
    ]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_repo(
    label: str = Body(...),
    url: str = Body(...),
    auth_type: str = Body("none"),
    credential: str | None = Body(None),
    default_branch: str = Body("main"),
    is_platform_default: bool = Body(False),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.models.git_repository import GitAuthType
    from app.services.git_repo_service import GitRepoService

    try:
        auth_enum = GitAuthType(auth_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid auth_type")

    try:
        repo = GitRepoService(db).create_repo(
            label=label,
            url=url,
            auth_type=auth_enum,
            credential=credential,
            default_branch=default_branch,
            is_platform_default=is_platform_default,
        )
        db.commit()
        return {"repo_id": str(repo.repo_id), "label": repo.label}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{repo_id}")
def update_repo(
    repo_id: UUID,
    label: str | None = Body(None),
    url: str | None = Body(None),
    auth_type: str | None = Body(None),
    credential: str | None = Body(None),
    default_branch: str | None = Body(None),
    is_platform_default: bool | None = Body(None),
    is_active: bool | None = Body(None),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.models.git_repository import GitAuthType
    from app.services.git_repo_service import GitRepoService

    kwargs: dict = {
        "label": label,
        "url": url,
        "credential": credential,
        "default_branch": default_branch,
        "is_platform_default": is_platform_default,
        "is_active": is_active,
    }
    if auth_type is not None:
        try:
            kwargs["auth_type"] = GitAuthType(auth_type)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid auth_type")

    try:
        repo = GitRepoService(db).update_repo(repo_id, **kwargs)
        db.commit()
        return {"repo_id": str(repo.repo_id), "label": repo.label}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{repo_id}/test")
def test_repo(
    repo_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.git_repo_service import GitRepoService

    try:
        return GitRepoService(db).test_connection(repo_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{repo_id}")
def delete_repo(
    repo_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.git_repo_service import GitRepoService

    try:
        GitRepoService(db).delete_repo(repo_id)
        db.commit()
        return {"deleted": str(repo_id)}
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
