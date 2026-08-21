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
    'index.html', 'actors/index.html', 'actors/apt28/index.html', 'actors/apt44/index.html',
    'about/methodology/index.html', 'licence/index.html', 'sources/index.html', 'updates/index.html',
    'feed.xml', 'robots.txt', '.well-known/security.txt', 'CNAME',
    'sitemap-index.xml', 'pagefind/pagefind.js', 'og/default.png',
    'fonts/Lato/Lato-Regular.woff2',
    'fonts/Source_Sans_Pro/SourceSansPro-Regular.woff2',
    'fonts/Source_Sans_Pro/SourceSansPro-SemiBold.woff2',
    'fonts/Source_Sans_Pro/SourceSansPro-Bold.woff2',
    'fonts/Source_Sans_Pro/SourceSansPro-Black.woff2'
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
  assert.match(html, /https:\/\/apt\.hecavex\.com\/og\/generated\/actor-apt28\.png/);
  assert.match(html, /og:image:width[^>]+1200/);
  assert.match(html, /og:image:height[^>]+630/);
  assert.match(html, /og:image:alt/);
});

test('English-only document, themes and controls are accessible', () => {
  const html = read('index.html');
  const css = fs.readFileSync('src/styles/global.css', 'utf8');
  assert.match(html, /<html lang="en"/);
  assert.match(html, /Skip to content/);
  assert.match(html, /aria-label="Change colour theme"/);
  assert.match(html, /aria-label="Open navigation menu"/);
  assert.match(html, /aria-label="Language: English \(EN\)"/);
  assert.match(html, /class="sidebar-backdrop"/);
  assert.match(html, /sidebar\.inert/);
  assert.match(html, /event\.key === 'Escape'/);
  assert.match(html, /https:\/\/radar\.hecavex\.com\//);
  assert.match(html, /\['system', 'dark', 'light'\]/);
  assert.match(css, /:root\[data-theme=dark\]/);
  assert.match(css, /:root\[data-theme=light\]/);
  assert.match(css, /grid-template-columns: 2\.875rem minmax\(0,1fr\) max-content 2\.875rem/);
  assert.match(css, /brand-hero h1[^}]+min-width: 0; max-width: 100%/);
  assert.match(read('actors/index.html'), /name="region"/);
});

