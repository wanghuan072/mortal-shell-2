import type { Metadata } from "next";
import { LegalPage } from "@/page/legal/LegalPage";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("termsOfService", "/legal/terms-of-service/");

export default function TermsOfServicePage() {
  return <LegalPage page="terms-of-service" />;
}
