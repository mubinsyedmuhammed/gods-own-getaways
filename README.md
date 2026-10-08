# God's Own Getaways

## Content management

The FastAPI backend is organized into `app/core` (configuration, database, and security), `app/models` (one module per persisted entity), `app/schemas` (content request/response contracts), `app/api` (content, image, and health routers), and `app/services` (image storage providers). Alembic metadata is registered through `app.models`. The admin editor is available at `/admin` and saves site content through `/api/content`. Packages, destinations, services, gallery images, and testimonials are stored as separate database records; package-to-destination links use a nullable destination foreign key. The existing content document continues to hold site-wide copy and settings.

Configure `DATABASE_URL` for the backend, `NEXT_PUBLIC_API_URL` for the frontend API, and `NEXT_PUBLIC_SITE_URL` as the canonical public website origin (for example, `https://example.com`). The site URL is used for canonical metadata, the sitemap, and the robots sitemap reference. Vercel deployments can use `VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL` when `NEXT_PUBLIC_SITE_URL` is not set. Apply database changes from the `backend` directory with:

```sh
alembic upgrade head
```

Public content is cached and regenerated at most every five minutes; package and destination pages are pre-rendered from active records and new slugs can be generated on demand. Set `NEXT_IMAGE_HOSTS` at build time to a comma-separated list of exact HTTPS image hostnames used by the CMS to enable Next.js optimization for those sources. Local images and `images.unsplash.com` are optimized by default; other remote hosts remain directly loaded until allowlisted.

Images are stored as URL and metadata fields in the database; binary image data is never written to PostgreSQL. The image storage service is selected with `IMAGE_STORAGE_BACKEND`: `local` stores development uploads under `backend/uploads` and serves them from `/media`, while `s3` uses the same storage interface with an S3-compatible bucket and a public CDN/base URL. Local storage is rejected when `APP_ENV=production`. Configure `IMAGE_UPLOAD_TOKEN` with a unique secret and enter it in the admin's image upload section; upload requests require it and are limited to 10 MB for JPEG, PNG, WebP, GIF, and AVIF files. Configure `IMAGE_ALLOWED_HOSTS` for approved existing HTTPS image hosts. For remote S3/CDN images, allowlist the same exact hostnames in the frontend's build-time `NEXT_IMAGE_HOSTS`. See `backend/.env.example` for the configuration fields.

The admin supports adding, editing, deleting, activating, featuring, and reordering content. WhatsApp and phone links use the values saved in the contact settings; WhatsApp enquiries open a prefilled `wa.me` message and do not require the Business API.
