import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Database,
  Map,
  Play,
  Shield,
  Skull,
  Swords,
} from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import buildData from "@/data/game-info.json";
import videos from "@/data/videos.json";
import { archiveCounts } from "@/lib/data/wiki";
import { featuredShells, researchNotes, siteConfig } from "@/config/site";
import { weapons } from "@/lib/data/weapons";
import { getPageMetadata } from "@/seo/tdk";
import styles from "@/style/page/home/home.module.css";

export const metadata: Metadata = getPageMetadata("home", "/");

const exploreCards = [
  { title: "Wiki", href: "/wiki/", text: "Enemies, items, Tarstones, skills, Seals, and achievements.", image: "/images/official/trailer.webp", icon: Database },
  { title: "Weapons", href: "/weapons/", text: "Compare moves, skills, Forge costs, and upgrades.", image: "/images/official/world.png", icon: Swords },
  { title: "Map", href: "/map/", text: "Search 54 marked locations across the world map.", image: "/images/official/combat.png", icon: Map },
  { title: "Shells", href: "/shells/", text: "Abilities, passives, Skill Trees, and variants.", image: "/images/official/shell.png", icon: Shield },
  { title: "Enemies", href: "/enemies/", text: "1.0 launch enemy HP, poise, and resistances.", image: "/images/official/feature.webp", icon: Skull },
  { title: "Items", href: "/wiki/items/", text: "Materials, keys, consumables, and currencies.", image: "/images/official/battle.png", icon: Database },
];

