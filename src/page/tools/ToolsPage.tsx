import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, Crosshair, Hammer, Shield } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getPageMetadata } from "@/seo/tdk";
import { siteConfig } from "@/config/site";
import { archiveCounts } from "@/lib/data/wiki";
import styles from "@/style/page/tools/tools.module.css";

export const metadata: Metadata = getPageMetadata("tools", "/tools/");

export default function ToolsPage() {
  const canonical = `${siteConfig.url}/tools/`;
  return <div className={`container ${styles.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Mortal Shell II Tools", url: canonical, description: "Mortal Shell II tools: build planner, damage calculator, Tarforge costs, and Weakness Finder. 1.0 launch version." }} />
    <Breadcrumbs items={[{ label: "Tools" }]} />
    <section className={styles.hero}><Image alt="A Shell aiming a crossbow in a stone tunnel" fill priority sizes="100vw" src="/images/wiki/tools.webp" /><span className={styles.shade} /><div className={styles.heroInner}><p>Tools / Practical references</p><h1>Mortal Shell II Tools</h1><div>Interactive tools that turn the 1.0 launch records into decisions: assemble a loadout or test weapon scaling.</div></div></section>
    <section className={styles.toolsIntro}><p>Loadouts and scaling</p><h2>Interactive tools for the 1.0 launch records</h2><span>Compare equipment and estimate what each Forge level changes.</span></section>
    <div className={styles.toolStats} aria-label="Tool data coverage"><div><b>{archiveCounts.namedShells}</b><span>Playable Shells</span></div><div><b>{archiveCounts.weapons}</b><span>Melee weapons</span></div><div><b>{archiveCounts.sidearms}</b><span>Sidearms</span></div><div><b>{archiveCounts.tarstones}</b><span>Tarstones</span></div></div>
    <div className={styles.toolGrid}>
      <Link className={styles.toolCard} href="/tools/planner/"><Image alt="A Shell facing a swamp creature with a glowing greatsword" fill sizes="(max-width: 768px) 100vw, 50vw" src="/images/official/gallery/official-combat.jpg" /><span><Shield size={18} /><b>Build Planner</b><small>Assemble a Shell, weapon, sidearm, seal, and three Tarstones, then copy a shareable build link.</small><em>Open the planner <ArrowRight size={16} /></em></span></Link>
      <Link className={styles.toolCard} href="/tools/calculator/"><Image alt="A Shell swinging a battle axe in close combat" fill sizes="(max-width: 768px) 100vw, 50vw" src="/images/official/gallery/combat-axe.jpg" /><span><Calculator size={18} /><b>Damage &amp; Stagger Calculator</b><small>Set a Forge level and base values to see the listed damage, stagger, and critical multipliers.</small><em>Open the calculator <ArrowRight size={16} /></em></span></Link>
      <Link className={styles.toolCard} href="/tools/tarforge/"><Image alt="A Shell in spiked armor swinging a heavy axe" fill sizes="(max-width: 768px) 100vw, 50vw" src="/images/official/shell.png" /><span><Hammer size={18} /><b>Tarforge Calculator</b><small>See listed Forge materials and Coin costs from one upgrade level to another.</small><em>Open Tarforge <ArrowRight size={16} /></em></span></Link>
      <Link className={styles.toolCard} href="/tools/weakness-finder/"><Image alt="A Tar Golem battle in Mortal Shell II" fill sizes="(max-width: 768px) 100vw, 50vw" src="/images/encounters/tar-golem-battle.jpg" /><span><Crosshair size={18} /><b>Weakness Finder</b><small>Rank enemies and Bosses by damage type using 1.0 launch resistance records.</small><em>Open Weakness Finder <ArrowRight size={16} /></em></span></Link>
    </div>
    <p className={styles.note}>The tools use 1.0 launch records. Calculated outputs are planning aids.</p>
  </div>;
}
