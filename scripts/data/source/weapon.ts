import { forgeCosts } from "./forge";

export type Weapon = {
  id: string;
  name: string;
  family: string;
  image?: string;
  imageAlt?: string;
  description: string;
  attributes: Array<{ label: string; value: string }>;
  moveDamage: Array<{
    move: string;
    multiplier: string;
    damage0: string;
    damage20: string;
    poise0: string;
    poise20: string;
    note?: string;
  }>;
  moveDamageNote?: string;
  skills: Array<{ name: string; description: string }>;
  upgradePool: string[];
  upgrades: Array<{ level: string; material: string; quantity: string; coin: string }>;
  acquisition: string;
  acquisitionVerified: boolean;
};

const attributes = (baseDamage = "Unverified") => [
  { label: "Base Damage", value: baseDamage },
  { label: "Damage Multiplier", value: "×1.00 → ×2.00" },
  { label: "Poise Multiplier", value: "×1.00 → ×2.00" },
  { label: "Per Forge Level", value: "+5%" },
  { label: "Maximum Forge Level", value: "20" },
];

const ability = (name: string) => [{
  name,
  description: name === "Unverified"
    ? "No finished ability name was found in the current game string table."
    : "Ability name verified from the extracted game string table; detailed behavior is not yet verified.",
}];

const base = { attributes: attributes(), moveDamage: [], upgrades: forgeCosts, acquisitionVerified: false };

const unavailableMoveDamage = "No verifiable move-damage definitions are present in this Demo build.";

const iconoclastMoves = [
  ["Light I", "×1.00", "35", "70", "30", "60"],
  ["Light II", "×1.00", "35", "70", "30", "60"],
  ["Light III", "×1.00", "35", "70", "30", "60"],
  ["Light Finisher", "×1.00", "35", "70", "30", "60"],
  ["Heavy I", "×1.50", "52.5", "105", "40", "80"],
  ["Heavy II", "×1.50", "52.5", "105", "40", "80"],
  ["Heavy III", "×1.50", "52.5", "105", "40", "80"],
  ["Heavy Finisher", "×1.50", "52.5", "105", "40", "80"],
  ["Running Light", "×1.60", "56", "112", "45", "90"],
  ["Running Heavy", "×1.80", "63", "126", "50", "100"],
].map(([move, multiplier, damage0, damage20, poise0, poise20]) => ({ move, multiplier, damage0, damage20, poise0, poise20 }));

const blackNeedleMoves = [
  ["Light I", "×1.00", "25", "50", "15", "30"],
  ["Light II", "×1.00", "25", "50", "15", "30"],
  ["Light III", "×1.00", "25", "50", "15", "30"],
  ["Heavy I", "×1.50", "37.5", "75", "—", "—"],
  ["Heavy II", "×1.50", "37.5", "75", "—", "—"],
  ["Heavy III", "×1.50", "37.5", "75", "—", "—"],
  ["Heavy Finisher", "×1.50", "37.5", "75", "70", "140"],
  ["Running Light", "×1.80", "45", "90", "50", "100"],
  ["Running Heavy", "×1.80", "45", "90", "50", "100"],
].map(([move, multiplier, damage0, damage20, poise0, poise20]) => ({ move, multiplier, damage0, damage20, poise0, poise20 }));

const axeDaggerMoves = [
  ["Light I", "×1.00", "30 / 20", "60 / 40", "—", "—"],
  ["Light II", "×1.00", "30 / 20", "60 / 40", "—", "—"],
  ["Light III", "×1.00", "30 / 20", "60 / 40", "—", "—"],
  ["Heavy I", "×1.50", "45 / 30", "90 / 60", "25", "50"],
  ["Heavy II", "×1.50", "45 / 30", "90 / 60", "25", "50"],
  ["Heavy III", "×1.50", "45 / 30", "90 / 60", "25", "50"],
  ["Running Light", "×1.80", "54 / 36", "108 / 72", "60", "120"],
  ["Running Heavy", "×1.80", "54 / 36", "108 / 72", "60", "120"],
].map(([move, multiplier, damage0, damage20, poise0, poise20]) => ({ move, multiplier, damage0, damage20, poise0, poise20, note: "Axe / Dagger per hit source" }));

