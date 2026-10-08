import Image from "next/image";

import { shouldOptimizeImage } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/api";

export async function generateMetadata() {
  const content = await getSiteContent();
  return pageMetadata(content, {
    title: content.about.title || "About Us",
    description: content.about.body || content.description || content.tagline || "Learn about our travel company and the people who help make every journey memorable.",
    path: "/about",
    image: content.about.imageUrl || undefined,
    imageAlt: content.about.imageAlt || undefined,
  });
}

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{content.about.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{content.about.title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">{content.about.body}</p>
          <p className="mt-6 leading-7 text-slate-300">{content.description}</p>
        </div>
        {content.about.imageUrl && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900"><Image src={content.about.imageUrl} alt={content.about.imageAlt || content.about.title} fill unoptimized={!shouldOptimizeImage(content.about.imageUrl)} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>}
      </div>
    </main>
  );
}