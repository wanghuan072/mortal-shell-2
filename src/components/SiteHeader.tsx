import Link from "next/link";
import { Menu } from "lucide-react";
import { siteSearchEntries } from "@/lib/data/wiki";
import { primaryNav } from "@/config/site";
import { SiteSearch } from "./SiteSearch";
import styles from "@/style/common/shared.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="Mortal Shell II Wiki home">
          Mortal Shell <b>II</b>
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {primaryNav.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerSearch}>
          <SiteSearch entries={siteSearchEntries} />
        </div>
        <details className={styles.mobileNav}>
          <summary aria-label="Open navigation">
            <Menu size={20} />
          </summary>
          <div>
            <SiteSearch entries={siteSearchEntries} />
            {primaryNav.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
