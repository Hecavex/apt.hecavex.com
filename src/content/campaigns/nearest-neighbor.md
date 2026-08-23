---
id: nearest-neighbor
name: Nearest Neighbor campaign
slug: nearest-neighbor
summary: An operation that compromised organisations physically close to an intended victim and used their systems to reach the target's enterprise Wi-Fi network remotely.
last_reviewed: 2026-08-09
confidence: high
aliases: [APT28 Nearest Neighbor Campaign]
actors: [apt28]
sources: [volexity-nearest-neighbor-2024, microsoft-gooseegg-2024]
related_research: []
start_date: "2022-02"
end_date: "2024-11"
regions: [Europe]
sectors: [Government, Research, Ukraine-related organisations]
malware: [gooseegg]
tools: []
techniques: [password-spraying, valid-accounts, powershell]
draft: false
---

Valid credentials alone could not reach the intended victim's internet-facing services because those services required MFA. The actor instead compromised nearby organisations, found a dual-homed system and connected to the target's Wi-Fi network from within radio range.

This operation recreated a close-access condition without requiring the operator to be physically present near the final target.
