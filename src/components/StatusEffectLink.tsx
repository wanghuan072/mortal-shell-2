import Image from "next/image";
import Link from "next/link";
import { findStatusEffectByLabel, statusEffectPath } from "@/lib/data/status-effects";
import styles from "@/style/common/entity-chip.module.css";

type Props = {
  label: string;
  children?: string;
  appearance?: "chip" | "inline";
  linked?: boolean;
};

export function StatusEffectLink({ label, children, appearance = "chip", linked = true }: Props) {
  const effect = findStatusEffectByLabel(label);
  const text = children ?? effect?.name ?? label;
  const className = appearance === "inline" ? styles.inline : styles.chip;
  const icon = effect?.icon
    ? <Image alt="" className={styles.icon} height={18} src={effect.icon} width={18} />
    : appearance === "chip" ? <span aria-hidden="true" className={styles.mark}>{text.slice(0, 1)}</span> : null;
  const content = <>{icon}<span>{text}</span></>;
  if (!effect || !linked) return <span className={className}>{content}</span>;
  return <Link className={className} href={statusEffectPath(effect.slug)}>{content}</Link>;
}
