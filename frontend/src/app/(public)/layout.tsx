import type { ReactNode } from "react";

import { SiteFooter } from "@/components/footer/site-footer";
import { SiteHeader } from "@/components/navbar/site-header";
import { getSiteContent } from "@/lib/api";

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