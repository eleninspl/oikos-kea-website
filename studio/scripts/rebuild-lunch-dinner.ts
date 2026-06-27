/** Ξαναχτίζει το Lunch / Dinner tab ΑΚΡΙΒΩΣ όπως οι επίσημες κάρτες:
 *  Ορεκτικά, Σαλάτες, Κυρίως Πιάτα, Γλυκά.
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/rebuild-lunch-dinner.ts  */
import { createClient } from '@sanity/client'
import { LexoRank } from 'lexorank'

const client = createClient({ projectId:'s7x6np2r', dataset:'production', apiVersion:'2022-09-09', token:process.env.SANITY_WRITE_TOKEN, useCdn:false })
const MENU = 'menu.lunch-dinner'

type It = { el:string; en:string; price:number; dEl?:string; dEn?:string }
type Cat = { key:string; el:string; en:string; items:It[] }

const CATS: Cat[] = [
  { key:'appetizers', el:'Ορεκτικά', en:'Appetizers', items:[
    { el:'Ψωμί και ντιπ ημέρας', en:'Bread and dip of the day', price:1.5 },
    { el:'Σεβίτσε λαβράκι', en:'Sea bass ceviche', price:16,
      dEl:'Ζύμωση εσπεριδοειδών φρούτων, Lime, Τσίλι πιπεριά, Τζελ λεμόνι',
      dEn:'Fermentation of citrus fruits, Lime, Chili pepper, Lemon gel' },
    { el:'Ταρτάρ Μοσχάρι', en:'Beef Tartare', price:16,
      dEl:'Κάπαρη, Πίκλα αγγούρι, Κρεμμύδι, Λεμόνι, Σόγια, Μαγιονέζα',
      dEn:'Caper, Pickled cucumber, Onion, Soy sauce, Mayo' },
    { el:'Νιόκι με μοσχάρι', en:'Gnocchi with beef', price:14,
      dEl:'Κρέμα Γκοργκοντζόλα, Μοσχάρι ταρτάρ, Κουκουνάρι',
      dEn:'Gorgonzola cream, Beef tartare, Pine nut' },
  ]},
  { key:'salads', el:'Σαλάτες', en:'Salads', items:[
    { el:'Του Καίσαρα', en:"Caesar's", price:13,
      dEl:'Αφράτο μαρούλι, Τραγανό κοτόπουλο, Μπέικον, Κρουτόν, Καλαμπόκι, Παρμεζάνα',
      dEn:'Fluffy lettuce, Crispy chicken, Bacon, Croutons, Corn, Parmesan' },
    { el:'Μπουράτα', en:'Burrata', price:13,
      dEl:'Ντοματίνια, Πέστο Βασιλικού, Τριμμένη ντομάτα, Βασιλικός, Κουκουνάρι, Προσούτο',
      dEn:'Cherry tomatoes, Pesto basil, Grated tomato, Basil, Pine nut, Prosciutto' },
    { el:'Πράσινη σαλάτα', en:'Green salad', price:13.5,
      dEl:'Γαρίδες ψητές, Αβοκάντο, Ρόδι, Κουκουνάρι, Κατσικίσιος κορμός, Βαλσάμικο ξύδι',
      dEn:"Grilled shrimps, Avocado, Pomegranate, Pine nut, Chevre goat cheese, Balsamic vinegar" },
  ]},
  { key:'mains', el:'Κυρίως Πιάτα', en:'Main Courses', items:[
    { el:'Ριγκατόνι κοτόπουλο', en:'Chicken rigatoni', price:16.5,
      dEl:'Γκουαντσιάλε, Πολύχρωμες πιπεριές, Μανιτάρια, Κρέμα Παρμεζάνας, Ξύσμα λεμόνι',
      dEn:'Guanciale, Colorful peppers, Mushrooms, Parmesan cream, Lemon zest' },
    { el:'Κριθαρότο μανιταριών', en:'Orzo with mushrooms', price:15.5,
      dEl:'Βασιλομανίταρα, Σιτάκε, Τρούφα, Παλαιωμένη Παρμεζάνα',
      dEn:'King mushrooms, Shiitake, Truffle, Aged Parmesan' },
    { el:'Μανέστρα', en:'Orzo', price:17,
      dEl:'Σιδηρόδρομος μοσχαρίσιος, Κρέμα Μετσοβόνε, Μυρώνι',
      dEn:'Beef ribs, Metsovone cream, Chervil' },
    { el:'Caccio e pepe', en:'Caccio e pepe', price:16,
      dEl:'Χειροποίητο λιγκουίνι, Κρέμα Πεκορίνο, Μοσχαρίσια φιλετάκια',
      dEn:'Handmade linguine pasta, Pecorino cream, Beef fillets' },
    { el:'Σολομός Σχάρας', en:'Grilled Salmon', price:23,
      dEl:'Κρέμα σελινόριζας, Αρακάς, Σάλτσα λεμονοθύμαρο',
      dEn:'Celeriac cream, Pea, Lemon Thyme sauce' },
    { el:'Rib-Eye Αμερικής 300gr', en:'Rib-Eye USA 300gr', price:37,
      dEl:'Σερβίρεται με λαχανικά σχάρας ή πατάτες τηγανιτές',
      dEn:'Served with grilled vegetables or fried potatoes' },
  ]},
  { key:'desserts', el:'Γλυκά', en:'Desserts', items:[
    { el:'Προφιτερόλ', en:'Profiterole', price:9,
      dEl:'Κρέμα ζαχαροπλαστικής, Μους σοκολάτα γάλακτος, Σάλτσα σοκολάτας, Φουντούκι',
      dEn:'Pâtisserie cream, Milk chocolate mousse, Chocolate sauce, Hazelnut' },
    { el:'Τιραμισού', en:'Tiramisu', price:9,
      dEl:'Κρέμα τυριών, Σαμπαγιόν καφέ, Σαβαγιάρ',
      dEn:'Cream cheese, Coffee sabayon, Savoyard' },
    { el:'Λεμονόπιτα', en:'Lemon Pie', price:9,
      dEl:'Κράμπλ, Κρέμα λεμονιού, Μαρέγκα',
      dEn:'Crumble, Lemon cream, Meringue' },
  ]},
]

