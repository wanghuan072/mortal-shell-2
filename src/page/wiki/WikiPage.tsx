import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Database, FlaskConical, Gem, Shield, Skull, Swords, Trophy } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionTitle } from "@/components/SectionTitle";
import { archiveCounts, DATA_STATUS } from "@/lib/data/wiki";
import { researchNotes, siteConfig, wikiCategories } from "@/config/site";
import { getPageMetadata } from "@/seo/tdk";
import styles from "@/style/page/wiki/wiki.module.css";

export const metadata: Metadata = getPageMetadata("wiki", "/wiki/");

const wikiIcons: Record<string, typeof Database> = {
  "/enemies/": Skull,
  "/wiki/sidearms/": Swords,
  "/wiki/items/": Database,
  "/wiki/artifacts/": Gem,
  "/wiki/tarstones/": Gem,
  "/wiki/skills/": Swords,
  "/wiki/seals/": Shield,
  "/wiki/status-effects/": FlaskConical,
  "/wiki/achievements/": Trophy,
};

const stats = [
  { label: "Enemies", value: String(archiveCounts.enemyVariants), note: `${archiveCounts.minibosses} Minibosses`, icon: Skull },
  { label: "Sidearms", value: String(archiveCounts.sidearms), note: "1.0 launch equipment", icon: Swords },
  { label: "Tarstones", value: String(archiveCounts.tarstones), note: `${archiveCounts.artifacts} Artifacts`, icon: Gem },
  { label: "Skills", value: String(archiveCounts.skills), note: `${archiveCounts.seals} Seals`, icon: FlaskConical },
];

const wikiColumns = [wikiCategories.slice(0, 5), wikiCategories.slice(5)];

export default function WikiPage() {
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Mortal Shell II Wiki", url: `${siteConfig.url}/wiki/`, description: "Mortal Shell II Wiki: enemies, items, Artifacts, Tarstones, skills, Seals, status effects, and achievements. 1.0 launch version.", isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className={styles.hero}>
        <Image alt="A black-armored knight beneath a full moon" fill priority sizes="100vw" src="/images/official/mortal-shell-ii-hero-v2.png" />
        <span className={styles.heroShade} />
        <div className={styles.heroInner}>
          <Breadcrumbs items={[{ label: "Wiki" }]} />
          <div className={styles.heroCopy}><p><Link href="/enemies/">Enemies</Link>, <Link href="/wiki/items/">items</Link>, <Link href="/wiki/tarstones/">Tarstones</Link>, <Link href="/wiki/skills/">skills</Link>, and <Link href="/wiki/achievements/">achievements</Link></p><h1>Mortal Shell II Wiki - Enemies, Items, Skills, and More</h1><div>Find the page you need for an <Link href="/enemies/">enemy</Link>, <Link href="/wiki/items/">item</Link>, <Link href="/wiki/tarstones/">Tarstone</Link>, <Link href="/wiki/skills/">skill</Link>, <Link href="/wiki/seals/">Seal</Link>, <Link href="/wiki/status-effects/">status effect</Link>, or <Link href="/wiki/achievements/">achievement</Link>. Wiki numbers match the 1.0 launch version.</div></div>
          <div className={styles.stats}>{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label}><Icon size={21} /><span><small>{stat.label}</small><strong>{stat.value}</strong><em>{stat.note}</em></span></div>; })}</div>
        </div>
      </section>

      <div className={styles.layout}>
        <div>
          <section className={styles.searchBanner} data-archive-navigator aria-label="Wiki archive navigator">
            <Database size={18} />
            <div><small>Archive navigator</small><p><Link href="/enemies/">Enemies</Link>, <Link href="/wiki/artifacts/">artifacts</Link>, and <Link href="/wiki/tarstones/">Tarstones</Link> use the 1.0 launch records.</p></div>
            <Link href="/enemies/">Browse enemies <ArrowRight size={14} /></Link>
          </section>
          <section data-archive-categories aria-labelledby="categories-heading"><SectionTitle title="Browse the archive" /><h2 className="sr-only" id="categories-heading">Wiki categories</h2><div className={styles.categoryGrid}>{wikiCategories.map((category) => <Link className={styles.categoryCard} href={category.href} key={category.title}><Image alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" src={category.image} /><span className={styles.cardShade} /><div><small>{category.eyebrow}</small><h2>{category.title}</h2><p>{category.description}</p></div><ArrowRight size={18} /></Link>)}</div></section>

          <section className={styles.dataDigest} id="archive">
            <SectionTitle title="What you can find" />
            <div className={styles.digestStats}>
              <span><b>{archiveCounts.items}</b> items</span><span><b>{archiveCounts.artifacts}</b> Artifacts</span><span><b>{archiveCounts.tarstones}</b> Tarstones</span><span><b>{archiveCounts.skills}</b> skills</span>
            </div>
            <div className={styles.digestGrid}>
              {wikiColumns.map((column, index) => (
                <div key={index}>
                  <h3>{index === 0 ? "Encounters and items" : "Skills and reference"}</h3>
                  {column.map((entry) => {
                    const Icon = wikiIcons[entry.href] ?? Database;
                    return <article key={entry.href}><Icon size={15} /><span><b>{entry.title}</b><small>{entry.description}</small></span><Link href={entry.href} aria-label={`Open ${entry.title}`}><ArrowRight size={13} /></Link></article>;
                  })}
                </div>
              ))}
            </div>
          </section>

        </div>

        <aside className={styles.sidebar}>
          <section><SectionTitle title="Popular starting points" />{wikiCategories.map((category) => <Link href={category.href} key={category.href}><span>{category.title}</span><ArrowRight size={14} /></Link>)}</section>
          <section><SectionTitle title="Latest updates" href="/updates/" />{researchNotes.map((note) => <article key={note.title}><small>{note.label}</small><b>{note.title}</b><time dateTime={note.date}>{note.date}</time></article>)}</section>
          <section className={styles.policy} id="methodology"><small>Page key</small><SectionTitle title="Record status" /><dl><div><dt>{DATA_STATUS}</dt><dd>Numbers match the 1.0 launch version of the game.</dd></div><div><dt>Official</dt><dd>Published by Cold Symmetry or Playstack.</dd></div></dl></section>
        </aside>
      </div>
    </>
  );
}
