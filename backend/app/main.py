from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import router
from app.core.config import get_settings

settings = get_settings()
settings.validate_image_storage()

app = FastAPI(title=settings.app_name, version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
if settings.image_storage_backend == "local":
    app.mount(
        "/media",
        StaticFiles(directory=settings.image_storage_dir, check_dir=False),
        name="media",
    )


@app.get("/")
def landing():
    return {"message": "Welcome to God's Own Getaways API"}
