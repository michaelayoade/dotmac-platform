import uuid


def test_list_orgs_returns_current_org(client, admin_headers):
    resp = client.get("/api/v1/orgs", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] >= 1
    assert len(data["items"]) >= 1
    assert "member_count" in data["items"][0]
    assert isinstance(data["items"][0]["member_count"], int)


def test_get_org_includes_member_count(client, admin_headers, admin_org_id):
    resp = client.get(f"/api/v1/orgs/{admin_org_id}", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "member_count" in data
    assert isinstance(data["member_count"], int)


def test_list_members_and_add_member(client, admin_headers, db_session, admin_org_id):
    from app.models.organization import Organization
    from app.models.person import Person

    org = db_session.get(Organization, admin_org_id)

    # Create a person to add
    person = Person(
        first_name="Org",
        last_name="Member",
        email=f"member_{uuid.uuid4().hex[:8]}@example.com",
    )
    db_session.add(person)
    db_session.commit()
    db_session.refresh(person)

    resp = client.post(
        f"/api/v1/orgs/{org.org_id}/members",
        json={"person_id": str(person.id)},
        headers=admin_headers,
    )
    assert resp.status_code == 201

    list_resp = client.get(f"/api/v1/orgs/{org.org_id}/members", headers=admin_headers)
    assert list_resp.status_code == 200
    data = list_resp.json()
    assert any(item["person_id"] == str(person.id) for item in data["items"])
