import artifacts from "@/data/wiki/artifacts.json";
import enemyMedia from "@/data/wiki/enemy-media.json";
import launchReference from "@/data/wiki/launch-reference.json";
import items from "@/data/wiki/items.json";
import seals from "@/data/wiki/seals.json";
import shells from "@/data/wiki/shells.json";
import sidearms from "@/data/wiki/sidearms.json";
import skills from "@/data/wiki/skills.json";
import tarstones from "@/data/wiki/tarstones.json";
import weapons from "@/data/wiki/weapons.json";
import { achievementRecords } from "@/lib/data/achievements";
import { statusEffectRecords } from "@/lib/data/status-effects";
import type { WikiRecord } from "@/types/wiki";

export const DATA_STATUS = "1.0 launch";
export const DATA_UPDATED_AT = String(launchReference.syncedAt ?? "2026-08-19").slice(0, 10);

const asRecords = (records: unknown) => records as WikiRecord[];
type LaunchReferenceRecord = { slug: string; name: string; desc?: unknown; category?: unknown; icon?: unknown; portrait?: unknown; [key: string]: unknown };

const cleanReferenceValue = (value: unknown): unknown => {
  if (typeof value === "string") return value.replace(/<[^>]+>/g, "").replace(/\\r?\\n/g, " ").trim();
  if (Array.isArray(value)) return value.map(cleanReferenceValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cleanReferenceValue(entry)]));
  return value;
};

const asCleanString = (value: unknown) => {
  const cleaned = cleanReferenceValue(value);
  return typeof cleaned === "string" ? cleaned : "";
};

const launchImage = (source: LaunchReferenceRecord, current?: WikiRecord) => {
  if (current?.image) return current.image;
  const path = typeof source.portrait === "string" ? source.portrait : typeof source.icon === "string" ? source.icon : null;
  return path ? `https://mortalshelldb.com${path}` : null;
};

const makeReferenceDetails = (record: LaunchReferenceRecord) => Object.fromEntries(Object.entries(record)
  .filter(([key]) => !["slug", "id", "name", "desc", "icon", "portrait", "art", "videos", "shades"].includes(key))
  .map(([key, value]) => [key, cleanReferenceValue(value)]));

type MergeOptions = {
  category?: (source: LaunchReferenceRecord, current?: WikiRecord) => string;
  description?: (source: LaunchReferenceRecord, current?: WikiRecord) => string;
  details?: (source: LaunchReferenceRecord, details: Record<string, unknown>) => Record<string, unknown>;
};

const mergeLaunchRecords = (local: WikiRecord[], reference: LaunchReferenceRecord[], fallbackCategory: string, options: MergeOptions = {}) => {
  const localById = new Map(local.map((record) => [record.id, record]));
  const localBySlug = new Map(local.map((record) => [typeof record.details.slug === "string" ? record.details.slug : record.id, record]));
  const localByName = new Map(local.map((record) => [record.name.toLowerCase(), record]));
  return reference.map((source) => {
    const current = localById.get(source.slug) ?? localBySlug.get(source.slug) ?? localByName.get(source.name.toLowerCase());
    const description = options.description?.(source, current)
      ?? asCleanString(source.desc)
      ?? current?.description
      ?? "";
    const details = options.details?.(source, { ...(current?.details ?? {}), ...makeReferenceDetails(source), slug: source.slug })
      ?? { ...(current?.details ?? {}), ...makeReferenceDetails(source), slug: source.slug };
    return {
      id: source.slug,
      name: source.name,
      category: options.category?.(source, current) ?? (typeof source.category === "string" ? source.category : current?.category ?? fallbackCategory),
      description: description && !/missing (description|flavour text)/i.test(description) ? description : current?.description ?? "",
      status: DATA_STATUS,
      image: launchImage(source, current),
      details,
      notes: current?.notes ?? [],
      updatedAt: DATA_UPDATED_AT,
      seo: {
        title: `${source.name} - Mortal Shell II ${fallbackCategory}`,
        description: `Mortal Shell II ${source.name}: ${fallbackCategory.toLowerCase()} record. 1.0 launch version.`,
        keywords: ["Mortal Shell II", source.name, `Mortal Shell II ${fallbackCategory}`, "1.0 launch"],
      },
    } satisfies WikiRecord;
  });
};

