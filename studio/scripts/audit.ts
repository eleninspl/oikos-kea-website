/**
 * Συνολικός έλεγχος δεδομένων: συγκρίνει τη βάση (Sanity) με το seed (menuData)
 * και ψάχνει ανωμαλίες. Τρέχει read-only.
 *   SANITY_TOKEN=... npx tsx scripts/audit.ts
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { menuTabs } from '../../src/i18n/menuData';
import type { Item } from '../../src/i18n/menuData';
import { PROJECT_ID } from './_env';

const token = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf8')).authToken;

async function query<T>(groq: string): Promise<T> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/production?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  return json.result as T;
}

let issues = 0;
const flag = (msg: string) => {
  issues++;
  console.log(`  ⚠ ${msg}`);
};

// ── flatten seed items (source of truth) ──────────────────────────────────────
function seedItems(): Item[] {
  const out: Item[] = [];
  for (const tab of menuTabs)
    for (const s of tab.sections) {
      for (const it of s.items ?? []) out.push(it);
      for (const sub of s.subsections ?? []) for (const it of sub.items) out.push(it);
    }
  return out;
}

async function main() {
  console.log('── 1. Καταμέτρηση ──');
  const counts = await query<{ menus: number; cats: number }>(
    `{ "menus": count(*[_type=="menu"]), "cats": count(*[_type=="category"]) }`,
  );
  console.log(`  menus: ${counts.menus} (αναμένω 5) ${counts.menus === 5 ? '✓' : '✗'}`);
  console.log(`  categories: ${counts.cats} (αναμένω 25) ${counts.cats === 25 ? '✓' : '✗'}`);
  if (counts.menus !== 5) flag(`λάθος πλήθος καρτελών: ${counts.menus}`);
  if (counts.cats !== 25) flag(`λάθος πλήθος κατηγοριών: ${counts.cats}`);

  // ── all items from Sanity (flattened) ──
  const sanityItems = await query<any[]>(
    `*[_type=="category"]{
       "direct": items[]{nameEl,nameEn,price,priceAlt,glass,descEl,descEn,infoEl,infoEn,hidden},
       "subs": subsections[].items[]{nameEl,nameEn,price,priceAlt,glass,descEl,descEn,infoEl,infoEn,hidden}
     }`,
  );
  const flatSanity: any[] = [];
  for (const c of sanityItems) {
    for (const i of c.direct ?? []) flatSanity.push(i);
    for (const i of c.subs ?? []) flatSanity.push(i);
  }

  console.log('\n── 2. Σύγκριση seed ↔ Sanity ──');
  const seed = seedItems();
  console.log(`  seed items: ${seed.length} | sanity items: ${flatSanity.length}`);
  if (seed.length !== flatSanity.length)
    flag(`διαφορά πλήθους: seed=${seed.length} sanity=${flatSanity.length}`);

  // key by nameEl+price για αντιστοίχιση
  const norm = (s?: string) => (s ?? '').trim();
  const sKey = (i: any) => `${norm(i.nameEl)}|${norm(i.nameEn)}`;
  const seedMap = new Map(seed.map((i) => [sKey(i), i]));
  for (const si of flatSanity) {
    const seedIt = seedMap.get(sKey(si));
    if (!seedIt) {
      flag(`Sanity item χωρίς αντιστοιχία στο seed: "${si.nameEl}"`);
      continue;
    }
    // ανασύνθεση dual-price (price + priceAlt) ώστε να ταιριάζει με το seed
    const combined = norm(si.price) + (si.priceAlt ? ` · ${norm(si.priceAlt)}` : '');
    if (combined !== norm(seedIt.price))
      flag(`τιμή διαφέρει "${si.nameEl}": sanity="${combined}" seed="${seedIt.price}"`);
    if (norm(si.descEl) !== norm(seedIt.descEl)) flag(`περιγραφή ΕΛ διαφέρει "${si.nameEl}"`);
  }

  console.log('\n── 3. Ανωμαλίες δεδομένων ──');
  for (const i of flatSanity) {
    if (!norm(i.nameEl)) flag(`κενό nameEl (price=${i.price})`);
    if (!norm(i.nameEn)) flag(`κενό nameEn ("${i.nameEl}")`);
    if (!norm(i.price)) flag(`κενή τιμή ("${i.nameEl}")`);
    // τιμή χωρίς € (επιτρέπονται dual όπως "Sashimi €7")
    if (norm(i.price) && !i.price.includes('€')) flag(`τιμή χωρίς € → "${i.nameEl}": "${i.price}"`);
    // ύποπτο: η τιμή μοιάζει με αγγλικό όνομα (YAMAS-type bug)
    if (/[A-Za-z]{4,}\s+[A-Za-z]{3,}/.test(norm(i.price)) && !/Sashimi|Nigiri/.test(i.price))
      flag(`ύποπτη τιμή (μοιάζει με όνομα) → "${i.nameEl}": "${i.price}"`);
    // glass μόνο σε κρασιά (έχουν infoEl)
    if (i.glass && !i.infoEl) flag(`glass χωρίς wine info → "${i.nameEl}"`);
  }

  console.log('\n── 4. Καρτέλες ──');
  const menus = await query<any[]>(
    `*[_type=="menu"]|order(order asc){labelEl,"k":key.current,order}`,
  );
  console.log('  ' + menus.map((m) => `${m.order}.${m.labelEl}`).join('  '));
  const keys = menus.map((m) => m.k).join(',');
  if (keys !== 'allday,cocktails,sushi,cuisine,wines') flag(`λάθος σειρά/keys καρτελών: ${keys}`);

  console.log(`\n${issues === 0 ? '✅ ΟΛΑ ΚΑΘΑΡΑ' : `❌ ${issues} ΠΡΟΒΛΗΜΑΤΑ`}\n`);
  process.exit(issues === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
