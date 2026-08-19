import type { Metadata } from "next";
import Link from "next/link";
import { Database, MapPinned } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { InteractiveMap, type PublicMapLocation } from "@/page/map/components/InteractiveMap";
import locationDataset from "@/data/reference/locations.json";
import buildData from "@/data/game-info.json";
import { getPageMetadata } from "@/seo/tdk";
import styles from "@/style/page/map/map.module.css";

export const metadata: Metadata = getPageMetadata("map", "/map/");

export default async function MapPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";
  const locations: PublicMapLocation[] = (locationDataset.locations as Array<PublicMapLocation & { internalId?: string; world?: unknown }>).map(({ id, title, category, region, tags, pixel, location, contents, notes, image, sourceUrl }) => ({
    id, title, category, region, tags, pixel, location, contents, notes, image, sourceUrl,
  }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mortal Shell II Interactive Map",
    description: "Mortal Shell II interactive map: beta locations, weapons, Shells, merchants, dungeons, and Bosses.",
    url: `${siteConfig.url}/map/`,
    dateModified: buildData.reviewedAt,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@type": "VideoGame", name: "Mortal Shell II" },
  };

  return <div className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <Breadcrumbs items={[{ label: "Interactive Map" }]} />
    <header className={styles.pageHeader}>
      <div><p>Beta locations and points of interest</p><h1>Mortal Shell II Interactive Map - Locations, Bosses &amp; Points of Interest</h1><span>Explore the current Open Beta world with searchable markers for weapons, Shells, dungeons, merchants, map stations, encounters, and traversal points.</span></div>
      <aside><MapPinned size={19} /><b>{locations.length}</b><span>marked locations</span><Database size={19} /><b>8K</b><span>detail layer</span></aside>
    </header>
    <InteractiveMap initialQuery={initialQuery} locations={locations} />
    <section className={styles.seoContent} aria-labelledby="map-guide-heading">
      <div className={styles.seoIntro}>
        <p className={styles.eyebrow}>Map guide and data methodology</p>
        <h2 id="map-guide-heading">Mortal Shell II map for beta exploration</h2>
        <p>This interactive Mortal Shell II map brings current Open Beta points of interest into one searchable view. Use the list or map markers to locate <Link href="/weapons/">weapon pickups</Link>, <Link href="/shells/">Shell encounters</Link>, map stations, merchants, dungeon entrances, <Link href="/bosses/">verified encounters</Link>, evil statues, landing areas, NPCs, and traversal points.</p>
        <p>The map currently contains <strong>{locations.length} marked locations</strong>. Select a marker to open its in-map details, then mark it as found to keep a personal discovery checklist in this browser. The optimized map loads first; the 8K layer is available when you need to inspect a dense area.</p>
      </div>
      <div className={styles.seoGrid}>
        <article>
          <h3>How map markers are checked</h3>
          <p>Marker names and categories are reviewed against the current Open Beta build <strong>{buildData.buildId}</strong>. Duplicate coordinates are merged so a single in-game point does not appear twice.</p>
          <p>Beta availability is also checked against the <a href="https://store.steampowered.com/app/4711740/Mortal_Shell_II/" rel="noreferrer" target="_blank">official Steam Open Beta listing</a>. Details visible only in the beta stay marked as current beta or unconfirmed until release information is available.</p>
        </article>
        <article>
          <h3>What this map does not promise</h3>
          <p>This is a beta-build map, not a claim that every final-release route, collectible, <Link href="/enemies/">enemy spawn</Link>, or secret is included. Coordinates can change as the game is updated, and a beta-only object name may not match the public name used in the finished game.</p>
          <p>For page-status definitions and build information, see <Link href="/wiki/#methodology">how page status works</Link>. Reviewed on <time dateTime={buildData.reviewedAt}>{buildData.reviewedAt}</time>.</p>
        </article>
      </div>
    </section>
    <footer className={styles.dataPolicy}>Beta-build locations can change before release. <Link href="/wiki/#methodology">Record-status notes</Link>.</footer>
  </div>;
}
