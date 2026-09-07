---
id: apt28
name: APT28
slug: apt28
created_at: 2026-08-05
modified_at: 2026-09-07
version: 2.1.0
change_reason: Added six AI-assisted procedure source comparisons and separated observed activity from publication dates. Independent human review remains unrecorded.
summary: A Russian military intelligence intrusion set associated with GRU Unit 26165 and persistent espionage against governments, defence, logistics, technology, identity systems and organisations supporting Ukraine.
actor_types: [state-sponsored]
status: active
suspected_origins: [Russia]
motivations: [espionage, credential-access, data-theft]
active_since: "2004"
last_observed: "2026"
confidence: high
last_reviewed: 2026-08-26
authors: [deividas-lis]
mission: Collect strategic and military intelligence in support of Russian government foreign-policy and operational objectives, with recurring emphasis on identity, email, defence, logistics and Ukraine-related networks.
current_assessment: APT28 remains an active, adaptive espionage actor. Its recent operations combine rapid client-side exploitation, long-term mailbox access and compromised edge infrastructure that can expose authentication flows before traffic reaches an organisation's managed boundary.
parent_entities:
  - name: GRU 85th Main Special Service Centre, Military Unit 26165
    entity_type: Russian military intelligence unit
    relationship: attributed operator
    confidence: high
    source: ncsc-apt28-dns-2026
    notes: The NCSC assesses APT28 is almost certainly the GRU 85th GTsSS, Military Unit 26165.
aliases:
  - name: Fancy Bear
    source_refs:
      - source: ncsc-apt28-dns-2026
        locator: "Find the literal name \"Fancy Bear\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: Industry and government reporting
    relationship: common-alias
    confidence: high
    scope: Broad public designation for activity associated with APT28.
    first_seen: "2014"
    last_seen: "2026"
    notes: Widely used, but individual publishers may apply different cluster boundaries.
  - name: Forest Blizzard
    source_refs:
      - source: ncsc-apt28-dns-2026
        locator: "Find the literal name \"Forest Blizzard\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: Microsoft
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Microsoft cluster overlapping APT28 and Unit 26165 activity.
    first_seen: "2023 naming"
    last_seen: "2026"
    notes: Previously tracked by Microsoft as STRONTIUM.
  - name: Sednit
    source_refs:
      - source: ncsc-apt28-dns-2026
        locator: "Find the literal name \"Sednit\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: ESET
    relationship: vendor-tracking-cluster
    confidence: high
    scope: ESET tracking designation used for overlapping activity and tooling.
    first_seen: "historical"
    last_seen: "2025"
    notes: Operation RoundPress is linked to Sednit with medium, not high, confidence.
  - name: Sofacy
    source_refs:
      - source: ncsc-apt28-dns-2026
        locator: "Find the literal name \"Sofacy\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: Industry reporting
    relationship: historical-designation
    confidence: high
    scope: Historical designation used for both actor activity and associated malware in some reporting.
    first_seen: "historical"
    last_seen: "2026"
    notes: Ambiguous usage requires source context.
  - name: STRONTIUM
    source_refs:
      - source: ncsc-apt28-dns-2026
        locator: "Find the literal name \"STRONTIUM\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: Microsoft
    relationship: historical-designation
    confidence: high
    scope: Former Microsoft tracking name now replaced by Forest Blizzard.
    first_seen: "historical"
    last_seen: "2023"
    notes: Retained for searching older reporting.
  - name: Pawn Storm
    source_refs:
      - source: doj-operation-masquerade-2026
        locator: "Find the literal name \"Pawn Storm\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: Trend Micro
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Vendor cluster with broad overlap to APT28.
    first_seen: "historical"
    last_seen: "2026"
    notes: Do not assume exact campaign boundaries match other vendors.
  - name: FROZENLAKE
    source_refs:
      - source: gtig-promptsteal-2025
        locator: "Find the literal name \"FROZENLAKE\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: Google Threat Intelligence Group
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Google tracking designation overlapping APT28.
    first_seen: "historical"
    last_seen: "2025"
    notes: Used by GTIG in reporting on PROMPTSTEAL.
  - name: BlueDelta
    source_refs:
      - source: cisa-aa25-141a
        locator: "Find the literal name \"BlueDelta\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: Recorded Future
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Vendor designation referenced in joint government reporting.
    first_seen: "historical"
    last_seen: "2025"
    notes: Recorded as an overlapping industry cluster.
  - name: GruesomeLarch
    source_refs:
      - source: volexity-nearest-neighbor-2024
        locator: "Find the literal name \"GruesomeLarch\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: Volexity
    relationship: vendor-tracking-cluster
    confidence: high
    scope: Volexity designation used for the Nearest Neighbor investigation.
    first_seen: "2022 activity"
    last_seen: "2024"
    notes: High-confidence attribution within Volexity's investigated incident.
