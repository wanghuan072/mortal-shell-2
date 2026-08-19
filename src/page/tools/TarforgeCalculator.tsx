"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Coins, Hammer } from "lucide-react";
import { weapons } from "@/lib/data/weapons";
import styles from "@/style/page/tools/tools.module.css";

export function TarforgeCalculator() {
  const [weaponSlug, setWeaponSlug] = useState(weapons[0]?.slug ?? "");
  const [fromLevel, setFromLevel] = useState(0);
  const [toLevel, setToLevel] = useState(5);
  const weapon = weapons.find((entry) => entry.slug === weaponSlug) ?? weapons[0];
  const maxLevel = weapon?.upgrades.length ?? 0;
  const safeFrom = Math.min(fromLevel, maxLevel);
  const safeTo = Math.max(safeFrom, Math.min(toLevel, maxLevel));
  const selectedUpgrades = useMemo(() => weapon?.upgrades.slice(safeFrom, safeTo) ?? [], [safeFrom, safeTo, weapon]);
  const totals = useMemo(() => {
    const materials = new Map<string, number>();
    let coin = 0;
    selectedUpgrades.forEach((upgrade) => {
      materials.set(upgrade.material, (materials.get(upgrade.material) ?? 0) + Number(upgrade.quantity));
      coin += Number(upgrade.coin.replace(/,/g, ""));
    });
    return { materials: Array.from(materials.entries()), coin };
  }, [selectedUpgrades]);

  const changeWeapon = (slug: string) => {
    const next = weapons.find((entry) => entry.slug === slug);
    setWeaponSlug(slug);
    setFromLevel(0);
    setToLevel(Math.min(5, next?.upgrades.length ?? 0));
  };

  return (
    <div className={styles.toolPanel}>
      <div className={styles.controls}>
        <label>Weapon<select value={weapon?.slug} onChange={(event) => changeWeapon(event.target.value)}>{weapons.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}</select></label>
        <label>Current Forge level<select value={safeFrom} onChange={(event) => { const value = Number(event.target.value); setFromLevel(value); setToLevel((current) => Math.max(current, value)); }}>{Array.from({ length: maxLevel + 1 }, (_, level) => <option key={level} value={level}>+{level}</option>)}</select></label>
        <label>Target Forge level<select value={safeTo} onChange={(event) => setToLevel(Math.max(safeFrom, Number(event.target.value)))}>{Array.from({ length: maxLevel - safeFrom + 1 }, (_, index) => { const level = safeFrom + index; return <option key={level} value={level}>+{level}</option>; })}</select></label>
      </div>
      <div className={styles.summary}><Hammer size={17} /> <b>{weapon?.name}</b> · Upgrade from <b>+{safeFrom}</b> to <b>+{safeTo}</b>. {selectedUpgrades.length ? "The totals below add each listed Forge step." : "Choose a higher target level to calculate a cost."}</div>
      <div className={styles.resultGrid}>
        <section className={styles.resultCard}><h2>Materials</h2><div className={styles.costRows}>{totals.materials.length ? totals.materials.map(([material, quantity]) => <div key={material}><span>{material}</span><b>{quantity.toLocaleString("en-US")}</b></div>) : <div><span>No materials selected</span><b>—</b></div>}</div></section>
        <section className={styles.resultCard}><h2><Coins size={17} /> Coin</h2><div className={styles.costRows}><div><span>Total Coin</span><b>{totals.coin.toLocaleString("en-US")}</b></div><div><span>Steps</span><b>{selectedUpgrades.length}</b></div></div></section>
      </div>
      <p className={styles.resultNote}>Upgrade costs are taken from the current weapon records. Base damage, move values, and final-release balance may change before launch.</p>
      <Link className={styles.note} href={`/wiki/weapons/${weapon?.slug}/`}><ArrowLeft size={14} /> Open the full {weapon?.name} weapon record</Link>
    </div>
  );
}
