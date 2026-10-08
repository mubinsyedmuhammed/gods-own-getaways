"""API package."""
from fastapi import APIRouter

from app.api.content import router as content_router
from app.api.health import router as health_router
from app.api.images import router as images_router

router = APIRouter()
router.include_router(content_router)
router.include_router(images_router)
router.include_router(health_router)
