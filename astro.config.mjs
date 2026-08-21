import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://apt.hecavex.com',
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.includes('/drafts/') && !page.includes('/search/') })],
  build: { format: 'directory' },
  security: { checkOrigin: true }
});
