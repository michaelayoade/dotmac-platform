"""Git Repos — Web routes for repository management."""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import WebAuthContext, get_db, require_web_auth
from app.web.helpers import ctx, require_admin, validate_csrf_token

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="templates")
router = APIRouter(prefix="/git-repos")


@router.get("", response_class=HTMLResponse)
def git_repos_index(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.git_repo_service import GitRepoService

    repos = GitRepoService(db).list_for_web(active_only=False)
    return templates.TemplateResponse(
        "git_repos/index.html",
        ctx(
            request,
            auth,
            "Git Repositories",
            active_page="git_repos",
            repos=repos,
        ),
    )


@router.post("/create")
def git_repos_create(
    request: Request,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    label: str = Form(...),
    auth_type: str = Form("none"),
    credential: str | None = Form(None),
    default_branch: str = Form("main"),
    is_platform_default: bool = Form(False),
    registry_url: str = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.git_repo_service import GitRepoService

    try:
        GitRepoService(db).create_from_form(
            label=label,
            auth_type=auth_type,
            credential=credential,
            default_branch=default_branch,
            is_platform_default=is_platform_default,
            registry_url=registry_url,
        )
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create git repo: %s", e)
    return RedirectResponse("/git-repos", status_code=302)


@router.get("/{repo_id}/edit", response_class=HTMLResponse)
def git_repos_edit_form(
    request: Request,
    repo_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
):
    require_admin(auth)
    from app.services.git_repo_service import GitRepoService

    repo = GitRepoService(db).get_by_id(repo_id)
    if not repo:
        return RedirectResponse("/git-repos", status_code=302)
    return templates.TemplateResponse(
        "git_repos/edit.html",
        ctx(
            request,
            auth,
            "Edit Repository",
            active_page="git_repos",
            repo=repo,
            errors=None,
        ),
    )


@router.post("/{repo_id}/edit")
def git_repos_edit(
    request: Request,
    repo_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    label: str = Form(...),
    auth_type: str = Form("none"),
    credential: str | None = Form(None),
    default_branch: str = Form("main"),
    is_platform_default: bool = Form(False),
    registry_url: str = Form(...),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.git_repo_service import GitRepoService

    svc = GitRepoService(db)
    try:
        update_payload: dict[str, object] = {
            "label": label,
            "auth_type": svc.parse_auth_type(auth_type),
            "default_branch": default_branch,
            "is_platform_default": is_platform_default,
            "registry_url": registry_url,
            "is_active": True,
        }
        # Preserve existing secret/key when credential field is intentionally left blank.
        if credential and credential.strip():
            update_payload["credential"] = credential
        svc.update_repo(repo_id, **update_payload)
        db.commit()
        return RedirectResponse("/git-repos", status_code=302)
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update git repo: %s", e)
        repo = svc.get_by_id(repo_id)
        return templates.TemplateResponse(
            "git_repos/edit.html",
            ctx(
                request,
                auth,
                "Edit Repository",
                active_page="git_repos",
                repo=repo,
                errors=[str(e)],
            ),
        )


@router.post("/{repo_id}/set-default")
def git_repos_set_default(
    request: Request,
    repo_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.git_repo_service import GitRepoService

    try:
        GitRepoService(db).update_repo(repo_id, is_platform_default=True, is_active=True)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to set default repo: %s", e)
    return RedirectResponse("/git-repos", status_code=302)


@router.post("/{repo_id}/deactivate")
def git_repos_deactivate(
    request: Request,
    repo_id: UUID,
    auth: WebAuthContext = Depends(require_web_auth),
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    require_admin(auth)
    validate_csrf_token(request, csrf_token)
    from app.services.git_repo_service import GitRepoService

    try:
        GitRepoService(db).delete_repo(repo_id)
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to deactivate repo: %s", e)
    return RedirectResponse("/git-repos", status_code=302)
