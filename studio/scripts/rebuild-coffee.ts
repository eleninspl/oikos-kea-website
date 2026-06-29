/** Ξαναχτίζει το «Καφέδες, Ροφήματα & Χυμοί» tab ακριβώς από τις επίσημες κάρτες.
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/rebuild-coffee.ts  */
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
const MENU = 'menu.coffee';

type It = { el: string; en: string; price: number; dEl?: string; dEn?: string };
type Cat = { key: string; el: string; en: string; items: It[] };

const C = (el: string, en: string, price: number, dEl?: string, dEn?: string): It => ({
  el,
  en,
  price,
  dEl,
  dEn,
});

const CATS: Cat[] = [
  {
    key: 'coffee',
    el: 'Καφέδες',
    en: 'Coffee',
    items: [
      C('Espresso', 'Espresso', 3.5),
      C('Espresso Doppio', 'Espresso Doppio', 3.8),
      C('Espresso Freddo', 'Espresso Freddo', 4),
      C('Espresso Freddo Grande', 'Espresso Freddo Grande', 4.5),
      C('Cappuccino', 'Cappuccino', 3.8),
      C('Cappuccino Freddo', 'Cappuccino Freddo', 4),
      C('Cappuccino Freddo Grande', 'Cappuccino Freddo Grande', 4.7),
      C('Americano', 'Americano', 3.8),
      C('Nescafe', 'Nescafe', 3.5),
      C('Nescafe Frape', 'Nescafe Frape', 3.5),
      C('Φίλτρου', 'Filter Coffee', 3.5),
      C('Ελληνικός', 'Greek Coffee', 3),
      C('Ελληνικός Διπλός', 'Double Greek Coffee', 3.5),
    ],
  },
  {
    key: 'beverages',
    el: 'Ροφήματα',
    en: 'Beverages',
    items: [
      C('Σοκολάτα Ζεστή', 'Hot Chocolate', 4.5),
      C('Σοκολάτα Κρύα', 'Cold Chocolate', 4.5),
      C('Λευκή Σοκολάτα Ζεστή', 'White Hot Chocolate', 4.5),
      C('Green Matcha Maiden Latte (Hot / Cold)', 'Green Matcha Maiden Latte (Hot / Cold)', 5),
      C(
        'Golden Latte',
        'Golden Latte',
        4.5,
        'Γάλα Αμυγδάλου, Κιτρινόριζα, Μέλι',
        'Almond milk, Turmeric, Honey',
      ),
    ],
  },
  {
    key: 'iced-tea',
    el: 'Τσάι Κρύο',
    en: 'Iced Tea',
    items: [
      C(
        'YAMAS Πράσινο Τσάι με Εκχύλισμα Μελιού και Λεμόνι',
        'YAMAS Green Tea with Honey and Lemon',
        5,
      ),
      C(
        'YAMAS Πράσινο Τσάι με Εκχύλισμα Μελιού και Μάνγκο',
        'YAMAS Green Tea with Honey and Mango',
        5,
      ),
      C('YAMAS Matcha yuzu με μέλι', 'YAMAS Matcha yuzu with honey', 5),
    ],
  },
  {
    key: 'juices',
    el: 'Φρέσκοι Χυμοί',
    en: 'Fresh Juice',
    items: [
      C('Baby Orange', 'Baby Orange', 4.5, 'Φρέσκος χυμός πορτοκάλι', 'Fresh orange juice'),
      C(
        'Tropical Mint',
        'Tropical Mint',
        5,
        'Τροπικός χυμός από ανανά, mango, μήλο & τη δροσιά της μέντας',
        'Tropical juice from pineapple, mango, apple & the coolness of mint',
      ),
      C(
        'Watermelon Berry',
        'Watermelon Berry',
        6,
        'Χυμός από δροσερό καρπούζι, ακτινίδιο, σταφύλι και φράουλα',
        'Cool juice with watermelon, kiwi, grape and strawberry',
      ),
      C(
        'Asian Mist (Detox)',
        'Asian Mist (Detox)',
        6,
        'Τυφώνας γεύσεων που ενισχύει το ανοσοποιητικό — σέλινο, αγγούρι, μήλο, λεμόνι, τζίντζερ',
        'A hurricane of flavors that strengthens the immune system — celery, cucumber, apple, lemon, ginger',
      ),
      C(
        'Red Planet (Detox)',
        'Red Planet (Detox)',
        6,
        'Αρμονία γεύσεων που ενισχύει το ανοσοποιητικό — καρότο, πορτοκάλι, λεμόνι, μήλο και παντζάρι',
        'A harmony of flavors that strengthens the immune system — carrot, orange, lemon, apple and beetroot',
      ),
    ],
  },
  {
    key: 'milkshake',
    el: 'Milkshake',
    en: 'Milkshake',
    items: [
      C('Βανίλια Μαδαγασκάρης', 'Madagascar Vanilla', 6.5),
      C('Σοκολάτα', 'Chocolate', 6.5),
      C('Φράουλα', 'Strawberry', 6.5),
    ],
  },
  {
    key: 'smoothies',
    el: 'Smoothies',
    en: 'Smoothies',
    items: [
      C(
        'Popeyes Strength',
        'Popeyes Strength',
        6.5,
        'Η δύναμη του Popeye — smoothie με σπανάκι, αγγούρι και ginger',
        'The power of Popeye — smoothie with spinach, cucumber and ginger',
      ),
      C(
        'Sweet Energy',
        'Sweet Energy',
        6.5,
        'Γλυκό smoothie με φράουλα, passion fruit και μέλι',
        'Sweet smoothie with strawberry, passion fruit and honey',
      ),
      C(
        'Yellow',
        'Yellow',
        6.5,
        'Μάνγκο, Μπανάνα, Γάλα Αμυγδάλου, Passion Fruit, Κιτρινόριζα, Καρύδια',
        'Mango, Banana, Almond Milk, Passion Fruit, Turmeric, Walnuts',
      ),
      C(
        'Acai',
        'Acai',
        6.5,
        'Acai, Γάλα Βρώμης, Χουρμάδες, Μπανάνα, Πιπερόριζα, Φυστίκι Αιγίνης',
        'Acai, Oat Milk, Dates, Banana, Ginger, Pistachio',
      ),
    ],
  },
];

async function run() {
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
    const catId = `cat.coffee.${c.key}`;
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
      const doc: any = {
        _id: `item.coffee.${c.key}.i${i}`,
        _type: 'menuItem',
        nameEl: it.el,
        nameEn: it.en,
        category: { _type: 'reference', _ref: catId },
        orderRank: iRank.toString(),
        available: true,
        hidden: false,
        prices: [{ _type: 'priceVariant', _key: 'p0', amount: it.price }],
      };
      if (it.dEl) doc.descEl = it.dEl;
      if (it.dEn) doc.descEn = it.dEn;
      tx = tx.createOrReplace(doc);
    });
  }
  await tx.commit({ visibility: 'async' });
  const n = CATS.reduce((a, c) => a + c.items.length, 0);
  console.log(
    `✓ Καφέδες/Ροφήματα/Χυμοί: ${CATS.length} κατηγορίες, ${n} προϊόντα (σβήστηκαν ${oldCats.length}/${oldItems.length})`,
  );
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
