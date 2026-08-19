import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { ArchiveExplorer } from "./ArchiveExplorer";
import type { WikiRecord } from "@/types/wiki";
import styles from "@/style/page/wiki/archive/archive.module.css";

type Props = {
  title: string;
  heading?: string;
  eyebrow: string;
  description: string;
  image: string;
  records: WikiRecord[];
  basePath: string;
  filterLabel: string;
  emptyLabel: string;
  parent?: { label: string; href: string };
  related?: Array<{ label: string; href: string }>;
  encounterQuickFilters?: boolean;
  canonicalPath?: string;
  recordPath?: string;
  fallbackImage?: string;
  fallbackImageAlt?: string;
  fallbackLabel?: string;
  media?: Array<{ image: string; alt: string; title: string; text: string }>;
};

export function ArchiveShell({ title, heading = title, eyebrow, description, image, records, basePath, filterLabel, emptyLabel, parent, related = [], encounterQuickFilters = false, canonicalPath = basePath, recordPath = basePath, fallbackImage, fallbackImageAlt, fallbackLabel, media = [] }: Props) {
  const canonical = `${siteConfig.url}${canonicalPath}/`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: heading,
    description,
    url: canonical,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: records.length,
      itemListElement: records.map((record, index) => ({ "@type": "ListItem", position: index + 1, name: record.name, url: `${siteConfig.url}${recordPath}/${record.id}/` })),
    },
  };
  return (
    <>
      <JsonLd data={schema} />
      <div className={styles.page}>
      <Breadcrumbs items={[...(parent ? [parent] : []), { label: title }]} />
      <section className={styles.hero}>
        <Image alt="" fill priority sizes="100vw" src={image} />
        <span />
        <div>
          <p>{eyebrow}</p>
          <h1>{heading}</h1>
          <div>{description}</div>
          <aside><Database size={17} /><strong>{records.length}</strong><span>entries</span></aside>
        </div>
      </section>
      {related.length ? <nav className={styles.related} aria-label="Related archives">{related.map((entry) => <Link href={entry.href} key={entry.href}>{entry.label}<ArrowRight size={13} /></Link>)}</nav> : null}
      {media.length ? <section className={styles.mediaStrip} aria-label="Encounter artwork">{media.map((entry) => <figure key={entry.image}><Image alt={entry.alt} fill sizes="(max-width: 768px) 100vw, 33vw" src={entry.image} /><figcaption><b>{entry.title}</b><span>{entry.text}</span></figcaption></figure>)}</section> : null}
      <ArchiveExplorer basePath={recordPath} emptyLabel={emptyLabel} encounterQuickFilters={encounterQuickFilters} fallbackImage={fallbackImage} fallbackImageAlt={fallbackImageAlt} fallbackLabel={fallbackLabel} filterLabel={filterLabel} records={records} />
      <p className={styles.evidenceNote}>Numbers match the 1.0 launch version.</p>
      </div>
    </>
  );
}
