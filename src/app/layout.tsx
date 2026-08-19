import type { Metadata } from "next";
import Script from "next/script";
import { Cinzel, Inter } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { getPageMetadata } from "@/seo/tdk";
import "leaflet/dist/leaflet.css";
import "@/style/globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  ...getPageMetadata("home", "/"),
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: siteConfig.logo,
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${cinzel.variable} ${inter.variable}`} lang="en">
      <body>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            setTimeout(function () {
              var script = document.createElement('script');
              script.async = true;
              script.src = 'https://www.googletagmanager.com/gtag/js?id=G-GN0ZVN85H5';
              document.head.appendChild(script);

              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GN0ZVN85H5');
            }, 3000);
          `}
        </Script>
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [
          { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: siteConfig.name, url: siteConfig.url, logo: `${siteConfig.url}${siteConfig.logo}`, email: "wyong@mortalshell.org" },
          { "@type": "WebSite", "@id": `${siteConfig.url}/#website`, name: siteConfig.name, url: siteConfig.url, description: siteConfig.description, publisher: { "@id": `${siteConfig.url}/#organization` } },
        ] }} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
