---
id: cisco-router-reconnaissance
name: Cisco router reconnaissance campaign
slug: cisco-router-reconnaissance
summary: APT28 exploitation of unpatched Cisco routers using CVE-2017-6742 to deploy Jaguar Tooth and collect device and network information.
last_reviewed: 2026-08-09
confidence: high
aliases: []
actors: [apt28]
sources: [ncsc-jaguar-tooth-2023]
related_research: []
start_date: "2021"
end_date: "2023"
regions: [Ukraine, Europe, United States]
sectors: [Government, Military]
malware: [jaguar-tooth]
tools: []
techniques: [exploit-public-facing-application]
draft: false
---

The campaign exploited the Simple Network Management Protocol subsystem on unpatched Cisco IOS and IOS XE devices. Jaguar Tooth collected device information and enabled unauthenticated access while the compromised routers also supported operational concealment.