subclusters:
  - name: Storm-2754
    source_refs:
      - source: microsoft-soho-dns-2026
        locator: "Find the literal name \"Storm-2754\" in the publication. This establishes that the name is mentioned, not identical cluster boundaries."
        basis: source-mentions-name
        checked_at: "2026-09-07"
    source: Microsoft
    relationship: subgroup
    confidence: high
    notes: Microsoft describes Storm-2754 as a component or sub-group associated with Forest Blizzard's router and DNS activity, not as a synonym for all APT28 operations.
attribution:
  - claim: The NCSC assesses that APT28 is almost certainly the GRU 85th Main Special Service Centre, Military Unit 26165.
    attributed_entity: GRU 85th GTsSS, Military Unit 26165
    source: ncsc-apt28-dns-2026
    source_type: government
    published_at: 2026-04-07
    confidence: high
    status: assessed
    notes: This is the current UK government assessment and the primary identity statement used by APT Notes.
  - claim: A joint multinational advisory attributes the western logistics and technology campaign to GRU Unit 26165.
    attributed_entity: GRU Unit 26165
    source: cisa-aa25-141a
    source_type: government
    published_at: 2025-05-21
    confidence: high
    status: reported
    notes: The advisory cautions that industry tracking names may not correlate one-to-one with the government's activity grouping.
  - claim: The United States disrupted a router botnet used by Unit 26165 to conceal credential-harvesting operations.
    attributed_entity: GRU Unit 26165
    source: doj-soho-botnet-2024
    source_type: legal
    published_at: 2024-02-15
    confidence: high
    status: confirmed
    notes: The legal action establishes the government's attribution for the disrupted infrastructure, not every campaign using compromised routers.
  - claim: ThreatLabz attributes Operation Neusploit to APT28 with high confidence based on victimology and overlapping tools, infrastructure and techniques.
    attributed_entity: APT28
    source: zscaler-operation-neusploit
    source_type: vendor-research
    published_at: 2026-02-02
    confidence: high
    status: assessed
    notes: Vendor assessment for this campaign; it is not presented as a government attribution.
  - claim: ESET assesses with medium confidence that Operation RoundPress was conducted by Sednit.
    attributed_entity: Sednit
    source: eset-operation-roundpress-2025
    source_type: vendor-research
    published_at: 2025-05-15
    confidence: moderate
    status: assessed
    notes: The lower campaign-specific confidence is preserved despite broad high-confidence overlap between Sednit and APT28.
targeting:
  regions: [Europe, North America, Africa, South America]
  countries: [Ukraine, Poland, Romania, Slovakia, Bulgaria, Germany, France, United Kingdom, United States]
  sectors: [Government, Defence, Military, Diplomacy, Logistics, Transportation, Maritime, Air Traffic Management, Information Technology, Telecommunications, Energy, NGOs, Research, Education]
  organisations: []
