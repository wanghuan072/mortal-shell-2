import type { Metadata } from "next";
import { LegalPage } from "@/page/legal/LegalPage";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("contactUs", "/legal/contact-us/");

export default function ContactUsPage() {
  return <LegalPage page="contact-us" />;
}
