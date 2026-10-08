from collections.abc import Callable, Sequence
from typing import Any

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Destination, GalleryImage, Service, SiteContent, Testimonial, TravelPackage
from app.schemas import (
    DestinationContent,
    GalleryImageContent,
    PackageContent,
    ServiceContent,
    SiteContentPayload,
    TestimonialContent,
)

router = APIRouter(prefix="/api", tags=["content"])


def _sync_records(
    db: Session,
    model: type[Any],
    items: Sequence[Any],
    values_for: Callable[[Any], dict[str, Any]],
    *,
    match_by_slug: bool = False,
) -> list[Any]:
    existing = db.query(model).all()
    by_id = {record.id: record for record in existing}
    by_slug = {record.slug: record for record in existing} if match_by_slug else {}
    retained: set[Any] = set()
    saved: list[Any] = []

    for item in items:
        record = by_id.get(item.id) if item.id is not None else None
        if record is None and match_by_slug:
            record = by_slug.get(item.slug)
        if record is None:
            record = model()

        for field, value in values_for(item).items():
            setattr(record, field, value)
        db.add(record)
        retained.add(record)
        saved.append(record)

    for record in existing:
        if record not in retained:
            db.delete(record)

    db.flush()
    return saved


def _destination_values(item: DestinationContent) -> dict[str, Any]:
    return {
        "name": item.name,
        "slug": item.slug,
        "short_description": item.shortDescription,
        "description": item.description,
        "region": item.region,
        "tag": item.tag,
        "price": item.price,
        "cover_image": item.imageUrl,
        "image_alt": item.imageAlt,
        "highlights": item.highlights,
        "featured": item.featured,
        "active": item.active,
        "sort_order": item.sortOrder,
    }


def _package_values(item: PackageContent, destinations: dict[str, Destination]) -> dict[str, Any]:
    destination = destinations.get(item.destinationSlug)
    if destination is None and item.destinationId is not None:
        destination = next((value for value in destinations.values() if value.id == item.destinationId), None)
    return {
        "destination_id": destination.id if destination is not None else None,
        "title": item.title,
        "slug": item.slug,
        "short_description": item.shortDescription or item.summary,
        "description": item.description,
        "duration": item.duration,
        "summary": item.summary,
        "price": item.price,
        "currency": item.currency,
        "cover_image": item.imageUrl,
        "image_alt": item.imageAlt,
        "gallery_images": item.galleryImages,
        "itinerary": item.itinerary,
        "included_items": item.includedItems,
        "excluded_items": item.excludedItems,
        "highlights": item.highlights,
        "featured": item.featured,
        "active": item.active,
        "sort_order": item.sortOrder,
    }


def _service_values(item: ServiceContent) -> dict[str, Any]:
    return {
        "title": item.title,
        "slug": item.slug,
        "short_description": item.shortDescription,
        "description": item.description,
        "icon": item.icon,
        "image": item.image,
        "featured": item.featured,
        "active": item.active,
        "sort_order": item.sortOrder,
    }


def _gallery_values(item: GalleryImageContent) -> dict[str, Any]:
    return {
        "image_url": item.imageUrl,
        "title": item.title,
        "alt_text": item.altText or item.alt,
        "caption": item.caption,
        "category": item.category,
        "sort_order": item.sortOrder,
        "active": item.active,
    }


def _testimonial_values(item: TestimonialContent) -> dict[str, Any]:
    return {
        "customer_name": item.customerName,
        "customer_location": item.customerLocation,
        "content": item.content,
        "rating": item.rating,
        "image": item.image,
        "trip": item.trip,
        "featured": item.featured,
        "active": item.active,
        "sort_order": item.sortOrder,
    }


def _serialize_destination(record: Destination) -> dict[str, Any]:
    return {
        "id": record.id,
        "slug": record.slug,
        "name": record.name,
        "region": record.region,
        "tag": record.tag,
        "shortDescription": record.short_description,
        "description": record.description,
        "price": record.price,
        "imageUrl": record.cover_image,
        "imageAlt": record.image_alt,
        "highlights": record.highlights,
        "featured": record.featured,
        "active": record.active,
        "sortOrder": record.sort_order,
        "createdAt": record.created_at,
        "updatedAt": record.updated_at,
    }


def _serialize_package(record: TravelPackage, destinations: dict[int, Destination]) -> dict[str, Any]:
    destination = destinations.get(record.destination_id)
    return {
        "id": record.id,
        "destinationId": record.destination_id,
        "destinationSlug": destination.slug if destination is not None else "",
        "slug": record.slug,
        "title": record.title,
        "duration": record.duration,
        "summary": record.summary,
        "shortDescription": record.short_description,
        "description": record.description,
        "price": record.price,
        "currency": record.currency,
        "imageUrl": record.cover_image,
        "imageAlt": record.image_alt,
        "galleryImages": record.gallery_images,
        "itinerary": record.itinerary,
        "includedItems": record.included_items,
        "excludedItems": record.excluded_items,
        "highlights": record.highlights,
        "featured": record.featured,
        "active": record.active,
        "sortOrder": record.sort_order,
        "createdAt": record.created_at,
        "updatedAt": record.updated_at,
    }


