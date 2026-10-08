import Image from "next/image";
import Link from "next/link";

import { shouldOptimizeImage } from "@/lib/utils";
import type { SiteContent } from "@/lib/types";

type Destination = SiteContent["destinations"][number];

function CoverImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
      {src ? <Image src={src} alt={alt} fill unoptimized={!shouldOptimizeImage(src)} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div aria-hidden="true" className="h-full w-full bg-[linear-gradient(135deg,#1d3a36,#0f172a)]" />}
    </div>
  );
}

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl">
      <Link href={`/destinations/${destination.slug}`} aria-label={`Explore ${destination.name}`}>
        <CoverImage src={destination.imageUrl} alt={destination.imageAlt || destination.name} />
      </Link>
      <div className="space-y-3 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">{destination.tag}</p>
        <h2 className="text-2xl font-semibold text-white"><Link href={`/destinations/${destination.slug}`}>{destination.name}</Link></h2>
        <p className="text-sm text-amber-200">{destination.region}</p>
        <p className="text-sm leading-7 text-slate-300">{destination.shortDescription || destination.description}</p>
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          {destination.price && <span className="text-sm text-slate-300">From {destination.price}</span>}
          <Link href={`/destinations/${destination.slug}`} className="ml-auto text-sm font-semibold text-emerald-300">Discover destination</Link>
        </div>
      </div>
    </article>
  );
}