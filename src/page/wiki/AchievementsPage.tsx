import type { Metadata } from "next";
import { ArchiveShell } from "@/page/archive/components/ArchiveShell";
import { achievementRecords } from "@/lib/data/achievements";
import { getPageMetadata } from "@/seo/tdk";

export const metadata: Metadata = getPageMetadata("achievements", "/wiki/achievements/");

export default function AchievementsPage() {
  return <ArchiveShell
    title="Achievements"
    heading="Mortal Shell II Achievements - Trophies and Unlock Routes"
    eyebrow={`${achievementRecords.length} achievements · 1.0 launch`}
    description="Every 1.0 launch trophy, including Shell claims, weapon unlocks, Boss encounters, and collection goals. Open a record for the linked Shell, weapon, sidearm, or encounter page."
    image="/images/official/battle.png"
    basePath="/wiki/achievements"
    records={achievementRecords}
    filterLabel="Trophy type"
    emptyLabel="No achievements match these filters"
    parent={{ label: "Wiki", href: "/wiki/" }}
    related={[{ label: "Shells", href: "/shells/" }, { label: "Weapons", href: "/weapons/" }, { label: "Bosses", href: "/bosses/" }]}
    fallbackLabel="Achievement"
  />;
}
