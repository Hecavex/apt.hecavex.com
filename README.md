# APT Notes by Hecavex

APT Notes is an English-only, source-driven knowledge base of threat actors and their operations. It is a standalone Astro application for `https://apt.hecavex.com`, separate from the Jekyll publication at `https://hecavex.com`.

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Install and develop

```sh
npm ci
npm run dev
```

Astro serves the local site at the URL printed in the terminal. Local development URLs are never written into production metadata.

## Quality and production commands

```sh
npm run lint
npm run validate
npm run check
npm run build
npm test
npm run verify
npm run preview
```

`npm run build` validates content, runs Astro type checking, generates the static site and builds the Pagefind index in `dist/pagefind/`. `npm test` checks required output, canonical metadata, accessibility primitives and draft exclusion after a build.

## Content architecture

Typed collections live in `src/content/`: `actors`, `campaigns`, `malware`, `tools`, `techniques`, `sources` and `updates`. Schemas are centralized in `src/content.config.ts`; controlled vocabularies and confidence definitions are in `src/data/vocabularies.ts`.

Copy a file from `templates/` into the matching collection. Keep `draft: true` while researching. A draft has no production route and is omitted from search, counts, feeds and sitemap output. Before publishing:

1. replace every placeholder;
2. normalize and add source records;
3. map aliases and attribution claims to sources;
4. add referenced entity records or remove unsupported relationships;
5. set confidence and `last_reviewed`;
6. add a structured update;
7. run `npm run verify`;
8. set `draft: false` only after editorial review.

References use stable entity IDs/slugs. The validator fails on missing or duplicate IDs and slugs, invalid controlled values and MITRE IDs, invalid dates, unresolved references, duplicate aliases, missing required fields, and public-to-draft references. It warns about thin sourcing, stale reviews and missing update histories.

## Search and filters

Pagefind creates a local static full-text index after the Astro build. The `/search/` page loads it only when needed and sends no query telemetry. Actor filtering is framework-free JavaScript; every active filter and sort option is reflected in the URL and restored after refresh.

## Entity relationships

Relationships are stored as IDs, resolved centrally and linked only when a public target profile exists. A missing optional profile is shown as pending/plain text rather than a broken link. Do not treat a vendor tracking cluster as an automatic actor equivalent.

## Deployment

The workflow `.github/workflows/pages.yml` validates, type-checks, builds, tests and deploys the static artifact through GitHub Pages. In the standalone APT Notes repository:

1. push this project to its own repository;
2. open **Settings → Pages**;
3. set **Source** to **GitHub Actions**;
4. keep `public/CNAME` as `apt.hecavex.com`;
5. run the workflow and confirm the Pages custom domain.

Cloudflare Pages is also compatible: build command `npm run build`, output directory `dist`, Node 22. Remove GitHub Pages-specific deployment configuration only if Cloudflare becomes the chosen host.

## DNS for `apt.hecavex.com`

DNS is intentionally not changed by this repository. For GitHub Pages, add a DNS record at the provider hosting `hecavex.com`:

```text
Type: CNAME
Name: apt
Target: hecavex.github.io
TTL: 300 initially
```

If the standalone repository is transferred to another owner, replace the target with that owner's Pages hostname. Remove conflicting `apt` A/AAAA/CNAME records, wait for DNS validation, configure `apt.hecavex.com` under Pages, then enable **Enforce HTTPS**. Do not change the apex-domain records used by the main site.

## Branding

Source SVG assets are in `public/brand/`, favicons in `public/favicons/`, and the 1200×630 PNG default social image in `public/og/` (with its editable SVG source beside it). Design tokens are centralized in `src/styles/global.css`. IBM Plex system fallbacks are used without render-blocking external font requests.

## Main Hecavex integration

APT Notes already links back to `https://hecavex.com/en/`. To add the reciprocal link to the Jekyll site, add an English navigation entry in the main Hecavex `_data/locales/en.yml`/tabs configuration used by its sidebar:

```yaml
- title: APT Notes
  url: https://apt.hecavex.com/
  icon: fas fa-database
```

Use the main site's existing navigation data shape if it differs after a Chirpy update. Mark it as external, open in the same tab by default, and do not add Lithuanian routing for APT Notes.

## Security and maintenance

No trackers, databases, user accounts, third-party search telemetry or executable malware are included. Keep dependencies minimal, review Dependabot alerts, refresh source access dates only after actually revisiting a source, run stale-profile warnings regularly, and preserve correction history. See `SECURITY.md` and `EDITORIAL_GUIDE.md`.
