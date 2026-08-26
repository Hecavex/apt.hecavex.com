import type { APIRoute } from 'astro';
import { publication } from '../../data/release';
import { loadKnowledge } from '../../utils/knowledge';
import {
  datasetEnvelope,
  jsonResponse,
  serializeEntry,
  serializeRelationship,
  serializeUpdate
} from '../../utils/publication';

type ExportCollection =
  | 'campaigns'
  | 'malware'
  | 'tools'
  | 'software'
  | 'techniques'
  | 'sources'
  | 'references'
  | 'relationships'
  | 'changes';

const byId = (left: any, right: any) => String(left.id).localeCompare(String(right.id));

export async function getStaticPaths() {
  const knowledge = await loadKnowledge();
  const campaigns = knowledge.campaigns.map((entry) => serializeEntry('campaigns', entry)).sort(byId);
  const malware = knowledge.malware.map((entry) => serializeEntry('malware', entry)).sort(byId);
  const tools = knowledge.tools.map((entry) => serializeEntry('tools', entry)).sort(byId);
  const techniques = knowledge.techniques.map((entry) => serializeEntry('techniques', entry)).sort(byId);
  const sources = knowledge.sources
    .map((entry) => ({ ...serializeEntry('sources', entry), source_url: entry.data.url }))
    .sort(byId);
  const relationships = knowledge.relationships.map(serializeRelationship).sort(byId);
  const changes = knowledge.updates
    .map(serializeUpdate)
    .sort((left, right) => String(right.date).localeCompare(String(left.date)) || byId(left, right));
  const software = [
    ...malware.map((record) => ({
      ...record,
      software_class: 'malware',
      software_json_url: `${publication.site}/api/software/${record.slug}.json`
    })),
    ...tools.map((record) => ({
      ...record,
      software_class: 'tool',
      software_json_url: `${publication.site}/api/software/${record.slug}.json`
    }))
  ].sort(byId);
  const references = sources.map((record) => ({
    ...record,
    reference_json_url: `${publication.site}/api/references/${record.slug}.json`
  }));

  const exports: Record<ExportCollection, any[]> = {
    campaigns,
    malware,
    tools,
    software,
    techniques,
    sources,
    references,
    relationships,
    changes
  };

  return (Object.entries(exports) as [ExportCollection, any[]][]).map(([collection, records]) => ({
    params: { collection },
    props: { collection, records }
  }));
}

export const GET: APIRoute = ({ props }) => jsonResponse(datasetEnvelope({
  object_type: 'collection',
  collection: props.collection,
  ...(props.collection === 'references' ? { canonical_collection: 'sources' } : {}),
  count: props.records.length,
  records: props.records
}));
