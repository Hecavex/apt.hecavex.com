import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { parse } from 'yaml';

const SOURCE_DIRECTORY = resolve('src/content/sources');
const DEFAULT_OUTPUT = resolve('.codex-tmp/source-health-report.json');
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 5;
const MAX_CONCURRENT_CHECKS = 8;
const INCONCLUSIVE_HTTP_STATUSES = new Set([400, 401, 403, 407, 408, 425, 429, 500, 502, 503, 504]);

const outputArgument = process.argv.indexOf('--output');
const positionalOutput = process.argv.slice(2).find((argument) => !argument.startsWith('-'));
const requestedOutput = outputArgument >= 0 ? process.argv[outputArgument + 1] : positionalOutput;
if (outputArgument >= 0 && !requestedOutput) throw new Error('--output requires a path');
const outputPath = resolve(requestedOutput || DEFAULT_OUTPUT);

const extractFrontmatter = (text) => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('Missing YAML frontmatter');
  return parse(match[1]);
};

const isPublicHttpUrl = (value) => {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) return false;
  const host = url.hostname.toLowerCase();
  return !(
    host === 'localhost'
    || host.endsWith('.local')
    || host === '0.0.0.0'
    || host === '::1'
    || /^127\./.test(host)
    || /^10\./.test(host)
    || /^192\.168\./.test(host)
    || /^169\.254\./.test(host)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
};

const request = async (url, method) => {
  const response = await fetch(url, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.1',
      'user-agent': 'APT-Notes-Source-Health/1.0 (+https://apt.hecavex.com/methodology/)'
    }
  });
  if (method === 'GET') await response.body?.cancel();
  return response;
};

const inspectUrl = async (originalUrl) => {
  let currentUrl = originalUrl;
  const redirects = [];

  for (let index = 0; index <= MAX_REDIRECTS; index += 1) {
    if (!isPublicHttpUrl(currentUrl)) throw new Error('Redirected to a non-public HTTP endpoint');
    let response = await request(currentUrl, 'HEAD');

    // Some publishers return an error redirect to HEAD while serving the same
    // canonical URL successfully with GET. Retry the current URL before
    // following a non-successful HEAD response so the check measures the
    // document readers can actually retrieve, not a HEAD-specific error path.
    if (!response.ok) response = await request(currentUrl, 'GET');

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) return { status: 'unavailable', http_status: response.status, final_url: currentUrl, redirects };
      const nextUrl = new URL(location, currentUrl).href;
      redirects.push({ from: currentUrl, to: nextUrl, http_status: response.status });
      currentUrl = nextUrl;
      continue;
    }

    return {
      status: response.ok
        ? (redirects.length ? 'redirected' : 'ok')
        : INCONCLUSIVE_HTTP_STATUSES.has(response.status) ? 'unknown' : 'unavailable',
      http_status: response.status,
      final_url: currentUrl,
      redirects
    };
  }

  return { status: 'unavailable', http_status: null, final_url: currentUrl, redirects, error: 'Redirect limit exceeded' };
};

const { readdir } = await import('node:fs/promises');
const files = (await readdir(SOURCE_DIRECTORY)).filter((file) => /\.mdx?$/.test(file)).sort();
const records = new Array(files.length);

const inspectFile = async (file) => {
  const path = resolve(SOURCE_DIRECTORY, file);
  try {
    const source = extractFrontmatter(await readFile(path, 'utf8'));
    if (source.draft === true) return null;
    const result = await inspectUrl(source.url);
    const record = { id: source.id, title: source.title, original_url: source.url, checked_at: new Date().toISOString(), ...result };
    console.log(`${result.status.padEnd(11)} ${source.id} ${result.http_status ?? '-'} ${result.final_url}`);
    return record;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const record = { id: file.replace(/\.mdx?$/, ''), checked_at: new Date().toISOString(), status: 'unknown', error: message };
    console.warn(`unknown     ${file}: ${message}`);
    return record;
  }
};

let nextFile = 0;
const workers = Array.from({ length: Math.min(MAX_CONCURRENT_CHECKS, files.length) }, async () => {
  while (nextFile < files.length) {
    const index = nextFile;
    nextFile += 1;
    records[index] = await inspectFile(files[index]);
  }
});
await Promise.all(workers);
const publicRecords = records.filter(Boolean);

const report = {
  generated_at: new Date().toISOString(),
  notice: 'Maintenance evidence only. Results do not automatically alter source records or analytical assessments.',
  counts: Object.fromEntries(['ok', 'redirected', 'unknown', 'unavailable'].map((status) => [status, publicRecords.filter((record) => record.status === status).length])),
  records: publicRecords
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Wrote ${publicRecords.length} source checks to ${outputPath}`);
