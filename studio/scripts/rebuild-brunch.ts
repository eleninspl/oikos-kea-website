/**
 * Ξαναχτίζει το Brunch tab ΑΚΡΙΒΩΣ όπως η επίσημη έντυπη κάρτα: 5 κατηγορίες
 * (Αυγά, Υγιεινό Πρωινό, Σνακς, Γλυκές Αλχημείες, Πίτσα & Μπέργκερ) + note tab.
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/rebuild-brunch.ts
 */
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

const client = createClient({
  projectId: 's7x6np2r',
  dataset: 'production',
  apiVersion: '2022-09-09',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

type I = {
  el: string;
  en: string;
  price: number;
  dEl: string;
  dEn: string;
  extra?: { el: string; en: string; s: number };
};
type C = { key: string; el: string; en: string; items: I[] };

const CATS: C[] = [
  {
    key: 'eggs',
    el: 'Αυγά',
    en: 'Eggs',
    items: [
      {
        el: 'Ομελέτα ελληνική',
        en: 'Greek Omelette',
        price: 10,
        dEl: 'Χοιρινό μπούτι, Φέτα, Πιπεριές, Ελιές, Ντοματίνια, Πράσινη σαλάτα, Ψωμί',
        dEn: 'Pork leg, Feta cheese, Peppers, Olives, Cherry tomatoes, Green salad, Bread',
      },
      {
        el: 'Αυγά Benedict',
        en: 'Benedict eggs',
        price: 13,
        dEl: 'Muffin ψωμί, Αυγά ποσέ, Πάπρικα, Μορταδέλα με φυστίκι, Σάλτσα «Ολανδέζ»',
        dEn: 'Muffin bread, Poached eggs, Paprika, Mortadella with pistachio, Hollandaise sauce',
        extra: { el: 'Καπνιστός σολομός', en: 'Smoked salmon', s: 2 },
      },
      {
        el: 'Καγιανάς',
        en: 'Kagianas',
        price: 10.5,
        dEl: 'Αυγά ποσέ, Σάλτσα ντομάτας, Προζυμένιο ψωμί, Κρέμα Φέτας',
        dEn: 'Poached eggs, Tomato sauce, Sourdough bread, Feta cheese cream',
      },
      {
        el: 'Αβοκάντο Τοστ',
        en: 'Avocado Toast',
        price: 11.5,
        dEl: 'Αυγό μάτι, Γουακαμόλε, Ζαμπόν Cotto, Κατσικίσιο τυρί',
        dEn: 'Fried egg, Guacamole sauce, Ham Cotto, Goat cheese',
      },
      {
        el: 'Crouque Madame',
        en: 'Crouque Madame',
        price: 11.5,
        dEl: 'Αφράτο ψωμί, Τυρί, Ντομάτα, Iceberg, Χοιρινή Ωμοπλάτη, Μπεσαμέλ, Αυγό μάτι',
        dEn: 'Soft bread, Cheese, Tomato, Iceberg, Pork shoulder, Bechamel sauce, Fried egg',
      },
    ],
  },
  {
    key: 'healthy',
    el: 'Υγιεινό Πρωινό',
    en: 'Healthy Breakfast',
    items: [
      {
        el: 'Ομελέτα fitness',
        en: 'Fitness Omelette',
        price: 11,
        dEl: 'Ασπράδια αυγών, Ψητό μπρόκολο, Ψητά σπαράγγια, Τυρί Cottage, Ντρέσινγκ λεμόνι',
        dEn: 'Egg whites, Grilled broccoli, Grilled asparagus, Cottage cheese, Lemon dressing',
      },
      {
        el: 'Φαλάφελ',
        en: 'Falafel',
        price: 11.5,
        dEl: 'Προζυμένιο ψωμί, Κρέμα ψητής κόκκινης πιπεριάς, Κρέμα παντζαριού, Φουντούκι',
        dEn: 'Sourdough bread, Cream of grilled red pepper, Beetroot cream, Hazelnut',
      },
      {
        el: 'Γιαούρτι',
        en: 'Yoghurt bowl',
        price: 9,
        dEl: 'Μπανάνα, Φράουλα, Γκρανόλα, Φυστικοβούτυρο, Μέλι της περιοχής',
        dEn: 'Banana, Strawberry, Granola, Peanut butter, Local honey',
      },
      {
        el: 'Acai bowl',
        en: 'Acai bowl',
        price: 9,
        dEl: 'Μαρμελάδα με μύρτιλο, Γκρανόλα, Μύρτιλα',
        dEn: 'Blueberries marmalade, Granola, Blueberries',
      },
    ],
  },
  {
    key: 'snacks',
    el: 'Σνακς',
    en: 'Snacks',
    items: [
      {
        el: 'Κλαμπ σάντουιτς',
        en: 'Club Sandwich',
        price: 12,
        dEl: 'Μπέικον, Ζαμπόν, Τυρί Γκούντα, Iceberg, Κοτοσαλάτα, Ντομάτα, Πατάτες τηγανιτές',
        dEn: 'Bacon, Ham, Gouda cheese, Iceberg, Chicken salad, Tomato, French fries',
      },
    ],
  },
  {
    key: 'sweets',
    el: 'Γλυκές Αλχημείες',
    en: 'Sweet Alchemies',
    items: [
      {
        el: 'Pancake Σφενδάμου',
        en: 'Maple Pancake',
        price: 9,
        dEl: 'Σιρόπι σφενδάμου, Μύρτιλα, Φράουλες, Lime, Πεκάν',
        dEn: 'Maple syrup, Blueberries, Strawberries, Lime, Pecan',
      },
      {
        el: 'Nutella Pancake',
        en: 'Nutella Pancake',
        price: 8.5,
        dEl: 'Πραλίνα φουντουκιού, Μπανάνα, Μπισκότο, Φουντούκι',
        dEn: 'Hazelnut praline, Banana, Biscuit, Hazelnut',
      },
      {
        el: 'French Toast',
        en: 'French Toast',
        price: 9,
        dEl: 'Ψωμί σάντο, Κρέμα cheesecake, Σπιτική μαρμελάδα φράουλα',
        dEn: 'Sando bread, Cheesecake cream, Homemade strawberry marmalade',
      },
    ],
  },
  {
    key: 'pizza-burgers',
    el: 'Πίτσα & Μπέργκερ',
    en: 'Pizza & Burgers',
    items: [
      {
        el: 'Μαργαρίτα',
        en: 'Margherita',
        price: 11,
        dEl: 'Σάλτσα ντομάτας, Μοτσαρέλα, Βασιλικός',
        dEn: 'Tomato sauce, Mozzarella, Basil',
        extra: { el: 'Μοτσαρέλα fior di latte', en: 'Mozzarella fior di latte', s: 2 },
      },
      {
        el: 'Picante',
        en: 'Picante',
        price: 13.5,
        dEl: 'Σάλτσα ντομάτας, Τσορίθο, Προβολόνε, Τσίλι, Βασιλικός, Μοτσαρέλα, Λεμόνι',
        dEn: 'Tomato sauce, Chorizo, Provolone, Chili pepper, Basil, Mozzarella, Lemon',
      },
      {
        el: 'Τρούφα',
        en: 'Tartufatta',
        price: 16,
        dEl: 'Κρέμα μανιταριών, Μοτσαρέλα Fior di latte, Μανιτάρια εποχής, Τρούφα',
        dEn: 'Mushroom cream, Mozzarella Fior di latte, Seasonal mushrooms, Truffle',
      },
      {
        el: 'Burger Oikos',
        en: 'Burger Oikos',
        price: 14,
        dEl: 'Μοσχαρίσιος κιμάς, Ψωμάκι μπριός, Μαγιονέζα τρούφα, Iceberg, Τσένταρ',
        dEn: 'Beef minced meat, Brioche bread, Truffle mayo, Iceberg, Cheddar',
      },
    ],
  },
];

async function run() {
  // Σβήσε τα τρέχοντα brunch categories + items
  const oldCats: string[] = await client.fetch(
    `*[_type=="category" && menu._ref=="menu.brunch"]._id`,
  );
  const oldItems: string[] = await client.fetch(
    `*[_type=="menuItem" && references(*[_type=="category" && menu._ref=="menu.brunch"]._id)]._id`,
  );

  const maxCatRank: string = await client.fetch(
    `*[_type=="category"]|order(orderRank desc)[0].orderRank`,
  );
  const maxItemRank: string = await client.fetch(
    `*[_type=="menuItem"]|order(orderRank desc)[0].orderRank`,
  );

  let tx = client.transaction();
  for (const id of oldItems) tx = tx.delete(id);
  for (const id of oldCats) tx = tx.delete(id);

  // Note στο tab
  tx = tx.patch('menu.brunch', {
    set: { noteEl: 'Σερβίρεται 08.30 – 15.00', noteEn: 'Served from 08.30 to 15.00' },
  });

  let cRank = LexoRank.parse(maxCatRank);
  let iRank = LexoRank.parse(maxItemRank);
  for (const c of CATS) {
    cRank = cRank.genNext();
    const catId = `cat.brunch.${c.key}`;
    tx = tx.createOrReplace({
      _id: catId,
      _type: 'category',
      titleEl: c.el,
      titleEn: c.en,
      menu: { _type: 'reference', _ref: 'menu.brunch' },
      orderRank: cRank.toString(),
      hidden: false,
    });
    c.items.forEach((it, idx) => {
      iRank = iRank.genNext();
      const doc: any = {
        _id: `item.brunch.${c.key}.i${idx}`,
        _type: 'menuItem',
        nameEl: it.el,
        nameEn: it.en,
        descEl: it.dEl,
        descEn: it.dEn,
        category: { _type: 'reference', _ref: catId },
        orderRank: iRank.toString(),
        available: true,
        hidden: false,
        prices: [{ _type: 'priceVariant', _key: 'p0', amount: it.price }],
      };
      if (it.extra)
        doc.extras = [
          {
            _type: 'extra',
            _key: 'x0',
            labelEl: it.extra.el,
            labelEn: it.extra.en,
            surcharge: it.extra.s,
          },
        ];
      tx = tx.createOrReplace(doc);
    });
  }

  await tx.commit({ visibility: 'async' });
  const n = CATS.reduce((a, c) => a + c.items.length, 0);
  console.log(
    `✓ Brunch ξαναχτίστηκε: ${CATS.length} κατηγορίες, ${n} προϊόντα, note προστέθηκε (σβήστηκαν ${oldCats.length} cats / ${oldItems.length} items)`,
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
