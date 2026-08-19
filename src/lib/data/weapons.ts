import weaponData from "@/data/wiki/weapons.json";
import launchReference from "@/data/wiki/launch-reference.json";

type WeaponDetails = {
  attributes: Array<{ label: string; value: string }>;
  moveDamage: Array<{ move: string; multiplier: string; damage0: string; damage20: string; poise0: string; poise20: string; note?: string }>;
  upgrades: Array<{ level: string; material: string; quantity: string; coin: string }>;
  acquisitionVerified: boolean;
  moveDamageNote?: string;
  family: string;
  imageAlt?: string;
  skills: Array<{ name: string; description: string }>;
  upgradePool: string[];
  acquisition: string;
  slug: string;
  type: string;
  imagePosition?: string;
  verification: string;
};

export type Weapon = {
  id: string;
  slug: string;
  name: string;
  family: string;
  type: string;
  description: string;
  image: string;
  imageAlt?: string;
  imagePosition?: string;
  attributes: WeaponDetails["attributes"];
  moveDamage: WeaponDetails["moveDamage"];
  upgrades: WeaponDetails["upgrades"];
  acquisitionVerified: boolean;
  moveDamageNote?: string;
  skills: WeaponDetails["skills"];
  upgradePool: string[];
  acquisition: string;
  verification: WeaponDetails["verification"];
  updatedAt: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

const localWeapons: Weapon[] = (weaponData as unknown as Array<{
  id: string;
  name: string;
  description: string;
  image: string;
  updatedAt: string;
  seo: Weapon["seo"];
  details: WeaponDetails;
}>).map((record) => ({
  id: record.id,
  slug: record.details.slug,
  name: record.name,
  family: record.details.family,
  type: record.details.type,
  description: record.description,
  image: record.image,
  imageAlt: record.details.imageAlt,
  imagePosition: record.details.imagePosition,
  attributes: record.details.attributes,
  moveDamage: record.details.moveDamage,
  upgrades: record.details.upgrades,
  acquisitionVerified: record.details.acquisitionVerified,
  moveDamageNote: record.details.moveDamageNote,
  skills: record.details.skills,
  upgradePool: record.details.upgradePool,
  acquisition: record.details.acquisition,
  verification: record.details.verification,
  updatedAt: record.updatedAt,
  seo: record.seo,
}));

type LaunchWeapon = { slug: string; id: string; name: string; desc?: string | null; icon?: string; collectible?: boolean; upgrade?: Record<string, number[]> };
const launchWeapons = launchReference.weapons as unknown as LaunchWeapon[];
const sourceAttributes = (weapon: LaunchWeapon) => Object.entries(weapon.upgrade ?? {}).map(([label, values]) => ({ label, value: `${values[0] ?? "—"} → ${values.at(-1) ?? "—"}` }));
const sourceUpgrades = (weapon: LaunchWeapon) => (weapon.upgrade?.Damage ?? []).map((multiplier, index) => ({ level: `+${index}`, material: "1.0 launch", quantity: "—", coin: `Damage ×${multiplier}` }));
const localWeaponBySlug = new Map(localWeapons.map((weapon) => [weapon.slug, weapon]));
const launchIcon = (icon?: string) => icon ? `https://mortalshelldb.com${icon}` : "/images/official/combat.png";

export const weapons: Weapon[] = launchWeapons.map((source) => {
  const current = localWeaponBySlug.get(source.slug);
  if (current) return { ...current, description: source.desc || current.description, image: current.image || launchIcon(source.icon), attributes: sourceAttributes(source), moveDamage: [], moveDamageNote: undefined, upgrades: sourceUpgrades(source), verification: "1.0 launch" };
  return {
    id: source.id,
    slug: source.slug,
    name: source.name,
    family: "Melee",
    type: source.collectible ? "Weapon" : "Uncollectible weapon",
    description: source.desc ?? "",
    image: launchIcon(source.icon),
    attributes: sourceAttributes(source),
    moveDamage: [],
    upgrades: sourceUpgrades(source),
    acquisitionVerified: false,
    skills: [],
    upgradePool: [],
    acquisition: "",
    verification: "1.0 launch",
    updatedAt: "2026-08-19",
    seo: { title: `${source.name} - Mortal Shell II Weapon`, description: `Mortal Shell II ${source.name}: 1.0 launch upgrade scaling.`, keywords: ["Mortal Shell II", source.name, "Mortal Shell II weapon"] },
  };
});

export const weaponAssetFamilies = weapons.map((weapon) => weapon.family);
export const meleeProgressionCount = weapons.filter((weapon) => weapon.upgrades.length === 20).length;
export function getWeapon(slug: string) { return weapons.find((weapon) => weapon.slug === slug); }
