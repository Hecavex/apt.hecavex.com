---
id: clop
name: CL0P
slug: clop
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A financially motivated extortion and ransomware brand associated with repeated mass exploitation of managed file-transfer and enterprise applications affecting organisations across Europe and beyond.
actor_types: [cybercriminal, ransomware, financially-motivated]
status: active
suspected_origins: [Eastern Europe]
motivations: [financial, extortion, data-theft]
active_since: "2019-02"
last_observed: "2026 public reporting"
confidence: high
last_reviewed: 2026-08-27
authors: [deividas-lis]
mission: Exploit widely deployed enterprise platforms at scale, steal data and convert widespread third-party exposure into extortion pressure through the CL0P public brand.
current_assessment: CL0P remains a durable extortion brand with a demonstrated pattern of exploiting managed-transfer and enterprise applications. The MOVEit campaign produced direct and supply-chain exposure across Europe. FIN11, TA505 and Lace Tempest overlap parts of the public history but are not treated as exact equivalents to the current CL0P operator set.
aliases:
  - name: Clop
    source: CISA and FBI
    relationship: common-alias
    confidence: high
    scope: Capitalisation variant for the same public extortion brand.
    first_seen: "2019"
    last_seen: "2026"
    notes: Same brand label.
  - name: TA505
    source: Joint and vendor reporting
    relationship: disputed-equivalence
    confidence: moderate
    scope: Historical activity with operational overlap around CL0P delivery and monetisation.
    first_seen: "2014"
    last_seen: "2023"
    notes: Not an exact alias for every CL0P campaign.
  - name: FIN11
    source: Vendor reporting
    relationship: possible-overlap
    confidence: moderate
    scope: Financially motivated cluster associated with parts of CL0P's historical operation.
    first_seen: "2016"
    last_seen: "2023"
    notes: Retained as scoped overlap.
attribution:
  - claim: CISA and the FBI attribute the mass MOVEit exploitation and CL0P-branded extortion campaign to the CL0P ransomware gang.
    attributed_entity: CL0P
    source: cisa-clop-moveit-2023
    source_type: government
    published_at: 2023-06-07
    confidence: high
    status: confirmed
    notes: The advisory discusses TA505 associations without establishing global identity equivalence.
targeting:
  regions: [Europe, North America, Global]
  countries: [Germany, Netherlands, United Kingdom, European Union member states, United States]
  sectors: [Financial Services, Government, Healthcare, Education, Professional Services]
  organisations: []
campaigns: [clop-moveit-2023]
malware: []
tools: []
techniques: [exploit-public-facing-application]
vulnerabilities:
  - cve: CVE-2023-34362
    product: Progress MOVEit Transfer
    role: Initial access and deployment of the LEMURLOOT web shell in the mass exploitation campaign.
    campaign: clop-moveit-2023
    first_observed: "2023-05"
    confidence: high
    source: cisa-clop-moveit-2023
    notes: Exploitation created both direct and downstream third-party exposure.
technique_evidence:
  - technique: exploit-public-facing-application
    campaign: clop-moveit-2023
    first_observed: "2023-05"
    last_observed: "2023-06"
    confidence: high
    sources: [cisa-clop-moveit-2023, enisa-finance-threat-landscape-2025]
    notes: The campaign exploited internet-facing MOVEit Transfer systems to deploy LEMURLOOT and steal data for extortion.
    editorial_note: The relationship is limited to the cited campaign and does not assign every MOVEit compromise or all TA505 activity to one operator.
operational_timeline:
  - date: "2019-02"
    title: CL0P ransomware brand appears
    summary: Public reporting begins tracking the CL0P ransomware and extortion brand.
    confidence: high
    sources: [cisa-clop-moveit-2023]
  - date: "2023-05"
    title: MOVEit mass exploitation begins
    summary: The operation exploited an unknown vulnerability at scale and created substantial direct and downstream organisational exposure.
    confidence: high
    sources: [cisa-clop-moveit-2023, enisa-finance-threat-landscape-2025]
external_identifiers:
  mitre_attack: ""
  other: [Clop, CL0P ransomware gang]
related_research: []
sources: [cisa-clop-moveit-2023, enisa-finance-threat-landscape-2025]
updates: [clop-profile-created]
featured: true
draft: false
---

## Analytic scope

CL0P is treated as an extortion brand and operating ecosystem. Public sources connect it to several historical vendor clusters, but those labels were collected under different criteria. The dossier preserves the overlaps without declaring every TA505 or FIN11 intrusion part of the same current group.

## Mass exploitation model

The MOVEit operation traded victim-specific access work for scale. Exploiting a common enterprise platform produced access to direct users and downstream data held by service providers. The resulting victim graph could be much larger than the number of vulnerable servers.

## European relevance

European financial institutions and other organisations were exposed directly or through suppliers. ENISA provides regional sector context while the joint advisory supplies the procedure evidence. Neither source is used to infer that every publicly named organisation suffered the same data loss or extortion outcome.

## Attribution limitations

Brand continuity is clearer than human continuity. The leak identity may survive changes in operators, access partners or infrastructure. Campaign-level evidence is therefore more defensible than claiming one stable crew has conducted every CL0P-branded operation since 2019.
