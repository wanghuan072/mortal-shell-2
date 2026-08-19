import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveRecordPage } from "@/page/archive/components/ArchiveRecordPage";
import { findArchiveRecord, shellArchive } from "@/lib/data/wiki";
import { getRecordMetadata } from "@/seo/tdk";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return shellArchive.map((record) => ({ slug: record.id })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findArchiveRecord(shellArchive, (await params).slug);
  return record ? getRecordMetadata(record.seo, `/shells/${record.id}/`) : {};
}
export default async function ShellDetailPage({ params }: PageProps) {
  const record = findArchiveRecord(shellArchive, (await params).slug);
  if (!record) notFound();
  return <ArchiveRecordPage basePath="/shells" record={record} related={shellArchive.filter((entry) => entry.id !== record.id)} title="Shells" />;
}
