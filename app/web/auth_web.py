"""
Auth Web Routes — Login/logout pages for the platform.
"""

import logging

from fastapi import APIRouter, Depends, Form, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.rate_limit import login_limiter, password_reset_limiter
from app.web.deps import WebAuthContext, get_db, optional_web_auth
from app.web.helpers import ctx, validate_csrf_token

logger = logging.getLogger(__name__)

templates = Jinja2Templates(directory="templates")
router = APIRouter()


@router.get("/login", response_class=HTMLResponse)
def login_page(
    request: Request,
    auth: WebAuthContext = Depends(optional_web_auth),
):
    if auth.is_authenticated:
        return RedirectResponse("/dashboard", status_code=302)
    return templates.TemplateResponse(
        "auth/login.html",
        ctx(request, auth, "Login", active_page="", error=None),
    )


@router.post("/login", response_class=HTMLResponse)
def login_submit(
    request: Request,
    db: Session = Depends(get_db),
    username: str = Form(...),
    password: str = Form(...),
    csrf_token: str = Form(""),
):
    from app.services.auth_flow import AuthFlow

    try:
        validate_csrf_token(request, csrf_token)
        login_limiter.check(request)
        result = AuthFlow.login(db, username, password, request, None)

        if result.get("mfa_required"):
            return templates.TemplateResponse(
                "auth/login.html",
                ctx(request, WebAuthContext(), "Login", active_page="", error="MFA not supported in web UI yet"),
            )

        access_token = result.get("access_token")
        refresh_token = result.get("refresh_token")

        scheme = request.headers.get("x-forwarded-proto", request.url.scheme)
        _secure = scheme == "https"
        response = RedirectResponse("/dashboard", status_code=302)
        if access_token:
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=_secure,
                samesite="lax",
                path="/",
                max_age=900,  # 15 min — match JWT TTL
            )
        if refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=_secure,
                samesite="lax",
                path="/",
                max_age=3600 * 24 * 30,
            )
        return response

    except Exception as e:
        error_msg = "Invalid credentials"
        if hasattr(e, "detail"):
            error_msg = e.detail if isinstance(e.detail, str) else str(e.detail)
        return templates.TemplateResponse(
            "auth/login.html",
            ctx(request, WebAuthContext(), "Login", active_page="", error=error_msg),
        )


@router.get("/auth/password-reset-request", response_class=HTMLResponse)
def password_reset_request_page(
    request: Request,
    auth: WebAuthContext = Depends(optional_web_auth),
):
    if auth.is_authenticated:
        return RedirectResponse("/dashboard", status_code=302)
    return templates.TemplateResponse(
        "auth/password_reset_request.html",
        ctx(request, auth, "Reset Password", active_page="", success=False, error=None),
    )


@router.post("/auth/password-reset-request", response_class=HTMLResponse)
def password_reset_request_submit(
    request: Request,
    db: Session = Depends(get_db),
    auth: WebAuthContext = Depends(optional_web_auth),
    email: str = Form(...),
    csrf_token: str = Form(""),
):
    if auth.is_authenticated:
        return RedirectResponse("/dashboard", status_code=302)
    validate_csrf_token(request, csrf_token)
    password_reset_limiter.check(request)
    from app.services.auth_flow import request_password_reset
    from app.services.email import send_password_reset_email

    result = request_password_reset(db, email)
    if result:
        send_password_reset_email(
            db=db,
            to_email=result["email"],
            reset_token=result["token"],
            person_name=result["person_name"],
        )
    return templates.TemplateResponse(
        "auth/password_reset_request.html",
        ctx(request, auth, "Reset Password", active_page="", success=True, error=None),
    )


@router.get("/auth/reset-password", response_class=HTMLResponse)
def password_reset_page(
    request: Request,
    auth: WebAuthContext = Depends(optional_web_auth),
    token: str | None = None,
):
    if auth.is_authenticated:
        return RedirectResponse("/dashboard", status_code=302)
    return templates.TemplateResponse(
        "auth/password_reset.html",
        ctx(
            request,
            auth,
            "Reset Password",
            active_page="",
            token=token or "",
            success=False,
            error=None,
        ),
    )


@router.post("/auth/reset-password", response_class=HTMLResponse)
def password_reset_submit(
    request: Request,
    db: Session = Depends(get_db),
    auth: WebAuthContext = Depends(optional_web_auth),
    token: str = Form(""),
    new_password: str = Form(...),
    confirm_password: str = Form(...),
    csrf_token: str = Form(""),
):
    if auth.is_authenticated:
        return RedirectResponse("/dashboard", status_code=302)
    validate_csrf_token(request, csrf_token)
    password_reset_limiter.check(request)
    if new_password != confirm_password:
        return templates.TemplateResponse(
            "auth/password_reset.html",
            ctx(
                request,
                auth,
                "Reset Password",
                active_page="",
                token=token,
                success=False,
                error="Passwords do not match.",
            ),
        )
    if len(new_password) < 8:
        return templates.TemplateResponse(
            "auth/password_reset.html",
            ctx(
                request,
                auth,
                "Reset Password",
                active_page="",
                token=token,
                success=False,
                error="Password must be at least 8 characters.",
            ),
        )
    from app.services.auth_flow import reset_password

    try:
        reset_password(db, token, new_password)
        return templates.TemplateResponse(
            "auth/password_reset.html",
            ctx(
                request,
                auth,
                "Reset Password",
                active_page="",
                token=token,
                success=True,
                error=None,
            ),
        )
    except Exception as e:
        error_msg = "Invalid or expired reset link."
        if hasattr(e, "detail"):
            error_msg = e.detail if isinstance(e.detail, str) else str(e.detail)
        return templates.TemplateResponse(
            "auth/password_reset.html",
            ctx(
                request,
                auth,
                "Reset Password",
                active_page="",
                token=token,
                success=False,
                error=error_msg,
            ),
        )


@router.post("/logout")
def logout(
    request: Request,
    db: Session = Depends(get_db),
    csrf_token: str = Form(""),
):
    try:
        validate_csrf_token(request, csrf_token)
    except HTTPException as exc:
        # Allow stale pages to log out successfully when only token age exceeded.
        if exc.status_code != 403 or exc.detail != "CSRF token expired":
            raise

    # Best-effort session revocation
    from app.services import auth_session_service

    access_token = request.cookies.get("access_token")
    if access_token:
        auth_session_service.revoke_by_access_token(db, access_token)
        db.commit()

    response = RedirectResponse("/login", status_code=302)
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return response
