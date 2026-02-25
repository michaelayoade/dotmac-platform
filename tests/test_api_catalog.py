import uuid

import pytest

from app.models.catalog import AppBundle, AppCatalogItem, AppRelease
from app.models.git_repository import GitAuthType, GitRepository


def _seed_repo(db_session) -> GitRepository:
    repo = GitRepository(
        label=f"repo-{uuid.uuid4().hex[:8]}",
        url="https://example.com/repo.git",
        auth_type=GitAuthType.none,
        is_active=True,
    )
    db_session.add(repo)
    db_session.commit()
    db_session.refresh(repo)
    return repo


def _seed_release(db_session, repo_id) -> AppRelease:
    release = AppRelease(
        name=f"Release-{uuid.uuid4().hex[:6]}",
        version="1.0.0",
        git_ref="main",
        git_repo_id=repo_id,
        is_active=True,
    )
    db_session.add(release)
    db_session.commit()
    db_session.refresh(release)
    return release


def _seed_bundle(db_session, *, name: str | None = None, description: str | None = None) -> AppBundle:
    bundle = AppBundle(
        name=name or f"Bundle-{uuid.uuid4().hex[:6]}",
        description=description or "Test bundle",
        module_slugs=[],
        flag_keys=[],
        is_active=True,
    )
    db_session.add(bundle)
    db_session.commit()
    db_session.refresh(bundle)
    return bundle


def _seed_item(db_session, release_id, bundle_id, *, label: str | None = None) -> AppCatalogItem:
    item = AppCatalogItem(
        label=label or f"Catalog-{uuid.uuid4().hex[:6]}",
        release_id=release_id,
        bundle_id=bundle_id,
        is_active=True,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


def test_list_catalog_items_search_matches_bundle_name(client, auth_headers, db_session):
    token = f"core-{uuid.uuid4().hex[:8]}"
    repo = _seed_repo(db_session)
    release = _seed_release(db_session, repo.repo_id)
    matched_bundle = _seed_bundle(db_session, name=f"{token} Platform", description="Primary bundle")
    matched = _seed_item(db_session, release.release_id, matched_bundle.bundle_id, label="Starter")

    other_bundle = _seed_bundle(db_session, name="Observability", description="Metrics and tracing")
    _seed_item(db_session, release.release_id, other_bundle.bundle_id, label="Ops")

    response = client.get(f"/api/v1/catalog/items?search={token}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert data[0]["catalog_id"] == str(matched.catalog_id)


def test_list_catalog_items_search_matches_bundle_description(client, auth_headers, db_session):
    token = f"revenue-{uuid.uuid4().hex[:8]}"
    repo = _seed_repo(db_session)
    release = _seed_release(db_session, repo.repo_id)
    matched_bundle = _seed_bundle(db_session, name="Analytics", description=f"Includes {token} Dashboard")
    matched = _seed_item(db_session, release.release_id, matched_bundle.bundle_id, label="Insights")

    other_bundle = _seed_bundle(db_session, name="Support", description="Helpdesk tools")
    _seed_item(db_session, release.release_id, other_bundle.bundle_id, label="Support")

    response = client.get(f"/api/v1/catalog/items?search={token}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert data[0]["catalog_id"] == str(matched.catalog_id)


def test_admin_can_purge_inactive_release(client, admin_headers, db_session):
    repo = _seed_repo(db_session)
    release = _seed_release(db_session, repo.repo_id)
    release.is_active = False
    db_session.commit()

    response = client.delete(f"/api/v1/catalog/releases/{release.release_id}/purge", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["deleted"] == str(release.release_id)
    assert db_session.get(AppRelease, release.release_id) is None


def test_admin_cannot_purge_active_release(client, admin_headers, db_session):
    repo = _seed_repo(db_session)
    release = _seed_release(db_session, repo.repo_id)

    response = client.delete(f"/api/v1/catalog/releases/{release.release_id}/purge", headers=admin_headers)
    assert response.status_code == 400
    assert "inactive" in response.json()["detail"].lower()


def test_admin_cannot_purge_inactive_release_with_catalog_items(client, admin_headers, db_session):
    repo = _seed_repo(db_session)
    release = _seed_release(db_session, repo.repo_id)
    bundle = _seed_bundle(db_session)
    _seed_item(db_session, release.release_id, bundle.bundle_id)
    release.is_active = False
    db_session.commit()

    response = client.delete(f"/api/v1/catalog/releases/{release.release_id}/purge", headers=admin_headers)
    assert response.status_code == 400
    assert "referenced" in response.json()["detail"].lower()


def test_admin_can_purge_inactive_bundle(client, admin_headers, db_session):
    bundle = _seed_bundle(db_session)
    bundle.is_active = False
    db_session.commit()

    response = client.delete(f"/api/v1/catalog/bundles/{bundle.bundle_id}/purge", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["deleted"] == str(bundle.bundle_id)
    assert db_session.get(AppBundle, bundle.bundle_id) is None


def test_admin_can_purge_inactive_catalog_item(client, admin_headers, db_session):
    repo = _seed_repo(db_session)
    release = _seed_release(db_session, repo.repo_id)
    bundle = _seed_bundle(db_session)
    item = _seed_item(db_session, release.release_id, bundle.bundle_id)
    item.is_active = False
    db_session.commit()

    response = client.delete(f"/api/v1/catalog/items/{item.catalog_id}/purge", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["deleted"] == str(item.catalog_id)
    assert db_session.get(AppCatalogItem, item.catalog_id) is None


@pytest.mark.parametrize(
    "path_builder",
    [
        lambda release, bundle, item: f"/api/v1/catalog/releases/{release.release_id}/purge",
        lambda release, bundle, item: f"/api/v1/catalog/bundles/{bundle.bundle_id}/purge",
        lambda release, bundle, item: f"/api/v1/catalog/items/{item.catalog_id}/purge",
    ],
)
def test_purge_requires_admin(client, auth_headers, db_session, path_builder):
    repo = _seed_repo(db_session)
    release = _seed_release(db_session, repo.repo_id)
    bundle = _seed_bundle(db_session)
    item = _seed_item(db_session, release.release_id, bundle.bundle_id)
    release.is_active = False
    bundle.is_active = False
    item.is_active = False
    db_session.commit()

    response = client.delete(path_builder(release, bundle, item), headers=auth_headers)
    assert response.status_code == 403
