import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const commandLine = process.argv.slice(2);
const option = (name) => {
  const index = commandLine.indexOf(`--${name}`);
  return index === -1 ? undefined : commandLine[index + 1];
};
const contentRoot = path.resolve(option('content-root') ?? 'src/content');
const collectionNames = [
  'actors',
  'campaigns',
  'malware',
  'tools',
  'techniques',
  'sources',
  'updates'
];

const entityCollections = {
  actor: 'actors',
  campaign: 'campaigns',
  malware: 'malware',
  tool: 'tools',
  technique: 'techniques',
  source: 'sources'
};

const allowed = {
  confidence: new Set(['low', 'moderate', 'high']),
  actorTypes: new Set([
    'state-sponsored',
    'state-aligned',
    'cybercriminal',
    'ransomware',
    'initial-access-broker',
    'financially-motivated',
    'hacktivist',
    'mercenary',
    'commercial-intrusion',
    'influence-operation',
    'insider',
    'unknown',
    'mixed'
  ]),
  motivations: new Set([
    'espionage',
    'financial',
    'disruption',
    'destruction',
    'influence',
    'surveillance',
    'credential-access',
    'access-brokerage',
    'extortion',
    'data-theft',
    'ideological',
    'unknown'
  ]),
  actorStatuses: new Set([
    'active',
    'intermittently-active',
    'inactive',
    'disrupted',
    'merged',
    'historical',
    'uncertain'
  ]),
  sourceLinkStatuses: new Set(['unknown', 'ok', 'redirected', 'unavailable'])
};

const expectedReferences = {
  actors: {
    campaigns: 'campaigns',
    malware: 'malware',
    tools: 'tools',
    techniques: 'techniques',
    sources: 'sources',
    updates: 'updates'
  },
  campaigns: {
    actors: 'actors',
    malware: 'malware',
    tools: 'tools',
    techniques: 'techniques',
    sources: 'sources'
  },
  malware: {
    actors: 'actors',
    campaigns: 'campaigns',
    techniques: 'techniques',
    sources: 'sources'
  },
  tools: {
    actors: 'actors',
    techniques: 'techniques',
    sources: 'sources'
  },
  techniques: { sources: 'sources' },
  updates: { sources: 'sources' }
};

const semanticVersionPattern = /^\d+\.\d+\.\d+$/;
const stableReferencePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const lifecycleMigrationDate = '2026-08-26T00:00:00.000Z';
const expectedRelationshipOption = option('expected-relationships');
const expectedCurrentRelationshipCount = expectedRelationshipOption === undefined
  ? 30
  : Number.parseInt(expectedRelationshipOption, 10);
const errors = [];
const warnings = [];

if (!Number.isInteger(expectedCurrentRelationshipCount) || expectedCurrentRelationshipCount < 0) {
  errors.push(`--expected-relationships must be a non-negative integer, received "${expectedRelationshipOption}"`);
}

const relativeFile = (file) => path.relative(process.cwd(), file).replaceAll('\\', '/');
const describe = (record) => relativeFile(record.file);
const isPublic = (record) => record.data.draft === false;
const isCurrent = (record) => isPublic(record) && record.data.deprecated !== true && record.data.revoked !== true;

const parseFrontMatter = (file) => {
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push(`${relativeFile(file)}: missing YAML front matter`);
    return null;
  }

  try {
    return YAML.parse(match[1]);
  } catch (error) {
    errors.push(`${relativeFile(file)}: invalid YAML: ${error.message}`);
    return null;
  }
};

const markdownFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .sort((left, right) => left.name.localeCompare(right.name))
  .flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(target);
    return entry.isFile() && /\.mdx?$/.test(entry.name) ? [target] : [];
  });

const recordsByCollection = new Map();
for (const collection of collectionNames) {
  const directory = path.join(contentRoot, collection);
  const items = [];

  if (!fs.existsSync(directory)) {
    errors.push(`${relativeFile(directory)}: missing content collection`);
    recordsByCollection.set(collection, items);
    continue;
  }

  for (const file of markdownFiles(directory)) {
    const data = parseFrontMatter(file);
    if (data) items.push({ collection, file, data });
  }

  recordsByCollection.set(collection, items);
}

const allRecords = [...recordsByCollection.values()].flat();
const recordsById = new Map();
const recordsBySlug = new Map();

const addUnique = (index, key, record, field) => {
  if (!key) return;
  const previous = index.get(key);
  if (previous) {
    errors.push(`${describe(record)}: duplicate ${field} "${key}" also used by ${describe(previous)}`);
    return;
  }
  index.set(key, record);
};

