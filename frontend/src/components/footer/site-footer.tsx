import Link from "next/link";

import { telephoneUrl } from "@/lib/utils";
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

function SocialLinks({ content }: { content: SiteContent }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-emerald-300">
      {content.settings.instagramUrl && <a href={content.settings.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>}
      {content.settings.facebookUrl && <a href={content.settings.facebookUrl} target="_blank" rel="noreferrer">Facebook</a>}
      {content.settings.youtubeUrl && <a href={content.settings.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a>}
    </div>
  );
}

export function SiteFooter({ content }: { content: SiteContent }) {
  const callHref = telephoneUrl(content.contact.phone);

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
            {content.contact.email && <li><a href={`mailto:${content.contact.email}`}>{content.contact.email}</a></li>}
            {callHref && <li><a href={callHref}>Call us: {content.contact.phone}</a></li>}
            {content.contact.address && <li>{content.contact.address}</li>}
          </ul>
        </div>
        <nav aria-label="Footer navigation">
          <h2 className="text-lg font-semibold text-white">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-slate-300">
            {navigation.slice(1).map(([label, href]) => <li key={href}><Link href={href} className="hover:text-emerald-300">{label}</Link></li>)}
            <li><Link href="/admin" className="hover:text-emerald-300">Admin</Link></li>
          </ul>
        </nav>
        <div className="lg:col-span-3"><SocialLinks content={content} /></div>
      </div>
    </footer>
  );
}

export function HomeFooter({ content }: { content: SiteContent }) {
  const callHref = telephoneUrl(content.contact.phone);

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
            {content.contact.email && <li><a href={`mailto:${content.contact.email}`}>{content.contact.email}</a></li>}
            {callHref && <li><a href={callHref}>Call us: {content.contact.phone}</a></li>}
            {content.contact.address && <li>{content.contact.address}</li>}
          </ul>
        </div>
        <nav aria-label="Quick links">
          <h2 className="text-lg font-semibold text-white">Quick links</h2>
          <ul className="mt-4 space-y-2 text-slate-300">
            {navigation.slice(1).map(([label, href]) => <li key={href}><Link href={`#${href.slice(1)}`}>{label}</Link></li>)}
            <li><Link href="/admin">Admin</Link></li>
          </ul>
        </nav>
        <div className="lg:col-span-3"><SocialLinks content={content} /></div>
      </div>
    </footer>
  );
}
