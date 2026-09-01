import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const root = path.resolve('dist');
const contentRoot = path.resolve('src/content');
const site = 'https://apt.hecavex.com';
const errors = [];

const error = (message) => errors.push(message);
const assert = (condition, message) => {
  if (!condition) error(message);
};
const relative = (file) => path.relative(process.cwd(), file).replaceAll('\\', '/');

const requiredFile = (relativePath) => {
  const file = path.join(root, ...relativePath.split('/'));
  if (!fs.existsSync(file)) {
    error(`${relativePath}: required generated asset is missing`);
    return null;
  }
  return file;
};

const readJson = (relativePath) => {
  const file = requiredFile(relativePath);
  if (!file) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (cause) {
    error(`${relativePath}: invalid JSON: ${cause.message}`);
    return null;
  }
};

const parseFrontMatter = (file) => {
  const match = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  try {
    return YAML.parse(match[1]);
  } catch (cause) {
    error(`${relative(file)}: invalid YAML while auditing build: ${cause.message}`);
    return null;
  }
};

const collectionNames = ['actors', 'campaigns', 'malware', 'tools', 'techniques', 'sources', 'updates'];
const sourceRecords = Object.fromEntries(collectionNames.map((collection) => {
  const directory = path.join(contentRoot, collection);
  const records = fs.readdirSync(directory)
    .filter((name) => /\.mdx?$/.test(name))
    .sort()
    .map((name) => parseFrontMatter(path.join(directory, name)))
    .filter(Boolean);
  return [collection, records];
}));

const publicSourceRecords = Object.fromEntries(Object.entries(sourceRecords).map(([collection, records]) => [
  collection,
  records.filter((record) => record.draft === false)
]));
const publicIds = Object.fromEntries(Object.entries(publicSourceRecords).map(([collection, records]) => [
  collection,
  new Set(records.map((record) => record.id))
]));
const isCurrentRecord = (record) => record.deprecated !== true && record.revoked !== true;
const currentPublicIds = Object.fromEntries(Object.entries(publicSourceRecords).map(([collection, records]) => [
  collection,
  new Set(records.filter(isCurrentRecord).map((record) => record.id))
]));

