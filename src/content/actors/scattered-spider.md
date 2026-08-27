---
id: scattered-spider
name: Scattered Spider
slug: scattered-spider
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A loose English-speaking cybercriminal collective known for help-desk social engineering, identity compromise, data theft and selected ransomware partnerships, including the 2024 Transport for London intrusion.
actor_types: [cybercriminal, financially-motivated, mixed]
status: disrupted
suspected_origins: [United States, United Kingdom, International]
motivations: [financial, credential-access, data-theft, extortion]
active_since: "2022"
last_observed: "2024 core-group activity; 2026 court reporting"
confidence: high
last_reviewed: 2026-08-27
authors: [deividas-lis]
mission: Defeat enterprise identity controls through social engineering and insider-like knowledge, then monetise access through data theft, extortion and ransomware partnerships.
current_assessment: Scattered Spider was a loose collective rather than a fixed company-style hierarchy. The NCA attributes the Transport for London intrusion to leading members and assesses that arrests effectively halted the original group's activity, while warning that others may reuse the brand. The Com, all SIM-swapping actors and every ALPHV affiliate are outside the record unless a source connects them directly.
aliases:
  - name: UNC3944
    source: Mandiant
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Vendor cluster substantially overlapping Scattered Spider activity.
    first_seen: "2022"
    last_seen: "2025"
    notes: Vendor visibility can include activity beyond the publicly prosecuted core members.
  - name: Octo Tempest
    source: Microsoft
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Microsoft cluster overlapping the collective's social-engineering and extortion activity.
    first_seen: "2022"
    last_seen: "2024"
    notes: Retained as a source-scoped mapping.
  - name: The Com
    source: Law enforcement and vendor reporting
    relationship: umbrella-group
    confidence: moderate
    scope: Wider online criminal ecosystem from which some members and techniques emerged.
    first_seen: "2010s"
    last_seen: "2026"
    notes: Not every participant in The Com belongs to Scattered Spider.
attribution:
  - claim: The NCA attributes the Transport for London intrusion to leading Scattered Spider members and records their convictions and sentences.
    attributed_entity: Scattered Spider members
    source: nca-scattered-spider-tfl-2026
    source_type: legal
    published_at: 2026-07-16
    confidence: high
    status: confirmed
    notes: The attribution is campaign-specific and does not identify every person who used the public group name.
targeting:
  regions: [United Kingdom, Europe, North America]
  countries: [United Kingdom, United States]
  sectors: [Transportation, Telecommunications, Technology, Retail, Hospitality, Financial Services]
  organisations: [Transport for London]
campaigns: [scattered-spider-tfl-2024]
malware: []
tools: []
techniques: [valid-accounts]
technique_evidence:
  - technique: valid-accounts
    campaign: scattered-spider-tfl-2024
    first_observed: "2024-08"
    last_observed: "2024-09"
    confidence: high
    sources: [nca-scattered-spider-tfl-2026, cisa-scattered-spider-2025]
    notes: Law-enforcement reporting and the joint advisory support an identity-focused intrusion model built around social engineering and compromised enterprise accounts.
    editorial_note: The 2025 UK retail incidents are excluded because the NCSC described Scattered Spider attribution as media speculation.
operational_timeline:
  - date: "2024-08"
    title: Transport for London intrusion
    summary: Members compromised TfL, disabled systems and caused substantial operational and financial harm during recovery.
    confidence: high
    sources: [nca-scattered-spider-tfl-2026]
  - date: "2026-07"
    title: Sentencing and disruption assessment
    summary: The NCA reported sentences and assessed that arrests had effectively halted the original group's criminal activity.
    confidence: high
    sources: [nca-scattered-spider-tfl-2026]
external_identifiers:
  mitre_attack: G1015
  other: [UNC3944, Octo Tempest, 0ktapus]
related_research: []
sources: [cisa-scattered-spider-2025, nca-scattered-spider-tfl-2026]
updates: [scattered-spider-profile-created]
featured: true
draft: false
---

## Analytic scope

Scattered Spider is a loose collective with changing participants and service relationships. Public names often overlap with The Com, identity-fraud communities and ransomware affiliates. The profile requires actor-specific evidence instead of importing the entire surrounding ecosystem.

## Identity-first intrusion model

The collective is notable for social engineering rather than one exclusive malware family. Operators impersonate employees, pressure help desks, manipulate multifactor authentication and use valid accounts to move through cloud and enterprise services. This makes administrative process and identity telemetry central defensive evidence.

## Transport for London

The TfL case provides a source-backed European campaign with legal findings and quantified operational effect. It demonstrates that identity-focused intrusion can disable critical business systems and produce long recovery costs without needing a novel exploit chain.

## Status and limitations

The original group is assessed as disrupted. That does not make the techniques obsolete or prevent unrelated actors from reusing the name. Separate 2025 UK retail incidents are deliberately not attributed here because the authoritative public statement described that attribution as speculation.

