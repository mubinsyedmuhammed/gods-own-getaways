import { defaultContent, type SiteContent } from "@/lib/types";

export async function getSiteContent(): Promise<SiteContent> {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return defaultContent;

  try {
    const response = await fetch(`${apiUrl}/api/content`, {
      next: { revalidate: 300, tags: ["site-content"] },
    });
    if (!response.ok) return defaultContent;
    const content = (await response.json()) as SiteContent | null;
    return content ?? defaultContent;
  } catch {
    return defaultContent;
  }
}

export async function uploadImage(file: File, token: string): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Set NEXT_PUBLIC_API_URL to upload an image.");
  if (!token) throw new Error("Enter the configured image upload token before uploading.");

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
  return result.url;
}

export async function uploadImages(files: File[], token: string): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(file, token)));
}
