---
id: apt44
name: APT44
slug: apt44
created_at: 2026-08-09
modified_at: 2026-08-09
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A Russian military intelligence intrusion set associated with GRU Unit 74455 and a full-spectrum mission spanning strategic access, espionage, destructive attacks, operational-technology disruption and influence activity.
actor_types: [state-sponsored]
status: active
suspected_origins: [Russia]
motivations: [espionage, disruption, destruction, influence, credential-access, data-theft]
active_since: "2009"
last_observed: "2026"
confidence: high
last_reviewed: 2026-08-09
authors: [deividas-lis]
mission: Obtain and preserve access, collect intelligence, disrupt or destroy selected systems and amplify operational effects in support of Russian military and state objectives.
current_assessment: "APT44 remains an active full-spectrum threat. Current public reporting shows two complementary priorities: scalable access to internet-facing infrastructure that can be retained for strategic use, and intelligence collection from defence-related systems, battlefield platforms and private messaging data. Its history means retained access must be evaluated for both espionage and destructive follow-on risk."
parent_entities:
  - name: GRU Main Centre for Special Technologies, Military Unit 74455
    entity_type: Russian military intelligence unit
    relationship: attributed operator
    confidence: high
    source: doj-sandworm-indictment-2020
    notes: The United States charged Unit 74455 officers in connection with destructive and disruptive operations publicly tracked as Sandworm activity.
aliases:
  - name: Sandworm Team
    source: Government and industry reporting
    relationship: common-alias
    confidence: high
    scope: Broad public designation for activity associated with GRU Unit 74455.
    first_seen: "2014 public naming"
    last_seen: "2026"
    notes: The name predates Mandiant's APT44 designation and remains widely used.
  - name: Seashell Blizzard
    source: Microsoft
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Microsoft cluster overlapping APT44 and Unit 74455 activity.
    first_seen: "2023 naming"
    last_seen: "2025"
    notes: Previously tracked by Microsoft as IRIDIUM.
  - name: FROZENBARENTS
    source: Google Threat Intelligence Group
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Google tracking designation used for activity now included in APT44.
    first_seen: "historical"
    last_seen: "2026"
    notes: Vendor boundaries may be narrower than the complete analytic record.
  - name: IRIDIUM
    source: Microsoft
    relationship: historical-designation
    confidence: high
    scope: Former Microsoft designation replaced by Seashell Blizzard.
    first_seen: "historical"
    last_seen: "2023"
    notes: Retained for searching historical Microsoft reporting.
  - name: Voodoo Bear
    source: Government and industry reporting
    relationship: common-alias
    confidence: high
    scope: Public alias associated with Unit 74455 operations.
    first_seen: "historical"
    last_seen: "2022"
    notes: Used in joint government reporting on Cyclops Blink.
  - name: TeleBots
    source: ESET and industry reporting
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Historical cluster associated with disruptive activity and related tooling.
    first_seen: "historical"
    last_seen: "2024"
    notes: Some reporting uses the name for a subset of the broader activity.
  - name: BlackEnergy Group
    source: Industry reporting
    relationship: historical-designation
    confidence: high
    scope: Historical activity cluster connected to Ukrainian power-sector intrusions.
    first_seen: "historical"
    last_seen: "2016"
    notes: The BlackEnergy malware family and actor label should not be treated as interchangeable in every source.
  - name: ELECTRUM
    source: Dragos
    relationship: research-cluster
    confidence: high
    scope: Research designation associated with Sandworm's electric-power operations.
    first_seen: "historical"
    last_seen: "2024"
    notes: Primarily useful in OT-focused reporting.
subclusters:
  - name: BadPilot initial-access subgroup
    source: Microsoft Threat Intelligence
    relationship: subgroup
    confidence: high
    notes: Microsoft distinguishes this horizontally scalable access operation from the entirety of Seashell Blizzard activity.
