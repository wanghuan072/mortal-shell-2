import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { statusEffectRecords } from "@/lib/data/status-effects";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("statusEffects", "/wiki/status-effects/");

export default function StatusEffectsPage() {
  return <ArchiveShell
    title="Status Effects"
    heading="Mortal Shell II Status Effects - Conditions and Stacking"
    eyebrow={`${statusEffectRecords.length} conditions · 1.0 launch`}
    description="The states a fight can leave you in, and the ones you can leave on an enemy. Each description uses the game's own wording from the 1.0 launch records."
    image="/images/wiki/status-effects.webp"
    basePath="/wiki/status-effects"
    records={statusEffectRecords}
    filterLabel="Condition type"
    emptyLabel="No status effects match these filters"
    layout="condition"
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "Tarstones", href: "/wiki/tarstones/" }, { label: "Skills", href: "/wiki/skills/" }, { label: "Seals", href: "/wiki/seals/" }]}
    fallbackLabel="Condition"
  />;
}
