/** Ξαναχτίζει την καρτέλα «Cocktails» από τις επίσημες κάρτες:
 *  Signature, No Alcohol, Spritz, Gin & Tonic, Classic. (Αγγλικά ονόματα/περιγραφές.)
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/rebuild-cocktails.ts  */
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

const client = createClient({
  projectId: 's7x6np2r',
  dataset: 'production',
  apiVersion: '2022-09-09',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

type It = { name: string; price: number; desc: string };
type Cat = { key: string; title: string; items: It[] };
const X = (name: string, price: number, desc: string): It => ({ name, price, desc });

const CATS: Cat[] = [
  {
    key: 'signature',
    title: 'Signature',
    items: [
      X(
        'Strawberry Sour',
        13,
        'Bond gin, strawberry, balsamic fig, vegan foam, Vermouth di Torino',
      ),
      X('Pink Mellon', 12, 'Hendricks Flora Adora, melon, cucumber, pimente paper'),
      X('The Magic Mango', 12, 'Pampero blend, barley cordial, foam mango'),
      X('Apple Walker 3.0', 12, 'Serkova Vodka, cordial green apple, blend peppers, ginger'),
      X(
        'Mastic Passion',
        14,
        'Bond gin, green tea, passion, caramelized milk, foam mastic and ginger',
      ),
      X('Maniana Colada', 13, 'Pampero blend, banana, caramel, coconut, lime'),
    ],
  },
  {
    key: 'no-alcohol',
    title: 'No Alcohol',
    items: [
      X('0% Garibaldi', 10, '0% bitter, orange oleo, fake foam'),
      X('0% Paloma', 10, '0% Gin, lime, agave, grapefruit soda'),
    ],
  },
  {
    key: 'spritz',
    title: 'Spritz',
    items: [
      X(
        'Summer Skin',
        10,
        'Mastic tears, Aperol, peach, Fever Tree Pink Grapefruit Soda, Gancia Prosecco',
      ),
      X('Aegean Spritz', 10, 'Ottos, amaro, mandarin, lime, orange bitter soda'),
      X('Kea Cobbler', 10, 'Aperol, pineapple, Fever Tree Indian tonic, elderflower syrup'),
    ],
  },
  {
    key: 'gin-tonic',
    title: 'Gin & Tonic',
    items: [
      X('Gin & Tonic 1', 13, 'Silent pool, Fever Tree Indian tonic, ginger slice pickle'),
      X('Gin & Tonic 2', 13, 'Grace, Fever Tree Mediteranian tonic, peach pickle'),
      X('Gin & Tonic 3', 13, 'Another Hendricks, Fever Tree tonic, olive pickle'),
    ],
  },
  {
    key: 'classic',
    title: 'Classic',
    items: [
      X('Dry Martini', 14, 'Blend gin, blend white vermouth, pickle tomato'),
      X('Negroni', 13, 'Blend gin, blend red vermouth, campari'),
      X('Bloody Mary', 12, 'Serkova Vodka, tomato, celery, peppers'),
      X('Espresso Martini', 13, 'Belvedere dirty brew coffee, house coffee liqueur'),
    ],
  },
];

async function run() {
  const MENU: string = await client.fetch(`*[_type=="menu" && labelEl=="Cocktails"][0]._id`);
  if (!MENU) throw new Error('Δεν βρέθηκε tab «Cocktails»');

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
    const catId = `cat.cocktails.${c.key}`;
    tx = tx.createOrReplace({
      _id: catId,
      _type: 'category',
      titleEl: c.title,
      titleEn: c.title,
      menu: { _type: 'reference', _ref: MENU },
      orderRank: cRank.toString(),
      hidden: false,
    });
    c.items.forEach((it, i) => {
      iRank = iRank.genNext();
      tx = tx.createOrReplace({
        _id: `item.cocktails.${c.key}.i${i}`,
        _type: 'menuItem',
        nameEl: it.name,
        nameEn: it.name,
        descEl: it.desc,
        descEn: it.desc,
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
    `✓ Cocktails: ${CATS.length} κατηγορίες, ${n} προϊόντα (σβήστηκαν ${oldCats.length}/${oldItems.length})`,
  );
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
