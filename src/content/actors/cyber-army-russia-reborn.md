---
id: cyber-army-russia-reborn
name: Cyber Army of Russia Reborn
slug: cyber-army-russia-reborn
created_at: 2026-08-26
modified_at: 2026-08-26
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A Russian government-aligned hacktivist group associated with DDoS campaigns and low-sophistication industrial-control-system intrusions against Ukraine-supporting states and critical infrastructure.
actor_types: [state-aligned, hacktivist, cybercriminal]
status: uncertain
suspected_origins: [Russia]
motivations: [ideological, disruption, influence]
active_since: "2022"
last_observed: "2024"
confidence: high
last_reviewed: 2026-08-26
authors: [deividas-lis]
mission: Disrupt and publicise attacks against Ukraine and supporting countries through DDoS activity and opportunistic access to exposed industrial control systems, while presenting the activity as pro-Russia hacktivism.
current_assessment: CARR has a strong official record for sustained DDoS activity and a smaller set of industrial-control-system compromises with real but bounded physical effects. US and EU authorities describe the group as Russian government-aligned or GRU-linked. The current standalone status of the CARR identity is uncertain because 2026 EU reporting distinguishes Z-Pentest while identifying its leaders as CARR members.
aliases:
  - name: CARR
    source: US Department of the Treasury
    relationship: common-alias
    confidence: high
    scope: Acronym used by US and EU authorities for Cyber Army of Russia Reborn.
    first_seen: "2022"
    last_seen: "2026"
    notes: Primary short name used throughout the dossier.
  - name: Cyber Army of Russia
    source: US Department of the Treasury
    relationship: common-alias
    confidence: high
    scope: Alternate name explicitly identified in the Treasury sanctions statement.
    first_seen: "2022"
    last_seen: "2024"
    notes: The name is retained for discovery but is not treated as a separate actor.
  - name: The People's Cyber Army of Russia
    source: Joint advisory AA25-343A
    relationship: common-alias
    confidence: high
    scope: Alternate name identified in the multinational advisory's CARR background section.
    first_seen: "2022"
    last_seen: "2025 reporting"
    notes: Retained as a search and source-correlation term.
parent_entities:
  - name: GRU Main Center for Special Technologies, Military Unit 74455
    entity_type: Russian military intelligence unit
    relationship: assessed creator and sponsor
    confidence: high
    source: joint-csa-pro-russia-hacktivists-2025
    notes: The multinational advisory assesses Unit 74455 as likely responsible for supporting CARR's creation and likely funding its DDoS tools through at least September 2024.
  - name: Russian Military Intelligence Agency GRU
    entity_type: Russian military intelligence service
    relationship: linked state sponsor
    confidence: high
    source: eu-russian-cyber-sanctions-2026
    notes: The Council of the EU describes CARR as linked to the GRU. This is not expanded into a claim that every public target was selected by a named GRU unit.
subclusters:
  - name: Z-Pentest
    source: Council of the European Union
    relationship: disputed-equivalence
    confidence: high
    notes: Current EU reporting treats Z-Pentest as a separate group while identifying its leader and primary hacker as CARR members; preserve the organisational distinction.
