export const siteConfig = {
  name: "Mortal Shell II Wiki",
  shortName: "Mortal Shell II",
  description:
    "Mortal Shell II Wiki: weapons, Shells, encounters, and map locations. 1.0 launch version.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mortalshell.org",
  ogImage: "/images/og-image.png",
  logo: "/images/logo.png",
  seoUpdatedAt: "2026-08-18",
  releaseDate: "2026-08-20",
};

export type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const wikiCategories = [
  {
    title: "Enemies",
    href: "/enemies/",
    description: "Health, poise, resistances, and attacks.",
    image: "/images/wiki/enemies.webp",
    eyebrow: "1.0 launch enemies",
  },
  {
    title: "Sidearms",
    href: "/wiki/sidearms/",
    description: "Ranged off-hand weapons, fire modes, and upgrades.",
    image: "/images/wiki/sidearms.webp",
    eyebrow: "8 sidearms",
  },
  {
    title: "Items",
    href: "/wiki/items/",
    description: "Consumables, charges, and pickups.",
    image: "/images/wiki/items.webp",
    eyebrow: "135 items",
  },
  {
    title: "Artifacts",
    href: "/wiki/artifacts/",
    description: "Equippable trinket effects.",
    image: "/images/wiki/artifacts.webp",
    eyebrow: "35 Artifacts",
  },
  {
    title: "Tarstones",
    href: "/wiki/tarstones/",
    description: "Resolve-fuelled combat gems by melee, sidearm, and support slot.",
    image: "/images/wiki/tarstones.webp",
    eyebrow: "75 Tarstones",
  },
  {
    title: "Skills",
    href: "/wiki/skills/",
    description: "Every Shell skill, level by level.",
    image: "/images/wiki/skills.webp",
    eyebrow: "96 skill records",
  },
  {
    title: "Seals",
    href: "/wiki/seals/",
    description: "Parry and transformation seals.",
    image: "/images/wiki/seals.webp",
    eyebrow: "4 Seals",
  },
  {
    title: "Status Effects",
    href: "/wiki/status-effects/",
    description: "Poison, Burn, Curse, Frost, and every launch condition.",
    image: "/images/wiki/status-effects.webp",
    eyebrow: "27 conditions",
  },
  {
    title: "Achievements",
    href: "/wiki/achievements/",
    description: "Every trophy to chase in the 1.0 launch version.",
    image: "/images/wiki/achievements.webp",
    eyebrow: "53 achievements",
  },
];

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/wiki/", label: "Wiki", children: wikiCategories.map(({ href, title }) => ({ href, label: title })) },
  { href: "/shells/", label: "Shells" },
  { href: "/weapons/", label: "Weapons" },
  { href: "/map/", label: "Map" },
  { href: "/guides/", label: "Guides" },
  { href: "/tools/", label: "Tools" },
  { href: "/updates/", label: "Updates" },
];

export const featuredShells = [
  {
    name: "Proxima",
    title: "The Broodseeker",
    image: "/assets/shells/proxima.png",
  },
  {
    name: "Tiel",
    title: "The Acolyte",
    image: "/assets/shells/tiel.png",
  },
  {
    name: "Eredrim",
    title: "The Venerable",
    image: "/assets/shells/eredrim.png",
  },
];

export const researchNotes = [
  {
    label: "Release",
    title: "Mortal Shell II releases August 20, 2026",
    description: "Cold Symmetry has confirmed Steam, PlayStation 5, and Xbox Series X|S.",
    date: "2026-08-20",
  },
  {
    label: "Weapons",
    title: "Weapon and sidearm pages now use 1.0 launch data",
    description: "Compare ten melee weapons, eight sidearms, and their launch upgrade scaling.",
    date: "2026-08-19",
  },
  {
    label: "Map",
    title: "The interactive map has 54 marked locations",
    description: "Use the map to get your bearings, then switch to 8K detail when you need a closer look.",
    date: "2026-08-14",
  },
  {
    label: "Site update",
    title: "More pages are ready for the 1.0 launch version",
    description: "Shells, weapons, items, Tarstones, and skills. 1.0 launch version.",
    date: "2026-08-17",
  },
];
