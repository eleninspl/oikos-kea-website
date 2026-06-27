/**
 * Μετατρέπει τα embedded `category.items[]` σε ξεχωριστά `menuItem` documents.
 *  - parse τιμής (string «€9,50») → number· glass → παραλλαγή «Ποτήρι/Μπουκάλι»
 *  - «Έξτρα: X +Y€» μέσα στην περιγραφή → δομημένο extra (και καθαρισμός περιγραφής)
 *  - category reference + orderRank (σειρά διατηρείται)
 *  - τέλος: αφαιρεί το παλιό items[] από τις κατηγορίες
 *
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/migrate-items-to-docs.ts
 */
import { createClient } from '@sanity/client'
import { LexoRank } from 'lexorank'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 's7x6np2r',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  apiVersion: '2022-09-09',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

function parseAmount(s: any): number | null {
  if (s == null) return null
  const n = parseFloat(String(s).replace(/[^\d.,]/g, '').replace(',', '.'))
  return isNaN(n) ? null : n
}

// Βγάζει «— Έξτρα: <name> +<price>€» από την περιγραφή. Επιστρέφει {clean, extra}.
function extractExtra(desc: string | undefined, kw: RegExp) {
  if (!desc) return { clean: desc, name: null as string | null, amount: null as number | null }
  const m = desc.match(new RegExp(`[—\\-]?\\s*${kw.source}\\s*:?\\s*(.+?)\\s*\\+\\s*([\\d.,]+)\\s*€`, 'i'))
  if (!m) return { clean: desc, name: null, amount: null }
  const clean = desc.replace(m[0], '').replace(/[\s—\-]+$/, '').trim()
  return { clean, name: m[1].trim(), amount: parseAmount(m[2]) }
}

function buildPrices(price: any, glass: any) {
  const main = parseAmount(price)
  const g = parseAmount(glass)
  if (g != null && main != null) {
    return [
      { _type: 'priceVariant', _key: 'glass', labelEl: 'Ποτήρι', labelEn: 'Glass', amount: g },
      { _type: 'priceVariant', _key: 'bottle', labelEl: 'Μπουκάλι', labelEn: 'Bottle', amount: main },
    ]
  }
  if (main != null) return [{ _type: 'priceVariant', _key: 'p0', amount: main }]
  return []
}

async function run() {
  const cats: any[] = await client.fetch(
    `*[_type=="category"] | order(orderRank asc){_id, items}`
  )

  let tx = client.transaction()
  let rank = LexoRank.middle()
  let created = 0

  for (const cat of cats) {
    const items: any[] = Array.isArray(cat.items) ? cat.items : []
    items.forEach((it, idx) => {
      const ex = extractExtra(it.descEl, /Έξτρα/)
      const exEn = extractExtra(it.descEn, /Extra/)
      const extras =
        ex.name || exEn.name
          ? [{
              _type: 'extra', _key: 'x0',
              labelEl: ex.name ?? exEn.name ?? '',
              labelEn: exEn.name ?? ex.name ?? '',
              ...(ex.amount ?? exEn.amount ? { surcharge: ex.amount ?? exEn.amount } : {}),
            }]
          : []

      const doc: any = {
        _id: `${cat._id.replace(/^cat\./, 'item.')}.i${idx}`,
        _type: 'menuItem',
        nameEl: it.nameEl,
        nameEn: it.nameEn,
        category: { _type: 'reference', _ref: cat._id },
        orderRank: rank.toString(),
        available: true,
        hidden: !!it.hidden,
        prices: buildPrices(it.price, it.glass),
      }
      if (ex.clean) doc.descEl = ex.clean
      if (exEn.clean) doc.descEn = exEn.clean
      if (extras.length) doc.extras = extras

      tx = tx.createOrReplace(doc)
      rank = rank.genNext()
      created++
    })
    // Καθάρισε το παλιό embedded array
    tx = tx.patch(cat._id, { unset: ['items', 'subsections'] })
  }

  await tx.commit({ visibility: 'async' })
  console.log(`✓ Δημιουργήθηκαν ${created} menuItem documents από ${cats.length} κατηγορίες (items[] καθαρίστηκε)`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