export const weapons: Weapon[] = [
  { ...base, moveDamageNote: unavailableMoveDamage, id: "battle-axe", name: "Veteran's Battle Axe", family: "Axe", image: "/assets/weapons/battle-axe-combat.jpg", imageAlt: "Veteran's Battle Axe shown in official Mortal Shell II gameplay", description: "This solid steel axe is rumored to have been quenched in the blood of the Revered.", skills: ability("Unverified"), upgradePool: ["Heavy Hold Attack", "Light Hold Attack", "Weapon Ability: Plummet Strike"], acquisition: "Unlocked through a medium tomb encounter.", acquisitionVerified: true },
  { ...base, attributes: attributes("Axe 30 / Dagger 20"), moveDamage: axeDaggerMoves, moveDamageNote: "Damage is shown per collision source: Axe / Dagger. Multi-hit combo totals depend on which hit windows connect.", id: "axe-dagger", name: "Axe & Dagger", family: "Paired Weapon", description: "An unusual pairing of a simple thief's tool and a vicious axe from the northern lands.", skills: ability("Deadly Flurry"), upgradePool: ["Grant Leech on Kill", "Heavy Hold Attack", "Inflict Bleed", "Light Hold Attack", "Weapon Ability: Deadly Flurry", "Weapon Ability: Plummet Strike"], acquisition: "Unlocked through a medium tomb encounter.", acquisitionVerified: true },
  { ...base, attributes: attributes("25"), moveDamage: blackNeedleMoves, moveDamageNote: "Charged, kick, and special-ability totals are runtime-driven and are omitted until their charge or hit-count formula is verified.", id: "black-needle", name: "Black Needle", family: "Spear", description: "Stolen from the Twiceborn, this spear enables the bearer to reach further and more quickly than seems physically plausible.", skills: ability("Needle Storm"), upgradePool: ["Weapon Ability: Plummet Strike"], acquisition: "A dedicated weapon-claim interaction exists, but its exact location is not yet verified." },
  { ...base, moveDamageNote: unavailableMoveDamage, id: "clockwork-scythe", name: "Clockwork Scythe", family: "Scythe", description: "The ambitious instrument of a madman or a genius, perhaps he was in fact both.", skills: ability("Clockwork Chainsaw"), upgradePool: ["Heavy Hold Attack", "Inflict Bleed", "Light Hold Attack"], acquisition: "Acquisition method is not yet verified." },
  { ...base, attributes: attributes("35"), moveDamage: iconoclastMoves, moveDamageNote: "Charged attacks are runtime-scaled; fixed uncharged and running-hit values are shown here.", id: "hadern-sword", name: "The Iconoclast", family: "Greatsword", description: "Exceptionally light for a two-hander, it was once held by a seedbearer of great renown.", skills: ability("Plummet Strike"), upgradePool: ["Grant Leech on Kill", "Heavy Hold Attack", "Inflict Bleed", "Light Hold Attack", "Weapon Ability: Deadly Flurry", "Weapon Ability: Plummet Strike"], acquisition: "A dedicated weapon-claim interaction exists, but its exact location is not yet verified." },
  { ...base, moveDamageNote: unavailableMoveDamage, id: "heavy-hammer", name: "Obsidian Hammer", family: "Hammer", description: "A brutalist chunk of obsidianite, profaned by bloodshed beyond the Seat of Infinity.", skills: ability("Heavy Stomps"), upgradePool: ["Heavy Hold Attack", "Light Hold Attack"], acquisition: "A weapon-unlock encounter exists, but its exact location is not yet verified." },
  { ...base, moveDamageNote: unavailableMoveDamage, id: "martyrs-blade", name: "Great Martyr's Blade", family: "Greatsword", description: "The devout weapon of the First Martyr Tarsus, reforged after his final sacrifice.", skills: ability("Spiral Surge"), upgradePool: ["Heavy Hold Attack", "Light Hold Attack"], acquisition: "Unlocked through a tomb encounter.", acquisitionVerified: true },
  { ...base, moveDamageNote: unavailableMoveDamage, id: "axatana", name: "Axatana", family: "Transforming Weapon", description: "Forged by an unrepentant smith, this exquisite weapon once bore the name Dream Thresher.", skills: ability("Morph Attack"), upgradePool: ["Heavy Hold Attack", "Light Hold Attack"], acquisition: "Acquisition method is not yet verified." },
];
