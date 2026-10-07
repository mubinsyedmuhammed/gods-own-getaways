from sqlalchemy import JSON, Boolean, Column, Integer, String, Text

from app.database import Base


class SiteContent(Base):
    __tablename__ = "site_content"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, default="God's Own Getaways")
    tagline = Column(String(255), nullable=False, default="Handcrafted journeys across Kerala and beyond")
    hero_title = Column(String(255), nullable=False, default="Travel beautifully. Feel deeply.")
    hero_subtitle = Column(Text, nullable=False, default="Slow down, wander deeper.")
    primary_cta = Column(String(120), nullable=False, default="Plan my escape")
    secondary_cta = Column(String(120), nullable=False, default="Explore itineraries")
    is_published = Column(Boolean, default=True)
    content = Column(JSON, nullable=True)
