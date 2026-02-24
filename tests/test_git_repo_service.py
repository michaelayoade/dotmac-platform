"""Tests for GitRepoService."""

import uuid

import pytest

from app.models.git_repository import GitAuthType, GitRepository
from app.models.instance import Instance
from app.models.server import Server
from app.services.git_repo_service import GitRepoService
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


@pytest.fixture(autouse=True)
def _clean_git_repo_data(db_session):
    db_session.query(Instance).delete()
    db_session.query(Server).delete()
    db_session.query(GitRepository).delete()
    db_session.commit()
    yield


def _make_server(db_session):
    server = Server(
        name=f"test-server-{uuid.uuid4().hex[:6]}",
        hostname="localhost",
        ssh_port=22,
        ssh_user="root",
        ssh_key_path="/root/.ssh/id_rsa",
        is_local=True,
    )
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)
    return server


def _make_instance(db_session, server_id, repo_id=None):
    instance = Instance(
        server_id=server_id,
        org_code=f"org-{uuid.uuid4().hex[:6]}",
        org_name="Test Org",
        app_port=8001,
        db_port=5433,
        redis_port=6380,
        git_repo_id=repo_id,
    )
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def test_get_repo_for_instance_prefers_instance(db_session):
    svc = GitRepoService(db_session)
    repo_default = svc.create_repo(
        label="default",
        auth_type=GitAuthType.none,
        is_platform_default=True,
        registry_url="ghcr.io/acme/default",
    )
    repo_instance = svc.create_repo(
        label="instance",
        auth_type=GitAuthType.none,
        registry_url="ghcr.io/acme/instance",
    )
    server = _make_server(db_session)
    instance = _make_instance(db_session, server.server_id, repo_instance.repo_id)

    repo = svc.get_repo_for_instance(instance.instance_id)
    assert repo
    assert repo.repo_id == repo_instance.repo_id
    assert repo.repo_id != repo_default.repo_id


def test_get_repo_for_instance_uses_platform_default(db_session):
    svc = GitRepoService(db_session)
    repo_default = svc.create_repo(
        label="default-2",
        auth_type=GitAuthType.none,
        is_platform_default=True,
        registry_url="ghcr.io/acme/default2",
    )
    server = _make_server(db_session)
    instance = _make_instance(db_session, server.server_id)

    repo = svc.get_repo_for_instance(instance.instance_id)
    assert repo
    assert repo.repo_id == repo_default.repo_id


def test_delete_repo_refuses_in_use(db_session):
    svc = GitRepoService(db_session)
    repo = svc.create_repo(
        label="in-use",
        auth_type=GitAuthType.none,
        registry_url="ghcr.io/acme/inuse",
    )
    server = _make_server(db_session)
    _make_instance(db_session, server.server_id, repo.repo_id)

    with pytest.raises(ValueError):
        svc.delete_repo(repo.repo_id)


def test_create_repo_requires_registry_url(db_session):
    svc = GitRepoService(db_session)
    with pytest.raises(ValueError, match="Registry URL is required"):
        svc.create_repo(
            label=f"missing-{uuid.uuid4().hex[:6]}",
            auth_type=GitAuthType.none,
            registry_url="",
        )


def test_create_repo_rejects_ssh_key_auth(db_session):
    svc = GitRepoService(db_session)
    with pytest.raises(ValueError, match="SSH key auth is not supported"):
        svc.create_repo(
            label=f"ssh-{uuid.uuid4().hex[:6]}",
            auth_type=GitAuthType.ssh_key,
            registry_url="ghcr.io/acme/repo",
            credential="-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----",
        )


def test_create_repo_allows_registry_only(db_session):
    svc = GitRepoService(db_session)
    repo = svc.create_repo(
        label=f"registry-only-{uuid.uuid4().hex[:6]}",
        auth_type=GitAuthType.none,
        registry_url="ghcr.io/acme/repo",
    )
    db_session.commit()

    assert repo.url is None
    assert repo.registry_url == "ghcr.io/acme/repo"


def test_create_repo_with_token(db_session):
    svc = GitRepoService(db_session)
    repo = svc.create_repo(
        label=f"token-{uuid.uuid4().hex[:6]}",
        auth_type=GitAuthType.token,
        registry_url="ghcr.io/acme/repo",
        credential="ghp_test123",
    )
    db_session.commit()

    assert repo.registry_url == "ghcr.io/acme/repo"
    assert repo.token_encrypted is not None
    assert repo.auth_type == GitAuthType.token


def test_update_repo_rejects_ssh_key_auth(db_session):
    svc = GitRepoService(db_session)
    repo = svc.create_repo(
        label=f"upd-{uuid.uuid4().hex[:6]}",
        auth_type=GitAuthType.none,
        registry_url="ghcr.io/acme/repo",
    )
    with pytest.raises(ValueError, match="SSH key auth is not supported"):
        svc.update_repo(repo.repo_id, auth_type=GitAuthType.ssh_key)
