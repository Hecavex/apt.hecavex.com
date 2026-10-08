# APT Notes by HECAVEX

Source for [apt.hecavex.com](https://apt.hecavex.com/), a structured, source-backed publication of threat-actor dossiers and their supporting campaigns, software, techniques and references. Astro builds a read-only public site with addressable records and machine-readable exports.

## Read and explore

- [Actors](https://apt.hecavex.com/actors/): sourced dossiers, aliases and scoped assessments.
- [Knowledge](https://apt.hecavex.com/knowledge/) and [Relationships](https://apt.hecavex.com/relationships/): supporting records and procedure-backed links.
- [Baltic relevance](https://apt.hecavex.com/baltic-relevance/): source-specific regional evidence, with compromise, targeting, claims and reporting connections kept distinct.
- [Changes](https://apt.hecavex.com/changes/) and [data catalogue](https://apt.hecavex.com/api/index.json): public versions and deterministic exports.
- [Methodology](https://apt.hecavex.com/methodology/) and [licence](https://apt.hecavex.com/licence/): scope, review and reuse.

## Find and change the source

Start with [the code map](docs/CODEMAP.md). Sourced records live in `src/content/`; field schemas and vocabularies in `src/content.config.ts` and `src/data/`; routes and exports in `src/pages/`; interface modules in `src/components/`, `src/layouts/`, `src/scripts/` and `src/styles/`.

| Task | Authoritative guide |
| --- | --- |
| Local setup, verification, release and source-link checks | [Maintenance](docs/MAINTENANCE.md) |
| Record lifecycle, versioning and editorial requirements | [Editorial contract](docs/EDITORIAL.md) |
| Feature ownership and focused regressions | [Code map](docs/CODEMAP.md) |
| Exact included Labs evidence | `src/data/labs-evidence-handoff.json` and `src/utils/labs-handoff.ts` |

Run `npm run verify` before a release. Draft records remain excluded from routes and exports. A visual change does not establish a new analytical review. Cite stable IDs and versions; a current URL is not an immutable snapshot. Source, archive and related-research links accept only absolute HTTP(S) reference URLs.

## Service and reuse boundaries

Maintained on a best-effort basis by Deividas Lis / HECAVEX. Coverage is selective and carries no attribution, monitoring or response SLA. There are no accounts, application database or hosted search provider. The frozen Labs handoff records actual inclusion and never implies live synchronization.

Original website software is [MIT](LICENSE); public data uses the [APT data licence](https://apt.hecavex.com/licence/). Cited works and third-party assets retain their terms, including the [font provenance](public/fonts/README.md). Report website vulnerabilities or accidental disclosure privately under [SECURITY.md](SECURITY.md). Keep credentials, malware samples, victim data and private intelligence out of this repository.

Related HECAVEX properties: [Research](https://hecavex.com/en/), [Labs](https://labs.hecavex.com/) and [Radar](https://radar.hecavex.com/).
