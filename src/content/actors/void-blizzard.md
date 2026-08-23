---
id: void-blizzard
name: Void Blizzard
slug: void-blizzard
summary: A Russia-affiliated espionage cluster using commodity credentials, stolen session cookies and cloud-native collection against NATO, EU and Ukraine-related targets.
actor_types: [state-sponsored]
status: active
suspected_origins: [Russia]
motivations: [espionage, credential-access, data-theft]
active_since: "2024-04"
last_observed: "2026-07"
confidence: high
last_reviewed: 2026-08-14
authors: [deividas-lis]
mission: Collect government, defence, logistics, technology, policy and Ukraine-support information from Western organisations through scalable identity compromise and cloud data access.
current_assessment: Void Blizzard combines scalable identity abuse with a growing technical collection capability. Purchased credentials, stolen cookies, password spraying and legitimate cloud APIs remain central, while the 2025–2026 Zimbra campaign demonstrates access to a novel exploit and custom collection infrastructure.
aliases:
  - name: Laundry Bear
    source: AIVD and MIVD
    relationship: government-designation
    confidence: high
    scope: Dutch intelligence-service name for the actor Microsoft tracks as Void Blizzard.
    first_seen: "2024"
    last_seen: "2026"
    notes: The two investigations were conducted in collaboration and explicitly cross-reference the names.
  - name: CL-STA-1114
    source: Palo Alto Networks Unit 42, as cited in the 2026 joint advisory
    relationship: vendor-tracking-cluster
    confidence: moderate
    scope: Industry activity cluster listed as overlapping with the government understanding of Laundry Bear.
    first_seen: "public reporting"
    last_seen: "2026 advisory"
    notes: The joint advisory explicitly cautions that industry names may not correlate one-to-one.
  - name: TA488
    source: Proofpoint, as cited in the 2026 joint advisory
    relationship: vendor-tracking-cluster
    confidence: moderate
    scope: Industry cluster formerly named UNK_PitStop and listed as overlapping Laundry Bear activity.
    first_seen: "public reporting"
    last_seen: "2026 advisory"
    notes: Retained as a search pivot, not asserted as exact equivalence across every historical operation.
attribution:
  - claim: Microsoft assesses with high confidence that Void Blizzard is Russia-affiliated and disproportionately targets NATO members and Ukraine.
    attributed_entity: Russia-affiliated threat actor
    source: microsoft-void-blizzard-2025
    source_type: vendor-research
    published_at: 2025-05-27
    confidence: high
    status: assessed
    notes: Microsoft does not publicly assign the cluster to a named Russian intelligence service or unit.
  - claim: The Dutch services assess Laundry Bear is highly probably a Russian state-supported actor conducting espionage against Western organisations.
    attributed_entity: Russian state-supported threat actor
    source: aivd-mivd-laundry-bear-2025
    source_type: government
    published_at: 2025-05-27
    confidence: high
    status: assessed
    notes: The actor's precise organisational sponsor remains undisclosed in the public report.
  - claim: A multinational joint advisory attributes the Zimbra campaign exploiting CVE-2025-66376 to Russian state-supported actors primarily tracked as Laundry Bear.
    attributed_entity: Laundry Bear
    source: joint-laundry-bear-zimbra-2026
    source_type: government
    published_at: 2026-07-23
    confidence: high
    status: assessed
    notes: The advisory was authored and co-sealed by intelligence, defence and cybersecurity authorities across multiple NATO partners.
targeting:
  regions: [Europe, North America, East Asia, Central Asia]
  countries: [Ukraine, Netherlands, NATO member states, European Union member states]
  sectors: [Government, Defence, Armed Forces, Aerospace, Transportation, Media, NGOs, Healthcare, Education, Information Technology, Telecommunications, High Technology]
  organisations: []
