import type { APIRoute } from 'astro';
import { publication } from '../../data/release';
import { loadKnowledge } from '../../utils/knowledge';
import { datasetEnvelope, jsonResponse } from '../../utils/publication';

const endpoint = (path: string) => `${publication.site}${path}`;

export const GET: APIRoute = async () => {
  const knowledge = await loadKnowledge();
  const counts = {
    actors: knowledge.actors.length,
    campaigns: knowledge.campaigns.length,
    malware: knowledge.malware.length,
    tools: knowledge.tools.length,
    software: knowledge.malware.length + knowledge.tools.length,
    techniques: knowledge.techniques.length,
    sources: knowledge.sources.length,
    references: knowledge.sources.length,
    relationships: knowledge.relationships.length,
    changes: knowledge.updates.length
  };

  const collections = Object.fromEntries(Object.entries(counts).map(([name, count]) => [name, {
    count,
    json: endpoint(`/api/${name}.json`),
    csv: endpoint(`/data/${name}.csv`),
    record_template: endpoint(`/api/${name}/{slug}.json`)
  }]));

  return jsonResponse(datasetEnvelope({
    object_type: 'catalogue-index',
    canonical_api: endpoint('/api/index.json'),
    knowledge_index: endpoint('/api/knowledge.json'),
    version_manifest: endpoint('/api/version.json'),
    physical_record_count:
      knowledge.actors.length +
      knowledge.campaigns.length +
      knowledge.malware.length +
      knowledge.tools.length +
      knowledge.techniques.length +
      knowledge.sources.length +
      knowledge.updates.length,
    collections,
    derived_views: {
      baltic_relevance: {
        count: knowledge.balticRelevance.length,
        human: endpoint('/baltic-relevance/'),
        json: endpoint('/api/baltic-relevance.json'),
        csv: endpoint('/data/baltic-relevance.csv')
      }
    },
    feeds: {
      changes_atom: endpoint('/changes/feed.xml'),
      compatibility_atom: endpoint('/feed.xml')
    }
  }));
};
