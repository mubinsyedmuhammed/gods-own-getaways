import Image from "next/image";
import Link from "next/link";

import type { SiteContent } from "@/lib/site-data";

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
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
      <Link href="/" className="text-lg font-black uppercase tracking-[0.18em] text-white">
        {content.settings.logo ? (
          <Image src={content.settings.logo} alt={content.name} width={160} height={48} unoptimized className="h-10 w-auto object-contain" />
        ) : content.name}
      </Link>
      <nav aria-label="Main navigation" className="order-3 flex w-full gap-5 overflow-x-auto whitespace-nowrap text-sm text-slate-200 md:order-none md:w-auto md:flex-wrap">
        {navigation.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-emerald-300">{label}</Link>)}
      </nav>
      <Link href="/contact" className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
        {content.hero.primaryCta}
      </Link>
    </header>
  );
}

export function SiteFooter({ content }: { content: SiteContent }) {
  const contactDetails = [content.contact.email, content.contact.phone, content.contact.address].filter((detail) => detail.trim());

  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="text-lg font-black uppercase tracking-[0.18em] text-white">{content.name}</div>
          <p className="mt-3 text-slate-300">{content.settings.footerText || content.tagline}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Contact</h2>
          <ul className="mt-4 space-y-2 text-slate-300">
            {contactDetails.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        </div>
        <nav aria-label="Footer navigation">
          <h2 className="text-lg font-semibold text-white">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-slate-300">
            {navigation.slice(1).map(([label, href]) => <li key={href}><Link href={href} className="hover:text-emerald-300">{label}</Link></li>)}
            <li><Link href="/admin" className="hover:text-emerald-300">Admin</Link></li>
          </ul>
        </nav>
        <div className="flex gap-4 text-sm text-emerald-300 lg:col-span-3">
          {content.settings.instagramUrl && <a href={content.settings.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>}
          {content.settings.facebookUrl && <a href={content.settings.facebookUrl} target="_blank" rel="noreferrer">Facebook</a>}
          {content.settings.youtubeUrl && <a href={content.settings.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a>}
        </div>
      </div>
    </footer>
  );
}