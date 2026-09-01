import type { APIRoute } from 'astro';
import { publication } from '../../data/release';
import { loadKnowledge } from '../../utils/knowledge';
import { datasetEnvelope, jsonResponse } from '../../utils/publication';

export const GET: APIRoute = async () => {
  const knowledge = await loadKnowledge();
  const records = knowledge.balticRelevance.map(({ id, actor, evidence }) => ({
    object_type: 'baltic-relevance',
    id,
    actor: {
      id: actor.data.id,
      name: actor.data.name,
      slug: actor.data.slug,
      url: `${publication.site}/actors/${actor.data.slug}/#baltic-relevance`,
      json_url: `${publication.site}/api/actors/${actor.data.slug}.json`
    },
    country: evidence.country,
    evidence_type: evidence.evidence_type,
    summary: evidence.summary,
    sectors: evidence.sectors,
    technologies: evidence.technologies,
    campaigns: evidence.campaigns,
    techniques: evidence.techniques,
    first_observed: evidence.first_observed,
    last_observed: evidence.last_observed,
    reviewed_at: evidence.reviewed_at,
    confidence: evidence.confidence,
    sources: evidence.sources,
    why_it_matters: evidence.why_it_matters,
    url: `${publication.site}/actors/${actor.data.slug}/#baltic-relevance`
  }));

  return jsonResponse(datasetEnvelope({
    object_type: 'derived-view',
    collection: 'baltic-relevance',
    count: records.length,
    records
  }));
};
