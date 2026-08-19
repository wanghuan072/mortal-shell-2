import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { sealArchive } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("seals", "/wiki/seals/");

export default function SealsPage() {
  return <ArchiveShell
    title="Seals"
    heading="Mortal Shell II Seals - Guard, Harden, and Parry"
    eyebrow={`${sealArchive.length} Seals · 1.0 launch`}
    description="Parry and transformation seals. Learn what each Seal does and when you can activate it."
    image="/images/official/boss.png"
    basePath="/wiki/seals"
    records={sealArchive}
    filterLabel="Ability"
    emptyLabel="No Seals match these filters"
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "Shells", href: "/wiki/shells/" }, { label: "Skills", href: "/wiki/skills/" }, { label: "Status Effects", href: "/wiki/status-effects/" }]}
  />;
}
