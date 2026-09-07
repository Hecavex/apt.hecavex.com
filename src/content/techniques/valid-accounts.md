---
id: valid-accounts
name: Valid Accounts
slug: valid-accounts
summary: Use of legitimate credentials to access victim services, networks or devices.
mitre_id: T1078
tactic: Initial Access / Persistence / Privilege Escalation / Stealth
tactics: ["Initial Access","Persistence","Privilege Escalation","Stealth"]
tactic_ids: ["TA0001","TA0003","TA0004","TA0005"]
framework_version: "19.2"
sources: [volexity-nearest-neighbor-2024, cisa-aa25-141a, microsoft-badpilot-2025, microsoft-prestige-2022]
draft: false
---

Valid credentials have supported distributed credential attacks, the Nearest Neighbor access chain and durable access in APT44-linked intrusions.

## Check where the account can authenticate

Volexity's [22 November 2024 Nearest Neighbor investigation](https://www.volexity.com/blog/2024/11/22/the-nearest-neighbor-attack-how-a-russian-apt-weaponized-nearby-wi-fi-networks-for-covert-access/), under "The Nearest Neighbor Attack", describes credentials validated against a public service protected by MFA, then used through a nearby compromised system to reach enterprise Wi-Fi that lacked that requirement.

**HECAVEX analysis:** Join public-service authentication attempts with wireless-controller or RADIUS authentication logs for the same account and period. Record the access point, client identity, time and subsequent internal sessions before interpreting a nearby connection as a local human attacker. The next check is whether one credential works across services with different authentication requirements. A failed MFA challenge does not establish that the account remained unusable elsewhere. This case-specific path does not imply that every anomalous wireless login is a remote APT operation.
