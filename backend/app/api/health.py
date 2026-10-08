from fastapi import APIRouter, status

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", status_code=status.HTTP_200_OK)
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "God's Own Getaways API"}
