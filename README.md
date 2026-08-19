# Mortal Shell II Wiki

An independent, SEO-first Mortal Shell II Wiki built with Next.js 16 and React 19. The visual system follows the supplied dark-fantasy desktop designs while the content follows a stricter rule: official facts and inspected Open Beta records are published; unsupported values remain explicitly unverified.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. If that port is occupied, Next.js will report the available local URL.

Production verification:

```bash
npm run lint
npm run build
npm run start
```

## Implemented routes

- `/` — landing page
- `/wiki/` — Wiki category hub
- `/shells/` — verified Shell preview
- `/weapons/` — searchable and filterable weapon database
- `/weapons/[slug]/` — statically generated weapon detail pages
- `/guides/`, `/enemies/`, `/map/`, `/updates/`, `/game-info/` — supporting first-stage hubs
- `/sitemap.xml`, `/robots.txt` — generated search-engine discovery files

## Content sources

- Official Mortal Shell II media for screenshots and confirmed release information.
- Inspected Open Beta exports under `\\192.168.2.5\MortalShell2_OpenBeta_Extract` for weapon item names, descriptions, gameplay tags, progression caps, Shell portraits, and the world-map texture.
- Weapon records intentionally omit unverified damage, rarity, scaling, acquisition, and synergy values.

The interactive map ships a 2200px WebP preview (`public/images/map/open-beta-world-map-preview.webp`). The 8K source PNG is local-only and gitignored so it is not pushed to GitHub.

## Canonical domain

The default metadata base is `https://mortalshell.org`. Override it for another deployment:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

## Social preview

The site-wide Open Graph card is `public/images/og-image.png`. The logo used by metadata and structured data is `public/images/logo.png`.
