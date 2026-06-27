/**
 * Seed `orderRank` (για το @sanity/orderable-document-list drag & drop) σε όλα
 * τα υπάρχοντα menu & category documents, διατηρώντας την τρέχουσα σειρά.
 *
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/seed-order-rank.ts
 *
 * Ασφαλές: γράφει ΜΟΝΟ το πεδίο orderRank (δεν πειράζει το παλιό `order`).
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

async function run() {
  const menus = await client.fetch<{ _id: string }[]>(`*[_type == "menu"] | order(order asc){_id}`);
  // Κατηγορίες ταξινομημένες ανά καρτέλα (order της καρτέλας) και μετά εσωτερική σειρά
  const cats = await client.fetch<{ _id: string }[]>(
    `*[_type == "category"]{_id, order, "mo": menu->order} | order(mo asc, order asc){_id}`,
  );

  let tx = client.transaction();

  let rank = LexoRank.middle();
  for (const m of menus) {
    tx = tx.patch(m._id, { set: { orderRank: rank.toString() } });
    rank = rank.genNext();
  }

  let crank = LexoRank.middle();
  for (const c of cats) {
    tx = tx.patch(c._id, { set: { orderRank: crank.toString() } });
    crank = crank.genNext();
  }

  await tx.commit();
  console.log(`✓ seeded orderRank: ${menus.length} menus, ${cats.length} categories`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