const titleCase = (value: string) => value.replace(/[-_]/g, " ").replace(/^./, (letter) => letter.toUpperCase());
const referenceValue = (value: unknown) => ({ value: String(value), provenance: DATA_STATUS });

type EncounterReference = {
  slug: string;
  name: string;
  codename?: string;
  group?: string;
  miniboss?: boolean;
  mainBoss?: boolean;
  stats?: Record<string, number>;
  damage?: Record<string, number | null>;
  movement?: Record<string, number | null>;
  armor?: string;
  regionSlice?: number;
  gloom?: number;
  gold?: number;
  goldChance?: number;
  moves?: Array<{ name?: string; weight?: string | null; poise?: number | null }>;
};

const encounterKind = (reference: EncounterReference) => reference.mainBoss ? "Boss" : reference.miniboss ? "Miniboss" : "Enemy";

const makeEncounterRecord = (reference: EncounterReference): WikiRecord => {
  const kind = encounterKind(reference);
  const stats = reference.stats ?? {};
  const core: Record<string, { value: string; provenance: string }> = {};
  if (stats.MaxHealth !== undefined) core.health = referenceValue(stats.MaxHealth);
  if (stats.Poise !== undefined) core.poise = referenceValue(stats.Poise);
  const resistanceKeys = { BleedResistance: "bleed", FrostResistance: "frost", BreakResistance: "break", ParryResistance: "parry", CurseResistance: "curse", ShockResistance: "shock", WaspsResistance: "wasps", WaspsMitigation: "wasps" };
  const resistances = Object.fromEntries(Object.entries(resistanceKeys)
    .filter(([sourceKey]) => stats[sourceKey] !== undefined)
    .map(([sourceKey, targetKey]) => [targetKey, referenceValue(stats[sourceKey])]));
  const resistanceNumbers = Object.entries(resistances).flatMap(([key, value]) => {
    const number = Number(value.value);
    return Number.isFinite(number) ? [{ key, number }] : [];
  });
  const weakest = resistanceNumbers.length ? Math.min(...resistanceNumbers.map((entry) => entry.number)) : null;
  const strongest = resistanceNumbers.length ? Math.max(...resistanceNumbers.map((entry) => entry.number)) : null;
  const statusMap = { BasePoisonDamage: "poisonDamage", BasePoisonDuration: "poisonDuration", BaseBurnDamage: "burnDamage", BaseBurnDuration: "burnDuration", BaseFreezeDuration: "freezeDuration", BaseLightningDamage: "lightningDamage", BaseLightningDuration: "lightningDuration" };
  const statusDamage = Object.fromEntries(Object.entries(statusMap)
    .filter(([sourceKey]) => stats[sourceKey] !== undefined)
    .map(([sourceKey, targetKey]) => [targetKey, referenceValue(stats[sourceKey])]));
  const miscMap = { BaseKnockbackStrength: "knockback", BaseKnockbackMultiplier: "knockbackMultiplier", RiposteWeakness: "riposteWeakness", TarstoneEXP: "tarstoneExp", StoneStunTime: "stoneStunSeconds", StasisWeakness: "stasisWeakness" };
  const misc = Object.fromEntries(Object.entries(miscMap)
    .filter(([sourceKey]) => stats[sourceKey] !== undefined)
    .map(([sourceKey, targetKey]) => [targetKey, referenceValue(stats[sourceKey])]));
  const onDeath: Record<string, { value: string; provenance: string }> = {};
  if (reference.gloom !== undefined) onDeath.gloom = referenceValue(reference.gloom);
  if (reference.gold !== undefined && reference.gold > 0) onDeath.coin = referenceValue(reference.gold);
  if (reference.goldChance !== undefined && reference.goldChance < 1) onDeath.coinDropChance = referenceValue(`${Math.round(reference.goldChance * 100)}%`);
  const attacks = (reference.moves ?? []).map((move) => [move.name, move.weight, move.poise === null || move.poise === undefined ? "" : `${move.poise} poise`].filter(Boolean).join(" · "));
  const media = enemyMedia[reference.slug as keyof typeof enemyMedia];
  return {
    id: reference.slug,
    name: reference.name,
    category: kind === "Boss" ? "Boss" : `${reference.group ?? reference.codename ?? "Encounter"} · ${kind}`,
    description: "",
    status: DATA_STATUS,
    image: media?.image ?? null,
    details: {
      classification: kind,
      family: reference.group ?? reference.codename ?? (kind === "Boss" ? "Boss" : "Encounter"),
      armor: reference.armor ?? "Not recorded",
      region: reference.regionSlice ? `Region ${reference.regionSlice}` : "Not recorded",
      core,
      resistances,
      combatProfile: {
        vulnerableTo: { values: weakest === null ? [] : resistanceNumbers.filter((entry) => entry.number === weakest).map((entry) => entry.key), provenance: DATA_STATUS },
        resists: { values: strongest === null ? [] : resistanceNumbers.filter((entry) => entry.number === strongest).map((entry) => entry.key), provenance: DATA_STATUS },
      },
      attacks: attacks.length ? { entries: attacks, provenance: DATA_STATUS } : { entries: [] },
      statusDamage,
      misc,
      damageDealt: reference.damage ? Object.fromEntries(Object.entries(reference.damage).filter(([, value]) => value !== null).map(([key, value]) => [key, referenceValue(value)])) : {},
      movement: reference.movement ? Object.fromEntries(Object.entries(reference.movement).filter(([, value]) => value !== null).map(([key, value]) => [key, referenceValue(value)])) : {},
      onDeath,
      drops: { values: [] },
      regions: { values: [] },
    },
    notes: [],
    updatedAt: DATA_UPDATED_AT,
    seo: {
      title: `${reference.name} - Mortal Shell II ${kind}`,
      description: `Mortal Shell II ${reference.name}: 1.0 launch combat statistics, attacks, resistances, and rewards.`,
      keywords: ["Mortal Shell II", reference.name, `Mortal Shell II ${kind.toLowerCase()}`, "1.0 launch"],
    },
  };
};