test('critical colour roles meet WCAG AA contrast', () => {
  const css = fs.readFileSync('src/styles/global.css', 'utf8');
  const dark = css.match(/:root \{([\s\S]*?)\n\}/)?.[1] ?? '';
  const light = css.match(/:root\[data-theme=light\] \{([\s\S]*?)\n\}/)?.[1] ?? '';
  const token = (block, name) => block.match(new RegExp(`--hx-${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1] ?? '';
  const luminance = hex => {
    const channels = hex.slice(1).match(/../g).map(value => Number.parseInt(value, 16) / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (left, right) => {
    const values = [luminance(left), luminance(right)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };

  assert.ok(contrast(token(dark, 'text-faint'), token(dark, 'surface-3')) >= 4.5);
  assert.ok(contrast(token(light, 'text-faint'), token(light, 'sidebar')) >= 4.5);
  assert.ok(contrast('#ffffff', token(dark, 'action')) >= 4.5);
  assert.ok(contrast('#ffffff', token(dark, 'action-hover')) >= 4.5);
  assert.match(css, /background: var\(--hx-action\)/);
});

test('actor profiles keep the readable layout, resilient table and scroll-aware contents rail', () => {
  const html = read('actors/apt28/index.html');
  const css = files
    .filter(file => file.endsWith('.css'))
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n');

  assert.match(html, /data-profile-toc/);
  assert.match(html, /aria-current="location"/);
  assert.match(html, /class="table-wrap profile-table"/);
  assert.match(html, /<colgroup>/);
  assert.match(css, /profile-toc.*aria-current/);
  assert.match(css, /profile-table.*min-width:48rem/);
  assert.match(css, /profile-table.*white-space:nowrap/);
  assert.match(css, /Source Sans Pro/);
});

test('all local links, assets and fragments resolve in the static build', () => {
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
    for (const match of markup.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const raw = match[1].replaceAll('&amp;', '&');
      if (/^(?:mailto:|tel:|javascript:|data:|\/\/)/.test(raw)) continue;
      const relativeFile = path.relative(root, file).replaceAll('\\', '/');
      const route = relativeFile === 'index.html' ? '/' : `/${relativeFile.replace(/index\.html$/, '')}`;
      const resolved = new URL(raw, `https://apt.hecavex.com${route}`);
      if (resolved.hostname !== 'apt.hecavex.com') continue;
      const clean = decodeURIComponent(resolved.pathname);
      const relative = clean.replace(/^\//, '');
      let target = clean === '/'
        ? path.join(root, 'index.html')
        : path.extname(relative)
          ? path.join(root, relative)
          : path.join(root, relative, 'index.html');
      if (!fs.existsSync(target) && !path.extname(relative)) target = path.join(root, `${relative.replace(/\/$/, '')}.html`);
      assert.ok(fs.existsSync(target), `${path.relative(root, file)} -> ${raw}`);
      const fragment = decodeURIComponent(resolved.hash.slice(1));
      if (fragment && target.endsWith('.html')) {
        const ids = new Set([...fs.readFileSync(target, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(item => item[1]));
        assert.ok(ids.has(fragment), `${path.relative(root, file)} -> ${raw} (missing fragment)`);
      }
    }
  }
});

test('shared project switcher and public project status remain consistent', () => {
  const html = read('index.html');
  const menu = html.match(/workspace-switcher[\s\S]*?<div class="language-menu">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const links = [...menu.matchAll(/href="([^"]+)"/g)].map(match => match[1] === '/' ? 'https://apt.hecavex.com/' : match[1]);
  assert.deepEqual(links, [
    'https://hecavex.com/en/research/',
    'https://radar.hecavex.com/',
    'https://apt.hecavex.com/',
    'https://labs.hecavex.com/',
    'https://labs.hecavex.com/data/'
  ]);
  assert.match(menu, /aria-current="true"><span>APT Notes<\/span>/);

  const about = read('about/index.html');
  for (const field of ['Purpose', 'Audience', 'Owner', 'Maintenance', 'Last meaningful update', 'Security and corrections']) {
    assert.match(about, new RegExp(`>${field}<`));
  }
  assert.match(about, /Maintained/);
  assert.match(about, /no monitoring or response SLA/i);
  assert.match(about, /https:\/\/labs\.hecavex\.com\/data\//);
  assert.match(about, /href="\/licence\/"/);

  const licence = read('licence/index.html');
  assert.match(licence, /Creative Commons Attribution 4\.0 International/);
  assert.match(licence, /does not relicense source publications/i);
  const actorApi = JSON.parse(read('api/actors.json'));
  assert.equal(actorApi.licence, 'CC-BY-4.0');
  assert.equal(actorApi.licence_url, 'https://apt.hecavex.com/licence/');

  const security = read('.well-known/security.txt');
  for (const field of ['Contact:', 'Canonical:', 'Policy:', 'Preferred-Languages:', 'Expires:']) assert.match(security, new RegExp(`^${field}`, 'm'));
  assert.match(security, /^Canonical: https:\/\/apt\.hecavex\.com\/\.well-known\/security\.txt$/m);
  assert.match(security, /^Policy: https:\/\/apt\.hecavex\.com\/security\/$/m);
  const expiry = security.match(/^Expires: (.+)$/m)?.[1];
  assert.ok(expiry && Number.isFinite(Date.parse(expiry)) && Date.parse(expiry) > Date.now(), 'security.txt expiry must be a future timestamp');
});

test('sitemap and feed contain only canonical public records', () => {
  const sitemap = files.filter(file => /sitemap.*\.xml$/.test(file)).map(file => fs.readFileSync(file, 'utf8')).join('\n');
  const feed = read('feed.xml');
  assert.doesNotMatch(sitemap, /localhost|github\.io|example-actor/);
  assert.match(sitemap, /https:\/\/apt\.hecavex\.com\/actors\/apt28\//);
  assert.match(sitemap, /https:\/\/apt\.hecavex\.com\/actors\/apt44\//);
  assert.doesNotMatch(sitemap, /https:\/\/apt\.hecavex\.com\/search\//);
  assert.match(feed, /APT28 profile/);
  assert.match(feed, /APT28 profile created/);
  assert.match(feed, /APT44 profile/);
  for (const match of feed.matchAll(/https:\/\/apt\.hecavex\.com\/updates\/#([^<"]+)/g)) {
    assert.match(read('updates/index.html'), new RegExp(`id="${match[1]}"`));
  }
});
