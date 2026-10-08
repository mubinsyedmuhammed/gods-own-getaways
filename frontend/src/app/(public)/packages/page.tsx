import type { Metadata } from "next";

import { PackageCard } from "@/components/travel-cards";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Travel Packages" };

export default async function PackagesPage() {
  const content = await getSiteContent();
  const packages = content.packages.filter((travelPackage) => travelPackage.active).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Curated journeys</p>
      <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Travel packages</h1>
      <p className="mt-4 max-w-2xl text-slate-300">Explore active packages and ask us to tailor one to your dates and interests.</p>
      {packages.length === 0 ? <p className="mt-12 text-slate-300">Packages will appear here soon.</p> : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((travelPackage) => <PackageCard key={travelPackage.slug} travelPackage={travelPackage} />)}
        </div>
      )}
    </main>
  );
}