"""Tests for platform improvements wave 1: ListResponse wrappers, response_model, CSV export, DELETE consistency."""

from __future__ import annotations

import csv
import io
import uuid

from app.models.catalog import AppCatalogItem
from app.models.git_repository import GitAuthType, GitRepository
from app.models.instance import Instance, InstanceStatus
from app.models.server import Server

# ── Helpers ──────────────────────────────────────────────────────────────


def _seed_server(db_session) -> Server:
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


def _seed_instance(db_session, server, **overrides) -> Instance:
    code = f"inst-{uuid.uuid4().hex[:8]}"
    defaults = {
        "server_id": server.server_id,
        "org_code": code,
        "org_name": f"Org {code}",
        "app_port": 8080,
        "db_port": 5432,
        "redis_port": 6379,
        "status": InstanceStatus.running,
    }
    defaults.update(overrides)
    instance = Instance(**defaults)
    db_session.add(instance)
    db_session.commit()
    db_session.refresh(instance)
    return instance


def _seed_repo(db_session) -> GitRepository:
    repo = GitRepository(
        label=f"repo-{uuid.uuid4().hex[:8]}",
        auth_type=GitAuthType.none,
        registry_url="ghcr.io/acme/repo",
        is_active=True,
    )
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    return repo


def _seed_catalog_item(db_session, repo_id) -> AppCatalogItem:
    item = AppCatalogItem(
        label=f"Catalog-{uuid.uuid4().hex[:6]}",
        version="1.0.0",
        git_ref="main",
        git_repo_id=repo_id,
        module_slugs=[],
        flag_keys=[],
        is_active=True,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


# ── Catalog ListResponse Tests ──────────────────────────────────────────


class TestCatalogListResponse:
    def test_list_returns_paginated_response(self, client, auth_headers, db_session):
        repo = _seed_repo(db_session)
        item = _seed_catalog_item(db_session, repo.repo_id)

        response = client.get("/api/v1/catalog/items", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data
        assert "limit" in data
        assert "offset" in data
        assert isinstance(data["items"], list)
        assert data["count"] >= 1
        assert any(d["catalog_id"] == str(item.catalog_id) for d in data["items"])

    def test_list_respects_limit_and_offset(self, client, auth_headers, db_session):
        repo = _seed_repo(db_session)
        for _ in range(3):
            _seed_catalog_item(db_session, repo.repo_id)

        response = client.get("/api/v1/catalog/items?limit=1&offset=0", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1
        assert data["limit"] == 1
        assert data["offset"] == 0

    def test_catalog_item_schema_has_flattened_fields(self, client, auth_headers, db_session):
        repo = _seed_repo(db_session)
        _seed_catalog_item(db_session, repo.repo_id)

        response = client.get("/api/v1/catalog/items", headers=auth_headers)
        item = response.json()["items"][0]
        assert "version" in item
        assert "git_ref" in item
        assert "git_repo_id" in item
        assert "release_id" not in item
        assert "bundle_id" not in item


class TestCatalogCreateResponse:
    def test_create_returns_full_item(self, client, admin_headers, db_session):
        repo = _seed_repo(db_session)

        response = client.post(
            "/api/v1/catalog/items",
            json={
                "label": "Test Item",
                "version": "2.0.0",
                "git_ref": "v2.0.0",
                "git_repo_id": str(repo.repo_id),
                "module_slugs": ["core"],
                "flag_keys": [],
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert "catalog_id" in data
        assert data["label"] == "Test Item"
        assert data["version"] == "2.0.0"


class TestCatalogDeleteConsistency:
    def test_deactivate_returns_204_no_body(self, client, admin_headers, db_session):
        repo = _seed_repo(db_session)
        item = _seed_catalog_item(db_session, repo.repo_id)

        response = client.delete(f"/api/v1/catalog/items/{item.catalog_id}", headers=admin_headers)
        assert response.status_code == 204
        assert response.content == b""

    def test_purge_returns_204_no_body(self, client, admin_headers, db_session):
        repo = _seed_repo(db_session)
        item = _seed_catalog_item(db_session, repo.repo_id)
        item.is_active = False
        db_session.commit()

        response = client.delete(f"/api/v1/catalog/items/{item.catalog_id}/purge", headers=admin_headers)
        assert response.status_code == 204
        assert response.content == b""


# ── Git Repos ListResponse Tests ────────────────────────────────────────


class TestGitReposListResponse:
    def test_list_returns_paginated_response(self, client, admin_headers, db_session):
        repo = _seed_repo(db_session)

        response = client.get("/api/v1/git-repos", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data
        assert data["count"] >= 1
        assert any(r["repo_id"] == str(repo.repo_id) for r in data["items"])

    def test_create_returns_response_model(self, client, admin_headers):
        response = client.post(
            "/api/v1/git-repos",
            json={
                "label": f"test-{uuid.uuid4().hex[:6]}",
                "registry_url": "ghcr.io/test/repo",
                "auth_type": "none",
            },
            headers=admin_headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert "repo_id" in data
        assert "label" in data

    def test_delete_returns_204(self, client, admin_headers, db_session):
        repo = _seed_repo(db_session)

        response = client.delete(f"/api/v1/git-repos/{repo.repo_id}", headers=admin_headers)
        assert response.status_code == 204
        assert response.content == b""

    def test_purge_returns_204(self, client, admin_headers, db_session):
        repo = _seed_repo(db_session)
        repo.is_active = False
        db_session.commit()

        response = client.delete(f"/api/v1/git-repos/{repo.repo_id}/purge", headers=admin_headers)
        assert response.status_code == 204
        assert response.content == b""


# ── SSH Keys ListResponse Tests ─────────────────────────────────────────


class TestSSHKeysListResponse:
    def test_list_returns_paginated_response(self, client, admin_headers):
        response = client.get("/api/v1/ssh-keys", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data
        assert "limit" in data
        assert "offset" in data

    def test_delete_returns_204(self, client, admin_headers):
        # Generate a key first
        gen_resp = client.post(
            "/api/v1/ssh-keys/generate",
            json={"label": f"test-{uuid.uuid4().hex[:6]}", "key_type": "ed25519"},
            headers=admin_headers,
        )
        assert gen_resp.status_code == 201
        key_id = gen_resp.json()["key_id"]

        response = client.delete(f"/api/v1/ssh-keys/{key_id}", headers=admin_headers)
        assert response.status_code == 204
        assert response.content == b""


# ── Instance CSV Export Tests ────────────────────────────────────────────


class TestInstanceExport:
    def test_export_csv_returns_valid_csv(self, client, admin_headers, db_session):
        server = _seed_server(db_session)
        inst = _seed_instance(db_session, server, admin_email="test@example.com")

        response = client.get("/api/v1/instances/export", headers=admin_headers)
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/csv")
        assert response.headers["content-disposition"] == 'attachment; filename="instances.csv"'

        reader = csv.DictReader(io.StringIO(response.text))
        assert "instance_id" in reader.fieldnames
        assert "org_code" in reader.fieldnames
        assert "status" in reader.fieldnames
        assert "admin_email" in reader.fieldnames

        rows = list(reader)
        assert any(row["org_code"] == inst.org_code for row in rows)

    def test_export_csv_status_filter(self, client, admin_headers, db_session):
        server = _seed_server(db_session)
        running = _seed_instance(db_session, server, status=InstanceStatus.running)
        _seed_instance(db_session, server, status=InstanceStatus.stopped)

        response = client.get("/api/v1/instances/export?status=running", headers=admin_headers)
        assert response.status_code == 200

        rows = list(csv.DictReader(io.StringIO(response.text)))
        assert any(row["org_code"] == running.org_code for row in rows)
        assert all(row["status"] == "running" for row in rows)

    def test_export_requires_admin(self, client, auth_headers):
        response = client.get("/api/v1/instances/export", headers=auth_headers)
        assert response.status_code == 403

    def test_export_max_rows_header(self, client, admin_headers, db_session):
        response = client.get("/api/v1/instances/export?max_rows=5", headers=admin_headers)
        assert response.status_code == 200
        assert response.headers["x-row-limit"] == "5"


# ── Notification Channels ListResponse Tests ────────────────────────────


class TestNotificationChannelsListResponse:
    def test_list_returns_paginated_response(self, client, auth_headers, db_session, person):
        from app.models.notification_channel import ChannelType
        from app.services.notification_channel_service import NotificationChannelService

        svc = NotificationChannelService(db_session)
        svc.create_channel(
            person_id=person.id,
            channel_type=ChannelType.email,
            label="Test Channel",
            config={"email": "test@example.com"},
        )
        db_session.commit()

        response = client.get("/api/v1/notification-channels", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data
        assert data["count"] >= 1
