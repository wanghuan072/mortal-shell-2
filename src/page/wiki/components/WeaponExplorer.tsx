"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, ShieldCheck, SlidersHorizontal, Swords } from "lucide-react";
import type { Weapon } from "@/lib/data/weapons";
import styles from "@/style/page/wiki/weapons/weapons.module.css";

export function WeaponExplorer({ weapons, initialQuery = "" }: { weapons: Weapon[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("All types");
  const [sort, setSort] = useState("name");
  const types = ["All types", ...Array.from(new Set(weapons.map((weapon) => weapon.type)))];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return weapons
      .filter((weapon) => type === "All types" || weapon.type === type)
      .filter((weapon) => !normalized || `${weapon.name} ${weapon.type} ${weapon.description}`.toLowerCase().includes(normalized))
      .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)));
  }, [query, sort, type, weapons]);

  return (
    <section aria-labelledby="weapon-results">
      <div className={styles.filters}>
        <label className={styles.searchField}>
          <span className="sr-only">Search weapons</span>
          <Search size={16} />
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Search weapons…" type="search" value={query} />
        </label>
        <label>
          <span>Weapon type</span>
          <select onChange={(event) => setType(event.target.value)} value={type}>
            {types.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Verification</span>
          <select disabled><option>1.0 launch</option></select>
        </label>
        <label className={styles.sortField}>
          <span>Sort by</span>
          <select onChange={(event) => setSort(event.target.value)} value={sort}>
            <option value="name">Name (A–Z)</option>
            <option value="type">Weapon type</option>
          </select>
        </label>
      </div>

      <div className={styles.resultsMeta}>
        <h2 id="weapon-results">Weapons</h2>
        <p><SlidersHorizontal size={13} /> Showing {filtered.length} of {weapons.length} weapons from the 1.0 launch data</p>
      </div>

      {filtered.length ? (
        <div className={styles.weaponGrid}>
          {filtered.map((weapon) => (
            <article className={styles.weaponCard} key={weapon.slug}>
              <Link className={styles.cardImage} href={`/wiki/weapons/${weapon.slug}/`}>
                <Image alt={`${weapon.name} in Mortal Shell II`} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" src={weapon.image} style={{ objectPosition: weapon.imagePosition }} />
                <span><Swords size={17} /></span>
                <small>1.0 launch</small>
              </Link>
              <div className={styles.cardBody}>
                <p className={styles.cardType}>{weapon.type}</p>
                <h3><Link href={`/wiki/weapons/${weapon.slug}/`}>{weapon.name}</Link></h3>
                <p className={styles.cardDescription}>{weapon.description}</p>
                <div className={styles.cardFacts}>
                  <span><ShieldCheck size={13} /> 1.0 launch details</span>
                  <span>{weapon.upgrades.length ? `${weapon.upgrades.length} forge levels` : "Forge progression unconfirmed"}</span>
                </div>
                <Link className={styles.detailsButton} href={`/wiki/weapons/${weapon.slug}/`}>
                  View details <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Swords size={28} />
          <h3>No matching weapon found</h3>
          <p>Try a different name or weapon type.</p>
        </div>
      )}
    </section>
  );
}
