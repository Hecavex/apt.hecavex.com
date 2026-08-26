---
id: midnight-blizzard
name: Midnight Blizzard
slug: midnight-blizzard
created_at: 2026-08-26
modified_at: 2026-08-26
version: 1.0.0
change_reason: Initial source-backed actor dossier published.
summary: A Russian SVR-linked espionage actor using cloud identity abuse, credential attacks, supply-chain access and targeted phishing against government, diplomatic, technology and civil-society targets.
actor_types: [state-sponsored]
status: uncertain
suspected_origins: [Russia]
motivations: [espionage, credential-access, data-theft]
active_since: "at least 2018 in selected public reporting"
last_observed: "2024-10"
confidence: high
last_reviewed: 2026-08-26
authors: [deividas-lis]
mission: Collect foreign intelligence through persistent access to identities, cloud tenants, trusted technology relationships and strategically relevant organisations.
current_assessment: Government and Microsoft reporting shows a persistent actor that adapted from on-premises and supply-chain access to cloud identity operations and novel RDP-file phishing. The latest actor-specific observation in this source set began on 22 October 2024 and was ongoing when Microsoft published on 29 October 2024; the dossier does not assert activity in 2026.
parent_entities:
  - name: Foreign Intelligence Service of the Russian Federation
    entity_type: Russian civilian foreign intelligence service
    relationship: assessed sponsoring service
    confidence: high
    source: ncsc-apt29-cloud-2024
    notes: The NCSC and international partners assess APT29 is almost certainly part of the SVR.
aliases:
  - name: APT29
    source: UK NCSC and international partners
    relationship: government-designation
    confidence: high
    scope: Government designation used for the SVR-linked espionage actor described in the cloud-access advisory.
    first_seen: "historical reporting"
    last_seen: "2024 advisory"
    notes: Canonical government name for the attribution statement used by this dossier.
  - name: The Dukes
    source: UK NCSC and international partners
    relationship: common-alias
    confidence: high
    scope: Common public designation listed in the multinational advisory.
    first_seen: "historical reporting"
    last_seen: "2024 advisory"
    notes: Retained for discovery of older reporting.
  - name: Cozy Bear
    source: UK NCSC, international partners and Microsoft
    relationship: common-alias
    confidence: high
    scope: Widely used designation for activity overlapping the APT29 and Midnight Blizzard records.
    first_seen: "historical reporting"
    last_seen: "2024 reporting"
    notes: Individual publishers may apply different historical cluster boundaries.
  - name: NOBELIUM
    source: Microsoft Threat Intelligence
    relationship: historical-designation
    confidence: high
    scope: Microsoft's former tracking name for the actor now called Midnight Blizzard.
    first_seen: "historical Microsoft reporting"
    last_seen: "2023 naming transition"
    notes: Retained for search and historical tool reporting.
  - name: UNC2452
    source: Microsoft Threat Intelligence
    relationship: vendor-tracking-cluster
    confidence: moderate
    scope: Peer-vendor tracking cluster that Microsoft lists as identifying overlapping activity.
    first_seen: "historical reporting"
    last_seen: "2024 reporting"
    notes: A mapping between analytic clusters is not proof that every publisher's historical record is identical.
attribution:
  - claim: The NCSC and international partners assess that APT29 is a cyber espionage group almost certainly part of Russia's SVR.
    attributed_entity: Foreign Intelligence Service of the Russian Federation
    source: ncsc-apt29-cloud-2024
    source_type: government
    published_at: 2024-02-26
    confidence: high
    status: assessed
    notes: This multinational government assessment is the primary identity statement for the dossier.
  - claim: Microsoft identifies Midnight Blizzard as the Russian actor attributed by the US and UK governments to the SVR and lists APT29, UNC2452 and Cozy Bear as peer names.
    attributed_entity: Foreign Intelligence Service of the Russian Federation
    source: microsoft-apt29-rdp-2024
    source_type: vendor-research
    published_at: 2024-10-29
    confidence: high
    status: reported
    notes: Microsoft's campaign attribution and alias mapping are preserved as vendor reporting, not treated as a substitute for the government assessment.
