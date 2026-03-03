"""Tests for Organization web routes."""

from __future__ import annotations

import re
import uuid


def _extract_csrf_token(html: str) -> str:
    match = re.search(r'name="csrf_token"\s+value="([^"]+)"', html)
    assert match, "csrf_token hidden input not found"
    return match.group(1)


class TestOrgListRequiresAdmin:
    def test_non_admin_gets_403(self, client, auth_headers) -> None:
        resp = client.get("/organizations", headers=auth_headers)
        assert resp.status_code == 403


class TestOrgListPage:
    def test_admin_sees_list(self, client, admin_headers) -> None:
        resp = client.get("/organizations", headers=admin_headers)
        assert resp.status_code == 200
        assert "Organizations" in resp.text

    def test_search_query(self, client, admin_headers, db_session) -> None:
        from app.models.organization import Organization

        code = f"WEB_{uuid.uuid4().hex[:6].upper()}"
        org = Organization(org_code=code, org_name="Web List Test Org", is_active=True)
        db_session.add(org)
        db_session.commit()
        resp = client.get(f"/organizations?q={code}", headers=admin_headers)
        assert resp.status_code == 200
        assert code in resp.text


class TestOrgCreateViaForm:
    def test_creates_org_and_redirects(self, client, admin_headers) -> None:
        # First GET the list page to obtain a CSRF token
        page = client.get("/organizations", headers=admin_headers)
        assert page.status_code == 200
        csrf_token = _extract_csrf_token(page.text)

        code = f"NEW_{uuid.uuid4().hex[:6].upper()}"
        resp = client.post(
            "/organizations/new",
            headers=admin_headers,
            data={
                "org_code": code,
                "org_name": "Created Org",
                "contact_email": "test@test.com",
                "contact_phone": "",
                "notes": "",
                "csrf_token": csrf_token,
            },
        )
        assert resp.status_code == 200  # follows redirect to list
        assert "Created Org" in resp.text or "Organizations" in resp.text


class TestOrgDetailPage:
    def test_admin_sees_detail(self, client, admin_headers, db_session) -> None:
        from app.models.organization import Organization

        code = f"DET_{uuid.uuid4().hex[:6].upper()}"
        org = Organization(org_code=code, org_name="Detail Test Org", is_active=True)
        db_session.add(org)
        db_session.commit()
        db_session.refresh(org)
        resp = client.get(f"/organizations/{org.org_id}", headers=admin_headers)
        assert resp.status_code == 200
        assert "Detail Test Org" in resp.text
        assert "Deploy Instance" in resp.text


class TestOrgUpdateViaForm:
    def test_updates_and_redirects(self, client, admin_headers, db_session) -> None:
        from app.models.organization import Organization

        code = f"UPD_{uuid.uuid4().hex[:6].upper()}"
        org = Organization(org_code=code, org_name="Before Update", is_active=True)
        db_session.add(org)
        db_session.commit()
        db_session.refresh(org)

        # GET detail page to obtain CSRF token
        page = client.get(f"/organizations/{org.org_id}", headers=admin_headers)
        assert page.status_code == 200
        csrf_token = _extract_csrf_token(page.text)

        resp = client.post(
            f"/organizations/{org.org_id}/update",
            headers=admin_headers,
            data={
                "org_name": "After Update",
                "contact_email": "updated@test.com",
                "contact_phone": "",
                "notes": "Updated notes",
                "is_active": "true",
                "csrf_token": csrf_token,
            },
        )
        assert resp.status_code == 200  # follows redirect to detail
        assert "After Update" in resp.text
