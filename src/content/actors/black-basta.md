---
id: black-basta
name: Black Basta
slug: black-basta
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A ransomware-as-a-service operation active since 2022 that affected more than 500 organisations across North America, Europe and Australia by May 2024.
actor_types: [cybercriminal, ransomware, financially-motivated]
status: uncertain
suspected_origins: [Eastern Europe]
motivations: [financial, extortion, data-theft]
active_since: "2022-04"
last_observed: "2025-03 public reporting"
confidence: high
last_reviewed: 2026-08-27
authors: [deividas-lis]
mission: Monetise enterprise access through data theft and ransomware deployment using affiliates, shared tooling and increasingly identity-focused social engineering.
current_assessment: Black Basta had extensive European reach and a mature affiliate playbook by 2024. CERT-EU documented continued public activity into March 2025. The precise 2026 structure and continuity are unresolved, so the actor is marked uncertain rather than automatically active. Service administrators, affiliates and initial-access partners remain distinct.
aliases:
  - name: BlackBasta
    source: Joint advisory AA24-131A
    relationship: common-alias
    confidence: high
    scope: Spacing variant for the same ransomware service.
    first_seen: "2022"
    last_seen: "2025"
    notes: Search aid only.
attribution:
  - claim: A joint advisory attributes a large international ransomware campaign to Black Basta affiliates and documents more than 500 affected organisations by May 2024.
    attributed_entity: Black Basta ransomware-as-a-service operation
    source: cisa-black-basta-2024
    source_type: government
    published_at: 2024-05-10
    confidence: high
    status: confirmed
    notes: Victim count and procedures describe the service ecosystem, not a single operator.
targeting:
  regions: [Europe, North America, Australia]
  countries: [European Union member states, United Kingdom, United States, Australia]
  sectors: [Healthcare, Manufacturing, Construction, Professional Services, Technology]
  organisations: []
campaigns: [black-basta-raas-operations]
malware: []
tools: []
techniques: [remote-access-software]
technique_evidence:
  - technique: remote-access-software
    campaign: black-basta-raas-operations
    first_observed: "2022-04"
    last_observed: "2025-03"
    confidence: high
    sources: [cisa-black-basta-2024, cert-eu-black-basta-2025]
    notes: Joint and European reporting document remote-management and social-engineering paths used to establish or maintain access before exfiltration and ransomware deployment.
    editorial_note: This is an ecosystem procedure; a specific remote tool alone is not sufficient to attribute an intrusion to Black Basta.
operational_timeline:
  - date: "2022-04"
    title: Black Basta operation appears
    summary: The ransomware service begins a rapid international victim campaign.
    confidence: high
    sources: [cisa-black-basta-2024]
  - date: "2024-05"
    title: More than 500 organisations affected
    summary: International partners documented victims across North America, Europe and Australia and published a shared defensive advisory.
    confidence: high
    sources: [cisa-black-basta-2024]
  - date: "2025-03"
    title: European reporting records continued activity
    summary: CERT-EU documented continuing campaigns and social-engineering changes while current operator continuity remained less certain.
    confidence: moderate
    sources: [cert-eu-black-basta-2025]
external_identifiers:
  mitre_attack: ""
  other: [BlackBasta]
related_research: []
sources: [cisa-black-basta-2024, cert-eu-black-basta-2025]
updates: [black-basta-profile-created]
featured: false
draft: false
---

## Analytic scope

Black Basta is a ransomware service and affiliate ecosystem. Shared infrastructure, malware and negotiation branding define the public operation, while individual intrusions may involve different access providers and operators. The record does not turn every tool in the advisory into a unique actor signature.

## European reach

The joint advisory documented more than 500 affected organisations across North America, Europe and Australia. Healthcare, manufacturing, construction and professional services were prominent. That scale establishes regional relevance without relying on an actor-controlled leak-site victim list.

## Evolving access

The operation combined exploitation and credential access with remote administration and later social-engineering campaigns. Remote tools are widely legitimate, so presence alone has low attribution value. Account history, installer provenance, concurrent tooling and later ransomware activity provide the necessary context.

## Current-status limitation

Public evidence supports activity into March 2025 but does not cleanly establish the 2026 service structure. The catalogue uses uncertain status to avoid translating an old leak-site name or affiliate claim into current operational certainty.

