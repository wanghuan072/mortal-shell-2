import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, HeartPulse, ShieldCheck, Skull, Sparkles, Target } from "lucide-react";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SectionTitle } from "@/components/SectionTitle";
import { WikiLocationCard, WikiMediaCard, WikiMediaGrid } from "@/components/WikiMediaCard";
import { StatusEffectLink } from "@/components/StatusEffectLink";
import { siteConfig } from "@/config/site";
import { achievementPath, achievements } from "@/lib/data/achievements";
import { enemyArchive, findArchiveRecord, itemArchive } from "@/lib/data/wiki";
import { getRecordMetadata } from "@/seo/tdk";
import styles from "@/style/page/wiki/wiki.module.css";

type PageProps = { params: Promise<{ slug: string }> };
type MeasuredValue = { value?: unknown; provenance?: unknown };
type EncounterDetails = {
  kind?: unknown;
  classification?: unknown;
  family?: unknown;
  core?: Record<string, MeasuredValue>;
  resistances?: Record<string, MeasuredValue>;
  statusDamage?: Record<string, MeasuredValue>;
  misc?: Record<string, MeasuredValue>;
  damageDealt?: Record<string, MeasuredValue>;
  movement?: Record<string, MeasuredValue>;
  onDeath?: Record<string, MeasuredValue>;
  armor?: unknown;
  region?: unknown;
  combatProfile?: { vulnerableTo?: { values?: unknown }; resists?: { values?: unknown } };
  attacks?: { entries?: unknown } | unknown[];
  drops?: { values?: unknown };
  regions?: { values?: unknown };
  encounterLocations?: { values?: unknown };
  dropsAndRewards?: { values?: unknown };
};

const statusTone = (status: string) => status.toLowerCase().includes("unconfirmed") || status.toLowerCase().includes("not confirmed") ? "unconfirmed" : "reviewed";
const displayStatus = (status: string) => status
  .replace("Extracted / Unconfirmed", "Unconfirmed")
  .replace("Current Beta / Unconfirmed", "Unconfirmed")
  .replace("Verified in Open Beta data", "1.0 launch")
  .replace("Launch reference", "1.0 launch")
  .replace(/^Verified$/, "1.0 launch");
const titleCase = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
const toText = (value: unknown, fallback = "Not recorded") => value === null || value === undefined || value === "" ? fallback : String(value);
const measured = (value: MeasuredValue | undefined) => toText(value?.value);
const detailStatus = (value: MeasuredValue | undefined) => toText(value?.provenance, "Not confirmed")
  .replace(/^Extracted$/, "1.0 launch")
  .replace(/^Derived$/, "Calculated")
  .replace(/^Reference$/, "1.0 launch")
  .replace(/^Unverified$/, "Not confirmed");
const numeric = (value: MeasuredValue | undefined) => {
  const number = Number(value?.value);
  return Number.isFinite(number) ? number : null;
};
const values = (value: { values?: unknown } | undefined) => Array.isArray(value?.values) ? value.values.map(String).filter(Boolean) : [];
const entries = (value: unknown) => Array.isArray(value) ? value.map(String).filter(Boolean) : [];
const metricRows = (value: Record<string, MeasuredValue> | undefined) => Object.entries(value ?? {})
  .filter(([, metric]) => numeric(metric) !== null);