attribution:
  - claim: A multinational advisory assesses GRU Unit 74455 as likely responsible for supporting CARR's creation and likely funding its DDoS tooling through at least September 2024.
    attributed_entity: GRU Main Center for Special Technologies, Military Unit 74455
    source: joint-csa-pro-russia-hacktivists-2025
    source_type: government
    published_at: 2025-12-09
    confidence: high
    status: assessed
    notes: The advisory uses probabilistic language. It separately assesses that Z-Pentest later operated outside GRU involvement.
  - claim: The US Treasury identifies CARR as a Russian government-aligned hacktivist group and designates its leader and a primary hacker for cyber activity against US critical infrastructure.
    attributed_entity: Cyber Army of Russia Reborn
    source: treasury-carr-2024
    source_type: government
    published_at: 2024-07-19
    confidence: high
    status: confirmed
    notes: This is a sanctions determination, not a criminal conviction.
  - claim: The Council of the EU states that CARR is linked to the Russian military intelligence agency GRU and is responsible for cyberattacks against EU, Ukrainian and other targets.
    attributed_entity: Cyber Army of Russia Reborn
    source: eu-russian-cyber-sanctions-2026
    source_type: government
    published_at: 2026-07-13
    confidence: high
    status: assessed
    notes: The source supports the GRU link but does not establish unit-level tasking for every claimed operation.
  - claim: A US indictment alleges that a defendant supported CARR and that the group was founded, funded and directed by the GRU.
    attributed_entity: Cyber Army of Russia Reborn and an accused supporter
    source: doj-carr-noname-actions-2025
    source_type: legal
    published_at: 2025-12-09
    confidence: high
    status: reported
    notes: The defendant pleaded not guilty. The indictment's CARR-Z-Pentest equivalence differs from the multinational advisory's separate-successor model and is not adopted as a settled fact.
targeting:
  regions: [Ukraine, Europe, North America]
  countries: [Ukraine, United States]
  sectors: [Government, Financial Services, Media, Water and Wastewater, Energy, Critical Infrastructure]
  organisations: []
campaigns: [carr-european-ddos, carr-industrial-control-systems]
malware: []
tools: []
techniques: [network-denial-of-service]
technique_evidence:
  - technique: network-denial-of-service
    campaign: carr-european-ddos
    first_observed: "2022"
    last_observed: "2024"
    confidence: high
    sources: [treasury-carr-2024, eu-russian-cyber-sanctions-2026, joint-csa-pro-russia-hacktivists-2025]
    notes: US and EU sanctions reporting describes sustained, low-impact DDoS campaigns against Ukraine and governments, companies and public services in countries supporting Ukraine.
    editorial_note: The relationship records the official assessment of a sustained DDoS campaign. It does not convert each self-published CARR target claim into a confirmed victim event.
operational_timeline:
  - date: "2022"
    title: DDoS activity begins against Ukraine-supporting states
    summary: US and EU authorities place CARR's sustained availability attacks from 2022 against Ukraine and countries supporting Ukraine.
    confidence: high
    sources: [treasury-carr-2024, eu-russian-cyber-sanctions-2026]
  - date: "2023-late"
    title: Industrial-control-system claims and compromises emerge
    summary: Treasury reporting states that CARR began claiming attacks on US and European industrial control systems and attributes manipulation of equipment across water, wastewater, hydroelectric and energy facilities to the group.
    confidence: high
    sources: [treasury-carr-2024]
  - date: "2024-01"
    title: Texas water-system effects become public
    summary: CARR claimed the manipulation of human-machine interfaces at two Texas facilities; Treasury reports that the compromises caused tank overflow and the loss of tens of thousands of gallons of water.
    confidence: high
    sources: [treasury-carr-2024]
  - date: "2024-07"
    title: United States sanctions CARR leadership
    summary: OFAC designated Yuliya Pankratova and Denis Degtyarenko for their roles as the group's leader and a primary hacker.
    confidence: high
    sources: [treasury-carr-2024]
  - date: "2026-07"
    title: EU sanctions expose the CARR and Z-Pentest overlap
    summary: The Council sanctioned Z-Pentest and two individuals described as both its leaders or hackers and members of CARR, while separately linking CARR to the GRU.
    confidence: high
    sources: [eu-russian-cyber-sanctions-2026]
external_identifiers:
  mitre_attack: ""
  other: [CARR, Cyber Army of Russia]
related_research: []
sources: [joint-csa-pro-russia-hacktivists-2025, doj-carr-noname-actions-2025, treasury-carr-2024, eu-russian-cyber-sanctions-2026, uk-gru-profile-2026]
updates: [cyber-army-russia-reborn-profile-created]
featured: true
draft: false
---

## Overview

