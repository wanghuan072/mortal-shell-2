import { PlayCircle } from "lucide-react";
import media from "@/data/wiki/media.json";
import { achievementEntityPath, achievementPath, achievementRecords, achievements } from "@/lib/data/achievements";
import { matchingStatusEffects, recordMatchesStatusEffect, findStatusEffect, shellStatusEffects, statusEffectAnchor, statusEffectRecords } from "@/lib/data/status-effects";
import { artifactArchive, enemyArchive, itemArchive, sealArchive, shellArchive, skillArchive, sidearmArchive, tarstoneArchive, weaponRecords } from "@/lib/data/wiki";
import { WikiLocationCard, WikiMediaCard, WikiMediaGrid } from "@/components/WikiMediaCard";
import type { WikiRecord } from "@/types/wiki";
import styles from "@/style/page/wiki/archive/archive.module.css";

const currentAchievements = achievements;

type Props = { record: WikiRecord; title: string };
type DetailObject = Record<string, unknown>;

const objectValue = (value: unknown): DetailObject | null => value && typeof value === "object" && !Array.isArray(value) ? value as DetailObject : null;
const arrayValue = (value: unknown) => Array.isArray(value) ? value : [];
const textValue = (value: unknown) => value === null || value === undefined || value === "" ? "Not documented" : String(value);

function MediaCards({ entries }: { entries: Array<{ title: string; body?: string; meta?: string; href?: string; image?: string | null; empty?: boolean }> }) {
  return <WikiMediaGrid>{entries.map((entry) => <WikiMediaCard body={entry.body} empty={entry.empty} href={entry.href} image={entry.image} key={`${entry.title}-${entry.href ?? ""}`} meta={entry.meta} title={entry.title} />)}</WikiMediaGrid>;
}

function RelatedConditions({ record, extra, kind }: { record: WikiRecord; extra?: unknown; kind?: "shell" }) {
  const mapped = kind === "shell" ? shellStatusEffects(record.id) : [];
  const matches = [...mapped, ...matchingStatusEffects(record.id.replace(/[-_]/g, " "), record.name, record.description, extra)]
    .filter((entry, index, list) => list.findIndex((item) => item.slug === entry.slug) === index);
  if (!matches.length) return null;
  return <section className={styles.referenceSection}>
    <h2>Status effects</h2>
    <MediaCards entries={matches.map((effect) => ({ title: effect.name, body: effect.description, meta: effect.category, href: statusEffectAnchor(effect.slug), image: effect.icon }))} />
  </section>;
}

function achievementImage(entry: (typeof currentAchievements)[number], fallback?: string | null) {
  return entry.icon || fallback || null;
}

function matchingAchievements(record: WikiRecord) {
  return currentAchievements.filter((entry) => {
    if (entry.entity?.slug === record.id || entry.entity?.name === record.name) return true;
    if (typeof record.details.slug === "string" && entry.entity?.slug === record.details.slug) return true;
    return entry.description.toLowerCase().includes(record.name.toLowerCase()) || entry.name.toLowerCase().includes(record.name.toLowerCase());
  });
}

function AchievementCards({ record }: { record: WikiRecord }) {
  const matches = matchingAchievements(record);
  if (!matches.length) return null;
  return <section className={styles.referenceSection}><h2>Achievements</h2><MediaCards entries={matches.map((entry) => ({ title: entry.name, body: entry.description, meta: entry.category ?? "Achievement", href: achievementPath(entry.slug), image: achievementImage(entry, record.image) }))} /></section>;
}

