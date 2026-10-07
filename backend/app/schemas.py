from pydantic import BaseModel


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


class SiteContentPayload(BaseModel):
    name: str
    tagline: str
    description: str
    hero: HeroContent
    stats: list[StatContent]
    destinations: list[DestinationContent]
    journeys: list[JourneyContent]
    benefits: list[str]
    testimonials: list[TestimonialContent]
    cta: CtaContent
    contact: ContactContent