Cyber Army of Russia Reborn, usually shortened to CARR, is a Russian government-aligned group with two distinct public activity sets. The larger set is politically motivated DDoS activity against Ukraine and countries supporting Ukraine. The smaller but more consequential set is opportunistic access to industrial control systems in water, wastewater and energy environments.

The group is not technically sophisticated by the standard of a military intrusion set. That does not make it harmless. Exposed control interfaces, weak access controls and operationally important equipment can turn a simple compromise into physical loss. Treasury reporting connects CARR activity to tank overflow and loss of water in Texas, while noting that major damage was avoided.

## State relationship and evidentiary boundary

The US Treasury calls CARR a Russian government-aligned hacktivist group. The Council of the EU describes it as linked to the GRU. A multinational advisory assesses that GRU Unit 74455 likely supported CARR's creation and likely funded its DDoS tooling through at least September 2024. These are official assessments and sanctions determinations. They support a state relationship, but they do not prove that a named GRU officer selected every victim or that every claim posted under the CARR identity was authentic.

The public record should also separate legal and administrative actions from criminal judgments. Sanctions identify prohibited actors and official findings under the applicable regimes; they are not convictions. A US indictment alleges GRU direction and charges an alleged supporter, but the defendant pleaded not guilty and is presumed innocent.

## DDoS activity

US and EU reporting places CARR's DDoS activity from 2022 against Ukraine and public and private organisations in supporting countries. Government, finance, media and critical infrastructure appear in the official target description. The campaigns are characterised as sustained but generally low impact and technically unsophisticated.

The profile maps Network Denial of Service because the official record explicitly describes repeated DDoS campaigns. It does not elevate individual Telegram posts into confirmed incidents. A CARR statement can establish a claim and its timing; independent availability data, victim reporting or government findings are required to establish effect.

## Industrial-control-system activity

Treasury reports that CARR moved into industrial-control-system targeting in late 2023 and manipulated equipment at water, hydroelectric, wastewater and energy facilities in the United States and Europe. The most concrete public event occurred in January 2024, when control of human-machine interfaces at two Texas water facilities contributed to tank overflow and the loss of tens of thousands of gallons of water. Treasury also reports compromise of an energy-company SCADA system with control over tank alarms and pumps.

These events demonstrate consequence through exposed or weakly protected operational interfaces, not a bespoke destructive platform. The dossier retains the behaviour in campaign narrative without inventing an ATT&CK procedure mapping that the linked sources do not explicitly support.

## CARR and Z-Pentest

Current official reporting requires a careful boundary. The joint advisory says dissatisfied CARR administrators and a NoName057(16) administrator created Z-Pentest in September 2024 using similar techniques but operating separately from GRU involvement. The Council of the EU sanctions Z-Pentest as a distinct pro-Russia group and identifies its leader and primary hacker as members of CARR. The same statement attributes a December 2024 Danish water-utility attack to Z-Pentest, not to CARR. A US indictment uses "also known as Z-Pentest" for CARR, producing a genuine difference between official source models.

This profile therefore records Z-Pentest as a high-confidence overlap or successor relationship, not a strict alias. Shared people and tradecraft create a strong pivot; they do not justify moving every Z-Pentest event into CARR's campaign history.

## Current status

CARR has not been publicly described as dismantled. At the same time, the emergence and separate sanctioning of Z-Pentest makes the standalone status of the original CARR identity uncertain. The most defensible formulation is that the actor's personnel and operational lineage remain relevant while the branding and organisational boundary may have changed.

## Analytic limitations

CARR public channels have an incentive to exaggerate impact and may claim opportunistic or unrelated outages. Official summaries can also aggregate many events without disclosing victim telemetry. The strongest evidence concerns the existence of the DDoS campaign, named leadership, the US industrial-control incidents and the EU's GRU-link assessment. The record is weaker on current command structure, complete European victimology and the relationship between CARR, Z-Pentest and other pro-Russia groups.
