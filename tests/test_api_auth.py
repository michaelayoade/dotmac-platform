import uuid


def test_auth_api_requires_admin_role(client, auth_headers):
    response = client.get("/api/v1/user-credentials", headers=auth_headers)
    assert response.status_code == 403


def test_auth_api_allows_admin(client, admin_headers):
    response = client.get("/api/v1/user-credentials", headers=admin_headers)
    assert response.status_code == 200


def test_user_credential_rejects_password_hash_field(client, admin_headers, person):
    payload = {
        "person_id": str(person.id),
        "username": f"user_{uuid.uuid4().hex[:8]}@example.com",
        "password_hash": "should-not-be-accepted",
    }
    response = client.post("/api/v1/user-credentials", json=payload, headers=admin_headers)
    assert response.status_code == 422


def test_user_credential_create_with_password(client, admin_headers, person):
    payload = {
        "person_id": str(person.id),
        "username": f"user_{uuid.uuid4().hex[:8]}@example.com",
        "password": "password123",
    }
    response = client.post("/api/v1/user-credentials", json=payload, headers=admin_headers)
    assert response.status_code == 201
    body = response.json()
    assert body["person_id"] == str(person.id)
    assert body["username"] == payload["username"]
