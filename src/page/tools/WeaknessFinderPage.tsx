import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Crosshair } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { enemyArchive } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";
import { siteConfig } from "@/config/site";
import { WeaknessFinder, type WeaknessRecord } from "@/page/tools/WeaknessFinder";
import styles from "@/style/page/tools/tools.module.css";

const values = (value: unknown) => value && typeof value === "object" && "values" in value && Array.isArray((value as { values?: unknown }).values) ? (value as { values: unknown[] }).values.map(String) : [];

const records: WeaknessRecord[] = enemyArchive.map((record) => {
  const profile = record.details.combatProfile && typeof record.details.combatProfile === "object" ? record.details.combatProfile as { vulnerableTo?: unknown; resists?: unknown } : {};
  return { id: record.id, name: record.name, category: record.category, weakTo: values(profile.vulnerableTo), resists: values(profile.resists), status: record.status };
});

export const metadata: Metadata = getPageMetadata("weaknessFinder", "/tools/weakness-finder/");

export default function WeaknessFinderPage() {
  const canonical = `${siteConfig.url}/tools/weakness-finder/`;
  return <div className={`container ${styles.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Mortal Shell II Weakness Finder", url: canonical, applicationCategory: "GameApplication", description: "Mortal Shell II Weakness Finder: enemy and Boss weaknesses, damage types, and resistances. 1.0 launch version." }} />
    <Breadcrumbs items={[{ label: "Tools", href: "/tools/" }, { label: "Weakness Finder" }]} />
    <section className={styles.hero}><Image alt="A Tar Golem battle in Mortal Shell II" fill priority sizes="100vw" src="/images/encounters/tar-golem-battle.jpg" /><span className={styles.shade} /><div className={styles.heroInner}><p>Tools / Bestiary</p><h1>Mortal Shell II Weakness Finder</h1><div>Choose a damage type and rank enemies and Bosses by what they resist least, using 1.0 launch resistance records.</div></div></section>
    <WeaknessFinder records={records} />
    <p className={styles.note}><Crosshair size={14} /> Weaknesses are derived from the current resistance fields. The <Link href="/wiki/status-effects/">status effects</Link> page covers Bloodcurse, Frost, Curse, Lightning, and Trauma wording. They are a planning aid, not a promise that the final combat formula will stay unchanged.</p>
  </div>;
}
