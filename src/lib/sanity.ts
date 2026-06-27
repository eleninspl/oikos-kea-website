import { createClient } from '@sanity/client'
import type { MenuTab, Section } from '../i18n/menuData'
import { menuTabs as seedMenu } from '../i18n/menuData'

// ─── Sanity client ────────────────────────────────────────────────────────────
const projectId =
  import.meta.env?.PUBLIC_SANITY_PROJECT_ID ?? 's7x6np2r'
const dataset =
  import.meta.env?.PUBLIC_SANITY_DATASET ?? 'production'

// Read-only token — ΜΟΝΟ build-time (server-side)· δεν φτάνει ποτέ στον browser.
const token =
  import.meta.env?.SANITY_READ_TOKEN ?? process.env.SANITY_READ_TOKEN

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false, // build-time fetch· φρέσκα δεδομένα σε κάθε rebuild (webhook)
})

// ─── GROQ ─────────────────────────────────────────────────────────────────────
// Φέρνει τις καρτέλες (menu) ΚΑΙ τις κατηγορίες — όλα φτιαγμένα από τον ιδιοκτήτη
// στο Sanity. Φιλτράρει τα κρυφά σε κάθε επίπεδο.
const itemFields = `nameEl, nameEn, descEl, descEn, infoEl, infoEn, price, priceAlt, glass`

export const MENU_QUERY = `{
  "menus": *[_type == "menu" && !hidden] | order(orderRank asc){
    "key": key.current, labelEl, labelEn, "image": image.asset->url
  },
  "categories": *[_type == "category" && !hidden] | order(orderRank asc){
    titleEl, titleEn, "menuKey": coalesce(menu->key.current, menus[0]->key.current),
    "items": items[!hidden]{ ${itemFields} },
    "subsections": subsections[!hidden]{
      titleEl, titleEn, sectionPrice,
      "items": items[!hidden]{ ${itemFields} }
    }
  }
}`

type RawCategory = Section & { menuKey: string | null }
type RawMenu = { key: string; labelEl: string; labelEn: string; image?: string | null }
type RawData = { menus: RawMenu[]; categories: RawCategory[] }

// ─── pure assembler (testable χωρίς δίκτυο) ───────────────────────────────────
// Ομαδοποιεί τις κατηγορίες κάτω από την καρτέλα τους.
export function assembleMenu(data: RawData): MenuTab[] {
  const { menus, categories } = data
  return (menus ?? [])
    .map((menu) => ({
      key: menu.key,
      labelEl: menu.labelEl,
      labelEn: menu.labelEn,
      image: menu.image ?? undefined,
      sections: (categories ?? [])
        .filter((c) => c.menuKey === menu.key)
        .map(({ menuKey, ...section }) => section as Section),
    }))
    .filter((tab) => tab.sections.length > 0)
}

// ─── fetch wrapper ────────────────────────────────────────────────────────────
// Πέφτει στα τοπικά seed δεδομένα αν το Sanity είναι άδειο ή απρόσιτο.
export async function getMenu(): Promise<MenuTab[]> {
  try {
    const data = await sanity.fetch<RawData>(MENU_QUERY)
    if (data?.menus?.length && data?.categories?.length) return assembleMenu(data)
    console.warn('[sanity] κενό μενού — fallback στα seed δεδομένα')
  } catch (err) {
    console.warn('[sanity] αποτυχία fetch — fallback στα seed δεδομένα:', (err as Error).message)
  }
  return seedMenu
}
