---
id: badpilot
name: BadPilot
slug: badpilot
summary: A multiyear Seashell Blizzard initial-access operation that exploits internet-facing systems, establishes durable persistence and preserves access for selected strategic follow-on activity.
last_reviewed: 2026-08-09
confidence: high
aliases: []
actors: [apt44]
sources: [microsoft-badpilot-2025]
related_research: []
start_date: "2021"
end_date: "ongoing when reported in 2025"
regions: [Europe, North America, Central Asia, South Asia, Middle East, Australia]
sectors: [Government, Energy, Oil and Gas, Telecommunications, Shipping, Defence Manufacturing]
malware: [localolive]
tools: [shadowlink, rclone]
techniques: [exploit-public-facing-application, server-software-component-web-shell, external-remote-services, remote-access-software, os-credential-dumping-lsass, valid-accounts]
draft: false
---

Microsoft describes BadPilot as an initial-access subgroup within Seashell Blizzard rather than a synonym for every APT44 operation.

The campaign combines broad exploitation with selective post-compromise investment. Web shells, legitimate remote-management software, OpenSSH, Tor-based access and credential theft provide options that can be retained until a victim becomes strategically useful.
