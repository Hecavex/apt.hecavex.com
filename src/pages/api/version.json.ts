import type { APIRoute } from 'astro';
import { publication, release } from '../../data/release';
import { loadKnowledge } from '../../utils/knowledge';
import { datasetEnvelope, jsonResponse } from '../../utils/publication';

export const GET: APIRoute = async () => {
  const knowledge = await loadKnowledge();

  return jsonResponse(datasetEnvelope({
    object_type: 'release-manifest',
    previous_version: release.previousVersion,
    compatibility: {
      minimum_schema_version: release.schemaVersion,
      serialization: 'UTF-8 JSON with stable key order and deterministic record ordering',
      breaking_change_policy: 'A schema major-version change may rename or remove fields.'
    },
    counts: {
      actors: knowledge.actors.length,
      campaigns: knowledge.campaigns.length,
      malware: knowledge.malware.length,
      tools: knowledge.tools.length,
      software: knowledge.malware.length + knowledge.tools.length,
      techniques: knowledge.techniques.length,
      sources: knowledge.sources.length,
      references: knowledge.sources.length,
      relationships: knowledge.relationships.length,
      changes: knowledge.updates.length,
      baltic_relevance: knowledge.balticRelevance.length
    },
    assets: {
      index: `${publication.site}/api/index.json`,
      changes_atom: `${publication.site}/changes/feed.xml`,
      changes_json: `${publication.site}/api/changes.json`,
      relationships_json: `${publication.site}/api/relationships.json`,
      baltic_relevance_json: `${publication.site}/api/baltic-relevance.json`,
      baltic_relevance_csv: `${publication.site}/data/baltic-relevance.csv`
    }
  }));
};
