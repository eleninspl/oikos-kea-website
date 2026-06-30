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
  // CSP: όλο το policy ζει στο vercel.json (HTTP header), μία πηγή αλήθειας.
  // ΔΕΝ χρησιμοποιούμε το experimental.csp του Astro: εκπέμπει <meta> CSP με
  // sha256 hashes στο style-src, και βάσει spec η παρουσία hash ΑΚΥΡΩΝΕΙ το
  // 'unsafe-inline' → όλα τα inline style="" attributes μπλοκάρονται στο
  // production (σπασμένες εικόνες/layout). Το header CSP κρατά 'unsafe-inline'
  // για script & style, που είναι ό,τι χρειάζεται αυτό το static site.
});
