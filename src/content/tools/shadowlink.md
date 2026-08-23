---
id: shadowlink
name: ShadowLink
slug: shadowlink
summary: A Microsoft-designated persistence method that configures a compromised host as a Tor hidden service for durable remote access.
last_reviewed: 2026-08-09
confidence: high
aliases: []
actors: [apt44]
sources: [microsoft-badpilot-2025]
related_research: []
tool_type: offensive
platforms: [Windows, Tor]
techniques: [external-remote-services]
draft: false
---

ShadowLink combines Tor components with an actor-defined configuration so each compromised system receives a remotely reachable onion address.
