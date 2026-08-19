"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { statusEffectHref } from "@/lib/data/status-effects";
import styles from "@/style/page/tools/tools.module.css";

export type WeaknessRecord = { id: string; name: string; category: string; weakTo: string[]; resists: string[]; status: string };

export function WeaknessFinder({ records }: { records: WeaknessRecord[] }) {
  const [damageType, setDamageType] = useState("Shock");
  const [kind, setKind] = useState("All");
  const kinds = Array.from(new Set(records.map((record) => record.category.startsWith("Boss") ? "Boss" : record.category.startsWith("Miniboss") ? "Miniboss" : "Enemy")));
  const types = Array.from(new Set(records.flatMap((record) => [...record.weakTo, ...record.resists]))).sort();
  const filtered = [...records]
    .filter((record) => kind === "All" || (kind === "Boss" ? record.category.startsWith("Boss") : kind === "Miniboss" ? record.category.startsWith("Miniboss") : !record.category.startsWith("Boss") && !record.category.startsWith("Miniboss")))
    .sort((left, right) => Number(right.weakTo.includes(damageType)) - Number(left.weakTo.includes(damageType)) || left.name.localeCompare(right.name));
  return <div className={styles.toolPanel}>
    <div className={styles.finderGrid}>
      <aside className={styles.filterPanel}>
        <label>Damage type<select value={damageType} onChange={(event) => setDamageType(event.target.value)}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label style={{ marginTop: 12 }}>Encounter type<select value={kind} onChange={(event) => setKind(event.target.value)}><option>All</option>{kinds.map((entry) => <option key={entry}>{entry}</option>)}</select></label>
        <p className={styles.resultNote}><b>{filtered.length}</b> encounter records. Weakness labels come from current resistance fields — see the <Link href="/wiki/status-effects/">status effects</Link> reference for stacking and wording.</p>
      </aside>
      <section className={styles.weaknessList} aria-label="Weakness results">
        {filtered.length ? filtered.map((record) => {
          const isWeak = record.weakTo.includes(damageType);
          const typeHref = statusEffectHref(damageType);
          return <article className={styles.weaknessCard} key={record.id}><h2>{record.name}</h2><p>{record.category} · {record.status}</p><p>{isWeak ? <><strong>Weak to {typeHref ? <Link href={typeHref}>{damageType}</Link> : damageType}</strong> · </> : null}{record.resists.length ? <>Resists: {record.resists.map((entry, index) => { const href = statusEffectHref(entry); return <span key={entry}>{index ? ", " : null}{href ? <Link href={href}>{entry}</Link> : entry}</span>; })}</> : "No resistance list recorded"}</p><Link href={`/enemies/${record.id}/`}>Open encounter dossier <ArrowRight size={13} /></Link></article>;
        }) : <div className={styles.empty}>No encounter records match these filters.</div>}
      </section>
    </div>
  </div>;
}
