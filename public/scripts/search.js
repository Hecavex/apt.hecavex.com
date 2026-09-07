export {};
const form = document.querySelector('#search-form');
const input = document.querySelector('#search-q');
const output = document.querySelector('#search-results');
const status = document.querySelector('#search-status');
const empty = document.querySelector('#search-empty');
const more = document.querySelector('#search-more');
let engine;
let generation = 0;
let matches = [];
let shown = 0;
const resultNode = (record) => {
  const article = document.createElement('article');
  article.className = 'db-row search-result-row';
  const primary = document.createElement('div');
  primary.className = 'db-cell';
  const heading = document.createElement('h2');
  const link = document.createElement('a');
  link.href = record.url;
  link.textContent = record.meta.title || 'Untitled';
  if (/^\/(campaigns|malware|tools|techniques|sources)\//.test(new URL(record.url, location.origin).pathname)) link.dataset.knowledgeLink = '';
  heading.append(link);
  const excerpt = document.createElement('p');
  excerpt.textContent = new DOMParser().parseFromString(record.excerpt || record.content || '', 'text/html').body.textContent?.trim() || '';
  primary.append(heading, excerpt);
  const type = document.createElement('div');
  type.className = 'db-cell';
  const label = document.createElement('small');
  label.textContent = 'Record type';
  type.append(label, document.createTextNode(record.meta.type || 'Record'));
  article.append(primary, type);
  return article;
};
async function batch(request, focus = false) {
  more.disabled = true;
  try {
    const records = await Promise.all(matches.slice(shown, shown + 30).map((result) => result.data()));
    if (request !== generation) return;
    const nodes = records.map(resultNode);
    output.append(...nodes);
    shown += records.length;
    status.textContent = `Showing ${shown} of ${matches.length} results`;
    empty.hidden = matches.length !== 0;
    more.hidden = shown >= matches.length;
    if (focus) nodes[0]?.querySelector('a')?.focus();
  } catch {
    if (request !== generation) return;
    status.textContent = `Could not load results. Showing ${shown} of ${matches.length}. Try again or browse the catalogues below.`;
    more.hidden = false;
  } finally {
    if (request === generation) more.disabled = false;
  }
}
async function run() {
  const request = ++generation;
  const query = input.value.trim().slice(0, 160);
  const url = new URL(location.href);
  if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
  history.replaceState(null, '', url);
  output.replaceChildren();
  matches = [];
  shown = 0;
  more.hidden = true;
  empty.hidden = true;
  if (!query) { status.textContent = 'Enter a search term.'; return; }
  status.textContent = 'Searching...';
  try {
    // Served unchanged: Pagefind is generated after the Astro build.
    engine ??= await import('/pagefind/pagefind.js');
    await engine.init();
    const search = await engine.search(query);
    if (request !== generation) return;
    matches = search.results;
    await batch(request);
  } catch {
    if (request === generation) status.textContent = 'Search could not load. Submit Search to retry, or browse the catalogues below.';
  }
}
more.addEventListener('click', () => void batch(generation, true));
form.addEventListener('submit', (event) => { event.preventDefault(); void run(); });
const query = new URLSearchParams(location.search).get('q');
if (query) { input.value = query; void run(); }