function ShellReferences({ record }: { record: WikiRecord }) {
  const details = record.details;
  const shellSkills = skillArchive.filter((entry) => entry.details.owner === record.name);
  const listedSkills = arrayValue(details.skillTree).map((entry) => {
    const name = textValue(entry);
    const linkedSkill = skillArchive.find((skill) => skill.name.toLowerCase() === name.toLowerCase());
    return { title: name, body: linkedSkill ? linkedSkill.description : "Three upgrade levels are listed for this Shell Memory skill.", meta: linkedSkill ? "Linked skill" : "Skill name", href: linkedSkill ? `/wiki/skills/${linkedSkill.id}/` : undefined, image: linkedSkill?.image };
  });
  const parentShell = typeof details.parentShell === "string" ? shellArchive.find((entry) => entry.name === details.parentShell) : undefined;
  const shellVideos = (media.shellVideos as Record<string, Array<{ label: string; src: string; poster: string }>>)[record.id] ?? [];
  const abilities = arrayValue(details.abilities).flatMap((entry) => {
    const value = objectValue(entry);
    return value ? [{ title: textValue(value.name), body: textValue(value.description), meta: textValue(value.type) }] : [];
  });
  const variants = arrayValue(details.variants).flatMap((entry) => {
    const value = objectValue(entry);
    if (!value) return [];
    const linkedRecord = typeof value.id === "string" ? shellArchive.find((entry) => entry.id === value.id) : undefined;
    return [{ title: textValue(value.name), body: textValue(value.gameplay), meta: textValue(value.type), href: linkedRecord ? `/wiki/shells/${linkedRecord.id}/` : undefined, image: linkedRecord?.image }];
  });
  const skillEntries = shellSkills.length
    ? shellSkills.map((entry) => ({ title: entry.name, body: entry.description, meta: `${textValue(entry.details.type)} · 3 levels`, href: `/wiki/skills/${entry.id}/`, image: entry.image }))
    : listedSkills;
  return <>
    {parentShell ? <section className={styles.referenceSection}><h2>Parent Shell</h2><MediaCards entries={[{ title: parentShell.name, body: parentShell.description, meta: parentShell.category, href: `/wiki/shells/${parentShell.id}/`, image: parentShell.image }]} /></section> : null}
    {abilities.length ? <section className={styles.referenceSection}><h2>Signature abilities</h2><div className={styles.abilityBoard}>{abilities.map((ability) => <article key={ability.title}><small>{ability.meta}</small><b>{ability.title}</b><p>{ability.body}</p></article>)}</div></section> : null}
    {skillEntries.length ? <section className={styles.referenceSection}><h2>Skill Tree</h2><MediaCards entries={skillEntries} /></section> : null}
    {variants.length ? <section className={styles.referenceSection}><h2>Variants and memories</h2><MediaCards entries={variants} /></section> : null}
    <AchievementCards record={record} />
    {shellVideos.length ? <section className={styles.referenceSection}><h2>Abilities in motion</h2><div className={styles.videoGrid}>{shellVideos.map((video) => <figure className={styles.videoCard} key={video.src}><video controls loop muted playsInline poster={video.poster} preload="metadata" src={video.src} /><figcaption><PlayCircle size={14} />{video.label}</figcaption></figure>)}</div></section> : null}
    <RelatedConditions extra={details.abilities} kind="shell" record={record} />
  </>;
}

