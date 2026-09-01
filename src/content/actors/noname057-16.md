---
id: noname057-16
name: NoName057(16)
slug: noname057-16
created_at: 2026-08-26
modified_at: 2026-09-01
version: 1.1.0
change_reason: Added source-specific Baltic relevance records that separate reported activity from an actor claim.
summary: A pro-Russia DDoS network that recruits participants around an automated attack tool and repeatedly targets Ukraine-supporting governments, public services and critical sectors in Europe.
actor_types: [state-aligned, hacktivist, cybercriminal]
status: intermittently-active
suspected_origins: [Russia]
motivations: [ideological, disruption, influence]
active_since: "2022-03"
last_observed: "2025-11 public reporting"
confidence: high
last_reviewed: 2026-08-26
authors: [deividas-lis]
mission: Generate politically timed availability disruption and publicity against Ukraine and countries supporting Ukraine by coordinating a large participant network, reusable DDoS infrastructure and target lists.
current_assessment: A multinational advisory assesses NoName057(16) to be a covert project created inside the Kremlin-established CISM organisation. Operation Eastwood substantially disrupted its infrastructure in July 2025 but did not establish that the network had ceased to exist. CERT-EU recorded later claimed activity with limited confirmed availability effects. The public evidence supports a persistent state-aligned DDoS network, while individual target claims still require victim-side corroboration.
aliases:
  - name: NoName05716
    source: Europol
    relationship: common-alias
    confidence: high
    scope: Punctuation-free form used in public references to the same network.
    first_seen: "2022"
    last_seen: "2025"
    notes: Search aid only; it does not describe a separate cluster.
  - name: NoName
    source: CERT-EU
    relationship: common-alias
    confidence: moderate
    scope: Short form used when the surrounding report clearly identifies NoName057(16).
    first_seen: "2022"
    last_seen: "2025"
    notes: The short name is not globally unique and should not be matched without context.
parent_entities:
  - name: Center for the Study and Network Monitoring of the Youth Environment
    entity_type: Kremlin-established information technology organisation
    relationship: assessed creator and administrator
    confidence: high
    source: joint-csa-pro-russia-hacktivists-2025
    notes: The multinational advisory assesses that CISM created NoName057(16) as a covert project; CISM personnel developed DDoSia, funded infrastructure, administered channels and selected targets.
attribution:
  - claim: A multinational advisory assesses that the Kremlin-established CISM organisation created NoName057(16) as a covert project and provided tooling, infrastructure, administrators and target selection.
    attributed_entity: Center for the Study and Network Monitoring of the Youth Environment
    source: joint-csa-pro-russia-hacktivists-2025
    source_type: government
    published_at: 2025-12-09
    confidence: high
    status: assessed
    notes: This is a coordinated government assessment, not a statement that every volunteer participant had direct state contact.
  - claim: Europol describes NoName057(16) as a pro-Russian cybercrime network responsible for DDoS activity against Ukraine and supporting countries.
    attributed_entity: NoName057(16)
    source: europol-noname057-eastwood-2025
    source_type: government
    published_at: 2025-07-16
    confidence: high
    status: confirmed
    notes: This establishes the law-enforcement identity and operational model, not a judicial finding against every participant.
  - claim: German prosecutors and the BKA suspect named organisers of participating in a foreign criminal organisation and computer sabotage through NoName057(16).
    attributed_entity: Suspected NoName057(16) organisers
    source: bka-noname057-eastwood-2025
    source_type: legal
    published_at: 2025-07-16
    confidence: high
    status: reported
    notes: Arrest warrants and criminal suspicions are allegations; the profile does not present them as convictions.
  - claim: A US indictment alleges that a defendant supported NoName057(16), a state-sanctioned project administered in part by CISM employees.
    attributed_entity: NoName057(16) and an accused supporter
    source: doj-carr-noname-actions-2025
    source_type: legal
    published_at: 2025-12-09
    confidence: high
    status: reported
    notes: The defendant pleaded not guilty. The indictment is an allegation and the presumption of innocence applies.
targeting:
  regions: [Ukraine, Europe, NATO member states]
  countries: [Ukraine, Lithuania, Latvia, Germany, Sweden, Switzerland, Netherlands, Denmark, Belgium]
  sectors: [Government, Financial Services, Energy, Transportation, Telecommunications, Defence, Manufacturing, Public Services]
  organisations: [NATO]