attribution:
  - claim: The United States charged six GRU Unit 74455 officers with destructive and disruptive operations publicly tracked as Sandworm Team, TeleBots, Voodoo Bear and Iron Viking.
    attributed_entity: GRU Military Unit 74455
    source: doj-sandworm-indictment-2020
    source_type: legal
    published_at: 2020-10-19
    confidence: high
    status: reported
    notes: The source is a charging announcement. The allegations are not recorded as judicial findings.
  - claim: The NCSC, CISA, FBI and NSA attribute Sandworm to the Russian GRU Main Centre for Special Technologies.
    attributed_entity: GRU Main Centre for Special Technologies, Military Unit 74455
    source: ncsc-cyclops-blink-2022
    source_type: government
    published_at: 2022-02-23
    confidence: high
    status: assessed
    notes: Joint government attribution associated with the Cyclops Blink advisory.
  - claim: Mandiant assesses that APT44 is sponsored by Russian military intelligence and combines espionage, attack and influence operations.
    attributed_entity: Russian military intelligence
    source: gtig-apt44-2024
    source_type: vendor-research
    published_at: 2024-04-17
    confidence: high
    status: assessed
    notes: This assessment defines the APT44 analytic umbrella used by this profile.
  - claim: Microsoft links Seashell Blizzard and its BadPilot initial-access subgroup to operations conducted on behalf of GRU Unit 74455.
    attributed_entity: GRU Military Unit 74455
    source: microsoft-badpilot-2025
    source_type: vendor-research
    published_at: 2025-02-12
    confidence: high
    status: assessed
    notes: The subgroup relationship should not be expanded to every opportunistic compromise without supporting evidence.
targeting:
  regions: [Ukraine, Europe, North America, Central Asia, South Asia, Middle East, Australia, Global]
  countries: [Ukraine, Poland, Georgia, France, United Kingdom, United States, Canada, Australia, South Korea]
  sectors: [Government, Military, Defence, Energy, Electric Power, Oil and Gas, Water, Telecommunications, Transportation, Logistics, Shipping, Manufacturing, Information Technology, Media, Civil Society, Critical Infrastructure]
  organisations: []
campaigns: [badpilot, ukraine-electric-power-2022, prestige-ransomware, notpetya-operation]
malware: [localolive, cyclops-blink, caddywiper, prestige, notpetya, wavesign]
tools: [shadowlink, rclone]
techniques: [exploit-public-facing-application, server-software-component-web-shell, external-remote-services, remote-access-software, os-credential-dumping-lsass, valid-accounts, data-from-local-system, powershell, scheduled-task, data-destruction, lateral-tool-transfer, systemd-service, supply-chain-compromise]
vulnerabilities:
  - cve: CVE-2021-34473
    product: Microsoft Exchange Server
    role: Initial access followed by web-shell deployment
    campaign: badpilot
    first_observed: "2021"
    confidence: high
    source: microsoft-badpilot-2025
    notes: Microsoft observed web-shell retrieval and deployment after exploitation.
  - cve: CVE-2022-41352
    product: Zimbra Collaboration
    role: Arbitrary file write used to place a web shell
    campaign: badpilot
    first_observed: "2022-10-24"
    confidence: high
    source: microsoft-badpilot-2025
    notes: Exploitation used crafted email attachments to write files to the server.
  - cve: CVE-2023-32315
    product: Openfire
    role: Perimeter-service exploitation for initial access
    campaign: badpilot
    first_observed: "2023"
    confidence: high
    source: microsoft-badpilot-2025
    notes: Included in Microsoft's observed vulnerability set for the subgroup.
  - cve: CVE-2023-42793
    product: JetBrains TeamCity
    role: Perimeter-service exploitation for initial access
    campaign: badpilot
    first_observed: "2023"
    confidence: high
    source: microsoft-badpilot-2025
    notes: Included in Microsoft's observed vulnerability set for the subgroup.
  - cve: CVE-2023-23397
    product: Microsoft Outlook for Windows
    role: Credential access supporting follow-on compromise
    campaign: badpilot
    first_observed: "2023"
    confidence: high
    source: microsoft-badpilot-2025
    notes: Recorded specifically within Microsoft's subgroup reporting; the vulnerability has also been used by other actors.
  - cve: CVE-2024-1709
    product: ConnectWise ScreenConnect
    role: Remote command execution followed by RMM deployment
    campaign: badpilot
    first_observed: "2024-02-24"
    confidence: high
    source: microsoft-badpilot-2025
    notes: Follow-on activity included Atera Agent, credential access and additional persistence.
  - cve: CVE-2023-48788
    product: Fortinet FortiClient EMS
    role: Remote command execution followed by RMM deployment
    campaign: badpilot
    first_observed: "2024-04"
    confidence: high
    source: microsoft-badpilot-2025
    notes: Microsoft observed Atera retrieval from actor-controlled infrastructure during April 2024 exploitation.
