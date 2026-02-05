"""
Auth Web Routes — Login/logout pages for the platform.
"""
from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse, Response
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.web.deps import get_db, optional_web_auth, WebAuthContext
from app.web.helpers import brand

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
        {"request": request, "title": "Login", "brand": brand(), "error": None},
    )


@router.post("/login", response_class=HTMLResponse)
def login_submit(
    request: Request,
    db: Session = Depends(get_db),
    username: str = Form(...),
    password: str = Form(...),
):
    from app.services.auth_flow import AuthFlow

    try:
        result = AuthFlow.login(db, username, password, request, None)

        if result.get("mfa_required"):
            return templates.TemplateResponse(
                "auth/login.html",
                {
                    "request": request, "title": "Login", "brand": brand(),
                    "error": "MFA not supported in web UI yet",
                },
            )

        access_token = result.get("access_token")
        refresh_token = result.get("refresh_token")

        response = RedirectResponse("/dashboard", status_code=302)
        if access_token:
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                samesite="lax",
                path="/",
                max_age=3600 * 24,  # 24 hours
            )
        if refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
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
            {"request": request, "title": "Login", "brand": brand(), "error": error_msg},
        )


@router.get("/logout")
def logout(request: Request):
    response = RedirectResponse("/login", status_code=302)
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return response
