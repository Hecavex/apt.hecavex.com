---
id: actor-one
name: Actor One
slug: actor-one
summary: A compact invalid actor used to exercise Baltic relevance validation.
draft: false
created_at: 2026-08-01
modified_at: 2026-08-02
version: 1.1.0
change_reason: Reviewed the fixture record.
deprecated: false
revoked: false
actor_types: [state-sponsored]
status: active
suspected_origins: [Testland]
motivations: [espionage]
active_since: "2025"
last_observed: "2026"
confidence: high
last_reviewed: 2026-08-02
authors: [Fixture Author]
aliases: []
parent_entities: []
subclusters: []
attribution:
  - claim: A source attributes the fixture activity to Actor One.
    attributed_entity: Actor One
    source: source-one
    source_type: government
    published_at: 2026-07-01
    confidence: high
    status: reported
targeting:
  regions: [Europe]
  countries: []
  sectors: [Government]
  organisations: []
baltic_relevance:
  - id: invalid-baltic-record
    country: Poland
    evidence_type: inferred
    summary: This deliberately invalid fixture must be rejected by the validator.
    sectors: [Government]
    technologies: []
    campaigns: [operation-one]
    techniques: [technique-one]
    first_observed: "2025"
    last_observed: "2026"
    reviewed_at: 2026-08-02
    confidence: high
    sources: [actor-one]
    why_it_matters: This entry tests country, evidence class and source-type enforcement.
campaigns: [operation-one]
malware: []
tools: []
techniques: [technique-one]
vulnerabilities: []
technique_evidence:
  - technique: technique-one
    first_observed: "2025"
    last_observed: "2026"
    confidence: high
    sources: [source-one]
    notes: The source describes Actor One using the fixture technique.
operational_timeline:
  - date: "2026"
    title: Fixture activity reported
    summary: A bounded timeline event for nested-reference validation.
    confidence: high
    sources: [source-one]
external_identifiers:
  mitre_attack: G0001
  other: []
related_research: []
sources: [source-one]
updates: [actor-one-created, actor-one-reviewed]
featured: false
---

Invalid Baltic relevance fixture body.
