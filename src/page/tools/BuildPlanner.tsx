"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Copy, Link2, Shield, Swords } from "lucide-react";
import { sealRecords, shellRecords, sidearmRecords, tarstoneRecords } from "@/lib/data/wiki";
import { weapons } from "@/lib/data/weapons";
import styles from "@/style/page/tools/tools.module.css";

const shellOptions = shellRecords.filter((record) => record.details.playable === true);
const weaponOptions = weapons.map((weapon) => ({ id: weapon.slug, name: weapon.name, href: `/wiki/weapons/${weapon.slug}/`, maxLevel: weapon.upgrades.length }));
const sidearmOptions = sidearmRecords.map((record) => ({ id: record.id, name: record.name, href: `/wiki/sidearms/${record.id}/` }));
const sealOptions = sealRecords.map((record) => ({ id: record.id, name: record.name, href: `/wiki/seals/${record.id}/` }));
const tarstoneOptions = tarstoneRecords.map((record) => ({ id: record.id, name: record.name, href: `/wiki/tarstones/${record.id}/` }));

const firstId = (entries: { id: string }[]) => entries[0]?.id ?? "";

export function BuildPlanner() {
  const [shell, setShell] = useState(firstId(shellOptions));
  const [weapon, setWeapon] = useState(weaponOptions[0]?.id ?? "");
  const [weaponLevel, setWeaponLevel] = useState(0);
  const [sidearm, setSidearm] = useState(firstId(sidearmOptions));
  const [seal, setSeal] = useState(firstId(sealOptions));
  const [tarstones, setTarstones] = useState([firstId(tarstoneOptions), tarstoneOptions[1]?.id ?? "", tarstoneOptions[2]?.id ?? ""]);
  const [shareState, setShareState] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const frame = window.requestAnimationFrame(() => {
      if (params.get("shell")) setShell(params.get("shell") ?? "");
      if (params.get("weapon")) setWeapon(params.get("weapon") ?? "");
      if (params.get("level")) setWeaponLevel(Number(params.get("level")) || 0);
      if (params.get("sidearm")) setSidearm(params.get("sidearm") ?? "");
      if (params.get("seal")) setSeal(params.get("seal") ?? "");
      const sharedTarstones = params.get("tarstones")?.split(",");
      if (sharedTarstones?.length) setTarstones([sharedTarstones[0] ?? "", sharedTarstones[1] ?? "", sharedTarstones[2] ?? ""]);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selected = useMemo(() => ({
    shell: shellOptions.find((entry) => entry.id === shell),
    weapon: weaponOptions.find((entry) => entry.id === weapon),
    sidearm: sidearmOptions.find((entry) => entry.id === sidearm),
    seal: sealOptions.find((entry) => entry.id === seal),
    tarstones: tarstones.map((id) => tarstoneOptions.find((entry) => entry.id === id)).filter(Boolean),
  }), [shell, weapon, sidearm, seal, tarstones]);

  const updateTarstone = (index: number, value: string) => setTarstones((current) => current.map((entry, entryIndex) => entryIndex === index ? value : entry));
  const copyShareLink = async () => {
    const params = new URLSearchParams({ shell, weapon, level: String(weaponLevel), sidearm, seal, tarstones: tarstones.join(",") });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setShareState("Build link copied");
    } catch {
      setShareState(url);
    }
  };

  return <div className={styles.toolPanel}>
    <div className={styles.plannerGrid}>
      <section className={styles.plannerForm}>
        <div className={styles.toolHeading}><Shield size={18} /><div><p>Loadout</p><h2>Assemble your build</h2></div></div>
        <div className={styles.controls}>
          <label>Shell<select value={shell} onChange={(event) => setShell(event.target.value)}>{shellOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>
          <label>Primary weapon<select value={weapon} onChange={(event) => { setWeapon(event.target.value); setWeaponLevel(0); }}>{weaponOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>
          <label>Weapon level<select value={weaponLevel} onChange={(event) => setWeaponLevel(Number(event.target.value))}>{Array.from({ length: (selected.weapon?.maxLevel ?? 20) + 1 }, (_, level) => <option key={level} value={level}>+{level}</option>)}</select></label>
          <label>Sidearm<select value={sidearm} onChange={(event) => setSidearm(event.target.value)}>{sidearmOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>
          <label>Seal<select value={seal} onChange={(event) => setSeal(event.target.value)}>{sealOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>
          {tarstones.map((tarstone, index) => <label key={`tarstone-${index}`}>Tarstone {index + 1}<select value={tarstone} onChange={(event) => updateTarstone(index, event.target.value)}><option value="">None</option>{tarstoneOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>)}
        </div>
        <button className={styles.actionButton} onClick={copyShareLink} type="button"><Copy size={15} /> Share build <span>{shareState}</span></button>
      </section>
      <aside className={styles.buildSummary}>
        <p>Build summary</p>
        <h2>{selected.shell?.name ?? "Shell"}</h2>
        <dl>
          <div><dt><Swords size={14} /> Weapon</dt><dd>{selected.weapon?.name ?? "Not selected"} <small>+{weaponLevel}</small></dd></div>
          <div><dt>Sidearm</dt><dd>{selected.sidearm?.name ?? "Not selected"}</dd></div>
          <div><dt>Seal</dt><dd>{selected.seal?.name ?? "Not selected"}</dd></div>
          <div><dt>Tarstones</dt><dd>{selected.tarstones.length ? selected.tarstones.map((entry) => entry?.name).join(" · ") : "None selected"}</dd></div>
        </dl>
        <div className={styles.summaryLinks}>{selected.weapon && <Link href={selected.weapon.href}>Weapon record <ArrowRight size={13} /></Link>}{selected.shell && <Link href={`/wiki/shells/${selected.shell.id}/`}>Shell record <ArrowRight size={13} /></Link>}</div>
      </aside>
    </div>
    <p className={styles.resultNote}><Link2 size={14} /> The share link stores the selected loadout in the URL. It does not save account data.</p>
  </div>;
}
