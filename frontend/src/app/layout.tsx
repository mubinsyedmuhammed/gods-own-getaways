import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { FloatingWhatsAppButton } from "@/components/whatsapp/floating-whatsapp-button";
import { getSiteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/api";

import "./globals.css";

export const revalidate = 300;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const title = content.name.trim() || "Travel experiences";
  const siteUrl = getSiteUrl();
  return {
    metadataBase: siteUrl,
    title: { default: title, template: `%s | ${title}` },
    description: content.description || content.tagline || "Discover carefully curated journeys, destinations, and travel experiences.",
    openGraph: {
      type: "website",
      siteName: title,
      title,
      description: content.description || content.tagline || "Discover carefully curated journeys, destinations, and travel experiences.",
      ...(siteUrl ? { url: siteUrl } : {}),
      ...(content.settings.logo ? { images: [{ url: content.settings.logo, alt: title }] } : {}),
    },
    twitter: {
      card: content.settings.logo ? "summary_large_image" : "summary",
      title,
      description: content.description || content.tagline || "Discover carefully curated journeys, destinations, and travel experiences.",
      ...(content.settings.logo ? { images: [content.settings.logo] } : {}),
    },
    icons: content.settings.favicon ? { icon: content.settings.favicon } : undefined,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 text-slate-50">
        {children}
        <FloatingWhatsAppButton number={content.contact.whatsappNumber} companyName={content.name} />
      </body>
    </html>
  );
}
