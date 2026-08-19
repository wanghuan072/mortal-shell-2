import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Database } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import type { WikiRecord } from "@/types/wiki";
import { RecordReferenceSections } from "./RecordReferenceSections";
import styles from "@/style/page/wiki/archive/archive.module.css";

type Props = {
  record: WikiRecord;
  title: string;
  basePath: string;
  parent?: { label: string; href: string };
  related?: WikiRecord[];
};

const entityLabels: Record<string, string> = { Shells: "Shell", Sidearms: "Sidearm", Items: "Item", Artifacts: "Artifact", Tarstones: "Tarstone", Seals: "Seal", Skills: "Skill", "Status Effects": "Condition", Achievements: "Achievement" };
const layoutByTitle: Record<string, string> = {
  Items: "inventory",
  Artifacts: "inventory",
  Shells: "character",
  Tarstones: "gem",
  Skills: "skill",
  Seals: "seal",
  Sidearms: "firearm",
  "Status Effects": "condition",
  Achievements: "trophy",
};
const inspectLayouts = new Set(["inventory", "gem", "skill", "seal", "condition", "trophy"]);
const formatLabel = (label: string) => label
  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
  .replace(/[-_]/g, " ")
  .replace(/^./, (character) => character.toUpperCase());

const officialSources = [
  { label: "Launch database reference", href: "https://mortalshelldb.com/" },
  { label: "Official Open Beta listing", href: "https://store.steampowered.com/app/4711740/Mortal_Shell_II/" },
  { label: "Official game page", href: "https://www.playstack.com/games/mortalshell2/" },
];

const structuredByTitle: Record<string, string[]> = {
  Shells: ["abilities", "variants", "videos", "shades", "playable", "memory", "skillTree", "parentShell"],
  Seals: ["effects", "resourceRelations"],
  Tarstones: ["levels", "compatibleEquipment"],
  Artifacts: ["effects", "relationships", "upgrades"],
  Items: ["effects", "relationships"],
  Sidearms: ["progression", "attributes"],
  Skills: ["levels", "tooltips", "statusEffects"],
  "Status Effects": ["aliases", "related"],
  Achievements: ["entity", "note"],
};

const hiddenFactKeys = new Set([
  "slug", "id", "icon", "portrait", "art", "key", "glow", "narrative", "movesSource",
  "desc", "collectible", "videos", "shades", "playable", "memory", "abilities", "variants",
  "levels", "effects", "relationships", "compatibleEquipment", "progression", "tooltips",
  "skillTree", "parentShell", "attributes", "upgrades", "statusEffects", "resourceRelations",
  "aliases", "related", "entity",
]);

const tagKeys = new Set(["category", "rarity", "kind", "tier", "slot", "effectType", "family", "type", "owner", "ownerType", "ability", "role", "subName", "title", "alsoKnownAs", "hidden", "missable", "prologue", "platform", "lockedBySlayerSeal"]);
const copyKeys = new Set(["usage", "acquisition", "trigger", "activation", "effect", "unlock"]);

const displayPrimitive = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value)
    .replace(/^Extracted$/, "1.0 launch")
    .replace(/^Derived$/, "Calculated")
    .replace(/^Unverified$/, "Not confirmed");
};

