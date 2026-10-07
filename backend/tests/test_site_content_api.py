import unittest
from unittest.mock import Mock

from pydantic import ValidationError

from app.api.routes import get_content, upsert_content
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
    "destinations": [],
    "journeys": [],
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

    def test_content_round_trips_through_upsert_and_read(self):
        db = Mock()
        db.query.return_value.first.return_value = None
        payload = SiteContentPayload.model_validate(VALID_CONTENT)

        saved = upsert_content(payload, db)
        stored_row = db.add.call_args.args[0]
        db.query.return_value.first.return_value = stored_row
        loaded = get_content(db)

        self.assertEqual(saved, payload)
        self.assertEqual(loaded, payload)
        self.assertEqual(stored_row.content, VALID_CONTENT)


if __name__ == "__main__":
    unittest.main()