import { sidearms } from "./sidearm";
import { weapons } from "./weapon";

export const tarstoneSlots = ["All Slots", "Melee", "Sidearm", "Support"] as const;
export const tarstoneEffectTypes = ["All Effects", "Combat Ability", "Infusion", "Modifier", "Support"] as const;

export type TarstoneSlot = Exclude<(typeof tarstoneSlots)[number], "All Slots">;
export type TarstoneEffectType = Exclude<(typeof tarstoneEffectTypes)[number], "All Effects">;
export type TarstoneFilterSlot = (typeof tarstoneSlots)[number];
export type TarstoneFilterEffect = (typeof tarstoneEffectTypes)[number];

export type TarstoneEffect = { label: string; value: string };
export type TarstoneLevel = { level: "I" | "II" | "III"; effects: TarstoneEffect[] };
export type CompatibleEquipmentRef = {
  kind: "weapon" | "sidearm";
  id: string;
};

export type TarstoneRecord = {
  id: string;
  name: string;
  slot: TarstoneSlot;
  effectType: TarstoneEffectType;
  description: string;
  trigger: string;
  compatibleEquipment: CompatibleEquipmentRef[];
  levels: TarstoneLevel[];
  acquisition: string;
  boss?: string;
  specialRestriction?: string;
  image?: string;
};

const levels = (one: TarstoneEffect[], two: TarstoneEffect[], three: TarstoneEffect[]): TarstoneLevel[] => [
  { level: "I", effects: one },
  { level: "II", effects: two },
  { level: "III", effects: three },
];

const unknownAcquisition = "Not confirmed in Demo data";