for (const record of allRecords) {
  addUnique(recordsById, record.data.id, record, 'id');
  addUnique(recordsBySlug, record.data.slug, record, 'slug');
}

const parseDate = (record, value, field, { required = false } = {}) => {
  if (value === undefined || value === null || value === '') {
    if (required) errors.push(`${describe(record)}: missing ${field}`);
    return null;
  }

  const timestamp = Date.parse(String(value));
  if (Number.isNaN(timestamp)) {
    errors.push(`${describe(record)}: invalid ${field} date "${String(value)}"`);
    return null;
  }
  return timestamp;
};

const compareVersions = (left, right) => {
  const a = left.split('.').map(Number);
  const b = right.split('.').map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
};

const checkSemanticVersion = (record, value, field, { required = false } = {}) => {
  if (value === undefined || value === null || value === '') {
    if (required) errors.push(`${describe(record)}: missing ${field}`);
    return null;
  }
  if (!semanticVersionPattern.test(String(value))) {
    errors.push(`${describe(record)}: invalid ${field} semantic version "${String(value)}"`);
    return null;
  }
  return String(value);
};

const checkTypedReference = (
  record,
  id,
  expectedCollection,
  label,
  { publicEndpoint = isPublic(record) } = {}
) => {
  if (typeof id !== 'string' || !stableReferencePattern.test(id)) {
    errors.push(`${describe(record)}: invalid ${label} reference "${String(id)}"`);
    return null;
  }

  const target = recordsById.get(id);
  if (!target) {
    errors.push(`${describe(record)}: unresolved ${label} reference "${id}"`);
    return null;
  }
  if (target.collection !== expectedCollection) {
    errors.push(
      `${describe(record)}: ${label} "${id}" resolves to ${target.collection}, expected ${expectedCollection}`
    );
    return null;
  }
  if (publicEndpoint && !isPublic(target)) {
    errors.push(`${describe(record)}: public record references draft ${label} "${id}"`);
  }
  return target;
};

const checkReferenceList = (record, values, expectedCollection, label) => {
  if (!Array.isArray(values)) {
    errors.push(`${describe(record)}: ${label} must be an array`);
    return;
  }

  const seen = new Set();
  for (const id of values) {
    if (seen.has(id)) errors.push(`${describe(record)}: duplicate ${label} reference "${id}"`);
    seen.add(id);
    checkTypedReference(record, id, expectedCollection, label);
  }
};

const checkLifecycle = (record) => {
  if (record.collection === 'updates') return;

  const data = record.data;
  const version = checkSemanticVersion(record, data.version ?? '1.0.0', 'version', { required: true });
  const createdAt = parseDate(record, data.created_at ?? lifecycleMigrationDate, 'created_at', { required: true });
  const modifiedAt = parseDate(record, data.modified_at ?? lifecycleMigrationDate, 'modified_at', { required: true });

  if (createdAt !== null && modifiedAt !== null && modifiedAt < createdAt) {
    errors.push(`${describe(record)}: modified_at precedes created_at`);
  }
  if (data.deprecated !== undefined && typeof data.deprecated !== 'boolean') {
    errors.push(`${describe(record)}: deprecated must be a boolean`);
  }
  if (data.revoked !== undefined && typeof data.revoked !== 'boolean') {
    errors.push(`${describe(record)}: revoked must be a boolean`);
  }
  if (data.deprecated === true && data.revoked === true) {
    errors.push(`${describe(record)}: a record cannot be both deprecated and revoked`);
  }
  if ((data.deprecated === true || data.revoked === true || (version && compareVersions(version, '1.0.0') > 0))
    && !String(data.change_reason ?? '').trim()) {
    errors.push(`${describe(record)}: lifecycle or version changes require change_reason`);
  }

  if (data.superseded_by !== undefined) {
    const target = checkTypedReference(
      record,
      data.superseded_by,
      record.collection,
      'superseded_by',
      { publicEndpoint: isPublic(record) }
    );
    if (target === record) errors.push(`${describe(record)}: superseded_by cannot reference itself`);
    if (data.deprecated !== true && data.revoked !== true) {
      errors.push(`${describe(record)}: superseded_by requires deprecated: true or revoked: true`);
    }
    if (target && (target.data.deprecated === true || target.data.revoked === true)) {
      errors.push(`${describe(record)}: superseded_by target "${target.data.id}" is not current`);
    }
  }
};