export function generateStaticParams() { return enemyArchive.map((record) => ({ slug: record.id })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findArchiveRecord(enemyArchive, (await params).slug);
  if (!record) return {};
  return getRecordMetadata(record.seo, `/enemies/${record.id}/`);
}

export default async function EnemyDetailPage({ params }: PageProps) {
  const record = findArchiveRecord(enemyArchive, (await params).slug);
  if (!record) notFound();

  const details = record.details as EncounterDetails;
  const family = toText(details.family, record.category.split(" · ")[0]);
  const classification = toText(details.kind ?? details.classification, record.category.split(" · ")[1] ?? "Encounter");
  const health = details.core?.health;
  const poise = details.core?.poise;
  const resistances = Object.entries(details.resistances ?? {}).filter(([, value]) => numeric(value) !== null);
  const weakTo = values(details.combatProfile?.vulnerableTo);
  const resistantTo = values(details.combatProfile?.resists);
  const regions = values(details.regions ?? details.encounterLocations);
  const drops = values(details.drops ?? details.dropsAndRewards);
  const attackEntries = "entries" in (details.attacks ?? {}) ? entries((details.attacks as { entries?: unknown }).entries) : entries(details.attacks);
  const intro = record.description;
  const fieldValues = [
    ["Stone stun", details.misc?.stoneStunSeconds, "s"],
    ["Knockback", details.misc?.knockback, ""],
    ["Riposte weakness", details.misc?.riposteWeakness, "×"],
    ["Poison damage", details.statusDamage?.poisonDamage, ""],
    ["Poison duration", details.statusDamage?.poisonDuration, "s"],
  ] as const;
  const extractedConditions = fieldValues.filter(([, value]) => numeric(value) !== null);
  const combatReadout = [
    ["Damage output", metricRows(details.damageDealt)],
    ["Movement", metricRows(details.movement)],
    ["Rewards", metricRows(details.onDeath)],
  ] as const;
  const hasCombatReadout = combatReadout.some(([, rows]) => rows.length > 0);
  const encounterLabel = family === classification ? family : `${family} · ${classification}`;
  const familyVariants = details.family
    ? enemyArchive.filter((candidate) => (candidate.details as EncounterDetails).family === details.family)
    : [];
  const linkedAchievements = achievements.filter((entry) => entry.entity?.slug === record.id || entry.entity?.name === record.name || (record.name.length > 4 && entry.description.toLowerCase().includes(record.name.toLowerCase())));
  const gloomItem = itemArchive.find((entry) => entry.id === "gloom" || entry.name.toLowerCase() === "gloom");
  const goldItem = itemArchive.find((entry) => entry.id === "coin" || entry.id === "gold" || entry.name.toLowerCase() === "coin" || entry.name.toLowerCase() === "gold");
  const rewardCards = [
    numeric(details.onDeath?.gloom) !== null && gloomItem
      ? { title: gloomItem.name, body: measured(details.onDeath?.gloom), href: `/wiki/items/${gloomItem.id}/`, image: gloomItem.image, meta: "Currency" }
      : null,
    numeric(details.onDeath?.coin) !== null && goldItem
      ? { title: goldItem.name, body: details.onDeath?.coinDropChance ? `${measured(details.onDeath?.coin)} · ${measured(details.onDeath?.coinDropChance)} chance` : measured(details.onDeath?.coin), href: `/wiki/items/${goldItem.id}/`, image: goldItem.image, meta: "Currency" }
      : null,
  ].filter((entry) => entry !== null);
  const hasEncounterIntel = regions.length || drops.length || rewardCards.length;
  const hasCombatProfile = weakTo.length || resistantTo.length || numeric(details.misc?.riposteWeakness) !== null || attackEntries.length;
  const hasVitalStats = numeric(health) !== null || numeric(poise) !== null || numeric(details.misc?.tarstoneExp) !== null;
  const canonical = `${siteConfig.url}/enemies/${record.id}/`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `Mortal Shell II ${classification} — ${record.name}`,
        description: record.seo.description,
        url: canonical,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        dateModified: record.updatedAt,
        image: `${siteConfig.url}${siteConfig.ogImage}`,
        author: { "@id": `${siteConfig.url}/#organization` },
        publisher: { "@id": `${siteConfig.url}/#organization` },
        about: { "@type": "VideoGame", name: "Mortal Shell II" },
      },
      { "@type": "BreadcrumbList", itemListElement: [{ name: "Home", item: siteConfig.url }, { name: "Enemies", item: `${siteConfig.url}/enemies/` }, { name: record.name, item: canonical }].map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: entry.name, item: entry.item })) },
    ],
  };

  return <div className={styles.page} data-encounter-dossier>
    <JsonLd data={schema} />
    <Breadcrumbs items={[{ label: "Enemies", href: "/enemies/" }, { label: record.name }]} />
    <div className={styles.layout}>
      <article className={styles.dataDigest}>
        <header className={styles.hero} data-empty-vitals={hasVitalStats ? undefined : true} data-has-artwork={record.image ? true : undefined}>
          {record.image ? <Image alt={`${record.name} enemy render`} className={styles.enemyRender} fill priority sizes="(max-width: 768px) 70vw, 420px" src={record.image} /> : null}
          <span />
          <div className={styles.heroCopy}>
            <p>Encounter dossier / {family}</p>
            <h1>{record.name}</h1>
            {intro ? <div>{intro}</div> : null}
            <span className={styles.digestNote} data-tone={statusTone(record.status)}>{displayStatus(record.status)}</span>
          </div>
          {hasVitalStats ? <div className={styles.stats}>
            {numeric(health) !== null ? <div><HeartPulse size={17} /><span><small>Health</small><strong>{measured(health)}</strong><em>{detailStatus(health)}</em></span><progress max={1750} value={numeric(health) ?? 0} /></div> : null}
            {numeric(poise) !== null ? <div><ShieldCheck size={17} /><span><small>Poise</small><strong>{measured(poise)}</strong><em>{detailStatus(poise)}</em></span><progress max={200} value={numeric(poise) ?? 0} /></div> : null}
            {numeric(details.misc?.tarstoneExp) !== null ? <div><Sparkles size={17} /><span><small>Reward</small><strong>{measured(details.misc?.tarstoneExp)}</strong><em>{detailStatus(details.misc?.tarstoneExp)}</em></span></div> : null}
          </div> : null}
        </header>

        <nav className={styles.searchBanner} aria-label="Encounter navigation">
          <Link href="/enemies/"><ArrowLeft size={14} /> All encounters</Link>
          <p>{encounterLabel} · {enemyArchive.length} recorded encounters</p>
        </nav>

        {resistances.length || hasCombatProfile ? <section className={styles.digestGrid}>
          {resistances.length ? <div>
            <SectionTitle title="Resistance profile" />
            {resistances.map(([label, value]) => <article key={label}><span><b><StatusEffectLink appearance="inline" label={label}>{titleCase(label)}</StatusEffectLink></b><small>{measured(value)} · {detailStatus(value)}</small></span><progress max={150} value={numeric(value) ?? 0} /></article>)}
          </div> : null}
          {hasCombatProfile ? <div>
            <SectionTitle title="Combat profile" />
            {weakTo.length ? <article className={styles.profileChips}><Target size={16} /><span><b>Vulnerable to</b><span className={styles.chipRow}>{weakTo.map((entry) => <StatusEffectLink key={entry} label={entry} />)}</span></span></article> : null}
            {resistantTo.length ? <article className={styles.profileChips}><ShieldCheck size={16} /><span><b>Resists</b><span className={styles.chipRow}>{resistantTo.map((entry) => <StatusEffectLink key={entry} label={entry} />)}</span></span></article> : null}
            {numeric(details.misc?.riposteWeakness) !== null ? <article><Skull size={16} /><span><b>Riposte weakness</b><small>{measured(details.misc?.riposteWeakness)}× · {detailStatus(details.misc?.riposteWeakness)}</small></span></article> : null}
            {attackEntries.length ? <article><Sparkles size={16} /><span><b>Known attacks</b><small>{attackEntries.length} listed attacks</small></span></article> : null}
          </div> : null}
        </section> : null}

        {attackEntries.length ? <section className={styles.artifactRows} data-encounter-attacks>
          <h3>Known attacks</h3>
          <div>{attackEntries.map((entry) => {
            const [name, weight, poise] = entry.split(" · ");
            return <article key={entry}><b>{name}</b><span>{poise ?? "Attack data"}</span>{weight ? <em>{weight}</em> : null}</article>;
          })}</div>
        </section> : null}

        {hasCombatReadout ? <section className={styles.artifactRows} data-encounter-readout>
          {combatReadout.filter(([, rows]) => rows.length > 0).map(([heading, rows]) => <div key={heading}>
            <h3>{heading}</h3>
            <dl>{rows.map(([label, value]) => <div key={label}><dt>{titleCase(label)}</dt><dd>{measured(value)}</dd></div>)}</dl>
          </div>)}
        </section> : null}

        {extractedConditions.length ? <section className={styles.artifactRows} data-encounter-conditions>
          <h3>Control &amp; attrition</h3>
          <div>{extractedConditions.map(([label, value, suffix]) => <article key={label}>
            <small>{label.toLowerCase().includes("poison") ? <StatusEffectLink appearance="inline" label="poison">{label}</StatusEffectLink> : label}</small><b>{measured(value)}{suffix}</b><em>{detailStatus(value)}</em>
          </article>)}</div>
        </section> : null}

        {hasEncounterIntel ? <section className={styles.artifactRows} data-encounter-intelligence>
          <h3>Encounter intelligence</h3>
          {regions.length ? <WikiLocationCard body={regions.join(" · ")} href={`/map/?q=${encodeURIComponent(record.name)}`} hrefLabel="Open location map" title={record.name} /> : null}
          {rewardCards.length ? <WikiMediaGrid>{rewardCards.map((entry) => <WikiMediaCard body={entry.body} href={entry.href} image={entry.image} key={entry.title} meta={entry.meta} title={entry.title} />)}</WikiMediaGrid> : null}
          {drops.length ? <WikiMediaGrid>{drops.map((entry) => {
            const linked = itemArchive.find((item) => item.name.toLowerCase() === entry.toLowerCase() || item.id === entry);
            return <WikiMediaCard body={linked?.description} href={linked ? `/wiki/items/${linked.id}/` : undefined} image={linked?.image} key={entry} meta={linked?.category ?? "Drop"} title={entry} />;
          })}</WikiMediaGrid> : null}
        </section> : null}

        {linkedAchievements.length ? <section className={styles.artifactRows}>
          <h3>Achievements</h3>
          <WikiMediaGrid>
            {linkedAchievements.map((entry) => <WikiMediaCard body={entry.description} href={achievementPath(entry.slug)} image={entry.icon} key={entry.slug} meta={entry.category ?? "Achievement"} title={entry.name} />)}
          </WikiMediaGrid>
        </section> : null}

        {familyVariants.length > 1 ? <section className={styles.artifactRows} data-family-comparison>
          <h3>{family} variants</h3>
          <div>
            <table>
              <thead><tr><th>Variant</th><th>Class</th><th>Health</th><th>Poise</th><th>Break</th><th>Parry</th></tr></thead>
              <tbody>{familyVariants.map((variant) => {
                const variantDetails = variant.details as EncounterDetails;
                return <tr key={variant.id} data-current={variant.id === record.id || undefined}>
                  <th scope="row"><Link className={styles.variantLink} href={`/enemies/${variant.id}/`}>{variant.image ? <Image alt="" height={40} src={variant.image} width={40} /> : <span className={styles.variantMark}>{variant.name.slice(0, 1)}</span>}{variant.name}</Link></th>
                  <td>{toText(variantDetails.classification, "—")}</td>
                  <td>{measured(variantDetails.core?.health)}</td>
                  <td>{measured(variantDetails.core?.poise)}</td>
                  <td>{measured(variantDetails.resistances?.break)}</td>
                  <td>{measured(variantDetails.resistances?.parry)}</td>
                </tr>;
              })}</tbody>
            </table>
          </div>
        </section> : null}
      </article>
      {familyVariants.length > 1 ? <aside className={styles.encounterRoster} aria-label={`${family} variants`}>
        <section>
          <p>{family}</p>
          {familyVariants.map((variant) => {
            const variantDetails = variant.details as EncounterDetails;
            return <Link aria-current={variant.id === record.id ? "page" : undefined} href={`/enemies/${variant.id}/`} key={variant.id}>
              {variant.image ? <Image alt="" height={48} src={variant.image} width={48} /> : <span className={styles.variantMark}>{variant.name.slice(0, 1)}</span>}
              <span><b>{variant.name}</b><small>{toText(variantDetails.classification, classification)} · {measured(variantDetails.core?.health)} HP</small></span>
            </Link>;
          })}
        </section>
      </aside> : null}
    </div>
  </div>;
}
