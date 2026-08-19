import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveRecordPage } from "@/page/archive/components/ArchiveRecordPage";
import { findArchiveRecord, skillArchive } from "@/lib/data/wiki";
import { getRecordMetadata } from "@/seo/tdk";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return skillArchive.map((record) => ({ slug: record.id })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findArchiveRecord(skillArchive, (await params).slug);
  return record ? getRecordMetadata(record.seo, `/wiki/skills/${record.id}/`) : {};
}
export default async function SkillDetailPage({ params }: PageProps) {
  const record = findArchiveRecord(skillArchive, (await params).slug);
  if (!record) notFound();
  return <ArchiveRecordPage basePath="/wiki/skills" parent={{ label: "Wiki", href: "/wiki/" }} record={record} related={skillArchive.filter((entry) => entry.id !== record.id)} title="Skills" />;
}
