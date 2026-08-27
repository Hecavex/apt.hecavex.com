---
id: romcom
name: TA829 / RomCom
slug: romcom
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A Russia-aligned hybrid cybercrime and espionage cluster targeting European government, defence, energy, logistics and industry through phishing, trojanised software and rapid exploitation.
actor_types: [state-aligned, cybercriminal, mixed]
status: active
suspected_origins: [Russia]
motivations: [espionage, financial, credential-access, data-theft]
active_since: "2022"
last_observed: "2025-08 public reporting"
confidence: high
last_reviewed: 2026-08-27
authors: [deividas-lis]
mission: Conduct conventional cybercrime and targeted intelligence collection through a shared operating cluster that uses social engineering, trojanised software and high-value exploitation chains.
current_assessment: TA829/RomCom is best described as a Russia-aligned hybrid actor. Microsoft and ESET document both financially motivated activity and espionage against Ukraine-aligned and European targets. Alignment with Russian interests is supported, but the public record does not establish formal state control or explain whether tasking, co-option or informal cooperation drives the espionage branch.
aliases:
  - name: Storm-0978
    source: Microsoft
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Microsoft cluster covering RomCom-linked cybercrime and espionage operations.
    first_seen: "2022"
    last_seen: "2024"
    notes: Microsoft nomenclature is retained as a source-scoped mapping.
  - name: Void Rabisu
    source: Vendor reporting
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Vendor name overlapping the espionage-focused activity set.
    first_seen: "2022"
    last_seen: "2025"
    notes: Unrelated to the separately catalogued actor Void Blizzard.
  - name: Tropical Scorpius
    source: Vendor reporting
    relationship: possible-overlap
    confidence: moderate
    scope: Vendor tracking label associated with parts of the RomCom activity set.
    first_seen: "2022"
    last_seen: "2024"
    notes: Not assumed to cover every operation in the dossier.
attribution:
  - claim: Microsoft assesses Storm-0978 as a Russia-based cybercriminal group conducting ransomware operations and intelligence-focused targeting aligned with Russian interests.
    attributed_entity: TA829 / RomCom
    source: microsoft-storm0978-romcom-2023
    source_type: vendor-research
    published_at: 2023-07-11
    confidence: high
    status: assessed
    notes: The assessment supports alignment and hybrid motives, not formal Russian state control.
targeting:
  regions: [Europe, Ukraine, North America]
  countries: [Ukraine, European Union member states, Canada, United States]
  sectors: [Government, Defence, Energy, Logistics, Manufacturing, Financial Services]
  organisations: []
campaigns: [romcom-europe-zero-day-2024]
malware: []
tools: []
techniques: [exploit-client-execution]
vulnerabilities:
  - cve: CVE-2024-9680
    product: Mozilla Firefox
    role: Initial browser exploitation in the October 2024 chain.
    campaign: romcom-europe-zero-day-2024
    first_observed: "2024-10"
    confidence: high
    source: eset-romcom-zero-days-2024
    notes: Paired with a Windows privilege-escalation vulnerability in the observed chain.
technique_evidence:
  - technique: exploit-client-execution
    campaign: romcom-europe-zero-day-2024
    first_observed: "2024-10"
    last_observed: "2024-11"
    confidence: high
    sources: [eset-romcom-zero-days-2024]
    notes: ESET documented exploitation of Firefox and Windows zero days against selected targets in Europe and North America.
    editorial_note: The relationship is limited to the observed campaign and does not attribute unrelated exploitation of the vulnerabilities to RomCom.
operational_timeline:
  - date: "2023-07"
    title: Hybrid motives documented
    summary: Microsoft described ransomware activity alongside espionage targeting of European and Ukrainian government and defence organisations.
    confidence: high
    sources: [microsoft-storm0978-romcom-2023]
  - date: "2024-10"
    title: Browser and Windows zero-day chain
    summary: ESET observed a chained exploitation operation against selected European and North American victims.
    confidence: high
    sources: [eset-romcom-zero-days-2024]
external_identifiers:
  mitre_attack: ""
  other: [TA829, Storm-0978, Void Rabisu, Tropical Scorpius, UNC2596]
related_research: []
sources: [microsoft-storm0978-romcom-2023, eset-romcom-zero-days-2024]
updates: [romcom-profile-created]
featured: true
draft: false
---

## Analytic scope

The record uses TA829 / RomCom for a public activity set that combines conventional cybercrime with targeted espionage. RomCom began as a backdoor name and became shorthand for an operator cluster. The dossier keeps those meanings explicit and does not use the name to absorb adjacent infrastructure or loader clusters automatically.

## Hybrid mission

Financial and intelligence objectives coexist. Microsoft observed ransomware-related operations and separately documented targeting of governments and defence organisations. This dual use makes simple classification misleading: calling the actor only criminal hides the espionage branch, while calling it state-sponsored overstates evidence about formal control.

## European exploitation

The 2024 Firefox and Windows chain shows the actor's ability to use high-value exploitation against a selective victim set. Earlier operations used malicious documents and trojanised software. These are different delivery paths connected by actor-level evidence, not proof that every exploit or lure belongs to the same campaign.

## Attribution limitations

Public sources support Russia alignment, European targeting and hybrid motives. They do not establish a named Russian service, formal tasking or the mechanism that connects criminal and intelligence work. Void Rabisu must also remain distinct from Void Blizzard despite the similar words in their names.
