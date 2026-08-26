---
id: midnight-blizzard-rdp-spearphishing
name: Midnight Blizzard RDP-file spearphishing
slug: midnight-blizzard-rdp-spearphishing
created_at: 2026-08-26
modified_at: 2026-08-26
version: 1.0.0
change_reason: Initial bounded campaign record published.
summary: An October 2024 campaign that sent signed RDP configuration files to thousands of targets and mapped local resources to actor-controlled remote systems.
last_reviewed: 2026-08-26
confidence: high
aliases: [UAC-0215 overlap]
actors: [midnight-blizzard]
sources: [microsoft-apt29-rdp-2024]
related_research: []
start_date: "2024-10-22"
end_date: "ongoing when published 2024-10-29"
regions: [Europe, Asia-Pacific, North America]
sectors: [Government, Diplomacy, Higher education, Defence, NGOs, Information Technology]
malware: []
tools: []
techniques: [spearphishing-attachment, data-from-local-system]
draft: false
---

Microsoft observed highly targeted messages sent to thousands of recipients across more than 100 organisations. Lures referenced Microsoft, Amazon Web Services and Zero Trust and carried signed RDP configuration files that connected targets to actor-controlled systems.

The configuration could map files, drives, clipboard contents, peripherals and authentication capabilities. The source notes that additional malware installation was possible, but the campaign record does not convert that possibility into an observed malware relationship.

Microsoft reported overlap with activity tracked by CERT-UA as UAC-0215. That is retained as campaign overlap, not promoted to an actor-wide alias.