campaigns: [apt28-dns-hijacking, operation-neusploit, western-logistics-targeting, operation-roundpress, nearest-neighbor, outlook-identity-collection, promptsteal-ukraine, cisco-router-reconnaissance]
malware: [authentic-antics, promptsteal, gooseegg, jaguar-tooth, spypress, headlace, masepie, minidoor, pixynetloader]
tools: [covenant-grunt]
techniques: [password-spraying, exploit-public-facing-application, adversary-in-the-middle, steal-application-access-token, spearphishing-attachment, spearphishing-link, valid-accounts, forced-authentication, exploit-client-execution, email-collection, remote-email-collection, com-hijacking, scheduled-task, powershell, video-capture]
vulnerabilities:
  - cve: CVE-2017-6742
    product: Cisco IOS and IOS XE
    role: Router initial access and Jaguar Tooth deployment
    campaign: cisco-router-reconnaissance
    first_observed: "2021"
    confidence: high
    source: ncsc-jaguar-tooth-2023
    notes: Exploitation of the SNMP subsystem on unpatched Cisco devices.
  - cve: CVE-2022-38028
    product: Microsoft Windows Print Spooler
    role: Post-compromise privilege escalation through GooseEgg
    campaign: nearest-neighbor
    first_observed: "2019–2020"
    confidence: high
    source: microsoft-gooseegg-2024
    notes: Microsoft observed use since at least June 2020 and possibly April 2019.
  - cve: CVE-2023-23397
    product: Microsoft Outlook for Windows
    role: Forced authentication and Net-NTLMv2 credential theft
    campaign: western-logistics-targeting
    first_observed: "2022"
    confidence: high
    source: microsoft-cve-2023-23397
    notes: Exploitation can occur without the user opening the crafted message.
  - cve: CVE-2023-38831
    product: RARLAB WinRAR
    role: Client-side initial access through crafted archives
    campaign: western-logistics-targeting
    first_observed: "2023"
    confidence: high
    source: cisa-aa25-141a
    notes: Used in spearphishing against Ukrainian and logistics-related targets.
  - cve: CVE-2023-43770
    product: Roundcube Webmail
    role: XSS execution inside the victim's webmail session
    campaign: operation-roundpress
    first_observed: "2023"
    confidence: moderate
    source: eset-operation-roundpress-2025
    notes: Campaign attribution remains medium confidence.
  - cve: CVE-2024-11182
    product: MDaemon Webmail
    role: Zero-day XSS delivery of SpyPress.MDAEMON
    campaign: operation-roundpress
    first_observed: "2024"
    confidence: moderate
    source: eset-operation-roundpress-2025
    notes: ESET assessed the vulnerability was most likely discovered by Sednit.
  - cve: CVE-2023-50224
    product: TP-Link WR841N
    role: Router credential disclosure followed by malicious DNS reconfiguration
    campaign: apt28-dns-hijacking
    first_observed: "2024"
    confidence: high
    source: ncsc-apt28-dns-2026
    notes: NCSC states the actor likely used this vulnerability on the identified model.
  - cve: CVE-2026-21509
    product: Microsoft Office
    role: Client-side exploitation and payload delivery
    campaign: operation-neusploit
    first_observed: "2026-01"
    confidence: high
    source: zscaler-operation-neusploit
    notes: Active exploitation was observed three days after Microsoft's out-of-band update.
  - cve: CVE-2026-21513
    product: Microsoft MSHTML
    role: Security-feature bypass associated with an in-the-wild exploit
    first_observed: "2026-01"
    confidence: moderate
    source: akamai-cve-2026-21513
    notes: Akamai linked the sample to APT28-associated infrastructure; APT Notes does not elevate that to direct government attribution.
