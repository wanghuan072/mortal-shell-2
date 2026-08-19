import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "@/style/common/shared.module.css";

export function SectionTitle({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{title}</h2>
      <span aria-hidden="true" />
      {href && (
        <Link href={href}>
          {linkLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
