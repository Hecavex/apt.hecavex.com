import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';

// A deliberately bounded metadata projection, not an ATT&CK mirror.
const sourceCommit = '6cda5ad8462c79e14fbb872f4e09059b18e0cfc4';
const sourceUrl = `https://raw.githubusercontent.com/mitre-attack/attack-stix-data/${sourceCommit}/enterprise-attack/enterprise-attack-19.2.json`;
const sourceSha256 = 'dc1639caa5501d720e280cf1cbd8fbe009884a0c9b3e6e9ed9d0c25166c3d8f4';
const manifestSha256 = 'b91412fcbd4d64cc3073656a87a9a689ce269146af6675bccf5dee7f6605632a';
const output = 'src/data/attack-framework.json';
const records = await Promise.all((await readdir('src/content/techniques')).filter((name) => name.endsWith('.md')).map(async (name) => {
  const path = `src/content/techniques/${name}`;
  const text = await readFile(path, 'utf8');
  return { path, text, data: parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]) };
}));
let manifest;
if (process.argv.includes('--refresh')) {
  const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`Pinned ATT&CK fetch failed: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (createHash('sha256').update(bytes).digest('hex') !== sourceSha256) throw new Error('Pinned ATT&CK byte digest differs');
  const bundle = JSON.parse(bytes.toString('utf8'));
  const idOf = (item) => item.external_references?.find((ref) => ref.source_name === 'mitre-attack')?.external_id;
  const wanted = new Set(records.map((record) => record.data.mitre_id));
  const techniques = Object.fromEntries(bundle.objects.filter((item) => item.type === 'attack-pattern' && wanted.has(idOf(item))).map((item) => [idOf(item), {
    name: item.name, stix_id: item.id,
    tactics: item.kill_chain_phases.filter((phase) => phase.kill_chain_name === 'mitre-attack').map((phase) => phase.phase_name).sort(),
    revoked: item.revoked === true, deprecated: item.x_mitre_deprecated === true
  }]).sort(([a], [b]) => a.localeCompare(b)));
  const used = new Set(Object.values(techniques).flatMap((item) => item.tactics));
  const tactics = Object.fromEntries(bundle.objects.filter((item) => item.type === 'x-mitre-tactic' && used.has(item.x_mitre_shortname)).map((item) => [item.x_mitre_shortname, { id: idOf(item), name: item.name, stix_id: item.id }]).sort(([a], [b]) => a.localeCompare(b)));
  manifest = { schema_version: '1.0.0', framework: { name: 'MITRE ATT&CK', domain: 'enterprise-attack', version: '19.2', source_commit: sourceCommit, source_url: sourceUrl, source_sha256: sourceSha256, derived_at: '2026-09-07', selection: 'Exact published APT Notes technique metadata. Tactic membership is framework metadata, not a procedure-specific claim.' }, tactics, techniques };
  await writeFile(output, `${JSON.stringify(manifest)}\n`);
} else {
  const bytes = await readFile(output);
  if (createHash('sha256').update(bytes).digest('hex') !== manifestSha256) throw new Error('Compact framework digest differs. Verify an intentional change against the pinned official source.');
  manifest = JSON.parse(bytes.toString('utf8'));
}
if (manifest.framework.source_commit !== sourceCommit || manifest.framework.source_sha256 !== sourceSha256) throw new Error('Unexpected framework baseline');
for (const record of records) {
  const technique = manifest.techniques[record.data.mitre_id];
  if (!technique || technique.revoked || technique.deprecated) throw new Error(`Unsupported current technique ${record.data.mitre_id}`);
  const tactics = technique.tactics.map((key) => manifest.tactics[key]);
  const fields = `tactic: ${tactics.map((item) => item.name).join(' / ')}\ntactics: ${JSON.stringify(tactics.map((item) => item.name))}\ntactic_ids: ${JSON.stringify(tactics.map((item) => item.id))}\nframework_version: "19.2"`;
  if (process.argv.includes('--write')) {
    const next = record.text.replace(/^tactic:.*(?:\r?\n(?:tactics|tactic_ids|framework_version):.*)*/m, fields);
    await writeFile(record.path, next);
  } else if (record.data.framework_version !== '19.2' || JSON.stringify(record.data.tactics) !== JSON.stringify(tactics.map((item) => item.name)) || JSON.stringify(record.data.tactic_ids) !== JSON.stringify(tactics.map((item) => item.id)) || record.data.tactic !== tactics.map((item) => item.name).join(' / ')) throw new Error(`Framework metadata drift: ${record.path}`);
}
if (records.length !== Object.keys(manifest.techniques).length) throw new Error('Framework technique selection differs');
console.log(`Pinned Enterprise ATT&CK 19.2 metadata checked for ${records.length} techniques.`);
