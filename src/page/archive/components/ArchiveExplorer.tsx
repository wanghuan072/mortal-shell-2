"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpenText, ChevronRight, Database, Search, SlidersHorizontal } from "lucide-react";
import { StatusEffectLink } from "@/components/StatusEffectLink";
import type { WikiRecord } from "@/types/wiki";
import styles from "@/style/page/wiki/archive/archive.module.css";

type Props = {
  records: WikiRecord[];
  basePath: string;
  filterLabel: string;
  emptyLabel: string;
  encounterQuickFilters?: boolean;
  fallbackImage?: string;
  fallbackImageAlt?: string;
  fallbackLabel?: string;
};

const statusTone = (status: string) => status.toLowerCase().includes("unconfirmed") || status.toLowerCase().includes("not confirmed")
  ? "unconfirmed"
  : "reviewed";
const displayStatus = (status: string) => status
  .replace("Extracted / Unconfirmed", "Unconfirmed")
  .replace("Current Beta / Unconfirmed", "Unconfirmed")
  .replace("Verified in Open Beta data", "1.0 launch")
  .replace("Launch reference", "1.0 launch")
  .replace("Verified", "1.0 launch");
const measured = (value: unknown) => value && typeof value === "object" && "value" in value && (value as { value?: unknown }).value !== undefined
  ? String((value as { value: unknown }).value)
  : "—";
const profileValues = (value: unknown) => value && typeof value === "object" && "values" in value && Array.isArray((value as { values?: unknown }).values)
  ? (value as { values: unknown[] }).values.map(String)
  : [];

