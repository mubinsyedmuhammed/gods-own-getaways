import asyncio
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException
from starlette.datastructures import Headers

from app.api.images import upload_image
from app.core.config import Settings, get_settings
from app.services.image_service import LocalImageStorage, validate_image


class ImageUploadRequest:
    def __init__(self, image: bytes, content_type: str = "image/png") -> None:
        self.image = image
        self.headers = Headers({"content-type": content_type})

    async def stream(self):
        yield self.image


class ImageStorageTests(unittest.TestCase):
    def test_local_storage_saves_image_bytes_outside_the_database(self):
        image = b"\x89PNG\r\n\x1a\nexample image bytes"
        with tempfile.TemporaryDirectory() as temp_dir:
            storage = LocalImageStorage(Path(temp_dir))
            key = validate_image(image, "image/png", "../../holiday.png")

            url = storage.save(key, image, "image/png")

            self.assertTrue(url.startswith("/media/"))
            self.assertEqual((Path(temp_dir) / key).read_bytes(), image)
            self.assertNotIn("..", Path(key).parts)

    def test_image_validation_rejects_content_type_mismatch(self):
        with self.assertRaisesRegex(ValueError, "valid JPEG"):
            validate_image(b"not an image", "image/jpeg", "photo.jpg")

    def test_local_storage_rejects_traversal_key(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            storage = LocalImageStorage(Path(temp_dir))

            with self.assertRaisesRegex(ValueError, "escapes"):
                storage.save("../outside.png", b"data", "image/png")

    def test_production_requires_object_storage(self):
        with self.assertRaisesRegex(ValueError, "Production deployments"):
            Settings(app_env="production").validate_image_storage()

    def test_upload_api_requires_and_uses_configured_token(self):
        image = b"\x89PNG\r\n\x1a\nexample image bytes"
        with tempfile.TemporaryDirectory() as temp_dir, patch.dict(
            os.environ,
            {
                "APP_ENV": "development",
                "IMAGE_STORAGE_BACKEND": "local",
                "IMAGE_STORAGE_DIR": temp_dir,
                "IMAGE_UPLOAD_TOKEN": "test-upload-token",
            },
            clear=False,
        ):
            get_settings.cache_clear()
            result = asyncio.run(
                upload_image(ImageUploadRequest(image), "Bearer test-upload-token", "holiday.png")
            )
            get_settings.cache_clear()

            self.assertTrue(result["url"].startswith("/media/"))
            saved_path = Path(temp_dir) / result["url"].removeprefix("/media/")
            self.assertEqual(saved_path.read_bytes(), image)

    def test_upload_api_rejects_invalid_token(self):
        with patch.dict(os.environ, {"IMAGE_UPLOAD_TOKEN": "configured-token"}, clear=False):
            get_settings.cache_clear()
            with self.assertRaises(HTTPException) as raised:
                asyncio.run(
                    upload_image(
                        ImageUploadRequest(b"\x89PNG\r\n\x1a\nimage"),
                        "Bearer wrong-token",
                        "holiday.png",
                    )
                )
            get_settings.cache_clear()

            self.assertEqual(raised.exception.status_code, 401)