baltic_relevance:
  - id: noname057-lithuania-airports-ddos-2023
    country: Lithuania
    evidence_type: reported-targeting
    summary: CERT-EU describes a February 2023 DDoS campaign launched against Lithuanian airports.
    sectors: [Transportation, Aviation]
    technologies: [Public-facing web services]
    campaigns: [noname057-european-ddos]
    techniques: [network-denial-of-service]
    first_observed: "2023-02"
    last_observed: "2023-02"
    reviewed_at: "2026-09-01"
    confidence: high
    sources: [cert-eu-noname057-baltics-2023]
    why_it_matters: The record establishes direct Lithuania-facing availability targeting while making no unsupported claim about material disruption.
  - id: noname057-latvia-nda-claim-2023
    country: Latvia
    evidence_type: actor-claim
    summary: CERT-EU records a NoName057(16) claim against Latvia's National Defence Academy without confirming impact.
    sectors: [Defence, Education]
    technologies: [Public-facing web services]
    campaigns: [noname057-european-ddos]
    techniques: [network-denial-of-service]
    first_observed: "2023-02"
    last_observed: "2023-02"
    reviewed_at: "2026-09-01"
    confidence: moderate
    sources: [cert-eu-noname057-baltics-2023]
    why_it_matters: Keeping the claim distinct from observed impact prevents advertised targeting from being presented as a confirmed Latvian incident.
campaigns: [noname057-european-ddos, noname057-nato-summit-2025]
malware: []
tools: []
techniques: [network-denial-of-service]
technique_evidence:
  - technique: network-denial-of-service
    campaign: noname057-european-ddos
    first_observed: "2022-03"
    last_observed: "2025-11"
    confidence: high
    sources: [europol-noname057-eastwood-2025, bka-noname057-eastwood-2025, cert-eu-noname057-baltics-2023, cert-eu-noname057-november-2025, joint-csa-pro-russia-hacktivists-2025]
    notes: Law-enforcement reporting documents a participant network, an automated DDoS tool and a distributed server infrastructure used against European targets; later CERT-EU reporting preserves post-disruption claims and bounded observed effects.
    editorial_note: The relationship records the demonstrated DDoS operating model. It does not treat every Telegram target claim or screenshot as independent proof of disruption.
  - technique: network-denial-of-service
    campaign: noname057-nato-summit-2025
    first_observed: "2025-06"
    last_observed: "2025-06"
    confidence: high
    sources: [cert-eu-noname057-june-2025, europol-noname057-eastwood-2025]
    notes: CERT-EU and Europol record DDoS activity against Dutch and NATO-related websites around the June 2025 NATO Summit.
    editorial_note: The DDoS evidence is kept separate from an unproven suggestion about physical rail sabotage made in the same reporting period.
operational_timeline:
  - date: "2022-03"
    title: Activity begins around the invasion of Ukraine
    summary: Law-enforcement reporting places the network's emergence in 2022 and describes an initial focus on Ukrainian targets before expansion to countries supporting Ukraine.
    confidence: high
    sources: [europol-noname057-eastwood-2025, bka-noname057-eastwood-2025]
  - date: "2023-02"
    title: Baltic-facing DDoS activity is recorded
    summary: CERT-EU describes a launched DDoS campaign against Lithuanian airports and separately records a NoName057(16) claim against Latvia's National Defence Academy; the Latvia claim is not treated as confirmed impact.
    confidence: high
    sources: [cert-eu-noname057-baltics-2023]
  - date: "2023-2024"
    title: European target set expands
    summary: Authorities documented repeated DDoS waves against government, finance, energy, transport and manufacturing targets in several European states, often around political events.
    confidence: high
    sources: [europol-noname057-eastwood-2025, bka-noname057-eastwood-2025]
  - date: "2025-06"
    title: NATO Summit targeting
    summary: Dutch and NATO websites experienced reported DDoS activity around the summit in the Netherlands; the separate suggestion of physical rail sabotage was not established.
    confidence: high
    sources: [cert-eu-noname057-june-2025, europol-noname057-eastwood-2025]
  - date: "2025-07"
    title: Operation Eastwood disrupts the network
    summary: An international operation took more than one hundred servers offline, executed searches and arrests, issued warrants and notified a large number of participants and administrators.
    confidence: high
    sources: [europol-noname057-eastwood-2025, bka-noname057-eastwood-2025]
  - date: "2025-11"
    title: Claimed activity continues after disruption
    summary: CERT-EU recorded later claims against Danish political and Belgian telecommunications sites, with bounded observed availability effects rather than confirmation of every claimed target.
    confidence: moderate
    sources: [cert-eu-noname057-november-2025]
  - date: "2025-12"
    title: Multinational state-link assessment and US charges become public
    summary: A joint advisory assessed CISM's role in creating and operating the network; the United States separately announced charges against an alleged supporter and explicitly preserved the presumption of innocence.
    confidence: high
    sources: [joint-csa-pro-russia-hacktivists-2025, doj-carr-noname-actions-2025]
