---
id: evil-corp
name: Evil Corp
slug: evil-corp
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A Russian financially motivated cybercriminal organisation linked by UK and US authorities to Dridex-enabled theft, ransomware operations and extensive harm in the United Kingdom and Europe.
actor_types: [cybercriminal, ransomware, financially-motivated]
status: intermittently-active
suspected_origins: [Russia]
motivations: [financial, extortion, credential-access, data-theft]
active_since: "2014"
last_observed: "2026 ecosystem disruption reporting"
confidence: high
last_reviewed: 2026-08-27
authors: [deividas-lis]
mission: Monetise credential theft and enterprise access through financial fraud, ransomware and changing brands or partner services designed to preserve revenue under law-enforcement and sanctions pressure.
current_assessment: Evil Corp is a durable criminal organisation whose core identity is stronger than any one malware or ransomware brand. UK authorities describe leadership, Russian state relationships and long-running harm to UK victims. Later branding and affiliate activity require caution because Dridex, SocGholish, WastedLocker and LockBit are tools, delivery relationships or service brands rather than automatic actor synonyms.
aliases:
  - name: Indrik Spider
    source: Vendor reporting
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Vendor cluster commonly associated with the Evil Corp organisation.
    first_seen: "2014"
    last_seen: "2024"
    notes: Does not make every related malware deployment a core-operator intrusion.
  - name: Dridex gang
    source: UK government reporting
    relationship: historical-designation
    confidence: high
    scope: Historical public shorthand for the organisation during its financial-theft phase.
    first_seen: "2014"
    last_seen: "2019"
    notes: Dridex itself is malware, not an actor alias.
parent_entities:
  - name: Maksim Yakubets-led criminal organisation
    entity_type: core criminal leadership
    relationship: official leadership attribution
    confidence: high
    source: uk-evil-corp-sanctions-2024
    notes: UK sanctions and NCA reporting identify leadership and associates; this does not assign every affiliate action to one person.
attribution:
  - claim: UK authorities identify Maksim Yakubets as the leader of Evil Corp and describe extensive UK financial and ransomware harm.
    attributed_entity: Maksim Yakubets-led Evil Corp organisation
    source: uk-evil-corp-sanctions-2024
    source_type: government
    published_at: 2024-10-01
    confidence: high
    status: confirmed
    notes: Sanctions and investigative findings are retained separately from convictions and campaign-level evidence.
targeting:
  regions: [United Kingdom, Europe, North America]
  countries: [United Kingdom, European Union member states, United States]
  sectors: [Financial Services, Healthcare, Government, Technology, Professional Services]
  organisations: []
campaigns: [evil-corp-dridex-uk]
malware: []
tools: []
techniques: [spearphishing-attachment]
technique_evidence:
  - technique: spearphishing-attachment
    campaign: evil-corp-dridex-uk
    first_observed: "2014"
    last_observed: "2019"
    confidence: high
    sources: [ncsc-evil-corp-2019, uk-evil-corp-sanctions-2024]
    notes: UK reporting documents malicious email and attachment delivery in Dridex-enabled credential theft and financial fraud operations.
    editorial_note: Dridex is treated as campaign tooling, and later ransomware or affiliate operations are not inferred from this relationship.
operational_timeline:
  - date: "2014"
    title: Dridex financial operations emerge
    summary: The organisation develops a major credential-theft and banking-fraud operation affecting UK and international victims.
    confidence: high
    sources: [ncsc-evil-corp-2019]
  - date: "2024-10"
    title: UK sanctions expose leadership and rebranding
    summary: UK authorities sanctioned members and described efforts to evade earlier restrictions through changing ransomware brands and relationships.
    confidence: high
    sources: [uk-evil-corp-sanctions-2024]
external_identifiers:
  mitre_attack: G0119
  other: [Indrik Spider, Dridex gang]
related_research: []
sources: [uk-evil-corp-sanctions-2024, ncsc-evil-corp-2019]
updates: [evil-corp-profile-created]
featured: true
draft: false
---

## Analytic scope

Evil Corp is the organisation, not a list of malware names. Dridex supports the historical financial-theft phase; later ransomware families and services reflect changing monetisation and sanctions-evasion strategies. A technical overlap must still be connected to the core organisation before it becomes actor evidence.

## UK and European relevance

UK authorities document substantial financial losses and later ransomware impact across healthcare, government, public services and technology. That record supplies unusually strong regional and leadership context. The catalogue does not convert every Dridex infection or LockBit-branded incident into an Evil Corp intrusion.

## Adaptation under pressure

Sanctions and law enforcement changed the operating environment but did not remove the incentive to monetise access. Rebranding, delivery partnerships and affiliate participation can obscure continuity. The actor is therefore assessed as intermittently active rather than assigned uninterrupted ownership of every public brand.

## Attribution limitations

Official reporting is strong for the core organisation and named leadership. It is weaker for the current boundary between the original group, associates and service partners. The dossier distinguishes those layers so defensive users can rely on the historical evidence without overstating a modern campaign attribution.

