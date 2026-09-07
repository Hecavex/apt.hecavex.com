---
id: os-credential-dumping-lsass
name: "OS Credential Dumping: LSASS Memory"
slug: os-credential-dumping-lsass
summary: Access to LSASS process memory to recover credentials that can support lateral movement and persistence.
mitre_id: T1003.001
tactic: Credential Access
tactics: ["Credential Access"]
tactic_ids: ["TA0006"]
framework_version: "19.2"
sources: [microsoft-badpilot-2025]
draft: false
---

Microsoft observed renamed ProcDump use and assessed that interactive RMM access could also support Task Manager-based LSASS dumping.
