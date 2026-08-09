---
id: outlook-identity-collection
name: Outlook identity and token collection
slug: outlook-identity-collection
summary: Highly targeted Outlook activity using AUTHENTIC ANTICS to intercept credentials and OAuth tokens while blending into legitimate Microsoft service traffic.
last_reviewed: 2026-08-09
confidence: high
aliases: []
actors: [apt28]
sources: [ncsc-authentic-antics-2025]
related_research: []
start_date: "2023"
end_date: "2025"
regions: [Europe]
sectors: [Government, Strategic intelligence targets]
malware: [authentic-antics]
tools: []
techniques: [steal-application-access-token, com-hijacking, email-collection]
draft: false
---

AUTHENTIC ANTICS runs inside Outlook, periodically presents controlled Microsoft authentication prompts and intercepts both credentials and OAuth tokens. It sends encrypted collection through the victim's mailbox without saving the message to Sent Items.

The public malware analysis does not identify the initial-access mechanism, so this record does not infer one.
