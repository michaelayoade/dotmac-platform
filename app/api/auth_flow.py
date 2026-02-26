from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db import SessionLocal
from app.rate_limit import (
    login_limiter,
    mfa_verify_limiter,
    password_change_limiter,
    password_reset_limiter,
    refresh_limiter,
    signup_limiter,
    signup_resend_limiter,
    signup_verify_limiter,
)
from app.schemas.auth import MFAMethodRead
from app.schemas.auth_flow import (
    AvatarUploadResponse,
    ErrorResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
    MeResponse,
    MeUpdateRequest,
    MfaConfirmRequest,
    MfaSetupRequest,
    MfaSetupResponse,
    MfaVerifyRequest,
    PasswordChangeRequest,
    PasswordChangeResponse,
    RefreshRequest,
    ResetPasswordRequest,
    ResetPasswordResponse,
    SessionInfoResponse,
    SessionListResponse,
    SessionRevokeResponse,
    TokenResponse,
)
from app.schemas.signup import (
    SignupBillingConfirmRequest,
    SignupBillingConfirmResponse,
    SignupProvisionResponse,
    SignupResendRequest,
    SignupResendResponse,
    SignupStartRequest,
    SignupStartResponse,
    SignupVerifyRequest,
    SignupVerifyResponse,
)
from app.services import auth_flow as auth_flow_service
from app.services import auth_session_service, person_profile_service
from app.services.auth_dependencies import require_user_auth
from app.services.auth_flow import request_password_reset, reset_password
from app.services.email import send_password_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    responses={
        428: {
            "model": ErrorResponse,
            "description": "Password reset required",
            "content": {
                "application/json": {
                    "example": {
                        "detail": {
                            "code": "PASSWORD_RESET_REQUIRED",
                            "message": "Password reset required",
                        }
                    }
                }
            },
        }
    },
)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    # Check rate limit first
    login_limiter.check(request)
    
    # Get login response
    response_content = auth_flow_service.auth_flow.login_response(
        db,
        payload.username,
        payload.password,
        request,
        payload.provider,
        payload.org_code,
    )
    
    # Calculate rate limit headers using the limiter's methods
    remaining = login_limiter.get_remaining(request)
    reset_time = login_limiter.get_reset_time(request)
    
    # Return response with headers
    # Use JSONResponse to add headers while maintaining the correct response format
    from fastapi.responses import JSONResponse
    return JSONResponse(
        content=response_content,
        headers={
            "X-RateLimit-Limit": str(login_limiter.max_requests),
            "X-RateLimit-Remaining": str(remaining),
            "X-RateLimit-Reset": str(reset_time),
        }
    )


@router.post(
    "/signup",
    response_model=SignupStartResponse,
    status_code=status.HTTP_201_CREATED,
    responses={400: {"model": ErrorResponse}},
)
def signup_start(payload: SignupStartRequest, request: Request, db: Session = Depends(get_db)):
    signup_limiter.check(request)
    from app.services.signup_service import SignupService

    svc = SignupService(db)
    try:
        signup, token = svc.safe_start_signup(
            org_name=payload.org_name,
            org_code=payload.org_code,
            catalog_item_id=payload.catalog_item_id,
            admin_email=str(payload.admin_email),
            admin_username=payload.admin_username,
            admin_password=payload.admin_password,
            domain=payload.domain,
            server_id=payload.server_id,
            trial_days=payload.trial_days,
        )
        sent = svc.send_verification(signup, token)
        if not sent:
            raise ValueError("Unable to send verification email")
        db.commit()
        return SignupStartResponse(signup_id=signup.signup_id, status=signup.status.value, email_sent=True)
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail={"code": "SIGNUP_FAILED", "message": str(e)})


@router.post(
    "/signup/resend",
    response_model=SignupResendResponse,
    status_code=status.HTTP_200_OK,
    responses={400: {"model": ErrorResponse}},
)
def signup_resend(payload: SignupResendRequest, request: Request, db: Session = Depends(get_db)):
    signup_resend_limiter.check(request)
    from app.services.signup_service import SignupService

    svc = SignupService(db)
    try:
        signup, token = svc.resend_verification(signup_id=payload.signup_id)
        sent = svc.send_verification(signup, token)
        if not sent:
            raise ValueError("Unable to send verification email")
        db.commit()
        return SignupResendResponse(signup_id=signup.signup_id, status=signup.status.value, email_sent=True)
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail={"code": "SIGNUP_RESEND_FAILED", "message": str(e)})


