import type { Metadata } from "next";
import { LegalPage } from "@/page/legal/LegalPage";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("copyright", "/legal/copyright/");

export default function CopyrightPage() {
  return <LegalPage page="copyright" />;
}
