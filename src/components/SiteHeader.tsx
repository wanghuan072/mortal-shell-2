import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { siteSearchEntries } from "@/lib/data/wiki";
import { primaryNav, type NavItem } from "@/config/site";
import { SiteSearch } from "./SiteSearch";
import styles from "@/style/common/shared.module.css";

function NavItemLink({ item, mobile = false }: { item: NavItem; mobile?: boolean }) {
  if (!item.children?.length) {
    return <Link href={item.href}>{item.label}</Link>;
  }
  if (mobile) {
    return (
      <div className={styles.mobileGroup}>
        <Link href={item.href}>{item.label}</Link>
        {item.children.map((child) => (
          <Link className={styles.mobileChild} href={child.href} key={child.href}>{child.label}</Link>
        ))}
      </div>
    );
  }
  return (
    <div className={styles.navGroup}>
      <Link className={styles.navTrigger} href={item.href}>
        {item.label}
        <ChevronDown size={12} aria-hidden="true" />
      </Link>
      <div className={styles.navMenu}>
        {item.children.map((child) => (
          <Link href={child.href} key={child.href}>{child.label}</Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href="/" aria-label="Mortal Shell II Wiki home">
          Mortal Shell <b>II</b>
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {primaryNav.map((item) => <NavItemLink item={item} key={item.href} />)}
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
            {primaryNav.map((item) => <NavItemLink item={item} key={item.href} mobile />)}
          </div>
        </details>
      </div>
    </header>
  );
}
