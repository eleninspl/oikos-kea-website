// ─────────────────────────────────────────────────────────────────────────────
// Menu domain model + seed data.
//
// Source of truth at runtime is Sanity (see src/lib/sanity.ts). This file serves
// two intentional purposes and is NOT dead code:
//   1. Shared TypeScript types for both the site and the studio migration scripts.
//   2. Seed/fallback data — re-imported by studio/scripts/migrate.ts and used as a
//      build-time fallback if Sanity is unreachable.
// ─────────────────────────────────────────────────────────────────────────────

export type PriceVariant = { labelEl?: string; labelEn?: string; amount: number };
export type Extra = { labelEl: string; labelEn?: string; surcharge?: number };

export type Item = {
  nameEl: string;
  nameEn: string;
  descEl?: string;
  descEn?: string;
  // ── structured model (Sanity, source of truth) ──
  image?: string;
  prices?: PriceVariant[];
  priceNote?: string;
  labels?: string[];
  allergens?: string[];
  extras?: Extra[];
  available?: boolean;
  // ── legacy (seed/fallback data) ──
  infoEl?: string;
  infoEn?: string;
  price?: string;
  priceAlt?: string;
  glass?: string;
};

export type Subsection = {
  titleEl?: string;
  titleEn?: string;
  sectionPrice?: string; // shared price shown next to subsection title
  items: Item[];
};

export type Section = {
  titleEl: string;
  titleEn: string;
  noteEl?: string;
  noteEn?: string;
  items?: Item[];
  subsections?: Subsection[];
};

