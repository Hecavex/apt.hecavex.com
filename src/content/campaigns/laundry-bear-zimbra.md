---
id: laundry-bear-zimbra
name: Laundry Bear Zimbra campaign
slug: laundry-bear-zimbra
summary: A targeted email-collection campaign exploiting Zimbra CVE-2025-66376 through a malicious message that executes when viewed in a vulnerable webmail client.
last_reviewed: 2026-08-14
confidence: high
aliases: []
actors: [void-blizzard]
sources: [joint-laundry-bear-zimbra-2026]
related_research: []
start_date: "2025-07"
end_date: "ongoing when reported in 2026-07"
regions: [Europe, North America, Ukraine, NATO member states]
sectors: [Defence Industrial Base, Government, Education, Energy, Law Enforcement, Media, NGOs, Technology]
malware: [ulej]
tools: [flowerbed]
techniques: [phishing, exploit-client-execution, email-collection, web-session-cookie]
draft: false
---

The view-based exploit attempted to collect 90 days of email, Global Address List data, credentials, two-factor authentication material and application passcodes. The public advisory describes Ulej as the client capability and Flowerbed as the receiving and aggregation framework.