export function ArchiveExplorer({ records, basePath, filterLabel, emptyLabel, encounterQuickFilters = false, fallbackImage, fallbackImageAlt = "Representative encounter artwork", fallbackLabel = "Image not available" }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [status, setStatus] = useState("All");
  const [encounterView, setEncounterView] = useState<"all" | "enemies" | "minibosses">("all");

  const filters = useMemo(() => ["All", ...Array.from(new Set(records.map((record) => record.category))).sort()], [records]);
  const statuses = useMemo(() => ["All", ...Array.from(new Set(records.map((record) => record.status))).sort()], [records]);
  const measuredNumber = (record: WikiRecord, key: "health" | "poise") => {
    const core = (record.details as { core?: Record<string, unknown> }).core ?? {};
    const value = Number(measured(core[key]));
    return Number.isFinite(value) ? value : 0;
  };
  const healthCap = useMemo(() => Math.max(100, ...records.map((record) => measuredNumber(record, "health"))), [records]);
  const poiseCap = useMemo(() => Math.max(20, ...records.map((record) => measuredNumber(record, "poise"))), [records]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("en");
    return records.filter((record) => {
      const searchable = [
        record.name,
        record.category,
        record.description,
        record.status,
        ...Object.entries(record.details).flatMap(([label, value]) => [label, typeof value === "string" ? value : JSON.stringify(value)]),
        ...record.notes,
      ].join(" ").toLocaleLowerCase("en");
      return (!needle || searchable.includes(needle))
        && (filter === "All" || record.category === filter)
        && (status === "All" || record.status === status)
        && (encounterView === "all"
          || (encounterView === "enemies" && !record.category.startsWith("Miniboss") && !record.category.includes(" · Miniboss"))
          || (encounterView === "minibosses" && (record.category.startsWith("Miniboss") || record.category.includes(" · Miniboss"))));
    });
  }, [encounterView, filter, query, records, status]);
  return (
    <div className={styles.explorer} data-encounter-list={encounterQuickFilters ? "true" : undefined}>
      <aside className={styles.filters} aria-label="Archive filters">
        <label className={styles.search}>
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search records</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records…" />
        </label>
        {encounterQuickFilters ? <div className={styles.quickFilters} aria-label="Encounter type">
          {(["all", "enemies", "minibosses"] as const).map((view) => <button aria-pressed={encounterView === view} className={encounterView === view ? styles.activeQuickFilter : undefined} key={view} onClick={() => setEncounterView(view)} type="button">{{ all: "All", enemies: "Enemies", minibosses: "Minibosses" }[view]}</button>)}
        </div> : null}
        <label>
          <span><SlidersHorizontal size={14} /> {filterLabel}</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            {filters.map((entry) => <option key={entry}>{entry}</option>)}
          </select>
        </label>
        <label>
          <span><BookOpenText size={14} /> Page status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((entry) => <option key={entry} value={entry}>{entry === "All" ? entry : displayStatus(entry)}</option>)}
          </select>
        </label>
        <p><Database size={14} /> {filtered.length} of {records.length} entries</p>
      </aside>

      <section className={styles.index} aria-label="Archive record list">
        {filtered.map((record) => {
          const details = record.details as Record<string, unknown>;
          const core = (details.core ?? {}) as Record<string, unknown>;
          const profile = (details.combatProfile ?? {}) as Record<string, unknown>;
          const weakTo = profileValues(profile.vulnerableTo);
          const resists = profileValues(profile.resists);
          const classification = String(details.classification ?? record.category.split(" · ").at(-1) ?? "Encounter");
          const healthValue = Number(measured(core.health));
          const poiseValue = Number(measured(core.poise));
          return encounterQuickFilters ? <Link className={styles.encounterCard} href={`${basePath}/${record.id}/`} key={record.id}>
            <span className={styles.encounterArt}>
              {record.image ? <Image alt="" className={record.image.includes("/images/official/gallery/") || record.image.includes("/images/encounters/") ? styles.coverImage : undefined} fill sizes="280px" src={record.image} /> : fallbackImage ? <Image alt={fallbackImageAlt} className={styles.coverImage} fill sizes="280px" src={fallbackImage} /> : <span aria-label={fallbackLabel} className={styles.encounterSigil}>{record.name.slice(0, 1)}</span>}
              <small>{classification}</small>
            </span>
            <span className={styles.encounterCopy}>
              <strong>{record.name}</strong>
              <em data-tone={statusTone(record.status)}>{record.category.split(" · ")[0]}</em>
            </span>
            <span className={styles.encounterMetrics}>
              <span><small>Health</small><b>{measured(core.health)}</b>{Number.isFinite(healthValue) ? <progress max={healthCap} value={healthValue} /> : null}</span>
              <span><small>Poise</small><b>{measured(core.poise)}</b>{Number.isFinite(poiseValue) ? <progress max={poiseCap} value={poiseValue} /> : null}</span>
            </span>
            <span className={styles.encounterTags}>
              {weakTo.length ? <span className={styles.tagGroup}><small>Weak</small>{weakTo.map((entry) => <StatusEffectLink key={`weak-${entry}`} label={entry} linked={false} />)}</span> : <span>No weakness recorded</span>}
              {resists.length ? <span className={styles.tagGroup}><small>Resists</small>{resists.map((entry) => <StatusEffectLink key={`resist-${entry}`} label={entry} linked={false} />)}</span> : null}
            </span>
          </Link> : <Link href={`${basePath}/${record.id}/`} key={record.id}>
            {record.image ? <Image alt="" className={record.image.includes("/images/official/gallery/") || record.image.includes("/images/encounters/") ? styles.coverImage : undefined} width={54} height={54} src={record.image} /> : fallbackImage ? <Image alt={fallbackImageAlt} className={styles.coverImage} width={54} height={54} src={fallbackImage} /> : <span aria-label={fallbackLabel} className={styles.fallback} title={fallbackLabel}><Database size={19} /><small>{fallbackLabel}</small></span>}
            <span><strong>{record.name}</strong><small>{record.category}</small><em data-tone={statusTone(record.status)}>{displayStatus(record.status)}</em></span>
            <ChevronRight size={15} />
          </Link>;
        })}
        {!filtered.length ? <div className={styles.empty}><Search size={24} /><b>{emptyLabel}</b><span>Try a broader name, category, or page status.</span></div> : null}
      </section>

    </div>
  );
}
