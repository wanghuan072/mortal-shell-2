import type { MetadataRoute } from "next";
import { archiveCollections } from "@/lib/data/wiki";
import { siteConfig } from "@/config/site";
import { guides } from "@/lib/data/guides";
import { weapons } from "@/lib/data/weapons";

const staticPages = [
  { path: "", updatedAt: "2026-08-18", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/wiki/", updatedAt: "2026-08-18", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/wiki/shells/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/wiki/weapons/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/wiki/sidearms/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/wiki/items/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.75 },
  { path: "/wiki/artifacts/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.75 },
  { path: "/wiki/tarstones/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.75 },
  { path: "/wiki/seals/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/wiki/skills/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.75 },
  { path: "/wiki/achievements/", updatedAt: "2026-08-19", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/wiki/status-effects/", updatedAt: "2026-08-19", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/guides/", updatedAt: "2026-08-18", changeFrequency: "weekly" as const, priority: 0.85 },
  { path: "/enemies/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/bosses/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/tools/", updatedAt: "2026-08-18", changeFrequency: "weekly" as const, priority: 0.75 },
  { path: "/tools/planner/", updatedAt: "2026-08-19", changeFrequency: "weekly" as const, priority: 0.75 },
  { path: "/tools/calculator/", updatedAt: "2026-08-19", changeFrequency: "weekly" as const, priority: 0.75 },
  { path: "/tools/tarforge/", updatedAt: "2026-08-18", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/tools/weakness-finder/", updatedAt: "2026-08-18", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/map/", updatedAt: "2026-08-17", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/updates/", updatedAt: "2026-08-17", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/legal/privacy-policy/", updatedAt: "2026-08-18", changeFrequency: "yearly" as const, priority: 0.25 },
  { path: "/legal/terms-of-service/", updatedAt: "2026-08-18", changeFrequency: "yearly" as const, priority: 0.25 },
  { path: "/legal/copyright/", updatedAt: "2026-08-18", changeFrequency: "yearly" as const, priority: 0.25 },
  { path: "/legal/about-us/", updatedAt: "2026-08-18", changeFrequency: "yearly" as const, priority: 0.25 },
  { path: "/legal/contact-us/", updatedAt: "2026-08-18", changeFrequency: "yearly" as const, priority: 0.25 },
];

const asDate = (date: string) => new Date(`${date}T00:00:00.000Z`);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages.map(({ path, updatedAt, changeFrequency, priority }) => ({ url: `${siteConfig.url}${path}`, lastModified: asDate(updatedAt), changeFrequency, priority })),
    ...guides.map((guide) => ({ url: `${siteConfig.url}/guides/${guide.slug}/`, lastModified: asDate(guide.updatedAt), changeFrequency: "weekly" as const, priority: 0.75 })),
    ...weapons.map((weapon) => ({ url: `${siteConfig.url}/wiki/weapons/${weapon.slug}/`, lastModified: asDate(weapon.updatedAt), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...Object.entries(archiveCollections).flatMap(([collection, records]) => {
      const basePath = collection === "enemies" ? "/enemies" : `/wiki/${collection}`;
      return records.map((record) => ({ url: `${siteConfig.url}${basePath}/${record.id}/`, lastModified: asDate(record.updatedAt), changeFrequency: "monthly" as const, priority: 0.65 }));
    }),
  ];
}
