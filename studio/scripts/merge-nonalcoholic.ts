/**
 * Συγχώνευση: Καφέδες, Ροφήματα, Τσάι, Χυμοί, Milkshake, Smoothies → ένα tab
 * (με αυτή τη σειρά). Μεταφέρει τις 3 κατηγορίες του «Χυμοί & Smoothies» στο
 * tab Καφέδες (μετά τα υπάρχοντα) και διαγράφει το juices tab.
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/merge-nonalcoholic.ts
 */
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';
import { PROJECT_ID, DATASET } from './_env';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2022-09-09',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const ref = (id: string) => ({ _type: 'reference', _ref: id });
// Χυμοί → Milkshake → Smoothies (στη ζητούμενη σειρά)
const JUICES_CATS = ['cat.juices.0', 'cat.juices.milkshake', 'cat.juices.smoothies'];

async function run() {
  const maxCatRank: string = await client.fetch(
    `*[_type=="category"]|order(orderRank desc)[0].orderRank`,
  );
  let r = LexoRank.parse(maxCatRank);

  let tx = client.transaction();
  for (const id of JUICES_CATS) {
    r = r.genNext();
    tx = tx.patch(id, { set: { menu: ref('menu.coffee'), orderRank: r.toString() } });
  }
  tx = tx
    .patch('menu.coffee', {
      set: { labelEl: 'Καφέδες, Ροφήματα & Χυμοί', labelEn: 'Coffee, Beverages & Juices' },
    })
    .delete('menu.juices');

  await tx.commit({ visibility: 'async' });
  console.log(
    '✓ Καφέδες, Ροφήματα, Τσάι, Χυμοί, Milkshake, Smoothies → ένα tab · juices tab διαγράφηκε',
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
