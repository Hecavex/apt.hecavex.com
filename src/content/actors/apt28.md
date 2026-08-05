---
id: apt28
name: APT28
slug: apt28
summary: A Russian military intelligence-linked intrusion set publicly associated with long-running espionage operations against government, defence, logistics, technology and related targets.
actor_types: [state-sponsored]
status: active
suspected_origins: [Russia]
motivations: [espionage, credential-access]
active_since: "2004"
last_observed: "2025"
confidence: high
last_reviewed: 2026-08-05
authors: [deividas-lis]
aliases:
  - name: Fancy Bear
    source: Industry
    relationship: common-alias
    confidence: high
    notes: Widely used public designation; scope may vary by publisher.
  - name: Forest Blizzard
    source: Microsoft
    relationship: vendor-tracking-cluster
    confidence: high
    notes: Microsoft tracking name; do not assume exact one-to-one equivalence in every report.
  - name: Unit 26165
    source: United States government
    relationship: government-designation
    confidence: high
    notes: Public reporting associates the activity with a unit of Russia's GRU.
attribution:
  - claim: A joint government advisory attributes the described logistics and technology campaign to GRU Unit 26165.
    attributed_entity: GRU Unit 26165
    source: cisa-aa25-141a
    source_type: government
    published_at: 2025-05-21
    confidence: high
    status: reported
    notes: This records the source's attribution claim rather than an independent Hecavex confirmation.
targeting:
  regions: [Europe, North America]
  countries: [Ukraine]
  sectors: [Government, Defence, Logistics, Technology]
  organisations: []
campaigns: []
malware: []
tools: []
techniques: [password-spraying]
vulnerabilities: []
external_identifiers:
  mitre_attack: G0007
  other: []
related_research: []
sources: [cisa-aa25-141a, mitre-g0007]
updates: [apt28-profile-created]
featured: true
draft: false
---

## Overview

APT28 is a long-running intrusion set associated in public government and industry reporting with Russia's military intelligence service. Public naming is not perfectly uniform: labels may describe overlapping, broader or narrower clusters depending on the publisher and collection window.

## Attribution

The joint advisory AA25-141A reports that GRU Unit 26165 conducted a campaign against Western logistics and technology organisations involved in coordinating and delivering assistance to Ukraine. APT Notes records that statement as a government attribution claim. It does not independently confirm the underlying classified evidence.

## Targeting

Public reporting describes targeting of government, defence, logistics and technology organisations, particularly where their work intersects with Ukraine and Western policy or support networks.

## Infrastructure patterns

The 2025 joint advisory describes the use of compromised infrastructure and internet-connected devices alongside credential attacks and exploitation of externally accessible services. These patterns should be treated as campaign context, not immutable actor signatures.

## Defensive considerations

Prioritise phishing-resistant authentication, review externally accessible identity and messaging services, monitor password-spraying patterns across accounts, and correlate authentication anomalies with infrastructure and mailbox activity. Do not block solely on an actor label; use behaviour, exposure and corroborated indicators.
