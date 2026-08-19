import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const icons = [
  ["bloodcurse", "/icons/T_UI_StatusEffect_Bleed.webp"],
  ["burn", "/icons/T_UI_StatusEffect_Burn.webp"],
  ["chaos", "/icons/T_UI_StatusEffect_Chaos.webp"],
  ["confusion", "/icons/T_UI_StatusEffect_Confusion.webp"],
  ["cosmic-disease", "/icons/T_UI_StatusEffect_CosmicDisease.webp"],
  ["critical-hit", "/icons/T_UI_StatusEffect_CriticalHit.webp"],
  ["curse", "/icons/T_UI_StatusEffect_Cursed.webp"],
  ["execution", "/icons/T_UI_StatusEffect_Execution.webp"],
  ["faith", "/icons/T_UI_StatusEffect_Faith.webp"],
  ["fragile", "/icons/T_UI_StatusEffect_Fragile.webp"],
  ["frost", "/icons/T_UI_StatusEffect_Freeze.webp"],
  ["havoc", "/icons/T_UI_StatusEffect_Havoc.webp"],
  ["leech", "/icons/T_UI_StatusEffect_Leech.webp"],
  ["lightning", "/icons/T_UI_StatusEffect_Lightning.webp"],
  ["pain", "/icons/T_UI_StatusEffect_Pain.webp"],
  ["perforation", "/icons/T_UI_StatusEffect_Perforation.webp"],
  ["phantom", "/icons/T_UI_StatusEffect_Phantom.webp"],
  ["poison", "/icons/T_UI_StatusEffect_Poisoned.webp"],
  ["shadow", "/icons/T_UI_StatusEffect_Shadow.webp"],
  ["slaughterer", "/icons/T_UI_StatusEffect_Slaughterer.webp"],
  ["stasis", "/icons/T_UI_StatusEffect_Stasis.webp"],
  ["trauma", "/icons/T_UI_StatusEffect_Trauma.webp"],
  ["warp", "/icons/T_UI_StatusEffect_Warp.webp"],
  ["weak", "/icons/T_UI_StatusEffect_Weak.webp"],
];

const outDir = path.join(process.cwd(), "public", "assets", "status-effects");
await mkdir(outDir, { recursive: true });

for (const [slug, iconPath] of icons) {
  const response = await fetch(`https://mortalshelldb.com${iconPath}`);
  if (!response.ok) {
    console.error(`fail ${slug} ${response.status}`);
    continue;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const filePath = path.join(outDir, `${slug}.webp`);
  await writeFile(filePath, buffer);
  console.log(`ok ${slug} ${buffer.length} ${filePath}`);
}
