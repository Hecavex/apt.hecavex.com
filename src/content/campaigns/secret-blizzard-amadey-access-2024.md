---
id: secret-blizzard-amadey-access-2024
name: Secret Blizzard Amadey access-brokering operation
slug: secret-blizzard-amadey-access-2024
created_at: 2026-08-27
modified_at: 2026-08-27
version: 1.0.0
change_reason: Initial source-backed campaign record.
summary: A 2024 espionage operation in which Secret Blizzard commandeered Amadey infections associated with another cluster to reach Ukrainian military devices.
last_reviewed: 2026-08-27
confidence: high
aliases: []
actors: [secret-blizzard]
sources: [microsoft-secret-blizzard-freeloader-2024, cisa-snake-advisory-2023]
related_research: []
start_date: "2024-03"
end_date: "2024-04"
regions: [Ukraine, Europe]
sectors: [Defence, Government]
malware: []
tools: []
techniques: [powershell]
draft: false
---

Microsoft observed Secret Blizzard using an existing cybercriminal foothold rather than acquiring every victim directly. The campaign is useful because it exposes an operating method: another group's infection provides access, after which Secret Blizzard validates selected systems and deploys its own espionage tooling.

Amadey is not reclassified as Secret Blizzard malware, and all activity by the upstream cluster is not attributed to Secret Blizzard.
