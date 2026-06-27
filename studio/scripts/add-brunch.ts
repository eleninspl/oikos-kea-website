/**
 * Προσθέτει την καρτέλα «Brunch» (5 κατηγορίες + προϊόντα) στο Sanity, ΜΟΝΟ αν
 * δεν υπάρχει ήδη (createIfNotExists). Τα orderRank μπαίνουν ΜΕΤΑ τα υπάρχοντα
 * ώστε να μη συγκρουστούν.
 *
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/add-brunch.ts
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

type Item = { el: string; en: string; price: string; dEl?: string; dEn?: string }
type Cat = { key: string; titleEl: string; titleEn: string; items: Item[] }

const CATS: Cat[] = [
  {
    key: 'eggs', titleEl: 'Αυγά', titleEn: 'Eggs',
    items: [
      { el: 'Ομελέτα ελληνική', en: 'Greek Omelette', price: '€10',
        dEl: 'Χοιρινό μπούτι, Φέτα, Πιπεριές, Ελιές, Ντοματίνια, Πράσινη σαλάτα, Ψωμί',
        dEn: 'Pork leg, Feta cheese, Peppers, Olives, Cherry tomatoes, Green salad, Bread' },
      { el: 'Αυγά Benedict', en: 'Benedict eggs', price: '€13',
        dEl: 'Muffin Ψωμί, Αυγά ποσέ, Πάπρικα, Μορταδέλα με φυστίκι, Σάλτσα Ολανδέζ — Έξτρα: καπνιστός σολομός +2,00€',
        dEn: 'Muffin bread, Poached Eggs, Paprika, Mortadella with pistachio, Hollandaise Sauce — Extra: smoked salmon +2,00€' },
      { el: 'Καγιανάς', en: 'Kagianas', price: '€10,50',
        dEl: 'Αυγά ποσέ, Σάλτσα ντομάτας, Προζυμένιο ψωμί, Κρέμα Φέτας',
        dEn: 'Poached Eggs, Tomato sauce, Sourdough Bread, Feta cheese cream' },
      { el: 'Αβοκάντο Τοστ', en: 'Avocado Toast', price: '€11,50',
        dEl: 'Αυγό μάτι, Γουακαμόλε, Ζαμπόν Cotto, Κατσικίσιο τυρί',
        dEn: 'Fried egg, Guacamole sauce, Ham Cotto, Goat cheese' },
      { el: 'Crouque Madame', en: 'Crouque Madame', price: '€11,50',
        dEl: 'Αφράτο ψωμί, Τυρί, Ντομάτα, Iceberg, Χοιρινή Ωμοπλάτη, Μπεσαμέλ, Αυγό μάτι',
        dEn: 'Soft bread, Cheese, Tomato, Iceberg, Pork shoulder, Bechamel sauce, Fried egg' },
    ],
  },
  {
    key: 'healthy', titleEl: 'Υγιεινό Πρωινό', titleEn: 'Healthy Breakfast',
    items: [
      { el: 'Ομελέτα fitness', en: 'Fitness Omelette', price: '€11',
        dEl: 'Ασπράδια αυγών, Ψητό μπρόκολο, Ψητά σπαράγγια, Τυρί Cottage, Ντρέσινγκ λεμόνι',
        dEn: 'Egg whites, Grilled broccoli, Grilled asparagus, Cottage cheese, Lemon dressing' },
      { el: 'Φαλάφελ', en: 'Falafel', price: '€11,50',
        dEl: 'Προζυμένιο ψωμί, Κρέμα ψητής κόκκινης πιπεριάς, Κρέμα παντζαριού, Φουντούκι',
        dEn: 'Sourdough bread, Cream of grilled red pepper, Beetroot cream, Hazel nut' },
      { el: 'Γιαούρτι', en: 'Yoghurt bowl', price: '€9',
        dEl: 'Μπανάνα, Φράουλα, Γκρανόλα, Φυστικοβούτυρο, Μέλι της περιοχής',
        dEn: 'Banana, Strawberry, Granola, Peanut Butter, Local honey' },
      { el: 'Acai bowl', en: 'Acai bowl', price: '€9',
        dEl: 'Μαρμελάδα με μύρτιλο, Γκρανόλα, Μύρτιλα',
        dEn: 'Blueberries marmalade, Granola, Blueberries' },
    ],
  },
  {
    key: 'snacks', titleEl: 'Σνακς', titleEn: 'Snacks',
    items: [
      { el: 'Κλαμπ σάντουιτς', en: 'Club Sandwich', price: '€12',
        dEl: 'Μπέικον, Ζαμπόν, Τυρί Γκούντα, Iceberg, Κοτοσαλάτα, Ντομάτα, Πατάτες τηγανιτές',
        dEn: 'Bacon, Ham, Gouda Cheese, Iceberg, Chicken Salad, Tomato, French fries' },
    ],
  },
  {
    key: 'sweets', titleEl: 'Γλυκές Αλχημείες', titleEn: 'Sweet Alchemies',
    items: [
      { el: 'Pancake Σφενδάμου', en: 'Maple Pancake', price: '€9',
        dEl: 'Σιρόπι σφενδάμου, Μύρτιλα, Φράουλες, Lime, Πεκάν',
        dEn: 'Maple syrup, Blueberries, Strawberries, Lime, Pecan' },
      { el: 'Nutella Pancake', en: 'Nutella Pancake', price: '€8,50',
        dEl: 'Πραλίνα φουντουκιού, Μπανάνα, Μπισκότο, Φουντούκι',
        dEn: 'Hazelnut praline, Banana, Biscuit, Hazelnut' },
      { el: 'French Toast', en: 'French Toast', price: '€9',
        dEl: 'Ψωμί σάντο, Κρέμα cheesecake, Σπιτική μαρμελάδα φράουλα',
        dEn: 'Sando bread, Cheesecake cream, Homemade strawberry marmalade' },
    ],
  },
  {
    key: 'pizza-burgers', titleEl: 'Πίτσα & Μπέργκερ', titleEn: 'Pizza & Burgers',
    items: [
      { el: 'Μαργαρίτα', en: 'Margherita', price: '€11',
        dEl: 'Σάλτσα ντομάτας, Μοτσαρέλα, Βασιλικός — Έξτρα: μοτσαρέλα fior di latte +2,00€',
        dEn: 'Tomato sauce, Mozzarella, Basil — Extra: mozzarella fior di latte +2,00€' },
      { el: 'Picante', en: 'Picante', price: '€13,50',
        dEl: 'Σάλτσα ντομάτας, Τσορίθο, Προβολόνε, Τσίλι, Βασιλικός, Μοτσαρέλα, Λεμόνι',
        dEn: 'Tomato sauce, Chorizo, Provolone, Chili pepper, Basil, Mozzarella, Lemon' },
      { el: 'Τρούφα', en: 'Tartufatta', price: '€16',
        dEl: 'Κρέμα μανιταριών, Μοτσαρέλα Fior di latte, Μανιτάρια εποχής, Τρούφα',
        dEn: 'Mushroom cream, Mozzarella Fior di latte, Seasonal mushrooms, Truffle' },
      { el: 'Burger Oikos', en: 'Burger Oikos', price: '€14',
        dEl: 'Μοσχαρίσιος κιμάς, Ψωμάκι μπριός, Μαγιονέζα τρούφας, Iceberg, Τσένταρ',
        dEn: 'Beef minced meat, Brioche bread, Truffle mayo, Iceberg, Cheddar' },
    ],
  },
]

function toItem(it: Item, key: string) {
  return {
    _type: 'menuItem',
    _key: key,
    nameEl: it.el,
    nameEn: it.en,
    price: it.price,
    hidden: false,
    ...(it.dEl ? { descEl: it.dEl } : {}),
    ...(it.dEn ? { descEn: it.dEn } : {}),
  }
}

async function run() {
  const maxMenu: string | null = await client.fetch(
    `*[_type=="menu"]|order(orderRank desc)[0].orderRank`
  )
  const maxCat: string | null = await client.fetch(
    `*[_type=="category"]|order(orderRank desc)[0].orderRank`
  )

  const menuRank = (maxMenu ? LexoRank.parse(maxMenu) : LexoRank.middle()).genNext()
  let catRank = (maxCat ? LexoRank.parse(maxCat) : LexoRank.middle()).genNext()

  let tx = client.transaction()

  tx = tx.createIfNotExists({
    _id: 'menu.brunch',
    _type: 'menu',
    labelEl: 'Brunch',
    labelEn: 'Brunch',
    key: { _type: 'slug', current: 'brunch' },
    orderRank: menuRank.toString(),
    hidden: false,
  })

  let n = 0
  for (const c of CATS) {
    tx = tx.createIfNotExists({
      _id: `cat.brunch.${c.key}`,
      _type: 'category',
      titleEl: c.titleEl,
      titleEn: c.titleEn,
      menu: { _type: 'reference', _ref: 'menu.brunch' },
      orderRank: catRank.toString(),
      hidden: false,
      items: c.items.map((it, i) => toItem(it, `bru-${c.key}-${i}`)),
    })
    catRank = catRank.genNext()
    n += c.items.length
  }

  await tx.commit()
  console.log(`✓ Brunch: 1 menu + ${CATS.length} categories + ${n} items (createIfNotExists)`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
