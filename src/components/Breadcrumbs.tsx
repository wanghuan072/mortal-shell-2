import Link from "next/link";
import { ChevronRight, House } from "lucide-react";
import styles from "@/style/common/shared.module.css";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <Link href="/" aria-label="Home">
        <House size={14} />
      </Link>
      {items.map((item) => (
        <span className={styles.crumb} key={item.label}>
          <ChevronRight size={13} aria-hidden="true" />
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
