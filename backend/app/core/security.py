import secrets

from fastapi import HTTPException, status

from app.core.config import Settings


def require_image_upload_token(
    authorization: str | None,
    settings: Settings,
) -> None:
    token = settings.image_upload_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Image uploads are disabled until IMAGE_UPLOAD_TOKEN is configured.",
        )

    expected = f"Bearer {token}".encode("utf-8")
    provided = authorization.encode("utf-8") if authorization else b""
    if not secrets.compare_digest(provided, expected):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid image upload token.")
