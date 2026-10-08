import re
from datetime import datetime
from urllib.parse import unquote, urlparse

from pydantic import BaseModel, Field, field_validator, model_validator

from app.core.config import get_settings


def slugify(value: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", value.lower().strip())).strip("-")


class HeroContent(BaseModel):
    eyebrow: str
    title: str
    subtitle: str
    primaryCta: str
    secondaryCta: str


class StatContent(BaseModel):
    label: str
    value: str


class SluggedContent(BaseModel):
    slug: str

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, value: str) -> str:
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", value):
            raise ValueError("Slug must contain lowercase letters, numbers, and hyphens only")
        return value


class UnsplashImageContent(BaseModel):
    imageUrl: str = ""

    @field_validator("imageUrl")
    @classmethod
    def validate_image_url(cls, value: str) -> str:
        if not value:
            return value
        if value.startswith("/media/"):
            parsed_local = urlparse(value)
            if not parsed_local.query and not parsed_local.fragment and ".." not in unquote(parsed_local.path).split("/"):
                return value
        parsed = urlparse(value)
        if parsed.scheme != "https" or parsed.hostname not in get_settings().allowed_image_hostnames:
            raise ValueError("Images must use HTTPS and a hostname configured in IMAGE_ALLOWED_HOSTS.")
        return value


class DestinationContent(SluggedContent, UnsplashImageContent):
    id: int | None = None
    createdAt: datetime | None = None
    updatedAt: datetime | None = None
    name: str
    region: str = ""
    tag: str = ""
    shortDescription: str = ""
    description: str = ""
    price: str = ""
    imageAlt: str = ""
    highlights: list[str] = Field(default_factory=list)
    featured: bool = True
    active: bool = True
    sortOrder: int = 0


class PackageContent(SluggedContent, UnsplashImageContent):
    id: int | None = None
    createdAt: datetime | None = None
    updatedAt: datetime | None = None
    title: str
    destinationId: int | None = None
    destinationSlug: str = ""
    duration: str = ""
    summary: str = ""
    shortDescription: str = ""
    description: str = ""
    price: str = ""
    currency: str = ""
    imageAlt: str = ""
    galleryImages: list[str] = Field(default_factory=list)
    itinerary: list[str] = Field(default_factory=list)
    includedItems: list[str] = Field(default_factory=list)
    excludedItems: list[str] = Field(default_factory=list)
    active: bool = True
    featured: bool = True
    sortOrder: int = 0
    highlights: list[str] = Field(default_factory=list)

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        currency = value.strip().upper()
        if currency and not re.fullmatch(r"[A-Z]{3}", currency):
            raise ValueError("Currency must be a three-letter ISO code")
        return currency


class ServiceContent(BaseModel):
    id: int | None = None
    createdAt: datetime | None = None
    updatedAt: datetime | None = None
    title: str
    slug: str = ""
    shortDescription: str = ""
    description: str = ""
    icon: str = ""
    image: str = ""
    featured: bool = False
    active: bool = True
    sortOrder: int = 0

    @model_validator(mode="after")
    def create_slug(self) -> "ServiceContent":
        if not self.slug:
            self.slug = slugify(self.title)
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", self.slug):
            raise ValueError("Slug must contain lowercase letters, numbers, and hyphens only")
        return self


class GalleryImageContent(UnsplashImageContent):
    id: int | None = None
    createdAt: datetime | None = None
    updatedAt: datetime | None = None
    title: str = ""
    alt: str = ""
    altText: str = ""
    caption: str = ""
    category: str = ""
    sortOrder: int = 0
    active: bool = True


class AboutContent(UnsplashImageContent):
    eyebrow: str
    title: str
    body: str
    imageAlt: str


class TestimonialContent(BaseModel):
    id: int | None = None
    createdAt: datetime | None = None
    updatedAt: datetime | None = None
    name: str = ""
    quote: str = ""
    trip: str = ""
    customerName: str = ""
    customerLocation: str = ""
    content: str = ""
    rating: int = 5
    image: str = ""
    featured: bool = False
    active: bool = True
    sortOrder: int = 0

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, value: int) -> int:
        if not 1 <= value <= 5:
            raise ValueError("Rating must be between 1 and 5")
        return value

    @model_validator(mode="after")
    def keep_legacy_fields_in_sync(self) -> "TestimonialContent":
        self.customerName = self.customerName or self.name
        self.name = self.name or self.customerName
        self.content = self.content or self.quote
        self.quote = self.quote or self.content
        return self


class CtaContent(BaseModel):
    title: str
    buttonText: str


class ContactContent(BaseModel):
    email: str
    phone: str
    address: str
    whatsappNumber: str
    googleMapsUrl: str = ""

    @field_validator("whatsappNumber")
    @classmethod
    def normalize_whatsapp_number(cls, value: str) -> str:
        if not value.strip():
            return ""

        digits = "".join(character for character in value if character.isdigit())
        if not 8 <= len(digits) <= 15 or digits.startswith("0"):
            raise ValueError("WhatsApp number must be an international number with 8 to 15 digits")
        return digits


class SiteSettingsContent(BaseModel):
    logo: str = ""
    favicon: str = ""
    instagramUrl: str = ""
    facebookUrl: str = ""
    youtubeUrl: str = ""
    footerText: str = ""


class SiteContentPayload(BaseModel):
    name: str
    tagline: str
    description: str
    hero: HeroContent
    stats: list[StatContent]
    destinations: list[DestinationContent]
    packages: list[PackageContent]
    services: list[ServiceContent]
    gallery: list[GalleryImageContent]
    about: AboutContent
    benefits: list[str]
    testimonials: list[TestimonialContent]
    cta: CtaContent
    contact: ContactContent
    settings: SiteSettingsContent = Field(default_factory=SiteSettingsContent)

    @model_validator(mode="after")
    def ensure_unique_slugs(self) -> "SiteContentPayload":
        for label, records in (
            ("destination", self.destinations),
            ("package", self.packages),
            ("service", self.services),
        ):
            slugs = [record.slug for record in records]
            if len(slugs) != len(set(slugs)):
                raise ValueError(f"{label.capitalize()} slugs must be unique")
        destination_slugs = {destination.slug for destination in self.destinations}
        if any(package.destinationSlug and package.destinationSlug not in destination_slugs for package in self.packages):
            raise ValueError("Packages must reference an existing destination slug")
        return self
