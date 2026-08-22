# APT Notes by HECAVEX

[APT Notes](https://apt.hecavex.com) is the structured side of HECAVEX. It connects threat actors, aliases, campaigns, malware, tools, techniques and the public sources behind those relationships.

Project status: **maintained on a best-effort basis** by Deividas Lis / HECAVEX for threat-intelligence analysts, defenders, investigators, journalists and researchers. The public [About page](https://apt.hecavex.com/about/) exposes the latest meaningful update, coverage boundary, ownership and security contact. The cross-project [HECAVEX data catalogue](https://labs.hecavex.com/data/) documents the actor API beside related public datasets.

It is not an attribution oracle. Vendor names overlap, governments use different naming systems, and public reporting is often incomplete. The data model keeps those disagreements visible instead of flattening every name into one convenient actor.

## Run it locally

Node.js 22.13 or newer and npm 10 are required.

```sh
npm ci
npm run dev
```

The site is built with Astro and an original HECAVEX interface. It has no third-party theme or UI framework dependency. Its two-row masthead, compact type scale, 94 rem content frame, responsive menu and portfolio footer implement the same rendered shell as HECAVEX Research, Radar and Labs. The shared Cold Signal system uses self-hosted Inter and IBM Plex Mono files, and Pagefind creates the local search index so search queries are not sent to a hosted provider.

## Editing records

Content lives in `src/content/` and is split into actors, campaigns, malware, tools, techniques, sources and updates. Start from a file in `templates/`, then follow the evidence and attribution rules in the [editorial guide](docs/EDITORIAL.md).

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

That command validates the content model, generates social cards, checks Astro, builds the site and search index, audits metadata, accessibility and output-size budgets, and tests production links. The same command runs before GitHub Pages deployment. Performance limits are defined in `scripts/audit-performance.mjs`; they cover individual HTML, CSS, JavaScript, JSON, font and image files plus each document's directly referenced CSS/JavaScript shell. The check uses deterministic raw and gzip sizes rather than a network-dependent score, and a limit should only be raised after reviewing the affected asset.

Deployment also runs keyboard-navigation, focus, scroll-containment and overflow checks at 320, 360, 390, 768 and 1024 pixels. A successful run retains `test-results/responsive.json` as a 30-day workflow artifact. To reproduce the checks locally after `npm run build`:

```sh
python -m pip install -r requirements-checks.txt
python -m playwright install chromium
python scripts/test_responsive.py
```

## Publishing

The repository deploys through `.github/workflows/pages.yml`. GitHub Pages must use **GitHub Actions** as its source, and `public/CNAME` must remain `apt.hecavex.com`.

Public API reuse is governed by the human-readable [APT Notes data licence](https://apt.hecavex.com/licence/). It licenses original HECAVEX fields under CC BY 4.0 without relicensing cited publications, trademarks or third-party framework material. Original website software is MIT-licensed in [LICENSE](LICENSE); the deployed Pagefind runtime is accompanied by [third-party notices](public/THIRD_PARTY_NOTICES.txt).

Generated social cards are written to `public/og/generated/` during the build and are not committed.

## Privacy and security

APT Notes has no accounts, database or remote search service. Optional aggregate measurement is disabled unless `HECAVEX_ANALYTICS_TOKEN` is configured, and the loader respects Do Not Track.

Do not add malware samples, credentials, private intelligence or unpublished victim data to this repository. Website security issues should be reported through [HECAVEX security.txt](https://hecavex.com/.well-known/security.txt).

The main publication is at [hecavex.com](https://hecavex.com), and related research tools are at [labs.hecavex.com](https://labs.hecavex.com).
