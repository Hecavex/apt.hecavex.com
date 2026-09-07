---
id: systemd-service
name: "Create or Modify System Process: Systemd Service"
slug: systemd-service
summary: Creation or modification of a systemd unit so attacker-controlled code starts and persists as a Linux service.
mitre_id: T1543.002
tactic: Persistence / Privilege Escalation
tactics: ["Persistence","Privilege Escalation"]
tactic_ids: ["TA0003","TA0004"]
framework_version: "19.2"
sources: [mandiant-ukraine-power-2023, mitre-g0034]
draft: false
---

GOGETTER was configured through systemd units with names intended to resemble legitimate services.
