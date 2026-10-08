import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/api";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const content = await getSiteContent();
  const staticRoutes = [
    "",
    "/destinations",
    "/packages",
    "/services",
    "/gallery",
    "/about",
    "/contact",
  ];
  const destinationRoutes = content.destinations
    .filter((destination) => destination.active && destination.slug)
    .map((destination) => `/destinations/${encodeURIComponent(destination.slug)}`);
  const packageRoutes = content.packages
    .filter((travelPackage) => travelPackage.active && travelPackage.slug)
    .map((travelPackage) => `/packages/${encodeURIComponent(travelPackage.slug)}`);

  return [...staticRoutes, ...destinationRoutes, ...packageRoutes].map((path) => ({
    url: new URL(path, siteUrl).toString(),
  }));
}