external_identifiers:
  mitre_attack: ""
  other: [NoName05716, DDoSia participant network]
related_research: []
sources: [joint-csa-pro-russia-hacktivists-2025, doj-carr-noname-actions-2025, europol-noname057-eastwood-2025, bka-noname057-eastwood-2025, cert-eu-noname057-baltics-2023, cert-eu-noname057-june-2025, cert-eu-noname057-november-2025]
updates: [noname057-16-profile-created, noname057-16-baltic-relevance-added]
featured: true
draft: false
---

## Overview

NoName057(16) is a pro-Russia DDoS network that combines ideological mobilisation with an operational model resembling organised cybercrime. It distributes an automated attack tool, publishes targets, rewards participants and uses a distributed server infrastructure to concentrate traffic against selected services. Europol and German law enforcement describe thousands of supporters around a smaller administrator and organiser layer.

The network first focused on Ukraine and then expanded toward countries supporting Ukraine, NATO members and European institutions. Public activity is commonly timed to elections, aid announcements, summits and other political events. The objective is usually short-term availability disruption and attention rather than persistent access or data theft.

## Classification and attribution boundary

The labels "state-aligned", "hacktivist" and "cybercrime network" describe different aspects of the same public record. Political alignment explains target selection and messaging; participant recruitment, tooling, infrastructure and financial rewards explain how the operation scales. The multinational advisory assesses that CISM created the group as a covert project and selected targets. That assessment does not prove that every volunteer participant knew of or received direct state direction.

Operation Eastwood provides the strongest public identity and infrastructure evidence. It is a law-enforcement disruption and investigation, not a final judgment on every suspect. The German arrest warrants and US indictment are therefore recorded as legal claims rather than convictions; the US defendant pleaded not guilty and remains presumed innocent.

## DDoS operating model

NoName057(16) reduces the cost of participation. Supporters can obtain the DDoSia software, receive a target set and contribute traffic without independently selecting or researching a victim. Administrators maintain the coordination channels, attack infrastructure and incentives. This division makes the network more durable than a single operator but also creates central services that law enforcement can disrupt.

The public evidence supports Network Denial of Service as the core technique. It does not support automatically treating every advertised target as successfully disrupted. Actor posts, screenshots and third-party availability checks can establish what was claimed; victim reporting and telemetry are needed to establish impact.

## Europe and event-driven targeting

Law-enforcement reporting documents activity against Sweden, Germany, Switzerland and the Netherlands, including government, finance, energy, transport and manufacturing targets. CERT-EU describes a February 2023 campaign against Lithuanian airports and separately records a claim against Latvia's National Defence Academy. The distinction matters: the Lithuanian campaign is reported as launched activity, while the Latvia entry remains a group claim without confirmed impact. CERT-EU also adds post-disruption activity against Danish and Belgian targets. The June 2025 NATO Summit is a useful campaign boundary because several official sources connect DDoS activity to the same political event.

The network's European activity should not be converted into a prevalence metric. A large target list may generate only brief or fully mitigated interruptions, and some organisations report no material effect. Conversely, limited visible impact does not make the attempt analytically irrelevant: the infrastructure, timing and coordination can still reveal the operator's priorities.

## Disruption and current status

Operation Eastwood in July 2025 took more than one hundred servers offline and paired infrastructure action with arrests, searches, warrants and direct notifications to supporters and administrators. Public counts vary slightly between participating authorities because their statements describe different reporting cuts. This profile retains the shared conclusion, not a synthetic total that hides those differences.

Later CERT-EU reporting recorded claimed NoName057(16) activity and some bounded availability effects. The correct status is therefore intermittently active, not dismantled. The operation materially reduced capacity and exposed organisers, but the public record does not establish permanent cessation.

## Analytic limitations

The public record is strongest for DDoS activity that coincided with visible political events or law-enforcement action. It is weaker for the full participant hierarchy, state relationships and victim-side impact. The profile does not attribute physical sabotage, data theft or operational-technology access to NoName057(16) without separate evidence. Shared pro-Russia messaging, a common victim or simultaneous claims do not by themselves merge this actor with another hacktivist group.
