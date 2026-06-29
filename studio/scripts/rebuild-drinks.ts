/** Ξαναχτίζει το «Ποτά» tab με τις 4 υποκατηγορίες της κάρτας ως υπο-τίτλους:
 *  Αναψυκτικά, Ποτά, Παραδοσιακά Ποτά, Μπύρες.
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/rebuild-drinks.ts  */
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

type It = { el: string; en: string; price: number };
type Cat = { key: string; el: string; en: string; items: It[] };
const I = (el: string, en: string, price: number): It => ({ el, en, price });

const CATS: Cat[] = [
  {
    key: 'soft',
    el: 'Αναψυκτικά',
    en: 'Soft Drinks',
    items: [
      I('Coca Cola', 'Coca Cola', 3.8),
      I('Coca Cola Zero', 'Coca Cola Zero', 3.8),
      I('Sprite', 'Sprite', 3.5),
      I('Σόδα', 'Soda', 3.5),
      I('Τόνικ', 'Tonic', 3.5),
      I('Πορτοκαλάδα Fanta Μπλέ', 'Orangeade Fanta Blue', 3.5),
      I('Πορτοκαλάδα Fanta', 'Orangeade Fanta', 3.5),
      I('Λεμονάδα Fanta', 'Fanta Lemonade', 3.5),
      I('Σπιτική Λεμονάδα Τζίντζερ', 'Homemade Ginger Lemonade', 4.5),
      I('Σπιτική Λεμονάδα Τσίλι', 'Homemade Chili Lemonade', 5.5),
      I('Νερό Αύρα 0,5l', 'Avra Water 0,5l', 0.5),
      I('Νερό Αύρα 1l', 'Avra Water 1l', 1),
      I('Ξινόνερο 0,25l', 'Carbonated Water 0,25l', 3),
      I('Ξινόνερο 1l', 'Carbonated Water 1l', 4),
    ],
  },
  {
    key: 'drinks',
    el: 'Ποτά',
    en: 'Drinks',
    items: [
      I('Ποτό Απλό', 'Simple Drink', 8),
      I('Ποτό Σπέσιαλ', 'Special Drink', 10),
      I('Ποτό Premium', 'Premium Drink', 15),
    ],
  },
  {
    key: 'traditional',
    el: 'Παραδοσιακά Ποτά',
    en: 'Traditional Drinks',
    items: [
      I('Ούζο Καζανιστό 200ml', 'Ouzo Kazanisto 200ml', 12),
      I('Τσίπουρο Ηδωνικό 200ml', 'Tsipouro Idoniko 200ml', 12),
    ],
  },
  {
    key: 'beers',
    el: 'Μπύρες',
    en: 'Beers',
    items: [
      I('Stella Artois Draft 400ml', 'Stella Artois Draft 400ml', 5),
      I('Νύμφη 330ml', 'Nymfi 330ml', 5.5),
      I('Noam 340ml', 'Noam 340ml', 7),
      I('Corona', 'Corona', 6),
      I('Stella 0% alc.', 'Stella 0% alc.', 5),
    ],
  },
];

async function run() {
  const MENU: string = await client.fetch(`*[_type=="menu" && labelEl=="Ποτά"][0]._id`);
  if (!MENU) throw new Error('Δεν βρέθηκε tab «Ποτά»');

  const oldCats: string[] = await client.fetch(`*[_type=="category" && menu._ref==$m]._id`, {
    m: MENU,
  });
  const oldItems: string[] = await client.fetch(
    `*[_type=="menuItem" && references(*[_type=="category" && menu._ref==$m]._id)]._id`,
    { m: MENU },
  );
  let cRank = LexoRank.parse(
    await client.fetch(`*[_type=="category"]|order(orderRank desc)[0].orderRank`),
  );
  let iRank = LexoRank.parse(
    await client.fetch(`*[_type=="menuItem"]|order(orderRank desc)[0].orderRank`),
  );

  let tx = client.transaction();
  for (const id of oldItems) tx = tx.delete(id);
  for (const id of oldCats) tx = tx.delete(id);

  for (const c of CATS) {
    cRank = cRank.genNext();
    const catId = `cat.drinks.${c.key}`;
    tx = tx.createOrReplace({
      _id: catId,
      _type: 'category',
      titleEl: c.el,
      titleEn: c.en,
      menu: { _type: 'reference', _ref: MENU },
      orderRank: cRank.toString(),
      hidden: false,
    });
    c.items.forEach((it, i) => {
      iRank = iRank.genNext();
      tx = tx.createOrReplace({
        _id: `item.drinks.${c.key}.i${i}`,
        _type: 'menuItem',
        nameEl: it.el,
        nameEn: it.en,
        category: { _type: 'reference', _ref: catId },
        orderRank: iRank.toString(),
        available: true,
        hidden: false,
        prices: [{ _type: 'priceVariant', _key: 'p0', amount: it.price }],
      });
    });
  }
  await tx.commit({ visibility: 'async' });
  const n = CATS.reduce((a, c) => a + c.items.length, 0);
  console.log(
    `✓ Ποτά: ${CATS.length} υποκατηγορίες, ${n} προϊόντα (σβήστηκαν ${oldCats.length}/${oldItems.length})`,
  );
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
