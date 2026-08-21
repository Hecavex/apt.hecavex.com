import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'dist');
const files = [];
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : entry.name.endsWith('.html') && files.push(path.join(directory, entry.name)));
walk(root);
const errors = [];
const canonicals = new Map();
const meta = (html, key, attribute = 'name') => html.match(new RegExp(`<meta[^>]+${attribute}=["']${key.replace(':', '\\:')}["'][^>]+content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+${attribute}=["']${key.replace(':', '\\:')}["']`, 'i'))?.slice(1).find(Boolean)?.trim() || '';

for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const html = fs.readFileSync(file, 'utf8');
  const indexable = !/name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  if (!/<html[^>]+lang=["'][^"']+/i.test(html)) errors.push(`${relative}: missing html lang`);
  if (!/<title>\s*[^<]+/i.test(html)) errors.push(`${relative}: missing title`);
  if (!meta(html, 'description')) errors.push(`${relative}: missing meta description`);
  if (indexable) {
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical/i)?.[1] || '';
    if (!canonical) errors.push(`${relative}: missing canonical`);
    if (canonicals.has(canonical)) errors.push(`${relative}: duplicate canonical also used by ${canonicals.get(canonical)}`); else canonicals.set(canonical, relative);
    for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt']) if (!meta(html, property, 'property')) errors.push(`${relative}: missing ${property}`);
    for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) if (!meta(html, name)) errors.push(`${relative}: missing ${name}`);
    const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    if (scripts.length !== 1) errors.push(`${relative}: expected one consolidated JSON-LD graph, found ${scripts.length}`);
    for (const script of scripts) {
      try {
        const data = JSON.parse(script[1]); const graph = data['@graph']; const ids = Array.isArray(graph) ? graph.map(node => node['@id']) : [];
        if (!Array.isArray(graph)) errors.push(`${relative}: JSON-LD is not an @graph`);
        const expectedIds = ['https://hecavex.com/#organization', 'https://hecavex.com/#deividas-lis', 'https://hecavex.com/#website', 'https://apt.hecavex.com/#website', 'https://labs.hecavex.com/#website', 'https://radar.hecavex.com/#website'];
        const missingIds = expectedIds.filter(id => !ids.includes(id));
        if (missingIds.length) errors.push(`${relative}: missing shared HECAVEX identities: ${missingIds.join(', ')}`);
      } catch (error) { errors.push(`${relative}: invalid JSON-LD (${error.message})`); }
    }
    if ((html.match(/<main(?:\s|>)/gi) || []).length !== 1) errors.push(`${relative}: expected exactly one main landmark`);
    if (!/<h1(?:\s|>)/i.test(html)) errors.push(`${relative}: missing h1`);
  }
  for (const image of html.match(/<img\b[^>]*>/gi) || []) if (!/\salt=["'][^"']*["']/i.test(image)) errors.push(`${relative}: image missing alt attribute`);
}

if (errors.length) { console.error([...new Set(errors)].join('\n')); process.exit(1); }
console.log('Build audit passed: SEO, consolidated schema, social metadata and accessibility structure.');
