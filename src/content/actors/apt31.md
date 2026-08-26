---
id: apt31
name: APT31
slug: apt31
created_at: 2026-08-26
modified_at: 2026-08-26
version: 1.0.0
change_reason: Initial source-backed public profile.
summary: A China state-affiliated cyberespionage actor associated in government and legal reporting with the Ministry of State Security and long-running targeting of political, government and strategically important commercial networks.
actor_types: [state-sponsored]
status: active
suspected_origins: [China]
motivations: [espionage, surveillance, credential-access, data-theft]
active_since: "2010"
last_observed: "2025"
confidence: high
last_reviewed: 2026-08-26
authors: [deividas-lis]
mission: Collect political, diplomatic, security, commercial and personal intelligence in support of Chinese state objectives, including activity directed at critics of the PRC and organisations holding strategically valuable technology or access.
current_assessment: APT31 remains a defensible government-attributed espionage actor, but its public record mixes intelligence assessments with unproven criminal allegations. Recent European attribution confirms continued government and diplomatic targeting without publishing enough procedure detail to treat every historical cluster label as exactly equivalent.
parent_entities:
  - name: Hubei State Security Department, Chinese Ministry of State Security
    entity_type: Chinese provincial state-security department
    relationship: alleged programme operator
    confidence: high
    source: doj-apt31-2024
    notes: The US Department of Justice alleges that the charged defendants operated as part of an APT31 programme run by this department. The allegation has not been adjudicated.
aliases:
  - name: Zirconium
    source: Czech National Cyber and Information Security Agency
    relationship: common-alias
    confidence: high
    scope: Public designation identified by NUKIB as another name for APT31.
    first_seen: "historical"
    last_seen: "2025"
    notes: Publisher boundaries may differ across individual campaigns.
  - name: Judgment Panda
    source: Czech National Cyber and Information Security Agency
    relationship: common-alias
    confidence: high
    scope: Public designation identified by NUKIB as another name for APT31.
    first_seen: "historical"
    last_seen: "2025"
    notes: Retained as a search pivot rather than proof that every vendor record is identical.
subclusters: []
attribution:
  - claim: Czech authorities concluded that the PRC was behind the long-running Czech Ministry of Foreign Affairs campaign and assessed that it was most likely conducted through APT31.
    attributed_entity: People's Republic of China and APT31
    source: nukib-apt31-czech-mfa-2025
    source_type: government
    published_at: 2025-05-28
    confidence: high
    status: assessed
    notes: The record preserves NUKIB's distinction between the state attribution and its most-likely actor assessment.
  - claim: The NCSC assessed that APT31 was almost certainly responsible for online reconnaissance against UK parliamentarians' email accounts in 2021.
    attributed_entity: APT31
    source: uk-apt31-2024
    source_type: government
    published_at: 2024-03-25
    confidence: high
    status: assessed
    notes: The UK attributed the Electoral Commission compromise to a separate China state-affiliated actor, not to APT31.
  - claim: The United States alleges that APT31 formed part of a cyberespionage programme run by the Ministry of State Security's Hubei State Security Department.
    attributed_entity: Hubei State Security Department, Chinese Ministry of State Security
    source: doj-apt31-2024
    source_type: legal
    published_at: 2024-03-25
    confidence: high
    status: reported
    notes: These are indictment allegations. The defendants are presumed innocent unless proven guilty.
targeting:
  regions: [Europe, North America, Global]
  countries: [Czech Republic, United Kingdom, United States]
  sectors: [Government, Politics, Diplomacy, Defence, Information Technology, Telecommunications, Managed Services, Finance, Legal Services, Research]
  organisations: [Czech Ministry of Foreign Affairs, Inter-Parliamentary Alliance on China]
campaigns: [apt31-global-intrusion-program]
malware: []
tools: []
techniques: [phishing, remote-email-collection]
vulnerabilities: []
technique_evidence:
  - technique: phishing
    campaign: apt31-global-intrusion-program
    first_observed: "2010 or later"
    last_observed: "2024 reporting"
    confidence: high
    sources: [doj-apt31-2024]
    notes: The indictment announcement alleges that more than 10,000 targeted emails contained hidden tracking links which disclosed recipient, device and network information when messages were opened.
  - technique: remote-email-collection
    campaign: apt31-global-intrusion-program
    first_observed: "2010 or later"
    last_observed: "2024 reporting"
    confidence: high
    sources: [doj-apt31-2024]
    notes: US legal reporting alleges successful access to email and cloud accounts, with surveillance of some compromised mailboxes continuing for years.
