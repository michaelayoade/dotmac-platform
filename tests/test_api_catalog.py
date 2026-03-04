import uuid

from app.models.catalog import AppCatalogItem
from app.models.git_repository import GitAuthType, GitRepository


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


def _seed_item(db_session, repo_id) -> AppCatalogItem:
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


def test_admin_can_purge_inactive_catalog_item(client, admin_headers, db_session):
    repo = _seed_repo(db_session)
    item = _seed_item(db_session, repo.repo_id)
    item.is_active = False
    db_session.commit()

    response = client.delete(f"/api/v1/catalog/items/{item.catalog_id}/purge", headers=admin_headers)
    assert response.status_code == 204
    assert db_session.get(AppCatalogItem, item.catalog_id) is None


def test_admin_cannot_purge_active_catalog_item(client, admin_headers, db_session):
    repo = _seed_repo(db_session)
    item = _seed_item(db_session, repo.repo_id)

    response = client.delete(f"/api/v1/catalog/items/{item.catalog_id}/purge", headers=admin_headers)
    assert response.status_code == 400
    assert "inactive" in response.json()["message"].lower()


def test_purge_requires_admin(client, auth_headers, db_session):
    repo = _seed_repo(db_session)
    item = _seed_item(db_session, repo.repo_id)
    item.is_active = False
    db_session.commit()

    response = client.delete(f"/api/v1/catalog/items/{item.catalog_id}/purge", headers=auth_headers)
    assert response.status_code == 403


def test_list_catalog_items(client, auth_headers, db_session):
    repo = _seed_repo(db_session)
    item = _seed_item(db_session, repo.repo_id)

    response = client.get("/api/v1/catalog/items", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert any(d["catalog_id"] == str(item.catalog_id) for d in data["items"])


def test_create_catalog_item(client, admin_headers, db_session):
    repo = _seed_repo(db_session)

    response = client.post(
        "/api/v1/catalog/items",
        json={
            "label": "Test Item",
            "version": "2.0.0",
            "git_ref": "v2.0.0",
            "git_repo_id": str(repo.repo_id),
            "module_slugs": ["core", "hr"],
            "flag_keys": ["feature_x"],
        },
        headers=admin_headers,
    )
    assert response.status_code == 201
    assert "catalog_id" in response.json()


def test_deactivate_catalog_item(client, admin_headers, db_session):
    repo = _seed_repo(db_session)
    item = _seed_item(db_session, repo.repo_id)

    response = client.delete(f"/api/v1/catalog/items/{item.catalog_id}", headers=admin_headers)
    assert response.status_code == 204
    db_session.refresh(item)
    assert item.is_active is False
