import { telephoneUrl, whatsappUrl } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/api";

export async function generateMetadata() {
  const content = await getSiteContent();
  return pageMetadata(content, {
    title: "Contact Us",
    description: "Get in touch with our travel team to plan your next journey, ask a question, or tailor a trip to your needs.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const content = await getSiteContent();
  const whatsappHref = whatsappUrl(content.contact.whatsappNumber, `Hello ${content.name || "there"}, I would like to plan a trip.`);
  const callHref = telephoneUrl(content.contact.phone);

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Start a conversation</p>
      <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Contact us</h1>
      <p className="mt-4 max-w-2xl text-slate-300">Tell us what kind of trip you have in mind. We’ll help you explore the next steps.</p>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold text-white">Reach our team</h2>
          <div className="mt-4 flex flex-col gap-3 break-words text-slate-300">
            {content.contact.email && <a className="break-all" href={`mailto:${content.contact.email}`}>{content.contact.email}</a>}
            {callHref && <a className="min-h-11 inline-flex items-center" href={callHref}>Call us: {content.contact.phone}</a>}
            {content.contact.address && <p className="max-w-prose">{content.contact.address}</p>}
            {content.contact.googleMapsUrl && <a href={content.contact.googleMapsUrl} target="_blank" rel="noreferrer">View on Google Maps</a>}
            {!content.contact.email && !content.contact.phone && !content.contact.address && <p>Contact details will appear here soon.</p>}
          </div>
        </section>
        <section className="border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pt-0 md:pl-6">
          <h2 className="text-xl font-semibold text-white">Enquiry options</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {content.contact.email && <a href={`mailto:${content.contact.email}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm text-white">Email us</a>}
            {whatsappHref && <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950">Message on WhatsApp</a>}
            {!content.contact.email && !whatsappHref && !callHref && <p className="text-slate-300">Enquiry options will appear here soon.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}