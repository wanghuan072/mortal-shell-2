import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SectionTitle } from "@/components/SectionTitle";
import { researchNotes, siteConfig } from "@/config/site";
import { guides } from "@/lib/data/guides";
import { getPageMetadata } from "@/seo/tdk";
import styles from "@/style/page/section/section.module.css";
import guideStyles from "@/style/page/guides/guides.module.css";

const sections = {
  guides: {
    title: "Mortal Shell II Guides - Combat and Exploration",
    shortTitle: "Guides",
    tdkKey: "guides",
    eyebrow: "Combat and exploration help",
    description: "Practical Mortal Shell II guides for combat, first builds, exploration routes, and current-beta map planning.",
    image: "/images/official/boss.png",
  },
  updates: {
    title: "Mortal Shell II - News and Wiki Updates",
    shortTitle: "Updates",
    tdkKey: "updates",
    eyebrow: "News and page updates",
    description: "Release news, current beta discoveries, and newly recorded Mortal Shell II details.",
    image: "/images/official/shell.png",
  },
} as const;

type SectionKey = keyof typeof sections;
type PageProps = { params: Promise<{ section: string }> };

export function generateStaticParams() { return Object.keys(sections).map((section) => ({ section })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section } = await params;
  const data = sections[section as SectionKey];
  if (!data) return {};
  return getPageMetadata(data.tdkKey, `/${section}/`);
}

export default async function SectionPage({ params }: PageProps) {
  const { section } = await params;
  const data = sections[section as SectionKey];
  if (!data) notFound();
  const isUpdates = section === "updates";
  const canonical = `${siteConfig.url}/${section}/`;
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: data.title, description: data.description, url: canonical, dateModified: isUpdates ? "2026-08-17" : "2026-08-18", isPartOf: { "@id": `${siteConfig.url}/#website` }, about: { "@type": "VideoGame", name: "Mortal Shell II" } };

  return (
    <div className={isUpdates ? styles.page : guideStyles.page}>
      <JsonLd data={schema} />
      <Breadcrumbs items={[{ label: data.shortTitle }]} />
      <section className={styles.hero}>
        <Image alt={`Mortal Shell II ${data.shortTitle.toLowerCase()} artwork`} fill priority sizes="100vw" src={data.image} />
        <span />
        <div><p>{data.eyebrow}</p><h1>{data.title}</h1><div>{data.description}</div></div>
      </section>

      {isUpdates ? (
        <section className={styles.log}>
          <SectionTitle title="Latest changes" />
          {researchNotes.map((note) => <article key={note.title}><time>{note.date}</time><span>{note.label}</span><div><h2>{note.title}</h2><p>{note.description}</p></div></article>)}
        </section>
      ) : (
        <>
          <section className={guideStyles.intro}>
            <p>These guides turn the current data into practical, step-by-step help. Each article includes screenshots, route or combat advice, and a clear note when a detail still comes from the Open Beta.</p>
          </section>
          <section aria-labelledby="guide-list-title">
            <h2 className="sr-only" id="guide-list-title">Mortal Shell II guides</h2>
            <div className={guideStyles.guideGrid}>
              {guides.map((guide) => (
                <Link className={guideStyles.guideCard} href={`/guides/${guide.slug}/`} key={guide.slug}>
                  <div className={guideStyles.guideCardImage}>
                    <Image alt={guide.imageAlt} fill sizes="(max-width: 768px) 100vw, 440px" src={guide.image} />
                    <span className={guideStyles.imageShade} />
                  </div>
                  <div className={guideStyles.guideCardBody}>
                    <div className={guideStyles.guideCardMeta}><span>{guide.category}</span><span>{guide.readTime}</span></div>
                    <h2>{guide.title}</h2>
                    <p>{guide.excerpt}</p>
                    <span className={guideStyles.guideCardLink}>Read the guide <ArrowRight size={14} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
          <div className={guideStyles.guideNote}><b>Editorial note:</b> Guide recommendations are reviewed against the current beta data. Balance values, routes, rewards, and encounter behavior can change before release.</div>
        </>
      )}
    </div>
  );
}
