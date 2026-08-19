import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { archiveCounts, bossRecords } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("bosses", "/bosses/");

export default function BossesPage() {
  return <ArchiveShell
    title="Bosses"
    heading="Mortal Shell II Bosses - Stats and Weaknesses"
    eyebrow={`${archiveCounts.bosses} Bosses · 1.0 launch`}
    description="Boss stats and weaknesses from the 1.0 launch version. Compare health, poise, resistances, and attacks."
    image="/images/wiki/bosses.webp"
    basePath="/bosses"
    canonicalPath="/bosses"
    recordPath="/enemies"
    records={bossRecords}
    filterLabel="Encounter type"
    emptyLabel="No Bosses match these filters"
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "All enemies", href: "/enemies/" }, { label: "Status Effects", href: "/wiki/status-effects/" }, { label: "Weakness Finder", href: "/tools/weakness-finder/" }]}
    fallbackLabel="Image not available"
  />;
}
