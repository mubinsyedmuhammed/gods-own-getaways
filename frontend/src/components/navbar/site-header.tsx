import Image from "next/image";
import Link from "next/link";

import { shouldOptimizeImage } from "@/lib/utils";
import type { SiteContent } from "@/lib/types";

const navigation = [
  ["Home", "/"],
  ["Destinations", "/destinations"],
  ["Packages", "/packages"],
  ["Services", "/services"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader({ content }: { content: SiteContent }) {
  return (
    <header className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-4 py-4 sm:gap-x-5 sm:px-6 sm:py-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-8">
      <Link href="/" className="min-w-0 text-lg font-black uppercase tracking-[0.12em] text-white sm:tracking-[0.18em]">
        {content.settings.logo ? (
          <Image src={content.settings.logo} alt={content.name || "Company logo"} width={160} height={48} unoptimized={!shouldOptimizeImage(content.settings.logo)} className="h-10 w-auto object-contain" />
        ) : <span className="block truncate">{content.name}</span>}
      </Link>
      <nav aria-label="Main navigation" className="col-span-2 grid grid-cols-2 gap-x-3 text-sm text-slate-200 sm:flex sm:flex-wrap sm:gap-x-5 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:justify-center">
        {navigation.map(([label, href]) => <Link key={href} href={href} className="inline-flex min-h-10 items-center transition hover:text-emerald-300">{label}</Link>)}
      </nav>
      <Link href="/contact" className="inline-flex min-h-10 max-w-[45vw] items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-medium text-white transition hover:bg-white/10 sm:max-w-none sm:px-4 sm:text-sm lg:col-start-3 lg:row-start-1">
        {content.hero.primaryCta}
      </Link>
    </header>
  );
}

export function HomeHeader({ content }: { content: SiteContent }) {
  return (
    <header className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-4 py-4 sm:gap-x-5 sm:px-6 sm:py-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-8">
      <Link href="/" className="min-w-0 text-lg font-black uppercase tracking-[0.12em] text-white sm:tracking-[0.18em]">
        {content.settings.logo ? (
          <Image src={content.settings.logo} alt={content.name || "Company logo"} width={160} height={48} unoptimized={!shouldOptimizeImage(content.settings.logo)} className="h-10 w-auto object-contain" />
        ) : <span className="block truncate">{content.name.split(" ").slice(0, 2).join(" ")}</span>}
      </Link>
      <nav aria-label="Main navigation" className="col-span-2 grid grid-cols-2 gap-x-3 text-sm text-slate-200 sm:flex sm:flex-wrap sm:gap-x-5 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:justify-center">
        {[
          ["Home", "#home"],
          ["Destinations", "#destinations"],
          ["Packages", "#packages"],
          ["Services", "#services"],
          ["Gallery", "#gallery"],
          ["About", "#about"],
          ["Contact", "#contact"],
          ["Why us", "#why-us"],
          ["Testimonials", "#testimonials"],
        ].map(([label, href]) => (
          <Link key={href} className="inline-flex min-h-10 items-center" href={href}>{label}</Link>
        ))}
      </nav>
      <Link
        href="/admin"
        className="inline-flex min-h-10 max-w-[45vw] items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-medium text-white transition hover:bg-white/10 sm:max-w-none sm:px-4 sm:text-sm lg:col-start-3 lg:row-start-1"
      >
        Admin login
      </Link>
    </header>
  );
}