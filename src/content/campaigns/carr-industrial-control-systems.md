---
id: carr-industrial-control-systems
name: CARR industrial-control-system intrusions
slug: carr-industrial-control-systems
created_at: 2026-08-26
modified_at: 2026-08-26
version: 1.0.0
change_reason: Initial source-backed campaign record.
summary: Opportunistic CARR access to water, wastewater, hydroelectric and energy control systems in the United States and Europe, including bounded physical effects in Texas.
last_reviewed: 2026-08-26
confidence: high
aliases: []
actors: [cyber-army-russia-reborn]
sources: [joint-csa-pro-russia-hacktivists-2025, doj-carr-noname-actions-2025, treasury-carr-2024]
related_research: []
start_date: "2023-late"
end_date: "2024"
regions: [Europe, North America]
sectors: [Water and Wastewater, Energy, Critical Infrastructure]
malware: []
tools: []
techniques: []
draft: false
---

Treasury reporting attributes manipulation of industrial-control equipment at water, wastewater, hydroelectric and energy facilities to CARR. The best documented effects occurred in January 2024, when compromised human-machine interfaces contributed to tank overflow and loss of water at two Texas facilities. A separate energy-company SCADA compromise provided control over alarms and pumps.

The joint advisory maps exposed VNC, weak credentials and HMI manipulation across a cohort that includes CARR, Z-Pentest, NoName057(16), Sector16 and affiliates. Because the technical table is cohort-wide, this campaign record does not turn every mapped technique into a CARR-specific relationship. It also does not merge the later Danish water-utility incident into CARR: the Council of the EU attributes that event to Z-Pentest, which it treats as a separate group with overlapping CARR personnel.