operational_timeline:
  - date: "2010-2024 reporting"
    title: United States describes a long-running global intrusion programme
    summary: The Justice Department alleges that APT31 operators sent more than 10,000 malicious emails and compromised political, government, technology and commercial targets in support of Ministry of State Security objectives.
    confidence: high
    sources: [doj-apt31-2024]
  - date: "2021"
    title: UK parliamentarian email accounts targeted
    summary: The NCSC assessed that APT31 conducted online reconnaissance against parliamentarians who had been prominent critics of the PRC.
    confidence: high
    sources: [uk-apt31-2024]
  - date: "2022-2025"
    title: Czech MFA campaign receives national attribution
    summary: Czech authorities attributed a long-running compromise of an unclassified Ministry of Foreign Affairs network to the PRC and assessed that APT31 most likely conducted it.
    confidence: high
    sources: [nukib-apt31-czech-mfa-2025, eu-apt31-czechia-2025]
external_identifiers:
  mitre_attack: G0128
  other: [APT31, Zirconium, Judgment Panda]
related_research: []
sources: [nukib-apt31-czech-mfa-2025, eu-apt31-czechia-2025, uk-apt31-2024, doj-apt31-2024]
updates: [apt31-profile-created]
featured: true
draft: false
---

## Analytic scope

APT Notes uses APT31 for activity that governments explicitly assign to that actor or that legal reporting describes as part of the alleged APT31 programme. Zirconium and Judgment Panda are retained as search pivots, but shared infrastructure, targeting or tooling does not by itself make every vendor cluster coextensive with this record.

## Attribution boundary

The public record has three different evidentiary layers. Czech and UK authorities published intelligence assessments about specific campaigns. The European Union supported Czechia and restated its determination, but did not publish a separate technical investigation. The United States indictment provides extensive alleged procedure and organisational detail, but it is a charging document rather than a finding of guilt.

The UK explicitly attributed the Electoral Commission compromise to a separate China state-affiliated actor. It is therefore excluded from the APT31 campaign record.

## Operational model

The alleged programme used targeted email as both reconnaissance and an access-enablement step. Hidden links could disclose a recipient's IP address, device and network context when a message was opened. Operators could then focus more intrusive activity on selected people, home routers and organisational systems. Public legal reporting also describes long-lived access to email and cloud information.

This creates an important analytical distinction: receipt or opening of a tracking message can represent collection even when no payload executes, while a subsequent router or account compromise is a separate, higher-confidence stage that needs its own evidence.

## Current European picture

The 2025 Czech attribution shows that APT31 remains relevant to European diplomatic networks. NUKIB states that the campaign affected one unclassified Czech MFA network from at least 2022. The publication identifies the PRC as responsible and APT31 as the most likely actor while leaving the technical intrusion chain undisclosed.

The Czech case complements the UK's 2024 disclosure of 2021 reconnaissance against parliamentarians. Together they support persistent political and diplomatic collection, not a claim that every China-linked intrusion in Europe belongs to APT31.

## Defensive priorities

- Protect high-risk political, diplomatic and research identities with phishing-resistant authentication and hardened personal as well as managed devices.
- Treat tracking-link telemetry as an early-stage exposure signal; rotate exposed infrastructure details and inspect follow-on authentication, router and cloud activity.
- Inventory home and small-office routers used by privileged personnel, remove unsupported devices and restrict remote management.
- Retain email security, identity, cloud audit and network records long enough to connect low-volume reconnaissance with later targeted access.
- Evaluate service providers, legal advisers and research partners as possible routes to the primary intelligence target.

## Analytic limitations

The Czech attribution did not publish exploit, malware or infrastructure details. The US procedure evidence is alleged conduct, and the defendants remain presumed innocent. The profile therefore records broad techniques only where the public source describes the procedure and does not infer an internet-facing-service technique, invent vulnerability identifiers or add unsupported malware relationships.
