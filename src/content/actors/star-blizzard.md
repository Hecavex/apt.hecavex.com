---
id: star-blizzard
name: Star Blizzard
slug: star-blizzard
created_at: 2026-08-26
modified_at: 2026-08-26
version: 1.0.0
change_reason: Initial source-backed actor dossier published.
summary: An FSB Centre 18-linked espionage cluster using researched impersonation, credential phishing and account access against government, defence, civil-society and Ukraine-related targets.
actor_types: [state-sponsored, influence-operation]
status: uncertain
suspected_origins: [Russia]
motivations: [espionage, influence, credential-access, data-theft]
active_since: "at least 2016 in selected public reporting"
last_observed: "2024-11"
confidence: high
last_reviewed: 2026-08-26
authors: [deividas-lis]
mission: Obtain politically and strategically useful communications through tailored social engineering, credential theft and account access, with selected stolen material later used in influence activity.
current_assessment: The last actor-specific first-party observation in this source set is Microsoft's limited WhatsApp campaign in November 2024. That campaign appeared to have wound down by month-end, although Microsoft described the actor as resilient after infrastructure disruption. The dossier does not claim observed activity in 2026.
parent_entities:
  - name: FSB Centre 18
    entity_type: Russian Federal Security Service unit
    relationship: assessed subordinate actor
    confidence: high
    source: ncsc-star-blizzard-2023
    notes: The NCSC and international partners assess that Star Blizzard is almost certainly subordinate to FSB Centre 18.
aliases:
  - name: SEABORGIUM
    source: UK NCSC and international partners
    relationship: historical-designation
    confidence: high
    scope: Former name for the activity publicly designated Star Blizzard.
    first_seen: "historical reporting"
    last_seen: "2023 naming transition"
    notes: Retained for discovery of older reporting.
  - name: Callisto Group
    source: UK NCSC and US Department of Justice
    relationship: government-designation
    confidence: high
    scope: Government and legal designation associated with FSB Centre 18 activity.
    first_seen: "2016 alleged activity"
    last_seen: "2024 legal action"
    notes: DOJ claims concerning named defendants and alleged co-conspirators must not be extended automatically to every artifact carrying another alias.
  - name: COLDRIVER
    source: UK NCSC and US Department of Justice
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Industry tracking cluster explicitly listed as an overlapping name in government reporting.
    first_seen: "historical reporting"
    last_seen: "2025 reporting"
    notes: Reported overlap does not make every provider's complete historical dataset coextensive.
  - name: TA446
    source: UK NCSC and international partners
    relationship: vendor-tracking-cluster
    confidence: moderate
    scope: Industry label listed in the multinational advisory.
    first_seen: "historical reporting"
    last_seen: "2023 advisory"
    notes: Preserved as a search pivot rather than an exact cross-vendor equivalence claim.
  - name: TAG-53
    source: UK NCSC and international partners
    relationship: vendor-tracking-cluster
    confidence: moderate
    scope: Industry label listed in the multinational advisory.
    first_seen: "historical reporting"
    last_seen: "2023 advisory"
    notes: Preserved as a search pivot rather than an exact cross-vendor equivalence claim.
  - name: BlueCharlie
    source: UK NCSC and international partners
    relationship: vendor-tracking-cluster
    confidence: moderate
    scope: Industry label listed in the multinational advisory.
    first_seen: "historical reporting"
    last_seen: "2023 advisory"
    notes: Preserved as a search pivot rather than an exact cross-vendor equivalence claim.
attribution:
  - claim: The NCSC and international partners assess that Star Blizzard is almost certainly subordinate to Russia's FSB Centre 18.
    attributed_entity: FSB Centre 18
    source: ncsc-star-blizzard-2023
    source_type: government
    published_at: 2023-12-07
    confidence: high
    status: assessed
    notes: This multinational government assessment is the primary identity statement for the dossier.
  - claim: A US indictment alleges that two named defendants and other conspirators conducted a Callisto Group intrusion campaign on behalf of the Russian government.
    attributed_entity: Callisto Group associated with FSB Centre 18
    source: doj-star-blizzard-2023
    source_type: legal
    published_at: 2023-12-07
    confidence: high
    status: reported
    notes: This records the allegation and label mapping. An indictment is not a conviction, and all defendants are presumed innocent unless proven guilty.