function EquipmentReferences({ record }: { record: WikiRecord }) {
  const details = record.details;
  const compatible = tarstoneArchive.filter((stone) => arrayValue(stone.details.compatibleEquipment).some((entry) => objectValue(entry)?.id === record.id));
  const abilityTarstones = compatible.filter((stone) => stone.category.toLowerCase().includes("ability"));
  const regularTarstones = compatible.filter((stone) => !stone.category.toLowerCase().includes("ability"));
  const progression = arrayValue(details.progression);
  const displayedTarstones = regularTarstones.length ? regularTarstones : tarstoneArchive.filter((stone) => /sidearm/i.test(stone.category)).slice(0, 6);
  return <>
    {progression.length ? <section className={styles.referenceSection}><h2>Upgrade scaling</h2><div className={styles.referenceTable}><table><thead><tr><th>Level</th><th>Damage</th><th>Energy cost</th></tr></thead><tbody>{progression.map((entry, index) => { const value = objectValue(entry); return <tr key={index}><th>{textValue(value?.level)}</th><td>{textValue(value?.damageMultiplier)}</td><td>{textValue(value?.energyCostMultiplier)}</td></tr>; })}</tbody></table></div></section> : null}
    <section className={styles.referenceSection}><h2>Tarstones</h2>{abilityTarstones.length || displayedTarstones.length ? <MediaCards entries={[
      ...abilityTarstones.map((stone) => ({ title: stone.name, body: stone.description, meta: stone.category, href: `/wiki/tarstones/${stone.id}/`, image: stone.image })),
      ...displayedTarstones.map((stone) => ({ title: stone.name, body: stone.description, meta: stone.category, href: `/wiki/tarstones/${stone.id}/`, image: stone.image })),
    ]} /> : <p className={styles.referenceEmpty}>No Tarstones are linked to this sidearm yet.</p>}</section>
    <AchievementCards record={record} />
    <RelatedConditions record={record} />
  </>;
}

function SkillReferences({ record }: { record: WikiRecord }) {
  const details = record.details;
  const owner = textValue(details.owner ?? details.shell);
  const ownerRecord = shellArchive.find((entry) => entry.name === owner && entry.details.playable === true) ?? shellArchive.find((entry) => entry.name === owner);
  const ownerHref = ownerRecord ? `/wiki/shells/${ownerRecord.id}/` : undefined;
  const levels = arrayValue(details.levels).flatMap((entry, index) => {
    const value = objectValue(entry);
    return value
      ? [{ title: textValue(value.desc ?? value.description ?? value.effect), meta: textValue(value.tier ?? value.level ?? index + 1) }]
      : [];
  });
  return <>
    {ownerRecord ? <section className={styles.referenceSection}><h2>Owner</h2><MediaCards entries={[{ title: ownerRecord.name, body: ownerRecord.description, meta: ownerRecord.category, href: ownerHref, image: ownerRecord.image }]} /></section> : null}
    <section className={styles.referenceSection}>
      <h2>Upgrade ladder</h2>
      {levels.length ? <ol className={styles.skillLadder}>{levels.map((level) => <li key={level.meta}><em>{level.meta}</em><p>{level.title}</p></li>)}</ol> : <p className={styles.referenceEmpty}>No upgrade levels are listed for this skill.</p>}
    </section>
    <RelatedConditions extra={details.levels} record={record} />
  </>;
}

function TarstoneReferences({ record }: { record: WikiRecord }) {
  const levels = arrayValue(record.details.levels).flatMap((entry) => {
    const value = objectValue(entry);
    const effects = arrayValue(value?.effects).map((effect) => {
      const item = objectValue(effect);
      return item ? { label: textValue(item.label), value: textValue(item.value) } : { label: "Effect", value: textValue(effect) };
    });
    return [{ level: textValue(value?.level), effects }];
  });
  const compatible = arrayValue(record.details.compatibleEquipment).flatMap((entry) => {
    const value = objectValue(entry);
    if (!value?.id) return [];
    const target = value.kind === "sidearm"
      ? sidearmArchive.find((item) => item.id === value.id)
      : value.kind === "weapon" ? weaponRecords.find((item) => item.id === value.id || item.details.slug === value.id) : null;
    const href = target ? value.kind === "weapon" ? `/wiki/weapons/${target.details.slug ?? target.id}/` : `/wiki/sidearms/${target.id}/` : undefined;
    return [{ title: target?.name ?? textValue(value.id), body: target ? target.description : "Listed in the launch compatibility field.", meta: textValue(value.kind), href, image: target?.image }];
  });
  return <>
    <section className={styles.referenceSection}>
      <h2>Tempering path</h2>
      {levels.length ? <ol className={styles.levelTrack}>{levels.map((level) => <li key={level.level}><em>{level.level}</em>{level.effects.map((effect) => <span key={`${effect.label}-${effect.value}`}><small>{effect.label}</small><b>{effect.value}</b></span>)}</li>)}</ol> : <p className={styles.referenceEmpty}>No tempering levels are listed.</p>}
    </section>
    <section className={styles.referenceSection}><h2>Fits these weapons</h2><MediaCards entries={compatible.length ? compatible : [{ title: "General slot", body: "This Tarstone is currently recorded as a general slot effect.", empty: true }]} /></section>
    <AchievementCards record={record} />
    <RelatedConditions extra={record.details.levels} record={record} />
  </>;
}