async function run(){
  const oldCats: string[] = await client.fetch(`*[_type=="category" && menu._ref==$m]._id`, { m: MENU })
  const oldItems: string[] = await client.fetch(`*[_type=="menuItem" && references(*[_type=="category" && menu._ref==$m]._id)]._id`, { m: MENU })
  let cRank = LexoRank.parse(await client.fetch(`*[_type=="category"]|order(orderRank desc)[0].orderRank`))
  let iRank = LexoRank.parse(await client.fetch(`*[_type=="menuItem"]|order(orderRank desc)[0].orderRank`))

  let tx = client.transaction()
  for (const id of oldItems) tx = tx.delete(id)
  for (const id of oldCats) tx = tx.delete(id)

  for (const c of CATS){
    cRank = cRank.genNext()
    const catId = `cat.lunch.${c.key}`
    tx = tx.createOrReplace({ _id:catId, _type:'category', titleEl:c.el, titleEn:c.en, menu:{_type:'reference',_ref:MENU}, orderRank:cRank.toString(), hidden:false })
    c.items.forEach((it, i)=>{
      iRank = iRank.genNext()
      const doc: any = { _id:`item.lunch.${c.key}.i${i}`, _type:'menuItem', nameEl:it.el, nameEn:it.en,
        category:{_type:'reference',_ref:catId}, orderRank:iRank.toString(), available:true, hidden:false,
        prices:[{_type:'priceVariant',_key:'p0',amount:it.price}] }
      if (it.dEl) doc.descEl = it.dEl
      if (it.dEn) doc.descEn = it.dEn
      tx = tx.createOrReplace(doc)
    })
  }
  await tx.commit({ visibility:'async' })
  const n = CATS.reduce((a,c)=>a+c.items.length,0)
  console.log(`✓ Lunch/Dinner: ${CATS.length} κατηγορίες, ${n} προϊόντα (σβήστηκαν ${oldCats.length} cats / ${oldItems.length} items)`)
}
run().catch(e=>{console.error(e);process.exit(1)})