targeting:
  regions: [Europe, North America]
  countries: [United Kingdom, United States, Ukraine, NATO member states, Countries neighbouring Russia]
  sectors: [Government, Politics, Diplomacy, Defence, Defence industry, Academia, Think tanks, NGOs, Journalism, Civil society, Energy, Information Security, Ukraine support]
  organisations: []
campaigns: [star-blizzard-credential-spearphishing, star-blizzard-whatsapp-device-linking]
malware: []
tools: [evilginx]
techniques: [spearphishing-link, spearphishing-attachment, adversary-in-the-middle, web-session-cookie, valid-accounts, remote-email-collection]
vulnerabilities: []
technique_evidence:
  - technique: spearphishing-link
    campaign: star-blizzard-credential-spearphishing
    first_observed: "documented by 2023-12-07"
    last_observed: "2023-12-07 reporting"
    confidence: high
    sources: [ncsc-star-blizzard-2023]
    notes: After researched rapport-building, the actor sent links to actor-controlled infrastructure that prompted targets for account credentials.
  - technique: spearphishing-attachment
    campaign: star-blizzard-credential-spearphishing
    first_observed: "documented by 2023-12-07"
    last_observed: "2023-12-07 reporting"
    confidence: high
    sources: [ncsc-star-blizzard-2023]
    notes: The multinational advisory describes links embedded in documents shared through cloud file-hosting services.
  - technique: adversary-in-the-middle
    campaign: star-blizzard-credential-spearphishing
    first_observed: "documented by 2023-12-07"
    last_observed: "2023-12-07 reporting"
    confidence: high
    sources: [ncsc-star-blizzard-2023]
    notes: Star Blizzard used Evilginx to proxy authentication flows and capture credentials and session material.
  - technique: web-session-cookie
    campaign: star-blizzard-credential-spearphishing
    first_observed: "documented by 2023-12-07"
    last_observed: "2023-12-07 reporting"
    confidence: high
    sources: [ncsc-star-blizzard-2023]
    notes: Evilginx supported session-cookie theft capable of bypassing conventional two-factor authentication after successful phishing.
  - technique: valid-accounts
    campaign: star-blizzard-credential-spearphishing
    first_observed: "2016 alleged activity"
    last_observed: "documented through 2023-12-07 advisory"
    confidence: high
    sources: [ncsc-star-blizzard-2023, doj-star-blizzard-2023]
    notes: Government reporting describes use of stolen credentials to access victim email accounts; DOJ's 2016-2022 procedure claims remain allegations.
  - technique: remote-email-collection
    campaign: star-blizzard-credential-spearphishing
    first_observed: "documented by 2023-12-07"
    last_observed: "2023-12-07 reporting"
    confidence: high
    sources: [ncsc-star-blizzard-2023]
    notes: The actor accessed email and attachments and established forwarding rules after account compromise.
  - technique: spearphishing-link
    campaign: star-blizzard-whatsapp-device-linking
    first_observed: "2024-11"
    last_observed: "2024-11"
    confidence: high
    sources: [microsoft-star-blizzard-whatsapp-2025]
    notes: A follow-up email used a shortened link leading to a QR code that linked the victim's WhatsApp account to an actor-controlled device.
operational_timeline:
  - date: "2016-2022"
    title: Callisto intrusion conspiracy alleged
    summary: A US indictment alleges spoofed accounts, false provider notices, credential theft and email access against US, UK, NATO and Ukraine-related targets.
    confidence: high
    sources: [doj-star-blizzard-2023]
  - date: "2019-2023"
    title: Multinational advisory documents mature spearphishing chain
    summary: The public procedure spans researched impersonation, rapport-building, credential and session theft, mailbox access and follow-on targeting.
    confidence: high
    sources: [ncsc-star-blizzard-2023]
  - date: "2023-01 to 2024-08"
    title: Civil-society targeting remains visible
    summary: Microsoft reported more than 30 journalists, think tanks and NGOs targeted during this bounded observation period.
    confidence: high
    sources: [microsoft-star-blizzard-whatsapp-2025]
  - date: "2024-11"
    title: Limited WhatsApp device-linking campaign
    summary: Microsoft observed a new QR-based linked-device access vector in mid-November and reported that the campaign appeared to end by month-end.
    confidence: high
    sources: [microsoft-star-blizzard-whatsapp-2025]
