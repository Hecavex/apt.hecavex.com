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

## Investigating an unexpected transfer

Microsoft's [BadPilot report](https://www.microsoft.com/en-us/security/blog/2025/02/12/the-badpilot-campaign-seashell-blizzard-subgroup-conducts-multiyear-global-access-operation/), 12 February 2025, describes rclone on compromised servers using an actor-supplied configuration after remote-management deployment. Locate the rclone paragraph immediately before the ShadowLink discussion.

**HECAVEX analysis:** Preserve the process command line, parent process, configuration path, file-access history and transfer logs. Compare the configured remote and account owner with approved backups. The next check is whether the same session installed the remote-management agent or accessed credentials. A binary name, cloud destination or large transfer alone cannot attribute activity to APT44; legitimate backup jobs can produce all three.
