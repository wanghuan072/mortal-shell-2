"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Check, CheckCircle2, Eye, EyeOff, Focus, ImageIcon, LocateFixed, Search } from "lucide-react";
import styles from "@/style/page/map/map.module.css";

const LeafletWorldMap = dynamic(
  () => import("./LeafletWorldMap").then((module) => module.LeafletWorldMap),
  { ssr: false, loading: () => <div className={styles.mapLoading}><LocateFixed size={22} /><span>Loading interactive map…</span></div> },
);

export type PublicMapLocation = {
  id: string;
  title: string;
  category: string;
  region?: string;
  tags: string[];
  pixel: { x: number; y: number };
  location?: string;
  contents?: string[];
  notes?: string;
  image?: string;
  sourceUrl?: string;
};

const STORAGE_KEY = "mortal-shell-2-map:found:v1";
const categoryLabels: Record<string, string> = {
  region: "Regions & Zones",
  boss: "Bosses",
  "landing-area": "Landing Areas",
  weapon: "Weapons",
  sidearm: "Sidearms",
  shell: "Shells",
  "map-station": "Map Stations",
  dungeon: "Dungeon Entrances",
  "evil-statue": "Evil Statues",
  traversal: "Traversal",
  merchant: "Merchants",
  npc: "NPCs",
};

export function InteractiveMap({ locations, initialQuery = "" }: { locations: PublicMapLocation[]; initialQuery?: string }) {
  const categories = useMemo(() => Array.from(new Set(locations.map((location) => location.category))), [locations]);
  const [query, setQuery] = useState(initialQuery);
  const [visibleCategories, setVisibleCategories] = useState<string[]>(categories);
  const [foundMode, setFoundMode] = useState<"all" | "found" | "unfound">("all");
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [highResolution, setHighResolution] = useState(false);
  const [resetToken, setResetToken] = useState(0);

  useEffect(() => {
    const loadFound = () => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
        if (Array.isArray(parsed)) {
          const valid = new Set(locations.map((location) => location.id));
          setFoundIds(parsed.filter((id): id is string => typeof id === "string" && valid.has(id)));
        }
      } catch {
        setFoundIds([]);
      }
    };
    const timer = window.setTimeout(loadFound, 0);
    return () => window.clearTimeout(timer);
  }, [locations]);

  const foundSet = useMemo(() => new Set(foundIds), [foundIds]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("en");
    return locations.filter((location) => {
      const isFound = foundSet.has(location.id);
      const searchable = [location.title, location.category, location.region, location.location, location.notes, ...location.tags, ...(location.contents ?? [])]
        .filter(Boolean).join(" ").toLocaleLowerCase("en");
      return visibleCategories.includes(location.category)
        && (foundMode === "all" || (foundMode === "found" ? isFound : !isFound))
        && (!needle || searchable.includes(needle));
    });
  }, [foundMode, foundSet, locations, query, visibleCategories]);
  const selected = locations.find((location) => location.id === selectedId);

  const toggleCategory = (category: string) => setVisibleCategories((current) => current.includes(category)
    ? current.filter((entry) => entry !== category)
    : [...current, category]);
  const toggleFound = (id: string) => {
    const next = foundSet.has(id) ? foundIds.filter((entry) => entry !== id) : [...foundIds, id];
    setFoundIds(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className={styles.mapApp}>
      <aside className={styles.sidebar}>
        <label className={styles.search}><Search size={17} /><input aria-label="Search map locations" type="search" placeholder="Search locations…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <div className={styles.sidebarActions}>
          <button type="button" onClick={() => setVisibleCategories(categories)}><Eye size={14} />Show all</button>
          <button type="button" onClick={() => setVisibleCategories([])}><EyeOff size={14} />Hide all</button>
        </div>
        <section className={styles.resultList} aria-label="Visible map locations">
          <header><span>Location list</span><b>{filtered.length} results</b></header>
          {filtered.map((location) => <button className={selectedId === location.id ? styles.selectedResult : undefined} key={location.id} onClick={() => setSelectedId(location.id)} type="button"><LocateFixed size={13} /><span><b>{location.title}</b><small>{categoryLabels[location.category] ?? location.category}{location.region ? ` · ${location.region}` : ""}</small></span>{foundSet.has(location.id) ? <CheckCircle2 size={14} /> : null}</button>)}
        </section>
        <section>
          <header><span>Points of interest</span><b>{filtered.length} visible</b></header>
          <div className={styles.categoryList}>
            {categories.map((category) => {
              const active = visibleCategories.includes(category);
              return <button aria-pressed={active} className={active ? styles.activeCategory : undefined} key={category} onClick={() => toggleCategory(category)} type="button"><span>{active ? <Check size={11} /> : null}</span><b>{categoryLabels[category] ?? category}</b><small>{locations.filter((location) => location.category === category).length}</small></button>;
            })}
          </div>
        </section>
        <section>
          <header><span>Discovery</span><b>{foundIds.length}/{locations.length}</b></header>
          <div className={styles.progress}><i style={{ width: `${locations.length ? foundIds.length / locations.length * 100 : 0}%` }} /></div>
          <div className={styles.segmented}>{(["all", "unfound", "found"] as const).map((mode) => <button className={foundMode === mode ? styles.activeMode : undefined} key={mode} onClick={() => setFoundMode(mode)} type="button">{mode}</button>)}</div>
        </section>
      </aside>

      <section className={styles.stage} aria-label="Interactive Mortal Shell II world map">
        <div className={styles.mapControls}>
          <button aria-pressed={highResolution} className={highResolution ? styles.activeControl : undefined} onClick={() => setHighResolution((value) => !value)} type="button"><ImageIcon size={15} />{highResolution ? "8K detail on" : "Enable 8K detail"}</button>
          <button onClick={() => setResetToken((value) => value + 1)} type="button"><Focus size={15} />Fit whole map</button>
        </div>
        <div className={styles.viewport}>
          <LeafletWorldMap
            foundIds={foundIds}
            highResolution={highResolution}
            locations={filtered}
            onClose={() => setSelectedId(undefined)}
            onSelect={setSelectedId}
            onToggleFound={toggleFound}
            resetToken={resetToken}
            selected={selected}
          />
        </div>
        <p className={styles.mapNote}>Drag to pan, scroll or pinch to zoom, and double-click to zoom in. The optimized map loads by default; switch to 8K detail when you need a closer look. <a href="/assets/map/T_UI_Map_Full_NoFog.png" target="_blank">Open the 8K map</a>.</p>
      </section>

    </div>
  );
}
