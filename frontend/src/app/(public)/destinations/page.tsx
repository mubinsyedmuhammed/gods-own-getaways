import { DestinationCard } from "@/components/destinations/destination-card";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/api";

export async function generateMetadata() {
  const content = await getSiteContent();
  return pageMetadata(content, {
    title: "Travel Destinations",
    description: "Explore inspiring destinations and find the place that fits the way you want to travel.",
    path: "/destinations",
  });
}

export default async function DestinationsPage() {
  const content = await getSiteContent();
  const destinations = content.destinations.filter((destination) => destination.active).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Explore</p>
      <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Destinations</h1>
      <p className="mt-4 max-w-2xl text-slate-300">Find a place that fits the way you want to travel.</p>
      {destinations.length === 0 ? <p className="mt-12 text-slate-300">Destinations will appear here soon.</p> : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => <DestinationCard key={destination.slug} destination={destination} />)}
        </div>
      )}
    </main>
  );
}