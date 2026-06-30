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
  // Hash-based CSP: το Astro υπολογίζει sha256 για κάθε inline/bundled script που
  // ελέγχει (Vercel Analytics, ClientRouter, nav, hero, menu) και τα εκπέμπει σε
  // <meta> CSP ανά σελίδα → script-src 'self' + hashes, ΧΩΡΙΣ 'unsafe-inline'.
  // Το meta αναλαμβάνει μόνο script-src/style-src (per-page hashes, που δεν χωράνε
  // σε static header). Οι resource directives + frame-ancestors μένουν στο
  // vercel.json. style-src κρατά 'unsafe-inline' για τα inline style="" attributes
  // (δεν είναι hashable· χαμηλό XSS surface). Το JSON-LD (type=ld+json) είναι data
  // block — δεν εκτελείται, οπότε το script-src δεν το μπλοκάρει (verified: 0 violations).
  experimental: {
    csp: {
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
});
