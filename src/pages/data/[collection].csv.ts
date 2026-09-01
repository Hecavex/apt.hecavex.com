import type { APIRoute } from 'astro';
import { publication } from '../../data/release';
import { loadKnowledge } from '../../utils/knowledge';
import { csv, csvResponse } from '../../utils/publication';

interface CsvExport {
  headers: string[];
  rows: unknown[][];
}

const iso = (value: Date | string | undefined) => value ? new Date(value).toISOString() : '';
const list = (values: unknown[] | undefined) => (values ?? []).join(' | ');
const sorted = <T extends { data: { id: string } }>(entries: T[]) =>
  [...entries].sort((left, right) => left.data.id.localeCompare(right.data.id));

export async function getStaticPaths() {
  const knowledge = await loadKnowledge();

  const actors: CsvExport = {
    headers: [
      'id', 'name', 'slug', 'status', 'actor_types', 'aliases', 'suspected_origins',
      'motivations', 'active_since', 'last_observed', 'confidence', 'last_reviewed_at',
      'campaign_ids', 'malware_ids', 'tool_ids', 'technique_ids', 'source_ids',
      'version', 'deprecated', 'revoked', 'url', 'json_url'
    ],
    rows: sorted(knowledge.actors).map(({ data }) => [
      data.id, data.name, data.slug, data.status, list(data.actor_types),
      list(data.aliases.map((alias: any) => alias.name)), list(data.suspected_origins),
      list(data.motivations), data.active_since, data.last_observed, data.confidence,
      iso(data.last_reviewed),
      list(data.campaigns), list(data.malware), list(data.tools),
      list(data.techniques), list(data.sources), data.version, data.deprecated, data.revoked,
      `${publication.site}/actors/${data.slug}/`, `${publication.site}/api/actors/${data.slug}.json`
    ])
  };

  const balticRelevance: CsvExport = {
    headers: [
      'id', 'actor_id', 'actor_name', 'actor_slug', 'country', 'evidence_type',
      'summary', 'sector_context', 'technology_context', 'campaign_ids', 'technique_ids',
      'first_observed', 'last_observed', 'reviewed_at', 'confidence', 'source_ids',
      'why_it_matters', 'url', 'actor_json_url'
    ],
    rows: knowledge.balticRelevance.map(({ id, actor, evidence }) => [
      id, actor.data.id, actor.data.name, actor.data.slug, evidence.country,
      evidence.evidence_type, evidence.summary, list(evidence.sectors), list(evidence.technologies),
      list(evidence.campaigns), list(evidence.techniques), evidence.first_observed,
      evidence.last_observed, evidence.reviewed_at, evidence.confidence, list(evidence.sources),
      evidence.why_it_matters, `${publication.site}/actors/${actor.data.slug}/#baltic-relevance`,
      `${publication.site}/api/actors/${actor.data.slug}.json`
    ])
  };

  const campaigns: CsvExport = {
    headers: [
      'id', 'name', 'slug', 'aliases', 'summary', 'start_date', 'end_date', 'regions',
      'sectors', 'actor_ids', 'malware_ids', 'tool_ids', 'technique_ids', 'confidence',
      'last_reviewed_at', 'source_ids', 'version', 'deprecated', 'revoked', 'url', 'json_url'
    ],
    rows: sorted(knowledge.campaigns).map(({ data }) => [
      data.id, data.name, data.slug, list(data.aliases), data.summary, data.start_date,
      data.end_date, list(data.regions), list(data.sectors), list(data.actors),
      list(data.malware), list(data.tools), list(data.techniques), data.confidence,
      iso(data.last_reviewed), list(data.sources), data.version, data.deprecated, data.revoked,
      `${publication.site}/campaigns/${data.slug}/`, `${publication.site}/api/campaigns/${data.slug}.json`
    ])
  };

  const malware: CsvExport = {
    headers: [
      'id', 'name', 'slug', 'software_class', 'family_type', 'aliases', 'summary', 'platforms',
      'actor_ids', 'campaign_ids', 'technique_ids', 'confidence', 'last_reviewed_at',
      'source_ids', 'version', 'deprecated', 'revoked', 'url', 'json_url'
    ],
    rows: sorted(knowledge.malware).map(({ data }) => [
      data.id, data.name, data.slug, 'malware', data.family_type, list(data.aliases), data.summary,
      list(data.platforms), list(data.actors), list(data.campaigns), list(data.techniques),
      data.confidence, iso(data.last_reviewed), list(data.sources), data.version, data.deprecated,
      data.revoked, `${publication.site}/malware/${data.slug}/`, `${publication.site}/api/malware/${data.slug}.json`
    ])
  };

  const tools: CsvExport = {
    headers: [
      'id', 'name', 'slug', 'software_class', 'tool_type', 'aliases', 'summary', 'platforms',
      'actor_ids', 'technique_ids', 'confidence', 'last_reviewed_at', 'source_ids',
      'version', 'deprecated', 'revoked', 'url', 'json_url'
    ],
    rows: sorted(knowledge.tools).map(({ data }) => [
      data.id, data.name, data.slug, 'tool', data.tool_type, list(data.aliases), data.summary,
      list(data.platforms), list(data.actors), list(data.techniques), data.confidence,
      iso(data.last_reviewed), list(data.sources), data.version, data.deprecated, data.revoked,
      `${publication.site}/tools/${data.slug}/`, `${publication.site}/api/tools/${data.slug}.json`
    ])
  };

  const software: CsvExport = {
    headers: [
      'id', 'name', 'slug', 'software_class', 'software_type', 'aliases', 'summary',
      'platforms', 'actor_ids', 'campaign_ids', 'technique_ids', 'confidence',
      'last_reviewed_at', 'source_ids', 'version', 'deprecated', 'revoked', 'url', 'json_url'
    ],
    rows: [...malware.rows, ...tools.rows.map((row) => [
      ...row.slice(0, 9), '', ...row.slice(9)
    ])].sort((left, right) => String(left[0]).localeCompare(String(right[0])))
  };

  const techniques: CsvExport = {
    headers: [
      'id', 'mitre_id', 'name', 'slug', 'tactic', 'summary', 'last_reviewed_at', 'source_ids', 'version',
      'deprecated', 'revoked', 'url', 'json_url'
    ],
    rows: sorted(knowledge.techniques).map(({ data }) => [
      data.id, data.mitre_id, data.name, data.slug, data.tactic, data.summary, '',
      list(data.sources), data.version, data.deprecated, data.revoked,
      `${publication.site}/techniques/${data.slug}/`, `${publication.site}/api/techniques/${data.slug}.json`
    ])
  };

  const references: CsvExport = {
    headers: [
      'id', 'title', 'slug', 'publisher', 'authors', 'published_at', 'accessed_at', 'last_reviewed_at',
      'source_type', 'language', 'source_url', 'archived_url', 'link_status',
      'link_checked_at', 'http_status', 'final_url', 'version', 'deprecated', 'revoked',
      'url', 'json_url'
    ],
    rows: sorted(knowledge.sources).map(({ data }) => [
      data.id, data.title, data.slug, data.publisher, list(data.authors), iso(data.published_at),
      iso(data.accessed_at), '', data.source_type, data.language, data.url, data.archived_url ?? '',
      data.link_status, iso(data.link_checked_at), data.http_status ?? '', data.final_url ?? '',
      data.version, data.deprecated, data.revoked, `${publication.site}/sources/${data.slug}/`,
      `${publication.site}/api/sources/${data.slug}.json`
    ])
  };
  const referenceAliases: CsvExport = {
    headers: references.headers,
    rows: references.rows.map((row) => [
      ...row.slice(0, -1),
      String(row.at(-1)).replace('/api/sources/', '/api/references/')
    ])
  };

  const relationships: CsvExport = {
    headers: [
      'id', 'relationship_type', 'source_type', 'source_id', 'source_name', 'target_type',
      'target_id', 'target_name', 'target_external_id', 'campaign_id', 'campaign_name',
      'evidence', 'reference_ids', 'confidence', 'first_observed', 'last_observed',
      'created_at', 'modified_at', 'last_reviewed_at', 'version', 'change_reason',
      'editorial_note', 'deprecated', 'revoked', 'url', 'json_url'
    ],
    rows: [...knowledge.relationships].sort((left, right) => left.id.localeCompare(right.id)).map((record) => [
      record.id, record.relationship_type, record.source_entity.type, record.source_entity.id,
      record.source_entity.name, record.target_entity.type, record.target_entity.id,
      record.target_entity.name, record.target_entity.external_id, record.campaign_context?.id ?? '',
      record.campaign_context?.name ?? '', record.evidence, list(record.references), record.confidence,
      record.first_observed, record.last_observed, record.created_at, record.modified_at,
      record.last_reviewed_at, record.version, record.change_reason, record.editorial_note,
      record.deprecated, record.revoked,
      `${publication.site}${record.url}`, `${publication.site}/api/relationships/${record.id}.json`
    ])
  };

  const changes: CsvExport = {
    headers: [
      'id', 'date', 'update_type', 'entity_type', 'entity_id', 'title', 'summary',
      'what_changed', 'why', 'affected_fields', 'affected_relationships', 'source_ids',
      'previous_version', 'new_version', 'release_id', 'substantive', 'correction_of',
      'editorial_note', 'url', 'json_url'
    ],
    rows: [...knowledge.updates]
      .sort((left, right) => +right.data.date - +left.data.date || left.data.id.localeCompare(right.data.id))
      .map(({ data }) => [
        data.id, iso(data.date), data.update_type, data.entity_type, data.entity, data.title,
        data.summary, data.what_changed, data.why, list(data.affected_fields),
        list(data.affected_relationships), list(data.sources), data.previous_version ?? '',
        data.new_version, data.release_id, data.substantive, data.correction_of ?? '',
        data.editorial_note, `${publication.site}/changes/#${data.slug}`,
        `${publication.site}/api/changes/${data.slug}.json`
      ])
  };

  const exports: Record<string, CsvExport> = {
    actors,
    campaigns,
    malware,
    tools,
    software,
    techniques,
    sources: references,
    references: referenceAliases,
    relationships,
    changes,
    'baltic-relevance': balticRelevance
  };

  return Object.entries(exports).map(([collection, output]) => ({
    params: { collection },
    props: { collection, output }
  }));
}

export const GET: APIRoute = ({ props }) => csvResponse(
  csv(props.output.headers, props.output.rows),
  `apt-notes-${props.collection}.csv`
);
