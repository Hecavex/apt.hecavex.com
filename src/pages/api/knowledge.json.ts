import type { APIRoute } from 'astro';
import { publication } from '../../data/release';
import { loadKnowledge } from '../../utils/knowledge';
import { datasetEnvelope, jsonResponse } from '../../utils/publication';

const iso = (value: Date | string) => new Date(value).toISOString();
const link = (collection: string, slug: string) => ({
  url: `${publication.site}/${collection}/${slug}/`,
  json_url: `${publication.site}/api/${collection}/${slug}.json`
});
const base = (type: string, group: string, data: any) => ({
  type,
  group,
  id: data.id,
  slug: data.slug,
  name: data.name,
  title: data.title ?? data.name,
  summary: data.summary ?? data.notes ?? data.title ?? data.name,
  aliases: data.aliases ?? [],
  publisher: null as string | null,
  mitre_id: null as string | null,
  tactic: null as string | null,
  confidence: data.confidence ?? null,
  last_reviewed: data.last_reviewed ? iso(data.last_reviewed) : null
});

export const GET: APIRoute = async () => {
  const knowledge = await loadKnowledge();
  const records = [
    ...knowledge.campaigns.map(({ data }) => ({
      ...base('campaign', 'campaigns', data),
      start_date: data.start_date,
      end_date: data.end_date,
      regions: data.regions,
      sectors: data.sectors,
      actor_ids: data.actors,
      malware_ids: data.malware,
      tool_ids: data.tools,
      technique_ids: data.techniques,
      ...link('campaigns', data.slug)
    })),
    ...knowledge.malware.map(({ data }) => ({
      ...base('malware', 'software', data),
      family_type: data.family_type,
      platforms: data.platforms,
      actor_ids: data.actors,
      campaign_ids: data.campaigns,
      technique_ids: data.techniques,
      ...link('malware', data.slug)
    })),
    ...knowledge.tools.map(({ data }) => ({
      ...base('tool', 'software', data),
      tool_type: data.tool_type,
      platforms: data.platforms,
      actor_ids: data.actors,
      technique_ids: data.techniques,
      ...link('tools', data.slug)
    })),
    ...knowledge.techniques.map(({ data }) => ({
      ...base('technique', 'techniques', data),
      mitre_id: data.mitre_id,
      tactic: data.tactic,
      ...link('techniques', data.slug)
    })),
    ...knowledge.sources.map(({ data }) => ({
      ...base('source', 'references', data),
      publisher: data.publisher,
      source_type: data.source_type,
      published_at: iso(data.published_at),
      accessed_at: iso(data.accessed_at),
      source_url: data.url,
      link_status: data.link_status,
      ...link('sources', data.slug)
    }))
  ].sort((left, right) => left.type.localeCompare(right.type) || left.id.localeCompare(right.id));

  return jsonResponse(datasetEnvelope({
    object_type: 'knowledge-index',
    count: records.length,
    records
  }));
};
