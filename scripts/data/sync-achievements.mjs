import { readFile, writeFile } from "node:fs/promises";

const sourceUrl = "https://mortalshelldb.com/assets/index-q1tdAEgn.js";
const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Could not download achievement source: ${response.status}`);
const source = await response.text();
const marker = "Xh=JSON.parse(`";
const start = source.indexOf(marker);
if (start < 0) throw new Error("Achievement catalogue marker was not found");
const payloadStart = start + marker.length;
const payloadEnd = source.indexOf("`)", payloadStart);
if (payloadEnd < 0) throw new Error("Achievement catalogue terminator was not found");
const canonical = JSON.parse(source.slice(payloadStart, payloadEnd));
if (!Array.isArray(canonical) || canonical.length !== 53) throw new Error(`Expected 53 achievements, received ${canonical.length}`);

const existing = JSON.parse(await readFile("src/data/achievements.json", "utf8"));
const existingIcons = new Map(existing.filter((entry) => !entry.legacy && entry.icon).map((entry) => [entry.slug, entry.icon]));
const legacy = [];
const originalLegacy = [
  ["my-first", "My First...", "Finish the Festival and Claim your Shell", "/assets/achievements/my-first.jpg"],
  ["reach-marrowkeep", "Reach Marrowkeep", "Reach Marrowkeep", "/assets/achievements/reach-marrowkeep.jpg"],
  ["find-axe-and-dagger", "Find Axe and Dagger", "Unlock the Axe and Dagger", "/assets/achievements/find-axe-and-dagger.jpg"],
  ["complete-the-beta", "Complete The Beta", "Complete The Beta", "/assets/achievements/complete-the-beta.jpg"],
  ["claim-tiel", "Claim Tiel", "Unlock Tiel", "/assets/achievements/claim-tiel.jpg"],
  ["cleanse-all-beacons", "Cleanse all Beacons", "Cleanse all Beacons in the Beta", "/assets/achievements/cleanse-all-beacons.jpg"],
  ["finish-the-fight", "Finish the Fight", "Get Tar Golem to 0 Health", "/assets/achievements/finish-the-fight.jpg"],
  ["a-dark-force-is-near", "A Dark Force is Near", "Cleanse all statues in the Beta", "/assets/achievements/a-dark-force-is-near.jpg"],
  ["brutal-savage-rekt", "Brutal, Savage, Rekt", "Defeat the Great Arbiter of Flesh", "/assets/achievements/brutal-savage-rekt.jpg"],
].map(([slug, name, description, icon]) => ({ slug, name, description, icon, legacy: true, source: "Previous project record; retained for audit" }));
const records = canonical.map((entry) => ({
  slug: entry.slug,
  name: entry.name,
  description: entry.desc,
  icon: existingIcons.get(entry.slug) ?? null,
  category: entry.category,
  hidden: Boolean(entry.hidden),
  missable: Boolean(entry.missable),
  prologue: Boolean(entry.prologue),
  platform: entry.platform,
  entity: entry.entity ?? null,
  lockedBySlayerSeal: Boolean(entry.lockedBySlayerSeal),
  note: entry.note ?? "",
  source: "Current achievement catalogue",
}));

const canonicalSlugs = new Set(records.map((entry) => entry.slug));
const retainedLegacy = [...legacy, ...originalLegacy]
  .filter((entry, index, all) => all.findIndex((candidate) => candidate.slug === entry.slug) === index)
  .map((entry) => canonicalSlugs.has(entry.slug) ? { ...entry, legacySlug: entry.slug, slug: `legacy-${entry.slug}` } : entry);
await writeFile("src/data/achievements.json", `${JSON.stringify([...records, ...retainedLegacy], null, 2)}\n`, "utf8");
console.log(`Synced ${records.length} current achievements and retained ${retainedLegacy.length} legacy records.`);
