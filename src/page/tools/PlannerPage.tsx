import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getPageMetadata } from "@/seo/tdk";
import { siteConfig } from "@/config/site";
import { BuildPlanner } from "@/page/tools/BuildPlanner";
import styles from "@/style/page/tools/tools.module.css";

export const metadata: Metadata = getPageMetadata("planner", "/tools/planner/");

export default function PlannerPage() {
  const canonical = `${siteConfig.url}/tools/planner/`;
  return <div className={`container ${styles.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Mortal Shell II Build Planner", url: canonical, applicationCategory: "GameApplication", description: "Mortal Shell II build planner: Shell, weapon, sidearm, Seal, and Tarstone loadouts with a shareable link." }} />
    <Breadcrumbs items={[{ label: "Tools", href: "/tools/" }, { label: "Build Planner" }]} />
    <section className={styles.hero}><Image alt="Mortal Shell II Shell and weapon loadout artwork" fill priority sizes="100vw" src="/images/official/shell.png" /><span className={styles.shade} /><div className={styles.heroInner}><p>Tools / Build planning</p><h1>Mortal Shell II Build Planner</h1><div>Assemble a full loadout, set the primary weapon level, and copy a link that rebuilds the exact setup.</div></div></section>
    <BuildPlanner />
    <p className={styles.note}>Planner options reflect the records currently available in the Open Beta data. A planned loadout is a snapshot, not a claim that every combination is available in the final release.</p>
  </div>;
}
