import type { Metadata } from "next";
import { LegalPage } from "@/page/legal/LegalPage";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("aboutUs", "/legal/about-us/");

export default function AboutUsPage() {
  return <LegalPage page="about-us" />;
}