function CatalogReferences({ record, title }: Props) {
  const effects = arrayValue(record.details.effects).flatMap((entry) => {
    const value = objectValue(entry);
    return value ? [{ title: textValue(value.label ?? value.type ?? "Effect"), body: textValue(value.value ?? value.name ?? value.description), meta: textValue(value.trigger ?? value.target ?? "") }] : [];
  });
  const relationships = arrayValue(record.details.relationships).flatMap((entry) => {
    const value = objectValue(entry);
    return value ? [{ title: textValue(value.name), meta: textValue(value.type) }] : [];
  });
  return <>
    {effects.length ? <section className={styles.referenceSection}><h2>{title === "Artifacts" ? "Combat effect" : "What it does"}</h2><div className={styles.effectSheet}>{effects.map((effect) => <article key={`${effect.title}-${effect.body}`}><small>{effect.meta || record.category}</small><b>{effect.title}</b><p>{effect.body}</p></article>)}</div></section> : null}
    {relationships.length ? <section className={styles.referenceSection}><h2>Used with</h2><div className={styles.usedWith}>{relationships.map((entry) => <span key={entry.title}><small>{entry.meta}</small><b>{entry.title}</b></span>)}</div></section> : null}
    <section className={styles.mapStrip}><WikiLocationCard body="Search marked locations and merchants on the world map." href={`/map/?q=${encodeURIComponent(record.name)}`} hrefLabel="Search the interactive map" title={textValue(record.details.acquisition) === "Not documented" ? record.name : textValue(record.details.acquisition)} /></section>
    <AchievementCards record={record} />
    <RelatedConditions extra={record.details.effects} record={record} />
  </>;
}

function SealReferences({ record }: { record: WikiRecord }) {
  const effects = arrayValue(record.details.effects).flatMap((entry) => {
    const value = objectValue(entry);
    return value ? [{ title: textValue(value.label), body: textValue(value.value) }] : [];
  });
  const resources = arrayValue(record.details.resourceRelations).map((entry) => {
    const resource = textValue(entry);
    const href = resource === "Sidearm" ? "/wiki/sidearms/" : resource === "Break Damage" ? "/wiki/status-effects/trauma/" : "/wiki/items/";
    return { title: resource, body: `Open the ${resource} archive for connected mechanics.`, meta: "Related archive", href };
  });
  return <>
    {effects.length ? <section className={styles.referenceSection}><h2>How it works</h2><ol className={styles.sealSteps}>{effects.map((effect, index) => <li key={effect.title}><em>{String(index + 1).padStart(2, "0")}</em><div><b>{effect.title}</b><p>{effect.body}</p></div></li>)}</ol></section> : null}
    {resources.length ? <section className={styles.referenceSection}><h2>Related systems</h2><MediaCards entries={resources} /></section> : null}
    <AchievementCards record={record} />
    <RelatedConditions extra={record.details.effects} record={record} />
  </>;
}

