import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getPageMetadata } from "@/seo/tdk";
import { siteConfig } from "@/config/site";
import { TarforgeCalculator } from "@/page/tools/TarforgeCalculator";
import styles from "@/style/page/tools/tools.module.css";

export const metadata: Metadata = getPageMetadata("tarforge", "/tools/tarforge/");

export default function TarforgePage() {
  const canonical = `${siteConfig.url}/tools/tarforge/`;
  return <div className={`container ${styles.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Mortal Shell II Tarforge Calculator", url: canonical, applicationCategory: "GameApplication", description: "Calculate current-beta Mortal Shell II weapon Forge materials and Coin costs." }} />
    <Breadcrumbs items={[{ label: "Wiki", href: "/wiki/" }, { label: "Tarforge Calculator" }]} />
    <section className={styles.hero}><Image alt="Mortal Shell II weapon Forge artwork" fill priority sizes="100vw" src="/images/official/world.png" /><span className={styles.shade} /><div className={styles.heroInner}><p>Tools / Current Beta</p><h1>Mortal Shell II Tarforge Calculator</h1><div>Choose a weapon, current Forge level, and target level to calculate the listed materials and Coin required for the upgrade path.</div></div></section>
    <TarforgeCalculator />
    <p className={styles.note}>This calculator is intentionally limited to the verified weapon upgrade tables currently stored in the project. It does not infer missing values or claim that launch costs will remain unchanged.</p>
  </div>;
}