technique_evidence:
  - technique: exploit-public-facing-application
    source_locators:
      - source: ncsc-apt28-dns-2026
        locator: "NCSC, 7 April 2026 edition; TP-Link router exploitation, paragraphs 1-3; MITRE ATT&CK table, T1190 row."
        basis: procedure-evidence
        checked_at: "2026-09-07"
    review:
      version: "1.1.0"
      reviewed_at: null
      state: not-recorded
      rationale: "T1190 follows the source's explicit router-exploitation mapping. CVE-2023-50224 remains likely, not confirmed. 2024-2026 is the reported campaign interval, not a dated event for every router."
      correction_note: "AI-assisted source comparison on 2026-09-07; independent human claim review remains unrecorded."
    editorial_note: "Source passage and mapping compared by an AI assistant on 2026-09-07. This is not an independent human review."
    campaign: apt28-dns-hijacking
    first_observed: "2024"
    last_observed: "2026"
    confidence: high
    sources: [ncsc-apt28-dns-2026]
    notes: Exploitation of internet-facing routers to create operational infrastructure.
  - technique: adversary-in-the-middle
    source_locators:
      - source: ncsc-apt28-dns-2026
        locator: "NCSC, 7 April 2026 edition; APT28 malicious DNS activity / Cluster one, paragraphs 1-3; MITRE ATT&CK table, T1557 row."
        basis: procedure-evidence
        checked_at: "2026-09-07"
    review:
      version: "1.1.0"
      reviewed_at: null
      state: not-recorded
      rationale: "T1557 follows selective DNS redirection and attempted credential interception. Password and OAuth-token theft is the reported capability; success for every victim is not established. 2024-2026 is the campaign interval."
      correction_note: "AI-assisted source comparison on 2026-09-07; independent human claim review remains unrecorded."
    editorial_note: "Source passage and mapping compared by an AI assistant on 2026-09-07. This is not an independent human review."
    campaign: apt28-dns-hijacking
    first_observed: "2024"
    last_observed: "2026"
    confidence: high
    sources: [ncsc-apt28-dns-2026, microsoft-soho-dns-2026]
    notes: Selective DNS resolution enabled interception of passwords and OAuth tokens.
  - technique: spearphishing-attachment
    source_locators:
      - source: zscaler-operation-neusploit
        locator: "Zscaler ThreatLabz, 2 February 2026 edition; Introduction and Technical Analysis opening paragraphs; MITRE ATT&CK Framework table. English article text was retrieved on the publisher's /de/blogs/security-research/apt28-leverages-cve-2026-21509-operation-neusploit route."
        basis: procedure-evidence
        checked_at: "2026-09-07"
    review:
      version: "1.1.0"
      reviewed_at: null
      state: not-recorded
      rationale: "Weaponised RTF lures support the attachment mapping. Attribution remains ThreatLabz's high-confidence assessment. January 2026 is the observed activity month; February is publication time, not a separately established last observation."
      correction_note: "AI-assisted source comparison on 2026-09-07; independent human claim review remains unrecorded."
    editorial_note: "Source passage and mapping compared by an AI assistant on 2026-09-07. This is not an independent human review."
    campaign: operation-neusploit
    first_observed: "2026-01"
    last_observed: "2026-01"
    confidence: high
    sources: [zscaler-operation-neusploit]
    notes: Weaponised RTF documents exploited CVE-2026-21509.
  - technique: remote-email-collection
    source_locators:
      - source: cisa-aa25-141a
        locator: "Joint CSA, April 2026 version 1.1; printed pages 8-9, Exfiltration; page 29, Table 13, T1114.002. Official co-author copy: https://media.defense.gov/2025/May/21/2003719846/-1/-1/0/CSA_RUSSIAN_GRU_TARGET_LOGISTICS.PDF#page=8"
        basis: procedure-evidence
        checked_at: "2026-09-07"
    review:
      version: "1.1.0"
      reviewed_at: null
      state: not-recorded
      rationale: "EWS/IMAP collection and periodic EWS queries directly support T1114.002. 2022-2025 is the original reporting window, not exact per-mailbox observation dates. The April 2026 edition updates indicators; it does not establish new collection in 2026."
      correction_note: "AI-assisted source comparison on 2026-09-07; independent human claim review remains unrecorded."
    editorial_note: "Source passage and mapping compared by an AI assistant on 2026-09-07. This is not an independent human review."
    campaign: western-logistics-targeting
    first_observed: "2022"
    last_observed: "2025"
    confidence: high
    sources: [cisa-aa25-141a]
    notes: EWS and IMAP supported periodic, long-term collection.
  - technique: steal-application-access-token
    source_locators:
      - source: ncsc-authentic-antics-2025
        locator: "NCSC AUTHENTIC ANTICS Malware Analysis Report, version 1, 6 May 2025; printed page 3 Introduction and pages 9-12 Outlook Credential and Token Stealing / Token Retrieval and Validation."
        basis: procedure-evidence
        checked_at: "2026-09-07"
    review:
      version: "1.1.0"
      reviewed_at: null
      state: not-recorded
      rationale: "Intercepted authorization codes redeemed for access and refresh tokens support T1528. The report explicitly places observed use in 2023. Its 2025 publication date does not extend observed use through 2025."
      correction_note: "AI-assisted source comparison on 2026-09-07; independent human claim review remains unrecorded."
    editorial_note: "Source passage and mapping compared by an AI assistant on 2026-09-07. This is not an independent human review."
    campaign: outlook-identity-collection
    first_observed: "2023"
    last_observed: "2023"
    confidence: high
    sources: [ncsc-authentic-antics-2025]
    notes: AUTHENTIC ANTICS intercepted OAuth authorization flows from within Outlook.
  - technique: video-capture
    source_locators:
      - source: cisa-aa25-141a
        locator: "Joint CSA, April 2026 version 1.1; printed pages 9-10, Connections to Targeting of IP Cameras; page 29, Table 13, T1125. Official co-author copy: https://media.defense.gov/2025/May/21/2003719846/-1/-1/0/CSA_RUSSIAN_GRU_TARGET_LOGISTICS.PDF#page=9"
        basis: procedure-evidence
        checked_at: "2026-09-07"
    review:
      version: "1.1.0"
      reviewed_at: null
      state: not-recorded
      rationale: "T1125 is the source's mapping for attempted access to camera feeds. March 2022 is the stated earliest targeting; 2025 is the original report boundary, not a last confirmed camera access. Targeting counts do not equal successful compromises."
      correction_note: "AI-assisted source comparison on 2026-09-07; independent human claim review remains unrecorded."
    editorial_note: "Source passage and mapping compared by an AI assistant on 2026-09-07. This is not an independent human review."
    campaign: western-logistics-targeting
    first_observed: "2022"
    last_observed: "2025"
    confidence: high
    sources: [cisa-aa25-141a]
    notes: RTSP-accessible cameras were targeted around logistics and military locations.
