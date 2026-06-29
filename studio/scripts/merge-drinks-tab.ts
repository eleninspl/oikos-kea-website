/** Αλκοολούχα + Αναψυκτικά → ένα tab «Ποτά» (Αναψυκτικά πρώτα). */
import { createClient } from '@sanity/client';
import { PROJECT_ID, DATASET } from './_env';
const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2022-09-09',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});
async function run() {
  await client
    .transaction()
    .patch('cat.soft-drinks.0', { set: { menu: { _type: 'reference', _ref: 'menu.spirits' } } })
    .patch('menu.spirits', { set: { labelEl: 'Ποτά', labelEn: 'Drinks' } })
    .delete('menu.soft-drinks')
    .commit({ visibility: 'async' });
  console.log('✓ Ποτά: Αναψυκτικά + Αλκοολούχα ενώθηκαν · soft-drinks tab διαγράφηκε');
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
