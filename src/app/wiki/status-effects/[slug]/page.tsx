import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveRecordPage } from "@/page/archive/components/ArchiveRecordPage";
import { findStatusEffect, statusEffectRecords } from "@/lib/data/status-effects";
import { getRecordMetadata } from "@/seo/tdk";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return statusEffectRecords.map((record) => ({ slug: record.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const record = findStatusEffect((await params).slug);
  const entry = statusEffectRecords.find((item) => item.id === record?.slug);
  return entry ? getRecordMetadata(entry.seo, `/wiki/status-effects/${entry.id}/`) : {};
}

export default async function StatusEffectDetailPage({ params }: PageProps) {
  const slug = (await params).slug;
  const record = statusEffectRecords.find((entry) => entry.id === slug);
  if (!record) notFound();
  return <ArchiveRecordPage
    basePath="/wiki/status-effects"
    parent={{ label: "Wiki", href: "/wiki/" }}
    record={record}
    related={statusEffectRecords.filter((entry) => entry.id !== record.id)}
    title="Status Effects"
  />;
}
