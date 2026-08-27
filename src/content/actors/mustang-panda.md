---
id: mustang-panda
name: Mustang Panda
slug: mustang-panda
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A China-aligned espionage actor conducting sustained spearphishing and removable-media operations against diplomatic, government and maritime targets, including organisations in Europe.
actor_types: [state-aligned]
status: active
suspected_origins: [China]
motivations: [espionage, credential-access, data-theft]
active_since: "2012"
last_observed: "2025 Q1 public reporting"
confidence: high
last_reviewed: 2026-08-27
authors: [deividas-lis]
mission: Collect political, diplomatic and strategic information from government, diplomatic, research and transport organisations through reusable social-engineering and loader chains.
current_assessment: Mustang Panda continues to target Europe alongside a wider global victim set. European diplomatic and maritime operations are well supported by first-party technical research. Vendor labels such as RedDelta and Earth Preta are retained as scoped overlaps because public taxonomies do not establish that every record has identical operators and infrastructure.
aliases:
  - name: RedDelta
    source: Vendor reporting
    relationship: possible-overlap
    confidence: moderate
    scope: China-aligned activity overlapping portions of Mustang Panda reporting.
    first_seen: "2019"
    last_seen: "2025"
    notes: Not treated as exact equivalence across all publishers.
  - name: TA416
    source: Vendor reporting
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Public vendor tracking name broadly overlapping Mustang Panda.
    first_seen: "2012"
    last_seen: "2025"
    notes: Search and source-correlation aid.
  - name: Twill Typhoon
    source: Microsoft
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Current Microsoft actor name associated with Mustang Panda.
    first_seen: "2012"
    last_seen: "2025"
    notes: Vendor scope remains source-specific.
attribution:
  - claim: ESET attributes the Hodur European campaign to Mustang Panda with high confidence based on code, infrastructure and operational overlap.
    attributed_entity: Mustang Panda
    source: eset-mustang-panda-hodur-2022
    source_type: vendor-research
    published_at: 2022-03-23
    confidence: high
    status: assessed
    notes: The source supports the campaign identity but does not establish a named state unit.
targeting:
  regions: [Europe, Southeast Asia, East Asia]
  countries: [Greece, Cyprus, Norway, Netherlands, European Union member states]
  sectors: [Government, Diplomatic, Maritime, Transportation, Research, Telecommunications]
  organisations: []
campaigns: [mustang-panda-hodur-europe]
malware: []
tools: []
techniques: [spearphishing-attachment]
technique_evidence:
  - technique: spearphishing-attachment
    campaign: mustang-panda-hodur-europe
    first_observed: "2021-08"
    last_observed: "2022-03"
    confidence: high
    sources: [eset-mustang-panda-hodur-2022]
    notes: ESET documented European diplomatic lures and malicious-document delivery of the Hodur Korplug variant.
    editorial_note: MQsTTang is excluded because ESET later reattributed that malware and campaign to CeranaKeeper.
operational_timeline:
  - date: "2021-08"
    title: Hodur European targeting begins
    summary: ESET observed themed lures against European diplomatic missions and related organisations.
    confidence: high
    sources: [eset-mustang-panda-hodur-2022]
  - date: "2025-Q1"
    title: European operations remain visible
    summary: ESET reporting continued to document government, diplomatic and maritime targeting in the wider European activity set.
    confidence: high
    sources: [eset-mustang-panda-activity-2025]
external_identifiers:
  mitre_attack: G0129
  other: [TA416, RedDelta, Twill Typhoon, Bronze President]
related_research: []
sources: [eset-mustang-panda-hodur-2022, eset-mustang-panda-activity-2025]
updates: [mustang-panda-profile-created]
featured: true
draft: false
---

## Analytic scope

Mustang Panda is a durable public actor label for China-aligned espionage activity, but the surrounding vendor taxonomy is crowded. The dossier uses Hodur as a high-confidence European campaign and treats other names as search mappings unless the examined source explicitly states equivalence.

## European operations

European diplomatic missions, government organisations and cargo or maritime companies are attractive because they hold foreign-policy, trade and logistics information. The actor repeatedly uses plausible regional themes and decoy documents to place familiar content in front of selected recipients.

## Delivery and reuse

The Hodur campaign combined spearphishing with a Korplug variant and familiar loader techniques. Reuse is operationally useful but analytically dangerous: a shared PlugX or Korplug family does not prove that two campaigns share the same operator. This profile therefore publishes one campaign-scoped relationship rather than a maximal technique list.

## Attribution limitations

Public evidence strongly supports the actor and European targeting. It is less complete on formal state tasking and the exact boundaries between Mustang Panda, RedDelta, Earth Preta and related labels. MQsTTang is deliberately excluded after ESET's later reattribution to CeranaKeeper.