const stableJson = (value) => {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

const findDraftFlag = (value, location = '$') => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findDraftFlag(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (value.draft === true) error(`${location}: generated output contains draft: true`);
  for (const [key, child] of Object.entries(value)) findDraftFlag(child, `${location}.${key}`);
};

if (!fs.existsSync(root)) {
  console.error('ERROR dist: production build directory is missing; run the static build before audit-data.mjs.');
  process.exit(1);
}

const version = readJson('api/version.json');
const catalogue = readJson('api/index.json');
const knowledge = readJson('api/knowledge.json');

const envelopeFields = [
  'schema_version',
  'dataset_version',
  'release_id',
  'released_at',
  'publisher',
  'licence',
  'licence_url',
  'methodology',
  'notice'
];
const semanticVersion = /^\d+\.\d+\.\d+$/;

const checkEnvelope = (document, label) => {
  if (!document) return;
  for (const field of envelopeFields) {
    assert(document[field] !== undefined && document[field] !== '', `${label}: missing envelope field ${field}`);
  }
  assert(semanticVersion.test(document.schema_version), `${label}: invalid schema_version`);
  assert(semanticVersion.test(document.dataset_version), `${label}: invalid dataset_version`);
  assert(!Number.isNaN(Date.parse(document.released_at)), `${label}: invalid released_at`);
  assert(document.publisher === 'HECAVEX', `${label}: unexpected publisher`);
  assert(document.licence_url === `${site}/licence/`, `${label}: unexpected licence_url`);
  assert(document.methodology === `${site}/methodology/`, `${label}: unexpected methodology URL`);
  if (version && document !== version) {
    for (const field of envelopeFields) {
      assert(document[field] === version[field], `${label}: ${field} differs from release manifest`);
    }
  }
  findDraftFlag(document, label);
};

checkEnvelope(version, 'api/version.json');
checkEnvelope(catalogue, 'api/index.json');
checkEnvelope(knowledge, 'api/knowledge.json');
if (version) {
  assert(version.object_type === 'release-manifest', 'api/version.json: unexpected object_type');
  assert(semanticVersion.test(version.previous_version), 'api/version.json: invalid previous_version');
  if (semanticVersion.test(version.previous_version) && semanticVersion.test(version.dataset_version)) {
    const parts = (value) => value.split('.').map(Number);
    assert(stableJson(parts(version.previous_version)) !== stableJson(parts(version.dataset_version)),
      'api/version.json: previous_version must differ from dataset_version');
  }
}
if (catalogue) assert(catalogue.object_type === 'catalogue-index', 'api/index.json: unexpected object_type');
if (knowledge) assert(knowledge.object_type === 'knowledge-index', 'api/knowledge.json: unexpected object_type');

const techniqueById = new Map(publicSourceRecords.techniques.filter(isCurrentRecord).map((record) => [record.id, record]));
const campaignById = new Map(publicSourceRecords.campaigns.filter(isCurrentRecord).map((record) => [record.id, record]));
const expectedRelationshipIds = [];
for (const actor of publicSourceRecords.actors) {
  if (!isCurrentRecord(actor)) continue;
  for (const evidence of actor.technique_evidence ?? []) {
    const technique = techniqueById.get(evidence.technique);
    const campaign = evidence.campaign ? campaignById.get(evidence.campaign) : null;
    const references = evidence.sources ?? [];
    if (!technique || (evidence.campaign && !campaign) || !references.length
      || references.some((source) => !currentPublicIds.sources.has(source))) continue;
    expectedRelationshipIds.push([
      'rel',
      actor.slug,
      'uses',
      technique.slug,
      ...(campaign ? ['during', campaign.slug] : [])
    ].join('-'));
  }
}
expectedRelationshipIds.sort();

const expectedIds = {
  actors: [...publicIds.actors].sort(),
  campaigns: [...publicIds.campaigns].sort(),
  malware: [...publicIds.malware].sort(),
  tools: [...publicIds.tools].sort(),
  software: [...publicIds.malware, ...publicIds.tools].sort(),
  techniques: [...publicIds.techniques].sort(),
  sources: [...publicIds.sources].sort(),
  references: [...publicIds.sources].sort(),
  relationships: expectedRelationshipIds,
  changes: [...publicIds.updates].sort()
};
const expectedBalticIds = publicSourceRecords.actors
  .flatMap((actor) => (actor.baltic_relevance ?? []).map((record) => record.id))
  .sort();

const aggregateNames = Object.keys(expectedIds);
const aggregates = {};
const aggregateMaps = {};

for (const name of aggregateNames) {
  const relativePath = `api/${name}.json`;
  const document = readJson(relativePath);
  aggregates[name] = document;
  checkEnvelope(document, relativePath);
  if (!document) continue;

  assert(document.object_type === 'collection', `${relativePath}: unexpected object_type`);
  assert(document.collection === name, `${relativePath}: collection does not match route`);
  assert(Array.isArray(document.records), `${relativePath}: records must be an array`);
  if (!Array.isArray(document.records)) continue;
  assert(document.count === document.records.length, `${relativePath}: count does not match records length`);

  const recordIds = document.records.map((record) => record.id);
  assert(recordIds.every((id) => typeof id === 'string' && id.length > 0), `${relativePath}: every record needs an id`);
  assert(new Set(recordIds).size === recordIds.length, `${relativePath}: duplicate record id`);
  assert(
    stableJson([...recordIds].sort()) === stableJson(expectedIds[name]),
    `${relativePath}: record IDs do not match the public source contract`
  );
  aggregateMaps[name] = new Map(document.records.map((record) => [record.id, record]));

  for (const record of document.records) {
    const routeKey = name === 'relationships' ? record.id : record.slug;
    assert(typeof routeKey === 'string' && routeKey.length > 0, `${relativePath}: record ${record.id} lacks a route key`);
    if (!routeKey) continue;
    const perRecordPath = `api/${name}/${routeKey}.json`;
    const perRecord = readJson(perRecordPath);
    checkEnvelope(perRecord, perRecordPath);
    if (!perRecord) continue;
    assert(perRecord.object_type === 'record', `${perRecordPath}: unexpected object_type`);
    assert(perRecord.collection === name, `${perRecordPath}: collection does not match route`);
    if (name === 'actors') {
      for (const [field, value] of Object.entries(record)) {
        assert(
          stableJson(perRecord.record?.[field]) === stableJson(value),
          `${perRecordPath}: aggregate field ${field} differs from the full record`
        );
      }
    } else {
      assert(
        stableJson(perRecord.record) === stableJson(record),
        `${perRecordPath}: record differs from aggregate representation`
      );
    }
  }
}

if (aggregates.actors) {
  assert(Array.isArray(aggregates.actors.actors), 'api/actors.json: compatibility actors array is missing');
  assert(
    stableJson(aggregates.actors.actors) === stableJson(aggregates.actors.records),
    'api/actors.json: compatibility actors array differs from records'
  );
}
const balticRelevance = readJson('api/baltic-relevance.json');
checkEnvelope(balticRelevance, 'api/baltic-relevance.json');
if (balticRelevance) {
  assert(balticRelevance.object_type === 'derived-view', 'api/baltic-relevance.json: unexpected object_type');
  assert(balticRelevance.collection === 'baltic-relevance', 'api/baltic-relevance.json: unexpected collection');
  assert(Array.isArray(balticRelevance.records), 'api/baltic-relevance.json: records must be an array');
  const records = Array.isArray(balticRelevance.records) ? balticRelevance.records : [];
  const ids = records.map((record) => record.id);
  assert(balticRelevance.count === records.length, 'api/baltic-relevance.json: count differs from records');
  assert(stableJson([...ids].sort()) === stableJson(expectedBalticIds), 'api/baltic-relevance.json: IDs differ from actor evidence');
  assert(new Set(ids).size === ids.length, 'api/baltic-relevance.json: duplicate record id');
  for (const record of records) {
    assert(record.object_type === 'baltic-relevance', `api/baltic-relevance.json: ${record.id} has unexpected object_type`);
    assert(publicIds.actors.has(record.actor?.id), `api/baltic-relevance.json: ${record.id} has unknown actor`);
    assert(['Estonia', 'Latvia', 'Lithuania'].includes(record.country), `api/baltic-relevance.json: ${record.id} has invalid country`);
    assert(Array.isArray(record.sources) && record.sources.length > 0, `api/baltic-relevance.json: ${record.id} lacks sources`);
    for (const source of record.sources ?? []) {
      assert(publicIds.sources.has(source), `api/baltic-relevance.json: ${record.id} has unknown source ${source}`);
    }
  }
}
if (aggregates.references) {
  assert(
    aggregates.references.canonical_collection === 'sources',
    'api/references.json: canonical_collection must be sources'
  );
}

for (const [collection, records] of Object.entries(sourceRecords)) {
  const apiCollection = collection === 'updates' ? 'changes' : collection;
  for (const record of records.filter((candidate) => candidate.draft !== false)) {
    const generated = path.join(root, 'api', apiCollection, `${record.slug}.json`);
    assert(!fs.existsSync(generated), `${relative(generated)}: draft record route was emitted`);
  }
}

const expectedCounts = Object.fromEntries(Object.entries(expectedIds).map(([name, ids]) => [name, ids.length]));
if (catalogue?.collections) {
  for (const [name, count] of Object.entries(expectedCounts)) {
    const entry = catalogue.collections[name];
    assert(entry && typeof entry === 'object', `api/index.json: missing ${name} collection`);
    if (!entry) continue;
    assert(entry.count === count, `api/index.json: ${name} count is ${entry.count}, expected ${count}`);
    assert(entry.json === `${site}/api/${name}.json`, `api/index.json: invalid ${name} JSON URL`);
    assert(entry.csv === `${site}/data/${name}.csv`, `api/index.json: invalid ${name} CSV URL`);
    assert(
      entry.record_template === `${site}/api/${name}/{slug}.json`,
      `api/index.json: invalid ${name} record template`
    );
  }
  assert(
    Object.keys(catalogue.collections).length === aggregateNames.length,
    'api/index.json: unexpected collection count'
  );
}
if (catalogue) {
  const view = catalogue.derived_views?.baltic_relevance;
  assert(view?.count === expectedBalticIds.length, 'api/index.json: Baltic relevance count differs from actor evidence');
  assert(view?.human === `${site}/baltic-relevance/`, 'api/index.json: invalid Baltic relevance human URL');
  assert(view?.json === `${site}/api/baltic-relevance.json`, 'api/index.json: invalid Baltic relevance JSON URL');
  assert(view?.csv === `${site}/data/baltic-relevance.csv`, 'api/index.json: invalid Baltic relevance CSV URL');
}

const expectedPhysicalCount = ['actors', 'campaigns', 'malware', 'tools', 'techniques', 'sources', 'updates']
  .reduce((sum, name) => sum + publicSourceRecords[name].length, 0);
if (catalogue) {
  assert(
    catalogue.physical_record_count === expectedPhysicalCount,
    `api/index.json: physical_record_count is ${catalogue.physical_record_count}, expected ${expectedPhysicalCount}`
  );
  assert(catalogue.version_manifest === `${site}/api/version.json`, 'api/index.json: invalid version_manifest URL');
  assert(catalogue.feeds?.changes_atom === `${site}/changes/feed.xml`, 'api/index.json: invalid Changes feed URL');
  assert(catalogue.feeds?.compatibility_atom === `${site}/feed.xml`, 'api/index.json: invalid compatibility feed URL');
}

if (version?.counts) {
  const manifestCounts = {
    actors: expectedCounts.actors,
    campaigns: expectedCounts.campaigns,
    malware: expectedCounts.malware,
    tools: expectedCounts.tools,
    software: expectedCounts.software,
    techniques: expectedCounts.techniques,
    sources: expectedCounts.sources,
    references: expectedCounts.references,
    relationships: expectedCounts.relationships,
    changes: expectedCounts.changes,
    baltic_relevance: expectedBalticIds.length
  };
  for (const [name, count] of Object.entries(manifestCounts)) {
    assert(version.counts[name] === count, `api/version.json: ${name} count is ${version.counts[name]}, expected ${count}`);
  }
  assert(
    Object.keys(version.counts).length === Object.keys(manifestCounts).length,
    'api/version.json: unexpected manifest count keys'
  );
  assert(version.assets?.baltic_relevance_json === `${site}/api/baltic-relevance.json`, 'api/version.json: invalid Baltic relevance JSON asset');
  assert(version.assets?.baltic_relevance_csv === `${site}/data/baltic-relevance.csv`, 'api/version.json: invalid Baltic relevance CSV asset');
  assert(version.assets?.index === `${site}/api/index.json`, 'api/version.json: invalid index asset URL');
  assert(version.assets?.changes_atom === `${site}/changes/feed.xml`, 'api/version.json: invalid Atom asset URL');
  assert(version.assets?.changes_json === `${site}/api/changes.json`, 'api/version.json: invalid Changes asset URL');
  assert(
    version.assets?.relationships_json === `${site}/api/relationships.json`,
    'api/version.json: invalid Relationships asset URL'
  );
}

if (knowledge?.records) {
  const expectedKnowledgeIds = [
    ...expectedIds.campaigns,
    ...expectedIds.software,
    ...expectedIds.techniques,
    ...expectedIds.sources
  ].sort();
  const knowledgeIds = knowledge.records.map((record) => record.id);
  assert(knowledge.count === knowledge.records.length, 'api/knowledge.json: count does not match records length');
  assert(new Set(knowledgeIds).size === knowledgeIds.length, 'api/knowledge.json: duplicate record id');
  assert(
    stableJson([...knowledgeIds].sort()) === stableJson(expectedKnowledgeIds),
    'api/knowledge.json: IDs do not match the browsable Knowledge catalogue'
  );
}

const requireReference = (set, id, label) => {
  if (id && !set.has(id)) error(`${label}: unresolved public reference "${id}"`);
};
const requireReferences = (set, ids, label) => {
  for (const id of ids ?? []) requireReference(set, id, label);
};

for (const record of aggregates.actors?.records ?? []) {
  requireReferences(publicIds.campaigns, record.campaigns, `actor ${record.id} campaigns`);
  requireReferences(publicIds.malware, record.malware, `actor ${record.id} malware`);
  requireReferences(publicIds.tools, record.tools, `actor ${record.id} tools`);
  requireReferences(publicIds.techniques, record.techniques, `actor ${record.id} techniques`);
  requireReferences(publicIds.sources, record.sources, `actor ${record.id} sources`);
  requireReferences(publicIds.updates, record.updates, `actor ${record.id} updates`);
}
for (const record of aggregates.campaigns?.records ?? []) {
  requireReferences(publicIds.actors, record.actors, `campaign ${record.id} actors`);
  requireReferences(publicIds.malware, record.malware, `campaign ${record.id} malware`);
  requireReferences(publicIds.tools, record.tools, `campaign ${record.id} tools`);
  requireReferences(publicIds.techniques, record.techniques, `campaign ${record.id} techniques`);
  requireReferences(publicIds.sources, record.sources, `campaign ${record.id} sources`);
}
for (const record of aggregates.malware?.records ?? []) {
  requireReferences(publicIds.actors, record.actors, `malware ${record.id} actors`);
  requireReferences(publicIds.campaigns, record.campaigns, `malware ${record.id} campaigns`);
  requireReferences(publicIds.techniques, record.techniques, `malware ${record.id} techniques`);
  requireReferences(publicIds.sources, record.sources, `malware ${record.id} sources`);
}
for (const record of aggregates.tools?.records ?? []) {
  requireReferences(publicIds.actors, record.actors, `tool ${record.id} actors`);
  requireReferences(publicIds.techniques, record.techniques, `tool ${record.id} techniques`);
  requireReferences(publicIds.sources, record.sources, `tool ${record.id} sources`);
}
for (const record of aggregates.techniques?.records ?? []) {
  requireReferences(publicIds.sources, record.sources, `technique ${record.id} sources`);
}
for (const record of aggregates.relationships?.records ?? []) {
  requireReference(currentPublicIds.actors, record.source_entity?.id, `relationship ${record.id} current source endpoint`);
  requireReference(currentPublicIds.techniques, record.target_entity?.id, `relationship ${record.id} current target endpoint`);
  requireReference(currentPublicIds.campaigns, record.campaign_context?.id, `relationship ${record.id} current campaign endpoint`);
  requireReferences(currentPublicIds.sources, record.references, `relationship ${record.id} current references`);
  assert(record.evidence?.trim(), `relationship ${record.id}: evidence is empty`);
  assert(record.references?.length > 0, `relationship ${record.id}: references are empty`);
  assert(record.change_reason?.trim(), `relationship ${record.id}: change_reason is empty`);
  assert(record.editorial_note?.trim(), `relationship ${record.id}: editorial_note is empty`);
  assert(record.deprecated !== true && record.revoked !== true, `relationship ${record.id}: non-current relationship exported`);
}
const updateTargetCollections = {
  actor: publicIds.actors,
  campaign: publicIds.campaigns,
  malware: publicIds.malware,
  tool: publicIds.tools,
  technique: publicIds.techniques,
  source: publicIds.sources,
  dataset: new Set(['apt-notes'])
};
for (const record of aggregates.changes?.records ?? []) {
  requireReference(updateTargetCollections[record.entity_type] ?? new Set(), record.entity, `change ${record.id} entity`);
  requireReferences(publicIds.sources, record.sources, `change ${record.id} sources`);
  requireReferences(new Set(expectedRelationshipIds), record.affected_relationships, `change ${record.id} relationships`);
}

const parseCsv = (text, label) => {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
      continue;
    }
    if (character === '"') quoted = true;
    else if (character === ',') {
      row.push(value);
      value = '';
    } else if (character === '\n') {
      row.push(value.endsWith('\r') ? value.slice(0, -1) : value);
      rows.push(row);
      row = [];
      value = '';
    } else value += character;
  }
  if (quoted) error(`${label}: unclosed quoted field`);
  if (value || row.length) {
    row.push(value.endsWith('\r') ? value.slice(0, -1) : value);
    rows.push(row);
  }
  return rows;
};

