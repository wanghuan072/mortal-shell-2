import guideData from "@/data/guides.json";

export type GuideLink = { label: string; href: string };
export type GuideSection = {
  heading: string;
  image: string;
  imageAlt: string;
  caption: string;
  paragraphs: string[];
  bullets: string[];
};
export type Guide = {
  slug: string;
  title: string;
  category: string;
  kicker: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  readTime: string;
  updatedAt: string;
  status: string;
  seo: { title: string; description: string; keywords: string[] };
  quickFacts: { label: string; value: string }[];
  sections: GuideSection[];
  related: GuideLink[];
  faq: { question: string; answer: string }[];
};

export const guides = guideData as Guide[];

export function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
