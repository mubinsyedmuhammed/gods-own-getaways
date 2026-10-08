import { whatsappUrl } from "@/lib/utils";

export function FloatingWhatsAppButton({
  number,
  companyName,
}: {
  number: string;
  companyName: string;
}) {
  const href = whatsappUrl(number, `Hello ${companyName || "there"}, I would like to plan a trip.`);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-3 right-3 z-50 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-black/30 transition hover:bg-emerald-400 sm:bottom-5 sm:right-5 sm:min-h-14 sm:px-5 sm:py-3 sm:text-base"
    >
      <span aria-hidden="true" className="text-xl">◉</span>
      WhatsApp
    </a>
  );
}
