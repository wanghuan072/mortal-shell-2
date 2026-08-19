export const itemCategories = [
  "All Items",
  "Consumables",
  "Upgrade Materials",
  "Currencies",
  "Key Items",
  "Valuables",
  "Keepsakes",
  "Charges",
] as const;

export type ItemCategory = Exclude<(typeof itemCategories)[number], "All Items">;
export type ItemStatus = "Verified" | "Extracted / Unconfirmed";

export type ItemRecord = {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  rarity: string;
  description: string;
  usage: string;
  acquisition: string;
  effects: Array<{ label: string; value: string }>;
  relationships: Array<{ type: string; name: string }>;
  merchant?: { buy: string; sell: string; stock: string };
  image?: string;
};

export const items: ItemRecord[] = [
  {
    id: "gold", name: "Gold", category: "Currencies", status: "Verified", rarity: "Common",
    description: "The standard currency carried throughout the current Demo.",
    usage: "Spent on purchases and required alongside materials at the Tar Forge.",
    acquisition: "Loot, rewards, and merchant transactions; exact source totals unverified.",
    effects: [{ label: "Currency", value: "General" }, { label: "Forge Cost", value: "Required" }],
    relationships: [{ type: "System", name: "Merchants" }, { type: "System", name: "Tar Forge" }], image: "/assets/items/gold.png",
  },
  {
    id: "gloom", name: "Gloom", category: "Currencies", status: "Verified", rarity: "Common",
    description: "A distinct currency recognized by the Demo's inventory and reward systems.",
    usage: "A spendable resource; individual prices and sinks remain unverified.",
    acquisition: "Exact source locations unverified.", effects: [{ label: "Currency", value: "Special" }],
    relationships: [{ type: "System", name: "Inventory" }], image: "/assets/items/gloom.png",
  },
  {
    id: "glimpses", name: "Glimpses", category: "Currencies", status: "Verified", rarity: "Common",
    description: "A collectible currency retained as a separate inventory resource.",
    usage: "Used by progression and exchange systems; precise Demo costs remain unverified.",
    acquisition: "Exact source locations unverified.", effects: [{ label: "Currency", value: "Progression" }],
    relationships: [{ type: "System", name: "Progression" }], image: "/assets/items/glimpses.png",
  },
  {
    id: "ventrium", name: "Ventrium", category: "Upgrade Materials", status: "Verified", rarity: "Upgrade Material",
    description: "The first material tier in the shared equipment-upgrade curve.",
    usage: "Used at the Tar Forge to upgrade equipment from +1 to +5.",
    acquisition: "Sold by the Tar Forge materials merchant for 250 Gold. No fixed world pickup coordinates have been verified.",
    effects: [{ label: "Upgrade Range", value: "+1 to +5" }, { label: "Maximum Cost", value: "10 per level" }],
    relationships: [{ type: "System", name: "Tar Forge" }, { type: "System", name: "Merchants" }, { type: "Equipment", name: "Weapons and Sidearms" }],
    merchant: { buy: "250 Gold", sell: "Unverified", stock: "Tar Forge materials merchant" }, image: "/assets/items/ventrium.png",
  },
  {
    id: "laterite", name: "Laterite", category: "Upgrade Materials", status: "Verified", rarity: "Upgrade Material",
    description: "The second material tier in the shared equipment-upgrade curve.",
    usage: "Used at the Tar Forge to upgrade equipment from +6 to +10.", acquisition: "Sold by the Tar Forge materials merchant for 650 Gold. No fixed world pickup coordinates have been verified.",
    effects: [{ label: "Upgrade Range", value: "+6 to +10" }, { label: "Maximum Cost", value: "12 per level" }],
    relationships: [{ type: "System", name: "Tar Forge" }, { type: "System", name: "Merchants" }],
    merchant: { buy: "650 Gold", sell: "Unverified", stock: "Tar Forge materials merchant" }, image: "/assets/items/laterite.png",
  },
  {
    id: "dorsalite", name: "Dorsalite", category: "Upgrade Materials", status: "Verified", rarity: "Upgrade Material",
    description: "The third material tier in the shared equipment-upgrade curve.",
    usage: "Used at the Tar Forge to upgrade equipment from +11 to +15.", acquisition: "Sold by the Tar Forge materials merchant for 1,200 Gold. No fixed world pickup coordinates have been verified.",
    effects: [{ label: "Upgrade Range", value: "+11 to +15" }, { label: "Maximum Cost", value: "10 per level" }],
    relationships: [{ type: "System", name: "Tar Forge" }, { type: "System", name: "Merchants" }],
    merchant: { buy: "1,200 Gold", sell: "Unverified", stock: "Tar Forge materials merchant" }, image: "/assets/items/dorsalite.png",
  },
  {
    id: "thoracium", name: "Thoracium", category: "Upgrade Materials", status: "Verified", rarity: "Upgrade Material",
    description: "The fourth material tier in the shared equipment-upgrade curve.",
    usage: "Used at the Tar Forge to upgrade equipment from +16 to +20.", acquisition: "Sold by the Tar Forge materials merchant for 2,500 Gold. No fixed world pickup coordinates have been verified.",
    effects: [{ label: "Upgrade Range", value: "+16 to +20" }, { label: "Maximum Cost", value: "6 per level" }],
    relationships: [{ type: "System", name: "Tar Forge" }, { type: "System", name: "Merchants" }],
    merchant: { buy: "2,500 Gold", sell: "Unverified", stock: "Tar Forge materials merchant" }, image: "/assets/items/thoracium.png",
  },
  {
    id: "thoracium-prime", name: "Thoracium Prime", category: "Upgrade Materials", status: "Verified", rarity: "Upgrade Material",
    description: "A higher forge-material tier present in the common upgrade requirements.",
    usage: "Assigned to +21 through +25 requirements; the catalogued Demo equipment currently stops at +20.",
    acquisition: "Exact source locations unverified.", effects: [{ label: "Requirement Range", value: "+21 to +25" }],
    relationships: [{ type: "System", name: "Tar Forge" }], image: "/assets/items/thoracium-prime.png",
  },
  {
    id: "weltcap", name: "Weltcap", category: "Consumables", status: "Verified", rarity: "Consumable",
    description: "A mushroom collectible represented in both ordinary and progression-oriented item sets.",
    usage: "Consumable effect values remain unverified.", acquisition: "Found in the world; exact locations unverified.",
    effects: [{ label: "Effect", value: "Unverified" }], relationships: [{ type: "System", name: "Permanent Progression" }], image: "/assets/items/weltcap.png",
  },
  {
    id: "tarspore", name: "Tarspore", category: "Consumables", status: "Verified", rarity: "Consumable",
    description: "A harvestable mushroom item carried in the consumables collection.",
    usage: "Consumable effect values remain unverified.", acquisition: "Found in the world; exact locations unverified.",
    effects: [{ label: "Effect", value: "Unverified" }], relationships: [], image: "/assets/items/tarspore.png",
  },
  {
    id: "village-key", name: "Village Key", category: "Key Items", status: "Verified", rarity: "Key Item",
    description: "A progression key associated with a village lock or passage.",
    usage: "Opens its associated village progression lock; the exact door remains unverified.",
    acquisition: "Exact source location unverified.", effects: [{ label: "Consumed", value: "Unverified" }],
    relationships: [{ type: "Location", name: "Village" }],
  },
  {
    id: "dungeon-cage-key", name: "Dungeon Cage Key", category: "Key Items", status: "Verified", rarity: "Key Item",
    description: "A key associated with a locked dungeon cage.", usage: "Unlocks its associated cage.",
    acquisition: "Exact source location unverified.", effects: [{ label: "Consumed", value: "Unverified" }],
    relationships: [{ type: "Location", name: "Dungeon" }], image: "/assets/items/dungeon-cage-key.png",
  },
  {
    id: "devouts-chalice", name: "Devout’s Chalice", category: "Valuables", status: "Verified", rarity: "Rare",
    description: "There’s still a trace of dried Nektar in its hollow.",
    usage: "Trade this collectible for Coin. It cannot be equipped and does not modify character attributes.",
    acquisition: "Can be sold through the Hub merchant's Sell service. Its fixed world sources are unverified.",
    effects: [{ label: "Sell Value", value: "100 Coin" }, { label: "Equipment", value: "Cannot be equipped" }, { label: "Attributes", value: "No attribute bonuses" }],
    relationships: [{ type: "System", name: "Merchant Sell Service" }], merchant: { buy: "Unavailable", sell: "100 Coin", stock: "Hub merchant — Sell" },
  },
  {
    id: "coin-of-mammon", name: "Coin of Mammon", category: "Valuables", status: "Verified", rarity: "Rare",
    description: "Once a symbol of unimaginable riches, but it still remains valuable to collectors.",
    usage: "Trade this collectible for Coin. It cannot be equipped and does not modify character attributes.",
    acquisition: "Can be sold through the Hub merchant's Sell service. Its fixed world sources are unverified.",
    effects: [{ label: "Sell Value", value: "500 Coin" }, { label: "Equipment", value: "Cannot be equipped" }, { label: "Attributes", value: "No attribute bonuses" }],
    relationships: [{ type: "System", name: "Merchant Sell Service" }], merchant: { buy: "Unavailable", sell: "500 Coin", stock: "Hub merchant — Sell" },
  },
  {
    id: "winterglass-gem", name: "Winterglass Gem", category: "Valuables", status: "Verified", rarity: "Epic",
    description: "Highly sought by those hoping to find a frozen remnant of a Martyr preserved inside.",
    usage: "Trade this collectible for Coin. It cannot be equipped and does not modify character attributes.",
    acquisition: "Can be sold through the Hub merchant's Sell service. Its fixed world sources are unverified.",
    effects: [{ label: "Sell Value", value: "750 Coin" }, { label: "Equipment", value: "Cannot be equipped" }, { label: "Attributes", value: "No attribute bonuses" }],
    relationships: [{ type: "System", name: "Merchant Sell Service" }], merchant: { buy: "Unavailable", sell: "750 Coin", stock: "Hub merchant — Sell" },
  },
  {
    id: "tooth-of-nochte", name: "Tooth of Nochte", category: "Valuables", status: "Verified", rarity: "Rare",
    description: "A canine of remarkable size—often found in alleyways and odd corners of the former kingdom.",
    usage: "Trade this collectible for Coin. It cannot be equipped and does not modify character attributes.",
    acquisition: "Can be sold through the Hub merchant's Sell service. Its fixed world sources are unverified.",
    effects: [{ label: "Sell Value", value: "2,000 Coin" }, { label: "Equipment", value: "Cannot be equipped" }, { label: "Attributes", value: "No attribute bonuses" }],
    relationships: [{ type: "System", name: "Merchant Sell Service" }], merchant: { buy: "Unavailable", sell: "2,000 Coin", stock: "Hub merchant — Sell" },
  },
  {
    id: "marsh-pearl", name: "Marsh Pearl", category: "Valuables", status: "Verified", rarity: "Rare",
    description: "Though little more than a wet, stinking clump, it’s treasured by those who revere the Great Frógga.",
    usage: "Trade this collectible for Coin. It cannot be equipped and does not modify character attributes.",
    acquisition: "Can be sold through the Hub merchant's Sell service. Its fixed world sources are unverified.",
    effects: [{ label: "Sell Value", value: "2,000 Coin" }, { label: "Equipment", value: "Cannot be equipped" }, { label: "Attributes", value: "No attribute bonuses" }],
    relationships: [{ type: "System", name: "Merchant Sell Service" }], merchant: { buy: "Unavailable", sell: "2,000 Coin", stock: "Hub merchant — Sell" },
  },
  {
    id: "tiels-dagger", name: "Tiel's Dagger", category: "Keepsakes", status: "Verified", rarity: "Keepsake",
    description: "A keepsake associated with Tiel.", usage: "Keepsake function unverified.", acquisition: "Exact source location unverified.",
    effects: [{ label: "Effect", value: "Unverified" }], relationships: [{ type: "Shell", name: "Tiel" }], image: "/assets/items/tiels-dagger.png",
  },
  {
    id: "genessa-incense-burner", name: "Genessa's Incense Burner", category: "Keepsakes", status: "Verified", rarity: "Keepsake",
    description: "A keepsake associated with Genessa.", usage: "Keepsake function unverified.", acquisition: "Exact source location unverified.",
    effects: [{ label: "Effect", value: "Unverified" }], relationships: [{ type: "Shell", name: "Genessa" }], image: "/assets/items/genessa-incense-burner.png",
  },
  {
    id: "channeling-charge", name: "Channeling Charge", category: "Charges", status: "Verified", rarity: "Charge",
    description: "A charge item associated with channeling.", usage: "Charge behavior and compatible equipment remain unverified.",
    acquisition: "Exact source location unverified.", effects: [{ label: "Effect", value: "Unverified" }],
    relationships: [{ type: "Collection", name: "Charges" }],
  },
  {
    id: "cleansing-charge", name: "Cleansing Charge", category: "Charges", status: "Verified", rarity: "Charge",
    description: "A charge item associated with cleansing.", usage: "Charge behavior and compatible equipment remain unverified.",
    acquisition: "Exact source location unverified.", effects: [{ label: "Effect", value: "Unverified" }],
    relationships: [{ type: "Collection", name: "Charges" }],
  },
  {
    id: "alien-idol", name: "Alien Idol", category: "Key Items", status: "Extracted / Unconfirmed", rarity: "Key Item",
    description: "A beacon-related key item whose obtainable status is not confirmed in the current Demo.",
    usage: "Beacon progression use is unverified.", acquisition: "Unverified.", effects: [{ label: "Use", value: "Unverified" }], relationships: [{ type: "System", name: "Beacons" }],
  },
];

export const verifiedItems = items.filter(({ status }) => status === "Verified");
