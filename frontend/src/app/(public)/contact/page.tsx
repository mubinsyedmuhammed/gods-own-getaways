import type { Metadata } from "next";

import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const content = await getSiteContent();
  const whatsappDigits = content.contact.whatsappNumber.replace(/\D/g, "");

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Start a conversation</p>
      <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Contact us</h1>
      <p className="mt-4 max-w-2xl text-slate-300">Tell us what kind of trip you have in mind. We’ll help you explore the next steps.</p>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold text-white">Reach our team</h2>
          <div className="mt-4 flex flex-col gap-3 text-slate-300">
            {content.contact.email && <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>}
            {content.contact.phone && <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a>}
            {content.contact.address && <p>{content.contact.address}</p>}
            {content.contact.googleMapsUrl && <a href={content.contact.googleMapsUrl} target="_blank" rel="noreferrer">View on Google Maps</a>}
            {!content.contact.email && !content.contact.phone && !content.contact.address && <p>Contact details will appear here soon.</p>}
          </div>
        </section>
        <section className="border-l border-white/10 pl-6">
          <h2 className="text-xl font-semibold text-white">Enquiry options</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {content.contact.email && <a href={`mailto:${content.contact.email}`} className="rounded-full border border-white/15 px-5 py-3 text-sm text-white">Email us</a>}
            {whatsappDigits && <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950">Message on WhatsApp</a>}
            {!content.contact.email && !whatsappDigits && <p className="text-slate-300">Enquiry options will appear here soon.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}