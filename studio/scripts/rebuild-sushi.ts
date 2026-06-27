/** Ξαναχτίζει το «Sushi» tab από την επίσημη κάρτα:
 *  Starters, Salad, Rolls, Donburi, Sashimi, Nigiri.
 *   SANITY_WRITE_TOKEN=... npx tsx scripts/rebuild-sushi.ts  */
import { createClient } from '@sanity/client'
import { LexoRank } from 'lexorank'

const client = createClient({ projectId:'s7x6np2r', dataset:'production', apiVersion:'2022-09-09', token:process.env.SANITY_WRITE_TOKEN, useCdn:false })

type It = { el:string; en:string; price:number; dEl?:string; dEn?:string }
type Cat = { key:string; el:string; en:string; items:It[] }
const M = (el:string,en:string,price:number,dEl?:string,dEn?:string):It => ({el,en,price,dEl,dEn})

const CATS: Cat[] = [
  { key:'starters', el:'Starters', en:'Starters', items:[
    M('Edamame Classic','Edamame Classic',7,'Ανθός αλατιού, lime','Sea salt, lime'),
    M('Edamame Spicy','Edamame Spicy',8,'Chili garlic, lime','Chili garlic, lime'),
  ]},
  { key:'salad', el:'Salad', en:'Salad', items:[
    M('Wakame','Wakame',9,'Κόκκινο τσίλι, dressing σουσαμιού, ponzu oil, φύτρες','Red chili, sesame dressing, ponzu oil, cress'),
  ]},
  { key:'rolls', el:'Rolls', en:'Rolls', items:[
    M('Kyuri (5pcs)','Kyuri (5pcs)',15,
      'Έξω: αγγούρι · Μέσα: ταρτάρ σολομού, σπαράγγι, shiso, takana · Topping: κρέμα χρένου, αυγά σολομού, φύτρες',
      'Outside: cucumber · Inside: salmon tartare, asparagus, shiso, takana · Topping: horseradish cream, salmon roe, cress'),
    M('Spicy Maguro (6pcs)','Spicy Maguro (6pcs)',14,
      'Έξω: σουσάμι kimchi · Μέσα: ταρτάρ τόνου, φρέσκο κρεμμύδι, yuzu tobiko, takuan · Topping: μαγιονέζα chili yuzu, κόκκινο τσίλι',
      'Outside: kimchi sesame · Inside: tuna tartare, spring onion, yuzu tobiko, takuan · Topping: chili yuzu mayo, red chili'),
    M('Hamachi Jalapeño (6pcs)','Hamachi Jalapeño (6pcs)',18,
      'Μέσα: ταρτάρ hamachi, takana, takuan · Topping: αβοκάντο, μαγιονέζα τρούφας, φρέσκια τρούφα · Side: jalapeño dressing, μαύρο σκόρδο, λάδι από κόκκινο τσίλι',
      'Inside: hamachi tartare, takana, takuan · Topping: avocado, truffle mayo, fresh truffle · Side: jalapeño dressing, black garlic, chili oil'),
    M('Ebi (5pcs)','Ebi (5pcs)',16,
      'Έξω: crispy tomato furikake · Μέσα: γαρίδα tempura, πίκλα καρότο · Topping: κρέμα αβοκάντο, τοματίνι, ανθός αλατιού · Side: aji ponzu dressing, εσαλότ',
      'Outside: crispy tomato furikake · Inside: tempura shrimp, pickled carrot · Topping: avocado cream, cherry tomato, sea salt · Side: aji ponzu dressing, shallot'),
    M('Fried Sake (5pcs)','Fried Sake (5pcs)',16,
      'Μέσα: σολομός, σπαράγγι, takuan, αρωματική κρέμα · Topping: μαγιονέζα chili yuzu, ταρτάρ σολομού, πέρλες yuzu, unagi sauce',
      'Inside: salmon, asparagus, takuan, aromatic cream · Topping: chili yuzu mayo, salmon tartare, yuzu pearls, unagi sauce'),
    M('Kani (6pcs)','Kani (6pcs)',16,
      'Έξω: orange tobiko, μαύρο σκόρδο · Μέσα: μπλε καβούρι, πίκλα αγγούρι, αβοκάντο · Topping: μαγιονέζα yuzu kosho, καμένο κουνουπίδι, σκόνη lime',
      'Outside: orange tobiko, black garlic · Inside: blue crab, pickled cucumber, avocado · Topping: yuzu kosho mayo, burned cauliflower, lime powder'),
    M('Vegetarian (5pcs)','Vegetarian (5pcs)',12,
      "Έξω: σκόνη πιπεριάς Φλωρίνης · Μέσα: shiso, takuan, takana, φρέσκο κρεμμύδι, enoki, αβοκάντο, σπαράγγι · Topping: μαγιονέζα τρούφας, kale",
      "Outside: florina's pepper powder · Inside: shiso, takuan, takana, spring onion, enoki, avocado, asparagus · Topping: truffle mayo, kale"),
  ]},
  { key:'donburi', el:'Donburi', en:'Donburi', items:[
    M('Chirashi','Chirashi',16,
      'Ρύζι σούσι, πίκλα ginger, τόνος, σολομός, hamachi, λαβράκι, shiso, αγγούρι, αβοκάντο, αυγά σολομού, chirashi dressing',
      'Sushi rice, pickled ginger, tuna, salmon, hamachi, seabass, shiso, cucumber, avocado, salmon roe, chirashi dressing'),
  ]},
  { key:'sashimi', el:'Sashimi (3 τεμ.)', en:'Sashimi (3pcs)', items:[
    M('Σολομός','Sake',7), M('Τόνος','Maguro',8), M('Λαβράκι','Suzuki',6),
  ]},
  { key:'nigiri', el:'Nigiri (2 τεμ.)', en:'Nigiri (2pcs)', items:[
    M('Σολομός','Sake',8,'Κρέμα αβοκάντο, αυγά σολομού','Avocado cream, salmon roe'),
    M('Τόνος','Maguro',8,'Kizami wasabi','Kizami wasabi'),
    M('Λαβράκι','Suzuki',8,'Μαγιονέζα yuzu kosho, πέρλες yuzu','Yuzu kosho mayo, yuzu pearls'),
  ]},
]