campaigns: [laundry-bear-cloud-espionage, laundry-bear-zimbra]
malware: [ulej]
tools: [azurehound, evilginx, flowerbed]
techniques: [password-spraying, valid-accounts, web-session-cookie, adversary-in-the-middle, spearphishing-attachment, phishing, remote-email-collection, email-collection, sharepoint-data, cloud-account-discovery, exploit-client-execution]
vulnerabilities:
  - cve: CVE-2025-66376
    product: Zimbra Collaboration Suite
    role: View-based cross-site scripting enabling JavaScript collection and exfiltration from webmail sessions
    campaign: laundry-bear-zimbra
    first_observed: "2025-07"
    confidence: high
    source: joint-laundry-bear-zimbra-2026
    notes: Exploitation began before the November 2025 patch and January 2026 CVE publication, making it a zero-day when first used.
technique_evidence:
  - technique: web-session-cookie
    campaign: laundry-bear-cloud-espionage
    first_observed: "2024-09"
    last_observed: "2025 reporting"
    confidence: high
    sources: [aivd-mivd-laundry-bear-2025, microsoft-void-blizzard-2025]
    notes: The Dutch police compromise was assessed as pass-the-cookie activity using session material likely obtained through a commodity infostealer ecosystem.
  - technique: password-spraying
    campaign: laundry-bear-cloud-espionage
    first_observed: "2024"
    last_observed: "2025"
    confidence: high
    sources: [microsoft-void-blizzard-2025]
    notes: Microsoft describes high-volume but strategically focused identity attacks.
  - technique: adversary-in-the-middle
    campaign: laundry-bear-cloud-espionage
    first_observed: "2025-04"
    last_observed: "2025-04"
    confidence: high
    sources: [microsoft-void-blizzard-2025]
    notes: A QR-bearing PDF and typosquatted Microsoft Entra sign-in page were used in a targeted campaign against more than 20 NGOs.
  - technique: remote-email-collection
    campaign: laundry-bear-cloud-espionage
    first_observed: "2024"
    last_observed: "2025 reporting"
    confidence: high
    sources: [microsoft-void-blizzard-2025, aivd-mivd-laundry-bear-2025]
    notes: Sources describe rapid bulk collection from Exchange and accessible shared mailboxes.
  - technique: cloud-account-discovery
    campaign: laundry-bear-cloud-espionage
    first_observed: "2024"
    last_observed: "2025 reporting"
    confidence: high
    sources: [microsoft-void-blizzard-2025]
    notes: AzureHound appeared in a subset of compromises to enumerate users, roles, groups, applications and devices.
  - technique: exploit-client-execution
    campaign: laundry-bear-zimbra
    first_observed: "2025-07"
    last_observed: "2026-07 reporting"
    confidence: high
    sources: [joint-laundry-bear-zimbra-2026]
    notes: Viewing a malicious email in a vulnerable Zimbra web client executed the embedded JavaScript without requiring a link click or attachment open.
  - technique: email-collection
    campaign: laundry-bear-zimbra
    first_observed: "2025-07"
    last_observed: "2026-07 reporting"
    confidence: high
    sources: [joint-laundry-bear-zimbra-2026]
    notes: Ulej attempted to collect the last 90 days of email and related account, directory and authentication data.
operational_timeline:
  - date: "2024-04"
    title: Earliest activity in current public reporting
    summary: Microsoft and the Dutch services place the cluster's observed operations from at least 2024 against Western governments and strategically relevant organisations.
    confidence: high
    sources: [microsoft-void-blizzard-2025, aivd-mivd-laundry-bear-2025]
  - date: "2024-09"
    title: Dutch police account compromised
    summary: A stolen session cookie provided access to an employee account and the organisation's Global Address List; investigators did not establish theft of other data.
    confidence: high
    sources: [aivd-mivd-laundry-bear-2025]
  - date: "2025-04"
    title: Targeted AiTM phishing added to credential acquisition
    summary: Microsoft observed a campaign impersonating a European defence event and using QR-enabled PDF lures, a typosquatted Entra page and Evilginx.
    confidence: high
    sources: [microsoft-void-blizzard-2025]
  - date: "2025-05"
    title: Coordinated public disclosure
    summary: Microsoft and the Dutch intelligence services jointly exposed the cluster, its targeting and defensive guidance.
    confidence: high
    sources: [microsoft-void-blizzard-2025, aivd-mivd-laundry-bear-2025]
  - date: "2025-07–2026-07"
    title: Zimbra zero-day campaign introduces Ulej and Flowerbed
    summary: A multinational advisory described view-based exploitation of CVE-2025-66376, collection of email and authentication material, and short-lived server infrastructure receiving the stolen data.
    confidence: high
    sources: [joint-laundry-bear-zimbra-2026]
