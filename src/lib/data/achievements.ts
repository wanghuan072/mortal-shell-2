import achievementData from "@/data/achievements.json";
import type { WikiRecord } from "@/types/wiki";

export type AchievementEntity = {
  kind: string;
  slug: string;
  name: string;
  to?: string;
  icon?: string | null;
};

export type Achievement = {
  slug: string;
  name: string;
  description: string;
  icon?: string | null;
  category: string | null;
  hidden: boolean;
  missable: boolean;
  prologue: boolean;
  platform?: string | null;
  entity?: AchievementEntity | null;
  lockedBySlayerSeal: boolean;
  note?: string;
  source?: string;
  legacy?: boolean;
};

export const ACHIEVEMENTS_PATH = "/wiki/achievements/";
export const achievements = (achievementData as Achievement[]).filter((entry) => !entry.legacy);

export function findAchievement(slug: string) {
  return achievements.find((entry) => entry.slug === slug);
}

export function achievementPath(slug: string) {
  return `${ACHIEVEMENTS_PATH}${slug}/`;
}

export function achievementEntityPath(entity?: AchievementEntity | null) {
  if (!entity?.kind || !entity.slug) return null;
  if (entity.kind === "shell") return `/shells/${entity.slug}/`;
  if (entity.kind === "weapon") return `/weapons/${entity.slug}/`;
  if (entity.kind === "sidearm") return `/wiki/sidearms/${entity.slug}/`;
  if (entity.kind === "boss" || entity.kind === "enemy") return `/enemies/${entity.slug}/`;
  if (entity.kind === "item") return `/wiki/items/${entity.slug}/`;
  if (entity.kind === "tarstone") return `/wiki/tarstones/${entity.slug}/`;
  if (entity.kind === "seal") return `/wiki/seals/${entity.slug}/`;
  return null;
}

export const achievementRecords = achievements.map((entry) => ({
  id: entry.slug,
  name: entry.name,
  category: entry.category || "Achievement",
  description: entry.description,
  status: "1.0 launch",
  image: entry.icon ?? null,
  details: {
    hidden: entry.hidden,
    missable: entry.missable,
    prologue: entry.prologue,
    platform: entry.platform || "",
    lockedBySlayerSeal: entry.lockedBySlayerSeal,
    note: entry.note || "",
    entity: entry.entity ?? null,
  },
  notes: entry.note ? [entry.note] : [],
  updatedAt: "2026-08-19",
  seo: {
    title: `${entry.name} - Mortal Shell II Achievement`,
    description: `Mortal Shell II ${entry.name}: ${entry.description}${entry.note ? ` ${entry.note}` : ""} 1.0 launch version.`,
    keywords: ["Mortal Shell II", entry.name, "achievement", "trophy", "1.0 launch", entry.category || "Achievement"],
  },
})) satisfies WikiRecord[];
