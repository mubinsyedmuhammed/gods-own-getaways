import Image from "next/image";

import { shouldOptimizeImage } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/api";

export async function generateMetadata() {
  const content = await getSiteContent();
  return pageMetadata(content, {
    title: "Travel Services",
    description: "From flights and stays to transfers and tailor-made itineraries, explore travel services designed around your journey.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const content = await getSiteContent();
  const services = content.services.filter((service) => service.active).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Travel, thoughtfully handled</p>
      <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Our services</h1>
      {services.length === 0 ? <p className="mt-8 text-slate-300">Services will appear here soon.</p> : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => <article key={service.slug} className="border-t border-emerald-400/50 bg-slate-900/50 p-6"><h2 className="text-xl font-semibold text-white">{service.title}</h2>{service.image && <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-lg"><Image src={service.image} alt={`${service.title} travel service`} fill unoptimized={!shouldOptimizeImage(service.image)} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>}<p className="mt-3 leading-7 text-slate-300">{service.shortDescription || service.description}</p></article>)}
        </div>
      )}
    </main>
  );
}