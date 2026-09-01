import type { APIRoute } from 'astro';
import { loadKnowledge } from '../../utils/knowledge';
import { datasetEnvelope, jsonResponse, serializeEntry } from '../../utils/publication';

export const GET: APIRoute = async () => {
  const { actors } = await loadKnowledge();
  const records = actors
    .map((entry) => {
      const record = serializeEntry('actors', entry);
      return {
        object_type: record.object_type,
        id: record.id,
        name: record.name,
        slug: record.slug,
        aliases: record.aliases,
        suspected_origins: record.suspected_origins,
        status: record.status,
        motivations: record.motivations,
        confidence: record.confidence,
        summary: record.summary,
        baltic_relevance: record.baltic_relevance,
        last_observed: record.last_observed,
        created_at: record.created_at,
        modified_at: record.modified_at,
        last_reviewed_at: record.last_reviewed_at,
        version: record.version,
        deprecated: record.deprecated,
        revoked: record.revoked,
        superseded_by: record.superseded_by,
        campaigns: record.campaigns,
        malware: record.malware,
        tools: record.tools,
        techniques: record.techniques,
        sources: record.sources,
        updates: record.updates,
        url: record.url,
        json_url: record.json_url
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));

  return jsonResponse(datasetEnvelope({
    object_type: 'collection',
    collection: 'actors',
    count: records.length,
    records,
    // Compatibility alias retained for clients of the original actor-only API.
    actors: records
  }));
};
