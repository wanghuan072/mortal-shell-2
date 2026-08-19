import { weapons, type Weapon } from "./weapon";
import { shells, type ShellRecord } from "./shell";
import { tarstones, type TarstoneRecord } from "./tarstone";

export type SkillType = "Weapon Skill" | "Shell Ability" | "Passive";
export type SkillStatus = "Verified" | "Extracted / Unconfirmed";
export type SkillOwnerType = "Weapon" | "Shell";

export type SkillRecord = {
  id: string;
  name: string;
  type: SkillType;
  owner: string;
  ownerType: SkillOwnerType;
  status: SkillStatus;
  description: string;
  effect: string;
  damage: string;
  breakDamage: string;
  hitCount: string;
  cost: string;
  cooldown: string;
  statusEffects: string[];
  scaling: string;
  unlock: string;
  image?: string;
};

export const skillTypes: SkillType[] = ["Weapon Skill", "Shell Ability", "Passive"];
export const skillOwnerTypes: SkillOwnerType[] = ["Weapon", "Shell"];
export const skillStatuses: SkillStatus[] = ["Verified", "Extracted / Unconfirmed"];

const unverified = "Unverified";

type SkillEnrichment = Partial<Pick<SkillRecord,
  "effect" | "damage" | "breakDamage" | "hitCount" | "cost" | "cooldown" | "statusEffects" | "scaling" | "unlock" | "image"
>>;

const publicSkillKey = (name: string, owner: string) => `${name}::${owner}`;

const shellAbilityNamed = (owner: string, name: string) => shells
  .find((shell) => shell.name === owner)
  ?.abilities.find((ability) => ability.name === name);

const weaponSkillSource = (tarstoneName: string, skillName: string, weaponId: string) => tarstones.find((record) => record.name === tarstoneName
  && record.trigger.includes(skillName)
  && record.compatibleEquipment.some((reference) => reference.kind === "weapon" && reference.id === weaponId));

const levelValues = (record: TarstoneRecord | undefined, label: string) => record?.levels.map(({ effects }) => effects.find((effect) => effect.label === label)?.value).filter((value): value is string => Boolean(value)) ?? [];

const sharedLevelValue = (record: TarstoneRecord | undefined, label: string) => {
  const values = levelValues(record, label);
  return values.length === 3 && new Set(values).size === 1 ? values[0] : undefined;
};

const leveledValue = (record: TarstoneRecord | undefined, label: string) => {
  const values = levelValues(record, label);
  return values.length === 3 ? values.join(" / ") : undefined;
};

const fortifiedPlate = shellAbilityNamed("Lazlo", "Fortified Plate");
const retribution = shellAbilityNamed("Lazlo", "Retribution");
const magdalenasMemento = weaponSkillSource("Magdalena's Memento", "Deadly Flurry", "axe-dagger");
const shrikeStone = weaponSkillSource("Shrike Stone", "Plummet Strike", "hadern-sword");

const deadlyFlurryStagger = sharedLevelValue(magdalenasMemento, "Stagger Damage");
const deadlyFlurryCost = sharedLevelValue(magdalenasMemento, "Resolve Cost");
const plummetDamageMultiplier = sharedLevelValue(shrikeStone, "Damage Multiplier");
const plummetShockwaveDamage = sharedLevelValue(shrikeStone, "Shockwave Damage");
const plummetStagger = sharedLevelValue(shrikeStone, "Stagger Damage");
const plummetBreakDamage = leveledValue(shrikeStone, "Break Damage");
const plummetCost = leveledValue(shrikeStone, "Resolve Cost");

const skillEnrichments: Record<string, SkillEnrichment> = {
  [publicSkillKey("Shoulder Bash", "Eredrim")]: { image: "/assets/skills/shoulder-bash.png" },
  [publicSkillKey("Stone Stun", "Harros")]: { image: "/assets/skills/stone-stun.png" },
  [publicSkillKey("Shadow Dash", "Tiel")]: { image: "/assets/skills/shadow-dash.png" },
  [publicSkillKey("Lingering Shadow", "Tiel")]: { image: "/assets/skills/lingering-shadow.png" },
  [publicSkillKey("Biosampler", "Proxima")]: { image: "/assets/skills/biosampler.png" },
  [publicSkillKey("Fortified Plate", "Lazlo")]: {
    effect: fortifiedPlate ? "Base 20% damage reduction while Lazlo's armor is active." : unverified,
  },
  [publicSkillKey("Retribution", "Lazlo")]: {
    effect: retribution ? "Repeated use causes Overheat, producing a stronger burning shockwave and temporarily disabling Lazlo's armor." : unverified,
    statusEffects: retribution ? ["Overheat after repeated use", "Burning shockwave while Overheated"] : [],
  },
  [publicSkillKey("Deadly Flurry", "Axe & Dagger")]: {
    effect: magdalenasMemento?.description ?? unverified,
    breakDamage: deadlyFlurryStagger ? `${deadlyFlurryStagger} Stagger Damage` : unverified,
    cost: deadlyFlurryCost ? `${deadlyFlurryCost} Resolve` : unverified,
    unlock: magdalenasMemento ? `Activated by ${magdalenasMemento.name} on Axe & Dagger.` : unverified,
  },
  [publicSkillKey("Plummet Strike", "The Iconoclast")]: {
    image: "/assets/skills/plummet-strike.png",
    effect: shrikeStone?.description ?? unverified,
    damage: plummetDamageMultiplier && plummetShockwaveDamage
      ? `${plummetDamageMultiplier} Damage Multiplier; ${plummetShockwaveDamage} Shockwave Damage`
      : unverified,
    breakDamage: plummetStagger && plummetBreakDamage
      ? `${plummetStagger} Stagger Damage; ${plummetBreakDamage} Break Damage at Tarstone levels I / II / III`
      : unverified,
    cost: plummetCost
      ? `${plummetCost} Resolve at Tarstone levels I / II / III`
      : unverified,
    unlock: shrikeStone ? `Activated by ${shrikeStone.name} on The Iconoclast.` : unverified,
  },
};

const createSkill = (
  id: string,
  name: string,
  type: SkillType,
  owner: string,
  ownerType: SkillOwnerType,
  status: SkillStatus,
  description: string,
): SkillRecord => ({
  id,
  name,
  type,
  owner,
  ownerType,
  status,
  description,
  effect: unverified,
  damage: unverified,
  breakDamage: unverified,
  hitCount: unverified,
  cost: unverified,
  cooldown: unverified,
  statusEffects: [],
  scaling: unverified,
  unlock: unverified,
  ...skillEnrichments[publicSkillKey(name, owner)],
});

const weaponSkills = (records: Weapon[]): SkillRecord[] => records.flatMap((weapon) => weapon.skills
  .filter(({ name }) => name !== unverified)
  .map(({ name, description }) => createSkill(
    `${weapon.id}-${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "")}`,
    name,
    "Weapon Skill",
    weapon.name,
    "Weapon",
    "Extracted / Unconfirmed",
    description,
  )));

const shellSkills = (records: ShellRecord[]): SkillRecord[] => records.flatMap((shell) => shell.abilities.map(({ type, name, description }) => createSkill(
  `${shell.id}-${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "")}`,
  name,
  type,
  shell.name,
  "Shell",
  shell.status,
  description,
)));

export const skills: SkillRecord[] = [
  ...weaponSkills(weapons),
  ...shellSkills(shells),
];