const expectedCsvHeaders = {
  actors: ['id', 'name', 'slug', 'status', 'actor_types', 'aliases', 'suspected_origins', 'motivations', 'active_since', 'last_observed', 'confidence', 'last_reviewed_at', 'campaign_ids', 'malware_ids', 'tool_ids', 'technique_ids', 'source_ids', 'version', 'deprecated', 'revoked', 'url', 'json_url'],
  campaigns: ['id', 'name', 'slug', 'aliases', 'summary', 'start_date', 'end_date', 'regions', 'sectors', 'actor_ids', 'malware_ids', 'tool_ids', 'technique_ids', 'confidence', 'last_reviewed_at', 'source_ids', 'version', 'deprecated', 'revoked', 'url', 'json_url'],
  malware: ['id', 'name', 'slug', 'software_class', 'family_type', 'aliases', 'summary', 'platforms', 'actor_ids', 'campaign_ids', 'technique_ids', 'confidence', 'last_reviewed_at', 'source_ids', 'version', 'deprecated', 'revoked', 'url', 'json_url'],
  tools: ['id', 'name', 'slug', 'software_class', 'tool_type', 'aliases', 'summary', 'platforms', 'actor_ids', 'technique_ids', 'confidence', 'last_reviewed_at', 'source_ids', 'version', 'deprecated', 'revoked', 'url', 'json_url'],
  software: ['id', 'name', 'slug', 'software_class', 'software_type', 'aliases', 'summary', 'platforms', 'actor_ids', 'campaign_ids', 'technique_ids', 'confidence', 'last_reviewed_at', 'source_ids', 'version', 'deprecated', 'revoked', 'url', 'json_url'],
  techniques: ['id', 'mitre_id', 'name', 'slug', 'tactic', 'summary', 'last_reviewed_at', 'source_ids', 'version', 'deprecated', 'revoked', 'url', 'json_url'],
  sources: ['id', 'title', 'slug', 'publisher', 'authors', 'published_at', 'accessed_at', 'last_reviewed_at', 'source_type', 'language', 'source_url', 'archived_url', 'link_status', 'link_checked_at', 'http_status', 'final_url', 'version', 'deprecated', 'revoked', 'url', 'json_url'],
  references: ['id', 'title', 'slug', 'publisher', 'authors', 'published_at', 'accessed_at', 'last_reviewed_at', 'source_type', 'language', 'source_url', 'archived_url', 'link_status', 'link_checked_at', 'http_status', 'final_url', 'version', 'deprecated', 'revoked', 'url', 'json_url'],
  relationships: ['id', 'relationship_type', 'source_type', 'source_id', 'source_name', 'target_type', 'target_id', 'target_name', 'target_external_id', 'campaign_id', 'campaign_name', 'evidence', 'reference_ids', 'confidence', 'first_observed', 'last_observed', 'created_at', 'modified_at', 'last_reviewed_at', 'version', 'change_reason', 'editorial_note', 'deprecated', 'revoked', 'url', 'json_url'],
  changes: ['id', 'date', 'update_type', 'entity_type', 'entity_id', 'title', 'summary', 'what_changed', 'why', 'affected_fields', 'affected_relationships', 'source_ids', 'previous_version', 'new_version', 'release_id', 'substantive', 'correction_of', 'editorial_note', 'url', 'json_url'],
  'baltic-relevance': ['id', 'actor_id', 'actor_name', 'actor_slug', 'country', 'evidence_type', 'summary', 'sector_context', 'technology_context', 'campaign_ids', 'technique_ids', 'first_observed', 'last_observed', 'reviewed_at', 'confidence', 'source_ids', 'why_it_matters', 'url', 'actor_json_url']
};

