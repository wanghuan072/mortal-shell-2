import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const extraIcons = {
  "boss-lady": "/icons/T_UI_TStone_Melee_SeethingStone_LadyOfTheWoods_Boss.webp",
  "boss-head": "/icons/T_UI_TStone_Melee_MastersStone_Mouth_Boss.webp",
  "boss-swordman": "/icons/T_UI_TStone_Melee_MartyrsReward_Swordman_Boss.webp",
  "parry-swordman": "/icons/T_UI_TStone_Melee_MartyrsReward_Swordman_Boss.webp",
  "boss-moth": "/icons/T_UI_TStone_Melee_ClockWorkChainsaw_MothKnight_Boss.webp",
  "boss-hexapod": "/icons/T_UI_TStone_Melee_ColossusStone_Hexapod_Boss.webp",
  "boss-monolith": "/icons/T_UI_Artifact_Monolith.webp",
  "boss-dwarf": "/icons/T_UI_TStone_Melee_OvateStone_GiantDwarf.webp",
  "boss-offspring": "/icons/T_UI_Artifact_Offspring.webp",
  "boss-parasite-golem": "/icons/T_UI_Artifact_ParasiteGolem_.webp",
  "boss-final": "/icons/T_UI_Item_FinalBoss.webp",
  "min-health-tar-golem": "/icons/T_UI_Sidearm_TarblightedTrophy.webp",
  "mid-summer": "/icons/T_UI_ThestusFlame.webp",
  "reach-hub": "/icons/T_BlackmarrowKey.webp",
  "watch-firstl-memory": "/icons/T_UI_Glimpse_Reverie.webp",
  "all-ovums": "/icons/T_UI_Icon_BloodSeed.webp",
  "all-lute-tracks": "/icons/T_UI_Icon_Lute_Simple_v2.webp",
  "all-tarstones": "/icons/T_UI_Mele_WoundingHit.webp",
  "fully-upgraded-shell": "/icons/T_UI_GraguMeter_Temp.webp",
  "fully-upgraded-weapon": "/icons/T_UI_Icon_MartyrsBlade.webp",
  "explode-blister": "/icons/T_UI_SpecimenExtract.webp",
  "cleanse-all-beacons": "/icons/T_UI_MethersBreath.webp",
  "all-map-fragments": "/icons/T_UI_Icon_MapPiece.webp",
  "all-memories": "/icons/T_UI_Glimpse_Reverie.webp",
  "all-shells": "/icons/T_UI_Icon_Shell_Harros.webp",
  "all-sidearms": "/icons/T_UI_Icon_ParasiteGun.webp",
  "all-weapons": "/icons/T_UI_Icon_Axatana.webp",
  mango: "/icons/T_UI_Icon_Mango.webp",
  "game-completion": "/icons/T_UI_Item_FinalBoss.webp",
  platinum: "/icons/T_UI_Item_FinalBoss.webp",
  baghead: "/icons/t_Super_Moonshine.webp",
};

const ovaCandidates = [
  "/icons/T_UI_Icon_Ova.webp",
  "/icons/T_UI_Ova.webp",
  "/icons/T_UI_Item_Ova.webp",
  "/icons/T_UI_Icon_Ovum.webp",
];

const outDir = path.join(process.cwd(), "public", "assets", "achievements");
const dataPath = path.join(process.cwd(), "src", "data", "achievements.json");
await mkdir(outDir, { recursive: true });

const download = async (iconPath) => {
  const response = await fetch(`https://mortalshelldb.com${iconPath}`);
  if (!response.ok) return null;
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("image") && !type.includes("octet-stream") && !type.includes("webp")) return null;
  return Buffer.from(await response.arrayBuffer());
};

const records = JSON.parse(await readFile(dataPath, "utf8"));
let ovaPath = extraIcons["all-ovums"];
for (const candidate of ovaCandidates) {
  const buffer = await download(candidate);
  if (buffer) {
    ovaPath = candidate;
    extraIcons["all-ovums"] = candidate;
    break;
  }
}

for (const entry of records) {
  if (entry.legacy) continue;
  const remote = (entry.entity && typeof entry.entity === "object" && entry.entity.icon)
    || extraIcons[entry.slug]
    || (entry.slug === "all-ovums" ? ovaPath : null);
  if (!remote) {
    console.error(`skip ${entry.slug}`);
    continue;
  }
  const buffer = await download(remote);
  if (!buffer) {
    console.error(`fail ${entry.slug} ${remote}`);
    continue;
  }
  const filePath = path.join(outDir, `${entry.slug}.webp`);
  await writeFile(filePath, buffer);
  entry.icon = `/assets/achievements/${entry.slug}.webp`;
  console.log(`ok ${entry.slug} ${buffer.length}`);
}

await writeFile(dataPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
console.log("updated", dataPath);
