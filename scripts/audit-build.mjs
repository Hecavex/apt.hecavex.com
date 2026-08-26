import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'dist');
const files = [];
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : entry.name.endsWith('.html') && files.push(path.join(directory, entry.name)));
walk(root);
const errors = [];
const canonicals = new Map();
const knowledgeLinks = [];
const meta = (html, key, attribute = 'name') => html.match(new RegExp(`<meta[^>]+${attribute}=["']${key.replace(':', '\\:')}["'][^>]+content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+${attribute}=["']${key.replace(':', '\\:')}["']`, 'i'))?.slice(1).find(Boolean)?.trim() || '';

for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const html = fs.readFileSync(file, 'utf8');
  const compatibilityRoute = /<html[^>]+data-compatibility-route=["']true["']/i.test(html);
  const indexable = !/name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  if (!/<html[^>]+lang=["'][^"']+/i.test(html)) errors.push(`${relative}: missing html lang`);
  if (!/<title>\s*[^<]+/i.test(html)) errors.push(`${relative}: missing title`);
  if (!meta(html, 'description')) errors.push(`${relative}: missing meta description`);
  if (!/<link[^>]+rel=["']icon["'][^>]+href=["']\/favicon\.svg["']/i.test(html) && !/<link[^>]+href=["']\/favicon\.svg["'][^>]+rel=["']icon["']/i.test(html)) errors.push(`${relative}: missing shared SVG favicon`);
  if (!/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']\/apple-touch-icon\.png["']/i.test(html) && !/<link[^>]+href=["']\/apple-touch-icon\.png["'][^>]+rel=["']apple-touch-icon["']/i.test(html)) errors.push(`${relative}: missing shared Apple touch icon`);
  if (!/<link[^>]+rel=["']manifest["'][^>]+href=["']\/site\.webmanifest["']/i.test(html) && !/<link[^>]+href=["']\/site\.webmanifest["'][^>]+rel=["']manifest["']/i.test(html)) errors.push(`${relative}: missing origin manifest`);
  if (indexable) {
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical/i)?.[1] || '';
    if (!canonical) errors.push(`${relative}: missing canonical`);
    if (!compatibilityRoute) {
      if (canonicals.has(canonical)) errors.push(`${relative}: duplicate canonical also used by ${canonicals.get(canonical)}`); else canonicals.set(canonical, relative);
    }
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

  const dialogCount = (html.match(/<dialog\b[^>]*data-knowledge-dialog(?:\s|=|>)/gi) || []).length;
  if (dialogCount !== 1) errors.push(`${relative}: expected one shared knowledge dialog, found ${dialogCount}`);
  if (!/<dialog\b[^>]*data-knowledge-dialog[^>]*aria-labelledby=["']knowledge-dialog-label["']/i.test(html)) errors.push(`${relative}: shared knowledge dialog is missing its static accessible name`);
  if (!/<button\b[^>]*data-knowledge-dialog-close[^>]*aria-label=["'][^"']+["']/i.test(html)) errors.push(`${relative}: shared knowledge dialog is missing its labelled close control`);

  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map(match => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) errors.push(`${relative}: duplicate DOM IDs (${duplicateIds.join(', ')})`);

  if (/^(campaigns|malware|tools|techniques|sources)\/[^/]+\/index\.html$/.test(relative)) {
    const fragments = (html.match(/data-knowledge-record-fragment(?:\s|=|>)/gi) || []).length;
    if (fragments !== 1) errors.push(`${relative}: expected one knowledge fallback fragment, found ${fragments}`);
    if (!/data-knowledge-record-heading(?:\s|=|>)/i.test(html)) errors.push(`${relative}: knowledge fallback is missing its focusable heading`);
  }

  if (relative === 'about/methodology/index.html') {
    if (!compatibilityRoute) errors.push(`${relative}: missing compatibility-route marker`);
    if (!/rel=["']canonical["'][^>]+href=["']https:\/\/apt\.hecavex\.com\/methodology\//i.test(html) && !/href=["']https:\/\/apt\.hecavex\.com\/methodology\/["'][^>]+rel=["']canonical["']/i.test(html)) errors.push(`${relative}: canonical does not target /methodology/`);
    if (!/http-equiv=["']refresh["'][^>]+content=["']0;\s*url=\/methodology\//i.test(html)) errors.push(`${relative}: missing immediate static redirect`);
    if (!/<a[^>]+href=["']\/methodology\/["']/i.test(html)) errors.push(`${relative}: missing visible methodology fallback link`);
  }

  for (const anchor of html.match(/<a\b[^>]*data-knowledge-link[^>]*>/gi) || []) {
    const href = anchor.match(/\shref=["']([^"']+)["']/i)?.[1];
    if (href) knowledgeLinks.push({ source: relative, href });
  }
}

for (const link of knowledgeLinks) {
  let url;
  try { url = new URL(link.href, 'https://apt.hecavex.com/'); } catch { errors.push(`${link.source}: invalid knowledge link ${link.href}`); continue; }
  if (url.origin !== 'https://apt.hecavex.com') { errors.push(`${link.source}: knowledge link is not same-origin (${url.href})`); continue; }
  if (!/^\/(campaigns|malware|tools|techniques|sources)\/[a-z0-9-]+\/$/.test(url.pathname)) errors.push(`${link.source}: knowledge link is outside the secondary-record allowlist (${url.pathname})`);
  const target = path.join(root, url.pathname.replace(/^\/+/, ''), 'index.html');
  if (!fs.existsSync(target)) errors.push(`${link.source}: knowledge fallback does not exist (${url.pathname})`);
}

for (const required of ['methodology/index.html', 'about/methodology/index.html', 'changes/index.html', 'changes/feed.xml', 'api/index.json', 'api/version.json', 'api/relationships.json', 'api/changes.json', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest']) {
  if (!fs.existsSync(path.join(root, required))) errors.push(`missing required publication output: ${required}`);
}

if (errors.length) { console.error([...new Set(errors)].join('\n')); process.exit(1); }
console.log('Build audit passed: SEO, consolidated schema, social metadata and accessibility structure.');