export function RecordReferenceSections({ record, title }: Props) {
  if (title === "Shells") return <ShellReferences record={record} />;
  if (title === "Skills") return <SkillReferences record={record} />;
  if (title === "Seals") return <SealReferences record={record} />;
  if (title === "Tarstones") return <TarstoneReferences record={record} />;
  if (title === "Sidearms") return <EquipmentReferences record={record} />;
  if (title === "Artifacts" || title === "Items") return <CatalogReferences record={record} title={title} />;
  if (title === "Status Effects") return <StatusEffectReferences record={record} />;
  if (title === "Achievements") return <AchievementReferences record={record} />;
  return null;
}

function linkedWikiRecords(effect: NonNullable<ReturnType<typeof findStatusEffect>>, records: WikiRecord[], extra?: (record: WikiRecord) => unknown) {
  return records.filter((entry) => recordMatchesStatusEffect(effect, entry.id.replace(/[-_]/g, " "), entry.name, entry.description, extra?.(entry)));
}

function StatusEffectReferences({ record }: { record: WikiRecord }) {
  const effect = findStatusEffect(record.id);
  if (!effect) return null;
  const tarstones = linkedWikiRecords(effect, tarstoneArchive, (entry) => entry.details.levels).slice(0, 10);
  const skills = linkedWikiRecords(effect, skillArchive, (entry) => entry.details.levels).slice(0, 10);
  const items = linkedWikiRecords(effect, itemArchive, (entry) => entry.details.effects).slice(0, 8);
  const artifacts = linkedWikiRecords(effect, artifactArchive, (entry) => entry.details.effects).slice(0, 8);
  const weapons = linkedWikiRecords(effect, weaponRecords).slice(0, 6);
  const shells = shellArchive.filter((entry) => entry.details.playable === true && (
    shellStatusEffects(entry.id).some((item) => item.slug === effect.slug)
    || recordMatchesStatusEffect(effect, entry.name, entry.description, entry.details.abilities)
  ));
  const needles = new Set([effect.slug, effect.name.toLowerCase(), ...effect.aliases.map((alias) => alias.toLowerCase())]);
  const encounters = enemyArchive.filter((entry) => {
    const profile = objectValue(entry.details.combatProfile);
    const vulnerable = objectValue(profile?.vulnerableTo);
    return arrayValue(vulnerable?.values).some((value) => needles.has(String(value).toLowerCase()));
  }).slice(0, 8);
  const relatedConditions = arrayValue(record.details.related).flatMap((entry) => {
    const value = objectValue(entry);
    const href = textValue(value?.href);
    if (!href.includes("/wiki/status-effects/") || href === `/wiki/status-effects/${record.id}/`) return [];
    const slug = href.split("/").filter(Boolean).at(-1);
    const target = statusEffectRecords.find((item) => item.id === slug);
    return target ? [{ title: target.name, body: target.description, meta: target.category, href: `/wiki/status-effects/${target.id}/`, image: target.image }] : [];
  });
  return <>
    <section className={styles.referenceSection}>
      <h2>Game wording</h2>
      <div className={styles.effectSheet}><article><small>{effect.category}{effect.stacks ? ` · Max stacks ${effect.stacks}` : ""}</small><b>{effect.name}</b><p>{effect.description}</p></article></div>
    </section>
    {tarstones.length ? <section className={styles.referenceSection}><h2>Tarstones</h2><MediaCards entries={tarstones.map((entry) => ({ title: entry.name, body: entry.description, meta: entry.category, href: `/wiki/tarstones/${entry.id}/`, image: entry.image }))} /></section> : null}
    {shells.length ? <section className={styles.referenceSection}><h2>Shells</h2><MediaCards entries={shells.map((entry) => ({ title: entry.name, body: entry.description, meta: entry.category, href: `/wiki/shells/${entry.id}/`, image: entry.image }))} /></section> : null}
    {skills.length ? <section className={styles.referenceSection}><h2>Skills</h2><MediaCards entries={skills.map((entry) => ({ title: entry.name, body: entry.description, meta: textValue(entry.details.owner ?? entry.category), href: `/wiki/skills/${entry.id}/`, image: entry.image }))} /></section> : null}
    {weapons.length ? <section className={styles.referenceSection}><h2>Weapons</h2><MediaCards entries={weapons.map((entry) => ({ title: entry.name, body: entry.description, meta: entry.category, href: `/wiki/weapons/${String(entry.details.slug ?? entry.id)}/`, image: entry.image }))} /></section> : null}
    {items.length ? <section className={styles.referenceSection}><h2>Items</h2><MediaCards entries={items.map((entry) => ({ title: entry.name, body: entry.description, meta: entry.category, href: `/wiki/items/${entry.id}/`, image: entry.image }))} /></section> : null}
    {artifacts.length ? <section className={styles.referenceSection}><h2>Artifacts</h2><MediaCards entries={artifacts.map((entry) => ({ title: entry.name, body: entry.description, meta: entry.category, href: `/wiki/artifacts/${entry.id}/`, image: entry.image }))} /></section> : null}
    {encounters.length ? <section className={styles.referenceSection}><h2>Encounters weak to this</h2><MediaCards entries={encounters.map((entry) => ({ title: entry.name, body: entry.description, meta: entry.category, href: `/enemies/${entry.id}/`, image: entry.image }))} /></section> : null}
    {relatedConditions.length ? <section className={styles.referenceSection}><h2>Related conditions</h2><MediaCards entries={relatedConditions} /></section> : null}
    <section className={styles.referenceSection}>
      <h2>Keep looking</h2>
      <MediaCards entries={[
        { title: "All status effects", body: "Browse every 1.0 launch condition.", meta: "Wiki", href: "/wiki/status-effects/" },
        { title: "Weakness Finder", body: "Rank enemies and Bosses by resistance.", meta: "Tools", href: "/tools/weakness-finder/" },
        { title: "Tarstones", body: "Find gems that inflict or interact with this condition.", meta: "Wiki", href: "/wiki/tarstones/" },
      ]} />
    </section>
  </>;
}

