"use client";

import { useMemo, useState } from "react";
import { Calculator, Gauge, Swords } from "lucide-react";
import { weapons } from "@/lib/data/weapons";
import styles from "@/style/page/tools/tools.module.css";

const numberValue = (value: string, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function DamageCalculator() {
  const [weaponSlug, setWeaponSlug] = useState(weapons[0]?.slug ?? "");
  const [level, setLevel] = useState(10);
  const [baseDamage, setBaseDamage] = useState("100");
  const [baseStagger, setBaseStagger] = useState("50");
  const [baseCrit, setBaseCrit] = useState("10");
  const weapon = weapons.find((entry) => entry.slug === weaponSlug) ?? weapons[0];
  const maxLevel = weapon?.upgrades.length ?? 20;
  const multiplier = 1 + Math.min(level, maxLevel) * 0.05;
  const result = useMemo(() => ({
    damage: numberValue(baseDamage, 100) * multiplier,
    stagger: numberValue(baseStagger, 50) * multiplier,
    crit: numberValue(baseCrit, 10) * multiplier,
  }), [baseCrit, baseDamage, baseStagger, multiplier]);

  return <div className={styles.toolPanel}>
    <div className={styles.calculatorGrid}>
      <section className={styles.calculatorForm}>
        <div className={styles.toolHeading}><Calculator size={18} /><div><p>Damage model</p><h2>Dial in the Forge level</h2></div></div>
        <div className={styles.controls}>
          <label>Weapon<select value={weapon?.slug} onChange={(event) => setWeaponSlug(event.target.value)}>{weapons.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}</select></label>
          <label>Forge level<select value={level} onChange={(event) => setLevel(Number(event.target.value))}>{Array.from({ length: maxLevel + 1 }, (_, entry) => <option key={entry} value={entry}>+{entry}</option>)}</select></label>
          <label>Base damage<input inputMode="decimal" min="0" onChange={(event) => setBaseDamage(event.target.value)} type="number" value={baseDamage} /></label>
          <label>Base stagger<input inputMode="decimal" min="0" onChange={(event) => setBaseStagger(event.target.value)} type="number" value={baseStagger} /></label>
          <label>Base critical value<input inputMode="decimal" min="0" onChange={(event) => setBaseCrit(event.target.value)} type="number" value={baseCrit} /></label>
        </div>
        <div className={styles.multiplierBar}><span>Listed +5% per Forge level</span><strong>×{multiplier.toFixed(2)}</strong><i style={{ width: `${Math.min(100, (level / maxLevel) * 100)}%` }} /></div>
      </section>
      <aside className={styles.calculatorResult}>
        <p>Projected values</p><h2>{weapon?.name}</h2>
        <div className={styles.calculationRows}><div><span><Swords size={14} /> Damage</span><b>{result.damage.toFixed(1)}</b></div><div><span><Gauge size={14} /> Stagger damage</span><b>{result.stagger.toFixed(1)}</b></div><div><span>Critical value</span><b>{result.crit.toFixed(1)}</b></div></div>
      </aside>
    </div>
    <p className={styles.resultNote}>This calculator applies the listed per-level multiplier to the base values you enter. It does not reconstruct missing move-specific formulas or elemental bonuses.</p>
  </div>;
}
