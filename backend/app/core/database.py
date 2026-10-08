from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.database_url, pool_pre_ping=True) if settings.database_url else None
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    if engine is None:
        raise RuntimeError("DATABASE_URL must be configured before using database routes")

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
