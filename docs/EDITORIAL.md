# APT Notes editorial and release policy

This policy governs records published at [apt.hecavex.com](https://apt.hecavex.com). It is an operator control for the HECAVEX publication, not contributor onboarding for a reusable software product.

APT Notes is a curated English-language catalogue. It is not an exhaustive actor directory, a live intelligence feed or a substitute for the cited source. A small, reviewable record set is preferable to an unsupported one.

## Evidence boundary

APT Notes is useful only when a reader can trace a claim to public evidence and understand the limits of the relationship being described.

Every published record must:

1. preserve the publisher, publication date, access date and canonical source URL;
2. separate source reporting from HECAVEX assessment;
3. describe the relationship type and evidence behind each alias;
4. avoid collapsing broader, narrower or partially overlapping clusters into exact equivalents;
5. keep attribution language no stronger than the cited evidence;
6. state uncertainty, disagreement and plausible alternatives where they exist;
7. retain review dates and substantive corrections;
8. exclude private data, credentials, malware samples and unnecessary personal information.

Wording such as "public reporting associates", "the available evidence suggests" and "insufficient public information is available to determine" is appropriate when it describes the evidence accurately. It must not decorate an unsupported conclusion.

## Records, mappings and relationships

Each entity has a stable ID and slug. A record also carries creation and modification times, a semantic version, a change reason, lifecycle state and an optional successor. Actor, campaign, malware and tool records keep the analyst review date separate from those publication fields. A source publication date is never substituted for an APT Notes creation or review date.

The lifecycle states have distinct meanings:

- `deprecated` keeps a record available but advises readers to use a newer or more precise record;
- `revoked` withdraws the analytical assertion while preserving its public history;
- `superseded_by` points to a current record of the same type and is valid only on a deprecated or revoked record;
- `draft` is an authoring state and is never part of the public site, exports, feeds or sitemap.

Arrays such as an actor's campaigns or a campaign's techniques are catalogue mappings. They support navigation but do not, by themselves, claim independently sourced procedure evidence.

The public Relationships dataset is narrower. It is generated only from explicit `technique_evidence` entries in public actor dossiers. Every relationship requires a current actor and technique, an optional current campaign, non-empty evidence text, at least one current public reference, confidence and first/last-observed language. The record also carries a change reason and an editorial note that states its derivation boundary. Its stable ID follows this deterministic form:

`rel-{actor-slug}-uses-{technique-slug}[-during-{campaign-slug}]`

The build rejects duplicate relationship IDs, missing endpoints, draft endpoints and a relationship count that diverges from the reviewed evidence baseline. Broader catalogue associations are not silently promoted to evidence relationships.

## Source durability

The publisher's original URL remains primary while it works. Reference records may also carry an archive URL, final redirected URL, HTTP status, last link-check time and one of four bounded states: `unknown`, `ok`, `redirected` or `unavailable`.

An unavailable source is not deleted if it remains material to a published assessment. The record is marked, an archive is added where one can be verified, and any resulting analytical change is handled through the normal correction process. Validation warns when a public reference has unknown link health or no archive; these warnings are a maintenance queue, not evidence that a source is unreliable.

The monthly source-health workflow checks only the public URLs already present in the catalogue and uploads a read-only JSON report as a GitHub Actions artifact. It does not rewrite frontmatter or publish a status automatically. The operator reviews redirects, failures and archive candidates before updating a record, preventing a temporary network or publisher error from becoming an unsupported editorial claim.

## Content lifecycle

Sources are recorded before the analytical entity that depends on them. New or incomplete records remain `draft: true`.

Before a record becomes public, the operator confirms that:

- identifiers are stable and all typed references resolve;
- important claims have explicit evidence and source-specific scope;
- dates, lifecycle fields, confidence and review state are internally consistent;
- public relationship endpoints and supporting references are also public;
- aliases do not erase publisher-specific cluster boundaries;
- the corresponding substantive change event exists where required.

Published actor profiles are reviewed at least annually. A review may confirm that the existing assessment remains valid; it does not need to manufacture a content change. Material corrections identify what changed instead of silently rewriting analytical history.

Technique records inherit freshness from their cited references. A procedure relationship is reviewed again whenever its actor, campaign, technique or supporting reference changes materially.

## Changes, corrections and versioning

Changes is the public chronological record of creation, substantive edits, attribution changes, corrections, lifecycle changes and relationship changes. A change event identifies its entity and type, date, supporting references, affected fields or relationships, release ID and version transition where applicable.

Version numbers use `major.minor.patch`:

- major changes may alter the public data contract;
- minor changes add compatible fields or substantive content;
- patch changes make compatible corrections or editorial refinements.

Deprecation, revocation and supersession require an explicit reason. Corrections link to the earlier event when that relationship exists. Public records are not removed merely to make the current catalogue look cleaner.

## Machine-readable publication

The human interface and static data release are built from the same public content snapshot. The release includes:

- a catalogue index and release manifest under `/api/`;
- compact aggregate indexes and full per-record JSON for every entity type, relationships and Changes;
- separate malware, tool and combined software datasets;
- CSV exports under `/data/`;
- a dedicated Changes Atom feed at `/changes/feed.xml` and a compatibility feed at `/feed.xml`.

Every JSON document carries the schema version, dataset version, release ID, release time, publisher, licence, methodology and publication notice. The manifest records expected counts and canonical assets. The build audit compares source records, aggregate data, per-record data, CSV rows and Atom entries, checks relationship and entity references, and rejects any emitted draft.

These files are versioned static publication surfaces. They are not live query APIs, monitoring endpoints or indicators of current hostile activity.

## Release control

The operator runs the repository verification gate and reads each changed rendered page before merging to `main`. Automated checks validate schemas, typed references, routes, metadata, accessibility, production output and data-release integrity. They cannot decide whether a technically valid sentence is fair, sufficiently sourced or analytically precise.

A failed release gate blocks deployment. Changes to validation or performance thresholds require a documented production reason and must not be used merely to make a failing build pass.

## Publication safety

APT Notes publishes defensive, public-interest research. It does not store executable malware, credentials, private intelligence or unnecessary victim details. Suspected sensitive-data exposure is handled through the current [HECAVEX security contact](https://hecavex.com/.well-known/security.txt).
