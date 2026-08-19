import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { artifactArchive } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("artifacts", "/wiki/artifacts/");

export default function ArtifactsPage() {
  return <ArchiveShell
    title="Artifacts"
    heading="Mortal Shell II Artifacts - Effects and Upgrade Paths"
    eyebrow={`${artifactArchive.length} Artifacts · 1.0 launch`}
    description="Equippable trinket effects from the 1.0 launch version."
    image="/images/official/feature.webp"
    basePath="/wiki/artifacts"
    records={artifactArchive}
    filterLabel="Artifact family"
    emptyLabel="No Artifacts match these filters"
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "Items", href: "/wiki/items/" }, { label: "Tarstones", href: "/wiki/tarstones/" }, { label: "Status Effects", href: "/wiki/status-effects/" }]}
  />;
}
