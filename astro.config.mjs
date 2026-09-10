import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://apt.hecavex.com',
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap({ filter: (page) => {
    const pathname = new URL(page).pathname;
    const compatibilityIndexes = new Set(['/campaigns/', '/malware/', '/tools/', '/techniques/', '/sources/', '/updates/']);
    return !pathname.includes('/drafts/') && pathname !== '/search/' && pathname !== '/about/methodology/' && !compatibilityIndexes.has(pathname);
  } })],
  build: { format: 'directory' },
  // Keep shared client scripts cacheable rather than repeating them in every record.
  vite: { build: { assetsInlineLimit: (filePath) => filePath.endsWith('.js') ? false : undefined } },
  security: { checkOrigin: true }
});
