# APT Notes code map

Start here when changing a feature. The site is Astro-generated, public and
read-only. Do not treat a visual change as permission to change analytical data.

## Presentation

- `src/layouts/BaseLayout.astro`: document metadata, shell, footer, DNT-aware
  analytics and ordered style imports.
- `src/components/AppHeader.astro`: shared portfolio/product navigation and
  no-JavaScript mobile disclosure.
- `src/styles/fonts.css`: self-hosted typefaces and language subsets.
- `src/styles/global.css`: semantic tokens, reset, common typography and focus.
- `src/styles/shell.css` / `footer.css`: portfolio navigation and footer.
- `src/styles/page-layout.css`: shared page frames and introductory layouts.
- `src/styles/catalogue-base.css`: base metrics, lists, search and filters.
- `src/styles/profiles.css`: dossiers, contents rail, methodology and evidence
  reading components.
- `src/styles/knowledge.css`: in-context supporting records, relationship
  evidence and revision views.
- `src/styles/responsive.css`: ordered shared breakpoints, reduced motion and
  print. Keep this after the base modules in the explicit layout import order.
- `src/styles/catalogue.css`: research-first overview, dossier previews,
  discovery controls and catalogue table readability.
- `src/styles/reading.css`: readable dossier contents rail and progress labels.
- `src/pages/index.astro`: overview composition using actual public records.
- `src/pages/actors/index.astro`: server-rendered actor catalogue and filter fields.
- `src/scripts/actor-catalogue.ts`: client filter matching, sorting, URL restore,
  and URL updates have named helpers. `initialiseActorCatalogue` owns event
  wiring and reset; its `applyFilters` callback updates results and the empty state.
- `src/pages/actors/[slug].astro`: complete actor dossier and bounded Labs handoff.
- `src/components/ProfileToc.astro`: desktop/mobile section tracking and anchors.
- `src/components/knowledge/KnowledgeExplorer.astro`: catalogue views, filtering
  and CSV export; `KnowledgeDialog.astro`: in-context records and history;
  `KnowledgeRecord.astro`: the canonical record presentation.
- `src/pages/relationships/index.astro`: procedure-backed evidence, not every
  catalogue association. `src/pages/changes/index.astro`: release chronology.
- `src/pages/lt/`: explicitly bounded Lithuanian orientation, not invented full
  translations of the canonical English dossiers.

## Evidence and publication boundaries

- `src/content/`: sourced records. Versioning and publication/review dates have
  analytical meaning; a styling release must not change them.
- `src/utils/content.ts`: public-entry, labelling and date helpers.
- `src/utils/knowledge.ts`: linked public knowledge and exports.
- `src/utils/labs-handoff.ts` and `src/data/labs-evidence-handoff.json`: frozen
  evidence handoff. Never imply that the complete dossier is live-synchronised.
- `src/pages/api/` and `src/pages/data/`: machine-readable contracts.
- `scripts/apply-csp.mjs`: generated output CSP; preserve no remote-font runtime.

## Verification

- `npm run lint`: whitespace and visual-contract tokens.
- `npm run test:content`: invalid references, unsupported claims, date semantics,
  provenance and frozen evidence handoff regression fixtures.
- `npm run build`: validation, share previews, Astro types/SSG, Pagefind and CSP.
- `npm run audit`: built routes/data and unchanged transfer-size budgets.
- `scripts/smoke-release.mjs dist apt`: responsive shell/discovery, source
  dialogs, history, citation clipboard fallback, search pagination and no-JS.
- `scripts/typography-contract.mjs`: rendered typography roles shared with
  Research, checked by the served-release smoke across routes and viewports.
- `.github/workflows/pages.yml`: gates, Pages deployment and exact live artifact
  verification. `scripts/release.mjs` binds the publication to the source SHA.

The modules describe responsibilities, not arbitrary line-count chunks. Keep
data, render helpers and client interaction separated when extending a feature.
