# APT Notes by HECAVEX

[APT Notes](https://apt.hecavex.com) is the structured side of HECAVEX. It connects threat actors, aliases, campaigns, malware, tools, techniques and the public sources behind those relationships.

It is not an attribution oracle. Vendor names overlap, governments use different naming systems, and public reporting is often incomplete. The data model keeps those disagreements visible instead of flattening every name into one convenient actor.

## Run it locally

Node.js 22 or newer is required.

```sh
npm ci
npm run dev
```

The site is built with Astro. Pagefind creates the local search index, so search queries are not sent to a hosted search provider.

## Editing records

Content lives in `src/content/` and is split into actors, campaigns, malware, tools, techniques, sources and updates. Start from a file in `templates/`.

Keep a new record as `draft: true` while working. Before publishing it:

1. add the source records first
2. connect each important claim to a source
3. describe what an alias relationship actually means
4. check every referenced entity
5. set confidence and `last_reviewed`
6. record the change in the update history
7. run `npm run verify`

Drafts do not appear in routes, counts, search, feeds or sitemaps.

## Checks

```sh
npm run verify
```

That command validates the content model, generates social cards, checks Astro, builds the site and search index, audits metadata and accessibility, and tests production links. The same command runs before GitHub Pages deployment.

## Publishing

The repository deploys through `.github/workflows/pages.yml`. GitHub Pages must use **GitHub Actions** as its source, and `public/CNAME` must remain `apt.hecavex.com`.

Generated social cards are written to `public/og/generated/` during the build and are not committed.

## Privacy and security

APT Notes has no accounts, database or remote search service. Optional aggregate measurement is disabled unless `HECAVEX_ANALYTICS_TOKEN` is configured, and the loader respects Do Not Track.

Do not add malware samples, credentials, private intelligence or unpublished victim data to this repository. Website security issues should be reported through [HECAVEX security.txt](https://hecavex.com/.well-known/security.txt).

The main publication is at [hecavex.com](https://hecavex.com), and related research tools are at [labs.hecavex.com](https://labs.hecavex.com).
