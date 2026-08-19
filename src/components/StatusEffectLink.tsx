import Link from "next/link";
import { statusEffectHref } from "@/lib/data/status-effects";

type Props = { label: string; children?: string };

export function StatusEffectLink({ label, children }: Props) {
  const href = statusEffectHref(label);
  const text = children ?? label;
  if (!href) return <>{text}</>;
  return <Link href={href}>{text}</Link>;
}
