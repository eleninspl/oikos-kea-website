import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { site } from './src/lib/site';

export default defineConfig({
  // Κανονικό URL — μία πηγή αλήθειας στο src/lib/site.ts
  site: site.web.siteUrl,
  integrations: [sitemap()],
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  output: 'static',
});