for (const record of allRecords) {
  const { data } = record;
  if (!data.id) errors.push(`${describe(record)}: missing id`);
  if (!data.slug) errors.push(`${describe(record)}: missing slug`);
  if (data.id && !stableReferencePattern.test(data.id)) errors.push(`${describe(record)}: invalid stable id "${data.id}"`);
  if (data.slug && !stableReferencePattern.test(data.slug)) errors.push(`${describe(record)}: invalid slug "${data.slug}"`);
  if (data.draft !== undefined && typeof data.draft !== 'boolean') errors.push(`${describe(record)}: draft must be a boolean`);
  if (record.collection !== 'updates' && !data.name) errors.push(`${describe(record)}: missing name`);
  if (record.collection !== 'sources' && record.collection !== 'updates' && !data.summary) {
    errors.push(`${describe(record)}: missing summary`);
  }
  if (data.confidence && !allowed.confidence.has(data.confidence)) {
    errors.push(`${describe(record)}: invalid confidence "${data.confidence}"`);
  }

  checkLifecycle(record);

  const fields = expectedReferences[record.collection] ?? {};
  for (const [field, expectedCollection] of Object.entries(fields)) {
    checkReferenceList(record, data[field] ?? [], expectedCollection, field);
  }
}

const supersessionState = new Map();
const visitSupersession = (record) => {
  const state = supersessionState.get(record.data.id);
  if (state === 'visiting') {
    errors.push(`${describe(record)}: superseded_by cycle detected at "${record.data.id}"`);
    return;
  }
  if (state === 'visited') return;

  supersessionState.set(record.data.id, 'visiting');
  const target = record.data.superseded_by ? recordsById.get(record.data.superseded_by) : null;
  if (target?.collection === record.collection) visitSupersession(target);
  supersessionState.set(record.data.id, 'visited');
};
for (const record of allRecords) visitSupersession(record);

for (const record of recordsByCollection.get('actors') ?? []) {
  const { data } = record;
  parseDate(record, data.last_reviewed, 'last_reviewed', { required: true });

  for (const value of data.actor_types ?? []) {
    if (!allowed.actorTypes.has(value)) errors.push(`${describe(record)}: invalid actor type "${value}"`);
  }
  for (const value of data.motivations ?? []) {
    if (!allowed.motivations.has(value)) errors.push(`${describe(record)}: invalid motivation "${value}"`);
  }
  if (!allowed.actorStatuses.has(data.status)) errors.push(`${describe(record)}: invalid actor status "${data.status}"`);
  if (data.external_identifiers?.mitre_attack && !/^G\d{4}$/.test(data.external_identifiers.mitre_attack)) {
    errors.push(`${describe(record)}: invalid MITRE group ID "${data.external_identifiers.mitre_attack}"`);
  }

  const aliases = (data.aliases ?? []).map((alias) => String(alias.name).toLowerCase());
  if (new Set(aliases).size !== aliases.length) errors.push(`${describe(record)}: duplicate alias name`);

  for (const statement of data.attribution ?? []) {
    checkTypedReference(record, statement.source, 'sources', 'attribution source');
  }
  for (const parent of data.parent_entities ?? []) {
    checkTypedReference(record, parent.source, 'sources', 'parent entity source');
  }
  for (const vulnerability of data.vulnerabilities ?? []) {
    checkTypedReference(record, vulnerability.source, 'sources', 'vulnerability source');
    if (vulnerability.campaign) {
      checkTypedReference(record, vulnerability.campaign, 'campaigns', 'vulnerability campaign');
    }
  }
  for (const event of data.operational_timeline ?? []) {
    checkReferenceList(record, event.sources ?? [], 'sources', 'timeline source');
  }

  if (isPublic(record) && (data.sources ?? []).length === 1) {
    warnings.push(`${describe(record)}: public actor profile has only one source`);
  }
  const lastReviewed = parseDate(record, data.last_reviewed, 'last_reviewed');
  if (isPublic(record) && lastReviewed !== null && Date.now() - lastReviewed > 366 * 86_400_000) {
    warnings.push(`${describe(record)}: review is older than one year`);
  }
  if (isPublic(record) && !(data.updates?.length)) {
    warnings.push(`${describe(record)}: missing update history`);
  }
}

for (const collection of ['campaigns', 'malware', 'tools']) {
  for (const record of recordsByCollection.get(collection) ?? []) {
    parseDate(record, record.data.last_reviewed, 'last_reviewed', { required: true });
  }
}

for (const record of recordsByCollection.get('techniques') ?? []) {
  if (!/^T\d{4}(?:\.\d{3})?$/.test(record.data.mitre_id)) {
    errors.push(`${describe(record)}: invalid MITRE technique ID "${record.data.mitre_id}"`);
  }
}

