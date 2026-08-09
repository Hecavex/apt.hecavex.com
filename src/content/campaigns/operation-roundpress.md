---
id: operation-roundpress
name: Operation RoundPress
slug: operation-roundpress
summary: A webmail espionage operation using emailed XSS exploits and SpyPress payloads to steal credentials, contacts and messages from selected accounts.
last_reviewed: 2026-08-09
confidence: moderate
aliases: []
actors: [apt28]
sources: [eset-operation-roundpress-2025]
related_research: []
start_date: "2023"
end_date: "2025"
regions: [Eastern Europe, Europe, Africa, South America]
sectors: [Government, Defence, Military, Transportation, Academia]
malware: [spypress]
tools: []
techniques: [spearphishing-attachment, exploit-client-execution, email-collection]
draft: false
---

Operation RoundPress targeted Roundcube, Horde, MDaemon and Zimbra webmail through malicious email content. The JavaScript payload executed when a target opened the message in a vulnerable webmail client.

APT Notes retains ESET's medium-confidence attribution to Sednit. Similar targeting and infrastructure support the assessment, but they do not make the campaign boundary certain.
