import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, Info } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { findGuide, guides } from "@/lib/data/guides";
import { siteConfig } from "@/config/site";
import { getRecordMetadata } from "@/seo/tdk";
import styles from "@/style/page/guides/guides.module.css";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = findGuide((await params).slug);
  if (!guide) return {};
  return getRecordMetadata(guide.seo, `/guides/${guide.slug}/`);
}

export default async function GuideDetailPage({ params }: PageProps) {
  const guide = findGuide((await params).slug);
  if (!guide) notFound();

  const canonical = `${siteConfig.url}/guides/${guide.slug}/`;
  const breadcrumbItems = [
    { name: "Home", item: siteConfig.url },
    { name: "Guides", item: `${siteConfig.url}/guides/` },
    { name: guide.title, item: canonical },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.seo.description,
        url: canonical,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        dateModified: guide.updatedAt,
        image: `${siteConfig.url}${guide.image}`,
        author: { "@id": `${siteConfig.url}/#organization` },
        publisher: { "@id": `${siteConfig.url}/#organization` },
        about: { "@type": "VideoGame", name: "Mortal Shell II" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: entry.name, item: entry.item })),
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((entry) => ({ "@type": "Question", name: entry.question, acceptedAnswer: { "@type": "Answer", text: entry.answer } })),
      },
    ],
  };

  return (
    <div className={styles.detailPage}>
      <JsonLd data={schema} />
      <Breadcrumbs items={[{ label: "Guides", href: "/guides/" }, { label: guide.title }]} />
      <header className={styles.detailHero}>
        <Image alt={guide.imageAlt} fill priority sizes="(max-width: 768px) 100vw, 1120px" src={guide.image} />
        <span className={styles.detailHeroShade} />
        <div className={styles.detailHeroContent}>
          <p>{guide.kicker}</p>
          <h1>{guide.title}</h1>
          <div>{guide.excerpt}</div>
          <span className={styles.status}>{guide.status}</span>
        </div>
      </header>

      <dl className={styles.facts} aria-label="Guide facts">
        {guide.quickFacts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
      </dl>

      <div className={styles.article}>
        <article className={styles.content}>
          <p>{guide.excerpt} This page is written as a practical reference for the current beta, with the evidence status kept visible wherever a route, reward, or balance value may change.</p>
          {guide.sections.map((section, index) => (
            <section className={styles.section} id={`guide-section-${index + 1}`} key={section.heading}>
              <h2>{section.heading}</h2>
              <figure className={styles.figure}>
                <Image alt={section.imageAlt} fill sizes="(max-width: 768px) 100vw, 780px" src={section.image} />
                <figcaption>{section.caption}</figcaption>
              </figure>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <ul aria-label={`${section.heading} key points`}>
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
              {index === 0 ? <p className={styles.sourceNote}><Info size={14} /> Data note: use the record-status label on linked Wiki pages before treating a value as final.</p> : null}
            </section>
          ))}

          <section className={styles.faq} aria-labelledby="guide-faq-title">
            <h2 id="guide-faq-title">Guide FAQ</h2>
            {guide.faq.map((entry) => <details key={entry.question}><summary>{entry.question}</summary><p>{entry.answer}</p></details>)}
          </section>
        </article>

        <aside className={styles.sidebar} aria-label="Guide navigation">
          <section className={styles.sidebarPanel}>
            <Link className={styles.guideCardLink} href="/guides/"><ArrowLeft size={14} /> All guides</Link>
            <h2>On this page</h2>
            <div className={styles.related}>
              {guide.sections.map((section, index) => <a href={`#guide-section-${index + 1}`} key={section.heading}>{section.heading.replace(/^\d+\.\s*/, "")} <ArrowRight size={13} /></a>)}
              <a href="#guide-faq-title">Guide FAQ <ArrowRight size={13} /></a>
            </div>
          </section>
          <section className={styles.sidebarPanel}>
            <h2>Related pages</h2>
            <div className={styles.related}>{guide.related.map((entry) => <Link href={entry.href} key={entry.href}>{entry.label}<ArrowRight size={13} /></Link>)}</div>
          </section>
          <section className={styles.sidebarPanel}>
            <h2><Clock3 size={16} /> Reviewed</h2>
            <p>{guide.updatedAt} · {guide.status}. If the launch build changes a route, reward, or balance value, this guide will be updated with the new evidence.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
