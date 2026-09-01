import { publicEntries, byId, type CollectionName } from './content';

export type EntityCollection = Exclude<CollectionName, 'updates'>;
export type EntityType = 'actor' | 'campaign' | 'malware' | 'tool' | 'technique' | 'source';

export const entityRoutes: Record<EntityCollection, string> = {
  actors: '/actors/',
  campaigns: '/campaigns/',
  malware: '/malware/',
  tools: '/tools/',
  techniques: '/techniques/',
  sources: '/sources/'
};

export const entityTypes: Record<EntityCollection, EntityType> = {
  actors: 'actor',
  campaigns: 'campaign',
  malware: 'malware',
  tools: 'tool',
  techniques: 'technique',
  sources: 'source'
};

export const typeCollections: Record<EntityType, EntityCollection> = {
  actor: 'actors',
  campaign: 'campaigns',
  malware: 'malware',
  tool: 'tools',
  technique: 'techniques',
  source: 'sources'
};

export const entityHref = (collection: EntityCollection, slug: string) => `${entityRoutes[collection]}${slug}/`;
export const recordName = (entry: any) => entry.data.name ?? entry.data.title ?? entry.data.id;

export interface BalticRelevanceRecord {
  id: string;
  actor: any;
  evidence: any;
}

export const deriveBalticRelevance = (actors: any[]): BalticRelevanceRecord[] => actors
  .flatMap((actor) => (actor.data.baltic_relevance ?? []).map((evidence: any) => ({
    id: evidence.id,
    actor,
    evidence
  })))
  .sort((left, right) => left.evidence.country.localeCompare(right.evidence.country)
    || left.actor.data.name.localeCompare(right.actor.data.name)
    || left.id.localeCompare(right.id));

export interface RelationshipRecord {
  id: string;
  relationship_type: 'uses';
  relationship_label: 'actor-uses-technique';
  source_entity: { type: 'actor'; id: string; name: string; url: string };
  target_entity: { type: 'technique'; id: string; name: string; external_id: string; url: string };
  campaign_context?: { id: string; name: string; url: string };
  evidence: string;
  references: string[];
  confidence: string;
  first_observed: string;
  last_observed: string;
  created_at: string;
  modified_at: string;
  last_reviewed_at: string;
  version: string;
  change_reason: string;
  editorial_note: string;
  deprecated: boolean;
  revoked: boolean;
  scope_note: string;
  url: string;
  json_url: string;
}

const iso = (value: Date | string) => new Date(value).toISOString();

export const deriveRelationships = (
  actors: any[],
  techniques: any[],
  campaigns: any[],
  sources: any[]
): RelationshipRecord[] => {
  const isCurrent = (entry: any) => entry
    && entry.data.deprecated !== true
    && entry.data.revoked !== true;
  const techniqueMap = byId(techniques.filter(isCurrent));
  const campaignMap = byId(campaigns.filter(isCurrent));
  const sourceMap = byId(sources.filter(isCurrent));
  const records: RelationshipRecord[] = [];

  for (const actor of actors) {
    if (!isCurrent(actor)) continue;
    for (const evidence of actor.data.technique_evidence ?? []) {
      const technique: any = techniqueMap.get(evidence.technique);
      if (!technique) continue;
      const campaign: any = evidence.campaign ? campaignMap.get(evidence.campaign) : undefined;
      if (evidence.campaign && !campaign) continue;
      const references = [...(evidence.sources ?? [])].sort();
      if (!references.length || references.some((source) => !sourceMap.has(source))) continue;
      const id = [
        'rel', actor.data.slug, 'uses', technique.data.slug,
        ...(campaign ? ['during', campaign.data.slug] : [])
      ].join('-');

      records.push({
        id,
        relationship_type: 'uses',
        relationship_label: 'actor-uses-technique',
        source_entity: {
          type: 'actor', id: actor.data.id, name: actor.data.name,
          url: entityHref('actors', actor.data.slug)
        },
        target_entity: {
          type: 'technique', id: technique.data.id, name: technique.data.name,
          external_id: technique.data.mitre_id,
          url: entityHref('techniques', technique.data.slug)
        },
        campaign_context: campaign ? {
          id: campaign.data.id, name: campaign.data.name,
          url: entityHref('campaigns', campaign.data.slug)
        } : undefined,
        evidence: evidence.notes,
        references,
        confidence: evidence.confidence,
        first_observed: evidence.first_observed,
        last_observed: evidence.last_observed,
        created_at: iso(actor.data.created_at),
        modified_at: iso(actor.data.modified_at),
        last_reviewed_at: iso(actor.data.last_reviewed),
        version: actor.data.version,
        change_reason: actor.data.change_reason,
        editorial_note: evidence.editorial_note,
        deprecated: actor.data.deprecated,
        revoked: actor.data.revoked,
        scope_note: 'Published from explicit procedure evidence in an APT Notes actor dossier. Broader catalogue associations are not promoted to sourced relationships.',
        url: `/relationships/#${id}`,
        json_url: `/api/relationships/${id}.json`
      });
    }
  }

  return records.sort((left, right) => left.id.localeCompare(right.id));
};

