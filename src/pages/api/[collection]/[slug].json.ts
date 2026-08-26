import type { APIRoute } from 'astro';
import { publication } from '../../../data/release';
import { loadKnowledge } from '../../../utils/knowledge';
import {
  datasetEnvelope,
  jsonResponse,
  serializeEntry,
  serializeRelationship,
  serializeUpdate
} from '../../../utils/publication';

interface RecordPath {
  collection: string;
  slug: string;
  record: Record<string, unknown>;
  canonicalCollection?: string;
}

const path = ({ collection, slug, record, canonicalCollection }: RecordPath) => ({
  params: { collection, slug },
  props: { collection, record, canonicalCollection }
});

export async function getStaticPaths() {
  const knowledge = await loadKnowledge();
  const records: ReturnType<typeof path>[] = [];

  for (const entry of knowledge.campaigns) {
    records.push(path({ collection: 'campaigns', slug: entry.data.slug, record: serializeEntry('campaigns', entry) }));
  }
  for (const entry of knowledge.malware) {
    const record = serializeEntry('malware', entry);
    records.push(path({ collection: 'malware', slug: entry.data.slug, record }));
    records.push(path({
      collection: 'software',
      slug: entry.data.slug,
      record: {
        ...record,
        software_class: 'malware',
        software_json_url: `${publication.site}/api/software/${entry.data.slug}.json`
      },
      canonicalCollection: 'malware'
    }));
  }
  for (const entry of knowledge.tools) {
    const record = serializeEntry('tools', entry);
    records.push(path({ collection: 'tools', slug: entry.data.slug, record }));
    records.push(path({
      collection: 'software',
      slug: entry.data.slug,
      record: {
        ...record,
        software_class: 'tool',
        software_json_url: `${publication.site}/api/software/${entry.data.slug}.json`
      },
      canonicalCollection: 'tools'
    }));
  }
  for (const entry of knowledge.techniques) {
    records.push(path({ collection: 'techniques', slug: entry.data.slug, record: serializeEntry('techniques', entry) }));
  }
  for (const entry of knowledge.sources) {
    const record = { ...serializeEntry('sources', entry), source_url: entry.data.url };
    records.push(path({ collection: 'sources', slug: entry.data.slug, record }));
    records.push(path({
      collection: 'references',
      slug: entry.data.slug,
      record: {
        ...record,
        reference_json_url: `${publication.site}/api/references/${entry.data.slug}.json`
      },
      canonicalCollection: 'sources'
    }));
  }
  for (const relationship of knowledge.relationships) {
    records.push(path({ collection: 'relationships', slug: relationship.id, record: serializeRelationship(relationship) }));
  }
  for (const update of knowledge.updates) {
    records.push(path({ collection: 'changes', slug: update.data.slug, record: serializeUpdate(update) }));
  }

  return records.sort((left, right) => {
    const byCollection = left.params.collection.localeCompare(right.params.collection);
    return byCollection || left.params.slug.localeCompare(right.params.slug);
  });
}

export const GET: APIRoute = ({ props }) => jsonResponse(datasetEnvelope({
  object_type: 'record',
  collection: props.collection,
  ...(props.canonicalCollection ? { canonical_collection: props.canonicalCollection } : {}),
  record: props.record
}));
