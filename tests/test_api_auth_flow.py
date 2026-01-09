import uuid
from datetime import datetime, timedelta, timezone

import pytest

from app.models.auth import (
    MFAMethod,
    MFAMethodType,
    Session as AuthSession,
    SessionStatus,
    UserCredential,
)
from app.services.auth_flow import hash_password


class TestLoginAPI:
    """Tests for the /auth/login endpoint."""

    def test_login_success(self, client, db_session, person):
        """Test successful login."""
        # Create user credential
        credential = UserCredential(
            person_id=person.id,
            username=f"loginuser_{uuid.uuid4().hex[:8]}",
            password_hash=hash_password("password123"),
            is_active=True,
        )
        db_session.add(credential)
        db_session.commit()

        payload = {"username": credential.username, "password": "password123"}
        response = client.post("/auth/login", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data or "mfa_required" in data

    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials."""
        payload = {"username": "nonexistent", "password": "wrongpassword"}
        response = client.post("/auth/login", json=payload)
        assert response.status_code in [401, 404]

    def test_login_wrong_password(self, client, db_session, person):
        """Test login with wrong password."""
        credential = UserCredential(
            person_id=person.id,
            username=f"wrongpwd_{uuid.uuid4().hex[:8]}",
            password_hash=hash_password("correctpassword"),
            is_active=True,
        )
        db_session.add(credential)
        db_session.commit()

        payload = {"username": credential.username, "password": "wrongpassword"}
        response = client.post("/auth/login", json=payload)
        assert response.status_code == 401

    def test_login_inactive_credential(self, client, db_session, person):
        """Test login with inactive credential."""
        credential = UserCredential(
            person_id=person.id,
            username=f"inactive_{uuid.uuid4().hex[:8]}",
            password_hash=hash_password("password123"),
            is_active=False,
        )
        db_session.add(credential)
        db_session.commit()

        payload = {"username": credential.username, "password": "password123"}
        response = client.post("/auth/login", json=payload)
        assert response.status_code in [401, 404]


class TestMeAPI:
    """Tests for the /auth/me endpoints."""

    def test_get_me(self, client, auth_headers, person):
        """Test getting current user profile."""
        response = client.get("/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == person.first_name
        assert data["email"] == person.email

    def test_get_me_unauthorized(self, client):
        """Test getting profile without auth."""
        response = client.get("/auth/me")
        assert response.status_code == 401

    def test_update_me(self, client, auth_headers, person):
        """Test updating current user profile."""
        payload = {"first_name": "UpdatedName"}
        response = client.patch("/auth/me", json=payload, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == "UpdatedName"

    def test_update_me_multiple_fields(self, client, auth_headers):
        """Test updating multiple profile fields."""
        payload = {
            "first_name": "NewFirst",
            "last_name": "NewLast",
            "phone": "+1111111111",
        }
        response = client.patch("/auth/me", json=payload, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == "NewFirst"
        assert data["last_name"] == "NewLast"


class TestSessionsAPI:
    """Tests for the /auth/me/sessions endpoints."""

    def test_list_sessions(self, client, auth_headers, auth_session):
        """Test listing user sessions."""
        response = client.get("/auth/me/sessions", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "sessions" in data
        assert "total" in data
        assert isinstance(data["sessions"], list)

    def test_list_sessions_unauthorized(self, client):
        """Test listing sessions without auth."""
        response = client.get("/auth/me/sessions")
        assert response.status_code == 401

    def test_revoke_session(self, client, auth_headers, db_session, person):
        """Test revoking a specific session."""
        # Create another session to revoke
        other_session = AuthSession(
            person_id=person.id,
            token_hash="other-token-hash",
            status=SessionStatus.active,
            ip_address="192.168.1.1",
            user_agent="other-client",
            expires_at=datetime.now(timezone.utc) + timedelta(days=30),
        )
        db_session.add(other_session)
        db_session.commit()
        db_session.refresh(other_session)

        response = client.delete(
            f"/auth/me/sessions/{other_session.id}", headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "revoked_at" in data

    def test_revoke_session_not_found(self, client, auth_headers):
        """Test revoking a non-existent session."""
        fake_id = str(uuid.uuid4())
        response = client.delete(f"/auth/me/sessions/{fake_id}", headers=auth_headers)
        assert response.status_code == 404

    def test_revoke_all_other_sessions(self, client, auth_headers, db_session, person):
        """Test revoking all other sessions."""
        # Create additional sessions
        for i in range(3):
            session = AuthSession(
                person_id=person.id,
                token_hash=f"session-{i}-hash",
                status=SessionStatus.active,
                ip_address=f"192.168.1.{i}",
                user_agent=f"client-{i}",
                expires_at=datetime.now(timezone.utc) + timedelta(days=30),
            )
            db_session.add(session)
        db_session.commit()

        response = client.delete("/auth/me/sessions", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "revoked_at" in data


class TestPasswordAPI:
    """Tests for password-related endpoints."""

    def test_change_password(self, client, auth_headers, db_session, person):
        """Test changing password."""
        # Create credential for the authenticated user
        credential = UserCredential(
            person_id=person.id,
            username=f"changepwd_{uuid.uuid4().hex[:8]}",
            password_hash=hash_password("oldpassword123"),
            is_active=True,
        )
        db_session.add(credential)
        db_session.commit()

        payload = {
            "current_password": "oldpassword123",
            "new_password": "newpassword456",
        }
        response = client.post("/auth/me/password", json=payload, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "changed_at" in data

    def test_change_password_wrong_current(self, client, auth_headers, db_session, person):
        """Test changing password with wrong current password."""
        credential = UserCredential(
            person_id=person.id,
            username=f"wrongcurrent_{uuid.uuid4().hex[:8]}",
            password_hash=hash_password("correctpassword"),
            is_active=True,
        )
        db_session.add(credential)
        db_session.commit()

        payload = {
            "current_password": "wrongpassword",
            "new_password": "newpassword456",
        }
        response = client.post("/auth/me/password", json=payload, headers=auth_headers)
        assert response.status_code == 401

    def test_change_password_same_password(self, client, auth_headers, db_session, person):
        """Test changing password to the same password."""
        credential = UserCredential(
            person_id=person.id,
            username=f"samepwd_{uuid.uuid4().hex[:8]}",
            password_hash=hash_password("samepassword"),
            is_active=True,
        )
        db_session.add(credential)
        db_session.commit()

        payload = {
            "current_password": "samepassword",
            "new_password": "samepassword",
        }
        response = client.post("/auth/me/password", json=payload, headers=auth_headers)
        assert response.status_code == 400

    def test_forgot_password(self, client, db_session, person):
        """Test forgot password request."""
        payload = {"email": person.email}
        response = client.post("/auth/forgot-password", json=payload)
        # Always returns success to prevent email enumeration
        assert response.status_code == 200

    def test_forgot_password_nonexistent_email(self, client):
        """Test forgot password with non-existent email."""
        payload = {"email": "nonexistent@example.com"}
        response = client.post("/auth/forgot-password", json=payload)
        # Should still return success to prevent email enumeration
        assert response.status_code == 200


class TestRefreshAPI:
    """Tests for token refresh endpoint."""

    def test_refresh_invalid_token(self, client):
        """Test refresh with invalid token."""
        payload = {"refresh_token": "invalid-refresh-token"}
        response = client.post("/auth/refresh", json=payload)
        assert response.status_code == 401


class TestLogoutAPI:
    """Tests for logout endpoint."""

    def test_logout_invalid_token(self, client):
        """Test logout with invalid token."""
        payload = {"refresh_token": "invalid-refresh-token"}
        response = client.post("/auth/logout", json=payload)
        assert response.status_code in [401, 404]


class TestMFAAPI:
    """Tests for MFA-related endpoints."""

    def test_mfa_setup(self, client, db_session, person):
        """Test MFA setup."""
        payload = {"person_id": str(person.id), "label": "Test Device"}
        response = client.post("/auth/mfa/setup", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "secret" in data or "provisioning_uri" in data or "method_id" in data

    def test_mfa_confirm_invalid(self, client):
        """Test MFA confirm with invalid method."""
        payload = {"method_id": str(uuid.uuid4()), "code": "123456"}
        response = client.post("/auth/mfa/confirm", json=payload)
        assert response.status_code in [400, 401, 404]

    def test_mfa_verify_invalid_token(self, client):
        """Test MFA verify with invalid token."""
        payload = {"mfa_token": "invalid-mfa-token", "code": "123456"}
        response = client.post("/auth/mfa/verify", json=payload)
        assert response.status_code in [401, 404]


class TestAuthFlowAPIV1:
    """Tests for the /api/v1/auth endpoints."""

    def test_login_v1(self, client, db_session, person):
        """Test login via v1 API."""
        credential = UserCredential(
            person_id=person.id,
            username=f"v1login_{uuid.uuid4().hex[:8]}",
            password_hash=hash_password("password123"),
            is_active=True,
        )
        db_session.add(credential)
        db_session.commit()

        payload = {"username": credential.username, "password": "password123"}
        response = client.post("/api/v1/auth/login", json=payload)
        assert response.status_code == 200

    def test_get_me_v1(self, client, auth_headers):
        """Test get me via v1 API."""
        response = client.get("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200

    def test_forgot_password_v1(self, client):
        """Test forgot password via v1 API."""
        payload = {"email": "test@example.com"}
        response = client.post("/api/v1/auth/forgot-password", json=payload)
        assert response.status_code == 200
