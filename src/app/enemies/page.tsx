import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { archiveCounts, enemyRecords } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("enemies", "/enemies/");

export default function EnemiesPage() {
  return <ArchiveShell
    title="Enemies"
    heading="Mortal Shell II Enemies - HP, Poise, and Resistances"
    eyebrow={`${enemyRecords.length} enemies · ${archiveCounts.minibosses} Minibosses · 1.0 launch`}
    description="Every enemy's HP, poise, and resistances from the 1.0 launch version. Filter by family or Miniboss, then open a record for attacks and rewards."
    image="/images/wiki/enemies.webp"
    basePath="/enemies"
    records={enemyRecords}
    filterLabel="Enemy family"
    emptyLabel="No enemies match these filters"
    encounterQuickFilters
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "Bosses", href: "/bosses/" }, { label: "Status Effects", href: "/wiki/status-effects/" }, { label: "Weakness Finder", href: "/tools/weakness-finder/" }]}
    fallbackLabel="Image not available"
  />;
}
