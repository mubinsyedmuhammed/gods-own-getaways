import type { Metadata } from "next";

import type { SiteContent } from "@/lib/types";

export function getSiteUrl(): URL | undefined {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const value = configuredUrl ?? (vercelUrl ? `https://${vercelUrl}` : undefined);
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : undefined;
  } catch {
    return undefined;
  }
}

export function pageMetadata(
  content: SiteContent,
  {
    title,
    description,
    path,
    image,
    imageAlt,
  }: {
    title: string;
    description: string;
    path: string;
    image?: string;
    imageAlt?: string;
  },
): Metadata {
  const siteName = content.name.trim() || "Travel";
  const url = getSiteUrl();
  const absoluteUrl = url ? new URL(path, url).toString() : undefined;
  const images = image
    ? [{ url: image, ...(imageAlt ? { alt: imageAlt } : {}) }]
    : undefined;

  return {
    title,
    description,
    ...(absoluteUrl ? { alternates: { canonical: absoluteUrl } } : {}),
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      ...(absoluteUrl ? { url: absoluteUrl } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
