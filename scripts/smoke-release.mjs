import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { assertTypographyRoles, readTypographyRoles } from './typography-contract.mjs';
const [target, profile] = process.argv.slice(2);
const { chromium } = await import(pathToFileURL(path.resolve(process.env.PLAYWRIGHT_MODULE || '.browser-check/node_modules/playwright-core/index.mjs')).href);
let server;
let base = target;
if (!/^https?:/.test(target)) {
  const root = path.resolve(target);
  server = http.createServer((request, response) => {
    const route = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const filename = path.resolve(root, '.' + route + (route.endsWith('/') ? 'index.html' : ''));
    if (!filename.startsWith(root + path.sep) || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) { response.writeHead(404); response.end(); return; }
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml' };
    response.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream');
    fs.createReadStream(filename).pipe(response);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port + '/';
}
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true });
try {
  const page = await browser.newPage();
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  await page.addInitScript(() => {
    window.cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => window.cspViolations.push(event.violatedDirective));
  });
  if (profile === 'apt') {
    // The September 2026 visual contract preserves the shell while replacing
    // oversized framed heroes and tiny all-caps controls with readable surfaces.
    for (const width of [320, 768, 1161, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['', 'lt/', 'actors/', 'knowledge/', 'relationships/', 'about/']) {
        await page.goto(new URL(route, base).href);
        await page.evaluate(() => document.fonts.ready);
        assertTypographyRoles(await page.evaluate(readTypographyRoles), { route, width });
        const layout = await page.evaluate(() => {
          const frame = document.querySelector('.network-bar').getBoundingClientRect();
          const hero = document.querySelector('.brand-hero');
          const heroStyle = hero && getComputedStyle(hero);
          const title = document.querySelector('h1');
          const targets = [...document.querySelectorAll('.catalogue-search, .controls, .dossier-preview, .page-head, .brand-hero, .profile-grid')];
          return {
            bodySize: getComputedStyle(document.body).fontSize,
            titleFont: getComputedStyle(title).fontFamily,
            overflow: document.documentElement.scrollWidth > innerWidth,
            clipped: targets.some(node => {
              const rect = node.getBoundingClientRect();
              return rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1);
            }),
            frameHeight: frame.height,
            heroBorder: heroStyle && [heroStyle.borderTopWidth, heroStyle.borderLeftWidth, heroStyle.borderRightWidth],
            heroHeight: hero?.getBoundingClientRect().height,
            navigationVisible: getComputedStyle(document.querySelector('.product-bar')).display !== 'none',
            navFits: [...document.querySelectorAll('.product-navigation a')].every(node => {
              const nav = node.closest('.product-navigation').getBoundingClientRect();
              const rect = node.getBoundingClientRect();
              return rect.left >= nav.left - 1 && rect.right <= nav.right + 1;
            })
          };
        });
        assert.equal(layout.bodySize, '16px', `${route} body type at ${width}`);
        assert.match(layout.titleFont, /Space Grotesk/, `${route} display type`);
        assert.equal(layout.overflow || layout.clipped, false, `${route} viewport at ${width}`);
        assert.equal(layout.frameHeight, 64, `${route} shared network row`);
        assert.equal(layout.navigationVisible, width > 1160, `${route} navigation breakpoint`);
        if (width > 1160) assert(layout.navFits, `${route} desktop navigation fits at ${width}`);
        if (layout.heroBorder) {
          assert.deepEqual(layout.heroBorder, ['0px', '0px', '0px']);
          if (width > 900) assert(layout.heroHeight >= 320, 'Open hero minimum height');
        }
        assert.deepEqual(await page.evaluate(() => window.cspViolations), []);
      }
    }
    await page.goto(base);
    await page.locator('#overview-actor-search').fill('APT28');
    await page.locator('.catalogue-search button').click();
    await page.waitForURL('**/actors/?q=APT28');
    await page.waitForFunction(() => document.querySelector('#result-count').textContent === '1 profile');
    assert.equal(await page.locator('.actor-row:visible h2').innerText(), 'APT28');
    await page.locator('#actor-controls input[name="q"]').fill('quarkflibbertigibbet');
    assert(await page.locator('#actor-empty').isVisible());
    await page.locator('#actor-controls button[type="reset"]').click();
    await page.waitForFunction(() => document.querySelector('#actor-empty').hidden);
    assert((await page.locator('.actor-row:visible').count()) > 1);
    await page.goto(new URL('actors/?origin=russia&sort=reviewed', base).href);
    assert.equal(await page.locator('#advanced-actor-filters').getAttribute('open'), '');
    assert.equal(await page.locator('[data-active-filter-count]').innerText(), '1');
    const filteredActors = await page.locator('.actor-row:visible').evaluateAll(rows => rows.map(row => ({ origin: row.dataset.origin, reviewed: row.dataset.reviewed })));
    assert(filteredActors.length > 0);
    assert(filteredActors.every(row => row.origin.split('|').includes('russia')));
    assert.deepEqual(filteredActors.map(row => row.reviewed), filteredActors.map(row => row.reviewed).sort().reverse());
    for (const q of ['APT28', 'Microsoft', 'quarkflibbertigibbet']) {
      await page.goto(new URL('search/?q=' + q, base).href);
      await page.waitForFunction(() => document.querySelector('#search-status').textContent.startsWith('Showing'));
      let count = await page.locator('.search-result-row').count();
      while (await page.locator('#search-more').isVisible()) {
        await page.locator('#search-more').click();
        await page.waitForFunction(old => document.querySelectorAll('.search-result-row').length > old, count);
        count = await page.locator('.search-result-row').count();
      }
      const links = await page.locator('.search-result-row h2 a').evaluateAll(nodes => nodes.map(node => node.href));
      assert.equal(new Set(links).size, count);
      assert.equal(await page.locator('#search-status').innerText(), 'Showing ' + count + ' of ' + count + ' results');
      if (q === 'Microsoft') assert(count > 30); else if (q === 'APT28') assert(count > 0); else assert.equal(count, 0);
      assert.deepEqual(await page.evaluate(() => window.cspViolations), []);
    }
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        async writeText(value) {
          if (!window.allowCopy) throw new DOMException('Denied', 'NotAllowedError');
          window.copiedRecord = value;
        }
      } });
    });
    let sourcePath;
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(new URL('actors/apt28/', base).href);
      const handoff = page.locator('[aria-label="Labs evidence handoff"]');
      assert.equal(await handoff.locator('a').first().getAttribute('href'), 'https://labs.hecavex.com/attack-map/?actor=apt28');
      assert.match(await handoff.innerText(), /frozen, not live-synchronized/);
      assert.match(await handoff.innerText(), /not the full actor dossier/);
      const citation = page.locator('.record-citation');
      await citation.locator('summary').click();
      const text = await citation.locator('[data-citation-text]').innerText();
      const actorJson = await page.request.get(new URL('api/actors/apt28.json', base).href).then(response => response.json());
      assert(text.includes(`Record ${actorJson.record.id}, version ${actorJson.record.version}.`));
      assert(text.includes(`Dataset ${actorJson.dataset_version}, release ${actorJson.release_id}.`));
      assert(text.endsWith('https://apt.hecavex.com/actors/apt28/'));
      await citation.locator('[data-record-copy]').click();
      await citation.locator('[data-copy-fallback]').waitFor();
      assert.equal(await citation.locator('[data-copy-fallback]').inputValue(), text);
      await page.evaluate(() => { window.allowCopy = true; });
      await citation.locator('[data-record-copy]').click();
      await page.waitForFunction(() => Boolean(window.copiedRecord));
      assert.equal(await page.evaluate(() => window.copiedRecord), text);
      assert.equal(await citation.locator('[data-copy-fallback]').count(), 0);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

      const sourceLink = page.locator('#sources [data-knowledge-link]').first();
      sourcePath = await sourceLink.getAttribute('href');
      await sourceLink.click();
      const dialog = page.locator('[data-knowledge-dialog]');
      await dialog.locator('[data-knowledge-record-fragment]').waitFor();
      assert(await dialog.isVisible());
      await page.evaluate(() => { window.allowCopy = false; });
      await dialog.locator('.record-citation summary').click();
      const sourceText = await dialog.locator('[data-citation-text]').innerText();
      assert(sourceText.endsWith(new URL(sourcePath, 'https://apt.hecavex.com').href));
      await dialog.locator('.record-citation [data-record-copy]').click();
      await dialog.locator('.record-citation [data-copy-fallback]').waitFor();
      assert.equal(await dialog.locator('.record-citation [data-copy-fallback]').inputValue(), sourceText);
      await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); });
      await dialog.locator('.knowledge-record__actions [data-record-copy]').click();
      await dialog.locator('.knowledge-record__actions [data-copy-fallback]').waitFor();
      assert.equal(await dialog.locator('.knowledge-record__actions [data-copy-fallback]').inputValue(), new URL(sourcePath, 'https://apt.hecavex.com').href);
      assert.deepEqual(await page.evaluate(() => window.cspViolations), []);
      await page.goBack();
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(new URL(page.url()).pathname, '/actors/apt28/');
    }
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
    try {
      const staticPage = await noJs.newPage();
      for (const route of ['actors/apt28/', sourcePath]) {
        await staticPage.goto(new URL(route, base).href);
        if (route === 'actors/apt28/') assert(await staticPage.locator('[aria-label="Labs evidence handoff"] a').first().isVisible());
        await staticPage.locator('.record-citation summary').click();
        assert(await staticPage.locator('[data-citation-text]').isVisible());
        assert.equal(await staticPage.locator('[data-record-copy]:visible').count(), 0);
        assert(await staticPage.locator('.record-citation a[download]').isVisible());
      }
      for (const [route, id] of [['methodology/#evidence-handoff', '#evidence-handoff'], ['lt/metodika/#irodymu-perdavimas', '#irodymu-perdavimas']]) {
        await staticPage.goto(new URL(route, base).href);
        assert(await staticPage.locator(id).isVisible());
        assert(await staticPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
    } finally { await noJs.close(); }
  } else if (profile === 'labs') {
    await page.goto(new URL('attack-map/?actor=apt28', base).href);
    await page.waitForFunction(() => !/Loading/.test(document.querySelector('#result-count').textContent));
    assert.equal(await page.locator('#actor-filter').inputValue(), 'apt28');
    assert(await page.locator('#evidence-results').innerText().then(text => text.includes('APT28')));
    assert.deepEqual(await page.evaluate(() => window.cspViolations), []);
    await page.goto(new URL('baltic-threat-atlas/', base).href);
    await page.waitForFunction(() => document.querySelector('#atlas-count').textContent.includes('observations'));
    await page.locator('#atlas-search').fill('846');
    assert.equal(await page.locator('#atlas-records > article:visible').count(), 1);
    assert.deepEqual(await page.evaluate(() => window.cspViolations), []);
  } else throw new Error('Unknown smoke profile');
  assert.deepEqual(failures, []);
  console.log(profile + ' served-release browser smoke passed');
} finally {
  await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
}
