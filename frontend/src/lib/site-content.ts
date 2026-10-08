import { defaultContent, type SiteContent } from "@/lib/site-data";

export async function getSiteContent(): Promise<SiteContent> {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
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