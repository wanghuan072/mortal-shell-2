export type Sidearm = {
  id: string;
  name: string;
  family: "Ranged Weapon" | "Utility";
  description: string;
  image?: string;
  attributes: Array<{ label: string; value: string }>;
  fireMode: string;
  combatNotes: string[];
  baseDamage?: number;
  projectiles?: number;
  progression: Array<{ level: number; damageMultiplier: number; energyCostMultiplier: number }>;
  upgradePool: string[];
  acquisition: string;
};

const damageMultipliers = [1, 1.05, 1.05, 1.1, 1.1, 1.1, 1.15, 1.2, 1.2, 1.3, 1.33, 1.45, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2];

export const sidearmProgression = damageMultipliers.map((damageMultiplier, level) => ({
  level,
  damageMultiplier,
  energyCostMultiplier: Number((1 - level * 0.035).toFixed(3)),
}));

const unknownAttributes = [
  { label: "Base Damage", value: "Unverified" },
  { label: "Energy Cost", value: "Unverified" },
  { label: "Ammo Capacity", value: "Unverified" },
  { label: "Poise Damage", value: "Unverified" },
];

const ranged = (record: Omit<Sidearm, "family" | "attributes" | "progression"> & { attributes?: Sidearm["attributes"]; progression?: Sidearm["progression"] }): Sidearm => ({
  family: "Ranged Weapon",
  attributes: unknownAttributes,
  progression: sidearmProgression,
  ...record,
});

export const sidearms: Sidearm[] = [
  ranged({ id: "ballistazooka", name: "Ballistazooka", description: "Heavy and unwieldy, scholars argue if the weapon was ever used in battle or just executions in Muraden.", fireMode: "Heavy projectile", combatNotes: ["A primary-fire sidearm implementation and projectile system are present."], upgradePool: [], acquisition: "A dedicated tomb-unlock encounter is present; its exact location is not yet verified." }),
  ranged({ id: "caged-hystrix", name: "Caged Hystrix", description: "The contraption pierces the creature trapped inside, prompting a violent and often useful reaction.", fireMode: "Creature-powered projectile", combatNotes: ["Primary-fire, projectile effects, and Poison/Curse variants are present."], upgradePool: [], acquisition: "Acquisition method is not yet verified." }),
  ranged({ id: "cursed-child", name: "Cursed Child", description: "Stranded between life and death, this child yearns to be held and will desperately protect its caretaker.", fireMode: "Special ranged attack", combatNotes: ["The item occupies the Sidearm slot and exposes a primary ability input."], upgradePool: [], acquisition: "Acquisition method is not yet verified." }),
  ranged({ id: "forgotten-crossbow", name: "Forgotten Crossbow", description: "Traded to a merchant by a desperate addict, this crossbow is surprisingly well-calibrated.", baseDamage: 45, projectiles: 1, attributes: [{ label: "Base Damage", value: "45" }, { label: "Energy Cost", value: "17" }, { label: "Ammo Capacity", value: "Unverified" }, { label: "Poise Damage", value: "Unverified" }], fireMode: "Single projectile", combatNotes: ["Aim-required primary fire.", "Uses a dedicated projectile with homing-assist support."], upgradePool: [], acquisition: "A dedicated weapon-claim interaction is present; its exact location is not yet verified." }),
  ranged({ id: "naylshotte", name: "Naylshotte", description: "Accursed arms birthed by a malevolent forge rumored to have a will of its own.", baseDamage: 10, projectiles: 10, attributes: [{ label: "Base Damage", value: "10 per projectile" }, { label: "Projectiles", value: "10" }, { label: "Energy Cost", value: "28" }, { label: "Ammo Capacity", value: "4" }, { label: "Poise Damage", value: "4 per projectile" }], fireMode: "10-projectile spread", combatNotes: ["Maximum raw close-range hit: 100 at +0 before defenses.", "Actual total depends on spread, distance falloff, and connected projectiles."], upgradePool: [], acquisition: "Acquisition method is not yet verified." }),
  ranged({ id: "salvaged-trebuchaxe", name: "Salvaged Trebuchaxe", description: "Surprisingly sophisticated for a device that utilizes axes as projectiles.", fireMode: "Axe projectile", combatNotes: ["The item occupies the Sidearm slot and exposes a primary ability input."], upgradePool: [], acquisition: "Acquisition method is not yet verified." }),
  ranged({ id: "triarch-repeater", name: "Triarch Repeater", description: "Carved bone and grafted metal reinforcements hint at this strange weapon's otherworldly origins.", fireMode: "Automatic burst", combatNotes: ["Hold-to-fire burst logic, recoil, spread, and a primary-fire implementation are present."], upgradePool: [], acquisition: "A dedicated tomb encounter is present; its exact location is not yet verified." }),
  { id: "troubadours-lute", name: "Troubadour's Lute", family: "Utility", description: "A relic of a simpler time. Favored by wanderers, this lute soothes man and beast alike.", attributes: [{ label: "Base Damage", value: "Not applicable" }, { label: "Function", value: "Music / Utility" }], fireMode: "Play music", combatNotes: ["Uses the Sidearm slot but is not classified as a conventional ranged damage weapon."], progression: [], upgradePool: [], acquisition: "Acquisition method is not yet verified." },
];

export const sidearmFamilies = ["All Sidearms", "Ranged Weapon", "Utility"] as const;
