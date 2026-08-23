# APT Notes by HECAVEX

This repository is the production source for [apt.hecavex.com](https://apt.hecavex.com), the HECAVEX catalogue of source-backed threat actors, campaigns, malware, tools, techniques and attribution claims.

APT Notes is an operated HECAVEX publication, not a general-purpose threat-intelligence platform, starter project or self-hosting package. The public website is the authoritative rendered edition. Its [About](https://apt.hecavex.com/about/), [methodology](https://apt.hecavex.com/about/methodology/) and [data licence](https://apt.hecavex.com/licence/) pages define its scope, limitations, review policy and reuse boundary.

Status: **maintained on a best-effort basis** by Deividas Lis / HECAVEX. APT Notes provides neither comprehensive actor coverage nor a monitoring, attribution or response SLA.

## Publication model

APT Notes preserves source-specific claims instead of treating every vendor name as an exact equivalent. Each published relationship should let a reader distinguish:

- what a cited source reported;
- what HECAVEX assessed;
- how actor and cluster boundaries overlap;
- the confidence and review date attached to the record;
- corrections or substantive changes made later.

Records are kept in `src/content/` by entity type. The schemas in `src/content.config.ts` and the controlled vocabularies in `src/data/` define the accepted fields. Draft records may be prepared in those collections, but they are excluded from public routes, search, feeds, sitemaps and JSON exports.

The editorial and release requirements are recorded in [docs/EDITORIAL.md](docs/EDITORIAL.md).

## Repository map

| Path | Production responsibility |
| --- | --- |
| `src/content/` | Reviewed public records and unpublished working drafts |
| `src/pages/` | Canonical website routes, static JSON exports and feeds |
| `src/components/`, `src/layouts/`, `src/styles/` | HECAVEX Cold Signal interface and publication layouts |
| `public/` | Custom-domain, security, font, brand and legal assets |
| `scripts/`, `tests/` | Content, build, accessibility, performance and release gates |
| `.github/workflows/pages.yml` | Production build and GitHub Pages deployment |

Generated build output, social cards, browser evidence, dependency directories and local environment files are intentionally not versioned.

## Deployment and maintenance

The production workflow builds and deploys the `main` branch to GitHub Pages. `public/CNAME` must remain `apt.hecavex.com`, and Pages must continue to use GitHub Actions as its source.

Every deployment validates content references and controlled values, generates social previews, type-checks and builds the Astro site, creates the Pagefind search index, audits metadata and asset budgets, tests production links, and checks keyboard access, focus behaviour and responsive layout. The operator release gate is `npm run verify`; browser checks run separately in the workflow and retain their JSON evidence for 30 days.

The site has no accounts, application database or hosted search provider. Optional aggregate measurement remains disabled unless the repository variable `HECAVEX_ANALYTICS_TOKEN` is configured, and the deployed loader respects Do Not Track.

## Rights and security

Public JSON reuse is governed by the [APT Notes data licence](https://apt.hecavex.com/licence/). The repository's MIT licence applies to original website software only; it does not relicense HECAVEX research, cited publications, trademarks, logos or other brand material. Deployed third-party software is documented in `public/THIRD_PARTY_NOTICES.txt`.

This repository must not contain malware samples, credentials, private intelligence, unpublished victim data or deployment secrets. Website vulnerabilities and accidental sensitive-data publication should be reported through the current [HECAVEX security contact](https://hecavex.com/.well-known/security.txt), not a public issue.

HECAVEX Research is published at [hecavex.com](https://hecavex.com), with related public work at [labs.hecavex.com](https://labs.hecavex.com) and [radar.hecavex.com](https://radar.hecavex.com).
