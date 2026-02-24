"""Tests for registry-only deploy support in the deploy pipeline."""

from __future__ import annotations

import uuid

import pytest
from sqlalchemy.orm import Session

from app.models.git_repository import GitAuthType, GitRepository
from app.models.instance import Instance
from app.models.server import Server
from app.services.git_repo_service import GitRepoService
from app.services.instance_service import InstanceService
from tests.conftest import Base, _test_engine


@pytest.fixture(autouse=True)
def _create_tables() -> None:
    Base.metadata.create_all(_test_engine)


def _make_instance(
    db_session,
    *,
    org_code: str | None = None,
    git_repo_id: uuid.UUID | None = None,
    git_branch: str | None = None,
    git_tag: str | None = None,
    deployed_git_ref: str | None = None,
) -> Instance:
    server = Server(
        name=f"srv-{uuid.uuid4().hex[:6]}",
        hostname=f"srv-{uuid.uuid4().hex[:6]}.example.com",
    )
    db_session.add(server)
    db_session.flush()

    org_code = org_code or f"GH_{uuid.uuid4().hex[:6].upper()}"
    instance = Instance(
        server_id=server.server_id,
        org_code=org_code,
        org_name="GHCR Test",
        org_uuid=str(uuid.uuid4()),
        app_port=8011,
        db_port=5441,
        redis_port=6391,
        deploy_path=f"/opt/dotmac/instances/{org_code.lower()}",
        git_repo_id=git_repo_id,
        git_branch=git_branch,
        git_tag=git_tag,
        deployed_git_ref=deployed_git_ref,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _make_repo(
    db_session,
    *,
    registry_url: str = "ghcr.io/acme/erp",
    default_branch: str = "main",
) -> GitRepository:
    unique = uuid.uuid4().hex[:8]
    repo = GitRepository(
        label=f"ghcr-repo-{unique}",
        auth_type=GitAuthType.none,
        default_branch=default_branch,
        registry_url=registry_url,
        is_active=True,
    )
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    return repo


# ---------------------------------------------------------------------------
# GitRepoService.resolve_image_ref
# ---------------------------------------------------------------------------


class TestResolveImageRef:
    def test_explicit_git_ref(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        ref = GitRepoService.resolve_image_ref(repo, git_ref="abc1234")
        assert ref == "ghcr.io/acme/erp:abc1234"

    def test_instance_git_tag(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        instance = _make_instance(db_session, git_repo_id=repo.repo_id, git_tag="v1.2.3")
        ref = GitRepoService.resolve_image_ref(repo, instance=instance)
        assert ref == "ghcr.io/acme/erp:v1.2.3"

    def test_instance_git_branch(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        instance = _make_instance(db_session, git_repo_id=repo.repo_id, git_branch="develop")
        ref = GitRepoService.resolve_image_ref(repo, instance=instance)
        assert ref == "ghcr.io/acme/erp:develop"

    def test_tag_takes_priority_over_branch(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        instance = _make_instance(
            db_session,
            git_repo_id=repo.repo_id,
            git_tag="v2.0.0",
            git_branch="develop",
        )
        ref = GitRepoService.resolve_image_ref(repo, instance=instance)
        assert ref == "ghcr.io/acme/erp:v2.0.0"

    def test_explicit_ref_overrides_instance(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        instance = _make_instance(
            db_session,
            git_repo_id=repo.repo_id,
            git_tag="v2.0.0",
        )
        ref = GitRepoService.resolve_image_ref(repo, git_ref="sha-abc", instance=instance)
        assert ref == "ghcr.io/acme/erp:sha-abc"

    def test_fallback_to_default_branch(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp", default_branch="release")
        ref = GitRepoService.resolve_image_ref(repo)
        assert ref == "ghcr.io/acme/erp:release"

    def test_fallback_to_latest(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        # Override default_branch to empty to test "latest" fallback
        repo.default_branch = ""
        ref = GitRepoService.resolve_image_ref(repo)
        assert ref == "ghcr.io/acme/erp:latest"

    def test_raises_when_no_registry_url(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        repo.registry_url = None
        with pytest.raises(ValueError, match="registry URL"):
            GitRepoService.resolve_image_ref(repo)

    def test_trailing_slash_stripped(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp/")
        ref = GitRepoService.resolve_image_ref(repo, git_ref="main")
        assert ref == "ghcr.io/acme/erp:main"


# ---------------------------------------------------------------------------
# InstanceService.generate_docker_compose — always uses image
# ---------------------------------------------------------------------------


class TestGenerateDockerCompose:
    def test_always_uses_image(self, db_session: Session) -> None:
        instance = _make_instance(db_session)
        svc = InstanceService(db_session)
        content = svc.generate_docker_compose(instance)

        assert "image: ${DOTMAC_IMAGE}" in content
        assert "build:" not in content
        assert "dockerfile: Dockerfile" not in content


# ---------------------------------------------------------------------------
# InstanceService.generate_env — DOTMAC_IMAGE variable
# ---------------------------------------------------------------------------


class TestGenerateEnv:
    def test_with_image_ref(self, db_session: Session) -> None:
        instance = _make_instance(db_session)
        svc = InstanceService(db_session)
        content = svc.generate_env(instance, admin_password="secret", image_ref="ghcr.io/acme/erp:v1.0")

        assert "DOTMAC_IMAGE=ghcr.io/acme/erp:v1.0" in content

    def test_without_image_ref(self, db_session: Session) -> None:
        instance = _make_instance(db_session)
        svc = InstanceService(db_session)
        content = svc.generate_env(instance, admin_password="secret")

        assert "DOTMAC_IMAGE" not in content


# ---------------------------------------------------------------------------
# GitRepoService.serialize_repo — registry_url included
# ---------------------------------------------------------------------------


class TestSerializeRepo:
    def test_includes_registry_url(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        data = GitRepoService.serialize_repo(repo)
        assert data["registry_url"] == "ghcr.io/acme/erp"

    def test_registry_url_default(self, db_session: Session) -> None:
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        data = GitRepoService.serialize_repo(repo)
        assert data["registry_url"] is not None


# ---------------------------------------------------------------------------
# GitRepoService.create_repo — registry_url persisted
# ---------------------------------------------------------------------------


class TestCreateRepoWithRegistryUrl:
    def test_create_with_registry_url(self, db_session: Session) -> None:
        svc = GitRepoService(db_session)
        repo = svc.create_repo(
            label=f"reg-test-{uuid.uuid4().hex[:6]}",
            auth_type=GitAuthType.none,
            registry_url="ghcr.io/acme/erp",
        )
        db_session.commit()
        assert repo.registry_url == "ghcr.io/acme/erp"


# ---------------------------------------------------------------------------
# provision_files passes git_ref to resolve_image_ref
# ---------------------------------------------------------------------------


class TestProvisionFilesGitRef:
    def test_generate_env_uses_git_ref_override(self, db_session: Session) -> None:
        """When git_ref is provided, .env should use that tag, not instance defaults."""
        repo = _make_repo(db_session, registry_url="ghcr.io/acme/erp")
        instance = _make_instance(
            db_session,
            git_repo_id=repo.repo_id,
            git_branch="main",
        )
        svc = InstanceService(db_session)
        content = svc.generate_env(
            instance,
            admin_password="secret",
            image_ref="ghcr.io/acme/erp:hotfix-123",
        )
        assert "DOTMAC_IMAGE=ghcr.io/acme/erp:hotfix-123" in content
        assert "DOTMAC_IMAGE=ghcr.io/acme/erp:main" not in content

    def test_generate_docker_compose_always_uses_image(self, db_session: Session) -> None:
        """Docker-compose should always use image: ${DOTMAC_IMAGE}."""
        instance = _make_instance(db_session)
        svc = InstanceService(db_session)
        content = svc.generate_docker_compose(instance)
        assert "image: ${DOTMAC_IMAGE}" in content
        assert "build:" not in content


# ---------------------------------------------------------------------------
# setup.sh always uses pull (no --build)
# ---------------------------------------------------------------------------


class TestSetupScript:
    def test_setup_script_always_pulls(self, db_session: Session) -> None:
        instance = _make_instance(db_session)
        svc = InstanceService(db_session)
        content = svc.generate_setup_script(instance)
        assert "--build" not in content
        assert "docker compose up -d app worker beat" in content
        assert "Pulling and starting" in content
