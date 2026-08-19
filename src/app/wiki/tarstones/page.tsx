import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { tarstoneArchive } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("tarstones", "/wiki/tarstones/");

export default function TarstonesPage() {
  return <ArchiveShell
    title="Tarstones"
    heading="Mortal Shell II Tarstones - Effects and Compatible Gear"
    eyebrow={`${tarstoneArchive.length} Tarstones · 1.0 launch`}
    description="Resolve-fuelled combat gems. Compare melee, sidearm, and support Tarstones by effect, slot, and tempering level."
    image="/images/wiki/tarstones.webp"
    basePath="/wiki/tarstones"
    records={tarstoneArchive}
    filterLabel="Equipment slot"
    emptyLabel="No Tarstones match these filters"
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "Weapons", href: "/weapons/" }, { label: "Sidearms", href: "/wiki/sidearms/" }, { label: "Status Effects", href: "/wiki/status-effects/" }]}
  />;
}
