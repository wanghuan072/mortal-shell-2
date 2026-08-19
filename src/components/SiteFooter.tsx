import Link from "next/link";
import { Disc3, GitFork, MessageCircle } from "lucide-react";
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
            Player-focused Mortal Shell II information for weapons, Shells, items, encounters, and map locations, so you can decide what to try next.
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
        <div>
          <h2>Community</h2>
          <div className={styles.socials} aria-label="Community channels">
            <span title="Steam"><Disc3 size={20} /></span>
            <span title="Community"><MessageCircle size={20} /></span>
            <span title="Community updates"><GitFork size={20} /></span>
          </div>
          <p className={styles.muted}>Community links will be added after their official destinations are verified.</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>Copyright © {currentYear} {siteConfig.name}. All rights reserved.</p>
        <p className={styles.disclaimer}>This is an unofficial fan site and is not affiliated with, endorsed by, or connected to the official Mortal Shell games, Cold Symmetry, or Playstack.</p>
      </div>
    </footer>
  );
}