const enemyRecordsFromLaunch = (launchReference.enemies as unknown as EncounterReference[]).map(makeEncounterRecord);
const bossRecordsFromLaunch = (launchReference.bosses as unknown as EncounterReference[]).map((record) => makeEncounterRecord({ ...record, mainBoss: record.mainBoss ?? true }));

export const wikiCollections = {
  weapons: mergeLaunchRecords(asRecords(weapons), launchReference.weapons as unknown as LaunchReferenceRecord[], "Weapon", {
    category: (source) => source.collectible === false ? "Uncollectible" : "Melee",
  }),
  shells: mergeLaunchRecords(asRecords(shells), launchReference.shells as unknown as LaunchReferenceRecord[], "Shell", {
    category: (source) => source.playable ? "Playable" : source.memory ? "Memory" : "Unplayable",
    description: (source, current) => asCleanString(source.ability) || current?.description || "",
    details: (source, details) => ({
      ...details,
      subName: source.subName,
      playable: source.playable === true,
      memory: source.memory === true,
      abilities: Array.isArray(source.abilities)
        ? source.abilities.map((entry) => {
          const value = entry && typeof entry === "object" ? entry as { name?: unknown; desc?: unknown } : {};
          return { name: asCleanString(value.name), description: asCleanString(value.desc), type: "Signature" };
        })
        : [],
    }),
  }),
  sidearms: mergeLaunchRecords(asRecords(sidearms), launchReference.sidearms as unknown as LaunchReferenceRecord[], "Sidearm"),
  items: mergeLaunchRecords(asRecords(items), launchReference.items as unknown as LaunchReferenceRecord[], "Item", {
    category: (source) => typeof source.kind === "string" ? titleCase(source.kind) : "Item",
  }),
  artifacts: mergeLaunchRecords(asRecords(artifacts), launchReference.artifacts as unknown as LaunchReferenceRecord[], "Artifact", {
    category: (source) => typeof source.tier === "string" && source.tier ? source.tier : "Artifact",
  }),
  tarstones: mergeLaunchRecords(asRecords(tarstones), launchReference.tarstones as unknown as LaunchReferenceRecord[], "Tarstone", {
    details: (source, details) => ({
      ...details,
      levels: Array.isArray(source.levels)
        ? source.levels.map((entry, index) => ({ level: String(index + 1), effects: [{ label: "Effect", value: asCleanString(entry) }] }))
        : details.levels,
    }),
  }),
  seals: asRecords(seals).map((record) => ({
    ...record,
    status: DATA_STATUS,
    updatedAt: record.updatedAt || DATA_UPDATED_AT,
    seo: {
      title: `${record.name} - Mortal Shell II Seal`,
      description: `Mortal Shell II ${record.name}: seal record. 1.0 launch version.`,
      keywords: ["Mortal Shell II", record.name, "Mortal Shell II Seal", "1.0 launch"],
    },
  })),
  skills: mergeLaunchRecords(asRecords(skills), launchReference.skills as unknown as LaunchReferenceRecord[], "Skill", {
    category: (source) => typeof source.shell === "string" ? source.shell : "Skill",
    details: (source, details) => ({
      ...details,
      owner: source.shell,
      ownerType: "Shell",
      type: "Skill Tree",
      levels: Array.isArray(source.levels) ? source.levels : details.levels,
    }),
  }),
  enemies: enemyRecordsFromLaunch,
  bosses: bossRecordsFromLaunch,
} as const;