function wikiRecordForEntity(entity: { kind: string; slug: string; name: string } | null | undefined) {
  if (!entity) return null;
  if (entity.kind === "shell") return shellArchive.find((entry) => entry.id === entity.slug || entry.name === entity.name) ?? null;
  if (entity.kind === "weapon") return weaponRecords.find((entry) => entry.id === entity.slug || entry.details.slug === entity.slug || entry.name === entity.name) ?? null;
  if (entity.kind === "sidearm") return sidearmArchive.find((entry) => entry.id === entity.slug || entry.name === entity.name) ?? null;
  if (entity.kind === "boss" || entity.kind === "enemy") return enemyArchive.find((entry) => entry.id === entity.slug || entry.name === entity.name) ?? null;
  if (entity.kind === "item") return itemArchive.find((entry) => entry.id === entity.slug || entry.name === entity.name) ?? null;
  if (entity.kind === "tarstone") return tarstoneArchive.find((entry) => entry.id === entity.slug || entry.name === entity.name) ?? null;
  if (entity.kind === "seal") return sealArchive.find((entry) => entry.id === entity.slug || entry.name === entity.name) ?? null;
  return null;
}

function AchievementReferences({ record }: { record: WikiRecord }) {
  const entry = achievements.find((item) => item.slug === record.id);
  if (!entry) return null;
  const entity = objectValue(record.details.entity) as { kind: string; slug: string; name: string } | null;
  const linked = wikiRecordForEntity(entity);
  const linkedHref = linked
    ? entity?.kind === "weapon"
      ? `/wiki/weapons/${String(linked.details.slug ?? linked.id)}/`
      : achievementEntityPath(entity)
    : achievementEntityPath(entity);
  const note = textValue(record.details.note);
  const namedRecords = [
    ...shellArchive.filter((item) => record.description.toLowerCase().includes(item.name.toLowerCase()) && item.details.playable === true),
    ...weaponRecords.filter((item) => record.description.toLowerCase().includes(item.name.toLowerCase())),
    ...sidearmArchive.filter((item) => record.description.toLowerCase().includes(item.name.toLowerCase())),
    ...itemArchive.filter((item) => record.description.toLowerCase().includes(item.name.toLowerCase()) && item.name.length > 3),
    ...tarstoneArchive.filter((item) => record.description.toLowerCase().includes(item.name.toLowerCase()) && item.name.length > 4),
    ...sealArchive.filter((item) => record.description.toLowerCase().includes(item.name.toLowerCase())),
    ...enemyArchive.filter((item) => record.description.toLowerCase().includes(item.name.toLowerCase()) && item.name.length > 3),
  ].filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index)
    .filter((item) => item.id !== linked?.id)
    .slice(0, 8);
  const relatedAchievements = achievementRecords.filter((item) => item.id !== record.id && item.category === record.category).slice(0, 8);
  const hrefFor = (item: WikiRecord) => {
    if (weaponRecords.includes(item)) return `/wiki/weapons/${String(item.details.slug ?? item.id)}/`;
    if (enemyArchive.includes(item)) return `/enemies/${item.id}/`;
    if (shellArchive.includes(item)) return `/wiki/shells/${item.id}/`;
    if (sidearmArchive.includes(item)) return `/wiki/sidearms/${item.id}/`;
    if (itemArchive.includes(item)) return `/wiki/items/${item.id}/`;
    if (tarstoneArchive.includes(item)) return `/wiki/tarstones/${item.id}/`;
    if (sealArchive.includes(item)) return `/wiki/seals/${item.id}/`;
    return `/wiki/${item.id}/`;
  };
  const kindLabel = entity?.kind === "boss" ? "Boss" : entity?.kind ? entity.kind.replace(/^./, (letter) => letter.toUpperCase()) : "Linked record";
  return <>
    <section className={styles.referenceSection}>
      <h2>Requirement</h2>
      <div className={styles.effectSheet}><article><small>{record.category}{entry.hidden ? " · Hidden" : ""}{entry.missable ? " · Missable" : ""}{entry.prologue ? " · Prologue" : ""}</small><b>{record.name}</b><p>{record.description}</p></article></div>
    </section>
    {note !== "Not documented" ? <section className={styles.referenceSection}><h2>Unlock note</h2><p className={styles.evidenceNote}>{note}</p></section> : null}
    {linked || linkedHref ? <section className={styles.referenceSection}><h2>{kindLabel}</h2><MediaCards entries={[{ title: linked?.name ?? entity?.name ?? "Linked record", body: linked?.description || record.description, meta: linked?.category ?? kindLabel, href: linkedHref ?? undefined, image: linked?.image ?? record.image }]} /></section> : null}
    {namedRecords.length ? <section className={styles.referenceSection}><h2>Related pages</h2><MediaCards entries={namedRecords.map((item) => ({ title: item.name, body: item.description, meta: item.category, href: hrefFor(item), image: item.image }))} /></section> : null}
    {relatedAchievements.length ? <section className={styles.referenceSection}><h2>Same category</h2><MediaCards entries={relatedAchievements.map((item) => ({ title: item.name, body: item.description, meta: item.category, href: achievementPath(item.id), image: item.image }))} /></section> : null}
    <section className={styles.referenceSection}>
      <h2>Keep looking</h2>
      <MediaCards entries={[
        { title: "All achievements", body: "Browse every 1.0 launch trophy.", meta: "Wiki", href: "/wiki/achievements/" },
        { title: "Shells", body: "Claimable Shells tied to several trophies.", meta: "Wiki", href: "/wiki/shells/" },
        { title: "Weapons", body: "Unlock routes for melee trophies.", meta: "Wiki", href: "/wiki/weapons/" },
        { title: "Bosses", body: "Encounter records for boss trophies.", meta: "Wiki", href: "/bosses/" },
      ]} />
    </section>
  </>;
}
