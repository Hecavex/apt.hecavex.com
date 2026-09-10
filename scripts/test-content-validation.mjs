import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureRoot = path.join(projectRoot, 'tests', 'fixtures', 'content-validation');
const manifest = JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'cases.json'), 'utf8'));
manifest.cases.push(
  { name: 'valid source-scoped claim locator', valid: true, claimFixture: 'valid' },
  { name: 'missing name locator is rejected', valid: false, claimFixture: 'missing-name', includes: ['alias or subcluster requires a source locator'] },
  { name: 'invalid source scope and invented review date', valid: false, claimFixture: 'invalid', includes: ['alias locator must refer to a dossier source', 'procedure locator must refer to its supporting source', 'unrecorded claim review must not invent a review date'] },
  { name: 'correction requires explicit rationale', valid: false, claimFixture: 'correction', includes: ['claim review needs date and rationale', 'corrected or withdrawn claim needs a correction note'] },
  { name: 'AI comparison preserves unrecorded human review', valid: true, claimFixture: 'ai-valid' },
  { name: 'AI comparison cannot certify human review', valid: false, claimFixture: 'ai-human', includes: ['AI comparison must not certify independent human review'] },
  { name: 'source comparison needs alternatives', valid: false, claimFixture: 'ai-empty', includes: ['claim comparison requires alternatives'] },
  { name: 'publication day is not an activity date', valid: false, claimFixture: 'ai-time', includes: ['publication date must not invent activity bounds'] }
);
const validator = path.join(projectRoot, 'scripts', 'validate-content.mjs');
const failures = [];

const filesBelow = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .sort((left, right) => left.name.localeCompare(right.name))
  .flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(target) : [target];
  });

const copyOverlay = (source, destination) => {
  for (const file of filesBelow(source)) {
    const target = path.join(destination, path.relative(source, file));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target);
  }
};

const removeTemporaryDirectory = (directory) => {
  const resolved = path.resolve(directory);
  const temporaryRoot = `${path.resolve(os.tmpdir())}${path.sep}`;
  if (!resolved.startsWith(temporaryRoot) || !path.basename(resolved).startsWith('apt-notes-validation-')) {
    throw new Error(`Refusing to remove unexpected fixture directory: ${resolved}`);
  }
  fs.rmSync(resolved, { recursive: true, force: true });
};

for (const fixture of manifest.cases) {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'apt-notes-validation-'));
  const contentRoot = path.join(temporaryDirectory, 'content');

  try {
    fs.cpSync(path.join(fixtureRoot, 'base'), contentRoot, { recursive: true });
    if (fixture.overlay) copyOverlay(path.join(fixtureRoot, fixture.overlay), contentRoot);
    if (fixture.claimFixture) {
      const actorPath = path.join(contentRoot, 'actors', 'europe', 'actor-one.md');
      const actor = parse(fs.readFileSync(actorPath, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
      const citation = { source: fixture.claimFixture === 'invalid' ? 'actor-one' : 'source-one', locator: 'Procedure section, bounded fixture behaviour', basis: 'procedure-evidence', checked_at: '2026-08-02' };
      actor.aliases = [{ name: 'Fixture alias', source_refs: [citation] }];
      if (fixture.claimFixture === 'missing-name') actor.aliases[0].source_refs = [];
      actor.technique_evidence[0].source_locators = [citation];
      actor.technique_evidence[0].review = { version: '1.0.0', state: fixture.claimFixture === 'correction' ? 'corrected' : 'not-recorded', reviewed_at: fixture.claimFixture === 'invalid' ? '2026-08-02' : null, rationale: '', correction_note: null };
      if (fixture.claimFixture.startsWith('ai-')) {
        const evidence = actor.technique_evidence[0];
        evidence.assessment = { method: 'ai-assisted-source-comparison', compared_at: '2026-08-02', evidence_type: 'Synthetic source allegation', confidence_scope: 'Bounded procedure', source_dependence: 'One fixture source, not independent corroboration.', mapping_rationale: 'Explicit fixture behavior.', alternatives: fixture.claimFixture === 'ai-empty' ? [] : ['No current activity inferred.'] };
        evidence.confidence_rationale = 'Bounded fixture support, not guilt or detection efficacy.';
        evidence.review.rationale = 'AI comparison, human review unrecorded.';
        if (fixture.claimFixture === 'ai-human') { evidence.review.state = 'reviewed'; evidence.review.reviewed_at = '2026-08-02'; }
        if (fixture.claimFixture === 'ai-time') evidence.temporal_scope = { date_basis: 'publication-date', activity_first: '2026-08-02' };
      }
      fs.writeFileSync(actorPath, `---\n${stringify(actor)}---\nFixture claim provenance.\n`);
    }

    const result = spawnSync(process.execPath, [
      validator,
      '--content-root', contentRoot,
      '--expected-relationships', String(manifest.expected_relationships)
    ], { cwd: projectRoot, encoding: 'utf8' });
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
    const expectedExitCode = fixture.valid ? 0 : 1;
    const missingDiagnostics = (fixture.includes ?? []).filter((diagnostic) => !output.includes(diagnostic));

    if (result.status !== expectedExitCode || missingDiagnostics.length > 0) {
      failures.push([
        `${fixture.name}: expected exit ${expectedExitCode}, received ${result.status}`,
        ...missingDiagnostics.map((diagnostic) => `${fixture.name}: missing diagnostic "${diagnostic}"`),
        output.trim()
      ].filter(Boolean).join('\n'));
      continue;
    }

    console.log(`PASS ${fixture.name}`);
  } finally {
    removeTemporaryDirectory(temporaryDirectory);
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log(`Validated ${manifest.cases.length} positive/negative content fixture cases.`);
