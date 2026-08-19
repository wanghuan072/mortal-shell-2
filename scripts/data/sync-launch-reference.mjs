import { mkdir, writeFile } from "node:fs/promises";

const sourceUrl = "https://mortalshelldb.com/assets/index-q1tdAEgn.js";
const source = await (await fetch(sourceUrl)).text();

const extractJsonArray = (needle) => {
  const needleIndex = source.indexOf(needle);
  const start = needleIndex < 0 ? -1 : source.lastIndexOf("JSON.parse(`", needleIndex);
  const end = start < 0 ? -1 : source.indexOf("`)", start);
  if (start < 0 || end < 0) throw new Error(`Could not locate JSON dataset: ${needle}`);
  const raw = source.slice(start + "JSON.parse(`".length, end);
  return JSON.parse(raw.replaceAll("\\\\", "\\"));
};

const extractLiteralArray = (needle) => {
  const start = source.indexOf(needle);
  if (start < 0) throw new Error(`Could not locate literal dataset: ${needle}`);
  const arrayStart = source.indexOf("[", start);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = arrayStart; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'" || character === "`") quote = character;
    else if (character === "[") depth += 1;
    else if (character === "]" && --depth === 0) {
      const literal = source.slice(arrayStart, index + 1)
        .replace(/`/g, '"')
        .replace(/!0/g, "true")
        .replace(/!1/g, "false")
        .replace(/([,{])([A-Za-z_$][\w$]*):/g, '$1"$2":');
      return JSON.parse(literal);
    }
  }
  throw new Error(`Could not close literal dataset: ${needle}`);
};

const data = {
  source: sourceUrl,
  syncedAt: new Date().toISOString(),
  bosses: extractJsonArray('"id":"DT_Attributes_DwarfBoss"'),
  items: extractJsonArray('"id":"ID_KS_TielsDagger"'),
  enemies: extractJsonArray('"id":"DT_Attributes_Aristocrat"'),
  shells: extractJsonArray('"slug":"eredrim","id":"ID_Shell_Eredrim"'),
  tarstones: extractJsonArray('"slug":"melee-melee-inflict-perforation"'),
  skills: extractJsonArray('"slug":"eredrim-alacrity"'),
  achievements: extractJsonArray('"slug":"claim-harros"'),
  artifacts: extractLiteralArray("Eh=[{slug:`acolytes-thorns`"),
  sidearms: extractLiteralArray("Rh=[{slug:`ballistazooka`"),
  weapons: extractLiteralArray("Hh=[{slug:`axatana`"),
};

await mkdir("src/data/wiki", { recursive: true });
await writeFile("src/data/wiki/launch-reference.json", `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Synced ${data.enemies.length} enemies, ${data.items.length} items, ${data.tarstones.length} Tarstones, and ${data.skills.length} skills.`);
