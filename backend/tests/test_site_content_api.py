import unittest
from unittest.mock import Mock

from pydantic import ValidationError

from app.api.routes import get_content, upsert_content
from app.schemas import SiteContentPayload


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
    "benefits": [],
    "testimonials": [],
    "cta": {"title": "Start planning", "buttonText": "Contact us"},
    "contact": {"email": "", "phone": "", "address": ""},
}


class SiteContentApiTests(unittest.TestCase):
    def test_content_payload_requires_expected_fields(self):
        with self.assertRaises(ValidationError):
            SiteContentPayload.model_validate({"name": "Incomplete"})

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