import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureRoot = path.join(projectRoot, 'tests', 'fixtures', 'content-validation');
const manifest = JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'cases.json'), 'utf8'));
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
