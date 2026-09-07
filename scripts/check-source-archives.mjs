import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { parse } from 'yaml';
const directory = 'src/content/sources';
const records = [];
for (const file of (await readdir(directory)).filter((name) => name.endsWith('.md')).sort()) {
  const text = await readFile(`${directory}/${file}`, 'utf8');
  const record = parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  if (record.draft || record.archived_url) continue;
  records.push(record);
}
const results = [];
let cursor = 0;
await Promise.all(Array.from({ length: 2 }, async () => {
  while (cursor < records.length) {
    const record = records[cursor++];
    const result = { id: record.id, checked_at: new Date().toISOString(), status: 'unverified', archive_url: null, note: '' };
    try {
      const endpoint = new URL('https://archive.org/wayback/available');
      endpoint.searchParams.set('url', record.url);
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error(`Archive availability returned HTTP ${response.status}`);
      const capture = (await response.json()).archived_snapshots?.closest;
      if (!capture?.available) result.note = 'No capture returned by archive availability API.';
      else if (capture.timestamp.slice(0, 8) < String(record.published_at).replaceAll('-', '').slice(0, 8)) result.note = 'Only a pre-publication capture was returned. It was not accepted.';
      else {
        const archive = new URL(capture.url);
        if (archive.hostname !== 'web.archive.org' || !archive.pathname.startsWith('/web/')) throw new Error('Unexpected archive destination');
        archive.protocol = 'https:';
        const check = await fetch(archive.href, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) });
        if (check.status !== 200 || new URL(check.url).hostname !== 'web.archive.org') throw new Error(`Capture verification returned HTTP ${check.status}`);
        result.status = 'verified-capture'; result.archive_url = archive.href;
        result.note = 'Availability API identified a post-publication capture and its archive response returned HTTP 200. Source content equivalence still requires editorial review.';
      }
    } catch (error) { result.note = error.message; }
    results.push(result);
    console.log(`${result.id}: ${result.status} - ${result.note}`);
  }
}));
await mkdir('.codex-tmp', { recursive: true });
await writeFile('.codex-tmp/archive-health-report.json', `${JSON.stringify({ checked_at: new Date().toISOString(), records: results.sort((a,b) => a.id.localeCompare(b.id)) }, null, 2)}\n`);
