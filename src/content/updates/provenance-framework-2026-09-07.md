---
id: provenance-framework-2026-09-07
slug: provenance-framework-2026-09-07
title: Pinned framework metadata and explicit claim provenance
summary: Corrected technique tactic membership against Enterprise ATT&CK 19.2, added claim-level provenance fields and Lithuanian access summaries.
date: 2026-09-07
update_type: dataset-release
entity_type: dataset
entity: apt-notes
sources: [mitre-g0034]
substantive: true
what_changed: All 32 techniques now expose canonical multi-valued tactic names and IDs from the exact MITRE bundle already used by Labs. T1570 is classified as Lateral Movement. Relationships expose separate claim review and locator fields. Fifty alias or subcluster names have source-specific locators, including an APT44 MITRE section pilot. Literal-name matches are explicitly labeled as name mentions, not proof of exact identity. Unresolved names retain an explicit provenance gap.
why: Correct taxonomy drift and distinguish framework membership, publisher-specific naming and procedure-level evidence without manufacturing independent review dates.
affected_fields: [tactics, tactic_ids, framework_version, source_refs, source_locators, claim_review]
affected_relationships: []
previous_version: 2.3.0
new_version: 2.4.0
release_id: apt-notes-2026-09-07-provenance-framework
editorial_note: The publication changes do not re-review every actor or procedure. Existing confidence, attribution, observation periods and stable IDs are retained. Legacy claim-level review dates and missing precise locators remain explicitly not recorded. Lithuanian pages are bounded access summaries, not full dossier translations. Citation maintenance rechecked 76 original endpoints and found 70 successful and six inconclusive responses. Nineteen newly verified post-publication archive endpoints were added. No capture was returned for the Laundry Bear Zimbra advisory or the Volexity Nearest Neighbor article, and those gaps remain explicit.
draft: false
---
