import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

const readContent = async (file) => parse((await readFile(file, 'utf8')).match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
const actor = await readContent('src/content/actors/apt31.md');
assert.equal(actor.technique_evidence.length, 2);
assert.deepEqual(actor.technique_evidence.map(item => item.technique).sort(), ['remote-email-collection', 'spearphishing-for-information-link']);
for (const item of actor.technique_evidence) {
  assert.equal(item.confidence, 'moderate');
  assert.equal(item.assessment.method, 'ai-assisted-source-comparison');
  assert.equal(item.review.reviewed_at, null);
  assert.equal(item.review.state, 'not-recorded');
  assert.ok(item.assessment.alternatives.length);
  assert.equal(item.temporal_scope.activity_first, null);
  assert.equal(item.temporal_scope.activity_last, null);
  assert.ok(item.source_locators.every(locator => item.sources.includes(locator.source)));
}
const technique = await readContent('src/content/techniques/spearphishing-for-information-link.md');
assert.equal(technique.mitre_id, 'T1598.003');
assert.equal(technique.framework_version, '19.2');
assert.deepEqual(technique.tactics, ['Reconnaissance']);
const retired = JSON.parse(await readFile('src/data/retired-relationships.json', 'utf8'));
assert.equal(retired.length, 1);
assert.equal(retired[0].previous_confidence, 'high');
assert.equal(retired[0].previous_claim_reviewed_at, null);
assert.ok(retired[0].superseded_by.includes(technique.slug));
assert.equal(String(actor.last_reviewed), '2026-08-26', 'This AI-assisted correction must not replace the dossier review date');
const source = await readContent('src/content/sources/doj-apt31-2024.md');
assert.equal(source.source_identity.body_sha256, null, 'An interstitial must not be fingerprinted as a source body');
console.log('Claim assurance, supersession, temporal unknowns, source custody and unchanged dossier review dates passed.');
