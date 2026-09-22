import assert from 'node:assert/strict';

// Runs inside the browser; keep this function self-contained for page.evaluate.
export function readTypographyRoles() {
  const selectors = {
    body: 'body', title: 'main h1', eyebrow: 'main .eyebrow',
    brandMetadata: '.brand-copy small', productMetadata: '.product-identity span',
    networkNavigation: '.portfolio-navigation a', productNavigation: '.product-navigation a',
    mobileNavigation: '.mobile-navigation-panel a', menuControl: '.mobile-navigation summary',
    headerSearch: '.header-search input', headerLanguage: '.header-search > a',
    heroLead: '.brand-hero .lead', heroAction: '.brand-hero .hero-actions > a',
    heroButton: '.catalogue-search button', sectionTitle: '.section-head h2',
    previewTitle: '.dossier-preview h3',
  };
  return Object.fromEntries(Object.entries(selectors).map(([role, selector]) => {
    const element = document.querySelector(selector);
    if (!element) return [role, null];
    const css = getComputedStyle(element);
    return [role, {
      family: css.fontFamily, size: parseFloat(css.fontSize), weight: css.fontWeight,
      leading: css.lineHeight, tracking: css.letterSpacing, transform: css.textTransform,
    }];
  }));
}

export function assertTypographyRoles(roles, { route, width }) {
  for (const name of ['body', 'title', 'brandMetadata', 'productMetadata', 'networkNavigation', 'productNavigation', 'mobileNavigation', 'menuControl', 'headerSearch', 'headerLanguage']) {
    assert(roles[name], `${route || '/'} missing required typography role: ${name}`);
  }
  if (route === '') {
    for (const name of ['eyebrow', 'heroLead', 'heroAction', 'heroButton', 'sectionTitle', 'previewTitle']) {
      assert(roles[name], `Overview missing required typography role: ${name}`);
    }
  }
  const check = (name, { family = 'Inter', size, weight = '600', leading = 'normal', tracking = 0 } = {}) => {
    const role = roles[name];
    if (!role) return; // Route-specific roles are checked where their markup exists.
    const label = `${route || '/'} ${name} typography at ${width}`;
    assert(role.family.includes(family), `${label}: family`);
    if (size !== undefined) assert(Math.abs(role.size - size) < 0.02, `${label}: size ${role.size}`);
    assert.equal(role.weight, weight, `${label}: weight`);
    if (leading === 'normal') assert.equal(role.leading, 'normal', `${label}: normal leading`);
    else assert(Math.abs(parseFloat(role.leading) - role.size * leading) < 0.05, `${label}: leading ${role.leading}`);
    const actualTracking = role.tracking === 'normal' ? 0 : parseFloat(role.tracking);
    assert(Math.abs(actualTracking - role.size * tracking) < 0.005, `${label}: tracking ${role.tracking}`);
    assert.equal(role.transform, 'none', `${label}: case`);
  };
  check('body', { size: 16, weight: '400', leading: 1.65, tracking: -0.006 });
  check('title', { family: 'Space Grotesk', leading: 1.08, tracking: -0.04 });
  check('eyebrow', { size: 12, leading: 1.5, tracking: 0.02 });
  for (const name of ['brandMetadata', 'productMetadata']) check(name, { size: 12, weight: '500' });
  for (const name of ['networkNavigation', 'productNavigation', 'mobileNavigation', 'headerSearch', 'headerLanguage']) check(name, { size: 12 });
  for (const name of ['menuControl', 'heroButton', 'heroAction']) check(name, { size: 14, leading: 1.5 });
  check('heroLead', { size: Math.max(17.6, Math.min(width * 0.016, 20)), weight: '400', leading: 1.45, tracking: -0.006 });
  check('sectionTitle', { family: 'Space Grotesk', leading: 1.1, tracking: -0.035 });
  check('previewTitle', { family: 'Space Grotesk', leading: 1.2, tracking: -0.035 });
}
