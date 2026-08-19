import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Database, FileCheck2, Layers3, Swords } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionTitle } from "@/components/SectionTitle";
import { WeaponExplorer } from "@/page/wiki/components/WeaponExplorer";
import { archiveCounts } from "@/lib/data/wiki";
import { siteConfig } from "@/config/site";
import { weapons } from "@/lib/data/weapons";
import { getPageMetadata } from "@/seo/tdk";
import styles from "@/style/page/wiki/weapons/weapons.module.css";

export const metadata: Metadata = getPageMetadata("weapons", "/weapons/");

export default async function WeaponsPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mortal Shell II Weapons",
    url: `${siteConfig.url}/weapons/`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: weapons.length,
      itemListElement: weapons.map((weapon, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: weapon.name,
        url: `${siteConfig.url}/weapons/${weapon.slug}/`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className={styles.hero}>
        <Image alt="A Shell wielding a scythe against a spindly enemy" fill priority sizes="100vw" src="/images/wiki/weapons.webp" />
        <span className={styles.heroShade} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={[{ label: "Weapons" }]} />
          <div className={styles.heroCopy}>
            <p>Melee arms and upgrade scaling</p>
            <h1>Mortal Shell II Weapons - Moves, Skills, and Forge Upgrades</h1>
            <div>Compare all {weapons.length} melee weapons from the 1.0 launch version, including upgrade scaling, <Link href="/wiki/skills/">skills</Link>, <Link href="/wiki/tarstones/">Tarstone</Link> options, and the <Link href="/wiki/status-effects/">status effects</Link> they can apply.</div>
          </div>
          <div className={styles.heroStats}>
            <div><Swords size={20} /><span><strong>{weapons.length}</strong><small>Melee weapons</small></span></div>
            <div><FileCheck2 size={20} /><span><strong>{archiveCounts.sidearms}</strong><small><Link href="/wiki/sidearms/">Sidearms</Link></small></span></div>
            <div><Layers3 size={20} /><span><strong>1.0</strong><small>Launch scaling</small></span></div>
          </div>
        </div>
      </section>

      <div className={styles.pageLayout}>
        <div>
          <nav className={styles.tabs} aria-label="Weapon views">
            <span className={styles.activeTab}><Database size={15} /> Primary weapons</span>
            <Link href="/wiki/sidearms/">Sidearms</Link>
            <Link href="/wiki/tarstones/">Tarstones</Link>
            <Link href="/wiki/status-effects/">Status Effects</Link>
          </nav>
          <WeaponExplorer initialQuery={initialQuery} weapons={weapons} />
        </div>

        <aside className={styles.sidebar}>
          <section>
            <SectionTitle title="Weapon picks" />
            {weapons.slice(0, 4).map((weapon) => (
              <Link className={styles.popularRow} href={`/weapons/${weapon.slug}/`} key={weapon.slug}>
                <Image alt="" width={72} height={45} src={weapon.image} />
                <span><b>{weapon.name}</b><small>{weapon.type}</small></span>
              </Link>
            ))}
          </section>
          <section id="methodology">
            <SectionTitle title="What can change" />
            <p className={styles.sideCopy}>Upgrade multipliers match the 1.0 launch version. Pickup locations on the map may still be aligned after launch.</p>
            <div className={styles.statusPills}><span>{weapons.length} weapon records</span><span>1.0 launch</span><span>Upgrade scaling</span><span>Locations may change</span></div>
          </section>
          <section>
            <SectionTitle title="Keep exploring" />
            <Link className={styles.guideRow} href="/wiki/sidearms/"><span>Sidearms</span><ArrowRight size={14} /></Link>
            <Link className={styles.guideRow} href="/wiki/tarstones/"><span>Tarstones</span><ArrowRight size={14} /></Link>
            <Link className={styles.guideRow} href="/wiki/status-effects/"><span>Status effects</span><ArrowRight size={14} /></Link>
          </section>
        </aside>
      </div>
    </>
  );
}