technique_evidence:
  - technique: exploit-public-facing-application
    campaign: badpilot
    first_observed: "2021"
    last_observed: "2025 reporting"
    confidence: high
    sources: [microsoft-badpilot-2025]
    notes: Seven named CVEs and one JBoss exploitation pattern are recorded in the public report.
  - technique: server-software-component-web-shell
    campaign: badpilot
    first_observed: "2021"
    last_observed: "2025 reporting"
    confidence: high
    sources: [microsoft-badpilot-2025]
    notes: Web shells remained the subgroup's predominant persistence method when reported.
  - technique: external-remote-services
    campaign: badpilot
    first_observed: "2021"
    last_observed: "2025 reporting"
    confidence: high
    sources: [microsoft-badpilot-2025, ncsc-cyclops-blink-2022]
    notes: Evidence includes OpenSSH, Tor-based access and network-device infrastructure.
  - technique: remote-access-software
    campaign: badpilot
    first_observed: "2024"
    last_observed: "2025 reporting"
    confidence: high
    sources: [microsoft-badpilot-2025]
    notes: Atera Agent and Splashtop were used as legitimate-looking persistence and command channels.
  - technique: os-credential-dumping-lsass
    campaign: badpilot
    first_observed: "2024"
    last_observed: "2025 reporting"
    confidence: high
    sources: [microsoft-badpilot-2025]
    notes: Evidence includes renamed ProcDump and interactive access compatible with Task Manager dumping.
  - technique: valid-accounts
    campaign: prestige-ransomware
    first_observed: "2022"
    last_observed: "2025 reporting"
    confidence: high
    sources: [microsoft-prestige-2022, microsoft-badpilot-2025]
    notes: Credential access and retained identities support durable follow-on operations.
  - technique: data-from-local-system
    first_observed: "2023"
    last_observed: "2026 reporting"
    confidence: high
    sources: [gtig-defense-industrial-base-2026]
    notes: WAVESIGN collected Signal Desktop data; the public report also describes attempts to obtain Telegram and Signal information from devices.
  - technique: powershell
    campaign: ukraine-electric-power-2022
    first_observed: "2022"
    last_observed: "2022"
    confidence: high
    sources: [mandiant-ukraine-power-2023, mitre-g0034]
    notes: TANKTRAP used PowerShell and Group Policy to distribute a wiper.
  - technique: scheduled-task
    campaign: ukraine-electric-power-2022
    first_observed: "2022"
    last_observed: "2022"
    confidence: high
    sources: [mandiant-ukraine-power-2023, microsoft-prestige-2022]
    notes: Scheduled execution appears in separate destructive deployment chains.
  - technique: data-destruction
    campaign: ukraine-electric-power-2022
    first_observed: "2015"
    last_observed: "2022"
    confidence: high
    sources: [doj-sandworm-indictment-2020, mandiant-ukraine-power-2023, microsoft-prestige-2022]
    notes: The profile separates destructive payload deployment from the mechanism that caused each operational outage.
  - technique: lateral-tool-transfer
    campaign: prestige-ransomware
    first_observed: "2015"
    last_observed: "2022"
    confidence: high
    sources: [microsoft-prestige-2022, mandiant-ukraine-power-2023, mitre-g0034]
    notes: Includes Group Policy, network shares and transfer between IT and OT systems.
  - technique: systemd-service
    campaign: ukraine-electric-power-2022
    first_observed: "2022"
    last_observed: "2022"
    confidence: high
    sources: [mandiant-ukraine-power-2023, mitre-g0034]
    notes: GOGETTER used service units that masqueraded as legitimate Linux services.
  - technique: supply-chain-compromise
    campaign: notpetya-operation
    first_observed: "2017"
    last_observed: "2017"
    confidence: high
    sources: [doj-sandworm-indictment-2020, gtig-apt44-2024, mitre-g0034]
    notes: The trusted update mechanism enabled initial distribution before broader propagation.
