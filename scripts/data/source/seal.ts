export const sealAbilities = ["All Abilities", "Guard", "Harden", "Parry", "Gloomslayer"] as const;

export type SealAbility = Exclude<(typeof sealAbilities)[number], "All Abilities">;
export type SealAbilityFilter = (typeof sealAbilities)[number];
export type SealAcquisitionStatus =
  | "Verified Route and Location"
  | "Verified Route; Location Unconfirmed"
  | "Not Confirmed in Current Demo Data";
export type SealResource = "Break Damage" | "Health" | "Resolve" | "Sidearm";
export type SealEffect = { label: string; value: string };
export type SealRecord = {
  id: string;
  name: string;
  ability: SealAbility;
  role: string;
  description: string;
  activation: string;
  effects: SealEffect[];
  resourceRelations: SealResource[];
  acquisition: string;
  acquisitionStatus: SealAcquisitionStatus;
  image: string;
};

const untarnished: SealRecord = {
  id: "untarnished-seal",
  name: "Untarnished Seal",
  ability: "Guard",
  role: "Defensive guard and timed counter",
  description: "Both symbol and weapon, the seal has been restored to its former glory.",
  activation: "Block incoming attacks with your Weapon. Time the block to perform a Perfect Guard.",
  effects: [
    { label: "Guard", value: "Blocks incoming attacks with the equipped Weapon." },
    { label: "Perfect Guard", value: "A correctly timed Guard deals Break Damage." },
  ],
  resourceRelations: ["Break Damage"],
  acquisition: "Acquisition is not confirmed in the current Demo data.",
  acquisitionStatus: "Not Confirmed in Current Demo Data",
  image: "/assets/seals/untarnished-seal.png",
};

const vatras: SealRecord = {
  id: "vatras-seal",
  name: "Vatra's Seal",
  ability: "Harden",
  role: "Reactive defense and timed counter",
  description: "Used in stonebirth rituals, this seal possesses a fraction of its creator’s power.",
  activation: "Harden to withstand the next attack. Time the defense to perform a Perfect Harden.",
  effects: [
    { label: "Harden", value: "Withstands the next incoming attack." },
    { label: "Perfect Harden", value: "A correctly timed Harden deals Break Damage." },
  ],
  resourceRelations: ["Break Damage"],
  acquisition: "Acquisition is not confirmed in the current Demo data.",
  acquisitionStatus: "Not Confirmed in Current Demo Data",
  image: "/assets/seals/vatras-seal.png",
};

const infinite: SealRecord = {
  id: "infinite-seal",
  name: "Infinite Seal",
  ability: "Parry",
  role: "High-risk timed counter",
  description: "This seal is no doubt grand, but unfathomable.",
  activation: "Time the Parry against incoming attacks to Break enemies more efficiently at greater risk.",
  effects: [
    { label: "Parry", value: "Breaks enemies more efficiently when correctly timed." },
    { label: "Risk", value: "Carries greater risk." },
  ],
  resourceRelations: ["Break Damage"],
  acquisition: "Granted through a dialogue event; exact source and location are not confirmed.",
  acquisitionStatus: "Verified Route; Location Unconfirmed",
  image: "/assets/seals/infinite-seal.png",
};

const slayer: SealRecord = {
  id: "slayer-seal",
  name: "Slayer Seal",
  ability: "Gloomslayer",
  role: "Sidearm pressure and Riposte recovery",
  description: "The Gloomslayer once wielded this seal on a doomed crusade.",
  activation: "Use Sidearms to deal Break Damage and perform a successful Riposte to recover resources.",
  effects: [
    { label: "Sidearms", value: "Sidearms deal Break Damage." },
    { label: "Riposte", value: "A successful Riposte restores some Health and Resolve." },
  ],
  resourceRelations: ["Sidearm", "Break Damage", "Health", "Resolve"],
  acquisition: "Claimed from a dedicated Seal pickup; exact location is not confirmed.",
  acquisitionStatus: "Verified Route; Location Unconfirmed",
  image: "/assets/seals/slayer-seal.png",
};

export const seals: SealRecord[] = [untarnished, vatras, infinite, slayer];

export function filterSeals(records: SealRecord[], query: string, ability: SealAbilityFilter) {
  const needle = query.trim().toLowerCase();
  return records.filter((seal) => {
    const publicText = [
      seal.name,
      seal.ability,
      seal.role,
      seal.description,
      seal.activation,
      ...seal.effects.flatMap(({ label, value }) => [label, value]),
      ...seal.resourceRelations,
      seal.acquisition,
      seal.acquisitionStatus,
    ]
      .join(" ")
      .toLowerCase();
    return (!needle || publicText.includes(needle)) &&
      (ability === "All Abilities" || seal.ability === ability);
  });
}
