import uuid

from app.models.instance import Instance, InstanceStatus
from app.models.organization import Organization
from app.models.server import Server


def test_list_orgs_returns_current_org(client, admin_headers):
    resp = client.get("/api/v1/orgs", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] >= 1
    assert len(data["items"]) >= 1


def test_get_org_includes_instance_count(client, admin_headers, db_session, admin_org_id):
    org = db_session.get(Organization, admin_org_id)
    assert org is not None

    server = Server(
        name=f"server-{uuid.uuid4().hex[:6]}",
        hostname="localhost",
        ssh_port=22,
        ssh_user="root",
        ssh_key_path="/root/.ssh/id_rsa",
        is_local=True,
    )
    db_session.add(server)
    db_session.commit()
    db_session.refresh(server)

    for idx in range(2):
        instance = Instance(
            server_id=server.server_id,
            org_id=org.org_id,
            org_code=org.org_code,
            org_name=org.org_name,
            app_port=8080 + idx,
            db_port=5432 + idx,
            redis_port=6379 + idx,
            status=InstanceStatus.running,
        )
        db_session.add(instance)
    db_session.commit()

    resp = client.get(f"/api/v1/orgs/{org.org_id}", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["instance_count"] == 2


def test_list_members_and_add_member(client, admin_headers, db_session, admin_org_id):
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
