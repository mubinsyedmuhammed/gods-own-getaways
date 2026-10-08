"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { defaultContent, type SiteContent } from "@/lib/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const inputClass =
  "min-h-11 w-full min-w-0 rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-base text-white outline-none transition focus:border-emerald-400 sm:text-sm";
const cardClass = "rounded-2xl border border-white/10 bg-slate-950/60 p-3 sm:p-5";
type CollectionKey = "destinations" | "packages" | "services" | "gallery" | "testimonials";
type CollectionItemPatch = {
  [K in CollectionKey]: Partial<SiteContent[K][number]>;
}[CollectionKey];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function reorderItems<T extends { sortOrder: number }>(items: T[], index: number, direction: -1 | 1): T[] {
  const destination = index + direction;
  if (destination < 0 || destination >= items.length) return items;
  const reordered = [...items];
  const [item] = reordered.splice(index, 1);
  reordered.splice(destination, 0, item);
  return reordered.map((entry, sortOrder) => ({ ...entry, sortOrder }));
}

function TextField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block space-y-2 text-sm text-slate-300">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} min-h-24 resize-y`}
        />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      )}
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
  token,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  token: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!apiUrl) {
      setError("Set NEXT_PUBLIC_API_URL to upload an image.");
      return;
    }
    if (!token) {
      setError("Enter the configured image upload token before uploading.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}/api/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type,
          "X-File-Name": encodeURIComponent(file.name),
        },
        body: file,
      });
      const result = (await response.json()) as { url?: string; detail?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.detail || `Image upload failed (${response.status}).`);
      }
      onChange(result.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-w-0 space-y-2 text-sm text-slate-300">
      <label className="block space-y-2">
        <span>{label}</span>
        <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      </label>
      <label className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-white/15 px-4 text-xs font-medium text-white transition hover:bg-white/5">
        {uploading ? "Uploading..." : "Choose image"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => void uploadFile(event)}
        />
      </label>
      {error && <p role="alert" className="break-words text-xs text-rose-300">{error}</p>}
      {uploading && <p role="status" className="text-xs text-slate-400">Uploading image...</p>}
    </div>
  );
}

function ImageListField({
  label,
  values,
  onChange,
  token,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  token: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (!apiUrl || !token) {
      setError(!apiUrl ? "Set NEXT_PUBLIC_API_URL to upload images." : "Enter the configured image upload token before uploading.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const response = await fetch(`${apiUrl}/api/images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": file.type,
            "X-File-Name": encodeURIComponent(file.name),
          },
          body: file,
        });
        const result = (await response.json()) as { url?: string; detail?: string };
        if (!response.ok || !result.url) {
          throw new Error(result.detail || `Uploading ${file.name} failed (${response.status}).`);
        }
        return result.url;
      }));
      onChange([...values, ...urls]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload gallery images.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-w-0 space-y-2 text-sm text-slate-300">
      <TextListField label={label} values={values} onChange={onChange} />
      <label className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-white/15 px-4 text-xs font-medium text-white transition hover:bg-white/5">
        {uploading ? "Uploading..." : "Add gallery images"}
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => void uploadFiles(event)}
        />
      </label>
      {error && <p role="alert" className="break-words text-xs text-rose-300">{error}</p>}
      {uploading && <p role="status" className="text-xs text-slate-400">Uploading images...</p>}
    </div>
  );
}

