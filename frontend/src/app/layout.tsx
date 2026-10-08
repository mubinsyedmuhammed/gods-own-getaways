import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getSiteContent } from "@/lib/site-content";

import "./globals.css";

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
  const title = content.name.trim();
  return {
    title: title ? { default: title, template: `%s | ${title}` } : undefined,
    description: content.description || undefined,
    icons: content.settings.favicon ? { icon: content.settings.favicon } : undefined,
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 text-slate-50">{children}</body>
    </html>
  );
}