external_identifiers:
  mitre_attack: ""
  other: [Laundry Bear]
related_research: []
sources: [joint-laundry-bear-zimbra-2026, microsoft-void-blizzard-2025, aivd-mivd-laundry-bear-2025]
updates: [void-blizzard-profile-created, void-blizzard-zimbra-campaign-added]
featured: true
draft: false
---

## Overview

Void Blizzard is a useful corrective to the idea that a state-aligned operation must arrive with bespoke malware. Its public tradecraft is mostly identity abuse and legitimate cloud access. The intelligence value comes from scale, target selection and disciplined collection, not from an exotic payload.

## Attribution boundary

Microsoft calls the cluster Void Blizzard and assesses it is Russia-affiliated. The Dutch AIVD and MIVD call it Laundry Bear and assess it is highly probably Russian state-supported. Their coordinated publications explicitly connect the names. Neither public source assigns the actor to a particular Russian service or military unit, so this profile does not fill that gap with inference.

## Access economy

The actor appears to combine three acquisition paths:

1. **Commodity access:** credentials and cookies likely originating from infostealer infections and criminal marketplaces.
2. **Password attacks:** focused high-volume spraying against organisations already selected for intelligence value.
3. **Targeted phishing:** QR-enabled lures and adversary-in-the-middle infrastructure capable of capturing passwords and session material.

This creates a practical defensive problem. The initial compromise may occur outside the victim organisation, while the observable operation begins as an apparently valid cloud session.

## Collection model

After access, the actor uses Microsoft cloud services and APIs to enumerate mailboxes, shared resources, files and tenant configuration. Microsoft also observed Teams access in some cases and AzureHound use in a subset. The collection pattern is therefore better reconstructed from identity and cloud audit logs than from endpoint malware detections.

The July 2026 joint advisory adds a different collection path. Ulej exploited a Zimbra cross-site scripting flaw when a malicious message was viewed, then attempted to collect 90 days of email, directory data, credentials, two-factor authentication material and a newly created application passcode. Flowerbed received and aggregated the resulting data on short-lived VPS infrastructure.

## Forensic anchors

- Preserve Entra sign-in, risk, Conditional Access and token-revocation records before retention windows expire.
- Correlate session identifiers, user agents, IP infrastructure and impossible-travel signals across Exchange, SharePoint, Teams and Graph activity.
- Look for rapid mailbox enumeration, access to many shared mailboxes, unusual Graph pagination and bulk file retrieval after a new or risky session.
- Investigate session-cookie theft as an upstream incident. Resetting a password alone may leave active tokens and the compromised device untouched.
- Treat AzureHound or similar enumeration as contextual evidence. Legitimate security teams use the same tooling.
- For Zimbra, preserve message source, mailbox audit data, SOAP requests, account-preference changes, new application passcodes, IMAP enablement and outbound DNS/HTTPS evidence before cleaning the mailbox.

## Defensive priorities

- Prefer phishing-resistant authentication and device-bound access controls for high-value identities.
- Revoke sessions and refresh tokens after suspected cookie theft, then validate the endpoint that produced the stolen material.
- Restrict legacy authentication, risky sign-ins and unmanaged-device access to sensitive cloud applications.
- Monitor consent, role, group and application enumeration together with subsequent collection rather than alerting on isolated API calls.
- Reduce standing access to shared mailboxes and broad SharePoint repositories.

## Analytic limitations

The original profile was based on two coordinated disclosures published on the same day, so they were not fully independent investigations. The July 2026 multinational advisory adds later technical evidence and broader government participation, but no complete victim list exists. Overlap with other Russian actors at the same victim reflects shared intelligence priorities and does not establish cluster identity.

## Related HECAVEX Labs evidence

The [Baltic Threat Atlas](https://labs.hecavex.com/baltic-threat-atlas/) preserves the Estonia-linked public reporting associated with Laundry Bear and Void Blizzard. It explicitly distinguishes a Baltic reporting or attribution connection from evidence of a victim located in Estonia.
