"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import styles from "@/style/common/shared.module.css";

const fixedResults = [
  { label: "Mortal Shell II Wiki", href: "/wiki/", type: "Hub" },
  { label: "Weapons", href: "/weapons/", type: "Weapons" },
  { label: "Sidearms", href: "/wiki/sidearms/", type: "Wiki" },
  { label: "Shells", href: "/shells/", type: "Shells" },
  { label: "Items", href: "/wiki/items/", type: "Wiki" },
  { label: "Artifacts", href: "/wiki/artifacts/", type: "Wiki" },
  { label: "Tarstones", href: "/wiki/tarstones/", type: "Wiki" },
  { label: "Seals", href: "/wiki/seals/", type: "Wiki" },
  { label: "Skills", href: "/wiki/skills/", type: "Wiki" },
  { label: "Enemies", href: "/enemies/", type: "Encounters" },
  { label: "Bosses", href: "/bosses/", type: "Encounters" },
  { label: "Status Effects", href: "/wiki/status-effects/", type: "Mechanics" },
  { label: "Achievements", href: "/wiki/achievements/", type: "Reference" },
  { label: "Build Planner", href: "/tools/planner/", type: "Tool" },
  { label: "Damage and Stagger Calculator", href: "/tools/calculator/", type: "Tool" },
  { label: "Tarforge Calculator", href: "/tools/tarforge/", type: "Tool" },
  { label: "Weakness Finder", href: "/tools/weakness-finder/", type: "Tool" },
  { label: "Interactive map", href: "/map/", type: "Map" },
];

type SearchEntry = { label: string; href: string; type: string };

export function SiteSearch({ entries = [] }: { entries?: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const allResults = useMemo(
    () => [
      ...fixedResults,
      ...entries,
    ],
    [entries],
  );
  const results = query.trim()
    ? allResults
        .filter((item) => `${item.label} ${item.type}`.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    : [];

  return (
    <div className={styles.searchWrap}>
      <Search size={15} aria-hidden="true" />
      <input
        aria-label="Search the wiki"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search the wiki…"
        type="search"
        value={query}
      />
      {query && (
        <button aria-label="Clear search" onClick={() => setQuery("")} type="button">
          <X size={14} />
        </button>
      )}
      {query && (
        <div className={styles.searchResults}>
          {results.length ? (
            results.map((result) => (
              <Link href={result.href} key={`${result.href}-${result.label}`} onClick={() => setQuery("")}>
                <span>{result.label}</span>
                <small>{result.type}</small>
              </Link>
            ))
          ) : (
            <p>No indexed page matches “{query}”.</p>
          )}
        </div>
      )}
    </div>
  );
}