function TextListField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <TextField
      label={`${label} (one per line)`}
      value={values.join("\n")}
      multiline
      onChange={(value) => onChange(value.split("\n").map((item) => item.trim()).filter(Boolean))}
    />
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-sm text-slate-300">
      <input className="h-5 w-5 shrink-0 accent-emerald-400" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [status, setStatus] = useState("Loading saved content...");
  const [saving, setSaving] = useState(false);
  const [imageUploadToken, setImageUploadToken] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!apiUrl) {
        setStatus("Set NEXT_PUBLIC_API_URL to connect to the content API.");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/content`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Loading content failed (${response.status}).`);
        }
        const data = (await response.json()) as SiteContent | null;
        setContent(data ?? defaultContent);
        setStatus(data ? "Saved content loaded." : "No saved content found; editing the initial content.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Could not load saved content.");
      }
    };

    void load();
  }, []);

  const updateList = <K extends CollectionKey>(
    key: K,
    transform: (items: SiteContent[K]) => SiteContent[K],
  ) => {
    setContent((previous) => ({ ...previous, [key]: transform(previous[key]) }));
  };

  function updateItem(key: "destinations", index: number, changes: Partial<SiteContent["destinations"][number]>): void;
  function updateItem(key: "packages", index: number, changes: Partial<SiteContent["packages"][number]>): void;
  function updateItem(key: "services", index: number, changes: Partial<SiteContent["services"][number]>): void;
  function updateItem(key: "gallery", index: number, changes: Partial<SiteContent["gallery"][number]>): void;
  function updateItem(key: "testimonials", index: number, changes: Partial<SiteContent["testimonials"][number]>): void;
  function updateItem(key: CollectionKey, index: number, changes: CollectionItemPatch) {
    switch (key) {
      case "destinations":
        setContent((previous) => ({
          ...previous,
          destinations: previous.destinations.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)),
          packages: previous.packages.map((travelPackage) =>
            "slug" in changes &&
            changes.slug &&
            travelPackage.destinationSlug === previous.destinations[index]?.slug
              ? { ...travelPackage, destinationSlug: changes.slug }
              : travelPackage,
          ),
        }));
        break;
      case "packages":
        setContent((previous) => ({
          ...previous,
          packages: previous.packages.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)),
        }));
        break;
      case "services":
        setContent((previous) => ({
          ...previous,
          services: previous.services.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)),
        }));
        break;
      case "gallery":
        setContent((previous) => ({
          ...previous,
          gallery: previous.gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)),
        }));
        break;
      case "testimonials":
        setContent((previous) => ({
          ...previous,
          testimonials: previous.testimonials.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)),
        }));
        break;
    }
  }

  const removeItem = (key: CollectionKey, index: number) => {
    switch (key) {
      case "destinations":
        setContent((previous) => {
          const removed = previous.destinations[index];
          return {
            ...previous,
            destinations: previous.destinations.filter((_, itemIndex) => itemIndex !== index),
            packages: previous.packages.map((travelPackage) =>
              travelPackage.destinationSlug === removed?.slug
                ? { ...travelPackage, destinationSlug: "", destinationId: null }
                : travelPackage,
            ),
          };
        });
        break;
      case "packages":
        setContent((previous) => ({ ...previous, packages: previous.packages.filter((_, itemIndex) => itemIndex !== index) }));
        break;
      case "services":
        setContent((previous) => ({ ...previous, services: previous.services.filter((_, itemIndex) => itemIndex !== index) }));
        break;
      case "gallery":
        setContent((previous) => ({ ...previous, gallery: previous.gallery.filter((_, itemIndex) => itemIndex !== index) }));
        break;
      case "testimonials":
        setContent((previous) => ({ ...previous, testimonials: previous.testimonials.filter((_, itemIndex) => itemIndex !== index) }));
        break;
    }
  };

  const moveItem = (key: CollectionKey, index: number, direction: -1 | 1) => {
    switch (key) {
      case "destinations":
        updateList(key, (items) => reorderItems(items, index, direction));
        break;
      case "packages":
        updateList(key, (items) => reorderItems(items, index, direction));
        break;
      case "services":
        updateList(key, (items) => reorderItems(items, index, direction));
        break;
      case "gallery":
        updateList(key, (items) => reorderItems(items, index, direction));
        break;
      case "testimonials":
        updateList(key, (items) => reorderItems(items, index, direction));
        break;
    }
  };

  const addDestination = () => {
    updateList("destinations", (items) => [
      ...items,
      {
        slug: "",
        name: "",
        region: "",
        tag: "",
        shortDescription: "",
        description: "",
        price: "",
        imageUrl: "",
        imageAlt: "",
        highlights: [],
        featured: false,
        active: true,
        sortOrder: items.length,
      },
    ]);
  };

  const addPackage = () => {
    updateList("packages", (items) => [
      ...items,
      {
        slug: "",
        title: "",
        destinationSlug: "",
        duration: "",
        summary: "",
        shortDescription: "",
        description: "",
        price: "",
        currency: "",
        active: true,
        featured: false,
        sortOrder: items.length,
        imageUrl: "",
        imageAlt: "",
        galleryImages: [],
        itinerary: [],
        includedItems: [],
        excludedItems: [],
        highlights: [],
      },
    ]);
  };

  const addService = () => {
    updateList("services", (items) => [
      ...items,
      {
        title: "",
        slug: "",
        shortDescription: "",
        description: "",
        icon: "",
        image: "",
        featured: false,
        active: true,
        sortOrder: items.length,
      },
    ]);
  };

  const addGalleryImage = () => {
    updateList("gallery", (items) => [
      ...items,
      {
        imageUrl: "",
        title: "",
        alt: "",
        altText: "",
        caption: "",
        category: "",
        sortOrder: items.length,
        active: true,
      },
    ]);
  };

  const addTestimonial = () => {
    updateList("testimonials", (items) => [
      ...items,
      {
        name: "",
        quote: "",
        trip: "",
        customerName: "",
        customerLocation: "",
        content: "",
        rating: 5,
        image: "",
        featured: false,
        active: true,
        sortOrder: items.length,
      },
    ]);
  };

  const saveContent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!apiUrl) {
      setStatus("Set NEXT_PUBLIC_API_URL to connect to the content API.");
      return;
    }

    setSaving(true);
    setStatus("Saving changes...");
    try {
      const response = await fetch(`${apiUrl}/api/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || `Saving content failed (${response.status}).`);
      }

      const saved = (await response.json()) as SiteContent;
      setContent(saved);
      setStatus("Content saved successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save content.");
    } finally {
      setSaving(false);
    }
  };

  const collectionActions = (key: CollectionKey, index: number) => (
    <div className="flex flex-wrap items-center gap-1 sm:gap-3">
      <button type="button" disabled={index === 0} onClick={() => moveItem(key, index, -1)} className="inline-flex min-h-10 items-center px-2 text-sm text-emerald-300 disabled:text-slate-600 sm:px-0">Move up</button>
      <button type="button" disabled={index === content[key].length - 1} onClick={() => moveItem(key, index, 1)} className="inline-flex min-h-10 items-center px-2 text-sm text-emerald-300 disabled:text-slate-600 sm:px-0">Move down</button>
      <button type="button" onClick={() => removeItem(key, index)} className="inline-flex min-h-10 items-center px-2 text-sm text-rose-300 sm:px-0">Delete</button>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-950 px-3 py-6 text-slate-50 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Content management</p>
            <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">{content.name} admin</h1>
          </div>
          <Link href="/" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
            View website
          </Link>
        </header>

        <form onSubmit={saveContent} className="space-y-6">
          <section className={cardClass}>
            <h2 className="mb-2 text-lg font-semibold">Image uploads</h2>
            <p className="mb-4 text-sm leading-6 text-slate-400">
              Uploads are stored outside the database. The token stays in this page and is not saved with site content.
            </p>
            <div className="max-w-xl">
              <label className="block space-y-2 text-sm text-slate-300">
                <span>Image upload token</span>
                <input
                  type="password"
                  autoComplete="off"
                  value={imageUploadToken}
                  onChange={(event) => setImageUploadToken(event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="mb-5 text-xl font-semibold">Site settings</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Company name" value={content.name} onChange={(name) => setContent((previous) => ({ ...previous, name }))} />
              <TextField label="Tagline" value={content.tagline} onChange={(tagline) => setContent((previous) => ({ ...previous, tagline }))} />
              <ImageField label="Logo image URL" value={content.settings.logo} token={imageUploadToken} onChange={(logo) => setContent((previous) => ({ ...previous, settings: { ...previous.settings, logo } }))} />
              <ImageField label="Favicon URL" value={content.settings.favicon} token={imageUploadToken} onChange={(favicon) => setContent((previous) => ({ ...previous, settings: { ...previous.settings, favicon } }))} />
              <TextField label="Instagram URL" value={content.settings.instagramUrl} onChange={(instagramUrl) => setContent((previous) => ({ ...previous, settings: { ...previous.settings, instagramUrl } }))} />
              <TextField label="Facebook URL" value={content.settings.facebookUrl} onChange={(facebookUrl) => setContent((previous) => ({ ...previous, settings: { ...previous.settings, facebookUrl } }))} />
              <TextField label="YouTube URL" value={content.settings.youtubeUrl} onChange={(youtubeUrl) => setContent((previous) => ({ ...previous, settings: { ...previous.settings, youtubeUrl } }))} />
              <TextField label="Footer text" value={content.settings.footerText} onChange={(footerText) => setContent((previous) => ({ ...previous, settings: { ...previous.settings, footerText } }))} />
              <div className="md:col-span-2">
                <TextField label="Website description" value={content.description} multiline onChange={(description) => setContent((previous) => ({ ...previous, description }))} />
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="mb-5 text-xl font-semibold">Hero section</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Eyebrow" value={content.hero.eyebrow} onChange={(eyebrow) => setContent((previous) => ({ ...previous, hero: { ...previous.hero, eyebrow } }))} />
              <TextField label="Hero title" value={content.hero.title} onChange={(title) => setContent((previous) => ({ ...previous, hero: { ...previous.hero, title } }))} />
              <TextField label="Hero subtitle" value={content.hero.subtitle} multiline onChange={(subtitle) => setContent((previous) => ({ ...previous, hero: { ...previous.hero, subtitle } }))} />
              <TextField label="Primary button" value={content.hero.primaryCta} onChange={(primaryCta) => setContent((previous) => ({ ...previous, hero: { ...previous.hero, primaryCta } }))} />
              <TextField label="Secondary button" value={content.hero.secondaryCta} onChange={(secondaryCta) => setContent((previous) => ({ ...previous, hero: { ...previous.hero, secondaryCta } }))} />
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Travel stats</h2>
              <button type="button" onClick={() => setContent((previous) => ({ ...previous, stats: [...previous.stats, { label: "", value: "" }] }))} className="text-sm text-emerald-300">Add stat</button>
            </div>
            <div className="space-y-3">
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="flex gap-3">
                  <input aria-label={`Stat ${index + 1} label`} value={stat.label} onChange={(event) => setContent((previous) => ({ ...previous, stats: previous.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) }))} className={inputClass} />
                  <input aria-label={`Stat ${index + 1} value`} value={stat.value} onChange={(event) => setContent((previous) => ({ ...previous, stats: previous.stats.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item) }))} className={inputClass} />
                  <button type="button" onClick={() => setContent((previous) => ({ ...previous, stats: previous.stats.filter((_, itemIndex) => itemIndex !== index) }))} className="text-sm text-rose-300">Delete</button>
                </div>
              ))}
              {content.stats.length === 0 && <p className="text-sm text-slate-400">No stats added.</p>}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Destinations</h2>
              <button type="button" onClick={addDestination} className="inline-flex min-h-11 items-center px-2 text-sm text-emerald-300">Add destination</button>
            </div>
            <div className="space-y-4">
              {content.destinations.map((destination, index) => (
                <article key={`${destination.slug}-${index}`} className={cardClass}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium">Destination {index + 1}</h3>
                    {collectionActions("destinations", index)}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Name" value={destination.name} onChange={(name) => updateItem("destinations", index, { name, slug: slugify(name) })} />
                    <TextField label="Slug" value={destination.slug} onChange={(slug) => updateItem("destinations", index, { slug })} />
                    <TextField label="Region" value={destination.region} onChange={(region) => updateItem("destinations", index, { region })} />
                    <TextField label="Tag" value={destination.tag} onChange={(tag) => updateItem("destinations", index, { tag })} />
                    <TextField label="Short description" value={destination.shortDescription} onChange={(shortDescription) => updateItem("destinations", index, { shortDescription })} />
                    <TextField label="Price label" value={destination.price} onChange={(price) => updateItem("destinations", index, { price })} />
                    <ImageField label="Cover image URL" value={destination.imageUrl} token={imageUploadToken} onChange={(imageUrl) => updateItem("destinations", index, { imageUrl })} />
                    <TextField label="Image alt text" value={destination.imageAlt} onChange={(imageAlt) => updateItem("destinations", index, { imageAlt })} />
                    <TextListField label="Highlights" values={destination.highlights} onChange={(highlights) => updateItem("destinations", index, { highlights })} />
                    <TextField label="Description" value={destination.description} multiline onChange={(description) => updateItem("destinations", index, { description })} />
                    <Toggle label="Featured" checked={destination.featured} onChange={(featured) => updateItem("destinations", index, { featured })} />
                    <Toggle label="Active on public site" checked={destination.active} onChange={(active) => updateItem("destinations", index, { active })} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Travel packages</h2>
              <button type="button" onClick={addPackage} className="inline-flex min-h-11 items-center px-2 text-sm text-emerald-300">Add package</button>
            </div>
            <div className="space-y-4">
              {content.packages.map((travelPackage, index) => (
                <article key={`${travelPackage.slug}-${index}`} className={cardClass}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium">Package {index + 1}</h3>
                    {collectionActions("packages", index)}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Title" value={travelPackage.title} onChange={(title) => updateItem("packages", index, { title, slug: slugify(title) })} />
                    <TextField label="Slug" value={travelPackage.slug} onChange={(slug) => updateItem("packages", index, { slug })} />
                    <label className="block space-y-2 text-sm text-slate-300">
                      <span>Destination</span>
                      <select value={travelPackage.destinationSlug} onChange={(event) => updateItem("packages", index, { destinationSlug: event.target.value, destinationId: event.target.value ? travelPackage.destinationId : null })} className={inputClass}>
                        <option value="">No destination linked</option>
                        {content.destinations.map((destination) => <option key={destination.slug} value={destination.slug}>{destination.name || destination.slug}</option>)}
                      </select>
                    </label>
                    <TextField label="Duration" value={travelPackage.duration} onChange={(duration) => updateItem("packages", index, { duration })} />
                    <TextField label="Price label" value={travelPackage.price} onChange={(price) => updateItem("packages", index, { price })} />
                    <TextField label="Currency code" value={travelPackage.currency} onChange={(currency) => updateItem("packages", index, { currency: currency.toUpperCase() })} />
                    <ImageField label="Cover image URL" value={travelPackage.imageUrl} token={imageUploadToken} onChange={(imageUrl) => updateItem("packages", index, { imageUrl })} />
                    <TextField label="Image alt text" value={travelPackage.imageAlt} onChange={(imageAlt) => updateItem("packages", index, { imageAlt })} />
                    <TextField label="Short description" value={travelPackage.shortDescription} onChange={(shortDescription) => updateItem("packages", index, { shortDescription })} />
                    <TextField label="Card summary" value={travelPackage.summary} onChange={(summary) => updateItem("packages", index, { summary })} />
                    <TextListField label="Highlights" values={travelPackage.highlights} onChange={(highlights) => updateItem("packages", index, { highlights })} />
                    <ImageListField label="Gallery image URLs" values={travelPackage.galleryImages} token={imageUploadToken} onChange={(galleryImages) => updateItem("packages", index, { galleryImages })} />
                    <TextListField label="Itinerary" values={travelPackage.itinerary} onChange={(itinerary) => updateItem("packages", index, { itinerary })} />
                    <TextListField label="Included items" values={travelPackage.includedItems} onChange={(includedItems) => updateItem("packages", index, { includedItems })} />
                    <TextListField label="Excluded items" values={travelPackage.excludedItems} onChange={(excludedItems) => updateItem("packages", index, { excludedItems })} />
                    <TextField label="Description" value={travelPackage.description} multiline onChange={(description) => updateItem("packages", index, { description })} />
                    <Toggle label="Featured" checked={travelPackage.featured} onChange={(featured) => updateItem("packages", index, { featured })} />
                    <Toggle label="Active on public site" checked={travelPackage.active} onChange={(active) => updateItem("packages", index, { active })} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Services</h2>
              <button type="button" onClick={addService} className="inline-flex min-h-11 items-center px-2 text-sm text-emerald-300">Add service</button>
            </div>
            <div className="space-y-4">
              {content.services.map((service, index) => (
                <article key={`${service.slug}-${index}`} className={cardClass}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium">Service {index + 1}</h3>
                    {collectionActions("services", index)}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Title" value={service.title} onChange={(title) => updateItem("services", index, { title, slug: slugify(title) })} />
                    <TextField label="Slug" value={service.slug} onChange={(slug) => updateItem("services", index, { slug })} />
                    <TextField label="Short description" value={service.shortDescription} onChange={(shortDescription) => updateItem("services", index, { shortDescription })} />
                    <TextField label="Icon name or URL" value={service.icon} onChange={(icon) => updateItem("services", index, { icon })} />
                    <ImageField label="Image URL" value={service.image} token={imageUploadToken} onChange={(image) => updateItem("services", index, { image })} />
                    <TextField label="Description" value={service.description} multiline onChange={(description) => updateItem("services", index, { description })} />
                    <Toggle label="Featured" checked={service.featured} onChange={(featured) => updateItem("services", index, { featured })} />
                    <Toggle label="Active on public site" checked={service.active} onChange={(active) => updateItem("services", index, { active })} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Gallery</h2>
              <button type="button" onClick={addGalleryImage} className="inline-flex min-h-11 items-center px-2 text-sm text-emerald-300">Add image</button>
            </div>
            <div className="space-y-4">
              {content.gallery.map((image, index) => (
                <article key={`${image.imageUrl}-${index}`} className={cardClass}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium">Gallery image {index + 1}</h3>
                    {collectionActions("gallery", index)}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <ImageField label="Image URL" value={image.imageUrl} token={imageUploadToken} onChange={(imageUrl) => updateItem("gallery", index, { imageUrl })} />
                    <TextField label="Title" value={image.title} onChange={(title) => updateItem("gallery", index, { title })} />
                    <TextField label="Alt text" value={image.alt} onChange={(alt) => updateItem("gallery", index, { alt, altText: alt })} />
                    <TextField label="Caption" value={image.caption} onChange={(caption) => updateItem("gallery", index, { caption })} />
                    <TextField label="Category" value={image.category} onChange={(category) => updateItem("gallery", index, { category })} />
                    <Toggle label="Active on public site" checked={image.active} onChange={(active) => updateItem("gallery", index, { active })} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Testimonials</h2>
              <button type="button" onClick={addTestimonial} className="inline-flex min-h-11 items-center px-2 text-sm text-emerald-300">Add testimonial</button>
            </div>
            <div className="space-y-4">
              {content.testimonials.map((testimonial, index) => (
                <article key={`${testimonial.customerName}-${index}`} className={cardClass}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium">Testimonial {index + 1}</h3>
                    {collectionActions("testimonials", index)}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Customer name" value={testimonial.customerName} onChange={(customerName) => updateItem("testimonials", index, { customerName, name: customerName })} />
                    <TextField label="Customer location" value={testimonial.customerLocation} onChange={(customerLocation) => updateItem("testimonials", index, { customerLocation })} />
                    <TextField label="Trip or package" value={testimonial.trip} onChange={(trip) => updateItem("testimonials", index, { trip })} />
                    <ImageField label="Customer image URL" value={testimonial.image} token={imageUploadToken} onChange={(image) => updateItem("testimonials", index, { image })} />
                    <TextField label="Rating (1-5)" value={String(testimonial.rating)} onChange={(rating) => updateItem("testimonials", index, { rating: Number(rating) || 1 })} />
                    <TextField label="Testimonial" value={testimonial.content} multiline onChange={(content) => updateItem("testimonials", index, { content, quote: content })} />
                    <Toggle label="Featured" checked={testimonial.featured} onChange={(featured) => updateItem("testimonials", index, { featured })} />
                    <Toggle label="Active on public site" checked={testimonial.active} onChange={(active) => updateItem("testimonials", index, { active })} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="mb-5 text-xl font-semibold">About, benefits, and call to action</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="About eyebrow" value={content.about.eyebrow} onChange={(eyebrow) => setContent((previous) => ({ ...previous, about: { ...previous.about, eyebrow } }))} />
              <TextField label="About title" value={content.about.title} onChange={(title) => setContent((previous) => ({ ...previous, about: { ...previous.about, title } }))} />
              <TextField label="About text" value={content.about.body} multiline onChange={(body) => setContent((previous) => ({ ...previous, about: { ...previous.about, body } }))} />
              <ImageField label="About image URL" value={content.about.imageUrl} token={imageUploadToken} onChange={(imageUrl) => setContent((previous) => ({ ...previous, about: { ...previous.about, imageUrl } }))} />
              <TextField label="About image alt text" value={content.about.imageAlt} onChange={(imageAlt) => setContent((previous) => ({ ...previous, about: { ...previous.about, imageAlt } }))} />
              <TextListField label="Benefits" values={content.benefits} onChange={(benefits) => setContent((previous) => ({ ...previous, benefits }))} />
              <TextField label="Call-to-action title" value={content.cta.title} onChange={(title) => setContent((previous) => ({ ...previous, cta: { ...previous.cta, title } }))} />
              <TextField label="Call-to-action button" value={content.cta.buttonText} onChange={(buttonText) => setContent((previous) => ({ ...previous, cta: { ...previous.cta, buttonText } }))} />
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="mb-5 text-xl font-semibold">Contact and social links</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Email" value={content.contact.email} onChange={(email) => setContent((previous) => ({ ...previous, contact: { ...previous.contact, email } }))} />
              <TextField label="Phone" value={content.contact.phone} onChange={(phone) => setContent((previous) => ({ ...previous, contact: { ...previous.contact, phone } }))} />
              <TextField label="WhatsApp number (international format)" value={content.contact.whatsappNumber} onChange={(whatsappNumber) => setContent((previous) => ({ ...previous, contact: { ...previous.contact, whatsappNumber } }))} />
              <TextField label="Google Maps URL" value={content.contact.googleMapsUrl} onChange={(googleMapsUrl) => setContent((previous) => ({ ...previous, contact: { ...previous.contact, googleMapsUrl } }))} />
              <div className="md:col-span-2">
                <TextField label="Address" value={content.contact.address} onChange={(address) => setContent((previous) => ({ ...previous, contact: { ...previous.contact, address } }))} />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <button type="submit" disabled={saving} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60 md:w-auto">
              {saving ? "Saving..." : "Save all content"}
            </button>
            <span role="status" aria-live="polite" className="break-all text-sm text-slate-300">{status}</span>
          </div>
        </form>
      </div>
    </main>
  );
}
