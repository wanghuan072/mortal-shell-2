import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveRecordPage } from "@/page/archive/components/ArchiveRecordPage";
import { findArchiveRecord, itemArchive } from "@/lib/data/wiki";
import { getRecordMetadata } from "@/seo/tdk";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return itemArchive.map((record) => ({ slug: record.id })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findArchiveRecord(itemArchive, (await params).slug);
  return record ? getRecordMetadata(record.seo, `/wiki/items/${record.id}/`) : {};
}
export default async function ItemDetailPage({ params }: PageProps) {
  const record = findArchiveRecord(itemArchive, (await params).slug);
  if (!record) notFound();
  return <ArchiveRecordPage basePath="/wiki/items" parent={{ label: "Wiki", href: "/wiki/" }} record={record} related={itemArchive.filter((entry) => entry.id !== record.id)} title="Items" />;
}
