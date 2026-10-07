"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { defaultContent, type SiteContent } from "@/lib/site-data";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [status, setStatus] = useState("Loading saved content...");

  useEffect(() => {
    const load = async () => {
      if (!apiUrl) {
        setStatus("Set NEXT_PUBLIC_API_URL to connect to the content API.");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/content`);
        if (!response.ok) {
          throw new Error("Failed to load content");
        }
        const data = (await response.json()) as SiteContent | null;
        setContent(data ?? defaultContent);
        setStatus("Saved content loaded.");
      } catch {
        setContent(defaultContent);
        setStatus("Could not load saved content. Showing defaults.");
      }
    };

    load();
  }, []);

  const updateText = (path: string, value: string) => {
    setContent((previous) => {
      const next = structuredClone(previous);
      const target = path.split(".");
      let ref: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < target.length - 1; i += 1) {
        ref = ref[target[i]] as Record<string, unknown>;
      }
      ref[target[target.length - 1]] = value;
      return next;
    });
  };

  const addJourney = () => {
    setContent((previous) => ({
      ...previous,
      journeys: [...previous.journeys, { title: "", duration: "", summary: "" }],
    }));
  };

  const addService = () => {
    setContent((previous) => ({
      ...previous,
      services: [...previous.services, { title: "", description: "" }],
    }));
  };

  const updateService = (index: number, field: keyof SiteContent["services"][number], value: string) => {
    setContent((previous) => {
      const services = [...previous.services];
      services[index] = { ...services[index], [field]: value };
      return { ...previous, services };
    });
  };

  const addGalleryImage = () => {
    setContent((previous) => ({
      ...previous,
      gallery: [...previous.gallery, { imageUrl: "", alt: "", caption: "" }],
    }));
  };

  const updateGalleryImage = (index: number, field: keyof SiteContent["gallery"][number], value: string) => {
    setContent((previous) => {
      const gallery = [...previous.gallery];
      gallery[index] = { ...gallery[index], [field]: value };
      return { ...previous, gallery };
    });
  };

  const addBenefit = () => {
    setContent((previous) => ({ ...previous, benefits: [...previous.benefits, ""] }));
  };

  const updateBenefit = (index: number, value: string) => {
    setContent((previous) => {
      const benefits = [...previous.benefits];
      benefits[index] = value;
      return { ...previous, benefits };
    });
  };

  const addTestimonial = () => {
    setContent((previous) => ({
      ...previous,
      testimonials: [...previous.testimonials, { name: "", quote: "", trip: "" }],
    }));
  };

  const updateTestimonial = (index: number, field: keyof SiteContent["testimonials"][number], value: string) => {
    setContent((previous) => {
      const testimonials = [...previous.testimonials];
      testimonials[index] = { ...testimonials[index], [field]: value };
      return { ...previous, testimonials };
    });
  };

  const updateJourney = (index: number, field: keyof SiteContent["journeys"][number], value: string) => {
    setContent((previous) => {
      const journeys = [...previous.journeys];
      journeys[index] = { ...journeys[index], [field]: value };
      return { ...previous, journeys };
    });
  };

  const saveContent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!apiUrl) {
      setStatus("Set NEXT_PUBLIC_API_URL to connect to the content API.");
      return;
    }

    setStatus("Saving changes...");

    try {
      const response = await fetch(`${apiUrl}/api/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error("Unable to save");
      }

      const data = (await response.json()) as SiteContent;
      setContent(data);
      setStatus("Content saved successfully");
    } catch {
      setStatus("Save failed. Confirm the FastAPI backend is running.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Content management</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{content.name} admin</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            View website
          </Link>
        </header>

        <form onSubmit={saveContent} className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <h2 className="mb-5 text-xl font-semibold">Branding</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Brand name</span>
                <input
                  value={content.name}
                  onChange={(event) => setContent((previous) => ({ ...previous, name: event.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none ring-0 transition focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Tagline</span>
                <input
                  value={content.tagline}
                  onChange={(event) => setContent((previous) => ({ ...previous, tagline: event.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none ring-0 transition focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                <span>Description</span>
                <textarea
                  value={content.description}
                  onChange={(event) => setContent((previous) => ({ ...previous, description: event.target.value }))}
                  className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-emerald-400"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <h2 className="mb-5 text-xl font-semibold">Hero section</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                <span>Eyebrow</span>
                <input
                  value={content.hero.eyebrow}
                  onChange={(event) => updateText("hero.eyebrow", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                <span>Title</span>
                <input
                  value={content.hero.title}
                  onChange={(event) => updateText("hero.title", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                <span>Subtitle</span>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(event) => updateText("hero.subtitle", event.target.value)}
                  className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Primary CTA</span>
                <input
                  value={content.hero.primaryCta}
                  onChange={(event) => updateText("hero.primaryCta", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-emerald-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Secondary CTA</span>
                <input
                  value={content.hero.secondaryCta}
                  onChange={(event) => updateText("hero.secondaryCta", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-emerald-400"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Travel stats</h2>
              <button type="button" onClick={() => setContent((previous) => ({ ...previous, stats: [...previous.stats, { label: "", value: "" }] }))} className="text-sm text-emerald-300">Add stat</button>
            </div>
            <div className="space-y-3">
              {content.stats.length === 0 && <p className="text-sm text-slate-400">No stats added yet.</p>}
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="grid gap-3 md:grid-cols-2">
                  <input
                    aria-label={`Stat ${index + 1} label`}
                    value={stat.label}
                    onChange={(event) => {
                      const next = [...content.stats];
                      next[index] = { ...next[index], label: event.target.value };
                      setContent((previous) => ({ ...previous, stats: next }));
                    }}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-emerald-400"
                  />
                  <input
                    aria-label={`Stat ${index + 1} value`}
                    value={stat.value}
                    onChange={(event) => {
                      const next = [...content.stats];
                      next[index] = { ...next[index], value: event.target.value };
                      setContent((previous) => ({ ...previous, stats: next }));
                    }}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-emerald-400"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Featured destinations</h2>
              <button type="button" onClick={() => setContent((previous) => ({ ...previous, destinations: [...previous.destinations, { name: "", region: "", tag: "", description: "", price: "" }] }))} className="text-sm text-emerald-300">Add destination</button>
            </div>
            <div className="space-y-4">
              {content.destinations.length === 0 && <p className="text-sm text-slate-400">No destinations added yet.</p>}
              {content.destinations.map((destination, index) => (
                <div key={`${destination.name}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      aria-label={`Destination ${index + 1} name`}
                      value={destination.name}
                      onChange={(event) => {
                        const next = [...content.destinations];
                        next[index] = { ...next[index], name: event.target.value };
                        setContent((previous) => ({ ...previous, destinations: next }));
                      }}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none"
                    />
                    <input
                      aria-label={`Destination ${index + 1} region`}
                      value={destination.region}
                      onChange={(event) => {
                        const next = [...content.destinations];
                        next[index] = { ...next[index], region: event.target.value };
                        setContent((previous) => ({ ...previous, destinations: next }));
                      }}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none"
                    />
                    <input
                      aria-label={`Destination ${index + 1} tag`}
                      value={destination.tag}
                      onChange={(event) => {
                        const next = [...content.destinations];
                        next[index] = { ...next[index], tag: event.target.value };
                        setContent((previous) => ({ ...previous, destinations: next }));
                      }}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none"
                    />
                    <input
                      aria-label={`Destination ${index + 1} price`}
                      value={destination.price}
                      onChange={(event) => {
                        const next = [...content.destinations];
                        next[index] = { ...next[index], price: event.target.value };
                        setContent((previous) => ({ ...previous, destinations: next }));
                      }}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none"
                    />
                  </div>
                  <textarea
                    aria-label={`Destination ${index + 1} description`}
                    value={destination.description}
                    onChange={(event) => {
                      const next = [...content.destinations];
                      next[index] = { ...next[index], description: event.target.value };
                      setContent((previous) => ({ ...previous, destinations: next }));
                    }}
                    className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Featured packages</h2>
              <button type="button" onClick={addJourney} className="text-sm text-emerald-300">Add journey</button>
            </div>
            <div className="space-y-4">
              {content.journeys.length === 0 && <p className="text-sm text-slate-400">No journeys added yet.</p>}
              {content.journeys.map((journey, index) => (
                <div key={`${journey.title}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:grid-cols-2">
                  <input aria-label="Journey title" value={journey.title} onChange={(event) => updateJourney(index, "title", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none" />
                  <input aria-label="Journey duration" value={journey.duration} onChange={(event) => updateJourney(index, "duration", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none" />
                  <textarea aria-label="Journey summary" value={journey.summary} onChange={(event) => updateJourney(index, "summary", event.target.value)} className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none md:col-span-2" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Services</h2>
              <button type="button" onClick={addService} className="text-sm text-emerald-300">Add service</button>
            </div>
            <div className="space-y-4">
              {content.services.length === 0 && <p className="text-sm text-slate-400">No services added yet.</p>}
              {content.services.map((service, index) => (
                <div key={`${service.title}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <input aria-label={`Service ${index + 1} title`} value={service.title} onChange={(event) => updateService(index, "title", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none" />
                  <textarea aria-label={`Service ${index + 1} description`} value={service.description} onChange={(event) => updateService(index, "description", event.target.value)} className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Gallery</h2>
              <button type="button" onClick={addGalleryImage} className="text-sm text-emerald-300">Add image</button>
            </div>
            <div className="space-y-4">
              {content.gallery.length === 0 && <p className="text-sm text-slate-400">No gallery images added yet.</p>}
              {content.gallery.map((image, index) => (
                <div key={`${image.imageUrl}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:grid-cols-2">
                  <input aria-label={`Gallery image ${index + 1} URL`} value={image.imageUrl} onChange={(event) => updateGalleryImage(index, "imageUrl", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none md:col-span-2" />
                  <input aria-label={`Gallery image ${index + 1} alt text`} value={image.alt} onChange={(event) => updateGalleryImage(index, "alt", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none" />
                  <input aria-label={`Gallery image ${index + 1} caption`} value={image.caption} onChange={(event) => updateGalleryImage(index, "caption", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <h2 className="mb-5 text-xl font-semibold">About</h2>
            <div className="grid gap-4">
              <input aria-label="About eyebrow" value={content.about.eyebrow} onChange={(event) => updateText("about.eyebrow", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none" />
              <input aria-label="About title" value={content.about.title} onChange={(event) => updateText("about.title", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none" />
              <textarea aria-label="About text" value={content.about.body} onChange={(event) => updateText("about.body", event.target.value)} className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none" />
              <input aria-label="About image URL" value={content.about.imageUrl} onChange={(event) => updateText("about.imageUrl", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none" />
              <input aria-label="About image alt text" value={content.about.imageAlt} onChange={(event) => updateText("about.imageAlt", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none" />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Why choose us</h2>
              <button type="button" onClick={addBenefit} className="text-sm text-emerald-300">Add benefit</button>
            </div>
            <div className="space-y-3">
              {content.benefits.length === 0 && <p className="text-sm text-slate-400">No benefits added yet.</p>}
              {content.benefits.map((benefit, index) => (
                <input key={index} aria-label={`Benefit ${index + 1}`} value={benefit} onChange={(event) => updateBenefit(index, event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none" />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Testimonials</h2>
              <button type="button" onClick={addTestimonial} className="text-sm text-emerald-300">Add testimonial</button>
            </div>
            <div className="space-y-4">
              {content.testimonials.length === 0 && <p className="text-sm text-slate-400">No testimonials added yet.</p>}
              {content.testimonials.map((testimonial, index) => (
                <div key={`${testimonial.name}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <input aria-label={`Testimonial ${index + 1} name`} value={testimonial.name} onChange={(event) => updateTestimonial(index, "name", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none" />
                  <textarea aria-label={`Testimonial ${index + 1} quote`} value={testimonial.quote} onChange={(event) => updateTestimonial(index, "quote", event.target.value)} className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none" />
                  <input aria-label={`Testimonial ${index + 1} trip`} value={testimonial.trip} onChange={(event) => updateTestimonial(index, "trip", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <h2 className="mb-5 text-xl font-semibold">Closing call to action</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                <span>Title</span>
                <input value={content.cta.title} onChange={(event) => updateText("cta.title", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Button text</span>
                <input value={content.cta.buttonText} onChange={(event) => updateText("cta.buttonText", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none" />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/20">
            <h2 className="mb-5 text-xl font-semibold">Contact details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Email</span>
                <input
                  value={content.contact.email}
                  onChange={(event) => setContent((previous) => ({ ...previous, contact: { ...previous.contact, email: event.target.value } }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Phone</span>
                <input
                  value={content.contact.phone}
                  onChange={(event) => setContent((previous) => ({ ...previous, contact: { ...previous.contact, phone: event.target.value } }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                <span>Address</span>
                <input
                  value={content.contact.address}
                  onChange={(event) => setContent((previous) => ({ ...previous, contact: { ...previous.contact, address: event.target.value } }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                <span>WhatsApp number (international format)</span>
                <input
                  inputMode="tel"
                  value={content.contact.whatsappNumber}
                  onChange={(event) => setContent((previous) => ({ ...previous, contact: { ...previous.contact, whatsappNumber: event.target.value } }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none"
                />
              </label>
            </div>
          </section>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Save content
            </button>
            <span role="status" aria-live="polite" className="text-sm text-slate-300">{status}</span>
          </div>
        </form>
      </div>
    </main>
  );
}
