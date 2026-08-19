import type { Metadata } from "next";
import { LegalPage } from "@/page/legal/LegalPage";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("privacyPolicy", "/legal/privacy-policy/");

export default function PrivacyPolicyPage() {
  return <LegalPage page="privacy-policy" />;
}
