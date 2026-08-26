import { publication, release } from '../data/release';
import { entityHref, entityTypes, type EntityCollection, type RelationshipRecord } from './knowledge';

const normalize = (value: any): any => {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, normalize(item)])
  );
  return value;
};

export const datasetEnvelope = <T extends Record<string, unknown>>(payload: T) => ({
  schema_version: release.schemaVersion,
  dataset_version: release.datasetVersion,
  release_id: release.id,
  released_at: release.releasedAt,
  publisher: publication.publisher,
  licence: publication.licence,
  licence_url: publication.licenceUrl,
  methodology: publication.methodologyUrl,
  notice: publication.notice,
  ...payload
});

export const serializeEntry = (collection: EntityCollection, entry: any) => {
  const data = normalize(entry.data);
  const lastReviewed = entry.data.last_reviewed ? new Date(entry.data.last_reviewed).toISOString() : null;
  return {
    object_type: entityTypes[collection],
    ...data,
    last_reviewed_at: lastReviewed,
    url: `${publication.site}${entityHref(collection, entry.data.slug)}`,
    json_url: `${publication.site}/api/${collection}/${entry.data.slug}.json`
  };
};

export const serializeUpdate = (entry: any) => ({
  object_type: 'change',
  ...normalize(entry.data),
  url: `${publication.site}/changes/#${entry.data.slug}`,
  json_url: `${publication.site}/api/changes/${entry.data.slug}.json`
});

export const serializeRelationship = (record: RelationshipRecord) => normalize({
  object_type: 'relationship',
  ...record,
  url: `${publication.site}${record.url}`,
  json_url: `${publication.site}/api/relationships/${record.id}.json`,
  source_entity: { ...record.source_entity, url: `${publication.site}${record.source_entity.url}` },
  target_entity: { ...record.target_entity, url: `${publication.site}${record.target_entity.url}` },
  campaign_context: record.campaign_context ? { ...record.campaign_context, url: `${publication.site}${record.campaign_context.url}` } : undefined
});

export const jsonResponse = (body: unknown) => new Response(JSON.stringify(body, null, 2), {
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
});

const spreadsheetSafe = (value: unknown) => {
  const normalized = value == null ? '' : Array.isArray(value) ? value.join(' | ') : String(value);
  return /^[=+\-@]/.test(normalized) ? `'${normalized}` : normalized;
};

const quoteCsv = (value: unknown) => `"${spreadsheetSafe(value).replaceAll('"', '""')}"`;
export const csv = (headers: string[], rows: unknown[][]) => [headers, ...rows].map((row) => row.map(quoteCsv).join(',')).join('\r\n');
export const csvResponse = (body: string, filename: string) => new Response(body, {
  headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'public, max-age=3600'
  }
});
