/** Ξαναχτίζει την καρτέλα «Κρασιά» από τις επίσημες κάρτες:
 *  Λευκά, Ροζέ, Ερυθρά, Αφρώδη, Γλυκά Κρασιά, Food Pairing.
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/rebuild-wines.ts  */
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

const client = createClient({
  projectId: 's7x6np2r',
  dataset: 'production',
  apiVersion: '2022-09-09',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

type It = { el: string; en: string; dEl?: string; dEn?: string; bottle: number; glass?: number };
type Cat = { key: string; el: string; en: string; items: It[] };
// W = κρασί με περιγραφή· glass προαιρετικό
const W = (
  el: string,
  en: string,
  dEl: string,
  dEn: string,
  bottle: number,
  glass?: number,
): It => ({ el, en, dEl, dEn, bottle, glass });

const CATS: Cat[] = [
  {
    key: 'white',
    el: 'Λευκά Κρασιά',
    en: 'White Wine',
    items: [
      W(
        'The Blender',
        'The Blender',
        'Ξηρός, Ασύρτικο – Μαλαγουζιά, Κτήμα Ακριώτου - Αιγιαλεία',
        'Dry, Asirtiko - Malagouzia, Akriotou Microwinery - Aigialia',
        18,
        6,
      ),
      W(
        'Μέγα Σπήλαιο Cuvée',
        'Mega Spileo Cuvée',
        'Ξηρός, Μαλαγουζιά - Ασύρτικο - Chardonnay, Κτήμα Μέγα Σπήλαιο, Καλάβρυτα',
        'Dry, Malagouzia – Asirtiko – Chardonnay, Mega Spileo Estate, Kalavrita',
        24,
      ),
      W(
        'Δύο Ποτάμια',
        'Dio Potamia',
        'Ξηρός, Ασύρτικο – Κοντούρα, Κτήμα Σαμαρτζή - Θήβα',
        'Dry, Asirtiko – Kontoura, Samartzis Estate - Thiva',
        24,
        7,
      ),
      W(
        'Κλεψύδρα',
        'Klepsidra',
        'Ξηρός, 100% Μαλαγουζιά, Κτήμα Σαμαρτζή - Θήβα',
        'Dry, 100% Malagouzia, Samartzis Winery - Thiva',
        26,
      ),
      W(
        'Pinot Grigio DOC Friuli',
        'Pinot Grigio DOC Friuli',
        'Ξηρός, 100% Pinot Grigio, Κτήμα Bidoli - Friuli, Ιταλία',
        'Dry, 100% Pinot Grigio, Bidoli Estate - Friuli, Italy',
        26,
      ),
      W(
        'Crispy Assyrtiko',
        'Crispy Assyrtiko',
        'Ξηρός, 100% Ασύρτικο, Κτήμα Μουσών - Θήβα',
        'Dry, 100% Asirtiko, Muses Estate - Thiva',
        27,
      ),
      W(
        'Ήδυσμα Δρυός',
        'Idisma Drios',
        'Ξηρός, 100% Chardonnay, Κτήμα Τέχνη Οίνου - Δράμα',
        'Dry, 100% Chardonnay, Wine Art Estate - Drama',
        31,
      ),
      W(
        'Ασύρτικο της Γαίας',
        "Gaia's Assyrtiko",
        'Wild Ferment Ξηρός, 100% Ασύρτικο, Κτήμα Γαία - Σαντορίνη',
        'Wild Ferment Dry, 100% Asirtiko, Gaia Estate - Santorini',
        68,
      ),
    ],
  },
  {
    key: 'rose',
    el: 'Ροζέ Κρασιά',
    en: 'Rosé Wine',
    items: [
      W(
        'The Blender',
        'The Blender',
        'Ημίξηρος, Ασύρτικο - Μοσχοφίλερο, Κτήμα Ακριώτου, Αιγιαλεία',
        'Semi dry, Asirtiko - Moschofilero, Akriotou Microwinery, Aigialia',
        18,
        6,
      ),
      W(
        'Αμυγδαλιές',
        'Amigdalies',
        'Ξηρός, 100% Syrah, Κτήμα Αβαντις - Εύβοια',
        'Dry, 100% Syrah, Avantis Estate - Evoia',
        22,
        7,
      ),
      W(
        'Μικρή Κιβωτός',
        'Little Ark',
        'Ξηρός, 100% Μοσχοφίλερο, Κτήμα Λαντίδη - Νεμέα',
        'Dry, 100% Moschofilero, Lantides Estate - Nemea',
        24,
      ),
      W(
        'Ombrè',
        'Ombrè',
        'Ξηρός, 100% Merlot, Κτήμα Οινοτρόπαι - Μεσσηνία',
        'Dry, 100% Merlot, Oinotropai Estate - Messinia',
        25,
      ),
      W(
        '3 Μάγισσες',
        '3 Maggises',
        'Ημίγλυκος, Syrah – Αγιωργίτικο - Μοσχοφίλερο, Κτήμα Μπαραφάκα - Νεμέα',
        'Semi dry, Syrah – Agiorgitiko - Moschofilero, Barafaka Estate - Nemea',
        28,
        7,
      ),
      W(
        'Whispering Angel',
        'Whispering Angel',
        "Ξηρός, Cinsault - Mourvedre-Rolle – Syrah, Chateau d' Esclans - Προβηγκία",
        "Dry, Cinsault - Mourvedre-Rolle – Syrah, Chateau d' Esclans Estate - Provence",
        48,
        10,
      ),
    ],
  },
  {
    key: 'red',
    el: 'Ερυθρά Κρασιά',
    en: 'Red Wine',
    items: [
      W(
        'The Blender',
        'The Blender',
        'Ξηρός, Merlot – Μαύρο Καλαβρυτινό, Κτήμα Ακριώτου, Αιγιαλεία',
        'Dry, Merlot – Mavro Kalavritino, Akriotou Microwinery, Aigialia',
        18,
        6,
      ),
      W(
        'Αγιωργίτικο της Γαίας',
        'Agiorgitiko of Gaia',
        'Ξηρός, 100% Αγιωργίτικο, Κτήμα Γαία - Νεμέα',
        'Dry, 100% Agiorgitiko, Gaia Estate - Nemea',
        24,
        7,
      ),
      W(
        'Μέγα Σπήλαιο',
        'Mega Spileo',
        'Ξηρός, 100% Pinot Noir, Κτήμα Μέγα Σπήλαιο - Καλάβρυτα',
        'Dry, 100% Pinot Noir, Mega Spileo Estate - Kalavrita',
        27,
      ),
      W(
        'M Barrique',
        'M Barrique',
        'Ξηρός, Μούχταρο – Merlot, Κτήμα Σαμαρτζή - Θήβα',
        'Dry, Mouchtaro – Merlot, Samartzis Estate - Thiva',
        30,
      ),
      W(
        'Alta Νάουσα',
        'Alta Naousa',
        'Ξηρός, 100% Ξινόμαυρο, Κτήμα Θυμιόπουλου - Νάουσα',
        'Dry, 100% Xinomavro, Thimiopoulos Winery - Naousa',
        31,
      ),
    ],
  },
  {
    key: 'sparkling',
    el: 'Αφρώδη Κρασιά',
    en: 'Sparkling Wines',
    items: [
      W(
        'Truffle Hunter Λευκό',
        'Truffle Hunter Blanco',
        'Ημίγλυκος, 100% Μοσχάτο, Bosio Winery - Πιεμόντε',
        'Semi sweet, 100% Moschato, Bosio Winery - Piemonte',
        24,
      ),
      W(
        'Infinitum Prosecco',
        'Infinitum Prosecco',
        'Ξηρός, Glera - Chardonnay, Βένετο',
        'Dry, Glera - Chardonnay, Veneto',
        26,
      ),
      W(
        'Ακακίες',
        'Akakies',
        'Ξηρός, 100% Ξινόμαυρο, Κτήμα Κυρ-Γιάννη - Νάουσα',
        'Dry, 100% Xinomavro, Kir-Gianni Estate, Naousa',
        28,
      ),
      W(
        'Amalia Brut',
        'Amalia Brut',
        'Ξηρός, 100% Μοσχοφίλερο, Κτήμα Τσέλεπου - Μαντίνεια',
        'Dry, 100% Moschofilero, Tselepos Estate - Mantineia',
        33,
      ),
      W(
        'Charles Heidsieck Brut Reserve',
        'Charles Heidsieck Brut Reserve',
        'Ξηρός, Chardonnay - Pinot Noir, Charles Heidsieck - Καμπάνια',
        'Dry, Chardonnay - Pinot Noir, Charles Heidsieck - Champagne',
        115,
      ),
    ],
  },
  {
    key: 'dessert',
    el: 'Γλυκά Κρασιά',
    en: 'Dessert Wines',
    items: [
      W(
        'Vin Doux',
        'Vin Doux',
        'Φυσικώς γλυκύς, 100% Μοσχάτο Σάμου, ΕΟΣ Σάμου - Σάμος',
        'Naturally sweet, 100% Moschato of Samos, Samos Wines - Samos',
        24,
        7,
      ),
      W(
        'Vinsanto',
        'Vinsanto',
        'Φυσικώς γλυκύς, Ασύρτικο - Αηδάνι, Κτήμα Santo Wines - Σαντορίνη',
        'Naturally sweet, Asirtiko - Aidani, Santo Wines Estate - Santorini',
        45,
      ),
    ],
  },
  {
    key: 'food-pairing',
    el: 'Food Pairing',
    en: 'Food Pairing',
    items: [{ el: 'Πλατό τυριών αλλαντικών', en: 'Plate of cold cuts', bottle: 22 }],
  },
];

function buildPrices(it: It) {
  if (it.glass != null)
    return [
      {
        _type: 'priceVariant',
        _key: 'glass',
        labelEl: 'Ποτήρι',
        labelEn: 'Glass',
        amount: it.glass,
      },
      {
        _type: 'priceVariant',
        _key: 'bottle',
        labelEl: 'Μπουκάλι',
        labelEn: 'Bottle',
        amount: it.bottle,
      },
    ];
  return [{ _type: 'priceVariant', _key: 'p0', amount: it.bottle }];
}

async function run() {
  const MENU: string = await client.fetch(`*[_type=="menu" && labelEl=="Κρασιά"][0]._id`);
  if (!MENU) throw new Error('Δεν βρέθηκε tab «Κρασιά»');

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
    const catId = `cat.wines.${c.key}`;
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
        _id: `item.wines.${c.key}.i${i}`,
        _type: 'menuItem',
        nameEl: it.el,
        nameEn: it.en,
        category: { _type: 'reference', _ref: catId },
        orderRank: iRank.toString(),
        available: true,
        hidden: false,
        prices: buildPrices(it),
      };
      if (it.dEl) doc.descEl = it.dEl;
      if (it.dEn) doc.descEn = it.dEn;
      tx = tx.createOrReplace(doc);
    });
  }
  await tx.commit({ visibility: 'async' });
  const n = CATS.reduce((a, c) => a + c.items.length, 0);
  console.log(
    `✓ Κρασιά: ${CATS.length} κατηγορίες, ${n} προϊόντα (σβήστηκαν ${oldCats.length}/${oldItems.length})`,
  );
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
