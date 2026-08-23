---
id: apt28-dns-hijacking
name: APT28 router and DNS hijacking operations
slug: apt28-dns-hijacking
summary: A 2024–2026 operation that compromised SOHO routers, changed DNS settings and selectively redirected authentication traffic through adversary-controlled infrastructure.
last_reviewed: 2026-08-09
confidence: high
aliases: [Operation Masquerade]
actors: [apt28]
sources: [ncsc-apt28-dns-2026, microsoft-soho-dns-2026, doj-operation-masquerade-2026]
related_research: []
start_date: "2024"
end_date: "2026"
regions: [Europe, Africa, North America, Global]
sectors: [Government, Defence, Telecommunications, Energy, Information Technology]
malware: []
tools: []
techniques: [exploit-public-facing-application, adversary-in-the-middle, steal-application-access-token]
draft: false
---

APT28 altered DHCP and DNS settings on compromised routers so selected requests, particularly those associated with Microsoft email and authentication services, resolved to actor-controlled infrastructure. The resulting traffic position enabled credential and OAuth-token interception.

The operation was opportunistic at the router-compromise stage and selective at later stages, allowing the actor to identify users with potential intelligence value from a larger pool of exposed devices.
