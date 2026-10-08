from functools import lru_cache
from pathlib import Path
from urllib.parse import urlparse

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "God's Own Getaways"
    app_env: str = "development"
    database_url: str | None = None
    backend_cors_origins: list[str] = []
    image_storage_backend: str = "local"
    image_storage_dir: Path = Path("uploads")
    image_public_base_url: str | None = None
    image_allowed_hosts: str = "images.unsplash.com"
    image_upload_token: str | None = None
    s3_bucket: str | None = None
    s3_region: str | None = None
    s3_endpoint_url: str | None = None
    s3_access_key_id: str | None = None
    s3_secret_access_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    def validate_image_storage(self) -> None:
        if self.image_storage_backend not in {"local", "s3"}:
            raise ValueError("IMAGE_STORAGE_BACKEND must be either 'local' or 's3'.")
        if self.app_env.lower() == "production" and self.image_storage_backend == "local":
            raise ValueError("Production deployments must use object storage with IMAGE_STORAGE_BACKEND=s3.")
        if self.image_storage_backend == "s3" and not self.s3_bucket:
            raise ValueError("S3_BUCKET is required when IMAGE_STORAGE_BACKEND=s3.")
        if self.image_storage_backend == "s3" and not self.image_public_base_url:
            raise ValueError("IMAGE_PUBLIC_BASE_URL is required when IMAGE_STORAGE_BACKEND=s3.")
        if self.image_storage_backend == "s3":
            public_url = urlparse(self.image_public_base_url or "")
            if public_url.scheme != "https" or not public_url.hostname:
                raise ValueError("IMAGE_PUBLIC_BASE_URL must be an HTTPS CDN or object-storage URL.")

    @property
    def allowed_image_hostnames(self) -> set[str]:
        configured_hosts = {
            hostname.strip().lower()
            for hostname in self.image_allowed_hosts.split(",")
            if hostname.strip()
        }
        if self.image_public_base_url:
            hostname = urlparse(self.image_public_base_url).hostname
            if hostname:
                configured_hosts.add(hostname.lower())
        return configured_hosts

    @property
    def cors_origins(self) -> list[str]:
        return self.backend_cors_origins


@lru_cache
def get_settings() -> Settings:
    return Settings()