for (const [name, headers] of Object.entries(expectedCsvHeaders)) {
  const relativePath = `data/${name}.csv`;
  const file = requiredFile(relativePath);
  if (!file) continue;
  const rows = parseCsv(fs.readFileSync(file, 'utf8'), relativePath);
  assert(rows.length > 0, `${relativePath}: CSV is empty`);
  if (!rows.length) continue;
  assert(stableJson(rows[0]) === stableJson(headers), `${relativePath}: header contract changed`);
  assert(new Set(rows[0]).size === rows[0].length, `${relativePath}: duplicate header`);
  for (const [index, row] of rows.entries()) {
    assert(row.length === rows[0].length, `${relativePath}: row ${index + 1} has ${row.length} fields, expected ${rows[0].length}`);
  }
  const dataRows = rows.slice(1);
  const expectedCsvIds = name === 'baltic-relevance' ? expectedBalticIds : expectedIds[name];
  assert(dataRows.length === expectedCsvIds.length, `${relativePath}: has ${dataRows.length} records, expected ${expectedCsvIds.length}`);
  assert(new Set(dataRows.map((row) => row[0])).size === dataRows.length, `${relativePath}: duplicate id`);
  assert(
    stableJson(dataRows.map((row) => row[0]).sort()) === stableJson(expectedCsvIds),
    `${relativePath}: IDs differ from JSON/source contract`
  );
}

