import type { ReactNode } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getSiteContent } from "@/lib/site-content";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const content = await getSiteContent();

  return (
    <>
      <SiteHeader content={content} />
      {children}
      <SiteFooter content={content} />
    </>
  );
}