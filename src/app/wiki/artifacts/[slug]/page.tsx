import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveRecordPage } from "@/page/archive/components/ArchiveRecordPage";
import { artifactArchive, findArchiveRecord } from "@/lib/data/wiki";
import { getRecordMetadata } from "@/seo/tdk";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return artifactArchive.map((record) => ({ slug: record.id })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findArchiveRecord(artifactArchive, (await params).slug);
  return record ? getRecordMetadata(record.seo, `/wiki/artifacts/${record.id}/`) : {};
}
export default async function ArtifactDetailPage({ params }: PageProps) {
  const record = findArchiveRecord(artifactArchive, (await params).slug);
  if (!record) notFound();
  return <ArchiveRecordPage basePath="/wiki/artifacts" parent={{ label: "Wiki", href: "/wiki/" }} record={record} related={artifactArchive.filter((entry) => entry.id !== record.id)} title="Artifacts" />;
}