operational_timeline:
  - date: "2004–2007"
    title: Long-running strategic espionage activity emerges
    summary: Public tracking places activity associated with APT28 in operation since at least 2004, with early vendor visibility focused on government, military and security intelligence.
    confidence: high
    sources: [mitre-g0007]
  - date: "2014–2018"
    title: Remote and close-access operations become public
    summary: Legal cases documented operations against anti-doping, sporting and chemical-analysis organisations, including on-site wireless access attempts.
    confidence: high
    sources: [doj-gru-indictment-2018]
  - date: "2021–2023"
    title: Network devices become operational infrastructure
    summary: APT28 exploited Cisco routers, deployed Jaguar Tooth and later repurposed criminally compromised EdgeRouters to conceal credential operations.
    confidence: high
    sources: [ncsc-jaguar-tooth-2023, doj-soho-botnet-2024]
  - date: "2022–2025"
    title: Ukraine-support logistics and physical movement collection
    summary: Unit 26165 targeted logistics, transport and technology relationships while also probing cameras near border, rail and military locations.
    confidence: high
    sources: [cisa-aa25-141a]
  - date: "2023–2025"
    title: Webmail, Outlook and cloud identity collection
    summary: Public reporting documented RoundPress, CVE-2023-23397 exploitation and AUTHENTIC ANTICS credential and OAuth-token theft.
    confidence: high
    sources: [eset-operation-roundpress-2025, microsoft-cve-2023-23397, ncsc-authentic-antics-2025]
  - date: "2025"
    title: LLM-assisted malware enters live operations
    summary: PROMPTSTEAL queried an external language model for discovery and collection commands during activity against Ukraine.
    confidence: high
    sources: [gtig-promptsteal-2025]
  - date: "2026"
    title: Rapid Office exploitation and selective payload delivery
    summary: Operation Neusploit used CVE-2026-21509, regional geofencing and multiple payload chains against Central and Eastern European targets.
    confidence: high
    sources: [zscaler-operation-neusploit]
  - date: "2024–2026"
    title: Router compromise enables DNS and authentication interception
    summary: Compromised SOHO devices redirected selected authentication traffic through malicious DNS and adversary-in-the-middle infrastructure.
    confidence: high
    sources: [ncsc-apt28-dns-2026, microsoft-soho-dns-2026, doj-operation-masquerade-2026]
