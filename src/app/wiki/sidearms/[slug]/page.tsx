import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveRecordPage } from "@/page/archive/components/ArchiveRecordPage";
import { findArchiveRecord, sidearmArchive } from "@/lib/data/wiki";
import { getRecordMetadata } from "@/seo/tdk";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return sidearmArchive.map((record) => ({ slug: record.id })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findArchiveRecord(sidearmArchive, (await params).slug);
  return record ? getRecordMetadata(record.seo, `/wiki/sidearms/${record.id}/`) : {};
}
export default async function SidearmDetailPage({ params }: PageProps) {
  const record = findArchiveRecord(sidearmArchive, (await params).slug);
  if (!record) notFound();
  return <ArchiveRecordPage basePath="/wiki/sidearms" parent={{ label: "Wiki", href: "/wiki/" }} record={record} related={sidearmArchive.filter((entry) => entry.id !== record.id)} title="Sidearms" />;
}
