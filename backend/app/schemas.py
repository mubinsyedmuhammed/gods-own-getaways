from pydantic import BaseModel, HttpUrl, field_validator


class HeroContent(BaseModel):
    eyebrow: str
    title: str
    subtitle: str
    primaryCta: str
    secondaryCta: str


class StatContent(BaseModel):
    label: str
    value: str


class DestinationContent(BaseModel):
    name: str
    region: str
    tag: str
    description: str
    price: str


class JourneyContent(BaseModel):
    title: str
    duration: str
    summary: str


class ServiceContent(BaseModel):
    title: str
    description: str


class UnsplashImageContent(BaseModel):
    imageUrl: HttpUrl

    @field_validator("imageUrl")
    @classmethod
    def require_unsplash_host(cls, value: HttpUrl) -> HttpUrl:
        if value.host != "images.unsplash.com":
            raise ValueError("Images must be hosted on images.unsplash.com")
        return value


class GalleryImageContent(UnsplashImageContent):
    alt: str
    caption: str


class AboutContent(UnsplashImageContent):
    eyebrow: str
    title: str
    body: str
    imageAlt: str


class TestimonialContent(BaseModel):
    name: str
    quote: str
    trip: str


class CtaContent(BaseModel):
    title: str
    buttonText: str


class ContactContent(BaseModel):
    email: str
    phone: str
    address: str
    whatsappNumber: str

    @field_validator("whatsappNumber")
    @classmethod
    def normalize_whatsapp_number(cls, value: str) -> str:
        if not value.strip():
            return ""

        digits = "".join(character for character in value if character.isdigit())
        if not 8 <= len(digits) <= 15 or digits.startswith("0"):
            raise ValueError("WhatsApp number must be an international number with 8 to 15 digits")
        return digits


class SiteContentPayload(BaseModel):
    name: str
    tagline: str
    description: str
    hero: HeroContent
    stats: list[StatContent]
    destinations: list[DestinationContent]
    journeys: list[JourneyContent]
    services: list[ServiceContent]
    gallery: list[GalleryImageContent]
    about: AboutContent
    benefits: list[str]
    testimonials: list[TestimonialContent]
    cta: CtaContent
    contact: ContactContent
