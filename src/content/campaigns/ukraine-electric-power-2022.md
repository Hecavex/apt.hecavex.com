---
id: ukraine-electric-power-2022
name: 2022 Ukraine electric power attack
slug: ukraine-electric-power-2022
summary: A Sandworm operation that used native MicroSCADA functionality to issue unauthorised substation commands, followed by CaddyWiper deployment in the victim's IT environment.
last_reviewed: 2026-08-09
confidence: high
aliases: []
actors: [apt44]
sources: [mandiant-ukraine-power-2023, mitre-g0034]
related_research: []
start_date: "2022-06 or earlier"
end_date: "2022-10-12"
regions: [Ukraine]
sectors: [Energy, Electric Power, Critical Infrastructure]
malware: [caddywiper]
tools: []
techniques: [scheduled-task, powershell, data-destruction, lateral-tool-transfer, systemd-service]
draft: false
---

Mandiant assessed that the intrusion began by June 2022 or earlier. The disruptive sequence culminated in October with unauthorised MicroSCADA commands and a later CaddyWiper event.

The OT action is important because it used legitimate control-system functionality rather than relying only on bespoke ICS malware. The initial access vector remained undetermined in the public report.