for (const record of recordsByCollection.get('sources') ?? []) {
  const { data } = record;
  const publishedAt = parseDate(record, data.published_at, 'published_at', { required: true });
  const accessedAt = parseDate(record, data.accessed_at, 'accessed_at', { required: true });
  if (publishedAt !== null && accessedAt !== null && accessedAt < publishedAt) {
    errors.push(`${describe(record)}: accessed_at precedes published_at`);
  }

  const linkStatus = data.link_status ?? 'unknown';
  if (!allowed.sourceLinkStatuses.has(linkStatus)) {
    errors.push(`${describe(record)}: invalid link_status "${linkStatus}"`);
  }
  if (data.link_checked_at !== undefined) parseDate(record, data.link_checked_at, 'link_checked_at');
  if (isPublic(record) && linkStatus === 'unknown') {
    warnings.push(`${describe(record)}: source link health is unknown`);
  }
  if (isPublic(record) && !data.archived_url) {
    warnings.push(`${describe(record)}: source has no archived_url`);
  }
}

const relationshipRecords = new Map();
for (const actor of recordsByCollection.get('actors') ?? []) {
  const evidenceRows = actor.data.technique_evidence ?? [];
  if (!Array.isArray(evidenceRows)) {
    errors.push(`${describe(actor)}: technique_evidence must be an array`);
    continue;
  }

  for (const [index, evidence] of evidenceRows.entries()) {
    const label = `technique_evidence[${index}]`;
    if (!String(evidence.notes ?? '').trim()) errors.push(`${describe(actor)}: ${label} has empty notes`);
    if (!allowed.confidence.has(evidence.confidence)) {
      errors.push(`${describe(actor)}: ${label} has invalid confidence "${evidence.confidence}"`);
    }

    const technique = checkTypedReference(actor, evidence.technique, 'techniques', `${label} technique`);
    const campaign = evidence.campaign
      ? checkTypedReference(actor, evidence.campaign, 'campaigns', `${label} campaign`)
      : null;
    checkReferenceList(actor, evidence.sources ?? [], 'sources', `${label} source`);

    const firstObservedValue = String(evidence.first_observed ?? '').trim();
    const lastObservedValue = String(evidence.last_observed ?? '').trim();
    if (!firstObservedValue) errors.push(`${describe(actor)}: ${label} has empty first_observed`);
    if (!lastObservedValue) errors.push(`${describe(actor)}: ${label} has empty last_observed`);

    // Observation fields intentionally allow bounded source language such as
    // "2025 reporting". Compare chronology only when both values are ISO-like.
    const isoLike = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;
    if (isoLike.test(firstObservedValue) && isoLike.test(lastObservedValue)) {
      const firstObserved = Date.parse(firstObservedValue);
      const lastObserved = Date.parse(lastObservedValue);
      if (lastObserved < firstObserved) {
        errors.push(`${describe(actor)}: ${label} last_observed precedes first_observed`);
      }
    }

    if (!technique) continue;
    const relationshipId = [
      'rel',
      actor.data.slug,
      'uses',
      technique.data.slug,
      ...(campaign ? ['during', campaign.data.slug] : [])
    ].join('-');

    const previous = relationshipRecords.get(relationshipId);
    if (previous) {
      errors.push(
        `${describe(actor)}: duplicate relationship "${relationshipId}" also derived from ${describe(previous.actor)}`
      );
      continue;
    }
    relationshipRecords.set(relationshipId, { actor, technique, campaign, evidence });

    if (isCurrent(actor)) {
      if (!isCurrent(technique)) {
        errors.push(`${describe(actor)}: current relationship "${relationshipId}" has a non-current technique endpoint`);
      }
      if (campaign && !isCurrent(campaign)) {
        errors.push(`${describe(actor)}: current relationship "${relationshipId}" has a non-current campaign endpoint`);
      }
      for (const sourceId of evidence.sources ?? []) {
        const source = recordsById.get(sourceId);
        if (source && !isCurrent(source)) {
          errors.push(`${describe(actor)}: current relationship "${relationshipId}" has a non-current source endpoint`);
        }
      }
    }
  }
}

const currentRelationships = [...relationshipRecords.values()].filter(({ actor, technique, campaign, evidence }) => {
  if (!isCurrent(actor) || !isCurrent(technique) || (campaign && !isCurrent(campaign))) return false;
  return (evidence.sources ?? []).every((sourceId) => {
    const source = recordsById.get(sourceId);
    return source?.collection === 'sources' && isCurrent(source);
  });
});
if (currentRelationships.length !== expectedCurrentRelationshipCount) {
  errors.push(
    `relationship contract: expected ${expectedCurrentRelationshipCount} current evidence records, derived ${currentRelationships.length}`
  );
}

