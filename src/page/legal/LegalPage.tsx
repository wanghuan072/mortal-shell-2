import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import styles from "@/style/page/legal/legal.module.css";

type LegalSection = { heading: string; body: ReactNode };
type LegalPageKey = "privacy-policy" | "terms-of-service" | "copyright" | "about-us" | "contact-us";

const emailAddress = "wyong@mortalshell.org";
const emailLink = <a href={`mailto:${emailAddress}`} rel="noopener noreferrer nofollow">{emailAddress}</a>;

const pages: Record<LegalPageKey, { title: string; description: string; intro: string; sections: LegalSection[] }> = {
  "privacy-policy": {
    title: "Mortal Shell II Privacy Policy",
    description: "How this fan site handles basic technical information and communications.",
    intro: "This policy explains the limited information that may be processed when you browse this site or contact its maintainer.",
    sections: [
      { heading: "Scope", body: <><p>This Privacy Policy applies to {siteConfig.name}, including its guides, wiki pages, map features, and legal pages. It does not apply to third-party websites that may be linked from this site.</p><p>By using the site, you acknowledge that this policy describes a fan-run information site. It is not an account service, store, or official game platform.</p></> },
      { heading: "Information processed", body: <><p>The site does not require visitor accounts, registration, or payment details. Like most websites, its hosting and security services may process standard technical information needed to deliver and protect the site, such as browser type, device information, IP address, requested pages, and basic server logs.</p><p>If you choose to email us, we receive the information you include in that message, such as your email address and the subject of your enquiry.</p></> },
      { heading: "How information is used", body: <><p>Technical information may be used to operate the site, diagnose errors, prevent abuse, understand general performance, and keep the service secure. Email correspondence may be used to respond to your question, evaluate a correction, or address a rights-related request.</p><p>We do not sell personal information or use contact messages to create marketing lists.</p></> },
      { heading: "Third-party services", body: <><p>Some pages link to services such as official game channels, Steam, YouTube, or other external destinations. Those services operate under their own policies. Opening an external link may allow that service to collect information according to its own terms.</p></> },
      { heading: "Retention and contact", body: <><p>Technical logs are retained only for as long as reasonably necessary for operations and security. Emails are kept only as long as needed to handle the related conversation or request.</p><p>For privacy questions, contact {emailLink}.</p></> },
    ],
  },
  "terms-of-service": {
    title: "Mortal Shell II Terms of Service",
    description: "Terms for using this independent Mortal Shell II fan site.",
    intro: "These terms set the basic rules for browsing and using this independent fan site.",
    sections: [
      { heading: "Acceptance of these terms", body: <p>By accessing or using {siteConfig.name}, you agree to use the site lawfully and in accordance with these terms. If you do not agree, please do not use the site.</p> },
      { heading: "Informational purpose", body: <><p>The site provides guides and beta-era notes for general informational use. Game information can change, especially before release and during updates. You are responsible for deciding how to use any information shown here.</p><p>The site does not provide official support, warranties, game entitlements, or a guarantee that every entry is complete, current, or error-free.</p></> },
      { heading: "Acceptable use", body: <ul><li>Do not interfere with the site, its security, or other visitors’ access.</li><li>Do not attempt to scrape, copy, or republish the site at scale in a way that harms the service or misrepresents its origin.</li><li>Do not use the site in a way that violates applicable law or the rights of another person or organization.</li></ul> },
      { heading: "External links and changes", body: <p>Links may lead to external websites that are not controlled by this site. We are not responsible for their availability, content, or policies. We may update, remove, or revise pages and these terms as the site develops.</p> },
      { heading: "Questions", body: <p>If you have a question about these terms, email {emailLink}.</p> },
    ],
  },
  copyright: {
    title: "Mortal Shell II Copyright Notice",
    description: "Copyright and intellectual-property notice for this independent fan site.",
    intro: "This notice explains ownership of this site’s original material and respect for the rights of the Mortal Shell rights holders.",
    sections: [
      { heading: "Fan-site status", body: <p>{siteConfig.name} is an unofficial, independent fan site. Mortal Shell II, Mortal Shell, related names, game content, trademarks, logos, and media remain the property of their respective owners. Nothing on this site claims ownership of official game intellectual property.</p> },
      { heading: "Original site material", body: <p>Unless otherwise stated, the site’s original written guides, page layouts, organization, and design elements are protected by applicable copyright law. You may share links to pages and quote short excerpts with clear attribution, but you may not reproduce substantial portions of the site or present them as your own without permission.</p> },
      { heading: "Third-party material", body: <p>Official images, names, videos, and other game-related material are used for identification, commentary, and fan discussion where applicable. Their appearance does not imply sponsorship, approval, or partnership.</p> },
      { heading: "Copyright concerns", body: <p>If you believe material on this site infringes your copyright or other rights, email {emailLink}. Please identify the work concerned, provide the relevant page URL, explain your concern, and include contact information so the request can be reviewed.</p> },
    ],
  },
  "about-us": {
    title: "About Mortal Shell II Wiki",
    description: "What Mortal Shell II Wiki covers and how the pages are written.",
    intro: "Mortal Shell II Wiki covers equipment, encounters, locations, and 1.0 launch records.",
    sections: [
      { heading: "What this site is for", body: <p>Weapon pages, Shell differences, enemy records, and map locations. The site is a reference, not a replacement for official announcements.</p> },
      { heading: "How pages are written", body: <p>Wiki and enemy numbers match the 1.0 launch version. Map markers may still be aligned after launch. Incomplete facts are marked instead of being presented as final.</p> },
      { heading: "Independence", body: <p>This is a fan-made project. It is not operated by, affiliated with, endorsed by, or sponsored by Cold Symmetry, Playstack, or any official Mortal Shell entity.</p> },
      { heading: "Feedback", body: <p>Corrections and constructive feedback are welcome at {emailLink}. Messages that include a specific page and a clear explanation are the easiest to review.</p> },
    ],
  },
  "contact-us": {
    title: "Contact Mortal Shell II Wiki",
    description: "How to contact the maintainer of this independent Mortal Shell II fan site.",
    intro: "For corrections, copyright concerns, or general questions about this site, contact the maintainer by email.",
    sections: [
      { heading: "Email", body: <p>You can reach us at {emailLink}. This is the only contact channel currently offered by the site.</p> },
      { heading: "What to include", body: <p>For a factual correction, include the page URL, the detail you believe needs attention, and any useful context. For copyright or rights-related concerns, identify the material and the page where it appears.</p> },
      { heading: "Responses", body: <p>Messages are read when possible, but this is an independently maintained fan site and no response time is guaranteed. Please do not send passwords, payment information, or other sensitive personal information.</p> },
      { heading: "Official support", body: <p>This site cannot provide game support, account help, purchase assistance, or official announcements. Please use the appropriate official Mortal Shell, platform, or retailer support channel for those requests.</p> },
    ],
  },
};

export function LegalPage({ page }: { page: LegalPageKey }) {
  const content = pages[page];
  const canonical = `${siteConfig.url}/legal/${page}/`;
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: content.title, description: content.description, url: canonical, dateModified: siteConfig.seoUpdatedAt, isPartOf: { "@id": `${siteConfig.url}/#website` }, about: { "@type": "VideoGame", name: "Mortal Shell II" } };
  return <main className={styles.page}>
    <JsonLd data={schema} />
    <Breadcrumbs items={[{ label: "Legal" }, { label: content.title }]} />
    <header className={styles.hero}>
      <p className={styles.eyebrow}>Legal information</p>
      <h1>{content.title}</h1>
      <p className={styles.intro}>{content.intro}</p>
    </header>
    <article className={styles.content}>{content.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.body}</section>)}</article>
    <p className={styles.updated}>Last updated: August 18, 2026.</p>
  </main>;
}