external_identifiers:
  mitre_attack: G0007
  other: [GRU Unit 26165]
related_research: []
sources: [uk-gru-profile-2026, ncsc-apt28-dns-2026, microsoft-soho-dns-2026, doj-operation-masquerade-2026, zscaler-operation-neusploit, akamai-cve-2026-21513, gtig-promptsteal-2025, ncsc-authentic-antics-2025, eset-operation-roundpress-2025, cisa-aa25-141a, volexity-nearest-neighbor-2024, microsoft-gooseegg-2024, microsoft-cve-2023-23397, doj-soho-botnet-2024, mandiant-apt44-correction-2024, ncsc-jaguar-tooth-2023, doj-gru-indictment-2018, mitre-g0007]
updates: [apt28-profile-created, apt28-major-review-2026, apt28-reviewed-no-change-2026, apt28-procedure-provenance-2026]
featured: true
draft: false
---

## Analytic scope

APT Notes uses APT28 as an analytic umbrella for publicly reported activity associated with GRU Military Unit 26165. Vendor clusters overlap this scope but may be broader, narrower or divided differently. A shared victim, infrastructure node or malware family is not sufficient on its own to prove that two labels are equivalent.

## 2026 threat picture

APT28's centre of gravity remains espionage. Recent operations repeatedly pursue credentials, email, cloud access and information about organisations supporting Ukraine. The actor combines mature social engineering with rapid vulnerability exploitation and infrastructure obtained through compromised routers and third parties.

The 2026 DNS campaign is especially relevant to defenders because compromise can begin on a remote employee's unmanaged router. Authentication traffic may be exposed before it reaches an enterprise-controlled endpoint or network boundary.

## Mission and operational model

Public reporting supports a mission focused on strategic and military intelligence rather than indiscriminate financial theft. Target selection follows relationships: suppliers, technology providers, transport coordinators and nearby organisations can be targeted because they provide access or visibility into the primary intelligence requirement.

The actor's operations span four recurring access and collection paths:

1. credential attacks and targeted phishing;
2. exploitation of email clients, webmail and internet-facing infrastructure;
3. sustained mailbox, token and document collection; and
4. compromised routers, cameras and neighbouring networks used for access, concealment or situational awareness.

## Targeting assessment

Ukraine and organisations supporting Ukrainian defence and logistics remain a priority. The wider victim set includes European and North American governments, military and diplomatic bodies, transport and maritime organisations, technology and telecommunications providers, energy entities, NGOs, research organisations and selected individuals with strategic access.

Countries listed in this profile are documented examples, not an exhaustive victim map.

## Defensive priorities

- Inventory and patch internet-facing routers, cameras, webmail and email clients; remove unsupported devices and internet-exposed management interfaces.
- Monitor DNS configuration on SOHO and branch devices, unusual resolver changes and selective authentication-domain resolution.
- Use phishing-resistant MFA while also monitoring token issuance, refresh-token use, impossible travel, mailbox permissions, app passwords and unexpected email API activity.
- Block unnecessary outbound SMB and investigate forced-authentication indicators associated with Outlook messages.
- Detect distributed, low-volume password spraying across accounts instead of evaluating each source IP in isolation.
- Separate Wi-Fi and wired trust boundaries and require certificate-based or similarly strong enterprise Wi-Fi authentication.
- Hunt by campaign behaviour and exposure. Actor names and static infrastructure indicators should provide context, not serve as the only detection condition.

## Analytic limitations

Public visibility is incomplete and source terminology is inconsistent. Campaign boundaries can change as vendors obtain new telemetry. Mandiant's correction of activity previously assigned to APT28 and later reassigned to APT44 demonstrates why cohabitation in a victim network must not be treated as proof of actor identity.

APT Notes records source-specific claims, dates and confidence. It does not convert every public association into an independent Hecavex attribution.
