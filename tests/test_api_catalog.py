import uuid

from app.models.catalog import AppBundle, AppCatalogItem, AppRelease
from app.models.git_repository import GitAuthType, GitRepository


def _seed_catalog_item(db_session, *, label: str, bundle_name: str, bundle_description: str | None) -> AppCatalogItem:
    repo = GitRepository(
        label=f"repo-{uuid.uuid4().hex[:8]}",
        url="git@example.com:repo.git",
        auth_type=GitAuthType.none,
        is_active=True,
    )
    db_session.add(repo)
    db_session.flush()

    release = AppRelease(
        name=f"Release-{uuid.uuid4().hex[:6]}",
        version="1.0.0",
        git_ref="v1.0.0",
        git_repo_id=repo.repo_id,
        is_active=True,
    )
    bundle = AppBundle(
        name=bundle_name,
        description=bundle_description,
        module_slugs=[],
        flag_keys=[],
        is_active=True,
    )
    db_session.add_all([release, bundle])
    db_session.flush()

    item = AppCatalogItem(
        label=label,
        release_id=release.release_id,
        bundle_id=bundle.bundle_id,
        is_active=True,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)
    return item


def test_list_catalog_items_search_matches_bundle_name(client, auth_headers, db_session):
    token = f"core-{uuid.uuid4().hex[:8]}"
    matched = _seed_catalog_item(
        db_session,
        label="Starter",
        bundle_name=f"{token} Platform",
        bundle_description="Primary bundle",
    )
    _seed_catalog_item(
        db_session,
        label="Ops",
        bundle_name="Observability",
        bundle_description="Metrics and tracing",
    )

    response = client.get(f"/api/v1/catalog/items?search={token}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert data[0]["catalog_id"] == str(matched.catalog_id)


def test_list_catalog_items_search_matches_bundle_description(client, auth_headers, db_session):
    token = f"revenue-{uuid.uuid4().hex[:8]}"
    matched = _seed_catalog_item(
        db_session,
        label="Insights",
        bundle_name="Analytics",
        bundle_description=f"Includes {token} Dashboard",
    )
    _seed_catalog_item(
        db_session,
        label="Support",
        bundle_name="Support",
        bundle_description="Helpdesk tools",
    )

    response = client.get(f"/api/v1/catalog/items?search={token}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert data[0]["catalog_id"] == str(matched.catalog_id)
