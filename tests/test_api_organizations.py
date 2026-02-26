import uuid


def test_list_orgs_returns_current_org(client, admin_headers):
    resp = client.get("/api/v1/orgs", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] >= 1
    assert len(data["items"]) >= 1


def test_list_orgs_includes_instance_count(client, admin_headers, db_session, admin_org_id):
    from app.models.instance import Instance
    from app.models.server import Server

    server = Server(name="org-test-server", hostname="org-test.example.com")
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)

    instance = Instance(
        server_id=server.server_id,
        org_id=admin_org_id,
        org_code=f"ORGTEST_{uuid.uuid4().hex[:8].upper()}",
        org_name="Admin Org",
        app_port=18080,
        db_port=15432,
        redis_port=16379,
    )
    db_session.add(instance)
    db_session.commit()

    expected_count = db_session.query(Instance).filter(Instance.org_id == admin_org_id).count()

    resp = client.get("/api/v1/orgs", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] == 1
    assert data["items"][0]["instance_count"] == expected_count


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
