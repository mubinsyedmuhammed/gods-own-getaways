from functools import lru_cache
import re
import uuid
from pathlib import Path
from typing import Protocol
from urllib.parse import quote

from app.core.config import Settings, get_settings


class ImageStorage(Protocol):
    def save(self, key: str, content: bytes, content_type: str) -> str: ...


class LocalImageStorage:
    def __init__(self, root: Path, public_base_url: str | None = None) -> None:
        self.root = root.resolve()
        self.root.mkdir(parents=True, exist_ok=True)
        self.public_base_url = public_base_url.rstrip("/") if public_base_url else None

    def save(self, key: str, content: bytes, content_type: str) -> str:
        path = (self.root / key).resolve()
        if not path.is_relative_to(self.root):
            raise ValueError("Image storage key escapes the configured storage directory.")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
        base_url = self.public_base_url or "/media"
        return f"{base_url}/{quote(key, safe='/')}"


class S3ImageStorage:
    def __init__(self, settings: Settings) -> None:
        try:
            import boto3
        except ImportError as error:
            raise RuntimeError("Install the backend requirements to use S3 image storage.") from error

        if not settings.s3_bucket or not settings.image_public_base_url:
            raise ValueError("S3_BUCKET and IMAGE_PUBLIC_BASE_URL are required for S3 image storage.")
        self.bucket = settings.s3_bucket
        self.public_base_url = settings.image_public_base_url.rstrip("/")
        self.client = boto3.client(
            "s3",
            region_name=settings.s3_region,
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
        )

    def save(self, key: str, content: bytes, content_type: str) -> str:
        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=content,
            ContentType=content_type,
            CacheControl="public, max-age=31536000, immutable",
        )
        return f"{self.public_base_url}/{quote(key, safe='/')}"


_CONTENT_TYPES = {
    "image/jpeg": ("jpg", lambda data: data.startswith(b"\xff\xd8\xff")),
    "image/png": ("png", lambda data: data.startswith(b"\x89PNG\r\n\x1a\n")),
    "image/webp": ("webp", lambda data: data.startswith(b"RIFF") and data[8:12] == b"WEBP"),
    "image/gif": ("gif", lambda data: data.startswith((b"GIF87a", b"GIF89a"))),
    "image/avif": ("avif", lambda data: len(data) >= 12 and data[4:8] == b"ftyp" and b"avif" in data[8:16]),
}
MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_IMAGE_FILENAME_LENGTH = 255
_SAFE_FILENAME = re.compile(r"[^A-Za-z0-9._-]+")


def validate_image(content: bytes, content_type: str, filename: str | None) -> str:
    if not content:
        raise ValueError("The uploaded image is empty.")
    image_type = _CONTENT_TYPES.get(content_type.lower())
    if image_type is None or not image_type[1](content):
        raise ValueError("Upload must be a valid JPEG, PNG, WebP, GIF, or AVIF image.")

    original_name = (filename or "image").strip()[:MAX_IMAGE_FILENAME_LENGTH]
    stem = _SAFE_FILENAME.sub("-", Path(original_name).stem).strip(".-_")[:80] or "image"
    return f"{uuid.uuid4().hex}-{stem}.{image_type[0]}"


@lru_cache(maxsize=1)
def get_image_storage() -> ImageStorage:
    settings = get_settings()
    settings.validate_image_storage()
    if settings.image_storage_backend == "s3":
        return S3ImageStorage(settings)
    return LocalImageStorage(settings.image_storage_dir, settings.image_public_base_url)
