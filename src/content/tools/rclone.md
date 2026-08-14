---
id: rclone
name: Rclone
slug: rclone
summary: A legitimate file-synchronisation utility reported in APT44 and Unit 29155 activity for transferring collected data to cloud storage.
last_reviewed: 2026-08-14
confidence: high
aliases: [rclone.exe]
actors: [apt44, unit-29155]
sources: [microsoft-badpilot-2025, cisa-aa24-249a, mitre-g1003]
related_research: []
tool_type: dual-use
platforms: [Windows, Linux]
techniques: [exfiltration-cloud-storage]
draft: false
---

Rclone is legitimate software. Its presence becomes relevant when execution, configuration, destination and surrounding access activity are inconsistent with authorised administration.
