export const artifactFamilies = [
  "All Artifacts",
  "Ancient Nectar",
  "Bygone Nectar",
  "Fragrant Nectar",
  "Preserved Nectar",
  "Pristine Nectar",
  "Blessing",
  "Unclassified",
] as const;

export type ArtifactFamily = Exclude<(typeof artifactFamilies)[number], "All Artifacts">;
export type ArtifactStatus = "Verified" | "Extracted / Unconfirmed";
export type ArtifactEffect = {
  label: string;
  value: string;
  trigger?: string;
  target?: string;
  duration?: string;
  cooldown?: string;
  stackRule?: string;
  procChance?: string;
};
export type ArtifactUpgrade = { tier: string; change: string };
export type ArtifactRecord = {
  id: string;
  name: string;
  family: ArtifactFamily;
  status: ArtifactStatus;
  description: string;
  effects: ArtifactEffect[];
  acquisition: string;
  upgrades: ArtifactUpgrade[];
  image?: string;
};

const selection = "Available through the Combat Artifact selection system; individual selection conditions are unverified.";
const record = (
  id: string,
  name: string,
  family: ArtifactFamily,
  description: string,
  effect: ArtifactEffect,
): ArtifactRecord => ({ id, name, family, status: "Verified", description, effects: [effect], acquisition: selection, upgrades: [] });