external_identifiers:
  mitre_attack: ""
  other: [SEABORGIUM, Callisto Group, COLDRIVER]
related_research: []
sources: [ncsc-star-blizzard-2023, doj-star-blizzard-2023, microsoft-star-blizzard-whatsapp-2025]
updates: [star-blizzard-profile-created]
featured: true
draft: false
---

## Analytic scope

This dossier uses Star Blizzard as the canonical label because it is the name used by the multinational NCSC advisory. The source explicitly lists SEABORGIUM, Callisto Group, TA446, COLDRIVER, TAG-53 and BlueCharlie, but those mappings are retained with their source and relationship type. They are not a licence to combine every provider's entire historical dataset.

The government attribution and the US criminal case are also different evidence classes. The NCSC and partners make an intelligence assessment that the actor is almost certainly subordinate to FSB Centre 18. The Department of Justice records allegations against named defendants and other alleged conspirators. The latter is not presented as a conviction.

## Mission and operational model

Star Blizzard's public centre of gravity is access to communications held by people with political, diplomatic, defence, research or civil-society relevance. The actor researches a target's interests and relationships, impersonates a credible contact, builds rapport and only then introduces the credential lure.

The recurring operational path is:

1. collect personal and professional context from open sources;
2. create an impersonating email account, persona or lookalike domain;
3. establish benign correspondence around a plausible shared interest;
4. deliver a link directly or through a document and legitimate cloud service;
5. capture credentials and, in some operations, authenticated session material;
6. access email, attachments, contacts and forwarding settings; and
7. use compromised relationships for additional targeting or, in selected cases, leak obtained material.

## European targeting

The UK and US were the most affected geographies in the 2023 NCSC advisory, with additional activity against other NATO countries and states neighbouring Russia. The DOJ indictment separately alleges targeting of UK military and government officials, think-tank staff and journalists, and alleges that information from selected accounts was leaked before the 2019 UK election.

Those examples establish a strong European and democratic-institution focus. They do not establish a victim in every NATO country, and the selected sources do not support a Lithuania-specific targeting claim.

## Technique assessment

The actor's sophistication lies less in novel malware than in careful social engineering and authentication abuse. Evilginx is the only named offensive framework in the core government procedure. Legitimate webmail, cloud storage, URL-shortening and redirect services are infrastructure or delivery services, not proprietary Star Blizzard tools.

The November 2024 campaign changed the destination rather than the social model. A deliberately unusable QR code encouraged a reply, after which the actor sent a link to a page presenting a WhatsApp device-linking QR code. Successful scanning would link another device to the account and expose messages without requiring conventional mailbox credential theft.

## Status and freshness

The most recent actor-specific observation in this dossier is mid-November 2024. Microsoft said that the limited WhatsApp campaign appeared to have wound down by the end of that month, while also describing rapid infrastructure replacement after disruption. That is evidence of resilience at the time, not proof of activity in August 2026.

## Defensive priorities

- Protect personal as well as corporate accounts used by high-risk individuals with phishing-resistant authentication.
- Verify unexpected correspondence through a known channel before opening shared documents or following account prompts.
- Monitor new forwarding rules, unusual mailbox access, linked messaging devices and changes to recovery information.
- Revoke sessions as well as changing passwords after suspected adversary-in-the-middle phishing.
- Preserve the full redirect chain and authentication telemetry; a legitimate shortener or cloud host in the path is not a benign verdict.

## Analytic limitations

Public victim coverage is incomplete. Legal claims remain allegations, vendor visibility is bounded to observed telemetry, and an alias match alone does not prove campaign identity. The dossier therefore separates government assessment, legal reporting and Microsoft campaign observation instead of converting them into one undifferentiated attribution statement.
