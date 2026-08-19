import type { LucideIcon } from "lucide-react";
import { StatusEffectLink } from "@/components/StatusEffectLink";
import styles from "@/style/common/status-profile.module.css";

export type StatusProfileRow = {
  label: string;
  values: string[];
  icon?: LucideIcon;
};

export function StatusProfile({ rows }: { rows: StatusProfileRow[] }) {
  const visible = rows.filter((row) => row.values.length);
  if (!visible.length) return null;
  return (
    <div className={styles.rows}>
      {visible.map((row) => {
        const Icon = row.icon;
        return (
          <article className={styles.row} key={row.label}>
            {Icon ? <Icon size={16} /> : null}
            <span className={styles.copy}>
              <b>{row.label}</b>
              <span className={styles.chips}>
                {row.values.map((value) => <StatusEffectLink key={value} label={value} />)}
              </span>
            </span>
          </article>
        );
      })}
    </div>
  );
}