@router.post(
    "/signup/verify",
    response_model=SignupVerifyResponse,
    status_code=status.HTTP_200_OK,
    responses={400: {"model": ErrorResponse}},
)
def signup_verify(payload: SignupVerifyRequest, request: Request, db: Session = Depends(get_db)):
    signup_verify_limiter.check(request)
    from app.services.signup_service import SignupService

    svc = SignupService(db)
    try:
        signup = svc.verify(signup_id=payload.signup_id, token=payload.token)
        db.commit()
        return SignupVerifyResponse(
            signup_id=signup.signup_id,
            status=signup.status.value,
            verified_at=signup.email_verified_at,
        )
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail={"code": "SIGNUP_VERIFY_FAILED", "message": str(e)})


@router.post(
    "/signup/{signup_id}/confirm-billing",
    response_model=SignupBillingConfirmResponse,
    status_code=status.HTTP_200_OK,
    responses={400: {"model": ErrorResponse}},
)
def signup_confirm_billing(
    signup_id: UUID,
    payload: SignupBillingConfirmRequest,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.signup_service import SignupService

    svc = SignupService(db)
    try:
        signup = svc.confirm_billing(signup_id=signup_id, billing_reference=payload.billing_reference)
        db.commit()
        if signup.billing_confirmed_at is None:
            raise HTTPException(
                status_code=500, detail={"code": "SIGNUP_BILLING_FAILED", "message": "Missing timestamp"}
            )
        return SignupBillingConfirmResponse(
            signup_id=signup.signup_id,
            status=signup.status.value,
            billing_confirmed_at=signup.billing_confirmed_at,
        )
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail={"code": "SIGNUP_BILLING_FAILED", "message": str(e)})


@router.post(
    "/signup/{signup_id}/provision",
    response_model=SignupProvisionResponse,
    status_code=status.HTTP_202_ACCEPTED,
    responses={400: {"model": ErrorResponse}},
)
def signup_provision(
    signup_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.signup_service import SignupService

    svc = SignupService(db)
    try:
        result = svc.provision(signup_id=signup_id)
        db.commit()
        return SignupProvisionResponse(**result)
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail={"code": "SIGNUP_PROVISION_FAILED", "message": str(e)})


