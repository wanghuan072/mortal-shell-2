import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveRecordPage } from "@/page/archive/components/ArchiveRecordPage";
import { findArchiveRecord, tarstoneArchive } from "@/lib/data/wiki";
import { getRecordMetadata } from "@/seo/tdk";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return tarstoneArchive.map((record) => ({ slug: record.id })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findArchiveRecord(tarstoneArchive, (await params).slug);
  return record ? getRecordMetadata(record.seo, `/wiki/tarstones/${record.id}/`) : {};
}
export default async function TarstoneDetailPage({ params }: PageProps) {
  const record = findArchiveRecord(tarstoneArchive, (await params).slug);
  if (!record) notFound();
  return <ArchiveRecordPage basePath="/wiki/tarstones" parent={{ label: "Wiki", href: "/wiki/" }} record={record} related={tarstoneArchive.filter((entry) => entry.id !== record.id)} title="Tarstones" />;
}
