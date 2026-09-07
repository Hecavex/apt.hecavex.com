---
id: adversary-in-the-middle
name: Adversary-in-the-Middle
slug: adversary-in-the-middle
summary: Interposition between a victim and a legitimate service to inspect or manipulate traffic and capture authentication material.
mitre_id: T1557
tactic: Collection / Credential Access
tactics: ["Collection","Credential Access"]
tactic_ids: ["TA0009","TA0006"]
framework_version: "19.2"
sources: [ncsc-apt28-dns-2026, microsoft-soho-dns-2026]
draft: false
---

APT28 used selective DNS responses to direct browser and application sessions through actor-controlled infrastructure.