const updatesByEntity = new Map();
for (const update of recordsByCollection.get('updates') ?? []) {
  const { data } = update;
  const expectedCollection = entityCollections[data.entity_type];
  let entity = null;
  if (!expectedCollection) {
    errors.push(`${describe(update)}: invalid entity_type "${String(data.entity_type)}"`);
  } else {
    entity = checkTypedReference(update, data.entity, expectedCollection, 'update entity');
    if (entity && isPublic(update) && !isPublic(entity)) {
      errors.push(`${describe(update)}: public change event targets a draft entity "${data.entity}"`);
    }
  }

  parseDate(update, data.date, 'date', { required: true });
  const previousVersion = checkSemanticVersion(update, data.previous_version, 'previous_version');
  const newVersion = checkSemanticVersion(update, data.new_version ?? '1.0.0', 'new_version', { required: true });
  if (previousVersion && newVersion && compareVersions(newVersion, previousVersion) <= 0) {
    errors.push(`${describe(update)}: new_version must be greater than previous_version`);
  }
  if (data.update_type === 'profile-created' && previousVersion) {
    errors.push(`${describe(update)}: profile-created must not declare previous_version`);
  }
  if (data.update_type !== 'profile-created' && !previousVersion) {
    warnings.push(`${describe(update)}: substantive change has no previous_version`);
  }
  if (!String(data.release_id ?? 'apt-notes-2026-08-26').trim()) {
    errors.push(`${describe(update)}: release_id must not be empty`);
  }
  if (data.correction_of) {
    const corrected = checkTypedReference(update, data.correction_of, 'updates', 'correction_of');
    if (corrected === update) errors.push(`${describe(update)}: correction_of cannot reference itself`);
  }
  for (const relationshipId of data.affected_relationships ?? []) {
    if (!relationshipRecords.has(relationshipId)) {
      errors.push(`${describe(update)}: unknown affected_relationship "${relationshipId}"`);
    }
  }

  if (entity) {
    const key = `${data.entity_type}:${data.entity}`;
    const timeline = updatesByEntity.get(key) ?? [];
    timeline.push(update);
    updatesByEntity.set(key, timeline);
  }
}

for (const [entityKey, timeline] of updatesByEntity) {
  timeline.sort((left, right) => Date.parse(String(left.data.date)) - Date.parse(String(right.data.date)));
  for (let index = 1; index < timeline.length; index += 1) {
    const previous = timeline[index - 1];
    const current = timeline[index];
    if (current.data.previous_version !== undefined) {
      const expectedPrevious = previous.data.new_version ?? '1.0.0';
      if (current.data.previous_version !== expectedPrevious) {
        errors.push(
          `${describe(current)}: previous_version does not match prior change new_version "${expectedPrevious}"`
        );
      }
    }
  }

  const latest = timeline.at(-1);
  const entity = latest ? recordsById.get(latest.data.entity) : null;
  if (latest && entity) {
    const latestVersion = latest.data.new_version ?? '1.0.0';
    const recordVersion = entity.data.version ?? '1.0.0';
    if (latestVersion !== recordVersion) {
      errors.push(
        `${describe(latest)}: latest change version "${latestVersion}" does not match ${entityKey} version "${recordVersion}"`
      );
    }
  }
}

// A first public version may predate this structured Changes catalogue. Once a
// record advances beyond 1.0.0 or changes lifecycle state, however, a matching
// event is mandatory so future campaign, software, technique and source edits
// receive the same accountability already exercised by actor dossiers.
for (const record of allRecords.filter((item) => item.collection !== 'updates' && isPublic(item))) {
  const version = String(record.data.version ?? '1.0.0');
  const requiresChangeEvent = compareVersions(version, '1.0.0') > 0
    || record.data.deprecated === true
    || record.data.revoked === true;
  if (requiresChangeEvent) {
    const entityType = Object.entries(entityCollections).find(([, collection]) => collection === record.collection)?.[0];
    const timeline = entityType ? updatesByEntity.get(`${entityType}:${record.data.id}`) : undefined;
    if (!timeline?.length) {
      errors.push(`${describe(record)}: version or lifecycle change requires a public Changes event`);
    }
  }
}

for (const warning of warnings) console.warn(`WARNING ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}

const publicCount = allRecords.filter(isPublic).length;
console.log(
  `Validated ${allRecords.length} content records (${publicCount} public, ${allRecords.length - publicCount} drafts) `
  + `and ${currentRelationships.length} current evidence relationships.`
);