targeting:
  regions: [Europe, North America, Asia-Pacific, Central Asia]
  countries: [United Kingdom, United States, Canada]
  sectors: [Government, Diplomacy, Defence, Military, Think tanks, NGOs, Intergovernmental organisations, Information Technology, Technology, Education, Aviation, Law enforcement, Local government, Government finance, Healthcare, Energy]
  organisations: []
campaigns: [midnight-blizzard-cloud-access, midnight-blizzard-rdp-spearphishing]
malware: []
tools: []
techniques: [password-spraying, valid-accounts, steal-application-access-token, spearphishing-attachment, data-from-local-system]
vulnerabilities: []
technique_evidence:
  - technique: password-spraying
    campaign: midnight-blizzard-cloud-access
    first_observed: "observed within 12 months before 2024-02-26"
    last_observed: "2024-02-26 reporting"
    confidence: high
    sources: [ncsc-apt29-cloud-2024]
    notes: The NCSC and partners describe password spraying and brute force against service and personal accounts as cloud initial-access procedures.
  - technique: valid-accounts
    campaign: midnight-blizzard-cloud-access
    first_observed: "observed within 12 months before 2024-02-26"
    last_observed: "2024-02-26 reporting"
    confidence: high
    sources: [ncsc-apt29-cloud-2024]
    notes: The actor used compromised cloud credentials, including service and dormant accounts, and could regain access through inactive accounts after incident-response resets.
  - technique: steal-application-access-token
    campaign: midnight-blizzard-cloud-access
    first_observed: "observed within 12 months before 2024-02-26"
    last_observed: "2024-02-26 reporting"
    confidence: high
    sources: [ncsc-apt29-cloud-2024]
    notes: The multinational advisory explicitly reports stolen system-issued access tokens being used without the account password.
  - technique: spearphishing-attachment
    campaign: midnight-blizzard-rdp-spearphishing
    first_observed: "2024-10-22"
    last_observed: "ongoing when reported 2024-10-29"
    confidence: high
    sources: [microsoft-apt29-rdp-2024]
    notes: Thousands of recipients across more than 100 organisations received targeted lures carrying signed RDP configuration files.
  - technique: data-from-local-system
    campaign: midnight-blizzard-rdp-spearphishing
    first_observed: "2024-10-22"
    last_observed: "ongoing when reported 2024-10-29"
    confidence: high
    sources: [microsoft-apt29-rdp-2024]
    notes: The malicious RDP configuration exposed mapped local files, drives, clipboard data, peripherals and authentication capabilities to an actor-controlled server; this records configured exposure, not proof every item was retrieved.
operational_timeline:
  - date: "2020"
    title: Vaccine targeting and SolarWinds supply-chain compromise
    summary: Government reporting identifies APT29 or SVR actors with COVID-19 vaccine-development targeting and the SolarWinds software supply-chain compromise.
    confidence: high
    sources: [ncsc-apt29-cloud-2024]
  - date: "2023-2024"
    title: Cloud initial access adapts to identity controls
    summary: The multinational advisory records service and dormant account targeting, token theft, MFA prompt abuse, device registration and residential-proxy use during the preceding 12 months.
    confidence: high
    sources: [ncsc-apt29-cloud-2024]
  - date: "2024-10-22"
    title: Large-scale RDP-file spearphishing begins
    summary: Microsoft observed targeted emails sent to thousands of recipients in more than 100 organisations using signed RDP files and cloud-security-themed lures.
    confidence: high
    sources: [microsoft-apt29-rdp-2024]
  - date: "2024-10-29"
    title: RDP campaign disclosed while investigation continued
    summary: Microsoft described the operation as ongoing on publication day and highlighted government, higher-education, defence and NGO targeting, particularly in the UK and Europe.
    confidence: high
    sources: [microsoft-apt29-rdp-2024]
external_identifiers:
  mitre_attack: ""
  other: [APT29, NOBELIUM, Cozy Bear]