async function run(){
  const MENU: string = await client.fetch(`*[_type=="menu" && labelEl=="Sushi"][0]._id`)
  if (!MENU) throw new Error('Δεν βρέθηκε tab «Sushi»')

  const oldCats: string[] = await client.fetch(`*[_type=="category" && menu._ref==$m]._id`, { m: MENU })
  const oldItems: string[] = await client.fetch(`*[_type=="menuItem" && references(*[_type=="category" && menu._ref==$m]._id)]._id`, { m: MENU })
  let cRank = LexoRank.parse(await client.fetch(`*[_type=="category"]|order(orderRank desc)[0].orderRank`))
  let iRank = LexoRank.parse(await client.fetch(`*[_type=="menuItem"]|order(orderRank desc)[0].orderRank`))

  let tx = client.transaction()
  for (const id of oldItems) tx = tx.delete(id)
  for (const id of oldCats) tx = tx.delete(id)

  for (const c of CATS){
    cRank = cRank.genNext()
    const catId = `cat.sushi.${c.key}`
    tx = tx.createOrReplace({ _id:catId, _type:'category', titleEl:c.el, titleEn:c.en, menu:{_type:'reference',_ref:MENU}, orderRank:cRank.toString(), hidden:false })
    c.items.forEach((it,i)=>{
      iRank = iRank.genNext()
      const doc:any = { _id:`item.sushi.${c.key}.i${i}`, _type:'menuItem', nameEl:it.el, nameEn:it.en,
        category:{_type:'reference',_ref:catId}, orderRank:iRank.toString(), available:true, hidden:false,
        prices:[{_type:'priceVariant',_key:'p0',amount:it.price}] }
      if (it.dEl) doc.descEl = it.dEl
      if (it.dEn) doc.descEn = it.dEn
      tx = tx.createOrReplace(doc)
    })
  }
  await tx.commit({ visibility:'async' })
  const n = CATS.reduce((a,c)=>a+c.items.length,0)
  console.log(`✓ Sushi: ${CATS.length} κατηγορίες, ${n} προϊόντα (σβήστηκαν ${oldCats.length}/${oldItems.length})`)
}
run().catch(e=>{console.error(e);process.exit(1)})
