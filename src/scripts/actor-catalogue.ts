/** Actor discovery behaviour. Content and data attributes are server-rendered. */
const facetNames = ['origin', 'region', 'sector', 'type', 'motivation', 'status', 'confidence', 'review', 'malware'];
const advancedNames = [...facetNames, 'period'];
const confidenceRank: Record<string, number> = { high: 3, moderate: 2, low: 1 };
type ActorRow = HTMLElement;

function matchesFilters(row: ActorRow, filters: FormData): boolean {
  const query = String(filters.get('q') || '').toLowerCase();
  if (query && !row.dataset.search?.includes(query)) return false;
  if (!facetNames.every(name => {
    const value = String(filters.get(name) || '').toLowerCase();
    return !value || (row.dataset[name] || '').split('|').includes(value);
  })) return false;
  const period = filters.get('period');
  return !period || Number.parseInt(row.dataset.active || '9999', 10) <= Number(period);
}

function compareRows(left: ActorRow, right: ActorRow, sort: string): number {
  if (sort === 'reviewed' || sort === 'observed') {
    return (right.dataset[sort] || '').localeCompare(left.dataset[sort] || '');
  }
  if (sort === 'active') {
    return Number.parseInt(left.dataset.active || '9999', 10) - Number.parseInt(right.dataset.active || '9999', 10);
  }
  if (sort === 'confidence') {
    return (confidenceRank[right.dataset.confidence || ''] ?? 0) - (confidenceRank[left.dataset.confidence || ''] ?? 0);
  }
  return (left.dataset.name || '').localeCompare(right.dataset.name || '');
}

function updateFilterUrl(filters: FormData): void {
  const params = new URLSearchParams();
  for (const [name, rawValue] of filters) {
    const value = String(rawValue).trim();
    if (value && !(name === 'sort' && value === 'name')) params.set(name, value);
  }
  history.replaceState(null, '', `${location.pathname}${params.size ? '?' + params : ''}`);
}

function restoreFilterUrl(form: HTMLFormElement, advanced: HTMLDetailsElement): void {
  const initial = new URLSearchParams(location.search);
  for (const [name, value] of initial) {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) field.value = value;
  }
  if (advancedNames.some(name => initial.has(name))) advanced.open = true;
}

export function initialiseActorCatalogue(): void {
  const form = document.querySelector<HTMLFormElement>('#actor-controls');
  const list = document.querySelector<HTMLElement>('#actor-list');
  const count = document.querySelector<HTMLElement>('#result-count');
  const empty = document.querySelector<HTMLElement>('#actor-empty');
  const advanced = document.querySelector<HTMLDetailsElement>('#advanced-actor-filters');
  const activeCount = document.querySelector<HTMLElement>('[data-active-filter-count]');
  if (!form || !list || !count || !empty || !advanced || !activeCount) return;
  const rows = [...list.querySelectorAll<ActorRow>('.actor-row')];

  const applyFilters = () => {
    const filters = new FormData(form);
    updateFilterUrl(filters);
    const visibleRows = rows.filter(row => matchesFilters(row, filters));
    const sort = String(filters.get('sort') || 'name');
    visibleRows.sort((left, right) => compareRows(left, right, sort));
    rows.forEach(row => { row.hidden = true; });
    visibleRows.forEach(row => { row.hidden = false; list.append(row); });
    const advancedActive = advancedNames.filter(name => String(filters.get(name) || '').trim()).length;
    activeCount.textContent = String(advancedActive);
    advanced.classList.toggle('has-active-filters', advancedActive > 0);
    count.textContent = `${visibleRows.length} ${visibleRows.length === 1 ? 'profile' : 'profiles'}`;
    empty.hidden = visibleRows.length !== 0;
  };

  restoreFilterUrl(form, advanced);
  form.addEventListener('submit', event => { event.preventDefault(); applyFilters(); });
  form.addEventListener('input', applyFilters);
  form.addEventListener('change', applyFilters);
  form.addEventListener('reset', () => requestAnimationFrame(() => {
    advanced.open = false;
    applyFilters();
  }));
  applyFilters();
}
