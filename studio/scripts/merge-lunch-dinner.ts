/**
 * Συγχώνευση: Ορεκτικά, Σαλάτες, Κυρίως, Φρέσκα Ζυμαρικά, Γλυκά → ένα tab
 * «Lunch / Dinner». Το vegan προϊόν μπαίνει στα Ζυμαρικά· τα παλιά tabs +
 * η κατηγορία Vegan διαγράφονται.  SANITY_WRITE_TOKEN=... npx tsx scripts/merge-lunch-dinner.ts
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

const PASTA_CAT = 'cat.pasta.0';
// Σειρά κατηγοριών στο νέο tab
const CAT_ORDER = [
  'cat.appetizers.0',
  'cat.appetizers.1',
  'cat.mains.0',
  PASTA_CAT,
  'cat.desserts.0',
];
const OLD_MENUS = ['menu.pasta', 'menu.appetizers', 'menu.mains', 'menu.vegan', 'menu.desserts'];
const VEGAN_CAT = 'cat.vegan.vegan-menu';

async function run() {
  const maxCatRank: string = await client.fetch(
    `*[_type=="category"]|order(orderRank desc)[0].orderRank`,
  );
  const maxItemRank: string = await client.fetch(
    `*[_type=="menuItem"]|order(orderRank desc)[0].orderRank`,
  );
  const veganItems: string[] = await client.fetch(
    `*[_type=="menuItem" && references("${VEGAN_CAT}")]._id`,
  );

  // Νέο tab ανάμεσα στο sushi και στο bar-bites
  const menuRank = LexoRank.parse('0|i00013:').between(LexoRank.parse('0|i0001r:')).toString();

  let tx = client.transaction();
  tx = tx.createIfNotExists({
    _id: 'menu.lunch-dinner',
    _type: 'menu',
    labelEl: 'Lunch / Dinner',
    labelEn: 'Lunch / Dinner',
    key: { _type: 'slug', current: 'lunch-dinner' },
    orderRank: menuRank,
    hidden: false,
  });

  // Μετακίνηση κατηγοριών στο νέο tab με σειρά
  let catRank = LexoRank.parse(maxCatRank).genNext();
  for (const id of CAT_ORDER) {
    tx = tx.patch(id, {
      set: {
        menu: { _type: 'reference', _ref: 'menu.lunch-dinner' },
        orderRank: catRank.toString(),
      },
    });
    catRank = catRank.genNext();
  }

  // Vegan προϊόν → κατηγορία Ζυμαρικά (στο τέλος)
  let itemRank = LexoRank.parse(maxItemRank).genNext();
  for (const id of veganItems) {
    tx = tx.patch(id, {
      set: { category: { _type: 'reference', _ref: PASTA_CAT }, orderRank: itemRank.toString() },
    });
    itemRank = itemRank.genNext();
  }

  // Διαγραφή άδειας κατηγορίας Vegan + παλιών tabs
  tx = tx.delete(VEGAN_CAT);
  for (const id of OLD_MENUS) tx = tx.delete(id);

  await tx.commit({ visibility: 'async' });
  console.log(
    `✓ Lunch / Dinner: ${CAT_ORDER.length} κατηγορίες, ${veganItems.length} vegan→ζυμαρικά, διαγράφηκαν ${OLD_MENUS.length} tabs + 1 κατηγορία`,
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
