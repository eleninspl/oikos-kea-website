/**
 * (1) «Συνοδευτικά Ποτού» → στο τέλος των Κρασιών (delete bar-bites tab).
 * (2) «Ροφήματα» + «Τσάι» → μέσα στο tab Καφέδες, που γίνεται «Καφέδες & Ροφήματα»
 *     (delete hot-drinks tab).
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/merge-drinks-barbites.ts
 */
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 's7x6np2r',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  apiVersion: '2022-09-09',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const ref = (id: string) => ({ _type: 'reference', _ref: id });

async function run() {
  const maxCatRank: string = await client.fetch(
    `*[_type=="category"]|order(orderRank desc)[0].orderRank`,
  );
  let r = LexoRank.parse(maxCatRank);
  const next = () => (r = r.genNext()).toString();

  const tx = client
    .transaction()
    // (1) bar-bites category → wines (μετά τα dessert wines)
    .patch('cat.bar-bites.0', { set: { menu: ref('menu.wines'), orderRank: next() } })
    // (2) Ροφήματα + Τσάι → coffee tab (μετά τους Καφέδες)
    .patch('cat.hot-drinks.0', { set: { menu: ref('menu.coffee'), orderRank: next() } })
    .patch('cat.hot-drinks.1', { set: { menu: ref('menu.coffee'), orderRank: next() } })
    // rename coffee tab
    .patch('menu.coffee', { set: { labelEl: 'Καφέδες & Ροφήματα', labelEn: 'Coffee & Beverages' } })
    // delete emptied tabs
    .delete('menu.bar-bites')
    .delete('menu.hot-drinks');

  await tx.commit({ visibility: 'async' });
  console.log(
    '✓ Συνοδευτικά Ποτού → Κρασιά · Ροφήματα+Τσάι → Καφέδες & Ροφήματα · 2 tabs διαγράφηκαν',
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
