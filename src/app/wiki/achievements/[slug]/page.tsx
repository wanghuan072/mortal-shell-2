import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveRecordPage } from "@/page/archive/components/ArchiveRecordPage";
import { achievementRecords, findAchievement } from "@/lib/data/achievements";
import { getRecordMetadata } from "@/seo/tdk";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return achievementRecords.map((record) => ({ slug: record.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findAchievement((await params).slug);
  const entry = achievementRecords.find((item) => item.id === record?.slug);
  return entry ? getRecordMetadata(entry.seo, `/wiki/achievements/${entry.id}/`) : {};
}

export default async function AchievementDetailPage({ params }: PageProps) {
  const slug = (await params).slug;
  const record = achievementRecords.find((entry) => entry.id === slug);
  if (!record) notFound();
  return <ArchiveRecordPage
    basePath="/wiki/achievements"
    parent={{ label: "Wiki", href: "/wiki/" }}
    record={record}
    related={achievementRecords.filter((entry) => entry.id !== record.id)}
    title="Achievements"
  />;
}
