---
id: apt31-claim-assurance-2026-09-10
slug: apt31-claim-assurance-2026-09-10
title: APT31 tracking-mail reconnaissance and claim assurance corrected
summary: Replaced the tracking-only Initial Access mapping with reconnaissance and recorded the limits of two source-compared legal allegations.
date: 2026-09-10
update_type: correction
entity_type: actor
entity: apt31
sources: [doj-apt31-2024]
substantive: true
what_changed: Replaced T1566 with T1598.003 for tracking-email profiling; retained T1114.002 mailbox collection. Both procedure claims now have moderate confidence, exact locators, source-dependence and alternative explanations, and explicit unknown activity dates.
why: The described tracking-only procedure gathers information before later hacking. The record does not establish the independent corroboration required by the high-confidence definition. This is an AI-assisted source comparison, not a new human claim review.
affected_fields: [technique_evidence, techniques]
affected_relationships: [rel-apt31-uses-phishing-during-apt31-global-intrusion-program, rel-apt31-uses-spearphishing-for-information-link-during-apt31-global-intrusion-program, rel-apt31-uses-remote-email-collection-during-apt31-global-intrusion-program]
previous_version: 1.0.0
new_version: 1.1.0
release_id: apt-notes-2026-09-10-claim-assurance
editorial_note: Actor human-review date remains 26 August 2026. Other legacy ratings are retained with their unrecorded rationale disclosed; no blanket downgrade or human-review backfill occurred.
draft: false
---

The source's Hacking Scheme section distinguishes recipient profiling from subsequent intrusion. A separate paragraph alleges malware-link emails, but it is not silently added as another mapping to maintain apparent technique coverage. The programme's 2010 start and the announcement's 2024 date do not establish exact activity bounds for each procedure.

The former relationship `rel-apt31-uses-phishing-during-apt31-global-intrusion-program` is replaced by `rel-apt31-uses-spearphishing-for-information-link-during-apt31-global-intrusion-program`. Historical releases retain the original record. Independent human adjudication remains unrecorded.
