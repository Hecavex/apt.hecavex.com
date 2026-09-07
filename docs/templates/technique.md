---
id: stable-technique-slug
name: Human-readable technique name
slug: stable-technique-slug
summary: One sourced sentence explaining the behaviour represented by this record.
mitre_id: T0000
tactic: ATT&CK tactic name
tactics: [Canonical tactic name]
tactic_ids: [TA0000]
framework_version: "19.2"
sources:
  - source-record-id
draft: true
---

Describe only the relationship needed by published APT Notes records. Link the broader technique definition to the authoritative source rather than copying it.

Populate tactic names and IDs from the pinned framework projection, not from memory. See `scripts/sync-attack-framework.mjs` and the editorial framework policy before adding a technique.

State what evidence supports mapping the behaviour to this technique, what would be insufficient on its own, and any important scope or version limitation.
