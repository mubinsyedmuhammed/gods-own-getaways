import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { packageEnquiryMessage, telephoneUrl, whatsappUrl, shouldOptimizeImage } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/api";

type PackagePageProps = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  const content = await getSiteContent();
  return content.packages
    .filter((travelPackage) => travelPackage.active && travelPackage.slug)
    .map((travelPackage) => ({ slug: travelPackage.slug }));
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const [{ slug }, content] = await Promise.all([params, getSiteContent()]);
  const travelPackage = content.packages.find((item) => item.slug === slug && item.active);
  if (!travelPackage) {
    return { title: "Package not found", robots: { index: false, follow: false } };
  }

  return pageMetadata(content, {
    title: travelPackage.title,
    description:
      travelPackage.shortDescription ||
      travelPackage.description ||
      travelPackage.summary ||
      `${travelPackage.title} travel package${travelPackage.duration ? ` - ${travelPackage.duration}` : ""}.`,
    path: `/packages/${encodeURIComponent(slug)}`,
    image: travelPackage.imageUrl || undefined,
    imageAlt: travelPackage.imageAlt || travelPackage.title,
  });
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const [{ slug }, content] = await Promise.all([params, getSiteContent()]);
  const travelPackage = content.packages.find((item) => item.slug === slug && item.active);
  if (!travelPackage) notFound();

  const destination = content.destinations.find(
    (item) => item.slug === travelPackage.destinationSlug && item.active,
  );
  const enquiryUrl = whatsappUrl(
    content.contact.whatsappNumber,
    packageEnquiryMessage(travelPackage.title, content.name),
  );
  const callUrl = telephoneUrl(content.contact.phone);
  const overview =
    travelPackage.description || travelPackage.shortDescription || travelPackage.summary;

  return (
    <main className="pb-24 sm:pb-20">
      <section className="relative isolate flex min-h-[32rem] items-end overflow-hidden bg-slate-900 sm:min-h-[38rem] lg:min-h-[42rem]">
        {travelPackage.imageUrl && (
          <Image
            src={travelPackage.imageUrl}
            alt={travelPackage.imageAlt || travelPackage.title}
            fill
            priority
            unoptimized={!shouldOptimizeImage(travelPackage.imageUrl)}
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/10"
        />
        {!travelPackage.imageUrl && (
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slate-900" />
        )}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-y-1 break-words text-sm text-white/75 sm:mb-8">
            <Link href="/packages" className="transition hover:text-white">
              Packages
            </Link>
            <span aria-hidden="true" className="mx-2 text-white/45">/</span>
            <span aria-current="page" className="text-white">{travelPackage.title}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              {destination && <span>{destination.name}</span>}
              {destination && travelPackage.duration && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-amber-200/70" />}
              {travelPackage.duration && <span>{travelPackage.duration}</span>}
            </div>
            <h1 className="mt-5 break-words text-4xl font-semibold leading-tight tracking-tight text-white [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
              {travelPackage.title}
            </h1>
            {travelPackage.shortDescription && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                {travelPackage.shortDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16 lg:py-20">
          <div>
            {overview && (
              <section aria-labelledby="overview-heading">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  The experience
                </p>
                <h2 id="overview-heading" className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  A journey made for you
                </h2>
                <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-300">
                  {overview}
                </p>
              </section>
            )}

            {travelPackage.highlights.length > 0 && (
              <section className="mt-12 border-t border-white/10 pt-8" aria-labelledby="highlights-heading">
                <h2 id="highlights-heading" className="text-xl font-semibold text-white">Highlights</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {travelPackage.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-sm leading-6 text-slate-300">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {travelPackage.itinerary.length > 0 && (
              <section className="mt-12 border-t border-white/10 pt-8" aria-labelledby="itinerary-heading">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Your journey</p>
                <h2 id="itinerary-heading" className="mt-3 text-2xl font-semibold text-white">The itinerary</h2>
                <ol className="mt-6">
                  {travelPackage.itinerary.map((day, index) => (
                    <li key={`${index}-${day}`} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-t border-white/10 py-5 last:border-b">
                      <span className="pt-0.5 text-xs font-semibold uppercase tracking-[0.15em] text-amber-200">
                        Day {index + 1}
                      </span>
                      <p className="text-sm leading-7 text-slate-300">{day}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {(travelPackage.includedItems.length > 0 || travelPackage.excludedItems.length > 0) && (
              <section className="mt-12 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
                {travelPackage.includedItems.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-white">Included</h2>
                    <ul className="mt-4 space-y-3">
                      {travelPackage.includedItems.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                          <span aria-hidden="true" className="text-emerald-300">+</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {travelPackage.excludedItems.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-white">Not included</h2>
                    <ul className="mt-4 space-y-3">
                      {travelPackage.excludedItems.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                          <span aria-hidden="true" className="text-slate-500">−</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10 sm:p-7 lg:sticky lg:top-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Start planning
            </p>
            {travelPackage.price && (
              <p className="mt-4 text-sm text-slate-400">
                From <strong className="ml-1 text-3xl font-semibold tracking-tight text-white">{travelPackage.price}</strong>
              </p>
            )}
            {travelPackage.duration && (
              <p className="mt-5 border-t border-white/10 pt-4 text-sm text-slate-300">
                <span className="text-slate-500">Duration</span>
                <span className="float-right font-medium text-white">{travelPackage.duration}</span>
              </p>
            )}
            {destination && (
              <p className="mt-3 text-sm text-slate-300">
                <span className="text-slate-500">Destination</span>
                <Link href={`/destinations/${destination.slug}`} className="float-right font-medium text-white transition hover:text-emerald-300">
                  {destination.name}
                </Link>
              </p>
            )}
            <div className="mt-6 grid gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
              >
                Enquire about this trip
              </Link>
              {enquiryUrl && (
                <a
                  href={enquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/60 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                >
                  Enquire on WhatsApp
                </a>
              )}
              {callUrl && (
                <a
                  href={callUrl}
                  className="inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-slate-300 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Call Us
                </a>
              )}
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-slate-500">
              Have a question? We&apos;re here to help you plan.
            </p>
          </aside>
        </div>

        {travelPackage.galleryImages.length > 0 && (
          <section className="border-t border-white/10 py-12 sm:py-16" aria-labelledby="gallery-heading">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">A glimpse of the trip</p>
                <h2 id="gallery-heading" className="mt-2 text-2xl font-semibold text-white">Moments along the way</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {travelPackage.galleryImages.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className={`relative overflow-hidden rounded-xl bg-slate-900 ${index === 0 ? "aspect-[4/3] sm:row-span-2 sm:aspect-auto sm:min-h-80" : "aspect-[4/3]"}`}
                >
                  <Image
                    src={imageUrl}
                    alt={`${travelPackage.title} gallery image ${index + 1}`}
                    fill
                    unoptimized={!shouldOptimizeImage(imageUrl)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