def _serialize_service(record: Service) -> dict[str, Any]:
    return {
        "id": record.id,
        "title": record.title,
        "slug": record.slug,
        "shortDescription": record.short_description,
        "description": record.description,
        "icon": record.icon,
        "image": record.image,
        "featured": record.featured,
        "active": record.active,
        "sortOrder": record.sort_order,
        "createdAt": record.created_at,
        "updatedAt": record.updated_at,
    }


def _serialize_gallery_image(record: GalleryImage) -> dict[str, Any]:
    return {
        "id": record.id,
        "imageUrl": record.image_url,
        "title": record.title,
        "alt": record.alt_text,
        "altText": record.alt_text,
        "caption": record.caption,
        "category": record.category,
        "sortOrder": record.sort_order,
        "active": record.active,
        "createdAt": record.created_at,
        "updatedAt": record.updated_at,
    }


def _serialize_testimonial(record: Testimonial) -> dict[str, Any]:
    return {
        "id": record.id,
        "name": record.customer_name,
        "quote": record.content,
        "trip": record.trip,
        "customerName": record.customer_name,
        "customerLocation": record.customer_location,
        "content": record.content,
        "rating": record.rating,
        "image": record.image,
        "featured": record.featured,
        "active": record.active,
        "sortOrder": record.sort_order,
        "createdAt": record.created_at,
        "updatedAt": record.updated_at,
    }


@router.get("/content", response_model=SiteContentPayload | None)
def get_content(db: Session = Depends(get_db)) -> SiteContentPayload | None:
    content = db.query(SiteContent).first()
    if content is None or content.content is None:
        return None

    data = dict(content.content)
    destinations = db.query(Destination).order_by(Destination.sort_order, Destination.id).all()
    packages = db.query(TravelPackage).order_by(TravelPackage.sort_order, TravelPackage.id).all()
    services = db.query(Service).order_by(Service.sort_order, Service.id).all()
    gallery = db.query(GalleryImage).order_by(GalleryImage.sort_order, GalleryImage.id).all()
    testimonials = db.query(Testimonial).order_by(Testimonial.sort_order, Testimonial.id).all()

    if destinations:
        data["destinations"] = [_serialize_destination(item) for item in destinations]
    if packages:
        destination_by_id = {item.id: item for item in destinations}
        data["packages"] = [_serialize_package(item, destination_by_id) for item in packages]
    if services:
        data["services"] = [_serialize_service(item) for item in services]
    if gallery:
        data["gallery"] = [_serialize_gallery_image(item) for item in gallery]
    if testimonials:
        data["testimonials"] = [_serialize_testimonial(item) for item in testimonials]

    for collection in ("destinations", "packages", "services", "gallery", "testimonials"):
        data.setdefault(collection, [])
    return SiteContentPayload.model_validate(data)


@router.put("/content", response_model=SiteContentPayload)
def upsert_content(payload: SiteContentPayload, db: Session = Depends(get_db)) -> SiteContentPayload:
    content = db.query(SiteContent).first()
    if content is None:
        content = SiteContent()
        db.add(content)

    data = payload.model_dump(
        mode="json",
        exclude_unset=True,
        exclude={"destinations", "packages", "services", "gallery", "testimonials"},
    )
    content.name = payload.name
    content.tagline = payload.tagline
    content.hero_title = payload.hero.title
    content.hero_subtitle = payload.hero.subtitle
    content.primary_cta = payload.hero.primaryCta
    content.secondary_cta = payload.hero.secondaryCta
    content.content = data
    db.flush()

    destinations = _sync_records(
        db,
        Destination,
        payload.destinations,
        _destination_values,
        match_by_slug=True,
    )
    destinations_by_slug = {item.slug: item for item in destinations}
    _sync_records(
        db,
        TravelPackage,
        payload.packages,
        lambda item: _package_values(item, destinations_by_slug),
        match_by_slug=True,
    )
    _sync_records(db, Service, payload.services, _service_values, match_by_slug=True)
    _sync_records(db, GalleryImage, payload.gallery, _gallery_values)
    _sync_records(db, Testimonial, payload.testimonials, _testimonial_values)

    db.commit()
    db.refresh(content)
    saved = get_content(db)
    if saved is None:
        raise RuntimeError("Saved site content could not be reloaded")
    return saved
