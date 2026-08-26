import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { parse } from 'yaml';

const SOURCE_DIRECTORY = resolve('src/content/sources');
const DEFAULT_OUTPUT = resolve('source-health-report.json');
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 5;

const outputArgument = process.argv.indexOf('--output');
const outputPath = resolve(outputArgument >= 0 ? process.argv[outputArgument + 1] : DEFAULT_OUTPUT);

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
      'user-agent': 'APT-Notes-Source-Health/1.0 (+https://apt.hecavex.com/about/methodology/)'
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
    if ([403, 405, 406, 501].includes(response.status)) response = await request(currentUrl, 'GET');

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) return { status: 'unavailable', http_status: response.status, final_url: currentUrl, redirects };
      const nextUrl = new URL(location, currentUrl).href;
      redirects.push({ from: currentUrl, to: nextUrl, http_status: response.status });
      currentUrl = nextUrl;
      continue;
    }

    return {
      status: response.ok ? (redirects.length ? 'redirected' : 'ok') : 'unavailable',
      http_status: response.status,
      final_url: currentUrl,
      redirects
    };
  }

  return { status: 'unavailable', http_status: null, final_url: currentUrl, redirects, error: 'Redirect limit exceeded' };
};

const { readdir } = await import('node:fs/promises');
const files = (await readdir(SOURCE_DIRECTORY)).filter((file) => /\.mdx?$/.test(file)).sort();
const records = [];

for (const file of files) {
  const path = resolve(SOURCE_DIRECTORY, file);
  try {
    const source = extractFrontmatter(await readFile(path, 'utf8'));
    if (source.draft === true) continue;
    const result = await inspectUrl(source.url);
    records.push({ id: source.id, title: source.title, original_url: source.url, checked_at: new Date().toISOString(), ...result });
    console.log(`${result.status.padEnd(11)} ${source.id} ${result.http_status ?? '-'} ${result.final_url}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    records.push({ id: file.replace(/\.mdx?$/, ''), checked_at: new Date().toISOString(), status: 'unavailable', error: message });
    console.warn(`unavailable ${file}: ${message}`);
  }
}

const report = {
  generated_at: new Date().toISOString(),
  notice: 'Maintenance evidence only. Results do not automatically alter source records or analytical assessments.',
  counts: Object.fromEntries(['ok', 'redirected', 'unavailable'].map((status) => [status, records.filter((record) => record.status === status).length])),
  records
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Wrote ${records.length} source checks to ${outputPath}`);
