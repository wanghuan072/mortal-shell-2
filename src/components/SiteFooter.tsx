import Link from "next/link";
import { primaryNav, siteConfig } from "@/config/site";
import styles from "@/style/common/shared.module.css";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div>
          <p className={styles.footerBrand}>Mortal Shell <b>II</b></p>
          <p>
            Mortal Shell II Wiki: weapons, Shells, items, encounters, and map locations. 1.0 launch version.
          </p>
        </div>
        <div>
          <h2>Quick links</h2>
          {primaryNav.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </div>
        <div>
          <h2>Legal</h2>
          <Link href="/legal/privacy-policy/" rel="noopener noreferrer nofollow">Privacy Policy</Link>
          <Link href="/legal/terms-of-service/" rel="noopener noreferrer nofollow">Terms of Service</Link>
          <Link href="/legal/copyright/" rel="noopener noreferrer nofollow">Copyright</Link>
          <Link href="/legal/about-us/" rel="noopener noreferrer nofollow">About Us</Link>
          <Link href="/legal/contact-us/" rel="noopener noreferrer nofollow">Contact Us</Link>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>Copyright © {currentYear} {siteConfig.name}. All rights reserved.</p>
        <p className={styles.disclaimer}>This is an unofficial fan site and is not affiliated with, endorsed by, or connected to the official Mortal Shell games, Cold Symmetry, or Playstack.</p>
      </div>
    </footer>
  );
}
