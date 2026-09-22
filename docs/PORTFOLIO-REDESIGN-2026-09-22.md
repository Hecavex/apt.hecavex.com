# Research-first portfolio redesign

Owner direction: retain HECAVEX's logo and teal identity, substantially improve
layout and typography, prioritise research, and replace generic AI imagery with
evidence-led or typographic previews. APT Notes uses real dossier content, not
illustrated threat-actor claims.

## Visual contract

- Keep the 94rem shell, 64px network row, 52px product row and 1160px navigation
  breakpoint. Existing routes, navigation labels and ordering are unchanged.
- Preserve graphite `#111416`, raised graphite `#171b1d`, warm text `#ece9e1`,
  teal `#55b9b1`, muted text `#8d969a` and existing semantic status colours.
- Self-host Space Grotesk for headings (Latin and Latin Extended, OFL licence).
  Inter remains the reading face at 16px / 1.65. Monospace is for identifiers.
- Ordinary titles remain at most 52px; title line-height becomes 1.08.
- Open hero: 320px desktop minimum, no fixed maximum and no enclosing frame.
  Page top is `clamp(2rem, 3vw, 3rem)`; major sections use
  `clamp(3rem, 5vw, 4.5rem)`.
- Sentence-case controls and metadata, 44px control targets, visible keyboard
  focus, natural mobile stacking and local table scrolling.

## Composition and function

The overview offers actor search directly, then catalogue coverage, actual
reviewed dossiers, routes into supporting evidence, and substantive revisions.
Dossier previews display the published status and confidence without inventing
new review claims. Actor discovery includes summaries; the existing filter
state, reset and deep links are preserved. Knowledge record dialogs, references,
exports, dossier reading rails, provenance and all cautionary text remain.

The UI/UX skill's data-dense catalogue guidance informed clear labels, filtering
and responsive reading. Its unrelated cyberpunk/sales defaults were rejected in
favour of the approved portfolio identity. No framework, runtime dependency,
collector, content record, analytical claim or data release was changed.

## Regression evidence

`npm run lint` asserts the revised visual tokens. `npm run test:content` retains
all evidence, provenance and handoff assertions. `npm run build` and `npm run
audit` retain production, data and transfer budgets. `scripts/smoke-release.mjs`
adds six-page layout checks at 320, 768, 1161 and 1440px, the native overview
search journey and actor empty/reset states. Existing search pagination,
citation copying, dialog history, no-JavaScript content and CSP checks remain.

Passing automated checks does not claim a human screen-reader audit.
