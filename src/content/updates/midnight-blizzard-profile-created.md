---
id: midnight-blizzard-profile-created
slug: midnight-blizzard-profile-created
title: Midnight Blizzard profile published
summary: Added a source-bounded dossier for the SVR-linked actor also known as APT29, with cloud-access and RDP-file campaign evidence.
date: 2026-08-26
update_type: profile-created
entity_type: actor
entity: midnight-blizzard
sources: [ncsc-apt29-cloud-2024, microsoft-apt29-rdp-2024]
substantive: true
what_changed: Published identity, attribution boundary, alias caveats, European targeting, two campaign records, procedure-level technique evidence, status freshness and analytic limitations.
why: Provide a defensible Midnight Blizzard and APT29 record without flattening cross-vendor names or extending October 2024 activity into an unsupported current-status claim.
affected_fields: [identity, aliases, attribution, targeting, campaigns, techniques, status, timeline, sources]
affected_relationships:
  - rel-midnight-blizzard-uses-password-spraying-during-midnight-blizzard-cloud-access
  - rel-midnight-blizzard-uses-valid-accounts-during-midnight-blizzard-cloud-access
  - rel-midnight-blizzard-uses-steal-application-access-token-during-midnight-blizzard-cloud-access
  - rel-midnight-blizzard-uses-spearphishing-attachment-during-midnight-blizzard-rdp-spearphishing
  - rel-midnight-blizzard-uses-data-from-local-system-during-midnight-blizzard-rdp-spearphishing
new_version: 1.0.0
release_id: apt-notes-2026-08-26-european-actor-expansion
editorial_note: The source called the RDP operation ongoing on 29 October 2024; the profile does not present it as ongoing in 2026.
draft: false
---

Initial public profile release. Future substantive changes should be recorded as separate structured updates.