export const artifacts: ArtifactRecord[] = [
  record("acolytes-thorns", "Acolyte's Thorns", "Ancient Nectar", "Returns part of a melee attack to its source.", { label: "Retaliation", value: "1 damage", trigger: "When struck by a melee attack", target: "Attacker" }),
  record("ascetics-alchemy-stone", "Ascetic's Alchemy Stone", "Ancient Nectar", "Turns newly gained abilities into a small Coin reward.", { label: "Coin Gain", value: "1 Coin", trigger: "When gaining an ability", target: "Player" }),
  record("black-blood", "Black Blood", "Ancient Nectar", "Strengthens melee attacks while the Shell is near death.", { label: "Bonus Damage", value: "1% extra melee damage", trigger: "While Shell Health is below 2", target: "Enemies" }),
  record("solomons-effigy", "Solomon's Effigy", "Ancient Nectar", "Makes Resolve gains from all sources more efficient.", { label: "Resolve Gain", value: "+1 Resolve", trigger: "Whenever Resolve is gained", target: "Player" }),
  record("imperial-writ", "Imperial Writ", "Ancient Nectar", "Rewards successful pickups with Coin.", { label: "Coin Gain", value: "1 Coin", trigger: "When picking up an item", target: "Player" }),
  record("scripture-of-penance", "Scripture of Penance", "Ancient Nectar", "Offers Resolve when the Foundling is struck without any available.", { label: "Resolve Gain", value: "1 Resolve segment", trigger: "When struck with no Resolve", target: "Player" }),
  record("tar-forged-idol", "Tar-Forged Idol", "Ancient Nectar", "A compact idol that yields Coin.", { label: "Coin Gain", value: "1 Coin", trigger: "On acquisition", target: "Player" }),
  { ...record("mammon-coin", "Mammon Coin", "Ancient Nectar", "A combat Artifact that grants Coin; it is distinct from the sellable Coin of Mammon.", { label: "Coin Gain", value: "1 Coin", trigger: "On acquisition", target: "Player" }), image: "/assets/artifacts/mammon-coin.png" },
  record("tattered-effigy-of-the-scholar", "Tattered Effigy of the Scholar", "Ancient Nectar", "Restores a small amount of Resolve after the Foundling is struck.", { label: "Resolve Gain", value: "Small amount", trigger: "When struck", target: "Player" }),
  record("eredrims-initiate-talisman", "Eredrim's Initiate Talisman", "Bygone Nectar", "Rewards attacks against enemies at full health.", { label: "Bonus Damage", value: "1 extra damage", trigger: "When attacking an enemy at full health", target: "Enemy" }),
  record("martyrs-cursing-charm", "Martyr's Cursing Charm", "Bygone Nectar", "Reflects a Curse stack when the Foundling is struck.", { label: "Curse", value: "1 Curse stack", trigger: "When struck", target: "Attacker" }),
  record("twiceborns-requital", "Twiceborn's Requital", "Bygone Nectar", "A Twiceborn relic whose combat magnitude is not exposed in the current verified record.", { label: "Combat Effect", value: "Unverified", trigger: "Unverified" }),
  record("crest-of-brotherhood", "Crest of Brotherhood", "Bygone Nectar", "Restores spent Shell Fill when reviving a Shell.", { label: "Shell Fill", value: "Restore all Resolve segments", trigger: "When reviving a Shell", target: "Player" }),
  record("gentlemans-tea-cup", "Gentleman's Tea Cup", "Bygone Nectar", "Conversation with another survivor restores a trace of health.", { label: "Healing", value: "1 health", trigger: "When speaking to an NPC", target: "Player" }),
  record("molten-shaft", "Molten Shaft", "Bygone Nectar", "Adds Burning to abilities that inflict Burn.", { label: "Burn", value: "+1 Burn stack", trigger: "When an ability inflicts Burn", target: "Enemy" }),
  record("perfumed-censer", "Perfumed Censer", "Bygone Nectar", "Adds Poison to abilities that inflict Poison.", { label: "Poison", value: "+1 Poison stack", trigger: "When an ability inflicts Poison", target: "Enemy" }),
  record("foul-censer", "Foul Censer", "Fragrant Nectar", "Spreads Poison from dying enemies to a nearby target.", { label: "Poison Transfer", value: "All Poison stacks", trigger: "When a poisoned enemy dies", target: "Nearby enemy" }),
  record("clockwork-sight", "Clockwork Sight", "Fragrant Nectar", "Rewards a Sidearm strike followed quickly by another Sidearm strike.", { label: "Bonus Damage", value: "1 extra damage", trigger: "After a Sidearm attack hit in the last 2 seconds", target: "Enemy", duration: "2 seconds" }),
  record("hungry-tarstone", "Hungry Tarstone", "Fragrant Nectar", "Rewards repeated attacks against the same enemy.", { label: "Bonus Damage", value: "1 extra damage", trigger: "Fourth attack on the same enemy", target: "Enemy" }),
  record("seal-of-the-stonebound", "Seal of the Stonebound", "Fragrant Nectar", "Briefly prevents damage from the next hit, then regenerates.", { label: "Damage Prevention", value: "Next hit", trigger: "When available", target: "Player", cooldown: "Regenerates every 1 second" }),
  record("genessas-rosary", "Genessa's Rosary", "Preserved Nectar", "Periodically negates incoming damage.", { label: "Damage Prevention", value: "All damage from every 1 hit", trigger: "On incoming damage", target: "Player" }),
  record("scholars-amulet", "Scholar's Amulet", "Preserved Nectar", "Converts a Resolve segment into healing.", { label: "Healing", value: "1 health", trigger: "When consuming a Resolve segment", target: "Player" }),
  record("tarsus-gauntlet", "Tarsus Gauntlet", "Preserved Nectar", "Turns a Resolve segment into a freezing shockwave.", { label: "Freeze Shockwave", value: "Freezes all enemies in range", trigger: "When consuming a Resolve segment", target: "Nearby enemies" }),
  record("mango", "Mango", "Pristine Nectar", "Increases the Shell's maximum health.", { label: "Maximum Shell Health", value: "+1", trigger: "While held", target: "Player" }),
  record("saved-by-the-shell", "Saved by the Shell", "Pristine Nectar", "Allows the Shell to revive the Foundling instead of dying.", { label: "Automatic Revival", value: "1% maximum health", trigger: "When lethal damage would be taken", target: "Player" }),
  record("solemn-offering", "Solemn Offering", "Pristine Nectar", "Successful parries restore health.", { label: "Healing", value: "1% maximum health", trigger: "On a successful parry", target: "Player" }),
  record("tarsalt-coating", "Tarsalt Coating", "Pristine Nectar", "Rewards melee hits against enemies at full health.", { label: "Healing", value: "1 health", trigger: "When striking an enemy at full health", target: "Player" }),
  record("twin-sesters-stone", "Twin Sesters Stone", "Pristine Nectar", "A relic of the Twin Sesters whose exact combat effect remains unverified.", { label: "Combat Effect", value: "Unverified", trigger: "Unverified" }),
  record("grishas-gift", "Grisha's Gift", "Unclassified", "May call a Grisha Spirit to aid the Foundling in combat.", { label: "Summon", value: "Grisha Spirit", trigger: "When attacking", target: "Player", procChance: "1%" }),
  record("blessing-of-the-bat", "Blessing of the Bat", "Blessing", "Restores a small amount of health on melee hits.", { label: "Healing", value: "1 health", trigger: "On a melee hit", target: "Player" }),
  record("blessing-of-the-frog", "Blessing of the Frog", "Blessing", "Makes poison effects more damaging.", { label: "Poison Damage", value: "+1", trigger: "While active", target: "Enemies" }),
  record("blessing-of-the-horse", "Blessing of the Horse", "Blessing", "Improves critical chance during sprint attacks.", { label: "Critical Chance", value: "+1", trigger: "On sprint attacks", target: "Player" }),
  record("gold-boost", "Gold Boost", "Blessing", "Increases Coin gained from defeated enemies.", { label: "Coin Gain", value: "+1 Coin", trigger: "When defeating an enemy", target: "Player" }),
  record("gorfs-blessing", "Gorf's Blessing", "Blessing", "Protects against poison and improves experience from defeated enemies.", { label: "Poison / Experience", value: "Poison immunity; +25 experience", trigger: "When defeating an enemy", target: "Player" }),
  record("lightning-immunity", "Lightning Immunity", "Blessing", "Protects the Foundling from lightning.", { label: "Lightning Damage", value: "Immune", trigger: "While active", target: "Player" }),
  record("xp-boost", "XP Boost", "Blessing", "Increases experience gained from defeated enemies.", { label: "Experience", value: "Unverified bonus", trigger: "When defeating an enemy", target: "Player" }),
];

export const verifiedArtifacts = artifacts.filter(({ status }) => status === "Verified");
export const findArtifact = (id: string) => artifacts.find((artifact) => artifact.id === id);
