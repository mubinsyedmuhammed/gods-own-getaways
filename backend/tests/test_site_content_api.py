import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from pydantic import ValidationError

from app.api.content import get_content, upsert_content
from app.core.database import Base
from app.models import Destination, GalleryImage, Service, SiteContent, TravelPackage
from app.schemas import ContactContent, GalleryImageContent, SiteContentPayload


VALID_CONTENT = {
    "name": "Example Getaways",
    "tagline": "Journeys made personal",
    "description": "A sample description",
    "hero": {
        "eyebrow": "Explore",
        "title": "Travel well",
        "subtitle": "A sample subtitle",
        "primaryCta": "Plan a trip",
        "secondaryCta": "See journeys",
    },
    "stats": [],
    "destinations": [
        {
            "slug": "sample-place",
            "name": "Sample Place",
            "region": "Sample region",
            "tag": "Sample tag",
            "description": "Sample description",
            "price": "",
            "imageUrl": "",
            "imageAlt": "",
            "highlights": [],
        }
    ],
    "packages": [
        {
            "slug": "sample-package",
            "title": "Sample Package",
            "duration": "",
            "summary": "Sample summary",
            "description": "Sample description",
            "price": "",
            "active": True,
            "imageUrl": "",
            "imageAlt": "",
            "highlights": [],
        }
    ],
    "services": [],
    "gallery": [
        {
            "imageUrl": "https://images.unsplash.com/photo-example",
            "alt": "A sample landscape",
            "caption": "A sample caption",
        }
    ],
    "about": {
        "eyebrow": "About",
        "title": "Travel with care",
        "body": "A sample about section",
        "imageUrl": "https://images.unsplash.com/photo-example",
        "imageAlt": "A sample landscape",
    },
    "benefits": [],
    "testimonials": [],
    "cta": {"title": "Start planning", "buttonText": "Contact us"},
    "contact": {"email": "", "phone": "", "address": "", "whatsappNumber": ""},
}


class SiteContentApiTests(unittest.TestCase):
    def test_content_payload_requires_expected_fields(self):
        with self.assertRaises(ValidationError):
            SiteContentPayload.model_validate({"name": "Incomplete"})

    def test_gallery_rejects_unapproved_image_hosts(self):
        with self.assertRaises(ValidationError):
            GalleryImageContent(
                imageUrl="https://example.com/travel.jpg",
                alt="A landscape",
                caption="A landscape",
            )

    def test_gallery_accepts_urls_from_local_image_storage(self):
        image = GalleryImageContent(imageUrl="/media/example-image.webp")
        self.assertEqual(image.imageUrl, "/media/example-image.webp")

    def test_whatsapp_number_is_normalized_and_validated(self):
        contact = ContactContent(
            email="",
            phone="",
            address="",
            whatsappNumber="+44 7700 900123",
        )
        self.assertEqual(contact.whatsappNumber, "447700900123")

        with self.assertRaises(ValidationError):
            ContactContent(email="", phone="", address="", whatsappNumber="123")

    def test_content_items_include_admin_fields_and_defaults(self):
        content = dict(VALID_CONTENT)
        content["packages"] = [
            {
                **VALID_CONTENT["packages"][0],
                "shortDescription": "A quiet weekend",
                "currency": "INR",
                "itinerary": ["Arrival", "Departure"],
                "includedItems": ["Breakfast"],
                "excludedItems": ["Flights"],
                "featured": True,
            }
        ]
        content["services"] = [{"title": "Flight Booking", "description": "Arrange flights"}]
        content["gallery"] = [
            {
                **VALID_CONTENT["gallery"][0],
                "category": "Backwaters",
                "sortOrder": 3,
                "active": False,
            }
        ]
        payload = SiteContentPayload.model_validate(content)

        self.assertEqual(payload.packages[0].currency, "INR")
        self.assertEqual(payload.packages[0].includedItems, ["Breakfast"])
        self.assertEqual(payload.services[0].slug, "flight-booking")
        self.assertEqual(payload.gallery[0].sortOrder, 3)
        self.assertFalse(payload.gallery[0].active)
        self.assertEqual(payload.settings.footerText, "")

    def test_testimonial_rating_must_be_between_one_and_five(self):
        content = dict(VALID_CONTENT)
        content["testimonials"] = [{"customerName": "A Guest", "content": "Wonderful", "rating": 6}]

        with self.assertRaises(ValidationError):
            SiteContentPayload.model_validate(content)

    def test_package_destination_is_stored_as_a_foreign_key(self):
        engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(engine)
        db = sessionmaker(bind=engine)()
        try:
            data = dict(VALID_CONTENT)
            data["destinations"] = [
                {**VALID_CONTENT["destinations"][0], "slug": "munnar", "name": "Munnar"}
            ]
            data["packages"] = [
                {**VALID_CONTENT["packages"][0], "destinationSlug": "munnar"}
            ]

            saved = upsert_content(SiteContentPayload.model_validate(data), db)
            destination = db.query(Destination).one()
            package = db.query(TravelPackage).one()

            self.assertEqual(package.destination_id, destination.id)
            self.assertEqual(saved.packages[0].destinationSlug, "munnar")
            self.assertEqual(saved.packages[0].destinationId, destination.id)
        finally:
            db.close()
            engine.dispose()

    def test_content_round_trips_through_upsert_and_read(self):
        engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(engine)
        db = sessionmaker(bind=engine)()
        try:
            payload = SiteContentPayload.model_validate(VALID_CONTENT)

            saved = upsert_content(payload, db)
            loaded = get_content(db)
            stored_row = db.query(SiteContent).first()

            self.assertEqual(saved.name, payload.name)
            self.assertEqual(loaded.name, payload.name)
            self.assertEqual(loaded.packages[0].title, "Sample Package")
            self.assertEqual(loaded.services, [])
            self.assertEqual(loaded.gallery[0].alt, "A sample landscape")
            self.assertEqual(db.query(Destination).count(), 1)
            self.assertEqual(db.query(TravelPackage).count(), 1)
            self.assertEqual(db.query(GalleryImage).count(), 1)
            self.assertNotIn("destinations", stored_row.content)
            self.assertNotIn("packages", stored_row.content)
        finally:
            db.close()
            engine.dispose()

    def test_admin_update_preserves_record_ids_and_deletes_removed_items(self):
        engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(engine)
        db = sessionmaker(bind=engine)()
        try:
            data = dict(VALID_CONTENT)
            data["services"] = [{"title": "Flight Booking", "description": "Plan flights"}]
            first = upsert_content(SiteContentPayload.model_validate(data), db)
            service_id = first.services[0].id

            updated_data = SiteContentPayload.model_validate(data).model_dump(mode="json")
            updated_data["services"][0]["description"] = "Book flights"
            second = upsert_content(SiteContentPayload.model_validate(updated_data), db)
            self.assertEqual(second.services[0].id, service_id)
            self.assertEqual(second.services[0].description, "Book flights")

            updated_data["services"] = []
            third = upsert_content(SiteContentPayload.model_validate(updated_data), db)
            self.assertEqual(third.services, [])
            self.assertEqual(db.query(Service).count(), 0)
        finally:
            db.close()
            engine.dispose()


if __name__ == "__main__":
    unittest.main()