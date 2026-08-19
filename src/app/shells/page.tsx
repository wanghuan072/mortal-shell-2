import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { shellArchive } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("shells", "/shells/");

export default function ShellsPage() {
  return <ArchiveShell
    title="Shells"
    heading="Mortal Shell II Shells - Abilities, Passives, and Variants"
    eyebrow={`${shellArchive.filter((record) => record.details.playable === true).length} playable Shells · 1.0 launch`}
    description="Empty bodies to inhabit — each with a signature ability. Compare playable Shells, memories, and unplayable variants from the 1.0 launch data."
    image="/images/official/trailer.webp"
    basePath="/shells"
    records={shellArchive}
    filterLabel="Availability"
    emptyLabel="No Shells match these filters"
    related={[{ label: "Skills", href: "/wiki/skills/" }, { label: "Seals", href: "/wiki/seals/" }, { label: "Status Effects", href: "/wiki/status-effects/" }]}
  />;
}
