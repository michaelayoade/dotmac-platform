"""Tests for GitRepoService."""

import uuid

import pytest

from app.models.git_repository import GitAuthType
from app.models.instance import Instance
from app.models.server import Server
from app.services.git_repo_service import GitRepoService
from tests.conftest import TestBase, _test_engine

TestBase.metadata.create_all(_test_engine)


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
        url="https://github.com/acme/default.git",
        auth_type=GitAuthType.none,
        is_platform_default=True,
    )
    repo_instance = svc.create_repo(
        label="instance",
        url="https://github.com/acme/instance.git",
        auth_type=GitAuthType.none,
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
        url="https://github.com/acme/default2.git",
        auth_type=GitAuthType.none,
        is_platform_default=True,
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
        url="https://github.com/acme/inuse.git",
        auth_type=GitAuthType.none,
    )
    server = _make_server(db_session)
    _make_instance(db_session, server.server_id, repo.repo_id)

    with pytest.raises(ValueError):
        svc.delete_repo(repo.repo_id)


def test_get_clone_command_token_injects(db_session):
    svc = GitRepoService(db_session)
    repo = svc.create_repo(
        label="token",
        url="https://github.com/acme/private.git",
        auth_type=GitAuthType.token,
        credential="abc123",
    )

    cmd, env = svc.get_clone_command(repo.repo_id, branch="develop")
    assert env == {}
    assert "https://abc123@github.com/acme/private.git" in cmd
    assert "--branch develop" in cmd


def test_get_clone_command_ssh_env(db_session):
    svc = GitRepoService(db_session)
    repo = svc.create_repo(
        label="ssh",
        url="git@github.com:acme/private.git",
        auth_type=GitAuthType.ssh_key,
        credential="-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----",
    )

    cmd, env = svc.get_clone_command(repo.repo_id, ssh_key_path="/opt/dotmac/keys/repo.pem")
    assert "--branch" in cmd
    assert env
    assert "GIT_SSH_COMMAND" in env
    assert "/opt/dotmac/keys/repo.pem" in env["GIT_SSH_COMMAND"]
