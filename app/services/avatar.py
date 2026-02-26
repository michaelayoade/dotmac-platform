import logging
import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

logger = logging.getLogger(__name__)

from app.config import settings


def get_allowed_types() -> set[str]:
    return set(settings.avatar_allowed_types.split(","))


def validate_avatar(file: UploadFile) -> None:
    allowed_types = get_allowed_types()
    if not file.content_type:
        raise HTTPException(status_code=400, detail="Missing file content type")
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
        )


def _detect_content_type_from_magic(content: bytes) -> str | None:
    header = content[:12]
    if header.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if header.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if header.startswith(b"GIF8"):
        return "image/gif"
    if len(header) >= 12 and header.startswith(b"RIFF") and header[8:12] == b"WEBP":
        return "image/webp"
    return None


async def save_avatar(file: UploadFile, person_id: str) -> str:
    validate_avatar(file)

    upload_dir = Path(settings.avatar_upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    content = await file.read()
    detected_content_type = _detect_content_type_from_magic(content)
    allowed_types = get_allowed_types()
    if detected_content_type not in allowed_types:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid file signature. Allowed: {', '.join(sorted(allowed_types))}",
        )
    assert detected_content_type is not None

    if len(content) > settings.avatar_max_size_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.avatar_max_size_bytes // 1024 // 1024}MB",
        )

    ext = _get_extension(detected_content_type)
    filename = f"{person_id}_{uuid.uuid4().hex[:8]}{ext}"
    file_path = upload_dir / filename

    with open(file_path, "wb") as f:
        f.write(content)

    return f"{settings.avatar_url_prefix}/{filename}"


def delete_avatar(avatar_url: str | None) -> None:
    if not avatar_url:
        return

    if avatar_url.startswith(settings.avatar_url_prefix):
        filename = avatar_url.replace(settings.avatar_url_prefix + "/", "")
        upload_dir = Path(settings.avatar_upload_dir).resolve()
        file_path = (upload_dir / filename).resolve()
        # Prevent path traversal — resolved path must stay within upload dir
        if not str(file_path).startswith(str(upload_dir) + os.sep) and file_path != upload_dir:
            return
        if file_path.exists():
            os.remove(file_path)


def _get_extension(content_type: str) -> str:
    extensions = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
    }
    return extensions.get(content_type, ".jpg")
