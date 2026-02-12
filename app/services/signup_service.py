"""Signup Service — public tenant signup + verification + provisioning."""

from __future__ import annotations

import hashlib
import logging
import re
import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import and_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.instance import Instance
from app.models.signup_request import SignupRequest, SignupStatus
from app.services.catalog_service import CatalogService
from app.services.deploy_service import DeployService
from app.services.email import send_signup_verification_email
from app.services.instance_service import InstanceService
from app.services.lifecycle_service import DEFAULT_TRIAL_DAYS, LifecycleService
from app.services.platform_settings import PlatformSettingsService
from app.services.server_selection import ServerSelectionService
from app.services.server_service import ServerService
from app.services.settings_crypto import decrypt_value, encrypt_value

logger = logging.getLogger(__name__)


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


class SignupService:
    def __init__(self, db: Session):
        self.db = db

    def _token_ttl_hours(self) -> int:
        ps = PlatformSettingsService(self.db)
        raw = ps.get("signup_token_ttl_hours") or "48"
        try:
            value = int(raw)
        except ValueError:
            value = 48
        return max(1, min(value, 168))

    def _issue_verification_token(self, signup: SignupRequest) -> str:
        token = secrets.token_urlsafe(32)
        signup.verification_token_hash = _token_hash(token)
        signup.verification_sent_at = datetime.now(UTC)
        signup.expires_at = datetime.now(UTC) + timedelta(hours=self._token_ttl_hours())
        self.db.flush()
        return token

    def _expire_if_needed(self, signup: SignupRequest) -> None:
        if signup.status in {SignupStatus.provisioned, SignupStatus.canceled, SignupStatus.expired}:
            return
        if signup.expires_at and signup.expires_at <= datetime.now(UTC):
            signup.status = SignupStatus.expired
            self.db.flush()

    def _ensure_catalog(self, catalog_item_id: UUID) -> UUID:
        catalog_item = CatalogService(self.db).get_catalog_item(catalog_item_id)
        if not catalog_item or not catalog_item.is_active:
            raise ValueError("Selected catalog item is invalid")
        release = catalog_item.release
        if not release or not release.is_active:
            raise ValueError("Catalog release is invalid")
        from app.services.git_repo_service import GitRepoService

        repo = GitRepoService(self.db).get_by_id(release.git_repo_id)
        if not repo or not repo.is_active:
            raise ValueError("Catalog release repo is invalid")
        return release.git_repo_id

    def _generate_org_code(self, org_name: str) -> str:
        import re

        raw = (org_name or "").strip().upper()
        if not raw:
            raise ValueError("Organization name is required")
        base = re.sub(r"[^A-Z0-9_-]+", "_", raw)
        base = re.sub(r"_+", "_", base).strip("_")
        if not base:
            raise ValueError("Organization name is invalid")
        base = base[:30]

        candidate = base
        for _ in range(6):
            exists_instance = self.db.scalar(select(Instance).where(Instance.org_code == candidate))
            exists_signup = self.db.scalar(
                select(SignupRequest).where(
                    SignupRequest.org_code == candidate,
                    SignupRequest.status.in_([SignupStatus.pending, SignupStatus.verified]),
                )
            )
            if not exists_instance and not exists_signup:
                return candidate
            suffix = secrets.token_hex(2).upper()
            candidate = f"{base}_{suffix}" if base else suffix
            candidate = candidate[:40]
        raise ValueError("Unable to generate a unique organization code")

    def _check_existing_pending(self, email: str, org_code: str | None) -> None:
        stmt = select(SignupRequest).where(
            and_(
                SignupRequest.email == email,
                SignupRequest.status.in_([SignupStatus.pending, SignupStatus.verified]),
            )
        )
        existing = self.db.scalar(stmt)
        if existing:
            raise ValueError("A signup request already exists for this email")

        if org_code:
            exists_instance = self.db.scalar(select(Instance).where(Instance.org_code == org_code))
            if exists_instance:
                raise ValueError("Organization code already exists")
            existing_code = self.db.scalar(
                select(SignupRequest).where(
                    SignupRequest.org_code == org_code,
                    SignupRequest.status.in_([SignupStatus.pending, SignupStatus.verified]),
                )
            )
            if existing_code:
                raise ValueError("A signup request already exists for this org code")

    def start_signup(
        self,
        *,
        org_name: str,
        org_code: str | None,
        catalog_item_id: UUID,
        admin_email: str,
        admin_username: str,
        admin_password: str,
        domain: str | None = None,
        server_id: UUID | None = None,
        trial_days: int | None = None,
    ) -> tuple[SignupRequest, str]:
        if not admin_email:
            raise ValueError("Admin email is required")
        if not admin_password:
            raise ValueError("Admin password is required")

        self._ensure_catalog(catalog_item_id)

        normalized_org_code = org_code.upper() if org_code else None
        if normalized_org_code and not re.match(r"^[A-Z0-9_-]+$", normalized_org_code):
            raise ValueError("Invalid org_code")
        self._check_existing_pending(admin_email, normalized_org_code)

        strategy = PlatformSettingsService(self.db).get("server_selection_strategy").strip().lower()
        if strategy == "explicit" and not server_id:
            raise ValueError("server_id is required for signup")

        if server_id:
            ServerService(self.db).get_or_404(server_id)

        resolved_org_code = (normalized_org_code or self._generate_org_code(org_name)).upper()

        try:
            password_enc = encrypt_value(admin_password)
        except Exception as exc:
            raise ValueError("Unable to encrypt admin password") from exc

        signup = SignupRequest(
            email=admin_email,
            org_name=org_name,
            org_code=resolved_org_code,
            catalog_item_id=catalog_item_id,
            domain=domain or None,
            server_id=server_id,
            admin_username=admin_username or "admin",
            admin_password_enc=password_enc,
            trial_days=trial_days,
            status=SignupStatus.pending,
        )
        self.db.add(signup)
        self.db.flush()
        token = self._issue_verification_token(signup)
        return signup, token

    def send_verification(self, signup: SignupRequest, token: str) -> bool:
        return send_signup_verification_email(
            self.db,
            to_email=signup.email,
            signup_id=str(signup.signup_id),
            token=token,
            org_name=signup.org_name,
        )

    def verify(self, *, signup_id: UUID, token: str) -> SignupRequest:
        signup = self.db.get(SignupRequest, signup_id)
        if not signup:
            raise ValueError("Signup request not found")
        self._expire_if_needed(signup)
        if signup.status != SignupStatus.pending:
            raise ValueError("Signup request is not pending")
        if not signup.verification_token_hash:
            raise ValueError("Verification token not found")
        if _token_hash(token) != signup.verification_token_hash:
            raise ValueError("Invalid verification token")

        signup.status = SignupStatus.verified
        signup.email_verified_at = datetime.now(UTC)
        signup.verification_token_hash = None
        self.db.flush()
        return signup

    def resend_verification(self, *, signup_id: UUID) -> tuple[SignupRequest, str]:
        signup = self.db.get(SignupRequest, signup_id)
        if not signup:
            raise ValueError("Signup request not found")
        self._expire_if_needed(signup)
        if signup.status != SignupStatus.pending:
            raise ValueError("Signup request is not pending")
        token = self._issue_verification_token(signup)
        return signup, token

    def confirm_billing(self, *, signup_id: UUID, billing_reference: str | None = None) -> SignupRequest:
        signup = self.db.get(SignupRequest, signup_id)
        if not signup:
            raise ValueError("Signup request not found")
        self._expire_if_needed(signup)
        if signup.status not in {SignupStatus.verified, SignupStatus.pending}:
            raise ValueError("Signup request is not eligible for billing confirmation")
        signup.billing_confirmed_at = datetime.now(UTC)
        if billing_reference:
            signup.billing_reference = billing_reference
        self.db.flush()
        return signup

    def provision(self, *, signup_id: UUID) -> dict:
        signup = self.db.get(SignupRequest, signup_id)
        if not signup:
            raise ValueError("Signup request not found")
        self._expire_if_needed(signup)
        if signup.status != SignupStatus.verified:
            raise ValueError("Signup request is not verified")
        if not signup.billing_confirmed_at:
            raise ValueError("Billing not confirmed")

        git_repo_id = self._ensure_catalog(signup.catalog_item_id)
        try:
            admin_password = decrypt_value(signup.admin_password_enc)
        except Exception as exc:
            raise ValueError("Unable to decrypt admin password") from exc

        ps = PlatformSettingsService(self.db)
        strategy = ps.get("server_selection_strategy")
        server = ServerSelectionService(self.db).select_server(
            strategy=strategy,
            requested_server_id=signup.server_id,
        )

        try:
            instance = InstanceService(self.db).create(
                server_id=server.server_id,
                org_code=signup.org_code or self._generate_org_code(signup.org_name),
                org_name=signup.org_name,
                admin_email=signup.email,
                admin_username=signup.admin_username or "admin",
                domain=signup.domain or None,
                git_repo_id=git_repo_id,
                catalog_item_id=signup.catalog_item_id,
            )
        except IntegrityError as exc:
            raise ValueError("Organization code already exists") from exc

        days = signup.trial_days or DEFAULT_TRIAL_DAYS
        instance = LifecycleService(self.db).start_trial(instance.instance_id, days=days)
        deployment_id = DeployService(self.db).create_deployment(
            instance.instance_id,
            admin_password=admin_password,
            deployment_type="full",
        )

        signup.instance_id = instance.instance_id
        signup.status = SignupStatus.provisioned
        self.db.flush()

        return {
            "signup_id": signup.signup_id,
            "instance_id": instance.instance_id,
            "deployment_id": deployment_id,
            "status": signup.status.value,
            "app_url": instance.app_url,
        }

    def safe_start_signup(self, **kwargs) -> tuple[SignupRequest, str]:
        try:
            return self.start_signup(**kwargs)
        except IntegrityError as exc:
            self.db.rollback()
            raise ValueError("Signup already exists") from exc
