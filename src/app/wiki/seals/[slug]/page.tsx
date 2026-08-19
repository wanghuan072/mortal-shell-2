import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveRecordPage } from "@/page/archive/components/ArchiveRecordPage";
import { findArchiveRecord, sealArchive } from "@/lib/data/wiki";
import { getRecordMetadata } from "@/seo/tdk";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return sealArchive.map((record) => ({ slug: record.id })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findArchiveRecord(sealArchive, (await params).slug);
  return record ? getRecordMetadata(record.seo, `/wiki/seals/${record.id}/`) : {};
}
export default async function SealDetailPage({ params }: PageProps) {
  const record = findArchiveRecord(sealArchive, (await params).slug);
  if (!record) notFound();
  return <ArchiveRecordPage basePath="/wiki/seals" parent={{ label: "Wiki", href: "/wiki/" }} record={record} related={sealArchive.filter((entry) => entry.id !== record.id)} title="Seals" />;
}
