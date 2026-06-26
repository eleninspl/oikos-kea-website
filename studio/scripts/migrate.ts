/**
 * Migration: src/i18n/menuData.ts  →  Sanity NDJSON (flat category documents)
 *
 *   npx tsx scripts/migrate.ts > menu.ndjson
 *   npx sanity dataset import menu.ndjson production --replace
 *
 * Νέο μοντέλο: κάθε ΚΑΤΗΓΟΡΙΑ = ξεχωριστό document με πεδίο `tabs` (σε ποια menu
 * εμφανίζεται). Οι κατηγορίες κρασιών παίρνουν tabs:['allday','cuisine'] ώστε να
 * εμφανίζονται και στα δύο — χωρίς ξεχωριστό wineList document.
 */
import { menuTabs } from '../../src/i18n/menuData'
import type { Item, Subsection, Section } from '../../src/i18n/menuData'

let counter = 0
const key = () => `k${(counter++).toString(36)}`

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'cat'

// ── special-case parsers ─────────────────────────────────────────────────────
function splitDualPrice(price: string): { price: string; priceAlt?: string } {
  if (price.includes(' · ')) {
    const [a, b] = price.split(' · ')
    return { price: a.trim(), priceAlt: b.trim() }
  }
  return { price }
}
function splitTitlePrice(title?: string): { title?: string; sectionPrice?: string } {
  if (!title) return { title }
  const m = title.match(/^(.*?)\s*—\s*(€.*)$/)
  if (m) return { title: m[1].trim(), sectionPrice: m[2].trim() }
  return { title }
}

// ── transformers ─────────────────────────────────────────────────────────────
function toItem(item: Item) {
  const { price, priceAlt } = splitDualPrice(item.price)
  return {
    _key: key(),
    _type: 'menuItem',
    nameEl: item.nameEl,
    nameEn: item.nameEn,
    ...(item.descEl ? { descEl: item.descEl } : {}),
    ...(item.descEn ? { descEn: item.descEn } : {}),
    ...(item.infoEl ? { infoEl: item.infoEl } : {}),
    ...(item.infoEn ? { infoEn: item.infoEn } : {}),
    price,
    ...(priceAlt ? { priceAlt } : {}),
    ...(item.glass ? { glass: item.glass } : {}),
    hidden: false,
  }
}
function toSubsection(sub: Subsection) {
  const el = splitTitlePrice(sub.titleEl)
  const en = splitTitlePrice(sub.titleEn)
  const sectionPrice = el.sectionPrice ?? en.sectionPrice
  return {
    _key: key(),
    _type: 'subsection',
    ...(el.title ? { titleEl: el.title } : {}),
    ...(en.title ? { titleEn: en.title } : {}),
    ...(sectionPrice ? { sectionPrice } : {}),
    hidden: false,
    items: sub.items.map(toItem),
  }
}
const menuRef = (key: string) => ({ _type: 'reference', _ref: `menu.${key}`, _key: key })

function toCategory(section: Section, menuKeys: string[], order: number, idPrefix: string) {
  return {
    _id: `${idPrefix}.${slugify(section.titleEn)}`,
    _type: 'category',
    titleEl: section.titleEl,
    titleEn: section.titleEn,
    menus: menuKeys.map(menuRef),
    order,
    hidden: false,
    ...(section.subsections
      ? { subsections: section.subsections.map(toSubsection) }
      : { items: (section.items ?? []).map(toItem) }),
  }
}

// ── build documents ──────────────────────────────────────────────────────────
const docs: any[] = []

// 0) menu (καρτέλες) documents
menuTabs.forEach((tab, i) => {
  docs.push({
    _id: `menu.${tab.key}`,
    _type: 'menu',
    labelEl: tab.labelEl,
    labelEn: tab.labelEn,
    key: { _type: 'slug', current: tab.key },
    order: i + 1,
    hidden: false,
  })
})

// 1) κατηγορίες: μία ανά section, menus = [η καρτέλα της]
menuTabs.forEach((tab) => {
  tab.sections.forEach((section, i) => {
    docs.push(toCategory(section, [tab.key], i, `cat.${tab.key}`))
  })
})

for (const doc of docs) process.stdout.write(JSON.stringify(doc) + '\n')
