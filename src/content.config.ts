import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { actorStatuses, actorTypes, aliasRelationships, attributionStatuses, confidenceValues, motivations, sourceTypes, updateTypes } from './data/vocabularies';

const confidence = z.enum(confidenceValues);
const base = z.object({ id: z.string().min(1), name: z.string().min(1), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), summary: z.string().min(20), draft: z.boolean().default(true) });
const ref = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const actors = defineCollection({
  loader: glob({ base: './src/content/actors', pattern: '**/*.{md,mdx}' }),
  schema: base.extend({
    actor_types: z.array(z.enum(actorTypes)).min(1), status: z.enum(actorStatuses), suspected_origins: z.array(z.string()).default([]), motivations: z.array(z.enum(motivations)).min(1),
    active_since: z.string(), last_observed: z.string().default(''), confidence, last_reviewed: z.coerce.date(), authors: z.array(z.string()).min(1),
    mission: z.string().default(''), current_assessment: z.string().default(''),
    aliases: z.array(z.object({ name: z.string(), source: z.string(), relationship: z.enum(aliasRelationships), confidence, scope: z.string().default(''), first_seen: z.string().default(''), last_seen: z.string().default(''), notes: z.string().default('') })).default([]),
    parent_entities: z.array(z.object({ name: z.string(), entity_type: z.string(), relationship: z.string(), confidence, source: ref, notes: z.string().default('') })).default([]),
    subclusters: z.array(z.object({ name: z.string(), source: z.string(), relationship: z.enum(aliasRelationships), confidence, notes: z.string().default('') })).default([]),
    attribution: z.array(z.object({ claim: z.string(), attributed_entity: z.string(), source: ref, source_type: z.enum(sourceTypes), published_at: z.coerce.date(), confidence, status: z.enum(attributionStatuses), notes: z.string().default('') })).default([]),
    targeting: z.object({ regions: z.array(z.string()).default([]), countries: z.array(z.string()).default([]), sectors: z.array(z.string()).default([]), organisations: z.array(z.string()).default([]) }),
    campaigns: z.array(ref).default([]), malware: z.array(ref).default([]), tools: z.array(ref).default([]), techniques: z.array(ref).default([]),
    vulnerabilities: z.array(z.object({ cve: z.string().regex(/^CVE-\d{4}-\d{4,}$/), product: z.string(), role: z.string(), campaign: ref.optional(), first_observed: z.string().default(''), confidence, source: ref, notes: z.string().default('') })).default([]),
    technique_evidence: z.array(z.object({ technique: ref, campaign: ref.optional(), first_observed: z.string().default(''), last_observed: z.string().default(''), confidence, sources: z.array(ref).min(1), notes: z.string().default('') })).default([]),
    operational_timeline: z.array(z.object({ date: z.string(), title: z.string(), summary: z.string(), confidence, sources: z.array(ref).min(1) })).default([]),
    external_identifiers: z.object({ mitre_attack: z.string().regex(/^G\d{4}$/).or(z.literal('')), other: z.array(z.string()).default([]) }), related_research: z.array(z.object({ title: z.string(), url: z.url() })).default([]), sources: z.array(ref).min(1), updates: z.array(ref).default([]), featured: z.boolean().default(false)
  })
});

const entitySchema = base.extend({ last_reviewed: z.coerce.date(), confidence, aliases: z.array(z.string()).default([]), actors: z.array(ref).default([]), sources: z.array(ref).min(1), related_research: z.array(z.object({ title: z.string(), url: z.url() })).default([]) });
const campaigns = defineCollection({ loader: glob({ base: './src/content/campaigns', pattern: '**/*.{md,mdx}' }), schema: entitySchema.extend({ start_date: z.string(), end_date: z.string().default(''), regions: z.array(z.string()).default([]), sectors: z.array(z.string()).default([]), malware: z.array(ref).default([]), tools: z.array(ref).default([]), techniques: z.array(ref).default([]) }) });
const malware = defineCollection({ loader: glob({ base: './src/content/malware', pattern: '**/*.{md,mdx}' }), schema: entitySchema.extend({ family_type: z.string(), platforms: z.array(z.string()).default([]), campaigns: z.array(ref).default([]), techniques: z.array(ref).default([]) }) });
const tools = defineCollection({ loader: glob({ base: './src/content/tools', pattern: '**/*.{md,mdx}' }), schema: entitySchema.extend({ tool_type: z.enum(['legitimate', 'dual-use', 'offensive', 'unknown']), platforms: z.array(z.string()).default([]), techniques: z.array(ref).default([]) }) });
const techniques = defineCollection({ loader: glob({ base: './src/content/techniques', pattern: '**/*.{md,mdx}' }), schema: base.extend({ mitre_id: z.string().regex(/^T\d{4}(?:\.\d{3})?$/), tactic: z.string(), sources: z.array(ref).min(1) }) });
const sources = defineCollection({ loader: glob({ base: './src/content/sources', pattern: '**/*.{md,mdx}' }), schema: base.pick({ id: true, name: true, slug: true, draft: true }).extend({ title: z.string(), publisher: z.string(), authors: z.array(z.string()).default([]), published_at: z.coerce.date(), accessed_at: z.coerce.date(), url: z.url(), archived_url: z.url().optional(), source_type: z.enum(sourceTypes), language: z.string().length(2), notes: z.string().default('') }) });
const updates = defineCollection({ loader: glob({ base: './src/content/updates', pattern: '**/*.{md,mdx}' }), schema: z.object({ id: z.string(), slug: z.string(), title: z.string(), summary: z.string(), date: z.coerce.date(), update_type: z.enum(updateTypes), entity_type: z.enum(['actor', 'campaign', 'malware', 'tool', 'technique', 'source']), entity: ref, sources: z.array(ref).default([]), substantive: z.boolean().default(true), draft: z.boolean().default(true) }) });

export const collections = { actors, campaigns, malware, tools, techniques, sources, updates };
