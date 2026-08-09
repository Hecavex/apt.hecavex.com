---
id: operation-neusploit
name: Operation Neusploit
slug: operation-neusploit
summary: A January 2026 European espionage campaign exploiting CVE-2026-21509 in crafted Office documents to deliver email theft and remote-access capabilities.
last_reviewed: 2026-08-09
confidence: high
aliases: []
actors: [apt28]
sources: [zscaler-operation-neusploit]
related_research: []
start_date: "2026-01"
end_date: "2026-02"
regions: [Central Europe, Eastern Europe]
sectors: [Government, Diplomacy, Transport]
malware: [minidoor, pixynetloader]
tools: [covenant-grunt]
techniques: [spearphishing-attachment, exploit-client-execution, scheduled-task]
draft: false
---

ThreatLabz observed weaponised RTF documents targeting Ukraine, Slovakia and Romania shortly after Microsoft released its update for CVE-2026-21509. Server-side geofencing and User-Agent checks restricted payload delivery to intended regions and clients.

Two observed chains delivered either MiniDoor, an Outlook email stealer, or PixyNetLoader followed by a Covenant Grunt implant.
