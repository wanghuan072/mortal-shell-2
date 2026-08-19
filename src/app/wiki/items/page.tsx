import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { itemArchive } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("items", "/wiki/items/");

export default function ItemsPage() {
  return <ArchiveShell
    title="Items"
    heading="Mortal Shell II Items - Materials, Keys, and Consumables"
    eyebrow={`${itemArchive.length} items · 1.0 launch`}
    description="Consumables, charges, and pickups from the 1.0 launch version."
    image="/images/official/battle.png"
    basePath="/wiki/items"
    records={itemArchive}
    filterLabel="Item category"
    emptyLabel="No items match these filters"
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "Artifacts", href: "/wiki/artifacts/" }, { label: "Tarstones", href: "/wiki/tarstones/" }, { label: "Status Effects", href: "/wiki/status-effects/" }]}
  />;
}
