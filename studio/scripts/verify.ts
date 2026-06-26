/**
 * Επαλήθευση χωρίς δίκτυο: προσομοιώνει το GROQ πάνω στο menu.ndjson (category docs)
 * και τρέχει το πραγματικό assembleMenu().
 */
import { readFileSync } from 'node:fs'
import { assembleMenu } from '../../src/lib/sanity'
import { menuTabs, wineListSections } from '../../src/i18n/menuData'

const docs = readFileSync(new URL('../menu.ndjson', import.meta.url), 'utf8')
  .trim().split('\n').map((l) => JSON.parse(l))

const stripItem = (i: any) => ({
  nameEl: i.nameEl, nameEn: i.nameEn, descEl: i.descEl, descEn: i.descEn,
  infoEl: i.infoEl, infoEn: i.infoEn, price: i.price, priceAlt: i.priceAlt, glass: i.glass,
})
// simulate GROQ: menus dereferenced to key
const menuById = Object.fromEntries(
  docs.filter((d) => d._type === 'menu').map((m) => [m._id, m.key.current])
)
const menus = docs
  .filter((d) => d._type === 'menu' && !d.hidden)
  .sort((a, b) => a.order - b.order)
  .map((m) => ({ key: m.key.current, labelEl: m.labelEl, labelEn: m.labelEn }))
const categories = docs
  .filter((d) => d._type === 'category' && !d.hidden)
  .sort((a, b) => a.order - b.order)
  .map((c) => ({
    titleEl: c.titleEl, titleEn: c.titleEn,
    menuKeys: (c.menus ?? []).map((r: any) => menuById[r._ref]),
    items: (c.items ?? []).filter((i: any) => !i.hidden).map(stripItem),
    subsections: (c.subsections ?? []).filter((x: any) => !x.hidden).map((sub: any) => ({
      titleEl: sub.titleEl, titleEn: sub.titleEn, sectionPrice: sub.sectionPrice,
      items: (sub.items ?? []).filter((i: any) => !i.hidden).map(stripItem),
    })),
  }))

const assembled = assembleMenu({ menus, categories } as any)

let pass = 0, fail = 0
const check = (label: string, cond: boolean, extra = '') => {
  if (cond) { pass++; console.log(`  ✓ ${label}`) }
  else { fail++; console.log(`  ✗ ${label} ${extra}`) }
}

console.log('\n── Structure ──')
check('4 tabs', assembled.length === 4, `got ${assembled.length}`)
check('tab keys order', assembled.map((t) => t.key).join(',') === 'allday,cocktails,sushi,cuisine',
  assembled.map((t) => t.key).join(','))

console.log('\n── Wine εμφανίζεται σε allday & cuisine ──')
const byKey = Object.fromEntries(assembled.map((t) => [t.key, t]))
const wineCount = wineListSections.length
for (const tab of menuTabs) {
  const own = tab.sections.filter((s) => !wineListSections.includes(s)).length
  const expected = ['allday', 'cuisine'].includes(tab.key) ? own + wineCount : own
  check(`${tab.key}: ${expected} κατηγορίες`, byKey[tab.key].sections.length === expected,
    `got ${byKey[tab.key].sections.length}`)
}

console.log('\n── Wine πάντα τελευταία ──')
const lastAllday = byKey['allday'].sections.at(-1)
check('τελευταία κατηγορία allday είναι κρασί/τυρί',
  /κρασ|Τυρ/i.test(lastAllday?.titleEl ?? ''), lastAllday?.titleEl)

console.log('\n── Special case 1β: Sashimi/Nigiri priceAlt ──')
const sushi = byKey['sushi'].sections.flatMap((s) => s.items ?? [])
const sake = sushi.find((i) => i.nameEn?.startsWith('Salmon'))
check('Salmon price=Sashimi €7', sake?.price === 'Sashimi €7', sake?.price)
check('Salmon priceAlt=Nigiri €8', (sake as any)?.priceAlt === 'Nigiri €8', (sake as any)?.priceAlt)

console.log('\n── Special case 2β: Milkshake sectionPrice ──')
const allSubs = byKey['allday'].sections.flatMap((s) => s.subsections ?? [])
const milk = allSubs.find((s) => s.titleEn === 'Milkshake')
check('Milkshake title καθαρό', milk?.titleEl === 'Milkshake', milk?.titleEl)
check('Milkshake sectionPrice=€6,50', (milk as any)?.sectionPrice === '€6,50', (milk as any)?.sectionPrice)

console.log('\n── Item totals ──')
const renderCount = assembled.flatMap((t) => t.sections).reduce((n, s) =>
  n + (s.items?.length ?? 0) + (s.subsections ?? []).reduce((m, x) => m + x.items.length, 0), 0)
const wineItems = categories.filter((c) => c.menuKeys.includes('allday') && c.menuKeys.includes('cuisine'))
  .reduce((n, s) => n + (s.items?.length ?? 0) + (s.subsections ?? []).reduce((m: number, x: any) => m + x.items.length, 0), 0)
check('rendered item count', renderCount === 130 + wineItems,
  `render=${renderCount} expected=${130 + wineItems}`)

console.log(`\n${fail === 0 ? '✅ ALL PASS' : '❌ FAILURES'}: ${pass} passed, ${fail} failed\n`)
process.exit(fail === 0 ? 0 : 1)
