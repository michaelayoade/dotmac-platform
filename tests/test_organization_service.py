"""Tests for OrganizationService — covers web methods and contact fields."""

from __future__ import annotations

import uuid

import pytest

from app.models.instance import Instance
from app.models.server import Server, ServerStatus
from app.services.organization_service import OrganizationService


def _unique_code() -> str:
    return f"TST_{uuid.uuid4().hex[:6].upper()}"


def _create_server(db_session) -> Server:
    """Create a minimal server for instance FK."""
    srv = Server(
        name=f"srv-{uuid.uuid4().hex[:6]}",
        hostname=f"srv-{uuid.uuid4().hex[:6]}.test",
        status=ServerStatus.connected,
    )
    db_session.add(srv)
    db_session.flush()
    return srv


class TestCreateOrganization:
    def test_create_with_contact_fields(self, db_session) -> None:
        svc = OrganizationService(db_session)
        org = svc.create(
            org_code=_unique_code(),
            org_name="Acme Corp",
            contact_email="admin@acme.com",
            contact_phone="+1 555-0100",
            notes="Main client",
        )
        db_session.commit()
        assert org.contact_email == "admin@acme.com"
        assert org.contact_phone == "+1 555-0100"
        assert org.notes == "Main client"

    def test_create_without_contact_fields(self, db_session) -> None:
        svc = OrganizationService(db_session)
        org = svc.create(org_code=_unique_code(), org_name="Bare Corp")
        db_session.commit()
        assert org.contact_email is None
        assert org.contact_phone is None
        assert org.notes is None

    def test_create_duplicate_org_code_raises(self, db_session) -> None:
        svc = OrganizationService(db_session)
        code = _unique_code()
        svc.create(org_code=code, org_name="First")
        db_session.commit()
        with pytest.raises(ValueError, match="already exists"):
            svc.create(org_code=code, org_name="Second")


class TestListForWeb:
    def test_search_by_name(self, db_session) -> None:
        svc = OrganizationService(db_session)
        svc.create(org_code=_unique_code(), org_name="Widgets Inc SearchTest")
        db_session.commit()
        items, total = svc.list_for_web(q="SearchTest")
        assert total >= 1
        assert any("SearchTest" in o.org_name for o in items)

    def test_search_by_code(self, db_session) -> None:
        svc = OrganizationService(db_session)
        code = _unique_code()
        svc.create(org_code=code, org_name="Code Search Org")
        db_session.commit()
        items, total = svc.list_for_web(q=code)
        assert total >= 1

    def test_search_by_email(self, db_session) -> None:
        svc = OrganizationService(db_session)
        svc.create(org_code=_unique_code(), org_name="Email Org", contact_email="findme@example.com")
        db_session.commit()
        items, total = svc.list_for_web(q="findme@example")
        assert total >= 1

    def test_filter_active(self, db_session) -> None:
        svc = OrganizationService(db_session)
        org = svc.create(org_code=_unique_code(), org_name="Inactive Org")
        org.is_active = False
        db_session.commit()
        _, active_total = svc.list_for_web(is_active=True)
        _, inactive_total = svc.list_for_web(is_active=False)
        assert inactive_total >= 1
        # The inactive org should not appear in active-only results
        active_items, _ = svc.list_for_web(is_active=True)
        assert org.org_id not in {o.org_id for o in active_items}

    def test_pagination(self, db_session) -> None:
        svc = OrganizationService(db_session)
        for i in range(5):
            svc.create(org_code=_unique_code(), org_name=f"Page Org {i}")
        db_session.commit()
        items_p1, total = svc.list_for_web(page=1, page_size=10)
        assert len(items_p1) <= 10
        assert total >= 5


class TestUpdateContactFields:
    def test_update_email_phone_notes(self, db_session) -> None:
        svc = OrganizationService(db_session)
        org = svc.create(org_code=_unique_code(), org_name="Update Me")
        db_session.commit()

        from app.schemas.organization import OrganizationUpdate

        payload = OrganizationUpdate(
            contact_email="new@example.com",
            contact_phone="+44 20 1234",
            notes="Updated notes",
        )
        updated = svc.update(org.org_id, payload)
        db_session.commit()
        assert updated.contact_email == "new@example.com"
        assert updated.contact_phone == "+44 20 1234"
        assert updated.notes == "Updated notes"


class TestBatchCounts:
    def test_instance_counts_batch(self, db_session) -> None:
        svc = OrganizationService(db_session)
        org = svc.create(org_code=_unique_code(), org_name="Count Org")
        db_session.commit()
        server = _create_server(db_session)
        inst = Instance(
            server_id=server.server_id,
            org_id=org.org_id,
            org_code=f"I_{uuid.uuid4().hex[:6].upper()}",
            org_name="Count Org",
            app_port=8000,
            db_port=5432,
            redis_port=6379,
        )
        db_session.add(inst)
        db_session.commit()

        counts = svc.instance_counts_batch([org.org_id])
        assert counts.get(org.org_id, 0) >= 1

    def test_member_counts_batch(self, db_session, person) -> None:
        svc = OrganizationService(db_session)
        org = svc.create(org_code=_unique_code(), org_name="Member Count Org")
        db_session.commit()
        svc.add_member(org.org_id, person.id)
        db_session.commit()

        counts = svc.member_counts_batch([org.org_id])
        assert counts.get(org.org_id, 0) >= 1

    def test_empty_batch(self, db_session) -> None:
        svc = OrganizationService(db_session)
        assert svc.instance_counts_batch([]) == {}
        assert svc.member_counts_batch([]) == {}


class TestGetInstances:
    def test_returns_instances_for_org(self, db_session) -> None:
        svc = OrganizationService(db_session)
        org = svc.create(org_code=_unique_code(), org_name="Inst Org")
        db_session.commit()
        server = _create_server(db_session)
        inst = Instance(
            server_id=server.server_id,
            org_id=org.org_id,
            org_code=f"I_{uuid.uuid4().hex[:6].upper()}",
            org_name="Inst Org",
            app_port=8001,
            db_port=5433,
            redis_port=6380,
        )
        db_session.add(inst)
        db_session.commit()

        instances = svc.get_instances(org.org_id)
        assert len(instances) >= 1
        assert instances[0].org_id == org.org_id


class TestSerialize:
    def test_serialize_includes_contact_fields(self, db_session) -> None:
        svc = OrganizationService(db_session)
        org = svc.create(
            org_code=_unique_code(),
            org_name="Serialize Org",
            contact_email="ser@test.com",
            notes="Some notes",
        )
        db_session.commit()
        data = svc.serialize(org)
        assert data["contact_email"] == "ser@test.com"
        assert data["notes"] == "Some notes"
        assert data["contact_phone"] is None