export interface ReferenceUsage {
  entity_type: EntityType | 'change' | 'relationship';
  entity_id: string;
  entity_name: string;
  entity_url: string;
  usage_kind: string;
  anchor?: string;
}

const addUsage = (index: Map<string, ReferenceUsage[]>, source: string, usage: ReferenceUsage) => {
  const key = `${usage.entity_type}:${usage.entity_id}:${usage.usage_kind}:${usage.anchor ?? ''}`;
  const list = index.get(source) ?? [];
  if (!list.some((item) => `${item.entity_type}:${item.entity_id}:${item.usage_kind}:${item.anchor ?? ''}` === key)) {
    list.push(usage);
    index.set(source, list);
  }
};

export const buildReferenceUsage = (
  collections: Record<EntityCollection, any[]>,
  updates: any[],
  relationships: RelationshipRecord[]
) => {
  const usage = new Map<string, ReferenceUsage[]>();

  for (const collection of Object.keys(collections) as EntityCollection[]) {
    if (collection === 'sources') continue;
    for (const entry of collections[collection]) {
      const base: Omit<ReferenceUsage, 'usage_kind'> = {
        entity_type: entityTypes[collection], entity_id: entry.data.id,
        entity_name: recordName(entry), entity_url: entityHref(collection, entry.data.slug)
      };
      for (const source of entry.data.sources ?? []) addUsage(usage, source, { ...base, usage_kind: 'record source', anchor: 'sources' });
      for (const statement of entry.data.attribution ?? []) addUsage(usage, statement.source, { ...base, usage_kind: 'attribution statement', anchor: 'attribution-statements' });
      for (const parent of entry.data.parent_entities ?? []) addUsage(usage, parent.source, { ...base, usage_kind: 'parent-entity claim', anchor: 'naming-and-aliases' });
      for (const vulnerability of entry.data.vulnerabilities ?? []) addUsage(usage, vulnerability.source, { ...base, usage_kind: 'vulnerability evidence', anchor: 'vulnerabilities' });
      for (const evidence of entry.data.technique_evidence ?? []) for (const source of evidence.sources ?? []) addUsage(usage, source, { ...base, usage_kind: 'procedure evidence', anchor: 'techniques' });
      for (const event of entry.data.operational_timeline ?? []) for (const source of event.sources ?? []) addUsage(usage, source, { ...base, usage_kind: 'timeline evidence', anchor: 'operational-timeline' });
      for (const relevance of entry.data.baltic_relevance ?? []) for (const source of relevance.sources ?? []) addUsage(usage, source, { ...base, usage_kind: 'Baltic relevance evidence', anchor: 'baltic-relevance' });
    }
  }

  for (const update of updates) for (const source of update.data.sources ?? []) {
    addUsage(usage, source, {
      entity_type: 'change', entity_id: update.data.id, entity_name: update.data.title,
      entity_url: `/changes/#${update.data.slug}`, usage_kind: 'change evidence'
    });
  }

  for (const relationship of relationships) for (const source of relationship.references) {
    addUsage(usage, source, {
      entity_type: 'relationship', entity_id: relationship.id,
      entity_name: `${relationship.source_entity.name} uses ${relationship.target_entity.name}`,
      entity_url: relationship.url, usage_kind: 'relationship evidence'
    });
  }

  for (const list of usage.values()) list.sort((left, right) => left.entity_name.localeCompare(right.entity_name));
  return usage;
};

export const loadKnowledge = async () => {
  const loaded = await Promise.all([
    publicEntries('actors'), publicEntries('campaigns'), publicEntries('malware'),
    publicEntries('tools'), publicEntries('techniques'), publicEntries('sources'),
    publicEntries('updates')
  ]);
  const actors = loaded[0] as any[];
  const campaigns = loaded[1] as any[];
  const malware = loaded[2] as any[];
  const tools = loaded[3] as any[];
  const techniques = loaded[4] as any[];
  const sources = loaded[5] as any[];
  const updates = loaded[6] as any[];
  const collections: Record<EntityCollection, any[]> = { actors, campaigns, malware, tools, techniques, sources };
  const relationships = deriveRelationships(actors, techniques, campaigns, sources);
  const balticRelevance = deriveBalticRelevance(actors);
  return {
    ...collections,
    updates,
    relationships,
    balticRelevance,
    maps: Object.fromEntries(Object.entries(collections).map(([key, entries]) => [key, byId(entries)])),
    referenceUsage: buildReferenceUsage(collections, updates, relationships)
  };
};
