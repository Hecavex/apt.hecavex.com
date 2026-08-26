---
id: star-blizzard-profile-created
slug: star-blizzard-profile-created
title: Star Blizzard profile published
summary: Added a source-bounded dossier for the FSB Centre 18-linked spearphishing actor, separating government assessment, legal allegations and vendor observations.
date: 2026-08-26
update_type: profile-created
entity_type: actor
entity: star-blizzard
sources: [ncsc-star-blizzard-2023, doj-star-blizzard-2023, microsoft-star-blizzard-whatsapp-2025]
substantive: true
what_changed: Published identity, attribution boundary, European targeting, two campaign records, procedure-level technique evidence, status freshness and analytic limitations.
why: Provide a defensible Star Blizzard record without flattening cross-vendor aliases or presenting criminal allegations as adjudicated fact.
affected_fields: [identity, aliases, attribution, targeting, campaigns, tools, techniques, status, timeline, sources]
affected_relationships:
  - rel-star-blizzard-uses-spearphishing-link-during-star-blizzard-credential-spearphishing
  - rel-star-blizzard-uses-spearphishing-attachment-during-star-blizzard-credential-spearphishing
  - rel-star-blizzard-uses-adversary-in-the-middle-during-star-blizzard-credential-spearphishing
  - rel-star-blizzard-uses-web-session-cookie-during-star-blizzard-credential-spearphishing
  - rel-star-blizzard-uses-valid-accounts-during-star-blizzard-credential-spearphishing
  - rel-star-blizzard-uses-remote-email-collection-during-star-blizzard-credential-spearphishing
  - rel-star-blizzard-uses-spearphishing-link-during-star-blizzard-whatsapp-device-linking
new_version: 1.0.0
release_id: apt-notes-2026-08-26-european-actor-expansion
editorial_note: Current status is bounded to the last actor-specific first-party observation in November 2024; no 2026 activity is inferred.
draft: false
---

Initial public profile release. Future substantive changes should be recorded as separate structured updates.
