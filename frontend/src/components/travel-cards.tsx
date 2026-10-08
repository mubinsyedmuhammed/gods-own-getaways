import Image from "next/image";
import Link from "next/link";

import type { SiteContent } from "@/lib/site-data";

type Destination = SiteContent["destinations"][number];
type TravelPackage = SiteContent["packages"][number];

function CoverImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
      {src ? <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div aria-hidden="true" className="h-full w-full bg-[linear-gradient(135deg,#1d3a36,#0f172a)]" />}
    </div>
  );
}

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-slate-900/70">
      <Link href={`/destinations/${destination.slug}`} aria-label={`Explore ${destination.name}`}>
        <CoverImage src={destination.imageUrl} alt={destination.imageAlt} />
      </Link>
      <div className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">{destination.tag}</p>
        <h2 className="text-2xl font-semibold text-white"><Link href={`/destinations/${destination.slug}`}>{destination.name}</Link></h2>
        <p className="text-sm text-amber-200">{destination.region}</p>
        <p className="text-sm leading-7 text-slate-300">{destination.description}</p>
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          {destination.price && <span className="text-sm text-slate-300">From {destination.price}</span>}
          <Link href={`/destinations/${destination.slug}`} className="ml-auto text-sm font-semibold text-emerald-300">Discover destination</Link>
        </div>
      </div>
    </article>
  );
}

export function PackageCard({ travelPackage }: { travelPackage: TravelPackage }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-slate-900/70">
      <Link href={`/packages/${travelPackage.slug}`} aria-label={`View ${travelPackage.title}`}>
        <CoverImage src={travelPackage.imageUrl} alt={travelPackage.imageAlt} />
      </Link>
      <div className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">{travelPackage.duration}</p>
        <h2 className="text-2xl font-semibold text-white"><Link href={`/packages/${travelPackage.slug}`}>{travelPackage.title}</Link></h2>
        <p className="text-sm leading-7 text-slate-300">{travelPackage.summary || travelPackage.shortDescription}</p>
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          {travelPackage.price && <span className="text-sm text-slate-300">From {travelPackage.price}</span>}
          <Link href={`/packages/${travelPackage.slug}`} className="ml-auto text-sm font-semibold text-emerald-300">View package</Link>
        </div>
      </div>
    </article>
  );
}