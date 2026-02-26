import uuid


class TestPersonsAPI:
    """Tests for the /people API endpoints."""

    def test_create_person(self, client, admin_headers):
        """Test creating a new person (admin only)."""
        payload = {
            "first_name": "John",
            "last_name": "Doe",
            "email": f"john.doe.{uuid.uuid4().hex[:8]}@example.com",
        }
        response = client.post("/api/v1/people", json=payload, headers=admin_headers)
        assert response.status_code == 201
        data = response.json()
        assert data["first_name"] == "John"
        assert data["last_name"] == "Doe"
        assert "id" in data

    def test_create_person_with_all_fields(self, client, admin_headers):
        """Test creating a person with all optional fields."""
        payload = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": f"jane.smith.{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+1234567890",
            "display_name": "Jane S.",
            "locale": "en-US",
            "timezone": "America/New_York",
        }
        response = client.post("/api/v1/people", json=payload, headers=admin_headers)
        assert response.status_code == 201
        data = response.json()
        assert data["first_name"] == "Jane"
        assert data["phone"] == "+1234567890"
        assert data["locale"] == "en-US"

    def test_create_person_unauthorized(self, client):
        """Test that creating a person requires authentication."""
        payload = {
            "first_name": "Test",
            "last_name": "User",
            "email": "test@example.com",
        }
        response = client.post("/api/v1/people", json=payload)
        assert response.status_code == 401

    def test_get_person(self, client, auth_headers, person):
        """Test getting a person by ID."""
        response = client.get(f"/api/v1/people/{person.id}", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(person.id)
        assert data["first_name"] == person.first_name

    def test_get_person_not_found(self, client, auth_headers):
        """Test getting a non-existent person."""
        fake_id = str(uuid.uuid4())
        response = client.get(f"/api/v1/people/{fake_id}", headers=auth_headers)
        assert response.status_code == 404

    def test_list_people(self, client, auth_headers, person):
        """Test listing people."""
        response = client.get("/api/v1/people", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data
        assert isinstance(data["items"], list)

    def test_list_people_with_pagination(self, client, auth_headers, db_session):
        """Test listing people with pagination."""
        from app.models.person import Person

        # Create multiple people
        for i in range(5):
            p = Person(
                first_name=f"Test{i}",
                last_name="User",
                email=f"test{i}_{uuid.uuid4().hex[:8]}@example.com",
            )
            db_session.add(p)
        db_session.commit()

        response = client.get("/api/v1/people?limit=2&offset=0", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) <= 2

    def test_list_people_with_filters(self, client, auth_headers, person):
        """Test listing people with email filter."""
        response = client.get(f"/api/v1/people?email={person.email}", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) >= 1

    def test_list_people_with_search_query(self, client, auth_headers, db_session):
        """Test listing people with partial query match on email or display_name."""
        from app.models.person import Person

        email_match = Person(
            first_name="Search",
            last_name="Email",
            email=f"lookup.{uuid.uuid4().hex[:8]}@example.com",
            display_name="No Match Name",
        )
        display_name_match = Person(
            first_name="Search",
            last_name="Display",
            email=f"other.{uuid.uuid4().hex[:8]}@example.com",
            display_name="Alpha Tester",
        )
        db_session.add_all([email_match, display_name_match])
        db_session.commit()

        response_email = client.get("/api/v1/people?query=lookup", headers=auth_headers)
        assert response_email.status_code == 200
        email_items = response_email.json()["items"]
        assert any(item["id"] == str(email_match.id) for item in email_items)

        response_display_name = client.get("/api/v1/people?query=alpha", headers=auth_headers)
        assert response_display_name.status_code == 200
        display_name_items = response_display_name.json()["items"]
        assert any(item["id"] == str(display_name_match.id) for item in display_name_items)

    def test_list_people_with_ordering(self, client, auth_headers):
        """Test listing people with custom ordering."""
        response = client.get("/api/v1/people?order_by=last_name&order_dir=asc", headers=auth_headers)
        assert response.status_code == 200

    def test_update_person(self, client, admin_headers, db_session, person, admin_org_id):
        """Test updating a person (admin only)."""
        from app.models.organization_member import OrganizationMember

        db_session.add(OrganizationMember(org_id=admin_org_id, person_id=person.id, is_active=True))
        db_session.commit()

        payload = {"first_name": "Updated"}
        response = client.patch(f"/api/v1/people/{person.id}", json=payload, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == "Updated"

    def test_update_person_multiple_fields(self, client, admin_headers, db_session, person, admin_org_id):
        """Test updating multiple fields of a person."""
        from app.models.organization_member import OrganizationMember

        db_session.add(OrganizationMember(org_id=admin_org_id, person_id=person.id, is_active=True))
        db_session.commit()

        payload = {
            "first_name": "UpdatedFirst",
            "last_name": "UpdatedLast",
            "phone": "+9876543210",
        }
        response = client.patch(f"/api/v1/people/{person.id}", json=payload, headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == "UpdatedFirst"
        assert data["last_name"] == "UpdatedLast"
        assert data["phone"] == "+9876543210"

    def test_update_person_not_found(self, client, admin_headers):
        """Test updating a non-existent person."""
        fake_id = str(uuid.uuid4())
        payload = {"first_name": "Updated"}
        response = client.patch(f"/api/v1/people/{fake_id}", json=payload, headers=admin_headers)
        assert response.status_code == 404

    def test_delete_person(self, client, admin_headers, db_session, admin_org_id):
        """Test deleting a person (admin only)."""
        from app.models.organization_member import OrganizationMember
        from app.models.person import Person

        # Create a person to delete
        person = Person(
            first_name="ToDelete",
            last_name="User",
            email=f"delete_{uuid.uuid4().hex[:8]}@example.com",
        )
        db_session.add(person)
        db_session.commit()
        db_session.refresh(person)
        db_session.add(OrganizationMember(org_id=admin_org_id, person_id=person.id, is_active=True))
        db_session.commit()

        response = client.delete(f"/api/v1/people/{person.id}", headers=admin_headers)
        assert response.status_code == 204

    def test_delete_person_not_found(self, client, admin_headers):
        """Test deleting a non-existent person."""
        fake_id = str(uuid.uuid4())
        response = client.delete(f"/api/v1/people/{fake_id}", headers=admin_headers)
        assert response.status_code == 404

    def test_create_person_forbidden_non_admin(self, client, auth_headers):
        """Test that non-admin cannot create a person."""
        payload = {
            "first_name": "Forbidden",
            "last_name": "User",
            "email": f"forbidden_{uuid.uuid4().hex[:8]}@example.com",
        }
        response = client.post("/api/v1/people", json=payload, headers=auth_headers)
        assert response.status_code == 403

    def test_update_person_forbidden_non_admin(self, client, auth_headers, person):
        """Test that non-admin cannot update a person."""
        payload = {"first_name": "Forbidden"}
        response = client.patch(f"/api/v1/people/{person.id}", json=payload, headers=auth_headers)
        assert response.status_code == 403

    def test_delete_person_forbidden_non_admin(self, client, auth_headers, person):
        """Test that non-admin cannot delete a person."""
        response = client.delete(f"/api/v1/people/{person.id}", headers=auth_headers)
        assert response.status_code == 403


class TestPersonsAPIV1:
    """Tests for the /api/v1/people endpoints."""

    def test_create_person_v1(self, client, admin_headers):
        """Test creating a person via v1 API (admin only)."""
        payload = {
            "first_name": "V1",
            "last_name": "User",
            "email": f"v1_{uuid.uuid4().hex[:8]}@example.com",
        }
        response = client.post("/api/v1/people", json=payload, headers=admin_headers)
        assert response.status_code == 201

    def test_get_person_v1(self, client, auth_headers, person):
        """Test getting a person via v1 API."""
        response = client.get(f"/api/v1/people/{person.id}", headers=auth_headers)
        assert response.status_code == 200

    def test_list_people_v1(self, client, auth_headers):
        """Test listing people via v1 API."""
        response = client.get("/api/v1/people", headers=auth_headers)
        assert response.status_code == 200
