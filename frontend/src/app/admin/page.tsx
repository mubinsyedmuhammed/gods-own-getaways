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
            <h2 className="mb-5 text-xl font-semibold">Travel stats</h2>
            <div className="space-y-3">
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="grid gap-3 md:grid-cols-2">
                  <input
                    value={stat.label}
                    onChange={(event) => {
                      const next = [...content.stats];
                      next[index] = { ...next[index], label: event.target.value };
                      setContent((previous) => ({ ...previous, stats: next }));
                    }}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-emerald-400"
                  />
                  <input
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
            <h2 className="mb-5 text-xl font-semibold">Featured destinations</h2>
            <div className="space-y-4">
              {content.destinations.map((destination, index) => (
                <div key={`${destination.name}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={destination.name}
                      onChange={(event) => {
                        const next = [...content.destinations];
                        next[index] = { ...next[index], name: event.target.value };
                        setContent((previous) => ({ ...previous, destinations: next }));
                      }}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none"
                    />
                    <input
                      value={destination.region}
                      onChange={(event) => {
                        const next = [...content.destinations];
                        next[index] = { ...next[index], region: event.target.value };
                        setContent((previous) => ({ ...previous, destinations: next }));
                      }}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none"
                    />
                    <input
                      value={destination.tag}
                      onChange={(event) => {
                        const next = [...content.destinations];
                        next[index] = { ...next[index], tag: event.target.value };
                        setContent((previous) => ({ ...previous, destinations: next }));
                      }}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white outline-none"
                    />
                    <input
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
            </div>
          </section>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              Save content
            </button>
            <span className="text-sm text-slate-300">{status}</span>
          </div>
        </form>
      </div>
    </main>
  );
}
