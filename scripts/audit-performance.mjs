import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve(process.argv[2] || 'dist');

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Performance audit target does not exist: ${root}`);
  process.exit(1);
}

const kibibytes = value => value * 1024;
const budgets = new Map([
  ['.html', { raw: kibibytes(64), gzip: kibibytes(16) }],
  ['.css', { raw: kibibytes(80), gzip: kibibytes(16) }],
  ['.js', { raw: kibibytes(220), gzip: kibibytes(48) }],
  ['.json', { raw: kibibytes(96), gzip: kibibytes(24) }],
  ['.svg', { raw: kibibytes(64), gzip: kibibytes(20) }],
  ['.png', { raw: kibibytes(64) }],
  ['.woff2', { raw: kibibytes(48) }],
]);
// Catalogue indexes intentionally scale with the reviewed record set. Keep their
// transfer-size limits as strict as the general budget while allowing additional
// uncompressed source text for the in-context record panels and public exports.
const catalogueBudgets = new Map([
  ['api/actors.json', { raw: kibibytes(128), gzip: kibibytes(24) }],
  ['api/knowledge.json', { raw: kibibytes(192), gzip: kibibytes(28) }],
  ['api/references.json', { raw: kibibytes(128), gzip: kibibytes(24) }],
  ['api/relationships.json', { raw: kibibytes(128), gzip: kibibytes(24) }],
  ['api/sources.json', { raw: kibibytes(128), gzip: kibibytes(24) }],
  ['changes/index.html', { raw: kibibytes(96), gzip: kibibytes(20) }],
  ['knowledge/index.html', { raw: kibibytes(112), gzip: kibibytes(20) }],
  ['relationships/index.html', { raw: kibibytes(128), gzip: kibibytes(20) }],
]);
const pageShellGzipBudget = kibibytes(40);
const files = [];

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    entry.isDirectory() ? walk(target) : files.push(target);
  }
};

walk(root);

const errors = [];
const measurements = new Map();
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const format = bytes => `${(bytes / 1024).toFixed(1)} KiB`;
const measure = file => {
  if (!measurements.has(file)) {
    const content = fs.readFileSync(file);
    measurements.set(file, {
      raw: content.byteLength,
      gzip: zlib.gzipSync(content, { level: 9 }).byteLength,
    });
  }
  return measurements.get(file);
};

for (const file of files) {
  const extension = path.extname(file).toLowerCase();
  const budget = catalogueBudgets.get(relative(file)) ?? budgets.get(extension);
  if (!budget) continue;
  const size = measure(file);
  for (const kind of ['raw', 'gzip']) {
    if (budget[kind] && size[kind] > budget[kind]) {
      errors.push(`${relative(file)}: ${kind} size ${format(size[kind])} exceeds ${format(budget[kind])}`);
    }
  }
}

for (const file of files.filter(candidate => path.extname(candidate).toLowerCase() === '.html')) {
  const html = fs.readFileSync(file, 'utf8');
  const shellFiles = new Set([file]);
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    let url;
    try {
      url = new URL(match[1], 'https://apt.hecavex.com/');
    } catch {
      continue;
    }
    if (url.hostname !== 'apt.hecavex.com' || !['.css', '.js'].includes(path.extname(url.pathname))) continue;
    const target = path.resolve(root, decodeURIComponent(url.pathname).replace(/^\/+/, ''));
    if (target.startsWith(`${root}${path.sep}`) && fs.existsSync(target)) shellFiles.add(target);
  }
  const shellGzip = [...shellFiles].reduce((sum, target) => sum + measure(target).gzip, 0);
  if (shellGzip > pageShellGzipBudget) {
    errors.push(`${relative(file)}: document plus directly referenced CSS/JS is ${format(shellGzip)} gzip; budget is ${format(pageShellGzipBudget)}`);
  }
}

if (errors.length) {
  console.error(`Performance budget failed (${errors.length}):\n${errors.join('\n')}`);
  process.exit(1);
}

const largest = [...files]
  .filter(file => budgets.has(path.extname(file).toLowerCase()))
  .map(file => ({ file: relative(file), ...measure(file) }))
  .sort((left, right) => right.gzip - left.gzip)[0];

console.log(`Performance budget passed for ${files.length} built files; largest checked transfer is ${largest.file} at ${format(largest.gzip)} gzip.`);
