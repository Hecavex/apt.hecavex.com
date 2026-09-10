import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import ts from 'typescript';
import { createHash } from 'node:crypto';

const snapshot = JSON.parse(fs.readFileSync('src/data/labs-evidence-handoff.json', 'utf8'));
const source = fs.readFileSync('src/utils/labs-handoff.ts', 'utf8');
const moduleSource = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { labsEvidenceHandoff } = await import('data:text/javascript;base64,' + Buffer.from(moduleSource).toString('base64'));
const frontMatter = file => YAML.parse(fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
const actors = new Map(fs.readdirSync('src/content/actors').filter(file => file.endsWith('.md')).map(file => { const record = frontMatter('src/content/actors/' + file); return [record.id, record]; }));
const techniques = new Map(fs.readdirSync('src/content/techniques').filter(file => file.endsWith('.md')).map(file => { const record = frontMatter('src/content/techniques/' + file); return [record.id, record]; }));
assert.equal(new Set(snapshot.actors.map(actor => actor.id)).size, snapshot.actors.length);
for (const included of snapshot.actors) {
  const actor = actors.get(included.id);
  assert(actor && !actor.draft, 'Snapshot actor must have a public canonical dossier: ' + included.id);
  const actualIds = actor.technique_evidence.map(evidence => included.id + ':' + techniques.get(evidence.technique).mitre_id + ':' + (evidence.campaign || 'uncampaigned'));
  assert(included.evidence_ids.length > 0);
  assert.equal(new Set(included.evidence_ids).size, included.evidence_ids.length);
  for (const id of included.evidence_ids) assert(actualIds.includes(id), 'Recorded Labs evidence ID no longer matches an APT procedure: ' + id);
  assert.equal(labsEvidenceHandoff(snapshot, included.id, true).url, 'https://labs.hecavex.com/attack-map/?actor=' + included.id);
}
assert.equal(labsEvidenceHandoff(snapshot, 'future-apt-only-actor', true), null);
assert.equal(labsEvidenceHandoff(snapshot, 'apt28', false), null);
assert.equal(labsEvidenceHandoff(snapshot, 'apt28&actor=all', true), null);
assert.equal(labsEvidenceHandoff({ ...snapshot, source_revision: 'main' }, 'apt28', true), null);
assert.equal(labsEvidenceHandoff({ ...snapshot, actors: [{ id: 'apt28', evidence_ids: ['other:T0000:campaign'] }] }, 'apt28', true), null);
assert.equal(labsEvidenceHandoff({ ...snapshot, actors: [snapshot.actors[0], snapshot.actors[0]] }, 'apt28', true), null);
assert.match(snapshot.source_sha256, /^[a-f0-9]{64}$/);
assert.equal(snapshot.source_path, 'data/attack/intelligence/reviewed-evidence.json');
// Optional maintainer proof when recording a new snapshot. CI validates current references without fetching mutable upstream content.
if (process.argv[2]) {
  const sourceBytes = fs.readFileSync(process.argv[2]);
  const dataset = JSON.parse(sourceBytes);
  assert.equal(createHash('sha256').update(sourceBytes).digest('hex'), snapshot.source_sha256);
  assert.equal(dataset.source_system.release_id, snapshot.source_release_id);
  assert.deepEqual(dataset.actors.map(actor => ({ id: actor.id, evidence_ids: actor.evidence.map(record => record.id) })), snapshot.actors);
}
console.log('Labs handoff: ' + snapshot.actors.length + ' included public actors, exact evidence ID references, frozen revision and absent/invalid actor guards passed.');
