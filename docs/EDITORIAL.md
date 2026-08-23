# APT Notes editorial and release policy

This document governs records published at [apt.hecavex.com](https://apt.hecavex.com). It is an owner/operator control for the HECAVEX publication, not contributor onboarding for a reusable software product.

## Evidence boundary

APT Notes is useful only when a reader can trace a statement to public evidence and understand the limits of the relationship being described.

Every published record must:

1. preserve the publisher, publication date, access date and canonical source;
2. separate source reporting from HECAVEX assessment;
3. describe the relationship type and evidence behind each alias;
4. avoid collapsing broader, narrower or partially overlapping clusters into exact equivalents;
5. keep attribution language no stronger than the cited evidence;
6. state uncertainty, disagreement and plausible alternatives where they exist;
7. retain review dates and substantive corrections;
8. exclude private data, credentials, malware samples and unnecessary personal information.

Wording such as “public reporting associates”, “the available evidence suggests” and “insufficient public information is available to determine” is appropriate when it describes the evidence accurately. It must not be used to decorate an unsupported conclusion.

## Content lifecycle

Sources are recorded before the analytical entity that depends on them. New or incomplete records remain `draft: true`; the production site excludes them from routes, search, feeds, sitemaps and machine-readable exports.

Before a record becomes public, the operator confirms that identifiers are stable, references resolve, dates and confidence are current, important claims have explicit evidence, aliases preserve source-specific scope, and a substantive change has an update entry where required.

Published actor profiles are reviewed at least annually. A review may confirm that the existing assessment remains valid; it does not need to manufacture a content change. Material corrections identify what changed instead of silently rewriting analytical history.

Actors, campaigns, malware and tools carry `last_reviewed`. The release validator reports a warning when a public record is more than 366 days old; the monthly maintainer review turns that warning into either a sourced review, an explicit archived/historical decision, or a draft withdrawal. Technique records use [the maintained technique template](templates/technique.md) and inherit freshness from their cited source records; a technique relationship is re-reviewed whenever the represented source or linked entity changes materially.

## Release control

The operator runs the repository verification gate and reads each changed rendered page before merging to `main`. Automated checks validate schemas, references, routes, metadata, accessibility and production output. They cannot decide whether a technically valid sentence is fair, sufficiently sourced or analytically precise.

A failed release gate blocks deployment. Changes to validation or performance thresholds require a documented production reason and must not be used merely to make a failing build pass.

## Publication safety

APT Notes publishes defensive, public-interest research. It does not store executable malware, credentials, private intelligence or unnecessary victim details. Suspected sensitive-data exposure is handled through the current [HECAVEX security contact](https://hecavex.com/.well-known/security.txt).
