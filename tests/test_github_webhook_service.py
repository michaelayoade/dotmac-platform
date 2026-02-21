"""Tests for GitHub Webhook Service — push event processing and commit status."""

from __future__ import annotations

import hashlib
import hmac
import uuid
from unittest.mock import patch

import pytest

from tests.conftest import Base, _test_engine


@pytest.fixture(autouse=True)
def _create_tables():
    Base.metadata.create_all(_test_engine)


@pytest.fixture()
def git_repo(db_session):
    from app.models.git_repository import GitAuthType, GitRepository
    from app.services.settings_crypto import encrypt_value

    unique = uuid.uuid4().hex[:8]
    repo = GitRepository(
        label=f"test-repo-{unique}",
        url=f"https://github.com/acme/erp-{unique}.git",
        auth_type=GitAuthType.token,
        token_encrypted=encrypt_value("ghp_testtoken123"),
        webhook_secret_encrypted=encrypt_value("supersecret"),
        default_branch="main",
        is_active=True,
    )
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    return repo


@pytest.fixture()
def server(db_session):
    from app.models.server import Server, ServerStatus

    srv = Server(
        name=f"srv-{uuid.uuid4().hex[:6]}",
        hostname=f"srv-{uuid.uuid4().hex[:6]}.example.com",
        status=ServerStatus.connected,
    )
    db_session.add(srv)
    db_session.commit()
    db_session.refresh(srv)
    return srv


@pytest.fixture()
def instance_auto_deploy(db_session, git_repo, server):
    from app.models.instance import Instance

    inst = Instance(
        server_id=server.server_id,
        org_code=f"AUTO_{uuid.uuid4().hex[:6].upper()}",
        org_name="Auto Deploy Test",
        app_port=8100,
        db_port=5433,
        redis_port=6380,
        git_repo_id=git_repo.repo_id,
        git_branch="main",
        auto_deploy=True,
    )
    db_session.add(inst)
    db_session.commit()
    db_session.refresh(inst)
    return inst


class TestValidateSignature:
    def test_valid_signature(self, db_session, git_repo):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        body = b'{"action":"push"}'
        sig = "sha256=" + hmac.new(b"supersecret", body, hashlib.sha256).hexdigest()
        assert svc.validate_signature(git_repo, body, sig) is True

    def test_invalid_signature(self, db_session, git_repo):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        body = b'{"action":"push"}'
        assert svc.validate_signature(git_repo, body, "sha256=bad") is False

    def test_missing_prefix(self, db_session, git_repo):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        body = b'{"action":"push"}'
        assert svc.validate_signature(git_repo, body, "noprefixhash") is False

    def test_no_secret(self, db_session, git_repo):
        from app.services.github_webhook_service import GitHubWebhookService

        git_repo.webhook_secret_encrypted = None
        db_session.flush()
        svc = GitHubWebhookService(db_session)
        assert svc.validate_signature(git_repo, b"body", "sha256=abc") is False


class TestFindRepoByUrl:
    def test_find_exact(self, db_session, git_repo):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        found = svc.find_repo_by_url(git_repo.url)
        assert found is not None
        assert found.repo_id == git_repo.repo_id

    def test_find_normalized(self, db_session, git_repo):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        # Remove .git suffix — should still match
        url_no_git = git_repo.url.removesuffix(".git")
        found = svc.find_repo_by_url(url_no_git)
        assert found is not None
        assert found.repo_id == git_repo.repo_id

    def test_not_found(self, db_session):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        assert svc.find_repo_by_url(f"https://github.com/nonexistent/{uuid.uuid4().hex}") is None