const decodeXml = (value) => value
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'")
  .replaceAll('&amp;', '&');

const auditAtom = (relativePath, expectedSelf) => {
  const file = requiredFile(relativePath);
  if (!file) return [];
  const xml = fs.readFileSync(file, 'utf8');
  assert(xml.startsWith('<?xml version="1.0" encoding="utf-8"?>'), `${relativePath}: missing XML declaration`);
  assert(xml.includes('<feed xmlns="http://www.w3.org/2005/Atom">'), `${relativePath}: missing Atom namespace`);
  assert(!/<script\b/i.test(xml), `${relativePath}: script element is forbidden`);
  assert(!/&(?!amp;|lt;|gt;|apos;|quot;|#\d+;|#x[0-9a-f]+;)/i.test(xml), `${relativePath}: contains an unescaped ampersand`);
  assert(
    xml.includes(`<link href="${expectedSelf}" rel="self" type="application/atom+xml"/>`),
    `${relativePath}: incorrect self link`
  );

  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  assert(entries.length === expectedCounts.changes, `${relativePath}: has ${entries.length} entries, expected ${expectedCounts.changes}`);
  const ids = entries.map((entry) => decodeXml(entry.match(/<id>([\s\S]*?)<\/id>/)?.[1] ?? ''));
  assert(new Set(ids).size === ids.length, `${relativePath}: duplicate entry id`);
  const expectedUrns = expectedIds.changes.map((id) => `urn:hecavex:apt-notes:change:${id}`).sort();
  assert(stableJson([...ids].sort()) === stableJson(expectedUrns), `${relativePath}: entry IDs differ from Changes JSON`);
  for (const entry of entries) {
    const id = decodeXml(entry.match(/<id>urn:hecavex:apt-notes:change:([\s\S]*?)<\/id>/)?.[1] ?? '');
    assert(
      entry.includes(`href="${site}/api/changes/${id}.json" rel="alternate" type="application/json"`),
      `${relativePath}: ${id || 'unknown entry'} lacks its JSON alternate`
    );
  }
  return ids;
};

const changesFeedIds = auditAtom('changes/feed.xml', `${site}/changes/feed.xml`);
const compatibilityFeedIds = auditAtom('feed.xml', `${site}/feed.xml`);
assert(
  stableJson(changesFeedIds) === stableJson(compatibilityFeedIds),
  'feed.xml: compatibility feed entries differ from changes/feed.xml'
);

if (errors.length) {
  for (const message of errors) console.error(`ERROR ${message}`);
  process.exit(1);
}

console.log(
  `Audited ${expectedPhysicalCount} public source records, ${expectedCounts.relationships} relationships, `
  + `${aggregateNames.length + 3} JSON indexes, ${expectedPhysicalCount + expectedCounts.software + expectedCounts.references + expectedCounts.relationships} per-record JSON files, `
  + `${Object.keys(expectedCsvHeaders).length} CSV exports and 2 Atom feeds.`
);