export function ArchiveRecordPage({ record, title, basePath, parent, related = [] }: Props) {
  const entityLabel = entityLabels[title] ?? title;
  const canonical = `${siteConfig.url}${basePath}/${record.id}/`;
  const breadcrumbItems = [{ name: "Home", item: siteConfig.url }, ...(parent ? [{ name: parent.label, item: `${siteConfig.url}${parent.href}` }] : []), { name: title, item: `${siteConfig.url}${basePath}/` }, { name: record.name, item: canonical }];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `Mortal Shell II ${entityLabel} — ${record.name}`,
        description: record.seo.description,
        url: canonical,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        dateModified: record.updatedAt,
        image: `${siteConfig.url}${record.image ?? siteConfig.ogImage}`,
        author: { "@id": `${siteConfig.url}/#organization` },
        publisher: { "@id": `${siteConfig.url}/#organization` },
        about: { "@type": "VideoGame", name: "Mortal Shell II" },
        isBasedOn: officialSources.map((source) => ({ "@type": "WebPage", url: source.href })),
      },
      { "@type": "BreadcrumbList", itemListElement: breadcrumbItems.map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: entry.name, item: entry.item })) },
    ],
  };
  const structuredKeys = new Set(structuredByTitle[title] ?? []);
  const facts = Object.entries(record.details).flatMap(([label, value]) => {
    if (structuredKeys.has(label) || hiddenFactKeys.has(label)) return [];
    if (typeof value === "boolean" && !value && ["hidden", "missable", "prologue", "lockedBySlayerSeal"].includes(label)) return [];
    if (typeof value === "object") return [];
    const text = displayPrimitive(value);
    if (!text) return [];
    if (label === "category" && text === record.category) return [];
    return [{ label, text }];
  });
  const tags = facts.filter((fact) => tagKeys.has(fact.label));
  const notes = facts.filter((fact) => copyKeys.has(fact.label));
  const stats = facts.filter((fact) => !tagKeys.has(fact.label) && !copyKeys.has(fact.label));
  const layout = layoutByTitle[title] ?? "inventory";
  const inspect = inspectLayouts.has(layout);
  const indexRecords = title === "Status Effects" ? [record, ...related] : [record, ...related].slice(0, 12);

  return (
    <>
      <JsonLd data={schema} />
      <div className={styles.page} data-layout={layout}>
        <Breadcrumbs items={[...(parent ? [parent] : []), { label: title, href: `${basePath}/` }, { label: record.name }]} />
        <nav className={styles.detailActions} aria-label="Record navigation">
          <Link href={`${basePath}/`}><ArrowLeft size={14} /> All {title}</Link>
          <p>{related.length + 1} records</p>
          {indexRecords.map((entry, index) => <Link aria-current={entry.id === record.id ? "page" : undefined} href={`${basePath}/${entry.id}/`} key={entry.id}>
            {entry.image ? <Image alt="" width={56} height={48} src={entry.image} /> : <Database size={16} />}
            <span><b>{entry.name}</b><small>{String(index + 1).padStart(2, "0")} · {entry.category.split(" · ")[0]}</small></span>
            <ArrowRight size={13} />
          </Link>)}
        </nav>
        <article className={styles.detailRecord}>
          {inspect ? (
            <header className={styles.inspectHeader}>
              {record.image ? <figure><Image alt={`${record.name} artwork`} height={220} src={record.image} width={220} /></figure> : layout === "condition" ? <figure className={styles.conditionMark}><b>{record.name.slice(0, 1)}</b><span>Condition</span></figure> : <figure className={styles.missingArtwork}><Database size={28} /><span>No icon</span></figure>}
              <div>
                <p>{entityLabel} / {record.category}</p>
                <h1>{record.name}</h1>
                {record.description ? <div className={styles.heroQuote}>{record.description}</div> : null}
                {tags.length ? <div className={styles.profileTags}>{tags.map((fact) => <span key={fact.label}><small>{formatLabel(fact.label)}</small><b>{fact.text}</b></span>)}</div> : null}
              </div>
            </header>
          ) : (
            <header className={styles.recordHeader} data-has-artwork={record.image ? true : undefined}>
              {record.image ? <Image alt={`${record.name} artwork`} fill priority sizes="(max-width: 1024px) 100vw, 70vw" src={record.image} /> : null}
              <span className={styles.heroShade} />
              <div>
                <p>{entityLabel} details / {record.category}</p>
                <h1>{record.name}</h1>
                {record.description ? <div className={styles.heroQuote}>“{record.description}”</div> : null}
              </div>
            </header>
          )}
          <div className={styles.detailBody}>
            {!inspect && tags.length ? <div className={styles.profileTags}>{tags.map((fact) => <span key={fact.label}><small>{formatLabel(fact.label)}</small><b>{fact.text}</b></span>)}</div> : null}
            {stats.length ? <div className={styles.statTiles}>{stats.map((fact) => <article key={fact.label}><small>{formatLabel(fact.label)}</small><b>{fact.text}</b></article>)}</div> : null}
            {notes.length ? <div className={styles.fieldNotes}>{notes.map((fact) => <p key={fact.label}><small>{formatLabel(fact.label)}</small>{fact.text}</p>)}</div> : null}
          </div>
        </article>
        <div className={styles.referenceStack}><RecordReferenceSections record={record} title={title} /></div>
      </div>
    </>
  );
}
