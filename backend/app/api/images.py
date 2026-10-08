import logging

from fastapi import APIRouter, Header, HTTPException, Request, status

from app.core.config import get_settings
from app.core.security import require_image_upload_token
from app.services.image_service import MAX_IMAGE_BYTES, get_image_storage, validate_image

router = APIRouter(prefix="/api", tags=["images"])
logger = logging.getLogger(__name__)


@router.post("/images", status_code=status.HTTP_201_CREATED)
async def upload_image(
    request: Request,
    authorization: str | None = Header(default=None),
    x_file_name: str | None = Header(default=None),
) -> dict[str, str]:
    require_image_upload_token(authorization, get_settings())

    content = bytearray()
    async for chunk in request.stream():
        if len(content) + len(chunk) > MAX_IMAGE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image exceeds the 10 MB limit.",
            )
        content.extend(chunk)

    image_content = bytes(content)
    content_type = request.headers.get("content-type", "").split(";", maxsplit=1)[0].strip().lower()
    try:
        key = validate_image(image_content, content_type, x_file_name)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=str(error),
        ) from error

    try:
        image_url = get_image_storage().save(key, image_content, content_type)
    except Exception as error:
        logger.exception("Image upload request failed.")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Image storage failed. Check the configured image storage service.",
        ) from error

    return {"url": image_url}
