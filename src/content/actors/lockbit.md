---
id: lockbit
name: LockBit
slug: lockbit
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A ransomware-as-a-service ecosystem whose administrators supplied malware and infrastructure to affiliates responsible for thousands of intrusions, including extensive European targeting.
actor_types: [cybercriminal, ransomware, financially-motivated]
status: disrupted
suspected_origins: [Russia]
motivations: [financial, extortion, data-theft]
active_since: "2019-09"
last_observed: "post-2024 disruption reporting"
confidence: high
last_reviewed: 2026-08-27
authors: [deividas-lis]
mission: Scale data theft, extortion and ransomware deployment through a shared service that recruits affiliates, maintains leak and payment infrastructure and takes a share of proceeds.
current_assessment: LockBit was one of the most consequential ransomware services affecting Europe before Operation Cronos seized infrastructure and exposed administration in 2024. The operation materially degraded the ecosystem but did not prove permanent cessation. Central administrators, affiliates and individual intrusions are separate attribution layers and should not be described as one hands-on-keyboard crew.
aliases:
  - name: LockBitSupp
    source: UK National Crime Agency
    relationship: subgroup
    confidence: high
    scope: Public administrator persona attributed by law enforcement to Dmitry Khoroshev.
    first_seen: "2019"
    last_seen: "2024"
    notes: Administrator identity is not an alias for every affiliate.
  - name: Bitwise Spider
    source: Vendor reporting
    relationship: vendor-tracking-cluster
    confidence: moderate
    scope: Vendor label associated with the core LockBit operation.
    first_seen: "2019"
    last_seen: "2024"
    notes: Retained as a scoped mapping.
attribution:
  - claim: The NCA identifies Dmitry Khoroshev as the LockBit administrator and developer operating the LockBitSupp persona.
    attributed_entity: Dmitry Khoroshev
    source: nca-lockbit-disruption-2024
    source_type: legal
    published_at: 2024-02-20
    confidence: high
    status: reported
    notes: The actor record covers the service ecosystem; it does not assign every affiliate intrusion to the administrator personally.
targeting:
  regions: [Europe, North America, Global]
  countries: [United Kingdom, France, Germany, United States, Canada]
  sectors: [Government, Healthcare, Manufacturing, Financial Services, Transportation, Professional Services]
  organisations: []
campaigns: [lockbit-raas-operations]
malware: []
tools: []
techniques: [exploit-public-facing-application]
technique_evidence:
  - technique: exploit-public-facing-application
    campaign: lockbit-raas-operations
    first_observed: "2020"
    last_observed: "2024-02"
    confidence: high
    sources: [cisa-lockbit-advisory-2023, nca-lockbit-disruption-2024]
    notes: The joint advisory documents LockBit affiliates exploiting public-facing services among several initial-access paths used across the RaaS operation.
    editorial_note: This is a shared ecosystem procedure, not proof that the core administrator personally executed a specific intrusion.
operational_timeline:
  - date: "2019-09"
    title: Predecessor operation appears
    summary: Law-enforcement and joint advisory reporting places the service lineage in late 2019 before the LockBit name became established.
    confidence: high
    sources: [cisa-lockbit-advisory-2023]
  - date: "2024-02"
    title: Operation Cronos disrupts core infrastructure
    summary: International law enforcement seized systems, obtained platform data and exposed the affiliate and administration model.
    confidence: high
    sources: [nca-lockbit-disruption-2024]
external_identifiers:
  mitre_attack: ""
  other: [LockBit 2.0, LockBit 3.0, LockBit Black, LockBitSupp]
related_research: []
sources: [nca-lockbit-disruption-2024, cisa-lockbit-advisory-2023]
updates: [lockbit-profile-created]
featured: true
draft: false
---

## Analytic scope

LockBit is a service ecosystem. Administrators maintained ransomware, negotiation, leak and payment infrastructure; affiliates acquired access and performed intrusions. A victim displaying LockBit malware therefore supports a service relationship, not automatic attribution to one central intrusion team.

## European impact

Official reporting places the United Kingdom, France and Germany among the most affected countries. The victim set covered government, healthcare, manufacturing, transport and professional services. Counts from seized systems describe the scale of the service but do not guarantee that every listed organisation paid, lost data or experienced the same impact.

## Access and execution

Joint reporting documents exploitation of exposed applications, phishing, compromised credentials, remote services, credential theft, command execution and exfiltration across affiliates. The evidence graph publishes one campaign-scoped relationship rather than presenting the entire advisory technique list as universally observed in every incident.

## Disruption and limitations

Operation Cronos was material: it seized infrastructure, recovered data and identified administration. The correct status is disrupted, not eradicated. Later use of the LockBit name may involve surviving affiliates, rebuilt infrastructure or brand reuse, so post-operation claims require fresh evidence.

