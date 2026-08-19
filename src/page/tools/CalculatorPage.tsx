import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getPageMetadata } from "@/seo/tdk";
import { siteConfig } from "@/config/site";
import { DamageCalculator } from "@/page/tools/DamageCalculator";
import styles from "@/style/page/tools/tools.module.css";

export const metadata: Metadata = getPageMetadata("calculator", "/tools/calculator/");

export default function CalculatorPage() {
  const canonical = `${siteConfig.url}/tools/calculator/`;
  return <div className={`container ${styles.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Mortal Shell II Damage and Stagger Calculator", url: canonical, applicationCategory: "GameApplication", description: "Calculate Mortal Shell II damage, stagger, and critical values at a selected Forge level." }} />
    <Breadcrumbs items={[{ label: "Tools", href: "/tools/" }, { label: "Damage & Stagger Calculator" }]} />
    <section className={styles.hero}><Image alt="Mortal Shell II weapon combat artwork" fill priority sizes="100vw" src="/images/official/world.png" /><span className={styles.shade} /><div className={styles.heroInner}><p>Tools / Weapon math</p><h1>Mortal Shell II Damage &amp; Stagger Calculator</h1><div>Choose a weapon and Forge level, enter a base value, and see how the listed level multiplier changes damage, stagger, and critical output.</div></div></section>
    <DamageCalculator />
    <p className={styles.note}>The result is a transparent scaling estimate based on the current weapon records. It is useful for planning upgrades, but it is not a substitute for a final-release combat formula.</p>
  </div>;
}
