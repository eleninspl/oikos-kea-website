/** Αναψυκτικά + Ποτά + Παραδοσιακά Ποτά + Μπύρες → μία κατηγορία «Ποτά»,
 *  διατηρώντας τη σειρά (όπως στη φωτό Menurio). */
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
const TARGET = 'cat.soft-drinks.0'; // Αναψυκτικά → γίνεται «Ποτά»
const ORDER = ['cat.soft-drinks.0', 'cat.spirits.0', 'cat.spirits.1', 'cat.spirits.2']; // σειρά φωτό
async function run() {
  const items: any[] = await client.fetch(
    `*[_type=="menuItem" && references($ids)]{_id,"cat":category._ref,orderRank}`,
    { ids: ORDER },
  );
  const idx = (c: string) => ORDER.indexOf(c);
  items.sort(
    (a, b) => idx(a.cat) - idx(b.cat) || String(a.orderRank).localeCompare(String(b.orderRank)),
  );
  const maxItemRank: string = await client.fetch(
    `*[_type=="menuItem"]|order(orderRank desc)[0].orderRank`,
  );
  let r = LexoRank.parse(maxItemRank);
  let tx = client.transaction();
  for (const it of items) {
    r = r.genNext();
    tx = tx.patch(it._id, {
      set: { category: { _type: 'reference', _ref: TARGET }, orderRank: r.toString() },
    });
  }
  tx = tx
    .patch(TARGET, { set: { titleEl: 'Ποτά', titleEn: 'Drinks' } })
    .delete('cat.spirits.0')
    .delete('cat.spirits.1')
    .delete('cat.spirits.2');
  await tx.commit({ visibility: 'async' });
  console.log(`✓ ${items.length} items → μία κατηγορία «Ποτά» · 3 κατηγορίες διαγράφηκαν`);
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
