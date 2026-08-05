import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'dist';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    entry.isDirectory() ? walk(target) : files.push(target);
  }
};
walk(root);

test('required production routes and assets exist', () => {
  for (const file of [
    'index.html', 'actors/index.html', 'actors/apt28/index.html',
    'about/methodology/index.html', 'sources/index.html', 'updates/index.html',
    'feed.xml', 'robots.txt', '.well-known/security.txt', 'CNAME',
    'sitemap-index.xml', 'pagefind/pagefind.js', 'og/default.png'
  ]) assert.ok(fs.existsSync(path.join(root, file)), file);
});

test('drafts do not leak into public output', () => {
  const output = files
    .filter(file => /\.(html|xml|json)$/.test(file))
    .map(file => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(output, /Draft actor template|example-actor|example-malware|example-campaign|example-source/);
});

test('production metadata is canonical', () => {
  const html = read('actors/apt28/index.html');
  assert.match(html, /https:\/\/apt\.hecavex\.com\/actors\/apt28\//);
  assert.doesNotMatch(html, /localhost|github\.io/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /https:\/\/apt\.hecavex\.com\/og\/default\.png/);
});

test('English-only document, themes and controls are accessible', () => {
  const html = read('index.html');
  const css = fs.readFileSync('src/styles/global.css', 'utf8');
  assert.match(html, /<html lang="en"/);
  assert.match(html, /Skip to content/);
  assert.match(html, /aria-label="Change colour theme"/);
  assert.match(html, /aria-label="Open navigation menu"/);
  assert.match(html, /\['system', 'dark', 'light'\]/);
  assert.match(css, /:root\[data-theme=dark\]/);
  assert.match(css, /:root\[data-theme=light\]/);
  assert.match(read('actors/index.html'), /name="region"/);
});

test('all root-relative links and assets resolve in the static build', () => {
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const raw = match[1].replaceAll('&amp;', '&');
      if (!raw.startsWith('/') || raw.startsWith('//')) continue;
      const clean = decodeURIComponent(raw.split(/[?#]/)[0]);
      if (!clean) continue;
      const relative = clean.replace(/^\//, '');
      const target = clean === '/'
        ? path.join(root, 'index.html')
        : path.extname(relative)
          ? path.join(root, relative)
          : path.join(root, relative, 'index.html');
      assert.ok(fs.existsSync(target), `${path.relative(root, file)} -> ${raw}`);
    }
  }
});

test('sitemap and feed contain only canonical public records', () => {
  const sitemap = files.filter(file => /sitemap.*\.xml$/.test(file)).map(file => fs.readFileSync(file, 'utf8')).join('\n');
  const feed = read('feed.xml');
  assert.doesNotMatch(sitemap, /localhost|github\.io|example-actor/);
  assert.match(sitemap, /https:\/\/apt\.hecavex\.com\/actors\/apt28\//);
  assert.match(feed, /APT28 profile/);
  assert.match(feed, /APT28 profile created/);
});