export const tarstones: TarstoneRecord[] = [
  {
    id: "parasitic-stone",
    name: "Parasitic Stone",
    slot: "Melee",
    effectType: "Modifier",
    description: "Slaying foes grants you Leech.",
    trigger: "Defeat an enemy with the equipped melee weapon.",
    compatibleEquipment: [{ kind: "weapon", id: "axe-dagger" }, { kind: "weapon", id: "hadern-sword" }],
    levels: levels(
      [{ label: "Leech per Kill", value: "1 stack" }],
      [{ label: "Leech per Kill", value: "2 stacks" }],
      [{ label: "Leech per Kill", value: "3 stacks" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/parasitic-stone.png",
  },
  {
    id: "unwieldly-stone",
    name: "Unwieldly Stone",
    slot: "Melee",
    effectType: "Combat Ability",
    description: "Consume Resolve to perform a Charged Heavy Attack.",
    trigger: "Activate the equipped melee Tarstone ability.",
    compatibleEquipment: [{ kind: "weapon", id: "battle-axe" }, { kind: "weapon", id: "axe-dagger" }, { kind: "weapon", id: "black-needle" }, { kind: "weapon", id: "clockwork-scythe" }, { kind: "weapon", id: "hadern-sword" }, { kind: "weapon", id: "heavy-hammer" }, { kind: "weapon", id: "martyrs-blade" }, { kind: "weapon", id: "axatana" }],
    levels: levels(
      [{ label: "Resolve Cost", value: "25" }, { label: "Shockwave", value: "5 stacks" }, { label: "Healing", value: "0" }, { label: "Leech", value: "2 stacks" }],
      [{ label: "Resolve Cost", value: "25" }, { label: "Shockwave", value: "8 stacks" }, { label: "Healing", value: "20" }, { label: "Leech", value: "3 stacks" }],
      [{ label: "Resolve Cost", value: "25" }, { label: "Shockwave", value: "12 stacks" }, { label: "Healing", value: "25" }, { label: "Leech", value: "5 stacks" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/unwieldly-stone.png",
  },
  {
    id: "arbiters-prize",
    name: "Arbiter's Prize",
    slot: "Melee",
    effectType: "Infusion",
    description: "Consume Resolve to infuse your weapon with Bloodcurse.",
    trigger: "Activate the melee infusion.",
    compatibleEquipment: [{ kind: "weapon", id: "axe-dagger" }, { kind: "weapon", id: "hadern-sword" }, { kind: "weapon", id: "clockwork-scythe" }],
    levels: levels(
      [{ label: "Resolve Cost", value: "30" }, { label: "Infused Attacks", value: "4" }, { label: "Bloodcurse", value: "1 stack" }],
      [{ label: "Resolve Cost", value: "30" }, { label: "Infused Attacks", value: "8" }, { label: "Bloodcurse", value: "1 stack" }],
      [{ label: "Resolve Cost", value: "0" }, { label: "Infusion", value: "Permanent" }, { label: "Bloodcurse", value: "2 stacks" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/arbiters-prize.png",
  },
  {
    id: "acolytes-stone",
    name: "Acolyte's Stone",
    slot: "Melee",
    effectType: "Combat Ability",
    description: "Consume Resolve to perform a Charged Light Attack.",
    trigger: "Activate the equipped melee Tarstone ability.",
    compatibleEquipment: [{ kind: "weapon", id: "battle-axe" }, { kind: "weapon", id: "axe-dagger" }, { kind: "weapon", id: "black-needle" }, { kind: "weapon", id: "clockwork-scythe" }, { kind: "weapon", id: "hadern-sword" }, { kind: "weapon", id: "heavy-hammer" }, { kind: "weapon", id: "martyrs-blade" }, { kind: "weapon", id: "axatana" }],
    levels: levels(
      [{ label: "Resolve Cost", value: "15" }, { label: "Shockwave", value: "5 stacks" }, { label: "Critical Chance", value: "+15%" }, { label: "Critical Damage", value: "×1.00" }],
      [{ label: "Resolve Cost", value: "15" }, { label: "Shockwave", value: "8 stacks" }, { label: "Critical Chance", value: "+15%" }, { label: "Critical Damage", value: "×1.50" }],
      [{ label: "Resolve Cost", value: "10" }, { label: "Shockwave", value: "12 stacks" }, { label: "Critical Chance", value: "+15%" }, { label: "Critical Damage", value: "×1.50" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/acolytes-stone.png",
  },
  {
    id: "magdalenas-memento",
    name: "Magdalena's Memento",
    slot: "Melee",
    effectType: "Combat Ability",
    description: "Rise into the air and unleash a flurry of ruthless strikes.",
    trigger: "Consume Resolve to activate Deadly Flurry.",
    compatibleEquipment: [{ kind: "weapon", id: "axe-dagger" }],
    levels: levels(
      [{ label: "Resolve Cost", value: "70" }, { label: "Stagger Damage", value: "20" }, { label: "Critical Chance", value: "0%" }, { label: "Critical Damage", value: "×0.00" }],
      [{ label: "Resolve Cost", value: "70" }, { label: "Stagger Damage", value: "20" }, { label: "Critical Chance", value: "+15%" }, { label: "Critical Damage", value: "×0.50" }],
      [{ label: "Resolve Cost", value: "70" }, { label: "Stagger Damage", value: "20" }, { label: "Critical Chance", value: "+15%" }, { label: "Critical Damage", value: "×1.00" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/magdalenas-memento.png",
  },
  {
    id: "shrike-stone",
    name: "Shrike Stone",
    slot: "Melee",
    effectType: "Combat Ability",
    description: "Leap high and plunge your weapon into the ground ahead.",
    trigger: "Consume Resolve to activate Plummet Strike.",
    compatibleEquipment: [{ kind: "weapon", id: "hadern-sword" }],
    levels: levels(
      [{ label: "Resolve Cost", value: "70" }, { label: "Damage Multiplier", value: "×2.00" }, { label: "Stagger Damage", value: "70" }, { label: "Shockwave Damage", value: "150" }, { label: "Break Damage", value: "0" }],
      [{ label: "Resolve Cost", value: "50" }, { label: "Damage Multiplier", value: "×2.00" }, { label: "Stagger Damage", value: "70" }, { label: "Shockwave Damage", value: "150" }, { label: "Break Damage", value: "0" }],
      [{ label: "Resolve Cost", value: "50" }, { label: "Damage Multiplier", value: "×2.00" }, { label: "Stagger Damage", value: "70" }, { label: "Shockwave Damage", value: "150" }, { label: "Break Damage", value: "100" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/shrike-stone.png",
  },
  {
    id: "tarblighted-trophy",
    name: "Tarblighted Trophy",
    slot: "Sidearm",
    effectType: "Combat Ability",
    description: "Launch a heavy round that detonates above the target and scatters explosive projectiles below.",
    trigger: "Consume Resolve to fire the secondary Sidearm attack.",
    compatibleEquipment: [{ kind: "sidearm", id: "naylshotte" }, { kind: "sidearm", id: "forgotten-crossbow" }],
    levels: levels(
      [{ label: "Resolve Cost", value: "40" }, { label: "Projectiles", value: "1 stack" }, { label: "Explosion Damage", value: "8" }, { label: "Activations", value: "2" }],
      [{ label: "Resolve Cost", value: "40" }, { label: "Projectiles", value: "2 stacks" }, { label: "Explosion Damage", value: "12" }, { label: "Activations", value: "2" }],
      [{ label: "Resolve Cost", value: "40" }, { label: "Projectiles", value: "2 stacks" }, { label: "Explosion Damage", value: "14" }, { label: "Activations", value: "3" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/tarblighted-trophy.png",
  },
  {
    id: "corroded-stone",
    name: "Corroded Stone",
    slot: "Sidearm",
    effectType: "Modifier",
    description: "Projectiles begin dealing damage over time after hitting their target.",
    trigger: "Hit a target with a compatible Sidearm projectile.",
    compatibleEquipment: [{ kind: "sidearm", id: "naylshotte" }, { kind: "sidearm", id: "forgotten-crossbow" }, { kind: "sidearm", id: "salvaged-trebuchaxe" }, { kind: "sidearm", id: "ballistazooka" }],
    levels: levels(
      [{ label: "Damage per Tick", value: "0.20" }, { label: "Tick Period", value: "1 second" }, { label: "Duration", value: "3 seconds" }],
      [{ label: "Damage per Tick", value: "0.30" }, { label: "Tick Period", value: "1 second" }, { label: "Duration", value: "5 seconds" }],
      [{ label: "Damage per Tick", value: "0.40" }, { label: "Tick Period", value: "1 second" }, { label: "Duration", value: "5 seconds" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/corroded-stone.png",
  },
  {
    id: "volatile-fragment",
    name: "Volatile Fragment",
    slot: "Sidearm",
    effectType: "Modifier",
    description: "Enemies killed by a ranged attack explode and deal splash damage.",
    trigger: "Kill an enemy with a compatible ranged attack.",
    compatibleEquipment: [{ kind: "sidearm", id: "forgotten-crossbow" }, { kind: "sidearm", id: "caged-hystrix" }, { kind: "sidearm", id: "salvaged-trebuchaxe" }, { kind: "sidearm", id: "naylshotte" }, { kind: "sidearm", id: "ballistazooka" }],
    levels: levels(
      [{ label: "Explosion Damage", value: "15" }],
      [{ label: "Explosion Damage", value: "25" }],
      [{ label: "Explosion Damage", value: "35" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/volatile-fragment.png",
  },
  {
    id: "emberseed-stone",
    name: "Emberseed Stone",
    slot: "Sidearm",
    effectType: "Infusion",
    description: "Consume Resolve to infuse your Sidearm with Burn.",
    trigger: "Activate the Sidearm infusion.",
    compatibleEquipment: [{ kind: "sidearm", id: "forgotten-crossbow" }, { kind: "sidearm", id: "naylshotte" }, { kind: "sidearm", id: "ballistazooka" }],
    specialRestriction: "Naylshotte inflicts Burn on critical hits only.",
    levels: levels(
      [{ label: "Resolve Cost", value: "20" }, { label: "Infused Shots", value: "4" }, { label: "Burn", value: "4 stacks" }],
      [{ label: "Resolve Cost", value: "20" }, { label: "Infused Shots", value: "8" }, { label: "Burn", value: "4 stacks" }],
      [{ label: "Resolve Cost", value: "0" }, { label: "Infusion", value: "Permanent" }, { label: "Burn", value: "2 stacks" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/emberseed-stone.png",
  },
  {
    id: "deadmans-stone",
    name: "Deadman's Stone",
    slot: "Support",
    effectType: "Support",
    description: "Improves melee Critical Chance.",
    trigger: "Applies while equipped in a Support slot.",
    compatibleEquipment: [{ kind: "weapon", id: "battle-axe" }, { kind: "weapon", id: "axe-dagger" }, { kind: "weapon", id: "black-needle" }, { kind: "weapon", id: "clockwork-scythe" }, { kind: "weapon", id: "hadern-sword" }, { kind: "weapon", id: "heavy-hammer" }, { kind: "weapon", id: "martyrs-blade" }, { kind: "weapon", id: "axatana" }],
    levels: levels(
      [{ label: "Melee Critical Chance", value: "+10%" }],
      [{ label: "Melee Critical Chance", value: "+15%" }],
      [{ label: "Melee Critical Chance", value: "+18%" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/deadmans-stone.png",
  },
  {
    id: "shattering-stone",
    name: "Shattering Stone",
    slot: "Support",
    effectType: "Support",
    description: "Improves melee Stagger Damage.",
    trigger: "Applies while equipped in a Support slot.",
    compatibleEquipment: [{ kind: "weapon", id: "battle-axe" }, { kind: "weapon", id: "axe-dagger" }, { kind: "weapon", id: "black-needle" }, { kind: "weapon", id: "clockwork-scythe" }, { kind: "weapon", id: "hadern-sword" }, { kind: "weapon", id: "heavy-hammer" }, { kind: "weapon", id: "martyrs-blade" }, { kind: "weapon", id: "axatana" }],
    levels: levels(
      [{ label: "Melee Stagger Damage", value: "×1.50" }],
      [{ label: "Melee Stagger Damage", value: "×2.00" }],
      [{ label: "Melee Stagger Damage", value: "×2.20" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/shattering-stone.png",
  },
  {
    id: "marksmans-stone",
    name: "Marksman's Stone",
    slot: "Support",
    effectType: "Support",
    description: "Improves ranged Critical Chance.",
    trigger: "Applies while equipped in a Support slot.",
    compatibleEquipment: [{ kind: "sidearm", id: "ballistazooka" }, { kind: "sidearm", id: "caged-hystrix" }, { kind: "sidearm", id: "cursed-child" }, { kind: "sidearm", id: "forgotten-crossbow" }, { kind: "sidearm", id: "naylshotte" }, { kind: "sidearm", id: "salvaged-trebuchaxe" }, { kind: "sidearm", id: "triarch-repeater" }, { kind: "sidearm", id: "troubadours-lute" }],
    levels: levels(
      [{ label: "Ranged Critical Chance", value: "+10%" }],
      [{ label: "Ranged Critical Chance", value: "+12%" }],
      [{ label: "Ranged Critical Chance", value: "+15%" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/marksmans-stone.png",
  },
  {
    id: "siegebreakers-stone",
    name: "Siegebreaker's Stone",
    slot: "Support",
    effectType: "Support",
    description: "Improves ranged Stagger Damage.",
    trigger: "Applies while equipped in a Support slot.",
    compatibleEquipment: [{ kind: "sidearm", id: "ballistazooka" }, { kind: "sidearm", id: "caged-hystrix" }, { kind: "sidearm", id: "cursed-child" }, { kind: "sidearm", id: "forgotten-crossbow" }, { kind: "sidearm", id: "naylshotte" }, { kind: "sidearm", id: "salvaged-trebuchaxe" }, { kind: "sidearm", id: "triarch-repeater" }, { kind: "sidearm", id: "troubadours-lute" }],
    levels: levels(
      [{ label: "Ranged Stagger Damage", value: "×1.50" }],
      [{ label: "Ranged Stagger Damage", value: "×2.00" }],
      [{ label: "Ranged Stagger Damage", value: "×2.50" }],
    ),
    acquisition: unknownAcquisition,
    image: "/assets/tarstones/siegebreakers-stone.png",
  },
];

export function filterTarstones(
  records: TarstoneRecord[],
  query: string,
  slot: TarstoneFilterSlot,
  effectType: TarstoneFilterEffect,
): TarstoneRecord[] {
  const needle = query.trim().toLowerCase();
  return records.filter((record) => {
    const text = [
      record.name,
      record.description,
      record.trigger,
      record.slot,
      record.effectType,
      record.compatibleEquipment.map((reference) => {
        const catalogue = reference.kind === "weapon" ? weapons : sidearms;
        return catalogue.find(({ id }) => id === reference.id)?.name ?? "";
      }).join(" "),
      record.acquisition,
      record.boss ?? "",
      record.specialRestriction ?? "",
      record.levels.flatMap(({ effects }) => effects.flatMap(({ label, value }) => [label, value])).join(" "),
    ].join(" ").toLowerCase();
    return (!needle || text.includes(needle))
      && (slot === "All Slots" || record.slot === slot)
      && (effectType === "All Effects" || record.effectType === effectType);
  });
}
