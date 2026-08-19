import Link from "next/link";
import styles from "@/style/page/wiki/weapons/not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>Weapon page not found</p>
      <h1 className={styles.title}>This weapon is not in the verified index.</h1>
      <p className={styles.message}>The URL may be outdated, or this weapon page is not available yet.</p>
      <Link className={styles.link} href="/wiki/weapons/">Browse verified weapons</Link>
    </div>
  );
}
