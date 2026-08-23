---
id: promptsteal-ukraine
name: PROMPTSTEAL activity against Ukraine
slug: promptsteal-ukraine
summary: A 2025 APT28 operation using malware that queried an external language model for system-discovery and document-collection commands before executing them locally.
last_reviewed: 2026-08-09
confidence: high
aliases: []
actors: [apt28]
sources: [gtig-promptsteal-2025]
related_research: []
start_date: "2025-06"
end_date: "2025"
regions: [Ukraine]
sectors: [Government]
malware: [promptsteal]
tools: []
techniques: [powershell]
draft: false
---

PROMPTSTEAL queried Qwen2.5-Coder through the Hugging Face API and blindly executed generated commands used to collect system information and selected documents.

The LLM component changed how commands were produced, but the intelligence objective remained conventional host reconnaissance and document theft.
