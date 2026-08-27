---
id: secret-blizzard
name: Secret Blizzard
slug: secret-blizzard
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A Russian state-sponsored espionage cluster overlapping Turla and associated with FSB Centre 16, active against Ukraine and European diplomatic and government targets.
actor_types: [state-sponsored]
status: active
suspected_origins: [Russia]
motivations: [espionage, credential-access, surveillance]
active_since: "1996 or earlier public lineage"
last_observed: "2026 public reporting"
confidence: high
last_reviewed: 2026-08-27
authors: [deividas-lis]
mission: Acquire long-term strategic intelligence from government, diplomatic, defence and military targets by combining bespoke espionage tooling with compromised infrastructure and access obtained through other actors.
current_assessment: Secret Blizzard is a mature Russian espionage cluster with a long public lineage and a demonstrated willingness to reuse another actor's access. Microsoft documented a 2024 operation against Ukrainian military devices, while multinational reporting associates the Snake platform with FSB Centre 16. Turla is retained as an overlapping public umbrella rather than an assumption that every Turla-labelled incident shares one operator and toolchain.
aliases:
  - name: Turla
    source: Multiple government and vendor sources
    relationship: umbrella-group
    confidence: high
    scope: Widely used public actor family overlapping Secret Blizzard activity.
    first_seen: "1996"
    last_seen: "2026"
    notes: Broader than any single Microsoft cluster definition.
  - name: Waterbug
    source: Vendor reporting
    relationship: vendor-tracking-cluster
    confidence: moderate
    scope: Vendor label overlapping portions of the Turla ecosystem.
    first_seen: "2000s"
    last_seen: "2024"
    notes: Retained as an overlap, not an exact global synonym.
  - name: Venomous Bear
    source: Vendor reporting
    relationship: vendor-tracking-cluster
    confidence: moderate
    scope: Public vendor name commonly associated with Turla.
    first_seen: "2000s"
    last_seen: "2024"
    notes: Scope varies by publisher.
parent_entities:
  - name: FSB Centre 16
    entity_type: Russian signals intelligence unit
    relationship: official attribution
    confidence: high
    source: cisa-snake-advisory-2023
    notes: The joint advisory attributes the Snake platform to FSB Centre 16. Snake is not treated as an actor alias.
attribution:
  - claim: A multinational advisory attributes development and operation of the Snake cyberespionage platform to Russia's FSB Centre 16.
    attributed_entity: FSB Centre 16
    source: cisa-snake-advisory-2023
    source_type: government
    published_at: 2023-05-09
    confidence: high
    status: confirmed
    notes: The platform attribution supports the wider state relationship while campaign membership remains individually sourced.
targeting:
  regions: [Ukraine, Europe]
  countries: [Ukraine, European Union member states]
  sectors: [Government, Diplomatic, Defence, Military, Research]
  organisations: []
campaigns: [secret-blizzard-amadey-access-2024]
malware: []
tools: []
techniques: [powershell]
technique_evidence:
  - technique: powershell
    campaign: secret-blizzard-amadey-access-2024
    first_observed: "2024-03"
    last_observed: "2024-04"
    confidence: high
    sources: [microsoft-secret-blizzard-freeloader-2024]
    notes: Microsoft documented PowerShell-based command and payload activity after Secret Blizzard selected systems from existing Amadey infections associated with another actor.
    editorial_note: This evidence describes the observed post-access procedure. It does not attribute the upstream Amadey operation or every infected device to Secret Blizzard.
operational_timeline:
  - date: "2023-05"
    title: Snake platform exposed and disrupted
    summary: International partners published technical detail and attributed the long-running Snake platform to FSB Centre 16.
    confidence: high
    sources: [cisa-snake-advisory-2023]
  - date: "2024-03"
    title: Access through another actor's infections
    summary: Microsoft observed Secret Blizzard selecting Ukrainian military systems from an upstream Amadey infection set.
    confidence: high
    sources: [microsoft-secret-blizzard-freeloader-2024]
external_identifiers:
  mitre_attack: G0010
  other: [Turla, Waterbug, Venomous Bear, Uroburos]
related_research: []
sources: [microsoft-secret-blizzard-freeloader-2024, cisa-snake-advisory-2023]
updates: [secret-blizzard-profile-created]
featured: true
draft: false
---

## Analytic scope

Secret Blizzard is the canonical record for Microsoft's cluster and the strongly overlapping public Turla activity set. The broader Turla name spans decades of reporting, multiple platforms and changing collection windows. The dossier therefore uses aliases for discovery while requiring campaign-specific evidence before publishing procedures.

## Access through other actors

The 2024 Amadey operation demonstrates a mature access strategy. Secret Blizzard did not need to deliver the first infection to every device. It could inspect an existing criminal infection set, select systems relevant to its intelligence requirements and install its own tools. This creates attribution risk because upstream malware telemetry and downstream espionage activity describe different actors.

## European relevance

Ukraine remains a major operational focus, alongside a longer record of European diplomatic and government targeting. The actor's relevance is strategic rather than volume-based: selected access can support long-term collection from ministries, military organisations and diplomatic networks.

## Platform and identity boundaries

Snake is an FSB Centre 16 espionage platform, not another name for the entire actor. Turla is a durable public umbrella, not proof that every vendor cluster is identical. The catalogue records this asymmetry so a source can support the state relationship without automatically supporting every campaign attribution.
