/**
 * Πλήρης εισαγωγή του μενού από το Menurio (app.menurio.com/oikos-kea) στο Sanity.
 * Κάθε κατάλογος Menurio = καρτέλα (menu). Οι υποκατηγορίες = κατηγορίες. Τα
 * αγγλικά παράγονται με auto-μετάφραση (MyMemory) από τα ελληνικά, γιατί το EN
 * του Menurio έχει λάθη. ΑΝΤΙΚΑΘΙΣΤΑ όλα τα τρέχοντα menu/category documents.
 *
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/import-menurio.ts
 */
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';
import { PROJECT_ID, DATASET } from './_env';

const MENURIO = 'https://app.menurio.com/api';
const COMPANY = 122;
const HEADERS = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2022-09-09',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Καθαρές καρτέλες (id Menurio → key/labels). Σειρά = σειρά εμφάνισης.
const TABS: { id: number; key: string; el: string; en: string }[] = [
  { id: 1131, key: 'coffee', el: 'Καφέδες', en: 'Coffee' },
  { id: 1132, key: 'soft-drinks', el: 'Αναψυκτικά', en: 'Soft Drinks' },
  { id: 1142, key: 'hot-drinks', el: 'Ροφήματα & Τσάι', en: 'Hot Drinks & Tea' },
  { id: 1143, key: 'juices', el: 'Χυμοί & Smoothies', en: 'Juices & Smoothies' },
  { id: 1146, key: 'brunch', el: 'Brunch', en: 'Brunch' },
  { id: 11788, key: 'sushi', el: 'Sushi', en: 'Sushi' },
  { id: 1147, key: 'pasta', el: 'Φρέσκα Ζυμαρικά', en: 'Fresh Pasta' },
  { id: 1149, key: 'appetizers', el: 'Ορεκτικά & Σαλάτες', en: 'Appetizers & Salads' },
  { id: 1150, key: 'bar-bites', el: 'Συνοδευτικά Ποτού', en: 'Bar Bites' },
  { id: 1151, key: 'mains', el: 'Κυρίως Πιάτα', en: 'Main Dishes' },
  { id: 6329, key: 'vegan', el: 'Vegan', en: 'Vegan' },
  { id: 1152, key: 'desserts', el: 'Γλυκά & Επιδόρπια', en: 'Desserts' },
  { id: 1153, key: 'cocktails', el: 'Cocktails', en: 'Cocktails' },
  { id: 1154, key: 'spirits', el: 'Αλκοολούχα', en: 'Spirits & Beers' },
  { id: 1155, key: 'wines', el: 'Κρασιά', en: 'Wines' },
];