class TestProcessPushEvent:
    def test_ignores_tag_push(self, db_session, git_repo):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        payload = {"ref": "refs/tags/v1.0.0"}
        log = svc.process_push_event(git_repo, payload)
        assert log.status == "ignored"
        assert log.deployments_triggered == 0

    @patch("app.tasks.deploy.deploy_instance.delay")
    def test_triggers_auto_deploy(self, mock_delay, db_session, git_repo, instance_auto_deploy):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        payload = {
            "ref": "refs/heads/main",
            "head_commit": {"id": "abc123def456"},
            "sender": {"login": "developer"},
            "commits": [{"id": "abc123"}],
        }
        log = svc.process_push_event(git_repo, payload)
        db_session.commit()
        assert log.status == "processed"
        assert log.deployments_triggered == 1
        assert log.branch == "main"
        assert log.commit_sha == "abc123def456"
        assert mock_delay.called

    def test_no_matching_instances(self, db_session, git_repo):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        payload = {
            "ref": "refs/heads/develop",
            "head_commit": {"id": "abc123"},
            "sender": {"login": "dev"},
            "commits": [],
        }
        log = svc.process_push_event(git_repo, payload)
        assert log.status == "processed"
        assert log.deployments_triggered == 0


class TestGetRecentLogs:
    def test_empty(self, db_session):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        logs = svc.get_recent_logs()
        # May contain logs from other tests in shared DB
        assert isinstance(logs, list)

    def test_with_repo_filter(self, db_session, git_repo):
        from app.services.github_webhook_service import GitHubWebhookService

        svc = GitHubWebhookService(db_session)
        svc._create_log(git_repo, "push", branch="main", status="processed")
        db_session.commit()
        logs = svc.get_recent_logs(repo_id=git_repo.repo_id)
        assert len(logs) >= 1


class TestExtractOwnerRepo:
    def test_https_url(self):
        from app.services.github_webhook_service import _extract_owner_repo

        assert _extract_owner_repo("https://github.com/acme/erp.git") == "acme/erp"

    def test_https_no_git_suffix(self):
        from app.services.github_webhook_service import _extract_owner_repo

        assert _extract_owner_repo("https://github.com/acme/erp") == "acme/erp"

    def test_invalid_url(self):
        from app.services.github_webhook_service import _extract_owner_repo

        assert _extract_owner_repo("not-a-url") is None


class TestGitRepoWebhookSecret:
    def test_generate_and_get(self, db_session, git_repo):
        from app.services.git_repo_service import GitRepoService

        svc = GitRepoService(db_session)
        plaintext = svc.generate_webhook_secret(git_repo.repo_id)
        assert len(plaintext) == 64  # 32 bytes hex
        retrieved = svc.get_webhook_secret(git_repo.repo_id)
        assert retrieved == plaintext

    def test_set_and_get(self, db_session, git_repo):
        from app.services.git_repo_service import GitRepoService

        svc = GitRepoService(db_session)
        svc.set_webhook_secret(git_repo.repo_id, "custom_secret")
        db_session.flush()
        assert svc.get_webhook_secret(git_repo.repo_id) == "custom_secret"

    def test_get_nonexistent(self, db_session):
        from app.services.git_repo_service import GitRepoService

        svc = GitRepoService(db_session)
        assert svc.get_webhook_secret(uuid.uuid4()) is None

    def test_set_nonexistent_raises(self, db_session):
        from app.services.git_repo_service import GitRepoService

        svc = GitRepoService(db_session)
        with pytest.raises(ValueError, match="Repo not found"):
            svc.set_webhook_secret(uuid.uuid4(), "secret")


class TestAutoDeployToggle:
    def test_toggle_auto_deploy_api(self, client, admin_headers, admin_org_id, db_session, server):
        from app.models.instance import Instance

        inst = Instance(
            server_id=server.server_id,
            org_id=admin_org_id,
            org_code=f"TOG_{uuid.uuid4().hex[:6].upper()}",
            org_name="Toggle Test",
            app_port=8200,
            db_port=5500,
            redis_port=6500,
        )
        db_session.add(inst)
        db_session.commit()
        db_session.refresh(inst)

        resp = client.post(
            f"/api/v1/instances/{inst.instance_id}/auto-deploy",
            params={"enabled": True},
            headers=admin_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["auto_deploy"] is True
