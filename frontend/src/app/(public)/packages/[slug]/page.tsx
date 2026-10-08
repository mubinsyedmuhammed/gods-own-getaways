import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSiteContent } from "@/lib/site-content";

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, content] = await Promise.all([params, getSiteContent()]);
  const travelPackage = content.packages.find((item) => item.slug === slug && item.active);
  if (!travelPackage) notFound();

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/packages" className="text-sm text-emerald-300">← All packages</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{travelPackage.duration}</p>
          <h1 className="mt-3 text-5xl font-semibold text-white">{travelPackage.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{travelPackage.description || travelPackage.shortDescription || travelPackage.summary}</p>
          {travelPackage.highlights.length > 0 && <ul className="mt-8 space-y-3 text-slate-200">{travelPackage.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
          {travelPackage.itinerary.length > 0 && <section className="mt-8"><h2 className="text-lg font-semibold text-white">Itinerary</h2><ol className="mt-3 list-inside list-decimal space-y-2 text-slate-300">{travelPackage.itinerary.map((day, index) => <li key={`${index}-${day}`}>{day}</li>)}</ol></section>}
          {travelPackage.includedItems.length > 0 && <section className="mt-6"><h2 className="text-lg font-semibold text-white">Included</h2><ul className="mt-3 list-inside list-disc space-y-2 text-slate-300">{travelPackage.includedItems.map((item) => <li key={item}>{item}</li>)}</ul></section>}
          {travelPackage.excludedItems.length > 0 && <section className="mt-6"><h2 className="text-lg font-semibold text-white">Not included</h2><ul className="mt-3 list-inside list-disc space-y-2 text-slate-300">{travelPackage.excludedItems.map((item) => <li key={item}>{item}</li>)}</ul></section>}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            {travelPackage.price && <strong className="text-2xl text-white">From {travelPackage.price}</strong>}
            <Link href="/contact" className="inline-flex rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950">Enquire about this package</Link>
          </div>
        </div>
        {travelPackage.imageUrl && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900"><Image src={travelPackage.imageUrl} alt={travelPackage.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>}
      </div>
      {travelPackage.galleryImages.length > 0 && <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{travelPackage.galleryImages.map((imageUrl, index) => <div key={`${imageUrl}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={imageUrl} alt={`${travelPackage.title} gallery image ${index + 1}`} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" /></div>)}</section>}
    </main>
  );
}