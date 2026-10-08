import Link from "next/link";
import Image from "next/image";

import { getSiteContent } from "@/lib/site-content";

export default async function HomePage() {
  const content = await getSiteContent();
  const whatsappDigits = content.contact.whatsappNumber.replace(/\D/g, "");
  const contactDetails = [content.contact.email, content.contact.phone, content.contact.address].filter((detail) => detail.trim());
  const destinations = content.destinations
    .filter((destination) => destination.active && destination.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const packages = content.packages
    .filter((travelPackage) => travelPackage.active && travelPackage.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const services = content.services.filter((service) => service.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const gallery = content.gallery.filter((image) => image.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const testimonials = content.testimonials
    .filter((testimonial) => testimonial.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main id="home" className="overflow-hidden">
      <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black uppercase tracking-[0.18em] text-white">
          {content.settings.logo ? (
            <Image src={content.settings.logo} alt={content.name} width={160} height={48} unoptimized className="h-10 w-auto object-contain" />
          ) : content.name.split(" ").slice(0, 2).join(" ")}
        </Link>
        <nav aria-label="Main navigation" className="order-3 flex w-full gap-5 overflow-x-auto whitespace-nowrap text-sm text-slate-200 md:order-none md:w-auto md:flex-wrap">
          <Link href="#home">Home</Link>
          <Link href="#destinations">Destinations</Link>
          <Link href="#packages">Packages</Link>
          <Link href="#services">Services</Link>
          <Link href="#gallery">Gallery</Link>
          <Link href="#about">About</Link>
          <Link href="#contact">Contact</Link>
          <Link href="#why-us">Why us</Link>
          <Link href="#testimonials">Testimonials</Link>
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
              href="#packages"
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

      {content.stats.length > 0 && <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {content.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-center">
            <strong className="block text-3xl font-semibold text-white">{stat.value}</strong>
            <span className="mt-2 block text-sm text-slate-300">{stat.label}</span>
          </div>
        ))}
      </section>}

      <section id="destinations" className="mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Curated destinations</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Places that linger in memory
          </h2>
          </div>
          <Link href="/destinations" className="text-sm font-semibold text-emerald-300">Browse all destinations</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {destinations.length === 0 ? <p className="text-slate-300">Destinations will appear here soon.</p> : destinations.map((destination) => (
            <article key={destination.name} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/70">
              <div className="h-52 bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.3),transparent_30%),linear-gradient(135deg,#1d3a36,#0f172a)]" />
              <div className="space-y-4 p-5">
                <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-300">{destination.tag}</span>
                <div>
                  <h3 className="text-2xl font-semibold text-white"><Link href={`/destinations/${destination.slug}`}>{destination.name}</Link></h3>
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

      <section id="packages" className="mt-4 border-y border-white/10 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Featured packages</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              Travel shaped around your pace
            </h2>
            </div>
            <Link href="/packages" className="text-sm font-semibold text-emerald-300">Browse all packages</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {packages.length === 0 ? <p className="text-slate-300">Packages will appear here soon.</p> : packages.map((journey) => (
              <article key={journey.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
                <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-200">
                  {journey.duration}
                </span>
                <h3 className="mt-5 text-2xl font-semibold text-white">{journey.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{journey.summary || journey.shortDescription}</p>
                <Link href={`/packages/${journey.slug}`} className="mt-5 inline-flex text-sm font-semibold text-emerald-300">View package</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">How we help</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">Services for a smoother journey</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.length === 0 ? <p className="text-slate-300">Services will appear here soon.</p> : services.map((service) => (
            <article key={service.title} className="border-t border-emerald-400/50 bg-slate-900/50 p-5">
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{service.description}</p>
            </article>
          ))}
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
          {content.benefits.length === 0 ? <li className="text-slate-300">Travel details will appear here soon.</li> : content.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-slate-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-lg text-emerald-300">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Field notes</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">A glimpse of the way there</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.length === 0 ? <p className="text-slate-300">Gallery photographs will appear here soon.</p> : gallery.map((image, index) => (
            <figure key={`${image.imageUrl}-${index}`} className="group relative overflow-hidden rounded-xl bg-slate-900">
              <div className="relative aspect-[4/5]">
                <Image
                  src={image.imageUrl}
                  alt={image.altText || image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 text-sm text-white">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{content.about.eyebrow}</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">{content.about.title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{content.about.body}</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900">
          <Image
            src={content.about.imageUrl}
            alt={content.about.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Guest stories</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Every journey feels personal
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.length === 0 ? <p className="text-slate-300">Guest stories will appear here soon.</p> : testimonials.map((testimonial, index) => (
            <article key={`${testimonial.customerName}-${index}`} className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">
              <p className="text-lg leading-8 text-slate-200">“{testimonial.content || testimonial.quote}”</p>
              <div className="mt-5 flex flex-col gap-1 text-sm text-slate-300">
                <strong className="text-white">{testimonial.customerName || testimonial.name}</strong>
                {testimonial.customerLocation && <span>{testimonial.customerLocation}</span>}
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
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            {content.cta.buttonText}
          </Link>
        </div>
      </section>

      <section id="contact" className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Start a conversation</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">Let’s plan your next trip.</h2>
            <div className="mt-5 flex flex-col gap-2 text-slate-300">
              {content.contact.email && <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>}
              {content.contact.phone && <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a>}
              {content.contact.address && <span>{content.contact.address}</span>}
            </div>
          </div>
          {whatsappDigits && (
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Chat on WhatsApp
            </a>
          )}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <div className="text-lg font-black uppercase tracking-[0.18em] text-white">{content.name}</div>
            <p className="mt-3 text-slate-300">{content.settings.footerText || content.tagline}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              {contactDetails.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick links</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li><Link href="#destinations">Destinations</Link></li>
              <li><Link href="#packages">Packages</Link></li>
              <li><Link href="#services">Services</Link></li>
              <li><Link href="#gallery">Gallery</Link></li>
              <li><Link href="#about">About</Link></li>
              <li><Link href="#contact">Contact</Link></li>
              <li><Link href="/admin">Admin</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
