export type EquipmentKind = "weapon" | "sidearm";

export const weaponImages = {
  "battle-axe": "/assets/weapons/battle-axe.png",
  "axe-dagger": "/assets/weapons/axe-dagger.png",
  "black-needle": "/assets/weapons/black-needle.png",
  "clockwork-scythe": "/assets/weapons/clockwork-scythe.png",
  "hadern-sword": "/assets/weapons/the-iconoclast.png",
  "heavy-hammer": "/assets/weapons/obsidian-hammer.png",
  "martyrs-blade": "/assets/weapons/great-martyrs-blade.png",
  axatana: "/assets/weapons/axatana.png",
} as const;

export const sidearmImages = {
  ballistazooka: "/assets/sidearms/ballistazooka.png",
  "caged-hystrix": "/assets/sidearms/caged-hystrix.png",
  "cursed-child": "/assets/sidearms/cursed-child.png",
  "forgotten-crossbow": "/assets/sidearms/forgotten-crossbow.png",
  naylshotte: "/assets/sidearms/naylshotte.png",
  "salvaged-trebuchaxe": "/assets/sidearms/salvaged-trebuchaxe.png",
  "triarch-repeater": "/assets/sidearms/triarch-repeater.png",
  "troubadours-lute": "/assets/sidearms/troubadours-lute.png",
} as const;

export function getEquipmentImage(kind: EquipmentKind, id: string): string | undefined {
  const images = kind === "weapon" ? weaponImages : sidearmImages;
  return images[id as keyof typeof images];
}
