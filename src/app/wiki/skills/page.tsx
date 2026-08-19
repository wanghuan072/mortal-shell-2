import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { skillArchive } from "@/lib/data/wiki";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("skills", "/wiki/skills/");

export default function SkillsPage() {
  return <ArchiveShell
    title="Skills"
    heading="Mortal Shell II Skills - Effects, Costs, and Unlocks"
    eyebrow={`${skillArchive.length} skill records · 1.0 launch`}
    description="Every Shell skill, level by level. Browse by owner, then check effects and upgrade tiers."
    image="/images/official/world.png"
    basePath="/wiki/skills"
    records={skillArchive}
    filterLabel="Skill type"
    emptyLabel="No skills match these filters"
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "Shells", href: "/wiki/shells/" }, { label: "Tarstones", href: "/wiki/tarstones/" }, { label: "Status Effects", href: "/wiki/status-effects/" }]}
  />;
}