related_research: []
sources: [ncsc-apt29-cloud-2024, microsoft-apt29-rdp-2024]
updates: [midnight-blizzard-profile-created]
featured: true
draft: false
---

## Analytic scope

APT Notes uses Midnight Blizzard as the canonical publication name and preserves APT29 as the principal government designation. The NCSC advisory also lists the Dukes and Cozy Bear. Microsoft lists NOBELIUM as its former name and cites APT29, UNC2452 and Cozy Bear as peer designations.

These mappings align substantial bodies of activity, but they do not make every provider's historic cluster boundary identical. Campaign evidence is therefore attached to the name used by the publisher and promoted to the actor dossier only when the source makes the relationship explicit.

## Attribution boundary

The NCSC and international partners assess that APT29 is almost certainly part of the Russian Foreign Intelligence Service, the SVR. Microsoft uses that US and UK government attribution when describing Midnight Blizzard. This dossier preserves the government assessment as its primary attribution and Microsoft's campaign telemetry as a separate evidence class.

No actor-specific Department of Justice prosecution or disruption record was identified in the bounded source set, so the dossier does not manufacture a legal record by analogy with other Russian actors.

## Mission and operational model

The public objective is persistent foreign-intelligence collection. Access methods span stolen credentials, password spraying, exploitation of on-premises systems, cloud identity abuse, trusted-provider or supply-chain relationships and highly targeted social engineering.

The cloud-access advisory shows adaptation to modern identity controls:

1. target service and dormant accounts that may have weak governance;
2. reuse credentials or spray passwords across selected identities;
3. use stolen application tokens to avoid password authentication;
4. pressure users with repeated MFA prompts;
5. register an actor-controlled device after access; and
6. use residential proxies to blend authentication traffic with normal users.

The October 2024 RDP operation introduced a distinct delivery path. A signed RDP configuration attachment connected the target to actor infrastructure and mapped local resources, potentially exposing files, clipboard data, peripherals and authentication facilities.

## European targeting

The RDP campaign targeted dozens of countries, particularly the United Kingdom and Europe, as well as Australia and Japan. Microsoft reported government, higher-education, defence and NGO targets. The NCSC separately records government, think-tank, healthcare and energy targeting and an expansion into aviation, education, law enforcement, local and state councils, government finance and military organisations.

This supports a strong European relevance assessment. It does not support a Lithuania-specific victim claim, and infrastructure or lure names should not be converted into victim-country assertions without corroboration.

## Tool and capability boundary

Microsoft identifies FoggyWeb and MagicWeb as AD FS post-compromise capabilities associated with the actor. They are important historical context, but neither is an initial-access mechanism. This initial dossier does not create standalone malware records without their dedicated source records.

Likewise, an RDP configuration file is a delivery artifact and connection definition, not a named malware family. The campaign could enable additional payload deployment, but possibility is not recorded as observed malware installation.

## Status and freshness

Microsoft called the RDP operation ongoing on 29 October 2024. That wording is bounded to publication day. No selected primary source advances the actor-specific observation date into 2025 or 2026, so the public status is marked uncertain rather than silently extrapolated.

## Defensive priorities

- Remove dormant identities and tightly scope service accounts that cannot use phishing-resistant authentication.
- Monitor token use, device registration, authentication-method changes and sign-ins from newly observed residential networks together rather than as isolated indicators.
- Rate-limit and correlate distributed password spraying across accounts and source infrastructure.
- Restrict unsolicited outbound RDP connections and treat unexpected RDP attachments as executable access requests, even when signed.
- Investigate unusual local resource redirection, clipboard mapping and RDP connections to public infrastructure.
- Protect identity infrastructure such as AD FS as a tier-zero system and assume post-compromise tools require prior privileged access.

## Analytic limitations

Government and Microsoft reports describe bounded observation windows, not a complete operational history. Broad alias overlap does not prove every historical campaign belongs inside the same cluster. Target lists are documented examples rather than exhaustive coverage, and a campaign described as ongoing in October 2024 cannot be labelled ongoing in August 2026 without newer evidence.
