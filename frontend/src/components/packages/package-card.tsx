import Image from "next/image";
import Link from "next/link";

import { packageEnquiryMessage, whatsappUrl } from "@/lib/utils";
import { shouldOptimizeImage } from "@/lib/utils";
import type { SiteContent } from "@/lib/types";

type TravelPackage = SiteContent["packages"][number];

export function PackageCard({
  travelPackage,
  whatsappNumber,
  companyName,
}: {
  travelPackage: TravelPackage;
  whatsappNumber: string;
  companyName: string;
}) {
  const enquiryUrl = whatsappUrl(whatsappNumber, packageEnquiryMessage(travelPackage.title, companyName));

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl">
      <Link href={`/packages/${travelPackage.slug}`} aria-label={`View ${travelPackage.title}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
          {travelPackage.imageUrl ? (
            <Image
              src={travelPackage.imageUrl}
              alt={travelPackage.imageAlt || travelPackage.title}
              fill
              unoptimized={!shouldOptimizeImage(travelPackage.imageUrl)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div aria-hidden="true" className="h-full w-full bg-[linear-gradient(135deg,#1d3a36,#0f172a)]" />
          )}
        </div>
      </Link>
      <div className="space-y-3 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-emerald-300">{travelPackage.duration}</p>
        <h2 className="text-2xl font-semibold text-white"><Link href={`/packages/${travelPackage.slug}`}>{travelPackage.title}</Link></h2>
        <p className="text-sm leading-7 text-slate-300">{travelPackage.summary || travelPackage.shortDescription}</p>
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          {travelPackage.price && <span className="text-sm text-slate-300">From {travelPackage.price}</span>}
          <Link href={`/packages/${travelPackage.slug}`} className="ml-auto text-sm font-semibold text-emerald-300">View package</Link>
        </div>
        {enquiryUrl && (
          <a href={enquiryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">
            Enquire on WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
