from __future__ import annotations

import re

from app.models.rbac import RolePermission


def _extract_csrf_token(html: str) -> str:
    match = re.search(r'name="csrf_token"\s+value="([^"]+)"', html)
    assert match, "csrf_token hidden input not found"
    return match.group(1)


def test_remove_role_permission_rejects_invalid_role_id(
    client,
    db_session,
    admin_token,
    role,
    permission,
):
    link = RolePermission(role_id=role.id, permission_id=permission.id)
    db_session.add(link)
    db_session.commit()
    db_session.refresh(link)

    client.cookies.set("access_token", admin_token)
    page = client.get("/rbac")
    assert page.status_code == 200
    csrf_token = _extract_csrf_token(page.text)

    response = client.post(
        f"/rbac/role-permissions/{link.id}/delete",
        data={"role_id": f"{role.id}&injected=true", "csrf_token": csrf_token},
        follow_redirects=False,
    )

    assert response.status_code == 400
    assert response.json()["message"] == "Invalid role_id"
    assert db_session.get(RolePermission, link.id) is not None