export type MenuTab = {
  key: string;
  labelEl: string;
  labelEn: string;
  noteEl?: string;
  noteEn?: string;
  image?: string;
  sections: Section[];
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const n  = (name: string, price: string): Item => ({ nameEl: name, nameEn: name, price });
const bn = (el: string, en: string, price: string): Item => ({ nameEl: el, nameEn: en, price });
const d  = (name: string, price: string, el: string, en: string): Item => ({ nameEl: name, nameEn: name, price, descEl: el, descEn: en });
const bd = (nameEl: string, nameEn: string, price: string, descEl: string, descEn: string): Item => ({ nameEl, nameEn, price, descEl, descEn });
const w  = (name: string, price: string, infoEl: string, infoEn: string, glass?: string): Item => ({ nameEl: name, nameEn: name, price, infoEl, infoEn, glass });
const wb = (el: string, en: string, price: string, infoEl: string, infoEn: string, glass?: string): Item => ({ nameEl: el, nameEn: en, price, infoEl, infoEn, glass });

// ─── Wine list (shared between All Day & Cuisine) ─────────────────────────────
export const wineListSections: Section[] = [
  {
    titleEl: 'Αφρώδη Κρασιά',
    titleEn: 'Sparkling Wines',
    items: [
      w('Truffle Hunter', '€24', 'Ημίγλυκος, 100% Μοσχάτο, Bosio Winery — Πιεμόντε', 'Semi sweet, 100% Moschato, Bosio Winery — Piemonte'),
      w('Infinitum Prosecco', '€26', 'Ξηρός, Glera — Chardonnay, Βένετο', 'Dry, Glera — Chardonnay, Veneto'),
      wb('Ακακίες', 'Akakies', '€28', 'Ξηρός, 100% Ξινόμαυρο, Κτήμα Κυρ-Γιάννη — Νάουσα', 'Dry, 100% Xinomavro, Kir-Yianni Estate — Naousa'),
      w('Amalia Brut', '€33', 'Ξηρός, 100% Μοσχοφίλερο, Κτήμα Τσέλεπου — Μαντίνεια', 'Dry, 100% Moschofilero, Tselepos Estate — Mantineia'),
      w('Charles Heidsieck Brut Reserve', '€115', 'Ξηρός, Chardonnay — Pinot Noir, Charles Heidsieck — Καμπάνια', 'Dry, Chardonnay — Pinot Noir, Charles Heidsieck — Champagne'),
    ],
  },
  {
    titleEl: 'Επιδόρπια Κρασιά',
    titleEn: 'Dessert Wines',
    items: [
      w('Vin Doux', '€24', 'Φυσικώς γλυκύς, 100% Μοσχάτο Σάμου, ΕΟΣ Σάμου', 'Naturally sweet, 100% Moschato of Samos, Samos Wines', '€7'),
      w('Vinsanto', '€45', 'Φυσικώς γλυκύς, Ασύρτικο — Αηδάνι, Κτήμα Santo Wines — Σαντορίνη', 'Naturally sweet, Asirtiko — Aidani, Santo Wines Estate — Santorini'),
    ],
  },
  {
    titleEl: 'Λευκά Κρασιά',
    titleEn: 'White Wines',
    items: [
      w('The Blender', '€18', 'Ξηρός, Ασύρτικο — Μαλαγουζιά, Κτήμα Ακριώτου — Αιγιάλεια', 'Dry, Asirtiko — Malagouzia, Akriotou Microwinery — Aigialia', '€6'),
      wb('Μέγα Σπήλαιο Cuvée', 'Mega Spileo Cuvée', '€24', 'Ξηρός, Μαλαγουζιά — Ασύρτικο — Chardonnay, Κτήμα Μέγα Σπήλαιο — Καλάβρυτα', 'Dry, Malagouzia — Asirtiko — Chardonnay, Mega Spileo Estate — Kalavrita'),
      wb('Δύο Ποτάμια', 'Dio Potamia', '€24', 'Ξηρός, Ασύρτικο — Κοντούρα, Κτήμα Σαμαρτζή — Θήβα', 'Dry, Asirtiko — Kontoura, Samartzis Estate — Thiva', '€7'),
      wb('Κλεψύδρα', 'Klepsidra', '€26', 'Ξηρός, 100% Μαλαγουζιά, Κτήμα Σαμαρτζή — Θήβα', 'Dry, 100% Malagouzia, Samartzis Winery — Thiva'),
      w('Pinot Grigio DOC Friuli', '€26', 'Ξηρός, 100% Pinot Grigio, Κτήμα Bidoli — Friuli, Ιταλία', 'Dry, 100% Pinot Grigio, Bidoli Estate — Friuli, Italy'),
      w('Crispy Assyrtiko', '€27', 'Ξηρός, 100% Ασύρτικο, Κτήμα Μουσών — Θήβα', 'Dry, 100% Asirtiko, Muses Estate — Thiva'),
      wb('Ήδυσμα Δρυός', 'Idisma Drios', '€31', 'Ξηρός, 100% Chardonnay, Κτήμα Τέχνη Οίνου — Δράμα', 'Dry, 100% Chardonnay, Wine Art Estate — Drama'),
      wb('Ασύρτικο της Γαίας', "Gaia's Assyrtiko (Wild Ferment)", '€68', 'Ξηρός, 100% Ασύρτικο, Κτήμα Γαία — Σαντορίνη', 'Dry, 100% Asirtiko, Gaia Estate — Santorini'),
    ],
  },
  {
    titleEl: 'Ροζέ Κρασιά',
    titleEn: 'Rosé Wines',
    items: [
      w('The Blender', '€18', 'Ημίξηρος, Ασύρτικο — Μοσχοφίλερο, Κτήμα Ακριώτου — Αιγιάλεια', 'Semi dry, Asirtiko — Moschofilero, Akriotou Microwinery — Aigialia', '€6'),
      wb('Αμυγδαλιές', 'Amigdalies', '€22', 'Ξηρός, 100% Syrah, Κτήμα Άβαντις — Εύβοια', 'Dry, 100% Syrah, Avantis Estate — Evoia', '€7'),
      wb('Μικρή Κιβωτός', 'Little Ark', '€24', 'Ξηρός, 100% Μοσχοφίλερο, Κτήμα Λαντίδη — Νεμέα', 'Dry, 100% Moschofilero, Lantides Estate — Nemea'),
      w('Ombré', '€25', 'Ξηρός, 100% Merlot, Κτήμα Οινοτρόποι — Μεσσηνία', 'Dry, 100% Merlot, Oinotropi Estate — Messinia', '€7'),
      wb('3 Μάγισσες', '3 Maggises', '€28', 'Ημίγλυκος, Syrah — Αγιωργίτικο — Μοσχοφίλερο, Κτήμα Μπαραφάκα — Νεμέα', 'Semi sweet, Syrah — Agiorgitiko — Moschofilero, Barafaka Estate — Nemea', '€7'),
      w('Whispering Angel', '€48', 'Ξηρός, Cinsault — Mourvedre — Rolle — Syrah, Chateau d\'Esclans — Προβηγκία', "Dry, Cinsault — Mourvedre — Rolle — Syrah, Chateau d'Esclans — Provence", '€10'),
    ],
  },
  {
    titleEl: 'Ερυθρά Κρασιά',
    titleEn: 'Red Wines',
    items: [
      w('The Blender', '€18', 'Ξηρός, Merlot — Μαύρο Καλαβρυτινό, Κτήμα Ακριώτου — Αιγιάλεια', 'Dry, Merlot — Mavro Kalavritino, Akriotou Microwinery — Aigialia', '€6'),
      wb('Αγιωργίτικο της Γαίας', 'Agiorgitiko of Gaia', '€24', 'Ξηρός, 100% Αγιωργίτικο, Κτήμα Γαία — Νεμέα', 'Dry, 100% Agiorgitiko, Gaia Estate — Nemea', '€7'),
      wb('Μέγα Σπήλαιο', 'Mega Spileo', '€27', 'Ξηρός, 100% Pinot Noir, Κτήμα Μέγα Σπήλαιο — Καλάβρυτα', 'Dry, 100% Pinot Noir, Mega Spileo Estate — Kalavrita'),
      w('M Barrique', '€30', 'Ξηρός, Μούχταρο — Merlot, Κτήμα Σαμαρτζή — Θήβα', 'Dry, Mouchtaro — Merlot, Samartzis Estate — Thiva'),
      wb('Alta Νάουσα', 'Alta Naousa', '€31', 'Ξηρός, 100% Ξινόμαυρο, Κτήμα Θυμιόπουλου — Νάουσα', 'Dry, 100% Xinomavro, Thimiopoulos Winery — Naousa'),
    ],
  },
  {
    titleEl: 'Πλατό Τυριών & Αλλαντικών',
    titleEn: 'Plate of Cold Cuts & Cheese',
    items: [
      bn('Πλατό Τυριών Αλλαντικών', 'Plate of Cold Cuts & Cheese', '€22'),
    ],
  },
];

// ─── Tab 1: All Day ───────────────────────────────────────────────────────────
const allDayTab: MenuTab = {
  key: 'allday',
  labelEl: 'All Day',
  labelEn: 'All Day',
  sections: [
    {
      titleEl: 'Καφέδες',
      titleEn: 'Coffee',
      items: [
        n('Espresso', '€3,50'),
        n('Espresso Doppio', '€3,80'),
        n('Espresso Freddo', '€4,00'),
        n('Espresso Freddo Grande', '€4,50'),
        n('Cappuccino', '€3,80'),
        n('Cappuccino Freddo', '€4,00'),
        n('Cappuccino Freddo Grande', '€4,70'),
        n('Americano', '€3,80'),
        n('Nescafe', '€3,50'),
        n('Nescafe Frappé', '€3,50'),
        bn('Φίλτρου', 'Filter Coffee', '€3,50'),
        bn('Ελληνικός', 'Greek Coffee', '€3,00'),
        bn('Ελληνικός Διπλός', 'Double Greek Coffee', '€3,50'),
      ],
    },
    {
      titleEl: 'Ροφήματα',
      titleEn: 'Beverages',
      subsections: [
        {
          items: [
            bn('Σοκολάτα Ζεστή', 'Hot Chocolate', '€4,50'),
            bn('Σοκολάτα Κρύα', 'Cold Chocolate', '€4,50'),
            bn('Λευκή Σοκολάτα Ζεστή', 'White Hot Chocolate', '€4,50'),
            d('Green Matcha Maiden Latte', '€5,00', 'Ζεστό ή κρύο', 'Hot or cold'),
            d('Golden Latte', '€4,50', 'Γάλα αμυγδάλου, κιτρινόριζα, μέλι', 'Almond milk, turmeric, honey'),
          ],
        },
        {
          titleEl: 'Τσάϊ Κρύο',
          titleEn: 'Iced Tea',
          items: [
            bd('YAMAS Πράσινο Τσάϊ Λεμόνι', 'YAMAS Green Tea Lemon & Honey', '€5,00', 'Πράσινο τσάϊ, εκχύλισμα μελιού, λεμόνι', 'Green tea, honey extract, lemon'),
            bd('YAMAS Πράσινο Τσάϊ Μάνγκο', 'YAMAS Green Tea Mango & Honey', '€5,00', 'Πράσινο τσάϊ, εκχύλισμα μελιού, μάνγκο', 'Green tea, honey extract, mango'),
            bd('YAMAS Matcha Yuzu', 'YAMAS Matcha Yuzu & Honey', '€5,00', 'Matcha, yuzu, μέλι', 'Matcha, yuzu, honey'),
          ],
        },
      ],
    },
    {
      titleEl: 'Φρέσκοι Χυμοί',
      titleEn: 'Fresh Juice',
      items: [
        d('Baby Orange', '€4,50', 'Φρέσκος χυμός πορτοκάλι', 'Fresh orange juice'),
        d('Tropical Mint', '€5,00', 'Ανανάς, μάνγκο, μήλο, μέντα', 'Pineapple, mango, apple, mint'),
        d('Watermelon Berry', '€6,00', 'Καρπούζι, ακτινίδιο, σταφύλι, φράουλα', 'Watermelon, kiwi, grape, strawberry'),
        d('Asian Mist (Detox)', '€6,00', 'Σέλινο, αγγούρι, μήλο, λεμόνι, τζίντζερ', 'Celery, cucumber, apple, lemon, ginger'),
        d('Red Planet (Detox)', '€6,00', 'Καρότο, πορτοκάλι, λεμόνι, μήλο, παντζάρι', 'Carrot, orange, lemon, apple, beetroot'),
      ],
    },
    {
      titleEl: 'Milkshake & Smoothies',
      titleEn: 'Milkshake & Smoothies',
      subsections: [
        {
          titleEl: 'Milkshake — €6,50',
          titleEn: 'Milkshake — €6.50',
          items: [
            bn('Βανίλια Μαδαγασκάρης', 'Madagascar Vanilla', '€6,50'),
            bn('Σοκολάτα', 'Chocolate', '€6,50'),
            bn('Φράουλα', 'Strawberry', '€6,50'),
          ],
        },
        {
          titleEl: 'Smoothies — €6,50',
          titleEn: 'Smoothies — €6.50',
          items: [
            d('Popeyes Strength', '€6,50', 'Σπανάκι, αγγούρι, ginger', 'Spinach, cucumber, ginger'),
            d('Sweet Energy', '€6,50', 'Φράουλα, passion fruit, μέλι', 'Strawberry, passion fruit, honey'),
            d('Yellow', '€6,50', 'Μάνγκο, μπανάνα, γάλα αμυγδάλου, passion fruit, κιτρινόριζα, καρύδια', 'Mango, banana, almond milk, passion fruit, turmeric, walnuts'),
            d('Acai', '€6,50', 'Acai, γάλα βρώμης, χουρμάδες, μπανάνα, πιπερόριζα, φυστίκι Αιγίνης', 'Acai, oat milk, dates, banana, ginger, pistachio'),
          ],
        },
      ],
    },
    {
      titleEl: 'Αναψυκτικά',
      titleEn: 'Soft Drinks',
      items: [
        n('Coca Cola / Zero', '€3,80'),
        n('Sprite', '€3,50'),
        bn('Σόδα', 'Soda', '€3,50'),
        bn('Τόνικ', 'Tonic Water', '€3,50'),
        bn('Fanta Πορτοκάλι / Μπλε', 'Fanta Orange / Blue', '€3,50'),
        bn('Fanta Λεμονάδα', 'Fanta Lemonade', '€3,50'),
        bn('Σπιτική Λεμονάδα Τζίντζερ', 'Homemade Ginger Lemonade', '€4,50'),
        bn('Σπιτική Λεμονάδα Τσίλι', 'Homemade Chili Lemonade', '€5,50'),
        bn('Νερό Αύρα 0,5l', 'Avra Water 0.5l', '€0,50'),
        bn('Νερό Αύρα 1l', 'Avra Water 1l', '€1,00'),
        bn('Ξινόνερο 0,25l', 'Carbonated Water 0.25l', '€3,00'),
        bn('Ξινόνερο 1l', 'Carbonated Water 1l', '€4,00'),
      ],
    },
    {
      titleEl: 'Ποτά & Μπύρες',
      titleEn: 'Drinks & Beers',
      subsections: [
        {
          titleEl: 'Ποτά',
          titleEn: 'Spirits',
          items: [
            bn('Ποτό Απλό', 'Simple Drink', '€8,00'),
            bn('Ποτό Σπέσιαλ', 'Special Drink', '€10,00'),
            bn('Ποτό Premium', 'Premium Drink', '€15,00'),
          ],
        },
        {
          titleEl: 'Παραδοσιακά Ποτά',
          titleEn: 'Traditional Drinks',
          items: [
            bn('Ούζο Καζανιστό 200ml', 'Ouzo Kazanisto 200ml', '€12,00'),
            bn('Τσίπουρο Ηδωνικό 200ml', 'Tsipouro Idoniko 200ml', '€12,00'),
          ],
        },
        {
          titleEl: 'Μπύρες',
          titleEn: 'Beers',
          items: [
            n('Stella Artois Draft 400ml', '€5,00'),
            bn('Νύμφη 330ml', 'Nymfi 330ml', '€5,50'),
            n('Corona', '€6,00'),
            n('Stella 0% alc.', '€5,00'),
            n('Noam 340ml', '€7,00'),
          ],
        },
      ],
    },
  ],
};

// ─── Tab 2: Cocktails ─────────────────────────────────────────────────────────
const cocktailsTab: MenuTab = {
  key: 'cocktails',
  labelEl: 'Cocktails',
  labelEn: 'Cocktails',
  sections: [
    {
      titleEl: 'Signature Cocktails',
      titleEn: 'Signature Cocktails',
      items: [
        d('Strawberry Sour', '€13', 'Bond gin, φράουλα, σύκο βαλσάμικο, vegan foam, Vermouth di Torino', 'Bond gin, strawberry, balsamic fig, vegan foam, Vermouth di Torino'),
        d('Pink Mellon', '€12', "Hendrick's Flora Adora, πεπόνι, αγγούρι, pimento paper", "Hendrick's Flora Adora, melon, cucumber, pimento paper"),
        d('The Magic Mango', '€12', 'Pampero blend, barley cordial, foam mango', 'Pampero blend, barley cordial, foam mango'),
        d('Apple Walker 3.0', '€12', 'Serkova Vodka, cordial πράσινο μήλο, blend πιπεριές, ginger', 'Serkova Vodka, cordial green apple, blend peppers, ginger'),
        d('Mastic Passion', '€14', 'Bond gin, πράσινο τσάϊ, passion fruit, καραμελωμένο γάλα, foam μαστίχα & ginger', 'Bond gin, green tea, passion fruit, caramelized milk, foam mastic and ginger'),
        d('Maniana Colada', '€13', 'Pampero blend, μπανάνα, καραμέλα, καρύδα, lime', 'Pampero blend, banana, caramel, coconut, lime'),
      ],
    },
    {
      titleEl: 'Χωρίς Αλκοόλ (0%)',
      titleEn: 'Non-Alcoholic (0%)',
      items: [
        d('0% Garibaldi', '€10', '0% bitter, orange oleo, fake foam', '0% bitter, orange oleo, fake foam'),
        d('0% Paloma', '€10', '0% Gin, lime, agave, grapefruit soda', '0% Gin, lime, agave, grapefruit soda'),
      ],
    },
    {
      titleEl: 'Spritz',
      titleEn: 'Spritz',
      items: [
        d('Summer Skin', '€10', 'Mastic Tears, Aperol, ροδάκινο, Fever Tree Pink Grapefruit Soda, Gancia Prosecco', "Mastic Tears, Aperol, peach, Fever Tree Pink Grapefruit Soda, Gancia Prosecco"),
        d('Aegean Spritz', '€10', "Otto's, amaro, μανταρίνι, lime, orange bitter soda", "Otto's, amaro, mandarin, lime, orange bitter soda"),
        d('Kea Cobbler', '€10', 'Aperol, ανανάς, Fever Tree Indian Tonic, elderflower syrup', 'Aperol, pineapple, Fever Tree Indian Tonic, elderflower syrup'),
      ],
    },
    {
      titleEl: 'Gin & Tonic',
      titleEn: 'Gin & Tonic',
      items: [
        d('Gin & Tonic I', '€13', 'Silent Pool, Fever Tree Indian Tonic, ginger pickle', 'Silent Pool, Fever Tree Indian Tonic, ginger slice pickle'),
        d('Gin & Tonic II', '€13', 'Grace, Fever Tree Mediterranean Tonic, peach pickle', 'Grace, Fever Tree Mediterranean Tonic, peach pickle'),
        d('Gin & Tonic III', '€13', "Hendrick's, Fever Tree Tonic, olive pickle", "Hendrick's, Fever Tree Tonic, olive pickle"),
      ],
    },
    {
      titleEl: 'Κλασικά',
      titleEn: 'Classics',
      items: [
        d('Dry Martini', '€14', 'Blend gin, blend white vermouth, ντοματίνι τουρσί', 'Blend gin, blend white vermouth, pickle tomato'),
        d('Negroni', '€13', 'Blend gin, blend red vermouth, Campari', 'Blend gin, blend red vermouth, Campari'),
        d('Bloody Mary', '€12', 'Serkova Vodka, ντομάτα, σέλινο, πιπεριές', 'Serkova Vodka, tomato, celery, peppers'),
        d('Espresso Martini', '€13', 'Belvedere dirty brew coffee, house coffee liqueur', 'Belvedere dirty brew coffee, house coffee liqueur'),
      ],
    },
  ],
};

// ─── Tab 3: Sushi ─────────────────────────────────────────────────────────────
const sushiTab: MenuTab = {
  key: 'sushi',
  labelEl: 'Sushi',
  labelEn: 'Sushi',
  sections: [
    {
      titleEl: 'Ορεκτικά & Σαλάτες',
      titleEn: 'Starters & Salads',
      items: [
        d('Edamame Classic', '€7', 'Ανθός αλατιού, lime', 'Sea salt, lime'),
        d('Edamame Spicy', '€8', 'Chili garlic, lime', 'Chili garlic, lime'),
        d('Wakame Salad', '€9', 'Κόκκινο τσίλι, dressing σουσαμιού, ponzu oil, φύτρες', 'Red chili, sesame dressing, ponzu oil, cress'),
      ],
    },
    {
      titleEl: 'Sashimi (3 τεμ.) & Nigiri (2 τεμ.)',
      titleEn: 'Sashimi (3 pcs) & Nigiri (2 pcs)',
      items: [
        bd('Σολομός (Sake)', 'Salmon (Sake)', 'Sashimi €7 · Nigiri €8', 'Nigiri topping: κρέμα αβοκάντο, αυγά σολομού', 'Nigiri topping: avocado cream, salmon roe'),
        bd('Τόνος (Maguro)', 'Tuna (Maguro)', 'Sashimi €8 · Nigiri €8', 'Nigiri topping: kizami wasabi', 'Nigiri topping: kizami wasabi'),
        bd('Λαβράκι (Suzuki)', 'Sea Bass (Suzuki)', 'Sashimi €6 · Nigiri €8', 'Nigiri topping: μαγιονέζα yuzu kosho, πέρλες yuzu', 'Nigiri topping: yuzu kosho mayo, yuzu pearls'),
      ],
    },
    {
      titleEl: 'Donburi',
      titleEn: 'Donburi',
      items: [
        { nameEl: 'Chirashi', nameEn: 'Chirashi', price: '€16', descEl: 'Ρύζι, πίκλα ginger, τόνος, σολομός, hamachi, λαβράκι, shiso, αγγούρι, αβοκάντο, αυγά σολομού, chirashi dressing', descEn: 'Rice, pickled ginger, tuna, salmon, hamachi, sea bass, shiso, cucumber, avocado, salmon roe, chirashi dressing', image: '/images/food/donburi.webp' },
      ],
    },
    {
      titleEl: 'Sushi Rolls',
      titleEn: 'Sushi Rolls',
      items: [
        bd('Fried Sake (5 τεμ.)', 'Fried Sake (5 pcs)', '€16', 'Μέσα: σολομός, σπαράγγι, takuan, αρωματική κρέμα — Πάνω: μαγιονέζα chili yuzu, ταρτάρ σολομού, πέρλες yuzu, unagi sauce', 'Inside: salmon, asparagus, takuan, aromatic cream — Top: chili yuzu mayo, salmon tartare, yuzu pearls, unagi sauce'),
        { nameEl: 'Kani (6 τεμ.)', nameEn: 'Kani (6 pcs)', price: '€16', descEl: 'Μέσα: μπλε καβούρι, πίκλα αγγούρι, αβοκάντο — Πάνω: orange tobiko, μαύρο σκόρδο, μαγιονέζα yuzu kosho, καμένο κουνουπίδι, σκόνη lime', descEn: 'Inside: blue crab, pickled cucumber, avocado — Top: orange tobiko, black garlic, yuzu kosho mayo, burnt cauliflower, lime powder', image: '/images/food/kani.jpg' },
        { nameEl: 'Kyuri (5 τεμ.)', nameEn: 'Kyuri (5 pcs)', price: '€15', descEl: 'Μέσα: αγγούρι — Πάνω: ταρτάρ σολομού, σπαράγγι, shiso, takana, κρέμα χρένου, αυγά σολομού, φύτρες', descEn: 'Inside: cucumber — Top: salmon tartare, asparagus, shiso, takana, horseradish cream, salmon roe, cress', image: '/images/food/kyuri.webp' },
        { nameEl: 'Spicy Maguro (6 τεμ.)', nameEn: 'Spicy Maguro (6 pcs)', price: '€14', descEl: 'Μέσα: σουσάμι kimchi — Πάνω: ταρτάρ τόνου, φρέσκο κρεμμύδι, yuzu tobiko, takuan, μαγιονέζα chili yuzu, κόκκινο τσίλι', descEn: 'Inside: kimchi sesame — Top: tuna tartare, fresh onion, yuzu tobiko, takuan, chili yuzu mayo, red chili', image: '/images/food/spicy-maguro.webp' },
        { nameEl: 'Hamachi Jalapeño (6 τεμ.)', nameEn: 'Hamachi Jalapeño (6 pcs)', price: '€18', descEl: 'Μέσα: αβοκάντο, μαγιονέζα τρούφας, φρέσκια τρούφα — Πάνω: ταρτάρ hamachi, takana, takuan, jalapeño dressing, μαύρο σκόρδο, λάδι κόκκινου τσίλι', descEn: 'Inside: avocado, truffle mayo, fresh truffle — Top: hamachi tartare, takana, takuan, jalapeño dressing, black garlic, chili oil', image: '/images/food/hamachi-jalapeno.jpg' },
        bd('Ebi (5 τεμ.)', 'Ebi (5 pcs)', '€16', 'Μέσα: γαρίδα tempura, πίκλα καρότο — Πάνω: crispy tomato furikake, κρέμα αβοκάντο, τοματίνι, ανθός αλατιού, aji ponzu dressing, εσαλότ', 'Inside: prawn tempura, pickled carrot — Top: crispy tomato furikake, avocado cream, cherry tomato, sea salt, aji ponzu dressing, shallot'),
        { nameEl: 'Vegetarian (5 τεμ.)', nameEn: 'Vegetarian (5 pcs)', price: '€12', descEl: 'Μέσα: shiso, takuan, takana, φρέσκο κρεμμύδι, enoki, αβοκάντο, σπαράγγι — Πάνω: σκόνη πιπεριάς Φλωρίνης, μαγιονέζα τρούφας, kale', descEn: 'Inside: shiso, takuan, takana, fresh onion, enoki, avocado, asparagus — Top: Florina pepper powder, truffle mayo, kale', image: '/images/food/vegetarian.webp' },
      ],
    },
  ],
};

// ─── Tab 4: Cuisine ───────────────────────────────────────────────────────────
const cuisineTab: MenuTab = {
  key: 'cuisine',
  labelEl: 'Κουζίνα',
  labelEn: 'Cuisine',
  sections: [
    {
      titleEl: 'Ορεκτικά',
      titleEn: 'Appetizers',
      items: [
        bn('Ψωμί & Ντιπ ημέρας', 'Bread & Dip of the day', '€1,50'),
        bd('Σεβίτσε Λαβράκι', 'Sea Bass Ceviche', '€16', 'Ζύμωση εσπεριδοειδών, lime, τσίλι πιπεριά, τζελ λεμόνι', 'Fermented citrus, lime, chili pepper, lemon gel'),
        bd('Ταρτάρ Μοσχάρι', 'Beef Tartare', '€16', 'Κάπαρη, πίκλα αγγούρι, κρεμμύδι, σάλτσα σόγια, μαγιονέζα', 'Caper, pickled cucumber, onion, soy sauce, mayo'),
        bd('Νιόκι με Μοσχάρι', 'Gnocchi with Beef', '€14', 'Κρέμα Γκοργκοντζόλα, ταρτάρ μοσχαριού, κουκουνάρι', 'Gorgonzola cream, beef tartare, pine nut'),
      ],
    },
    {
      titleEl: 'Σαλάτες',
      titleEn: 'Salads',
      items: [
        bd('Του Καίσαρα', "Caesar's", '€13', 'Αφράτο μαρούλι, τραγανό κοτόπουλο, μπέικον, κρουτόν, καλαμπόκι, παρμεζάνα', 'Fluffy lettuce, crispy chicken, bacon, croutons, corn, parmesan'),
        d('Burrata', '€13', 'Ντοματίνια, πέστο βασιλικού, τριμμένη ντομάτα, βασιλικός, κουκουνάρι, προσούτο', 'Cherry tomatoes, basil pesto, grated tomato, basil, pine nut, prosciutto'),
        bd('Πράσινη Σαλάτα', 'Green Salad', '€13,50', 'Γαρίδες ψητές, αβοκάντο, ρόδι, κουκουνάρι, κατσικίσιο τυρί, βαλσάμικο', 'Grilled shrimps, avocado, pomegranate, pine nut, goat cheese, balsamic vinegar'),
      ],
    },
    {
      titleEl: 'Κυρίως Πιάτα',
      titleEn: 'Main Courses',
      items: [
        { nameEl: 'Ριγκατόνι Κοτόπουλο', nameEn: 'Chicken Rigatoni', price: '€16,50', descEl: 'Γκουαντσιάλε, πολύχρωμες πιπεριές, μανιτάρια, κρέμα παρμεζάνας, ξύσμα λεμόνι', descEn: 'Guanciale, colorful peppers, mushrooms, parmesan cream, lemon zest', image: '/images/food/rigatoni-chicken.jpg' },
        bd('Κριθαρότο Μανιταριών', 'Orzo with Mushrooms', '€15,50', 'Βασιλομανίταρα, σιτάκε, τρούφα, παλαιωμένη παρμεζάνα', 'King mushrooms, shiitake, truffle, aged parmesan'),
        bd('Μανέστρα', 'Orzo with Beef Ribs', '€17', 'Σιδηρόδρομος μοσχαρίσιος, κρέμα μετσοβόνε, μυρώνι', 'Beef ribs, metsovone cream, chervil'),
        d('Cacio e Pepe', '€16', 'Χειροποίητο λιγκουίνι, κρέμα πεκορίνο, μοσχαρίσια φιλετάκια', 'Handmade linguine, pecorino cream, beef fillets'),
        bd('Σολομός Σχάρας', 'Grilled Salmon', '€23', 'Κρέμα σελινόριζας, αρακάς, σάλτσα λεμονοθύμαρο', 'Celeriac cream, peas, lemon thyme sauce'),
        bd('Rib-Eye Αμερικής 300g', 'Rib-Eye USA 300g', '€37', 'Σερβίρεται με λαχανικά σχάρας ή πατάτες τηγανιτές', 'Served with grilled vegetables or fried potatoes'),
      ],
    },
    {
      titleEl: 'Γλυκά',
      titleEn: 'Desserts',
      items: [
        bd('Προφιτερόλ', 'Profiterole', '€9', 'Κρέμα ζαχαροπλαστικής, μους σοκολάτας γάλακτος, σάλτσα σοκολάτας, φουντούκι', 'Pâtisserie cream, milk chocolate mousse, chocolate sauce, hazelnut'),
        bd('Τιραμισού', 'Tiramisu', '€9', 'Κρέμα τυριών, σαμπαγιόν καφέ, σαβαγιάρ', 'Cream cheese, coffee sabayon, savoiardi'),
        bd('Λεμονόπιτα', 'Lemon Pie', '€9', 'Κράμπλ, κρέμα λεμόνι, μαρέγκα', 'Crumble, lemon cream, meringue'),
      ],
    },
  ],
};

// ─── Tab 5: Wines (πλέον ξεχωριστή καρτέλα) ───────────────────────────────────
const winesTab: MenuTab = {
  key: 'wines',
  labelEl: 'Κρασιά',
  labelEn: 'Wines',
  sections: wineListSections,
};

export const menuTabs: MenuTab[] = [allDayTab, cocktailsTab, sushiTab, cuisineTab, winesTab];
