---
id: gamaredon
name: UAC-0010 / Gamaredon
slug: gamaredon
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A Russian state-sponsored espionage actor associated with FSB Centre 18 and sustained, high-volume targeting of Ukrainian government and defence organisations.
actor_types: [state-sponsored]
status: active
suspected_origins: [Russia]
motivations: [espionage, credential-access, data-theft]
active_since: "2013"
last_observed: "2025 H1 public reporting"
confidence: high
last_reviewed: 2026-08-27
authors: [deividas-lis]
mission: Maintain persistent intelligence access to Ukrainian public-sector and defence networks through high-volume social engineering, rapidly changing delivery infrastructure and scripted collection tooling.
current_assessment: Gamaredon remains one of the most consistently active Russian espionage actors focused on Ukraine. Technical reporting shows repeated spearphishing waves rather than a small number of bespoke operations. EU sanctions and Ukrainian reporting support the state relationship, while current public victimology remains primarily Ukrainian and should not be exaggerated into broad EU-wide targeting.
aliases:
  - name: UAC-0010
    source: Ukrainian government reporting
    relationship: government-designation
    confidence: high
    scope: Ukrainian cluster designation used for the activity tracked publicly as Gamaredon.
    first_seen: "2013"
    last_seen: "2025"
    notes: Preferred alongside Gamaredon because it preserves the Ukrainian source boundary.
  - name: Armageddon
    source: Council of the European Union
    relationship: common-alias
    confidence: high
    scope: Official name used in the EU sanctions record.
    first_seen: "2013"
    last_seen: "2024"
    notes: Retained as an alias, not a claim that every historical Armageddon label identifies an identical operator set.
  - name: Aqua Blizzard
    source: Microsoft
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Microsoft tracking name overlapping Gamaredon activity.
    first_seen: "2013"
    last_seen: "2025"
    notes: Vendor cluster scope can change over time.
parent_entities:
  - name: FSB Centre 18
    entity_type: Russian security service unit
    relationship: official state association
    confidence: high
    source: eu-gamaredon-sanctions-2024
    notes: The EU sanctions record identifies group members and FSB support; it does not expose the full command chain for every operation.
attribution:
  - claim: The Council of the EU describes Armageddon/Gamaredon as supported by Russia's FSB and responsible for attacks affecting EU member states and Ukraine.
    attributed_entity: FSB Centre 18
    source: eu-gamaredon-sanctions-2024
    source_type: government
    published_at: 2024-06-24
    confidence: high
    status: confirmed
    notes: Official sanctions attribution; campaign-level victim and procedure claims remain source-specific.
targeting:
  regions: [Ukraine, Eastern Europe]
  countries: [Ukraine]
  sectors: [Government, Defence, Law Enforcement, Judiciary, Civil Society]
  organisations: []
campaigns: [gamaredon-ukraine-spearphishing-2024]
malware: []
tools: []
techniques: [spearphishing-attachment]
technique_evidence:
  - technique: spearphishing-attachment
    campaign: gamaredon-ukraine-spearphishing-2024
    first_observed: "2024-01"
    last_observed: "2024-12"
    confidence: high
    sources: [eset-gamaredon-2024-2025]
    notes: ESET documented repeated malicious archive, HTML, HTA and shortcut delivery chains sent to Ukrainian government targets throughout 2024.
    editorial_note: The relationship represents the observed campaign and does not imply that every Gamaredon intrusion begins with the same attachment chain.
operational_timeline:
  - date: "2013"
    title: Sustained Ukraine-focused activity begins
    summary: Public government and technical records track the actor from at least 2013 against Ukrainian institutions.
    confidence: high
    sources: [eu-gamaredon-sanctions-2024]
  - date: "2024"
    title: High-volume spearphishing continues
    summary: ESET observed rapidly changing delivery chains and persistent targeting of Ukrainian government organisations across 2024.
    confidence: high
    sources: [eset-gamaredon-2024-2025]
external_identifiers:
  mitre_attack: G0047
  other: [UAC-0010, Primitive Bear, Trident Ursa, Armageddon, Aqua Blizzard]
related_research: []
sources: [eu-gamaredon-sanctions-2024, eset-gamaredon-2024-2025]
updates: [gamaredon-profile-created]
featured: true
draft: false
---

## Analytic scope

UAC-0010 / Gamaredon is used here for the stable activity set associated by Ukrainian, EU and vendor reporting with sustained Russian espionage against Ukraine. The record keeps official and vendor names visible because those taxonomies describe evidence collected at different times. Shared tooling or infrastructure alone is not used to extend the actor beyond those source boundaries.

## Operating model

Gamaredon trades stealth at the campaign level for persistence at scale. It sends repeated spearphishing waves, rotates infrastructure and changes scripts and intermediate payloads quickly. A blocked message or dismantled domain therefore does not end the operation; the delivery chain is designed to be replaced.

The 2024 campaign used archives, HTML content, shortcut files and scripted execution. Those procedures support a defensive relationship to spearphishing attachments. They do not justify importing every technique ever associated with the actor into the current evidence graph.

## European relevance

Ukraine is the central and best-supported victim environment. This is directly relevant to European defence, diplomatic and governmental security, but the catalogue does not convert that relevance into an unsupported claim that the 2024 campaign broadly victimised EU member states. The EU sanctions record supplies historical European-impact context separately.

## Attribution and limitations

The state relationship is strongly supported by official reporting. The weaker part of the public record is internal tasking: public sources do not expose who selected every target or whether each tool operator belonged to the same organisational cell. Alias lists are therefore search aids and source mappings, not a promise that every vendor record is coextensive.