export default function Home() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: siteConfig.name, description: siteConfig.description, url: siteConfig.url, dateModified: siteConfig.seoUpdatedAt, isPartOf: { "@id": `${siteConfig.url}/#website` }, about: { "@type": "VideoGame", name: "Mortal Shell II" } },
      { "@type": "FAQPage", mainEntity: [
        { "@type": "Question", name: "Is Mortal Shell II a standalone sequel?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can start here without playing the first Mortal Shell, though returning players will recognize its dark fantasy world and combat focus." } },
        { "@type": "Question", name: "When and where does Mortal Shell II release?", acceptedAnswer: { "@type": "Answer", text: "The game is scheduled for August 20, 2026 on Steam, PlayStation 5, and Xbox Series X|S." } },
        { "@type": "Question", name: "What does the interactive map include?", acceptedAnswer: { "@type": "Answer", text: "It includes marked locations, points of interest, and discovered-route tracking." } },
      ] },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <section className={styles.hero}>
        <Image
          alt="A black-armored knight facing a moonlit ruined city"
          className={styles.heroImage}
          fill
          priority
          sizes="100vw"
          src="/images/official/mortal-shell-ii-hero-v2.png"
        />
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1>Mortal Shell <span>II</span> - Wiki, Guides, and Interactive Map</h1>
            <p className={styles.heroSubtitle}><i /> Wiki &amp; Guide <i /></p>
            <p className={styles.lead}>
              <Link href="/weapons/">Weapons</Link>, <Link href="/shells/">Shells</Link>, <Link href="/wiki/items/">items</Link>, <Link href="/enemies/">enemies</Link>, <Link href="/bosses/">Bosses</Link>, and <Link href="/map/">map locations</Link>. Builds, routes, and encounters from the 1.0 launch version.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/wiki/">
                <BookOpen size={17} /> Browse the wiki
              </Link>
              <Link className={styles.secondaryButton} href="/map/">
                <Compass size={17} /> Open the map
              </Link>
            </div>
          </div>
          <aside className={styles.heroAside} aria-label="Release information">
            <div className={styles.releaseCard}>
              <span>Release date</span>
              <strong>August 20, 2026</strong>
              <p>Steam · PlayStation 5 · Xbox Series X|S</p>
              <dl className={styles.releaseFacts}>
                <div><dt>Wiki data</dt><dd>1.0 launch</dd></div>
                <div><dt>Weapons</dt><dd>{archiveCounts.weapons}</dd></div>
                <div><dt>Playable Shells</dt><dd>{archiveCounts.namedShells}</dd></div>
                <div><dt>Map</dt><dd>54 locations</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <div className={styles.pageShell}>
        <section className={styles.explore} aria-labelledby="explore-title">
          <SectionTitle title="Explore Mortal Shell II" />
          <div className={styles.exploreGrid}>
            {exploreCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link className={styles.exploreCard} href={card.href} key={card.title}>
                  <Image alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 220px" src={card.image} />
                  <span className={styles.cardShade} />
                  <Icon className={styles.cardIcon} size={22} aria-hidden="true" />
                  <div><h2>{card.title}</h2><p>{card.text}</p></div>
                  <ArrowRight className={styles.cardArrow} size={18} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className={styles.dashboard}>
          <div className={styles.dashboardPanel}>
            <SectionTitle title="Start here" href="/guides/" />
            <Link className={styles.guideLead} href="/weapons/">
              <Image alt="A Shell wielding a scythe" width={120} height={74} src="/images/official/world.png" />
              <span><b>Choose your equipment</b><small>Compare primary weapons, sidearms, Forge upgrades, Tarstones, and skills</small></span>
              <ArrowRight size={16} />
            </Link>
            <Link className={styles.guideLead} href="/map/">
              <Image alt="A ruined fortress" width={120} height={74} src="/images/official/combat.png" />
              <span><b>Use the interactive map</b><small>Search and filter 54 marked beta locations, then keep track of what you have found</small></span>
              <ArrowRight size={16} />
            </Link>
            <Link className={styles.guideLead} href="/wiki/#methodology">
              <Image alt="A Mortal Shell II enemy encounter" width={120} height={74} src="/images/official/feature.webp" />
              <span><b>Know what can change</b><small>See which details are confirmed and which still need a release-build check</small></span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.dashboardPanel}>
            <SectionTitle title="Featured Shells" href="/shells/" />
            {featuredShells.map((shell) => (
              <Link className={styles.characterRow} href={`/shells/${shell.name.toLowerCase()}/`} key={shell.name}>
                <Image alt={`${shell.name}, ${shell.title}`} width={74} height={74} src={shell.image} />
                <span><b>{shell.name}</b><small>{shell.title}</small></span>
                <Shield size={18} />
              </Link>
            ))}
          </div>

          <div className={styles.dashboardPanel}>
            <SectionTitle title="Weapon records" href="/weapons/" />
            {weapons.slice(0, 3).map((weapon) => (
              <Link className={styles.mediaRow} href={`/weapons/${weapon.slug}/`} key={weapon.slug}>
                <Image alt="" width={86} height={62} src={weapon.image} />
                <span><b>{weapon.name}</b><small>{weapon.type} · 1.0 launch</small></span>
              </Link>
            ))}
          </div>

          <div className={styles.dashboardPanel}>
            <SectionTitle title="Latest updates" href="/updates/" />
            {researchNotes.map((note) => (
              <article className={styles.updateRow} key={note.title}>
                <span>{note.label}</span>
                <div><b>{note.title}</b><small>{note.description}</small></div>
                <time dateTime={note.date}>{new Date(`${note.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}</time>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.homeInfoGrid} aria-label="Mortal Shell II launch information and official video">
          <article className={styles.homeInfoPanel} id="open-beta">
            <SectionTitle title="Advance Access" />
            <p className={styles.infoLead}>Advance Access is live ahead of the August 20, 2026 launch. Wiki numbers already use the 1.0 launch records. Select progress from early access may carry forward.</p>
            <dl className={styles.homeFacts}>
              <div><dt>Beta release</dt><dd>{buildData.openBeta.releaseDate}</dd></div>
              <div><dt>Scope</dt><dd>{buildData.openBeta.scope}</dd></div>
              <div><dt>Featured Shell</dt><dd>{buildData.openBeta.featuredShell}</dd></div>
              <div><dt>Launch progress</dt><dd>{buildData.openBeta.progressCarryover}</dd></div>
              <div><dt>Prologue skip</dt><dd>{buildData.openBeta.prologueSkipAfter}</dd></div>
            </dl>
            <Link className={styles.textLink} href="/wiki/#methodology">How page status works <ArrowRight size={14} /></Link>
            <a className={styles.textLink} href="https://store.steampowered.com/app/2584270/Mortal_Shell_II/" rel="noreferrer" target="_blank">Official Steam page <ArrowRight size={14} /></a>
          </article>
          <article className={`${styles.homeInfoPanel} ${styles.videoPanel}`} id="official-video">
            <SectionTitle title="Official video" />
            <div className={styles.homeVideoList}>{videos.map((video) => <a href={video.url} key={video.url} rel="noreferrer" target="_blank"><Image alt="" height={72} src={video.thumbnail} width={128} /><span><b>{video.title}</b><small>{video.channel} · {video.url.includes("youtube.com") ? "YouTube" : "Steam"}</small></span><Play size={15} /></a>)}</div>
          </article>
        </section>

        <section className={styles.aboutFaq}>
          <div className={styles.aboutPanel}>
            <SectionTitle title="About Mortal Shell II" href="/wiki/" linkLabel="Wiki index" />
            <p>Mortal Shell II is a standalone action RPG from Cold Symmetry and Playstack. It expands the first game with free exploration, a compact interconnected world, and combat that does not use a stamina bar.</p>
            <p>The 1.0 launch records cover <Link href="/weapons/">weapon paths</Link>, <Link href="/shells/">Shell variants</Link>, <Link href="/map/">connected routes</Link>, and <Link href="/enemies/">hostile encounters</Link> across a compact dark-fantasy world.</p>
          </div>
          <div className={styles.faqPanel}>
            <SectionTitle title="Mortal Shell II FAQ" />
            <details open><summary>Is Mortal Shell II a standalone sequel?</summary><p>Yes. You can start here without playing the first Mortal Shell, though returning players will recognize its dark fantasy world and combat focus.</p></details>
            <details><summary>When and where does Mortal Shell II release?</summary><p>The game is scheduled for August 20, 2026 on Steam, PlayStation 5, and Xbox Series X|S.</p></details>
            <details><summary>Are the weapon values and locations final?</summary><p>Wiki and enemy numbers match the 1.0 launch version. Map markers may still be aligned after launch.</p></details>
            <details><summary>What does the interactive map include?</summary><p>It includes <Link href="/map/">marked locations</Link>, points of interest, and discovered-route tracking.</p></details>
          </div>
        </section>

        <section className={styles.trustBar}>
          <Skull size={20} />
            <p><b>Built from 1.0 launch data.</b> <Link href="/weapons/">{archiveCounts.weapons} weapons</Link>, <Link href="/wiki/sidearms/">{archiveCounts.sidearms} sidearms</Link>, <Link href="/shells/">{archiveCounts.namedShells} playable Shells</Link>, <Link href="/wiki/artifacts/">{archiveCounts.artifacts} Artifacts</Link>, <Link href="/enemies/">{archiveCounts.enemyVariants} enemies</Link>, <Link href="/bosses/">{archiveCounts.bosses} Bosses</Link>, and <Link href="/map/">54 map locations</Link>.</p>
        </section>
      </div>
    </>
  );
}
