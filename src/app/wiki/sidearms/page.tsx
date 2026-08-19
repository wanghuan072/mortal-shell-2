import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { sidearmArchive } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("sidearms", "/wiki/sidearms/");

export default function SidearmsPage() {
  return <ArchiveShell
    title="Sidearms"
    heading="Mortal Shell II Sidearms - Fire Modes and Upgrades"
    eyebrow={`${sidearmArchive.length} sidearms · 1.0 launch`}
    description="Ranged off-hand weapons. Check fire modes, upgrade scaling, and compatible Tarstones before you commit to a loadout."
    image="/images/official/combat.png"
    basePath="/wiki/sidearms"
    records={sidearmArchive}
    filterLabel="Family"
    emptyLabel="No sidearms match these filters"
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "Weapons", href: "/weapons/" }, { label: "Tarstones", href: "/wiki/tarstones/" }, { label: "Status Effects", href: "/wiki/status-effects/" }]}
  />;
}
