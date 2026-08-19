import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BarChart3, Database, Gauge, Layers3, SearchCheck, ShieldCheck, Swords } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionTitle } from "@/components/SectionTitle";
import { StatusProfile } from "@/components/StatusProfile";
import { WikiLocationCard, WikiMediaCard, WikiMediaGrid } from "@/components/WikiMediaCard";
import { achievementPath, achievements } from "@/lib/data/achievements";
import locationDataset from "@/data/reference/locations.json";
import { siteConfig } from "@/config/site";
import { matchingStatusEffects } from "@/lib/data/status-effects";
import { skillArchive, tarstoneArchive } from "@/lib/data/wiki";
import { getWeapon, weapons } from "@/lib/data/weapons";
import { getRecordMetadata } from "@/seo/tdk";
import styles from "@/style/page/wiki/weapons/weapon-detail.module.css";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return weapons.map((weapon) => ({ slug: weapon.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const weapon = getWeapon(slug);
  if (!weapon) return {};
  return getRecordMetadata(weapon.seo, `/weapons/${weapon.slug}/`);
}

export default async function WeaponDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const weapon = getWeapon(slug);
  if (!weapon) notFound();
  const related = weapons.filter((item) => item.slug !== weapon.slug).slice(0, 3);
  const compatibleTarstones = tarstoneArchive.filter((stone) => Array.isArray(stone.details.compatibleEquipment) && stone.details.compatibleEquipment.some((entry) => entry && typeof entry === "object" && "id" in entry && (entry as { id?: unknown }).id === weapon.id));
  const linkedAchievements = achievements.filter((entry) => entry.description.toLowerCase().includes(weapon.name.toLowerCase()) || entry.name.toLowerCase().includes(weapon.name.toLowerCase()) || entry.entity?.slug === weapon.slug || entry.entity?.name === weapon.name);
  const relatedConditions = matchingStatusEffects(weapon.name, weapon.description, weapon.skills, weapon.upgradePool);
  const mapLocations = locationDataset.locations.filter((location) => location.category === "weapon" && `${location.title} ${location.location ?? ""}`.toLowerCase().includes(weapon.name.toLowerCase().replace("veteran's ", "").replace("the ", "")));
  const abilityTarstones = compatibleTarstones.filter((stone) => stone.category.toLowerCase().includes("ability"));
  const regularTarstones = compatibleTarstones.filter((stone) => !stone.category.toLowerCase().includes("ability"));
  const displayedTarstones = regularTarstones.length ? regularTarstones : tarstoneArchive.filter((stone) => /^melee$/i.test(stone.category)).slice(0, 6);
  const forgeTiers = weapon.upgrades.reduce<Array<{ material: string; from: number; to: number; lastCoin: string }>>((tiers, upgrade) => {
    const level = Number(upgrade.level.replace(/\D/g, ""));
    const current = tiers[tiers.length - 1];
    if (!current || current.material !== upgrade.material) {
      tiers.push({ material: upgrade.material, from: level, to: level, lastCoin: upgrade.coin });
    } else {
      current.to = level;
      current.lastCoin = upgrade.coin;
    }
    return tiers;
  }, []);
  const canonical = `${siteConfig.url}/weapons/${weapon.slug}/`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${weapon.name} — Mortal Shell II weapon guide`,
      description: weapon.description,
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      mainEntityOfPage: canonical,
      dateModified: weapon.updatedAt,
      author: { "@id": `${siteConfig.url}/#organization` },
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Weapons", item: `${siteConfig.url}/weapons/` },
        { "@type": "ListItem", position: 3, name: weapon.name, item: canonical },
      ],
    },
  ];

  return (
    <>
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <div className={styles.breadcrumbWrap}>
        <Breadcrumbs items={[{ label: "Weapons", href: "/weapons/" }, { label: weapon.name }]} />
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <section>
            <SectionTitle title="Arsenal index" />
            <p>{weapons.length} weapon forms</p>
            {weapons.map((item, index) => <Link aria-current={item.slug === weapon.slug ? "page" : undefined} className={styles.relatedRow} href={`/weapons/${item.slug}/`} key={item.slug}><Image alt="" width={70} height={45} src={item.image} /><span><b>{item.name}</b><small>{String(index + 1).padStart(2, "0")} · {item.type}</small></span></Link>)}
          </section>
        </aside>

        <div className={styles.contentColumn}>
          <section className={styles.hero}>
            <Image alt={`${weapon.name} inventory art`} fill priority sizes="(max-width: 1024px) 100vw, 75vw" src={weapon.image} style={{ objectFit: "contain", objectPosition: "78% center" }} />
            <span className={styles.heroShade} />
            <div className={styles.heroCopy}>
              <p>Weapon details / {weapon.family}</p>
            <h1>{weapon.name}</h1>
              <div className={styles.gameDescription}>“{weapon.description}”</div>
            </div>
            <div className={styles.heroStamp}><SearchCheck size={18} /><span>Current<br /><b>Beta build</b></span></div>
          </section>

          <div className={styles.mainColumn}>
          <section className={styles.splitPanel}>
            <div>
              <SectionTitle title="Field profile" />
              <div className={styles.heroTags}>
                <span><Swords size={15} /><small>Weapon family</small><b>{weapon.family}</b></span>
                <span><Layers3 size={15} /><small>Scaling reference</small><b>{weapon.upgrades.length} entries</b></span>
                <span><ShieldCheck size={15} /><small>Acquisition</small><b>{weapon.acquisitionVerified ? "Verified route" : "Unconfirmed"}</b></span>
              </div>
              <p className={styles.sourceQuote}>{weapon.name} is a {weapon.family.toLowerCase()} with its own moves, <Link href="/wiki/skills/">skills</Link>, and <Link href="/wiki/tarstones/">Forge path</Link>.</p>
            </div>
            <div>
              <SectionTitle title="Attributes" />
              <dl className={styles.factList}>
                {weapon.attributes.map((attribute) => <div key={attribute.label}><dt>{attribute.label}</dt><dd>{attribute.value}</dd></div>)}
              </dl>
            </div>
          </section>

          {relatedConditions.length ? <section className={styles.dataPanel}>
            <SectionTitle title="Status effects" />
            <StatusProfile rows={[{ icon: ShieldCheck, label: "Combat conditions", values: relatedConditions.map((entry) => entry.slug) }]} />
          </section> : null}

          {weapon.moveDamage.length ? <section className={styles.dataPanel}>
            <SectionTitle title="Move damage" />
              <div className={styles.dataTable}>
                <table><thead><tr><th>Move</th><th>Multiplier</th><th>Damage +0</th><th>Damage +20</th><th>Poise +0</th><th>Poise +20</th><th>Note</th></tr></thead>
                  <tbody>{weapon.moveDamage.map((move) => <tr key={move.move}><td>{move.move}</td><td>{move.multiplier}</td><td>{move.damage0}</td><td>{move.damage20}</td><td>{move.poise0}</td><td>{move.poise20}</td><td>{move.note ?? "—"}</td></tr>)}</tbody>
                </table>
              </div>
            {weapon.moveDamageNote ? <p className={styles.dataNote}><Database size={15} /> {weapon.moveDamageNote}</p> : null}
          </section> : null}

          <section className={styles.progressionPanel}>
            <div>
              <SectionTitle title="Tar Forge progression" />
              <p>Published launch scaling is shown by each reported upgrade interval. Costs are intentionally omitted where the reference does not provide them.</p>
              <ul className={styles.upgradeList}>
                {forgeTiers.map((tier) => <li key={tier.material}><span><b>{tier.material}</b><small>Levels +{tier.from}–+{tier.to}</small></span><progress max={weapon.upgrades.length} value={tier.to} /><em>{tier.lastCoin} Gold at +{tier.to}</em></li>)}
              </ul>
              <div className={styles.dataTable}>
                <table><thead><tr><th>Level</th><th>Material</th><th>Quantity</th><th>Gold</th></tr></thead>
                  <tbody>{weapon.upgrades.map((upgrade) => <tr key={upgrade.level}><td>{upgrade.level}</td><td>{upgrade.material}</td><td>{upgrade.quantity}</td><td>{upgrade.coin}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          </section>

          <section className={styles.dataPanel}>
            <SectionTitle title="Upgrade scaling" />
            <div className={styles.scalingGrid}>
              {weapon.attributes.filter((attribute) => /multiplier|forge level|critical|resolve|guard/i.test(attribute.label)).map((attribute) => <article key={attribute.label}><small>{attribute.label}</small><b>{attribute.value}</b></article>)}
            </div>
            <p className={styles.dataNote}><Database size={15} /> Upgrade scaling is shown from the 1.0 launch fields; it is not inferred from the Forge cost table.</p>
          </section>

          <section className={styles.mediaPanels}>
            <div>
              <SectionTitle title="Ability Tarstones" />
              <WikiMediaGrid>
                {abilityTarstones.length
                  ? abilityTarstones.map((stone) => <WikiMediaCard body={stone.description} href={`/wiki/tarstones/${stone.id}/`} image={stone.image} key={stone.id} meta={stone.category} title={stone.name} />)
                  : <WikiMediaCard empty meta="Not linked" title="No Ability Tarstone" body="No unique Ability Tarstone is linked to this weapon yet." />}
              </WikiMediaGrid>
            </div>
            <div>
              <SectionTitle title="Compatible Tarstones" />
              <WikiMediaGrid>
                {displayedTarstones.map((stone) => <WikiMediaCard body={stone.description} href={`/wiki/tarstones/${stone.id}/`} image={stone.image} key={stone.id} meta={stone.category} title={stone.name} />)}
              </WikiMediaGrid>
            </div>
            <div>
              <SectionTitle title="Location" />
              <WikiLocationCard
                body={mapLocations.length ? `${mapLocations.length} matching marker${mapLocations.length === 1 ? "" : "s"} on the current map.` : weapon.acquisition || "Search the world map for this weapon."}
                href={`/map/?q=${encodeURIComponent(weapon.name)}`}
                hrefLabel="Open location map"
                title={weapon.name}
              />
            </div>
            <div>
              <SectionTitle title="Achievements" />
              <WikiMediaGrid>
                {linkedAchievements.length
                  ? linkedAchievements.map((entry) => <WikiMediaCard body={entry.description} href={achievementPath(entry.slug)} image={entry.icon || weapon.image} key={entry.slug} meta={entry.category ?? "Achievement"} title={entry.name} />)
                  : <WikiMediaCard empty image={weapon.image} meta="Achievement" title="No linked trophy" body="No achievement explicitly names this weapon in the 1.0 launch data." />}
              </WikiMediaGrid>
            </div>
          </section>

          <section className={styles.twoColumnPanels}>
            <div>
              <SectionTitle title="Weapon skills" />
              <WikiMediaGrid>
                {weapon.skills.length
                  ? weapon.skills.map((skill) => {
                    const record = skillArchive.find((entry) => entry.name === skill.name);
                    return <WikiMediaCard body={skill.description} href={record ? `/wiki/skills/${record.id}/` : undefined} image={record?.image} key={skill.name} meta="Weapon skill" title={skill.name} />;
                  })
                  : <WikiMediaCard empty image={weapon.image} meta="Skill" title="No listed skills" body="No weapon skills are recorded for this form in the current data." />}
              </WikiMediaGrid>
            </div>
            <div>
              <SectionTitle title="Compatible upgrade pool" />
              {weapon.upgradePool.length ? <ul className={styles.upgradeList}>{weapon.upgradePool.map((entry) => <li key={entry}>{entry}</li>)}</ul> : <p>Compatible upgrades have not been confirmed yet.</p>}
            </div>
          </section>

          <section className={styles.faq}>
            <SectionTitle title="Acquisition" />
            <p>{weapon.acquisition}</p>
            <details open><summary>How certain is the unlock route?</summary><p>{weapon.acquisitionVerified ? "The unlock route has been confirmed, although the exact map position may still need checking." : "An unlock route may exist, but the exact route or location has not been confirmed yet."}</p></details>
            <details><summary>Are the listed values final?</summary><p>Upgrade multipliers match the 1.0 launch version. Runtime formulas and map pickup points can still be aligned after launch.</p></details>
          </section>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <section>
            <SectionTitle title="Weapon info" />
            <div className={styles.weaponPreview}><Image alt="" fill sizes="300px" src={weapon.image} style={{ objectFit: "contain" }} /></div>
            <dl className={styles.sideFacts}>
              <div><dt>Family</dt><dd>{weapon.family}</dd></div>
              <div><dt>Page status</dt><dd>{weapon.verification.replace("Verified in Open Beta data", "1.0 launch").replace("Launch reference", "1.0 launch")}</dd></div>
              <div><dt>Forge levels</dt><dd>{weapon.upgrades.length}</dd></div>
              <div><dt>Acquisition</dt><dd>{weapon.acquisitionVerified ? "Route confirmed" : "Unconfirmed"}</dd></div>
            </dl>
          </section>
          <section>
            <SectionTitle title="Quick links" />
            <Link className={styles.quickLink} href="/weapons/"><Swords size={14} /> All weapons <ArrowRight size={13} /></Link>
            <Link className={styles.quickLink} href="/wiki/tarstones/"><Gauge size={14} /> Tarstones <ArrowRight size={13} /></Link>
            <Link className={styles.quickLink} href="/wiki/status-effects/"><BarChart3 size={14} /> Status effects <ArrowRight size={13} /></Link>
          </section>
          <section>
            <SectionTitle title="Related weapons" href="/weapons/" />
            {related.map((item) => <Link className={styles.relatedRow} href={`/weapons/${item.slug}/`} key={item.slug}><Image alt="" width={70} height={45} src={item.image} /><span><b>{item.name}</b><small>{item.type}</small></span></Link>)}
          </section>
        </aside>
      </div>
    </>
  );
}
