import Image from "next/image";

import { shouldOptimizeImage } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/api";

export async function generateMetadata() {
  const content = await getSiteContent();
  const firstImage = content.gallery.find((image) => image.active && image.imageUrl);
  return pageMetadata(content, {
    title: "Travel Gallery",
    description: "Browse photographs and moments from our destinations, journeys, and travel experiences.",
    path: "/gallery",
    image: firstImage?.imageUrl,
    imageAlt: firstImage?.altText || firstImage?.alt || firstImage?.title,
  });
}

export default async function GalleryPage() {
  const content = await getSiteContent();
  const images = content.gallery.filter((image) => image.active).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Field notes</p>
      <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Gallery</h1>
      {images.length === 0 ? <p className="mt-8 text-slate-300">Gallery photographs will appear here soon.</p> : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => <figure key={`${image.imageUrl}-${index}`} className="group relative overflow-hidden rounded-xl bg-slate-900"><div className="relative aspect-[4/3]"><Image src={image.imageUrl} alt={image.altText || image.alt || image.caption || image.title || "Travel photograph"} fill unoptimized={!shouldOptimizeImage(image.imageUrl)} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /></div><figcaption className="bg-slate-900 px-4 py-3 text-sm text-slate-200">{image.caption || image.title}</figcaption></figure>)}
        </div>
      )}
    </main>
  );
}