const stripHtml = (s: any) =>
  String(s ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(
      /&[a-z]+;/g,
      (m) => ({ '&amp;': '&', '&quot;': '"', '&gt;': '>', '&lt;': '<', '&nbsp;': ' ' })[m] ?? ' ',
    )
    .replace(/\s+/g, ' ')
    .trim();

function fmtPrice(p: any): string | null {
  if (p == null || p === '') return null;
  const n = parseFloat(String(p).replace(',', '.'));
  if (isNaN(n)) return null;
  const eur = Math.trunc(n);
  const cents = Math.round((n - eur) * 100);
  return cents === 0 ? `€${eur}` : `€${eur},${String(cents).padStart(2, '0')}`;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ── auto-translate (MyMemory, δωρεάν, με cache + throttle) ─────────────────────
const tcache = new Map<string, string>();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function translate(text: string): Promise<string> {
  const q = text.trim();
  if (!q) return '';
  if (tcache.has(q)) return tcache.get(q)!;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=el|en&de=info@softbiz.eu`;
    const res = await fetch(url);
    const json: any = await res.json();
    const t = json?.responseData?.translatedText;
    const out = t && Number(json?.responseStatus) === 200 ? stripHtml(t) : q;
    tcache.set(q, out);
    await sleep(180);
    return out;
  } catch {
    return q;
  }
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: HEADERS });
  return res.json();
}

async function main() {
  // 1) Κατέβασμα δομής από Menurio
  type RawItem = { name: string; price: any; description: any; additional_prices?: any[] };
  type Cat = { titleEl: string; items: RawItem[] };
  type Tab = { key: string; el: string; en: string; cats: Cat[] };

  const tabs: Tab[] = [];
  for (const t of TABS) {
    const nodes: any[] = await fetchJson(`${MENURIO}/el/frontcatalogcategories/${t.id}`);
    const cats: Cat[] = (nodes || [])
      .filter((c) => c.itemtype === 1 && c.active)
      .map((c) => ({
        titleEl: stripHtml(c.name),
        items: (c.catalogitems || [])
          .filter((it: any) => it.active)
          .map((it: any) => ({
            name: stripHtml(it.name),
            price: it.price,
            description: stripHtml(it.description),
            additional_prices: it.additional_prices,
          })),
      }));
    tabs.push({ key: t.key, el: t.el, en: t.en, cats });
    console.log(
      `  ↓ ${t.el}: ${cats.length} κατηγορίες, ${cats.reduce((a, c) => a + c.items.length, 0)} προϊόντα`,
    );
  }

  // 2) Συλλογή όλων των μοναδικών strings για μετάφραση
  const strings = new Set<string>();
  for (const t of tabs)
    for (const c of t.cats) {
      if (c.titleEl) strings.add(c.titleEl);
      for (const it of c.items) {
        if (it.name) strings.add(it.name);
        if (it.description) strings.add(it.description);
      }
    }
  console.log(`\nΜετάφραση ${strings.size} μοναδικών κειμένων…`);
  let done = 0;
  for (const s of strings) {
    await translate(s);
    if (++done % 25 === 0) console.log(`  ${done}/${strings.size}`);
  }

  // 3) Δόμηση Sanity documents (+ orderRank)
  const docs: any[] = [];
  let menuRank = LexoRank.middle();
  let catRank = LexoRank.middle();

  for (const t of tabs) {
    docs.push({
      _id: `menu.${t.key}`,
      _type: 'menu',
      labelEl: t.el,
      labelEn: t.en,
      key: { _type: 'slug', current: t.key },
      orderRank: menuRank.toString(),
      hidden: false,
    });
    menuRank = menuRank.genNext();

    t.cats.forEach((c, ci) => {
      const items = c.items.map((it, ii) => {
        const glassAp = (it.additional_prices || []).find((a) =>
          /ποτήρι/i.test(stripHtml(a?.description)),
        );
        return {
          _type: 'menuItem',
          _key: `m-${t.key}-${ci}-${ii}`,
          nameEl: it.name,
          nameEn: tcache.get(it.name) || it.name,
          ...(fmtPrice(it.price) ? { price: fmtPrice(it.price) } : { price: '—' }),
          ...(glassAp ? { glass: fmtPrice(glassAp.price) ?? undefined } : {}),
          ...(it.description
            ? { descEl: it.description, descEn: tcache.get(it.description) || it.description }
            : {}),
          hidden: false,
        };
      });
      docs.push({
        _id: `cat.${t.key}.${slugify(c.titleEl) || ci}`,
        _type: 'category',
        titleEl: c.titleEl,
        titleEn: tcache.get(c.titleEl) || c.titleEl,
        menu: { _type: 'reference', _ref: `menu.${t.key}` },
        orderRank: catRank.toString(),
        hidden: false,
        items,
      });
      catRank = catRank.genNext();
    });
  }

  // 4) Αντικατάσταση: σβήσε τα παλιά menu+category, φτιάξε τα νέα — ΟΛΑ σε μία transaction
  const oldIds: string[] = await client.fetch(`*[_type in ["menu","category"]]._id`);
  let tx = client.transaction();
  for (const id of oldIds) tx = tx.delete(id);
  for (const d of docs) tx = tx.createOrReplace(d);
  await tx.commit({ visibility: 'async' });

  const menus = docs.filter((d) => d._type === 'menu').length;
  const cats = docs.filter((d) => d._type === 'category').length;
  const items = docs.filter((d) => d._type === 'category').reduce((a, d) => a + d.items.length, 0);
  console.log(
    `\n✓ Εισαγωγή ολοκληρώθηκε: διαγράφηκαν ${oldIds.length} παλιά docs · δημιουργήθηκαν ${menus} καρτέλες, ${cats} κατηγορίες, ${items} προϊόντα`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
