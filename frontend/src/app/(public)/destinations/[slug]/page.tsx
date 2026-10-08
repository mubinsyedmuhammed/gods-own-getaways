import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getSiteContent } from "@/lib/site-content";

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, content] = await Promise.all([params, getSiteContent()]);
  const destination = content.destinations.find((item) => item.slug === slug && item.active);
  if (!destination) notFound();

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/destinations" className="text-sm text-emerald-300">← All destinations</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{destination.tag}</p>
          <h1 className="mt-3 text-5xl font-semibold text-white">{destination.name}</h1>
          <p className="mt-3 text-amber-200">{destination.region}</p>
          <p className="mt-6 text-lg leading-8 text-slate-300">{destination.description}</p>
          {destination.highlights.length > 0 && <ul className="mt-8 space-y-3 text-slate-200">{destination.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
          <Link href="/contact" className="mt-8 inline-flex rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950">Plan a visit</Link>
        </div>
        {destination.imageUrl && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900"><Image src={destination.imageUrl} alt={destination.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>}
      </div>
    </main>
  );
}