@router.post(
    "/mfa/setup",
    response_model=MfaSetupResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
    },
)
def mfa_setup(
    payload: MfaSetupRequest,
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    if str(payload.person_id) != auth["person_id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return auth_flow_service.auth_flow.mfa_setup(db, auth["person_id"], payload.label)


@router.post(
    "/mfa/confirm",
    response_model=MFAMethodRead,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
def mfa_confirm(
    payload: MfaConfirmRequest,
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    return auth_flow_service.auth_flow.mfa_confirm(db, str(payload.method_id), payload.code, auth["person_id"])


@router.post(
    "/mfa/verify",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
def mfa_verify(payload: MfaVerifyRequest, request: Request, db: Session = Depends(get_db)):
    mfa_verify_limiter.check(request)
    return auth_flow_service.auth_flow.mfa_verify_response(db, payload.mfa_token, payload.code, request)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"model": ErrorResponse},
    },
)
def refresh(payload: RefreshRequest, request: Request, db: Session = Depends(get_db)):
    refresh_limiter.check(request)
    return auth_flow_service.auth_flow.refresh_response(db, payload.refresh_token, request)


@router.post(
    "/logout",
    response_model=LogoutResponse,
    status_code=status.HTTP_200_OK,
    responses={
        404: {"model": ErrorResponse},
    },
)
def logout(payload: LogoutRequest, request: Request, db: Session = Depends(get_db)):
    return auth_flow_service.auth_flow.logout_response(db, payload.refresh_token, request)


def _build_me_response(person: person_profile_service.Person, auth: dict) -> MeResponse:
    """Build MeResponse from a Person model and auth context."""
    return MeResponse(
        id=person.id,
        first_name=person.first_name,
        last_name=person.last_name,
        display_name=person.display_name,
        avatar_url=person.avatar_url,
        email=person.email,
        email_verified=person.email_verified,
        phone=person.phone,
        date_of_birth=person.date_of_birth,
        gender=person.gender.value if person.gender else "unknown",
        preferred_contact_method=person.preferred_contact_method.value if person.preferred_contact_method else None,
        locale=person.locale,
        timezone=person.timezone,
        roles=auth.get("roles", []),
        scopes=auth.get("scopes", []),
    )


@router.get(
    "/me",
    response_model=MeResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"model": ErrorResponse},
    },
)
def get_me(
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    try:
        person = person_profile_service.get_profile(db, auth["person_id"])
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return _build_me_response(person, auth)


@router.patch(
    "/me",
    response_model=MeResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"model": ErrorResponse},
    },
)
def update_me(
    payload: MeUpdateRequest,
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    try:
        person = person_profile_service.update_profile(db, auth["person_id"], payload.model_dump(exclude_unset=True))
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    db.commit()
    return _build_me_response(person, auth)


@router.post(
    "/me/avatar",
    response_model=AvatarUploadResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
    },
)
async def upload_avatar(
    file: UploadFile,
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    try:
        avatar_url = await person_profile_service.upload_avatar(db, auth["person_id"], file)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    db.commit()
    return AvatarUploadResponse(avatar_url=avatar_url)


@router.delete(
    "/me/avatar",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        401: {"model": ErrorResponse},
    },
)
def delete_avatar(
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    try:
        person_profile_service.delete_avatar(db, auth["person_id"])
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    db.commit()


@router.get(
    "/me/sessions",
    response_model=SessionListResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"model": ErrorResponse},
    },
)
def list_sessions(
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    sessions = auth_session_service.list_for_person(db, auth["person_id"])
    current_session_id = auth.get("session_id")
    return SessionListResponse(
        sessions=[
            SessionInfoResponse(
                id=s.id,
                status=s.status.value,
                ip_address=s.ip_address,
                user_agent=s.user_agent,
                created_at=s.created_at,
                last_seen_at=s.last_seen_at,
                expires_at=s.expires_at,
                is_current=(str(s.id) == current_session_id),
            )
            for s in sessions
        ],
        total=len(sessions),
    )


@router.delete(
    "/me/sessions/{session_id}",
    response_model=SessionRevokeResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
def revoke_session(
    session_id: str,
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    try:
        revoked_at = auth_session_service.revoke_session(db, auth["person_id"], session_id)
    except ValueError as e:
        detail = str(e)
        code = 400 if "already revoked" in detail else 404
        raise HTTPException(status_code=code, detail=detail)
    db.commit()
    return SessionRevokeResponse(revoked_at=revoked_at)


@router.delete(
    "/me/sessions",
    response_model=SessionRevokeResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"model": ErrorResponse},
    },
)
def revoke_all_other_sessions(
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    revoked_at, count = auth_session_service.revoke_all_others(db, auth["person_id"], auth.get("session_id"))
    db.commit()
    return SessionRevokeResponse(revoked_at=revoked_at, revoked_count=count)


@router.post(
    "/me/password",
    response_model=PasswordChangeResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
def change_password(
    payload: PasswordChangeRequest,
    request: Request,
    auth: dict = Depends(require_user_auth),
    db: Session = Depends(get_db),
):
    password_change_limiter.check(request)
    try:
        changed_at = person_profile_service.change_password(
            db, auth["person_id"], payload.current_password, payload.new_password
        )
    except ValueError as e:
        detail = str(e)
        if "incorrect" in detail:
            raise HTTPException(status_code=401, detail=detail)
        if "No credentials" in detail:
            raise HTTPException(status_code=404, detail=detail)
        raise HTTPException(status_code=400, detail=detail)
    db.commit()
    return PasswordChangeResponse(changed_at=changed_at)


@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
    status_code=status.HTTP_200_OK,
)
def forgot_password(
    payload: ForgotPasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Request a password reset email.
    Always returns success to prevent email enumeration.
    """
    password_reset_limiter.check(request)
    result = request_password_reset(db, payload.email)

    if result:
        send_password_reset_email(
            db=db,
            to_email=result["email"],
            reset_token=result["token"],
            person_name=result["person_name"],
        )

    return ForgotPasswordResponse()


@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse,
    status_code=status.HTTP_200_OK,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
def reset_password_endpoint(
    payload: ResetPasswordRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Reset password using the token from forgot-password email.
    """
    password_reset_limiter.check(request)
    reset_at = reset_password(db, payload.token, payload.new_password)
    return ResetPasswordResponse(reset_at=reset_at)
