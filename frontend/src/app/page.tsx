import Link from "next/link";

import { defaultContent, type SiteContent } from "@/lib/site-data";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function getSiteContent(): Promise<SiteContent> {
  if (!apiUrl) {
    return defaultContent;
  }

  try {
    const response = await fetch(`${apiUrl}/api/content`, { cache: "no-store" });
    if (!response.ok) {
      return defaultContent;
    }

    const content = (await response.json()) as SiteContent | null;
    return content ?? defaultContent;
  } catch {
    return defaultContent;
  }
}

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <main className="overflow-hidden">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black uppercase tracking-[0.18em] text-white">
          {content.name.split(" ").slice(0, 2).join(" ")}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
          <Link href="#destinations">Destinations</Link>
          <Link href="#journeys">Journeys</Link>
          <Link href="#why-us">Why us</Link>
          <Link href="#reviews">Reviews</Link>
        </nav>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Admin login
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.4fr_0.8fr] lg:px-8 lg:pb-20 lg:pt-12">
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">{content.hero.eyebrow}</p>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{content.hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#destinations"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              {content.hero.primaryCta}
            </Link>
            <Link
              href="#journeys"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
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

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {content.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-center">
            <strong className="block text-3xl font-semibold text-white">{stat.value}</strong>
            <span className="mt-2 block text-sm text-slate-300">{stat.label}</span>
          </div>
        ))}
      </section>

      <section id="destinations" className="mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Curated destinations</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Places that linger in memory
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {content.destinations.map((destination) => (
            <article key={destination.name} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/70">
              <div className="h-52 bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.3),transparent_30%),linear-gradient(135deg,#1d3a36,#0f172a)]" />
              <div className="space-y-4 p-5">
                <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-300">{destination.tag}</span>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{destination.name}</h3>
                  <p className="mt-1 text-sm text-amber-200">{destination.region}</p>
                </div>
                <p className="text-sm leading-7 text-slate-300">{destination.description}</p>
                {destination.price && <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Starting at</span>
                  <strong className="text-xl font-semibold text-white">{destination.price}</strong>
                </div>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="journeys" className="mt-4 border-y border-white/10 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Signature journeys</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              Travel shaped around your pace
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.journeys.map((journey) => (
              <article key={journey.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
                <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-200">
                  {journey.duration}
                </span>
                <h3 className="mt-5 text-2xl font-semibold text-white">{journey.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{journey.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Why travellers choose us</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Premium planning, heartfelt hospitality.
          </h2>
        </div>
        <ul className="space-y-4">
          {content.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-slate-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-lg text-emerald-300">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="reviews" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Guest stories</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Every journey feels personal
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {content.testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
              <p className="text-lg leading-8 text-slate-200">“{testimonial.quote}”</p>
              <div className="mt-5 flex flex-col gap-1 text-sm text-slate-300">
                <strong className="text-white">{testimonial.name}</strong>
                <span>{testimonial.trip}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Plan your next chapter</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              {content.cta.title}
            </h2>
          </div>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            {content.cta.buttonText}
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <div className="text-lg font-black uppercase tracking-[0.18em] text-white">{content.name}</div>
            <p className="mt-3 text-slate-300">{content.tagline}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>{content.contact.email}</li>
              <li>{content.contact.phone}</li>
              <li>{content.contact.address}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick links</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li><Link href="#destinations">Destinations</Link></li>
              <li><Link href="#journeys">Journeys</Link></li>
              <li><Link href="/admin">Admin</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
