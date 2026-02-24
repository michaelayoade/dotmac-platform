"""Git Repository Service — manage repo records and auth for deploys."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.git_repository import GitAuthType, GitRepository
from app.models.instance import Instance
from app.services.settings_crypto import decrypt_value, encrypt_value


class GitRepoService:
    def __init__(self, db: Session):
        self.db = db

    def create_repo(
        self,
        label: str,
        auth_type: GitAuthType,
        registry_url: str,
        credential: str | None = None,
        default_branch: str = "main",
        is_platform_default: bool = False,
    ) -> GitRepository:
        if not label.strip():
            raise ValueError("Label is required")
        registry_val = registry_url.strip() if registry_url else ""
        if not registry_val:
            raise ValueError("Registry URL is required")
        if auth_type == GitAuthType.ssh_key:
            raise ValueError("SSH key auth is not supported for registry-only deployments")
        if auth_type == GitAuthType.token and not credential:
            raise ValueError("Credential is required for this auth type")
        repo = GitRepository(
            label=label.strip(),
            auth_type=auth_type,
            default_branch=(default_branch or "main").strip(),
            is_platform_default=is_platform_default,
            registry_url=registry_val,
            is_active=True,
        )
        if auth_type == GitAuthType.token and credential:
            repo.token_encrypted = encrypt_value(credential)

        if is_platform_default:
            self._clear_platform_default()

        self.db.add(repo)
        self.db.flush()
        return repo

    def update_repo(self, repo_id: UUID, **kwargs: object) -> GitRepository:
        repo = self.get_by_id(repo_id)
        if not repo:
            raise ValueError("Repo not found")

        if "auth_type" in kwargs and kwargs["auth_type"] is not None:
            auth_type = kwargs.pop("auth_type")
            if auth_type == GitAuthType.ssh_key:
                raise ValueError("SSH key auth is not supported for registry-only deployments")
            repo.auth_type = auth_type  # type: ignore[assignment]
            if repo.auth_type != GitAuthType.ssh_key:
                repo.ssh_key_encrypted = None
            if repo.auth_type != GitAuthType.token:
                repo.token_encrypted = None

        if "credential" in kwargs:
            credential = kwargs.pop("credential")
            if repo.auth_type == GitAuthType.token:
                if not credential:
                    raise ValueError("Token is required for token auth")
                repo.token_encrypted = encrypt_value(str(credential))

        if "registry_url" in kwargs and isinstance(kwargs["registry_url"], str):
            repo.registry_url = kwargs["registry_url"].strip() or None

        for key, value in kwargs.items():
            if key in {"registry_url"}:
                continue
            if not hasattr(repo, key):
                continue
            if value is not None:
                setattr(repo, key, value)

        if repo.auth_type == GitAuthType.token and not repo.token_encrypted:
            raise ValueError("Token is required for token auth")
        if not repo.registry_url:
            raise ValueError("Registry URL is required")

        if repo.is_platform_default:
            self._clear_platform_default(except_id=repo.repo_id)

        self.db.flush()
        return repo

    def delete_repo(self, repo_id: UUID) -> None:
        repo = self.get_by_id(repo_id)
        if not repo:
            raise ValueError("Repo not found")
        in_use = self.db.scalar(select(Instance).where(Instance.git_repo_id == repo.repo_id))
        if in_use:
            raise ValueError("Repo is assigned to instance(s)")
        repo.is_active = False
        repo.is_platform_default = False
        self.db.flush()

    def list_repos(self, active_only: bool = True) -> list[GitRepository]:
        stmt = select(GitRepository)
        if active_only:
            stmt = stmt.where(GitRepository.is_active.is_(True))
        stmt = stmt.order_by(GitRepository.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def list_for_web(self, active_only: bool = False) -> list[GitRepository]:
        return self.list_repos(active_only=active_only)

    def create_from_form(
        self,
        *,
        label: str,
        auth_type: str,
        credential: str | None,
        default_branch: str,
        is_platform_default: bool,
        registry_url: str,
    ) -> GitRepository:
        auth_enum = GitAuthType(auth_type)
        return self.create_repo(
            label=label,
            auth_type=auth_enum,
            credential=credential,
            default_branch=default_branch,
            is_platform_default=is_platform_default,
            registry_url=registry_url,
        )

    def get_by_id(self, repo_id: UUID) -> GitRepository | None:
        return self.db.get(GitRepository, repo_id)

    def get_repo_for_instance(self, instance_id: UUID) -> GitRepository | None:
        instance = self.db.get(Instance, instance_id)
        if not instance:
            return None
        if instance.git_repo_id:
            repo = self.db.get(GitRepository, instance.git_repo_id)
            return repo if repo and repo.is_active else None
        stmt = select(GitRepository).where(GitRepository.is_platform_default.is_(True))
        repo = self.db.scalar(stmt)
        return repo if repo and repo.is_active else None

    def _clear_platform_default(self, except_id: UUID | None = None) -> None:
        stmt = select(GitRepository).where(GitRepository.is_platform_default.is_(True))
        repos = list(self.db.scalars(stmt).all())
        for repo in repos:
            if except_id and repo.repo_id == except_id:
                continue
            repo.is_platform_default = False

    @staticmethod
    def serialize_repo(repo: GitRepository) -> dict[str, object]:
        return {
            "repo_id": str(repo.repo_id),
            "label": repo.label,
            "url": repo.url,
            "auth_type": repo.auth_type.value,
            "default_branch": repo.default_branch,
            "is_platform_default": repo.is_platform_default,
            "registry_url": repo.registry_url,
            "is_active": repo.is_active,
            "created_at": repo.created_at.isoformat() if repo.created_at else None,
            "updated_at": repo.updated_at.isoformat() if repo.updated_at else None,
        }

    @staticmethod
    def resolve_image_ref(
        repo: GitRepository,
        git_ref: str | None = None,
        instance: Instance | None = None,
    ) -> str:
        """Resolve a full container image reference.

        Tag priority: git_ref > instance.git_tag > instance.git_branch
        > repo.default_branch > "latest".
        """
        if not repo.registry_url:
            raise ValueError("Repository does not have a registry URL configured")
        tag = git_ref
        if not tag and instance:
            tag = instance.git_tag or instance.git_branch
        if not tag:
            tag = repo.default_branch or "latest"
        base = repo.registry_url.rstrip("/")
        return f"{base}:{tag}"

    def set_webhook_secret(self, repo_id: UUID, secret: str) -> None:
        """Encrypt and store a webhook secret for a repo."""
        repo = self.get_by_id(repo_id)
        if not repo:
            raise ValueError("Repo not found")
        repo.webhook_secret_encrypted = encrypt_value(secret)
        self.db.flush()

    def get_webhook_secret(self, repo_id: UUID) -> str | None:
        """Decrypt and return the webhook secret for a repo."""
        repo = self.get_by_id(repo_id)
        if not repo or not repo.webhook_secret_encrypted:
            return None
        return decrypt_value(repo.webhook_secret_encrypted)

    def generate_webhook_secret(self, repo_id: UUID) -> str:
        """Generate a random webhook secret, store it, and return the plaintext."""
        import secrets as _secrets

        repo = self.get_by_id(repo_id)
        if not repo:
            raise ValueError("Repo not found")
        plaintext = _secrets.token_hex(32)
        repo.webhook_secret_encrypted = encrypt_value(plaintext)
        self.db.flush()
        return plaintext

    @staticmethod
    def parse_auth_type(value: str) -> GitAuthType:
        try:
            return GitAuthType(value)
        except ValueError as exc:
            raise ValueError("Invalid auth_type") from exc
