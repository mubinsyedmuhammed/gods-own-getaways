import Link from "next/link";

import type { SiteContent } from "@/lib/types";

export function HeroSection({ content }: { content: SiteContent }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.4fr_0.8fr] lg:px-8 lg:pb-20 lg:pt-12">
      <div className="flex flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">{content.hero.eyebrow}</p>
        <h1 className="mt-6 max-w-xl break-words text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-white [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
          {content.hero.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{content.hero.subtitle}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="#destinations" className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
            {content.hero.primaryCta}
          </Link>
          <Link href="#packages" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            {content.hero.secondaryCta}
          </Link>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_30px_80px_rgba(4,10,14,0.45)] backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Thoughtful by design</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Your journey, your way</h2>
        <ul className="mt-6 space-y-3 text-slate-300">
          {content.benefits.slice(0, 3).map((benefit) => <li key={benefit}>{benefit}</li>)}
        </ul>
      </div>
    </section>
  );
}
