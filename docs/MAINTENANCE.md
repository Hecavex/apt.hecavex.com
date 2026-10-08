# APT maintenance

Maintainer guide for this operated HECAVEX publication. [The repository README](../README.md) is the product entrypoint. Detailed field or legal rules stay in their existing owning documents.

## Local preparation and checks

Use the Node and npm requirements in `package.json` with the committed `package-lock.json`. Run `npm ci`, `npm run dev` for a local preview, and `npm run verify` for the complete source/build audit gate. Browser interaction is separately checked by `node scripts/smoke-release.mjs dist apt` after building; the Pages workflow installs its bounded Playwright dependency. Start from [CODEMAP.md](CODEMAP.md).

## Publication model

APT Notes preserves source-specific claims instead of treating every vendor name as an exact equivalent. Each published relationship should let a reader distinguish:

- what a cited source reported;
- what HECAVEX assessed;
- how actor and cluster boundaries overlap;
- the confidence and review date attached to the record;
- corrections or substantive changes made later.

Records are kept in `src/content/` by entity type. The schemas in `src/content.config.ts` and controlled vocabularies in `src/data/` define the accepted fields and lifecycle metadata. Draft records may be prepared in those collections, but they are excluded from public routes, search, feeds, sitemaps and exports.

Actor dossiers remain the primary editorial product. Supporting records are browsed through the Knowledge explorer and open in one progressively enhanced detail panel; their canonical fallback pages remain available for direct links, reloads, search indexing and no-JavaScript access. The Relationships view publishes only actor-to-technique links that already carry explicit procedure evidence and supporting references.

Actor and supporting records include a copyable citation with the stable record ID, record version, dataset release and canonical address. The citation remains readable without JavaScript and in contextual record panels. Publication versions are not analyst-review dates, and a current URL is not an immutable snapshot. Readers should retain the public JSON with their actual access date and cite underlying publishers separately for source claims.

The [Baltic relevance view](https://apt.hecavex.com/baltic-relevance/) is a derived regional reading layer over reviewed actor dossiers. Its structured records distinguish reported compromise, reported targeting, actor claims and reporting connections; inclusion never converts a country-level statement into an inferred victim incident. Complete one-row-per-evidence machine exports are available as [JSON](https://apt.hecavex.com/api/baltic-relevance.json) and [CSV](https://apt.hecavex.com/data/baltic-relevance.csv); the actor CSV remains an actor-level discovery table.

The editorial and release requirements are recorded in [docs/EDITORIAL.md](EDITORIAL.md).

## Frozen Labs handoff and ownership

The dossier-to-Labs handoff is gated by `src/data/labs-evidence-handoff.json`: an inclusion-only index of actual actor and evidence IDs in a recorded immutable Labs revision, with its source JSON SHA-256. It does not duplicate procedure content, imply live synchronization or declare a new review. `npm run test:content` checks that every recorded ID still references a public APT actor and explicit procedure. Updating this snapshot requires checking the actual Labs source, not inferring inclusion from a new APT dossier. Labs exports remain separately pinned and preserve their existing evidence release.

| Path | Production responsibility |
| --- | --- |
| `src/content/` | Reviewed public records and unpublished working drafts |
| `src/pages/` | Canonical routes, Knowledge and Changes surfaces, JSON/CSV exports and feeds |
| `src/components/`, `src/layouts/`, `src/styles/` | HECAVEX operational interface and publication layouts |
| `public/` | Custom-domain, security, font, brand and legal assets |
| `scripts/` | Content, build, metadata and performance validation |
| `.github/workflows/pages.yml` | Production build and GitHub Pages deployment |

Generated build output, social cards, browser evidence, dependency directories and local environment files are intentionally not versioned.

## Deployment and maintenance

The production workflow builds and deploys the `main` branch to GitHub Pages. `public/CNAME` must remain `apt.hecavex.com`, and Pages must continue to use GitHub Actions as its source.

Every deployment validates content references, lifecycle states and sourced relationship endpoints, generates social previews, type-checks and builds the Astro site, creates the Pagefind search index, and audits production metadata, fallback fragments, JSON/CSV/XML data products and asset budgets. The operator release gate is `npm run verify`.

The public data catalogue starts at [`/api/index.json`](https://apt.hecavex.com/api/index.json). Read current dataset counts and versions from the generated catalogue and release manifest; this guide does not cache them. It includes deterministic per-type and per-record JSON, canonical CSV exports, a Changes Atom feed and an explicit release/version manifest. Rebuilding the same release does not manufacture a new publication timestamp.

The site has no accounts, application database or hosted search provider. Production enables Cloudflare Web Analytics once through the shared layout for aggregate audience and page-performance measurement unless Do Not Track is set to `1`. The public site token is supplied at build time through `PUBLIC_HECAVEX_ANALYTICS_TOKEN`; it is deployment metadata rather than a secret. The beacon uses no cookies or browser storage, and the deployed methodology links to the portfolio privacy policy and describes the measurement boundary.

## Reference URL safety

Source, archived, final and related-research URLs must use absolute HTTP(S) addresses. `src/content.config.ts` enforces this in Astro; `scripts/validate-content.mjs` enforces it before generation. `scripts/test-content-validation.mjs` verifies valid HTTP/HTTPS and rejected JavaScript/data references. This scheme guard prevents executable citation targets; it does not certify a remote page as safe or source claims as accurate.
