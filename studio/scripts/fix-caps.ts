/**
 * Μετατρέπει τα ΟΛΟΚΕΦΑΛΑΙΑ ονόματα/τίτλους σε Κανονική Γραφή (Title Case).
 * Αφήνει ανέπαφα όσα έχουν ήδη πεζά (μεικτά). Τρέχει πάνω σε όλες τις κατηγορίες.
 *
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/fix-caps.ts
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 's7x6np2r',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  apiVersion: '2022-09-09',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const hasLower = (s: string) => /\p{Ll}/u.test(s)
const hasUpper = (s: string) => /\p{Lu}/u.test(s)
const isAllCaps = (s: string) => !!s && hasUpper(s) && !hasLower(s)

function titleCase(s: string): string {
  return s
    .toLocaleLowerCase('el-GR')
    .replace(/(^|[\s(/\-–—.&])(\p{L})/gu, (_m, p, c) => p + c.toLocaleUpperCase('el-GR'))
}

const fix = (s: any) => (typeof s === 'string' && isAllCaps(s) ? titleCase(s) : s)

function fixItem(it: any) {
  return { ...it, nameEl: fix(it.nameEl), nameEn: fix(it.nameEn) }
}

async function run() {
  const cats: any[] = await client.fetch(`*[_type=="category"]{_id, titleEl, titleEn, items, subsections}`)
  let tx = client.transaction()
  let changed = 0

  for (const c of cats) {
    const patch: any = {}
    if (isAllCaps(c.titleEl)) patch.titleEl = titleCase(c.titleEl)
    if (isAllCaps(c.titleEn)) patch.titleEn = titleCase(c.titleEn)
    if (Array.isArray(c.items)) {
      const next = c.items.map(fixItem)
      if (JSON.stringify(next) !== JSON.stringify(c.items)) patch.items = next
    }
    if (Array.isArray(c.subsections)) {
      const next = c.subsections.map((s: any) => ({
        ...s,
        titleEl: fix(s.titleEl),
        titleEn: fix(s.titleEn),
        items: Array.isArray(s.items) ? s.items.map(fixItem) : s.items,
      }))
      if (JSON.stringify(next) !== JSON.stringify(c.subsections)) patch.subsections = next
    }
    if (Object.keys(patch).length) {
      tx = tx.patch(c._id, { set: patch })
      changed++
    }
  }

  if (changed) await tx.commit({ visibility: 'async' })
  console.log(`✓ Διορθώθηκαν κεφαλαία σε ${changed} κατηγορίες`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