operational_timeline:
  - date: "2009-2014"
    title: Early activity and public Sandworm naming
    summary: Public tracking places the cluster in operation since at least 2009; the Sandworm name entered industry reporting before later government attribution.
    confidence: high
    sources: [gtig-apt44-2024, mitre-g0034]
  - date: "2015-2016"
    title: Ukrainian electric-power disruptions
    summary: Operations associated with the group disrupted Ukrainian power distribution and demonstrated purpose-built capability against operational technology.
    confidence: high
    sources: [doj-sandworm-indictment-2020, gtig-apt44-2024, mitre-g0034]
  - date: "2017"
    title: NotPetya escapes its initial Ukrainian distribution context
    summary: A compromised software-update mechanism delivered a destructive payload that spread internationally and caused extensive collateral damage.
    confidence: high
    sources: [doj-sandworm-indictment-2020, gtig-apt44-2024]
  - date: "2018"
    title: Olympic Destroyer and retaliation beyond Ukraine
    summary: The United States charged Unit 74455 officers in connection with destructive activity against the PyeongChang Winter Olympics and related spearphishing.
    confidence: high
    sources: [doj-sandworm-indictment-2020]
  - date: "2019-2022"
    title: Network-device persistence and wartime destructive operations
    summary: Cyclops Blink provided modular firmware persistence while operations in Ukraine included electric-power disruption, wipers and the Prestige attacks affecting Ukraine and Poland.
    confidence: high
    sources: [ncsc-cyclops-blink-2022, mandiant-ukraine-power-2023, microsoft-prestige-2022]
  - date: "2024"
    title: APT44 analytic consolidation
    summary: Mandiant introduced APT44 as the umbrella for a full-spectrum actor and corrected previously conflated APT28 activity after reanalysis of shared victim access.
    confidence: high
    sources: [gtig-apt44-2024, mandiant-apt44-correction-2024]
  - date: "2025"
    title: BadPilot exposes a scalable access layer
    summary: Microsoft documented a subgroup exploiting perimeter applications, deploying web shells and legitimate remote-management tools, and preserving access for selected strategic operations.
    confidence: high
    sources: [microsoft-badpilot-2025]
  - date: "2026"
    title: Defence and battlefield intelligence collection remains visible
    summary: GTIG reported continued attempts to collect Signal and Telegram data and target battlefield-management and defence-related technology.
    confidence: high
    sources: [gtig-defense-industrial-base-2026]
external_identifiers:
  mitre_attack: G0034
  other: [GRU Unit 74455, GTsST]
related_research: []
sources: [gtig-defense-industrial-base-2026, microsoft-badpilot-2025, gtig-apt44-2024, mitre-g0034, doj-sandworm-indictment-2020, ncsc-cyclops-blink-2022, mandiant-ukraine-power-2023, microsoft-prestige-2022, mandiant-apt44-correction-2024]
updates: [apt44-profile-created]
featured: true
draft: false
---

## Overview

APT44 is best understood as a full-spectrum military intelligence capability, not merely a wiper operator. Public reporting connects the cluster to GRU Military Unit 74455 and documents strategic access, espionage, cyber-physical disruption, destructive malware and influence activity.

The actor's destructive history matters, but it can distort analysis if every intrusion is treated as preparation for sabotage. BadPilot demonstrates a scalable access layer: compromise many exposed systems, retain selected footholds and invest further where the victim becomes operationally useful. Current defence-sector reporting also shows collection against battlefield communications and private messaging data.

