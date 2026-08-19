import statusEffectData from "@/data/wiki/status-effects.json";
import type { WikiRecord } from "@/types/wiki";

export type StatusEffectLink = { label: string; href: string };
export type StatusEffect = {
  slug: string;
  name: string;
  category: string;
  description: string;
  stacks: number | null;
  aliases: string[];
  related: StatusEffectLink[];
  icon?: string | null;
};

export const STATUS_EFFECTS_PATH = "/wiki/status-effects/";
export const statusEffects = statusEffectData as StatusEffect[];

const SHELL_CONDITIONS: Record<string, string[]> = {
  tiel: ["poison", "infect", "vomit", "shadow"],
  sariel: ["curse", "pain"],
  smert: ["chaos", "faith", "mitigation"],
  eredrim: ["execution", "slaughterer"],
  gragu: ["bloodcurse", "mitigation"],
  genessa: ["faith"],
  proxima: ["lightning"],
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const flattenText = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(flattenText).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flattenText).join(" ");
  return "";
};

const matchesEffect = (text: string, effect: StatusEffect) => {
  const needles = [effect.name, ...effect.aliases.map((alias) => alias.replace(/-/g, " "))];
  return needles.some((needle) => new RegExp(`\\b${escapeRegExp(needle)}\\b`, "i").test(text));
};

export function findStatusEffect(slug: string) {
  return statusEffects.find((entry) => entry.slug === slug);
}

export function statusEffectPath(slug: string) {
  return `${STATUS_EFFECTS_PATH}${slug}/`;
}

export function statusEffectHref(label: string) {
  const raw = label.trim().toLowerCase();
  const slugish = raw.replace(/[\s_]+/g, "-");
  const match = statusEffects.find((entry) => (
    entry.slug === slugish
    || entry.name.toLowerCase() === raw
    || entry.aliases.some((alias) => alias.toLowerCase() === raw || alias.toLowerCase() === slugish)
  ));
  return match ? statusEffectPath(match.slug) : null;
}

export function statusEffectAnchor(slug: string) {
  return statusEffectPath(slug);
}

export function matchingStatusEffects(...parts: unknown[]) {
  const blob = parts.map(flattenText).join(" ");
  return statusEffects.filter((effect) => matchesEffect(blob, effect));
}

export function recordMatchesStatusEffect(effect: StatusEffect, ...parts: unknown[]) {
  return matchingStatusEffects(...parts).some((entry) => entry.slug === effect.slug);
}

export function shellStatusEffects(shellId: string) {
  const slugs = SHELL_CONDITIONS[shellId] ?? [];
  return statusEffects.filter((effect) => slugs.includes(effect.slug));
}

export const statusEffectCategories = ["Damage over time", "Control", "Break", "Offense", "Buff", "Shell effects", "Combat"];

export const statusEffectRecords = statusEffects.map((entry) => ({
  id: entry.slug,
  name: entry.name,
  category: entry.category,
  description: entry.description,
  status: "1.0 launch",
  image: entry.icon ?? null,
  details: {
    maxStacks: entry.stacks ?? "None listed",
    alsoKnownAs: entry.aliases.length ? entry.aliases.map((alias) => alias.replace(/-/g, " ")).join(", ") : "",
    aliases: entry.aliases,
    related: entry.related,
  },
  notes: [],
  updatedAt: "2026-08-19",
  seo: {
    title: `${entry.name} - Mortal Shell II Status Effect`,
    description: `Mortal Shell II ${entry.name}: ${entry.description}${entry.stacks ? ` Max stacks ${entry.stacks}.` : ""}`,
    keywords: ["Mortal Shell II", entry.name, "status effect", "condition", "1.0 launch", ...entry.aliases],
  },
})) satisfies WikiRecord[];
