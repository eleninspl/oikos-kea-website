import { createClient } from '@sanity/client';
import type { MenuTab, Section } from '../i18n/menuData';
import { menuTabs as seedMenu } from '../i18n/menuData';

// ─── Sanity client ────────────────────────────────────────────────────────────
// projectId/dataset ΑΠΟΚΛΕΙΣΤΙΚΑ από env — κανένα hardcoded id. Όταν δεν έχει
// οριστεί projectId (π.χ. φρέσκο clone του template πριν συνδεθεί το Sanity), δεν
// φτιάχνουμε client και το getMenu πέφτει στα τοπικά seed δεδομένα (menuData).
const projectId = import.meta.env?.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset =
  import.meta.env?.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';

// Read-only token — ΜΟΝΟ build-time (server-side)· δεν φτάνει ποτέ στον browser.
const token = import.meta.env?.SANITY_READ_TOKEN ?? process.env.SANITY_READ_TOKEN;

export const sanity = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      token,
      useCdn: false, // build-time fetch· φρέσκα δεδομένα σε κάθε rebuild (webhook)
    })
  : null;

// ─── GROQ ─────────────────────────────────────────────────────────────────────
// Φέρνει τις καρτέλες (menu) ΚΑΙ τις κατηγορίες — όλα φτιαγμένα από τον ιδιοκτήτη
// στο Sanity. Φιλτράρει τα κρυφά σε κάθε επίπεδο.
// Προϊόντα = ξεχωριστά menuItem documents που αναφέρονται στην κατηγορία.
const itemFields = `
  nameEl, nameEn, descEl, descEn,
  "image": image.asset->url,
  prices[]{ labelEl, labelEn, amount },
  priceNote, labels, allergens,
  extras[]{ labelEl, labelEn, surcharge },
  available
`;

export const MENU_QUERY = `{
  "menus": *[_type == "menu" && !hidden] | order(orderRank asc){
    "key": key.current, labelEl, labelEn, noteEl, noteEn, "image": image.asset->url
  },
  "categories": *[_type == "category" && !hidden] | order(orderRank asc){
    titleEl, titleEn, noteEl, noteEn,
    "menuKey": coalesce(menu->key.current, menus[0]->key.current),
    "items": *[_type == "menuItem" && references(^._id) && !hidden] | order(orderRank asc){ ${itemFields} }
  }
}`;

type RawCategory = Section & { menuKey: string | null };
type RawMenu = {
  key: string;
  labelEl: string;
  labelEn: string;
  noteEl?: string | null;
  noteEn?: string | null;
  image?: string | null;
};
type RawData = { menus: RawMenu[]; categories: RawCategory[] };

// Local image fallbacks — εφαρμόζονται όταν το Sanity δεν έχει image για το item.
// Key: αρχή του nameEn (case-insensitive prefix match).
const localItemImages: Record<string, string> = {
  kani: '/images/food/kani.jpg',
  kyuri: '/images/food/kyuri.webp',
  'spicy maguro': '/images/food/spicy-maguro.webp',
  hamachi: '/images/food/hamachi-jalapeno.jpg',
  vegetarian: '/images/food/vegetarian.webp',
  chirashi: '/images/food/donburi.webp',
  'chicken rigatoni': '/images/food/rigatoni-chicken.jpg',
};

function applyLocalImage(item: import('../i18n/menuData').Item): import('../i18n/menuData').Item {
  if (item.image) return item;
  const key = (item.nameEn ?? item.nameEl ?? '').toLowerCase();
  for (const [prefix, path] of Object.entries(localItemImages)) {
    if (key.startsWith(prefix)) return { ...item, image: path };
  }
  return item;
}

// ─── pure assembler (testable χωρίς δίκτυο) ───────────────────────────────────
// Ομαδοποιεί τις κατηγορίες κάτω από την καρτέλα τους.
export function assembleMenu(data: RawData): MenuTab[] {
  const { menus, categories } = data;
  return (menus ?? [])
    .map((menu) => ({
      key: menu.key,
      labelEl: menu.labelEl,
      labelEn: menu.labelEn,
      noteEl: menu.noteEl ?? undefined,
      noteEn: menu.noteEn ?? undefined,
      image: menu.image ?? undefined,
      sections: (categories ?? [])
        .filter((c) => c.menuKey === menu.key)
        .map(({ menuKey, ...section }) => {
          const s = section as Section;
          return {
            ...s,
            items: s.items?.map(applyLocalImage),
            subsections: s.subsections?.map((sub) => ({
              ...sub,
              items: sub.items.map(applyLocalImage),
            })),
          };
        })
        // Κρύψε κατηγορίες χωρίς ορατά προϊόντα
        .filter((s) => (s.items?.length ?? 0) > 0 || (s.subsections?.length ?? 0) > 0),
    }))
    .filter((tab) => tab.sections.length > 0);
}

// ─── fetch wrapper ────────────────────────────────────────────────────────────
// Πέφτει στα τοπικά seed δεδομένα αν το Sanity είναι άδειο ή απρόσιτο.
export async function getMenu(): Promise<MenuTab[]> {
  if (!sanity) {
    console.warn('[sanity] PUBLIC_SANITY_PROJECT_ID δεν ορίστηκε — fallback στα seed δεδομένα');
    return seedMenu;
  }
  try {
    const data = await sanity.fetch<RawData>(MENU_QUERY);
    if (data?.menus?.length && data?.categories?.length) {
      // Αν όλες οι καρτέλες φιλτραριστούν (π.χ. menuKey που δεν ταιριάζει),
      // το assembleMenu γυρίζει []· τότε πέφτουμε στα seed αντί για άδειο μενού.
      const assembled = assembleMenu(data);
      if (assembled.length) return assembled;
    }
    console.warn('[sanity] κενό μενού — fallback στα seed δεδομένα');
  } catch (err) {
    console.warn('[sanity] αποτυχία fetch — fallback στα seed δεδομένα:', (err as Error).message);
  }
  return seedMenu;
}
