import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = 'dist';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const contentUtilities = fs.readFileSync('src/utils/content.ts', 'utf8');
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
    'feed.xml', 'robots.txt', 'llms.txt', '.well-known/security.txt', 'THIRD_PARTY_NOTICES.txt', 'CNAME',
    'sitemap-index.xml', 'pagefind/pagefind.js', 'og/default.svg', 'og/default.png',
    'fonts/inter/inter-latin-400-normal.woff2',
    'fonts/inter/inter-latin-600-normal.woff2',
    'fonts/ibm-plex-mono/ibm-plex-mono-latin-400-normal.woff2',
    'fonts/ibm-plex-mono/ibm-plex-mono-latin-600-normal.woff2'
  ]) assert.ok(fs.existsSync(path.join(root, file)), file);
});

test('Cloudflare Web Analytics is gated and emitted exactly once on every HTML page', () => {
  const configuredToken = process.env.PUBLIC_HECAVEX_ANALYTICS_TOKEN?.trim() ?? '';
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const loaders = [...html.matchAll(/<script\b[^>]*\bdata-hecavex-analytics(?:=(?:"[^"]*"|'[^']*'))?[^>]*>([\s\S]*?)<\/script>/gi)];
    if (!configuredToken) {
      assert.equal(loaders.length, 0, `${path.relative(root, file)} must stay keyless in an unconfigured build`);
      continue;
    }
    assert.equal(loaders.length, 1, `${path.relative(root, file)} must contain one analytics loader`);
    const loader = loaders[0][0];
    assert.match(loader, /navigator\.doNotTrack === '1'/);
    assert.match(loader, /window\.doNotTrack === '1'/);
    assert.match(loader, /https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/);
    assert.ok(loader.includes(configuredToken), `${path.relative(root, file)} must contain the configured analytics token`);
    assert.doesNotMatch(loader, /beacon\.min\.js\?/);
  }
});

test('editorial placeholders do not leak into public output', () => {
  const output = files
    .filter(file => /\.(html|xml|json)$/.test(file))
    .map(file => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(output, /Draft [^<]* template|example\.invalid|replace-me/);
});

test('the shared public collection helper excludes draft records', () => {
  assert.match(contentUtilities, /getCollection\(collection,\s*\(\{ data \}\)\s*=>\s*!data\.draft\)/);
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

test('every internal Open Graph image resolves in the production build', () => {
  const htmlFiles = files.filter(file => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
      const tag = match[0];
      if (!/\bproperty=(["'])og:image\1/i.test(tag)) continue;
      const content = tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2];
      assert.ok(content, `${path.relative(root, file)} has an og:image without content`);
      const image = new URL(content, 'https://apt.hecavex.com/');
      if (image.hostname !== 'apt.hecavex.com') continue;
      const target = path.join(root, decodeURIComponent(image.pathname).replace(/^\/+/, ''));
      assert.ok(fs.existsSync(target), `${path.relative(root, file)} -> ${content}`);
    }
  }
});

test('English-only Cold Signal document and controls are accessible', () => {
  const html = read('index.html');
  const css = fs.readFileSync('src/styles/global.css', 'utf8');
  assert.match(html, /<html lang="en"/);
  assert.match(html, /Skip to content/);
  assert.match(html, /aria-label="Open navigation menu"/);
  assert.match(html, /class="site-header"/);
  assert.match(html, /data-portfolio-shell="v1"/);
  assert.match(html, /class="brand" href="https:\/\/hecavex\.com\/en\/"/);
  assert.match(html, /class="portfolio-navigation"/);
  assert.match(html, /class="product-navigation"/);
  assert.match(html, /data-mobile-navigation/);
  assert.match(html, /Escape/);
  assert.match(html, /https:\/\/radar\.hecavex\.com\//);
  assert.match(css, /font-family: Inter/);
  assert.match(css, /font-family: "IBM Plex Mono"/);
  assert.match(css, /--cyan: #44c7dc/);
  assert.match(css, /--green: #a2da68/);
  assert.match(css, /--danger: #ff6b6b/);
  assert.match(css, /--header-offset: 7\.25rem/);
  assert.match(css, /font-size: clamp\(2\.5rem, 5vw, 4rem\)/);
  assert.doesNotMatch(`${html}\n${css}`, /data-theme=/i);
  const actors = read('actors/index.html');
  assert.match(actors, /name="region"/);
  assert.match(actors, /<details class="advanced-filters" id="advanced-actor-filters">/);
  assert.match(actors, /data-active-filter-count/);
  assert.match(actors, /type="reset">Reset all filters/);
});

test('critical colour roles meet WCAG AA contrast', () => {
  const css = fs.readFileSync('src/styles/global.css', 'utf8');
  const cold = css.match(/:root \{([\s\S]*?)\n\}/)?.[1] ?? '';
  const token = name => cold.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1] ?? '';
  const luminance = hex => {
    const channels = hex.slice(1).match(/../g).map(value => Number.parseInt(value, 16) / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (left, right) => {
    const values = [luminance(left), luminance(right)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };

  assert.ok(contrast(token('muted'), token('bg')) >= 4.5);
  assert.ok(contrast(token('faint'), token('bg')) >= 4.5);
  assert.ok(contrast(token('cyan'), token('bg')) >= 4.5);
  assert.ok(contrast(token('green'), token('bg')) >= 4.5);
  assert.ok(contrast(token('bg'), token('cyan')) >= 4.5);
  assert.match(css, /background: var\(--cyan\)/);
});

test('identity assets use the shared Cold Signal mark colours', () => {
  const files = [
    'public/brand/hecavex-mark.svg',
    'public/favicons/favicon.svg',
    'public/og/default.svg'
  ];
  for (const file of files) {
    const svg = fs.readFileSync(file, 'utf8').toLowerCase();
    assert.match(svg, /#44c7dc/, `${file} must use the shared cyan identity role`);
    assert.match(svg, /#f2f8fb/, `${file} must use the shared white centre role`);
    assert.doesNotMatch(svg, /#ff6b6b/, `${file} must reserve danger red for status UI`);
  }
});

test('print output replaces dark surfaces with a paper-safe palette', () => {
  const css = fs.readFileSync('src/styles/global.css', 'utf8');
  const print = css.match(/@media print\s*\{([\s\S]+)\n\}\s*$/)?.[1] ?? '';

  assert.match(print, /color-scheme:\s*light/);
  for (const token of ['page', 'panel', 'bg', 'surface']) {
    assert.match(print, new RegExp(`--${token}:\\s*#fff`));
  }
  for (const token of ['ink', 'text', 'cyan', 'green', 'danger', 'amber']) {
    assert.match(print, new RegExp(`--${token}:\\s*#000`));
  }
  assert.match(print, /\.panel,[\s\S]+\.fact,[\s\S]+table,[\s\S]+background:\s*#fff\s*!important/);
  assert.match(print, /h1,[\s\S]+\.fact dd,[\s\S]+color:\s*#000\s*!important/);
  assert.match(print, /border-color:\s*#777\s*!important/);
});

test('social previews use deterministic vector outlines from repository fonts', async () => {
  const svg = fs.readFileSync('public/og/default.svg', 'utf8');
  const generator = fs.readFileSync('scripts/generate-og.mjs', 'utf8');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  assert.match(svg, /Text converted to vector outlines from repository-pinned Inter and IBM Plex Mono WOFF2 assets/);
  assert.ok([...svg.matchAll(/<path\b/g)].length >= 100);
  assert.doesNotMatch(svg, /<text\b|font-family|data:font/);
  assert.match(generator, /fontkit\.openSync/);
  assert.match(generator, /glyph\.path\.toSVG\(\)/);
  assert.equal(packageJson.devDependencies.fontkit, '2.0.4');
  for (const font of [
    'inter-latin-400-normal.woff2',
    'inter-latin-700-normal.woff2',
    'ibm-plex-mono-latin-400-normal.woff2',
    'ibm-plex-mono-latin-700-normal.woff2'
  ]) assert.match(generator, new RegExp(font.replaceAll('.', '\\.')));

  const first = await sharp(Buffer.from(svg)).png({ quality: 92 }).toBuffer();
  const second = await sharp(Buffer.from(svg)).png({ quality: 92 }).toBuffer();
  assert.deepEqual(first, second);
  assert.deepEqual(first, fs.readFileSync('public/og/default.png'));
});

test('actor profiles keep the readable layout, resilient table and scroll-aware contents rail', () => {
  const html = read('actors/apt28/index.html');
  const css = fs.readFileSync('src/styles/global.css', 'utf8');

  assert.match(html, /data-profile-toc/);
  assert.match(html, /<details class="profile-toc-mobile" data-profile-toc>/);
  assert.match(html, /data-profile-toc-current/);
  assert.match(html, /aria-current="location"/);
  assert.match(html, /class="table-wrap profile-table"/);
  assert.match(html, /<colgroup>/);
  assert.match(css, /profile-toc.*aria-current/);
  assert.match(css, /profile-toc-mobile\s*\{[^}]*position:\s*sticky/);
  assert.match(css, /profile-table table\s*\{[^}]*min-width:\s*48rem/);
  assert.match(css, /profile-table[\s\S]*white-space:\s*nowrap/);
  assert.match(css, /font-family: Inter/);
  assert.match(css, /font-family: "IBM Plex Mono"/);
  assert.match(css, /text-align:\s*justify/);
  assert.match(css, /hyphens:\s*auto/);
});

test('source records fill their metadata matrix without empty grid tracks', () => {
  const html = read('sources/aivd-mivd-laundry-bear-2025/index.html');
  const css = fs.readFileSync('src/styles/global.css', 'utf8');

  assert.match(html, /class="fact-grid source-facts" data-source-facts/);
  assert.match(html, /class="fact fact--language"/);
  assert.match(html, /class="fact fact--authors"/);
  assert.match(css, /source-facts \.fact--authors\s*\{[^}]*grid-column:\s*span 3/);
  assert.match(css, /@media \(max-width: 849px\)[\s\S]*source-facts \.fact--authors\s*\{[^}]*grid-column:\s*auto/);
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

test('shared portfolio navigation and public project status remain consistent', () => {
  const html = read('index.html');
  const menu = html.match(/<nav class="portfolio-navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  const links = [...menu.matchAll(/href="([^"]+)"/g)].map(match => match[1] === '/' ? 'https://apt.hecavex.com/' : match[1]);
  assert.deepEqual(links, [
    'https://hecavex.com/en/research/',
    'https://radar.hecavex.com/',
    'https://apt.hecavex.com/',
    'https://labs.hecavex.com/',
    'https://labs.hecavex.com/data/'
  ]);
  assert.match(menu, /aria-current="page"[^>]*>APT Notes<\/a>/);

  const about = read('about/index.html');
  for (const field of ['Purpose', 'Audience', 'Owner', 'Maintenance', 'Last meaningful update', 'Security and corrections']) {
    assert.match(about, new RegExp(`>${field}<`));
  }
  assert.match(about, /Maintained/);
  assert.match(about, /no monitoring or response SLA/i);
  assert.match(about, /https:\/\/labs\.hecavex\.com\/data\//);
  assert.match(about, /href="\/licence\/"/);
  assert.match(about, /class="shell about-shell"/);
  assert.match(about, /class="about-head"/);
  assert.match(about, /class="stat-grid about-stats"/);
  assert.match(about, /aria-label="About APT Notes sections"/);
  for (const fragment of ['purpose', 'coverage-roadmap', 'public-records', 'boundaries', 'editorial-approach']) {
    assert.match(about, new RegExp(`href="#${fragment}"`));
    assert.match(about, new RegExp(`id="${fragment}"`));
  }

  const licence = read('licence/index.html');
  assert.match(licence, /Creative Commons Attribution 4\.0 International/);
  assert.match(licence, /does not relicense source publications/i);
  assert.match(licence, /href="\/THIRD_PARTY_NOTICES\.txt"/);
  const thirdPartyNotices = read('THIRD_PARTY_NOTICES.txt');
  assert.match(thirdPartyNotices, /Copyright \(c\) Pagefind/);
  assert.match(thirdPartyNotices, /Copyright \(c\) Microsoft Corporation/);
  assert.match(thirdPartyNotices, /MIT License/g);
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
  assert.doesNotMatch(sitemap, /localhost|github\.io|example\.invalid|replace-me/);
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

test('machine discovery preserves the source and API boundaries', () => {
  const robots = read('robots.txt');
  const llms = read('llms.txt');
  assert.match(robots, /^Content-Signal: search=yes, ai-input=yes, ai-train=no$/m);
  assert.match(robots, /^User-agent: GPTBot$/m);
  assert.match(llms, /static, read-only research product/);
  assert.match(llms, /https:\/\/apt\.hecavex\.com\/api\/actors\.json/);
  assert.match(llms, /not a live IOC feed/);
});
