"""SSH Keys API — manage SSH keys and server assignments."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role

router = APIRouter(prefix="/ssh-keys", tags=["ssh-keys"])


@router.get("")
def list_keys(
    active_only: bool = True,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.ssh_key_service import SSHKeyService

    keys = SSHKeyService(db).list_keys(active_only=active_only)
    return [
        {
            "key_id": str(k.key_id),
            "label": k.label,
            "public_key": k.public_key,
            "fingerprint": k.fingerprint,
            "key_type": k.key_type.value,
            "bit_size": k.bit_size,
            "created_by": k.created_by,
            "is_active": k.is_active,
            "created_at": k.created_at.isoformat() if k.created_at else None,
        }
        for k in keys
    ]


@router.post("/generate", status_code=status.HTTP_201_CREATED)
def generate_key(
    label: str = Body(...),
    key_type: str = Body("ed25519"),
    bit_size: int | None = Body(None),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.ssh_key_service import SSHKeyService

    try:
        key = SSHKeyService(db).generate_key(
            label=label,
            key_type=key_type,
            bit_size=bit_size,
            created_by=auth.get("person_id"),
        )
        db.commit()
        return {"key_id": str(key.key_id), "label": key.label, "fingerprint": key.fingerprint}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/import", status_code=status.HTTP_201_CREATED)
def import_key(
    label: str = Body(...),
    private_key_pem: str = Body(...),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.ssh_key_service import SSHKeyService

    try:
        key = SSHKeyService(db).import_key(label=label, private_key_pem=private_key_pem, created_by=auth.get("person_id"))
        db.commit()
        return {"key_id": str(key.key_id), "label": key.label, "fingerprint": key.fingerprint}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{key_id}/public")
def get_public_key(
    key_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.ssh_key_service import SSHKeyService

    try:
        return {"public_key": SSHKeyService(db).get_public_key(key_id)}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{key_id}/deploy")
def deploy_key(
    key_id: UUID,
    server_id: UUID = Body(...),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.ssh_key_service import SSHKeyService

    try:
        SSHKeyService(db).deploy_to_server(key_id, server_id)
        db.commit()
        return {"key_id": str(key_id), "server_id": str(server_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/servers/{server_id}/rotate")
def rotate_key(
    server_id: UUID,
    new_key_id: UUID = Body(...),
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.ssh_key_service import SSHKeyService

    try:
        SSHKeyService(db).rotate_key(server_id, new_key_id)
        db.commit()
        return {"server_id": str(server_id), "key_id": str(new_key_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{key_id}")
def delete_key(
    key_id: UUID,
    db: Session = Depends(get_db),
    auth=Depends(require_role("admin")),
):
    from app.services.ssh_key_service import SSHKeyService

    try:
        SSHKeyService(db).delete_key(key_id)
        db.commit()
        return {"deleted": str(key_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