export const {
  weapons: weaponRecords,
  shells: shellRecords,
  sidearms: sidearmRecords,
  items: itemRecords,
  artifacts: artifactRecords,
  tarstones: tarstoneRecords,
  seals: sealRecords,
  skills: skillRecords,
  enemies: enemyRecords,
  bosses: bossRecords,
} = wikiCollections;

export const findWikiRecord = (records: readonly WikiRecord[], id: string) => records.find((record) => record.id === id);
export const archiveCounts = {
  shells: shellRecords.length,
  namedShells: shellRecords.filter((record) => record.details.playable === true).length,
  weapons: weaponRecords.length,
  sidearms: sidearmRecords.length,
  items: itemRecords.length,
  artifacts: artifactRecords.length,
  tarstones: tarstoneRecords.length,
  seals: sealRecords.length,
  skills: skillRecords.length,
  enemyFamilies: new Set(enemyRecords.map((record) => record.category.split(" · ")[0])).size,
  enemyVariants: enemyRecords.length,
  minibosses: enemyRecords.filter((record) => record.details.classification === "Miniboss").length,
  bosses: bossRecords.length,
};

const getSearchHref = (collection: keyof typeof wikiCollections, record: WikiRecord) => {
  if (collection === "weapons") {
    const slug = typeof record.details.slug === "string" ? record.details.slug : record.id;
    return `/weapons/${slug}/`;
  }
  if (collection === "shells") return `/shells/${record.id}/`;
  if (collection === "enemies" || collection === "bosses") return `/enemies/${record.id}/`;
  return `/wiki/${collection}/${record.id}/`;
};

export const siteSearchEntries = [
  ...Object.entries(wikiCollections).flatMap(([collection, records]) => records.map((record) => ({
    label: record.name,
    href: getSearchHref(collection as keyof typeof wikiCollections, record),
    type: record.category,
  }))),
  ...statusEffectRecords.map((record) => ({
    label: record.name,
    href: `/wiki/status-effects/${record.id}/`,
    type: "Status Effect",
  })),
  ...achievementRecords.map((record) => ({
    label: record.name,
    href: `/wiki/achievements/${record.id}/`,
    type: "Achievement",
  })),
];

export const archiveCollections = {
  shells: shellRecords,
  sidearms: sidearmRecords,
  items: itemRecords,
  artifacts: artifactRecords,
  tarstones: tarstoneRecords,
  seals: sealRecords,
  skills: skillRecords,
  "status-effects": statusEffectRecords,
  achievements: achievementRecords,
  enemies: [...enemyRecords, ...bossRecords],
} as const;

export const artifactArchive = artifactRecords;
export const verifiedEnemyArchive = [...enemyRecords, ...bossRecords];
export const enemyArchive = [...enemyRecords, ...bossRecords];
export const itemArchive = itemRecords;
export const sealArchive = sealRecords;
export const shellArchive = shellRecords;
export const sidearmArchive = sidearmRecords;
export const skillArchive = skillRecords;
export const tarstoneArchive = tarstoneRecords;
export const findArchiveRecord = findWikiRecord;
