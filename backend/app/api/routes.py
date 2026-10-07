from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import SiteContent
from app.schemas import SiteContentPayload

router = APIRouter(prefix="/api", tags=["content"])


@router.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    return {"status": "ok", "service": "God's Own Getaways API"}


@router.get("/content", response_model=SiteContentPayload | None)
def get_content(db: Session = Depends(get_db)) -> SiteContentPayload | None:
    content = db.query(SiteContent).first()
    if content is None or content.content is None:
        return None
    return SiteContentPayload.model_validate(content.content)


@router.put("/content", response_model=SiteContentPayload)
def upsert_content(payload: SiteContentPayload, db: Session = Depends(get_db)) -> SiteContentPayload:
    content = db.query(SiteContent).first()
    if content is None:
        content = SiteContent()
        db.add(content)

    data = payload.model_dump(mode="json")
    content.name = payload.name
    content.tagline = payload.tagline
    content.hero_title = payload.hero.title
    content.hero_subtitle = payload.hero.subtitle
    content.primary_cta = payload.hero.primaryCta
    content.secondary_cta = payload.hero.secondaryCta
    content.content = data

    db.commit()
    db.refresh(content)
    return SiteContentPayload.model_validate(content.content)
