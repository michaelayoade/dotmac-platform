"""Git Repository Service — manage repo records and auth for deploys."""

from __future__ import annotations

import atexit
import os
import shlex
import tempfile
import threading
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.git_repository import GitAuthType, GitRepository
from app.models.instance import Instance
from app.models.server import Server
from app.services.settings_crypto import decrypt_value, encrypt_value
from app.services.ssh_service import get_ssh_for_server


class GitRepoService:
    def __init__(self, db: Session):
        self.db = db

    def create_repo(
        self,
        label: str,
        url: str,
        auth_type: GitAuthType,
        credential: str | None = None,
        default_branch: str = "main",
        is_platform_default: bool = False,
        registry_url: str | None = None,
    ) -> GitRepository:
        if not label.strip():
            raise ValueError("Label is required")
        if not url.strip():
            raise ValueError("URL is required")
        if auth_type in (GitAuthType.ssh_key, GitAuthType.token) and not credential:
            raise ValueError("Credential is required for this auth type")
        repo = GitRepository(
            label=label.strip(),
            url=url.strip(),
            auth_type=auth_type,
            default_branch=(default_branch or "main").strip(),
            is_platform_default=is_platform_default,
            registry_url=registry_url.strip() if registry_url else None,
            is_active=True,
        )
        if auth_type == GitAuthType.ssh_key and credential:
            repo.ssh_key_encrypted = encrypt_value(credential)
        if auth_type == GitAuthType.token and credential:
            repo.token_encrypted = encrypt_value(credential)

        if is_platform_default:
            self._clear_platform_default()

        self.db.add(repo)
        self.db.flush()
        return repo

    def update_repo(self, repo_id: UUID, **kwargs) -> GitRepository:
        repo = self.get_by_id(repo_id)
        if not repo:
            raise ValueError("Repo not found")

        if "auth_type" in kwargs and kwargs["auth_type"] is not None:
            repo.auth_type = kwargs.pop("auth_type")
            if repo.auth_type != GitAuthType.ssh_key:
                repo.ssh_key_encrypted = None
            if repo.auth_type != GitAuthType.token:
                repo.token_encrypted = None

        if "credential" in kwargs:
            credential = kwargs.pop("credential")
            if repo.auth_type == GitAuthType.ssh_key:
                if not credential:
                    raise ValueError("SSH key is required for ssh auth")
                repo.ssh_key_encrypted = encrypt_value(credential)
            if repo.auth_type == GitAuthType.token:
                if not credential:
                    raise ValueError("Token is required for token auth")
                repo.token_encrypted = encrypt_value(credential)

        for key, value in kwargs.items():
            if hasattr(repo, key) and value is not None:
                setattr(repo, key, value)

        if repo.auth_type == GitAuthType.ssh_key and not repo.ssh_key_encrypted:
            raise ValueError("SSH key is required for ssh auth")
        if repo.auth_type == GitAuthType.token and not repo.token_encrypted:
            raise ValueError("Token is required for token auth")

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
        url: str,
        auth_type: str,
        credential: str | None,
        default_branch: str,
        is_platform_default: bool,
        registry_url: str | None = None,
    ) -> GitRepository:
        auth_enum = GitAuthType(auth_type)
        return self.create_repo(
            label=label,
            url=url,
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

    def get_clone_command(
        self,
        repo_id: UUID,
        branch: str | None = None,
        ssh_key_path: str | None = None,
    ) -> tuple[str, dict[str, str]]:
        repo = self.get_by_id(repo_id)
        if not repo:
            raise ValueError("Repo not found")
        env, clone_url = _repo_env(repo, ssh_key_path=ssh_key_path)
        effective_branch = branch or repo.default_branch or "main"
        cmd = f"git clone --branch {shlex.quote(effective_branch)} {shlex.quote(clone_url)}"
        return cmd, env

    def test_connection(self, repo_id: UUID) -> dict:
        repo = self.get_by_id(repo_id)
        if not repo:
            raise ValueError("Repo not found")
        env, url = _repo_env(repo)
        cmd = f"{format_env_prefix(env)}git ls-remote {shlex.quote(url)}"
        return {"command": cmd}

    def get_repo_env(self, repo_id: UUID, ssh_key_path: str | None = None) -> tuple[dict[str, str], str]:
        repo = self.get_by_id(repo_id)
        if not repo:
            raise ValueError("Repo not found")
        return _repo_env(repo, ssh_key_path=ssh_key_path)

    def deploy_ssh_key(self, repo_id: UUID, server_id: UUID) -> str:
        repo = self.get_by_id(repo_id)
        if not repo:
            raise ValueError("Repo not found")
        if repo.auth_type != GitAuthType.ssh_key:
            raise ValueError("Repo is not using ssh key auth")
        key = decrypt_value(repo.ssh_key_encrypted or "")
        if not key:
            raise ValueError("SSH key missing")

        server = self.db.get(Server, server_id)
        if not server:
            raise ValueError("Server not found")

        ssh = get_ssh_for_server(server)
        remote_dir = "/opt/dotmac/keys"
        filename = f"repo_{repo.repo_id}.pem"
        remote_path = f"{remote_dir}/{filename}"
        ssh.exec_command(f"mkdir -p {shlex.quote(remote_dir)} && chmod 700 {shlex.quote(remote_dir)}")
        ssh.sftp_put_string(key, remote_path, mode=0o600)
        return remote_path

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
        """Resolve a full container image reference for a prebuilt image.

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


def _inject_token(url: str, token: str) -> str:
    if "@" in url:
        return url
    if url.startswith("https://"):
        return url.replace("https://", f"https://{token}@", 1)
    if url.startswith("http://"):
        return url.replace("http://", f"http://{token}@", 1)
    return url


def _repo_env(repo: GitRepository, ssh_key_path: str | None = None) -> tuple[dict[str, str], str]:
    env = {}
    url = repo.url
    if repo.auth_type == GitAuthType.token:
        token = decrypt_value(repo.token_encrypted or "")
        if token:
            url = _inject_token(repo.url, token)
    if repo.auth_type == GitAuthType.ssh_key:
        key = decrypt_value(repo.ssh_key_encrypted or "")
        if key:
            path = ssh_key_path or _write_temp_key(key)
            env["GIT_SSH_COMMAND"] = f"ssh -i {shlex.quote(path)} -o StrictHostKeyChecking=no"
    return env, url


def format_env_prefix(env: dict[str, str]) -> str:
    if not env:
        return ""
    return " ".join(f"{k}={shlex.quote(v)}" for k, v in env.items()) + " "


def _write_temp_key(key: str) -> str:
    fd, path = tempfile.mkstemp(prefix="git_key_", suffix=".pem", dir="/tmp")
    try:
        with os.fdopen(fd, "w") as f:
            f.write(key)
        os.chmod(path, 0o600)
    except Exception:
        try:
            os.close(fd)
        except Exception:
            pass
        try:
            os.remove(path)
        except Exception:
            pass
        raise
    _register_temp_key(path)
    return path


_TEMP_KEY_PATHS: set[str] = set()
_TEMP_KEY_LOCK = threading.Lock()


def _register_temp_key(path: str) -> None:
    with _TEMP_KEY_LOCK:
        _TEMP_KEY_PATHS.add(path)


def cleanup_temp_keys() -> None:
    with _TEMP_KEY_LOCK:
        paths = list(_TEMP_KEY_PATHS)
        _TEMP_KEY_PATHS.clear()
    for path in paths:
        try:
            os.remove(path)
        except OSError:
            pass


atexit.register(cleanup_temp_keys)