## Relationship to APT28

APT28 and APT44 are separate analytic records associated with different GRU units. APT28 is tied to Unit 26165; APT44 is tied to Unit 74455. They can support related Russian objectives, appear in the same victim environment or interact with the same information-operation ecosystem without becoming the same actor.

Mandiant's 2024 correction is a concrete warning. Activity initially assigned to APT28 because both actors were present in one network was reassigned to APT44 after incident reanalysis. Cohabitation is evidence of overlap, not identity.

## Mission evolution

APT44 has repeatedly moved between access, intelligence collection and operational effect. Historic campaigns include electric-grid disruption, global destructive propagation and politically timed sabotage. During the war against Ukraine, public reporting showed increased emphasis on battlefield intelligence and more streamlined OT operations alongside continuing destructive capability.

This is not a clean linear transition from sabotage to espionage. The available evidence supports a portfolio model: access can be collected at scale, selected for intelligence value and retained as an option for later disruption.

## Current threat picture

Two public developments define the current assessment.

First, BadPilot shows systematic exploitation of internet-facing infrastructure. The subgroup used published vulnerabilities, web shells, RMM software, credential dumping, OpenSSH and Tor-based access. Most opportunistic victims did not necessarily receive extensive follow-on activity, but selected compromises provided durable access to strategically relevant organisations.

Second, GTIG's 2026 defence-sector assessment reports continued APT44 attempts to collect Telegram and Signal data, including use of WAVESIGN, and targeting related to battlefield-management systems and defence technology. Some device access may occur outside normal enterprise visibility, particularly when equipment is physically obtained in a conflict zone.

## Targeting and operational model

Ukraine remains the actor's principal operational focus, but its reach is global where Russian military or political interests intersect with government, defence, logistics, energy, telecommunications and civil society.

A useful defensive model separates four layers:

1. **Access generation:** scanning, public exploits, phishing, supply-chain compromise and network-device implants.
2. **Access retention:** web shells, valid accounts, remote-management tools, OpenSSH, Tor services and firmware persistence.
3. **Mission execution:** intelligence collection, lateral movement, messaging-data theft, OT command execution or destructive payload deployment.
4. **Effect and narrative:** operational disruption, data destruction and selective amplification through fronts or hacktivist personas.

Not every intrusion progresses through all four layers. Analysts should identify the observed layer before projecting the actor's objective.

## Defensive priorities

- Treat internet-facing management and collaboration systems as strategic assets. Maintain rapid patching, exposure inventory and logs that survive appliance compromise.
- Hunt for post-exploitation persistence after patching. A fixed CVE does not remove a web shell, RMM agent, SSH key, Tor service or stolen credential.
- Baseline authorised remote-management tools, cloud-storage utilities and OpenSSH deployments. Alert on unapproved tenants, configurations and destinations rather than product names alone.
- Protect identity material held by edge systems and rotate credentials, keys and tokens after suspected compromise.
- Separate IT and OT trust boundaries, monitor administrative access to hypervisors and engineering workstations, and alert on unusual execution of native control-system utilities.
- Maintain tested offline recovery and destructive-attack playbooks. Recovery assumptions should include domain-wide deployment through Group Policy and loss of central management.
- Monitor personal and field devices used for sensitive messaging where policy and local law allow. Enterprise telemetry alone may not cover the collection path.

## Analytic limitations

APT44, Sandworm, Seashell Blizzard and other names are overlapping publisher-defined clusters, not mathematically identical sets. This profile uses APT44 as an evidence-led umbrella while retaining the wording and confidence of each source.

The public record is strongest for operations that produced visible disruption, legal action or extensive vendor reporting. Quiet intelligence collection is likely underrepresented. Historical malware association does not prove responsibility for a new incident, and destructive capability does not establish destructive intent in every compromise.

APT Notes records source-specific claims and does not independently attribute unattributed activity to the Russian government.
