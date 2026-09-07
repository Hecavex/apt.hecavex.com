// Read-only literal-name locator proposals. A hit is not an identity assessment.
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { parse } from 'yaml';
const load = async (directory) => Promise.all((await readdir(directory)).filter((name) => name.endsWith('.md')).map(async (name) => parse((await readFile(`${directory}/${name}`, 'utf8')).match(/^---\r?\n([\s\S]*?)\r?\n---/)[1])));
const sources = await load('src/content/sources');
const actors = await load('src/content/actors');
const bodies = new Map();
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < sources.length) {
    const source = sources[next++];
    if (source.draft || /\.pdf(?:[?#]|$)/i.test(source.url)) continue;
    try {
      const response = await fetch(source.url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) { await response.body?.cancel(); continue; }
      const reader = response.body.getReader(); const chunks = []; let size = 0;
      while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 4 * 1024 * 1024) { await reader.cancel(); throw new Error('Source body exceeds locator-check budget'); } chunks.push(Buffer.from(value)); }
      const plain = Buffer.concat(chunks).toString('utf8').replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/&(?:nbsp|amp);/g, ' ').replace(/\s+/g, ' ');
      bodies.set(source.id, plain);
    } catch { /* Failed retrieval is not a negative attribution decision. */ }
  }
}));
const records = actors.flatMap((actor) => [...(actor.aliases ?? []), ...(actor.subclusters ?? [])].map((alias) => {
  const pattern = new RegExp(`(?<![A-Za-z0-9])${alias.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9])`, 'i');
  const matching = actor.sources.filter((id) => pattern.test(bodies.get(id) || ''));
  return { actor: actor.id, alias: alias.name, source_ids: matching, basis: 'source-mentions-name', locator: `Find the literal name "${alias.name}" in the publication. This establishes that the name is mentioned, not identical cluster boundaries.`, checked_at: new Date().toISOString().slice(0, 10) };
}));
await mkdir('.codex-tmp', { recursive: true });
await writeFile('.codex-tmp/alias-locator-proposals.json', `${JSON.stringify({ notice: 'Literal source-name matches only. Existing scope and relationship type are not changed by this retrieval check.', records }, null, 2)}\n`);
console.log(`${records.filter((record) => record.source_ids.length).length} of ${records.length} names have literal locator proposals. Missing names require a different source or manual PDF review.`);
