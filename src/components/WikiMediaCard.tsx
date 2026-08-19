import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "@/style/common/media-card.module.css";

export type WikiMediaCardProps = {
  title: string;
  href?: string;
  image?: string | null;
  imageAlt?: string;
  meta?: string;
  body?: string;
  empty?: boolean;
  layout?: "row" | "tile";
};

const remoteSrc = (image?: string | null) => {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("/assets/") || image.startsWith("/images/")) return image;
  return `https://mortalshelldb.com${image.startsWith("/") ? image : `/${image}`}`;
};

export function WikiMediaCard({ title, href, image, imageAlt, meta, body, empty = false, layout = "row" }: WikiMediaCardProps) {
  const src = remoteSrc(image);
  const tile = layout === "tile" && Boolean(src);
  const content = (
    <>
      {src ? <span className={styles.art}><Image alt={imageAlt ?? title} fill sizes={tile ? "180px" : "96px"} src={src} /></span> : null}
      <span className={styles.copy}>
        {meta ? <small>{meta}</small> : null}
        <b>{title}</b>
        {body ? <em>{body}</em> : null}
      </span>
      {href ? <ArrowRight className={styles.arrow} size={14} /> : null}
    </>
  );
  const className = `${styles.card} ${tile ? styles.tile : styles.row}${src ? "" : ` ${styles.textOnly}`}`;
  if (href) return <Link className={className} data-empty={empty ? "true" : undefined} href={href}>{content}</Link>;
  return <div className={className} data-empty={empty ? "true" : undefined}>{content}</div>;
}

export function WikiMediaGrid({ children, layout = "row" }: { children: React.ReactNode; layout?: "row" | "tile" }) {
  return <div className={`${styles.grid} ${layout === "tile" ? styles.tileGrid : styles.rowGrid}`}>{children}</div>;
}

export function WikiLocationCard({
  title,
  body,
  href,
  hrefLabel,
  image = "/images/map/open-beta-world-map-preview.webp",
}: {
  title: string;
  body?: string;
  href: string;
  hrefLabel: string;
  image?: string;
}) {
  return (
    <Link className={styles.location} href={href}>
      <Image alt="" fill sizes="(max-width: 768px) 100vw, 420px" src={image} />
      <span className={styles.locationShade} />
      <span className={styles.locationCopy}>
        <small>World map</small>
        <b>{title}</b>
        {body ? <em>{body}</em> : null}
        <strong>{hrefLabel} <ArrowRight size={14} /></strong>
      </span>
    </Link>
  );
}
