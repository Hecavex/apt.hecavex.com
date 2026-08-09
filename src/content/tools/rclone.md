---
id: rclone
name: Rclone
slug: rclone
summary: A legitimate file-synchronisation utility observed in BadPilot intrusions for exfiltration using an actor-supplied configuration.
last_reviewed: 2026-08-09
confidence: high
aliases: [rclone.exe]
actors: [apt44]
sources: [microsoft-badpilot-2025]
related_research: []
tool_type: dual-use
platforms: [Windows, Linux]
techniques: [valid-accounts]
draft: false
---

Rclone is legitimate software. Its presence becomes relevant when execution, configuration, destination and surrounding access activity are inconsistent with authorised administration.
