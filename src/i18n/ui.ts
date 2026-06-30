import { site } from '../lib/site';

export type Lang = 'el' | 'en';

// ─────────────────────────────────────────────────────────────────────────────
//  UI STRINGS (δίγλωσσα EL/EN) — κείμενα διεπαφής & marketing/SEO copy.
//
//  Τα ΣΤΟΙΧΕΙΑ ΤΗΣ ΕΠΙΧΕΙΡΗΣΗΣ (brand, τόπος, ωράριο, τηλέφωνο, νομικά) ΔΕΝ
//  γράφονται hardcoded εδώ — διαβάζονται από το κεντρικό config (src/lib/site.ts)
//  μέσω των παρακάτω aliases. Έτσι μια αλλαγή στο site.ts ενημερώνει ταυτόχρονα
//  και τα κείμενα. Ό,τι απομένει εδώ είναι αμιγώς κείμενο (περιεχόμενο) — το
//  αλλάζεις ανά πελάτη όταν κλωνοποιείς το template (δες TEMPLATE.md).
// ─────────────────────────────────────────────────────────────────────────────
const brand = site.brand.name;
const addr = site.address;
const hrs = site.hours;
const phone = site.contact.phoneDisplay;

export const ui = {
  el: {
    // NAV
    'nav.home': 'Αρχική',
    'nav.menu': 'Μενού',
    'nav.about': 'Σχετικά',
    'nav.contact': 'Επικοινωνία',
    'nav.reserve': 'Κράτηση',
    'nav.lang': 'EN',
    'a11y.skip': 'Μετάβαση στο περιεχόμενο',

    // HOME SEO
    'home.seo.title': `${brand} — All Day Cuisine & Bar | ${addr.cityEl}, ${addr.regionEl}`,
    'home.seo.desc': `Το ${brand} είναι το all day cuisine bar στην ${addr.areaEl}, ${addr.cityEl}. Brunch, sushi, cocktails, smoothies και πολλά άλλα. Ανοιχτοί καθημερινά από το πρωί μέχρι αργά.`,

    // HERO
    'hero.eyebrow': `${addr.areaEl} · ${addr.cityEl} · ${addr.regionEl}`,
    'hero.title1': 'Εκεί που η μέρα',
    'hero.title2': 'ξεδιπλώνεται',
    'hero.subtitle':
      'All day cuisine & bar — brunch, sushi, cocktails και πολλά άλλα, στην καρδιά της Κέας.',
    'hero.cta1': 'Δείτε το Μενού',
    'hero.cta2': 'Βρείτε μας',
    'hero.scroll': 'Κάτω',

    // ABOUT STRIP (home)
    'home.about.eyebrow': 'Η ιστορία μας',
    'home.about.title1': 'Ένα μέρος για να μείνεις',
    'home.about.title2': 'λίγο παραπάνω',
    'home.about.text': `Ένας χώρος για ντόπιους και ταξιδιώτες — καλή κουζίνα, τίμια ποτά, σωστή ατμόσφαιρα.`,
    'home.about.cta': 'Η ιστορία μας',

    // EVENTS SECTION
    'home.events.eyebrow': 'Εκδηλώσεις',
    'home.events.title': 'Αναλαμβάνουμε\nιδιωτικές εκδηλώσεις',
    'home.events.text': 'Γενέθλια, εταιρικά γεύματα, οικογενειακές στιγμές — αναλαμβάνουμε κάθε λεπτομέρεια.',
    'home.events.cta': 'Επικοινωνήστε μαζί μας',

    // BAR SECTION
    'home.bar.eyebrow': 'Το bar μας',
    'home.bar.title': 'Από το πρώτο καφέ\nμέχρι το τελευταίο cocktail',
    'home.bar.text': 'Κάθε ποτό φτιάχνεται με την ίδια φροντίδα που δίνουμε στο φαγητό.',

    // AMBIANCE SECTION
    'home.ambiance.title': 'Ένα τραπέζι σε περιμένει',
    'home.ambiance.sub': 'Κρατήστε θέση για απόψε',

    // SERVICES
    'svc.brunch.title': 'Brunch',
    'svc.brunch.desc': 'Αυγά, granola, avocado toast.',
    'svc.sushi.title': 'Sushi',
    'svc.sushi.desc': 'Φρέσκα rolls με premium υλικά.',
    'svc.lunch.title': 'Μεσημέρι & Βράδυ',
    'svc.lunch.desc': 'Μεσογειακές γεύσεις, μοντέρνα ματιά.',
    'svc.cocktails.title': 'Cocktails',
    'svc.cocktails.desc': 'House cocktails, κρασιά & smoothies.',

    // REVIEWS
    'reviews.eyebrow': 'Τι λένε οι επισκέπτες',
    'reviews.title1': 'Αγαπημένο από ντόπιους',
    'reviews.title2': '& ταξιδιώτες',
    'reviews.google': 'κριτικές στο Google',
    'reviews.guide': 'Τοπικός Οδηγός',

    // GALLERY
    'gallery.eyebrow': 'Ατμόσφαιρα',
    'gallery.title1': 'Ο χώρος μιλά',
    'gallery.title2': 'μόνος του',

    // HOME CTA
    'cta.title': 'Έτοιμοι για μια υπέροχη μέρα;',
    'cta.subtitle': 'Brunch, μεσημεριανό, δείπνο ή ποτά — είμαστε ανοιχτοί όλη μέρα.',
    'cta.call': 'Καλέστε για κράτηση',
    'cta.menu': 'Δείτε το μενού',

    // INFO STRIP
    'info.location.label': 'Τοποθεσία',
    'info.location.val': addr.line1El,
    'info.location.sub': 'Κυκλάδες, Ελλάδα',
    'info.hours.label': 'Ώρες',
    'info.hours.val': hrs.display,
    'info.hours.sub': hrs.noteEl,
    'info.res.label': 'Κρατήσεις',
    'info.res.sub': 'Τηλεφωνικά ή χωρίς κράτηση',

    // MENU PAGE
    'menu.seo.title': `Μενού — ${brand} ${addr.cityEl} | Brunch, Sushi, Cocktails & Άλλα`,
    'menu.seo.desc': `Το μενού του ${brand} — all day brunch, φρέσκο sushi, craft cocktails, smoothie bowls και επιδόρπια στην ${addr.areaEl}, ${addr.cityEl}.`,
    'menu.eyebrow': `${addr.cityEl}, ${addr.regionEl}`,
    'menu.title': 'Το Μενού μας',
    'menu.subtitle': 'Από το πρωί μέχρι τα μεσάνυχτα — και τα πάντα ενδιάμεσα',
    'menu.disclaimer': [
      'Σε περίπτωση αλλεργίας σε κάποιο προϊόν, παρακαλούμε επικοινωνήστε με τον υπεύθυνο ή τον Chef του καταστήματος.',
      'Το κατάστημα υποχρεούται στην έκδοση αποδείξεων λιανικών συναλλαγών. Ο καταναλωτής δεν έχει υποχρέωση να πληρώσει αν δεν λάβει το νόμιμο παραστατικό (απόδειξη-τιμολόγιο).',
      'Οι τιμές περιλαμβάνουν όλες τις νόμιμες επιβαρύνσεις.',
      'Απαγορεύεται η κατανάλωση οινοπνευματωδών ποτών από άτομα κάτω των 18 ετών.',
      'Τα εδέσματα με την ένδειξη (*) είναι κατεψυγμένα.',
      'Το λάδι που χρησιμοποιείται στις σαλάτες μας είναι αγνό παρθένο ελαιόλαδο. Τηγανίζουμε με ηλιέλαιο.',
      `Αγορανομικός υπεύθυνος: ${site.legal.marketSupervisorEl}.`,
    ].join('\n'),
    'menu.note.eyebrow': 'Σημείωση',
    'menu.cta.title': 'Ελάτε να γευτείτε',
    'menu.cta.subtitle': hrs.summaryEl,
    'menu.cta.btn': `Καλέστε μας: ${phone}`,

    // ABOUT PAGE
    'about.seo.title': `Σχετικά — ${brand} ${addr.cityEl} | Η Ιστορία μας`,
    'about.seo.desc': `Το ${brand} ιδρύθηκε το 2021 στην ${addr.areaEl}, ${addr.cityEl}. Μάθετε για τη φιλοσοφία, τον χώρο και τους ανθρώπους πίσω από το all day cuisine bar.`,
    'about.eyebrow': `Ιδρ. 2021 · ${addr.cityEl}`,
    'about.title': 'Η Ιστορία μας',
    'about.subtitle': 'Ένας χώρος γεννημένος από αγάπη για καλό φαγητό και ζωή στο νησί',
    'about.who.eyebrow': 'Ποιοι είμαστε',
    'about.who.title': 'Καλώς ήρθατε στον οίκο μας',
    'about.who.text1':
      'Στο λιμανάκι της Κορρησίας — όχι απλά εστιατόριο, αλλά ένας τόπος όπου νιώθεις άνετα από τον πρώτο καφέ μέχρι το τελευταίο cocktail.',
    'about.who.text2':
      'Από το 2021 — γιατί κάθε ώρα της ημέρας αξίζει να τη ζεις καλά.',
    'about.stat1.label': 'Χρονιά ίδρυσης',
    'about.stat2.val': '20ω',
    'about.stat2.label': 'Ανοιχτοί καθημερινά',
    'about.stat3.val': addr.cityEl,
    'about.stat3.label': 'Το νησί μας',
    'about.phil.eyebrow': 'Φιλοσοφία μας',
    'about.phil.title1': 'Ποιότητα από το πρωί',
    'about.phil.title2': 'μέχρι τα μεσάνυχτα',
    'about.phil.text1':
      'Brunch στις 10 ή sushi τα μεσάνυχτα — κάθε πιάτο παίρνει την ίδια προσοχή. Τοπικά υλικά, πάθος στο μαγείρεμα, πάντα.',
    'about.phil.text2':
      'Brunch classics, ιαπωνικό sushi, μεσογειακά κυρίως, cocktails του Αιγαίου — σκόπιμα διαφορετικά.',
    'about.kitchen.eyebrow': 'Η κουζίνα μας',
    'about.kitchen.title': 'Μαγειρεύουμε με πάθος',
    'about.kitchen.text1':
      'Μαγειρεύουμε από την αρχή, κάθε μέρα — με τοπικά υλικά και μεράκι.',
    'about.kitchen.text2':
      'Δουλεύουμε με εποχιακά υλικά, προτιμάμε τους τοπικούς παραγωγούς, και δεν κόβουμε γωνίες. Αυτό το βλέπεις στο πιάτο.',
    'about.space.eyebrow': 'Ο χώρος',
    'about.space.title': 'Σχεδιασμένος για να μείνεις',
    'about.space.text': `Ο χώρος του ${brand} συνδυάζει τη ζεστασιά της κυκλαδίτικης αρχιτεκτονικής με μια σύγχρονη, χαλαρή αισθητική. Τοξωτές πόρτες, ζεστό ξύλο και απαλός φωτισμός σε προσκαλούν να καθίσεις και να ξεχάσεις την ώρα. Διαθέτουμε εσωτερικό χώρο και βεράντα για τα ιδανικά βράδια της Κέας.`,
    'about.cta.title': 'Ελάτε να μας βρείτε',
    'about.cta.subtitle': `${addr.line1El} — Ανοιχτοί καθημερινά, ${hrs.display}`,
    'about.cta.dir': 'Πού είμαστε',
    'about.cta.menu': 'Δείτε το μενού',

    // CONTACT PAGE
    'contact.seo.title': `Επικοινωνία & Πού μας Βρείτε — ${brand} ${addr.cityEl}`,
    'contact.seo.desc': `Βρείτε το ${brand} στην ${addr.areaEl}, ${addr.cityEl}. Ώρες λειτουργίας, τηλέφωνο, διεύθυνση και χάρτης. ${hrs.summaryEl}.`,
    'contact.eyebrow': `${addr.areaEl} · ${addr.cityEl} · ${addr.countryEl}`,
    'contact.title': 'Βρείτε μας',
    'contact.subtitle': 'Εδώ κάθε μέρα — ελάτε όπως είστε',
    'contact.address.label': 'Διεύθυνση',
    'contact.address.val': addr.line1El,
    'contact.address.sub': addr.line2El,
    'contact.phone.label': 'Τηλέφωνο',
    'contact.phone.sub': 'Καλέστε για κράτηση',
    'contact.email.label': 'Email',
    'contact.ig.label': 'Instagram',
    'contact.hours.label': 'Ώρες Λειτουργίας',
    'contact.hours.mon': 'Δευτέρα',
    'contact.hours.tue': 'Τρίτη',
    'contact.hours.wed': 'Τετάρτη',
    'contact.hours.thu': 'Πέμπτη',
    'contact.hours.fri': 'Παρασκευή',
    'contact.hours.sat': 'Σάββατο',
    'contact.hours.sun': 'Κυριακή',
    'contact.here.label': 'Πώς να φτάσετε',
    'contact.here.text': `Στην Κορρησία (Λιβάδι), το κεντρικό λιμάνι της Κέας. Ferry από Λαυρεωτική (~1 ώρα) — λίγα βήματα από το λιμάνι.`,
    'contact.cta.title': 'Τα λέμε σύντομα',
    'contact.cta.subtitle': 'Χωρίς κράτηση; Ελάτε ανεξάρτητα.',
    'contact.cta.btn': `Καλέστε: ${phone}`,

    // FOOTER
    'footer.nav': 'Πλοήγηση',
    'footer.find': 'Βρείτε μας',
    'footer.copyright': `${brand} ${addr.cityEl}. Όλα τα δικαιώματα διατηρούνται.`,
  },

  en: {
    // NAV
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.reserve': 'Reserve a Table',
    'nav.lang': 'ΕΛ',
    'a11y.skip': 'Skip to content',

    // HOME SEO
    'home.seo.title': `${brand} — All Day Cuisine & Bar | ${addr.cityEn}, ${addr.regionEn}`,
    'home.seo.desc': `${brand} is an all day cuisine bar in ${addr.areaEn}, ${addr.cityEn}. Brunch, sushi, cocktails, smoothies and more. Open daily from morning to late night.`,

    // HERO
    'hero.eyebrow': `${addr.areaEn} · ${addr.cityEn} · ${addr.regionEn}`,
    'hero.title1': 'Where the day',
    'hero.title2': 'unfolds',
    'hero.subtitle':
      'All day cuisine & bar — brunch, sushi, cocktails and more, steps from the sea in Kéa.',
    'hero.cta1': 'Explore Menu',
    'hero.cta2': 'Find us',
    'hero.scroll': 'Scroll',

    // ABOUT STRIP (home)
    'home.about.eyebrow': 'Our story',
    'home.about.title1': 'A place to stay',
    'home.about.title2': 'a little longer',
    'home.about.text': `A gathering place for islanders and travellers — good food, honest drinks, the right atmosphere.`,
    'home.about.cta': 'Our story',

    // EVENTS SECTION
    'home.events.eyebrow': 'Private events',
    'home.events.title': 'We host\nprivate events',
    'home.events.text': 'Birthdays, corporate dinners, family gatherings — every detail taken care of.',
    'home.events.cta': 'Get in touch',

    // BAR SECTION
    'home.bar.eyebrow': 'The bar',
    'home.bar.title': 'From the first coffee\nto the last cocktail',
    'home.bar.text': 'Every drink made with the same care we put into the food.',

    // AMBIANCE SECTION
    'home.ambiance.title': 'A table is waiting for you',
    'home.ambiance.sub': 'Reserve your spot for tonight',

    // SERVICES
    'svc.brunch.title': 'Brunch',
    'svc.brunch.desc': 'Eggs, granola bowls, avocado toast — mornings on the island.',
    'svc.sushi.title': 'Sushi',
    'svc.sushi.desc': 'Fresh rolls with premium ingredients, every day.',
    'svc.lunch.title': 'Lunch & Dinner',
    'svc.lunch.desc': 'Mediterranean flavours with a modern touch.',
    'svc.cocktails.title': 'Cocktails',
    'svc.cocktails.desc': 'House cocktails, natural wines, smoothies — from noon till late.',

    // REVIEWS
    'reviews.eyebrow': 'What guests say',
    'reviews.title1': 'Loved by islanders',
    'reviews.title2': '& travellers',
    'reviews.google': 'reviews on Google',
    'reviews.guide': 'Local Guide',

    // GALLERY
    'gallery.eyebrow': 'Atmosphere',
    'gallery.title1': 'The space speaks',
    'gallery.title2': 'for itself',

    // HOME CTA
    'cta.title': 'Ready for a great day?',
    'cta.subtitle': "Brunch, lunch, dinner, or drinks — we're open all day.",
    'cta.call': 'Call to reserve',
    'cta.menu': 'View menu',

    // INFO STRIP
    'info.location.label': 'Location',
    'info.location.val': addr.line1En,
    'info.location.sub': 'Cyclades, Greece',
    'info.hours.label': 'Hours',
    'info.hours.val': hrs.display,
    'info.hours.sub': hrs.noteEn,
    'info.res.label': 'Reservations',
    'info.res.sub': 'Call or walk in',

    // MENU PAGE
    'menu.seo.title': `Menu — ${brand} ${addr.cityEn} | Brunch, Sushi, Cocktails & More`,
    'menu.seo.desc': `Explore the ${brand} menu — all day brunch, fresh sushi, craft cocktails, smoothie bowls, and desserts in ${addr.areaEn}, ${addr.cityEn}.`,
    'menu.eyebrow': `${addr.cityEn}, ${addr.regionEn}`,
    'menu.title': 'Our Menu',
    'menu.subtitle': 'From morning to midnight — everything in between',
    'menu.disclaimer': [
      'If you are allergic to any product, please speak to the Manager or the Chef of the restaurant.',
      'The restaurant is legally required to issue receipts in retail trade. The customer is not obliged to pay if they do not receive the legal document (receipt-invoice).',
      'Prices include all taxes.',
      'Persons under the age of 18 are prohibited from consuming alcoholic beverages.',
      'Dishes marked with (*) are frozen.',
      'The oil used in our salads is pure virgin olive oil. Sunflower seed oil is used for frying.',
      `Market supervisor: ${site.legal.marketSupervisorEn}.`,
    ].join('\n'),
    'menu.note.eyebrow': 'Note',
    'menu.cta.title': 'Come taste for yourself',
    'menu.cta.subtitle': hrs.summaryEn,
    'menu.cta.btn': `Call us: ${phone}`,

    // ABOUT PAGE
    'about.seo.title': `About — ${brand} ${addr.cityEn} | Our Story & Philosophy`,
    'about.seo.desc': `${brand} was born in 2021 in ${addr.areaEn}, ${addr.cityEn}. Learn about our philosophy, the space, and the people behind the all day cuisine bar.`,
    'about.eyebrow': `Est. 2021 · ${addr.cityEn}`,
    'about.title': 'Our Story',
    'about.subtitle': 'A place born from the love of good food and island life',
    'about.who.eyebrow': 'Who we are',
    'about.who.title': `${brand} means home`,
    'about.who.text1':
      "Oikos means home in Greek — and that's what we set out to build. Not just a restaurant, but a space where you feel at ease from your first coffee to your last cocktail.",
    'about.who.text2':
      'Opened in 2021 in the harbour of Korrisia, Kéa. Because every hour of the day deserves good food and good company.',
    'about.stat1.label': 'Year we opened',
    'about.stat2.val': '20h',
    'about.stat2.label': 'Open daily',
    'about.stat3.val': addr.cityEn,
    'about.stat3.label': 'Our home island',
    'about.phil.eyebrow': 'Our philosophy',
    'about.phil.title1': 'Quality from morning',
    'about.phil.title2': 'to midnight',
    'about.phil.text1':
      'Brunch at 10am or sushi at midnight — every dish gets the same attention. Local ingredients, cooked with intention.',
    'about.phil.text2':
      'Brunch classics, Japanese sushi, Mediterranean mains, Aegean cocktails — different by design.',
    'about.kitchen.eyebrow': 'Our kitchen',
    'about.kitchen.title': 'Cooked with passion',
    'about.kitchen.text1':
      'Cooked from scratch, every day — local ingredients, real care.',
    'about.kitchen.text2':
      'We work with seasonal produce, favour local suppliers, and don\'t cut corners. You taste it in every plate.',
    'about.space.eyebrow': 'The space',
    'about.space.title': 'Designed to linger',
    'about.space.text': `The ${brand} space blends the warmth of Cycladic stone architecture with a contemporary, unpretentious sensibility. Arched doorways, warm wood, and soft lighting invite you to sit down and forget the time. We have indoor seating and a terrace for when the Kéa evenings are at their best.`,
    'about.cta.title': 'Come and see us',
    'about.cta.subtitle': `${addr.line1En} — open every day, ${hrs.opens} to ${hrs.closes}`,
    'about.cta.dir': 'Get directions',
    'about.cta.menu': 'See the menu',

    // CONTACT PAGE
    'contact.seo.title': `Contact & Find Us — ${brand} ${addr.cityEn}`,
    'contact.seo.desc': `Find ${brand} in ${addr.areaEn}, ${addr.cityEn}. Opening hours, phone number, address and map. We're open every day from ${hrs.opens} to ${hrs.closes}.`,
    'contact.eyebrow': `${addr.areaEn} · ${addr.cityEn} · ${addr.countryEn}`,
    'contact.title': 'Find Us',
    'contact.subtitle': "We're here every day — come as you are",
    'contact.address.label': 'Address',
    'contact.address.val': addr.line1En,
    'contact.address.sub': addr.line2En,
    'contact.phone.label': 'Phone',
    'contact.phone.sub': 'Call to reserve a table',
    'contact.email.label': 'Email',
    'contact.ig.label': 'Instagram',
    'contact.hours.label': 'Opening Hours',
    'contact.hours.mon': 'Monday',
    'contact.hours.tue': 'Tuesday',
    'contact.hours.wed': 'Wednesday',
    'contact.hours.thu': 'Thursday',
    'contact.hours.fri': 'Friday',
    'contact.hours.sat': 'Saturday',
    'contact.hours.sun': 'Sunday',
    'contact.here.label': 'Getting here',
    'contact.here.text': `In Korrisia (Livadi), Kéa's main port. Ferry from Lavrio, Athens (approx. 1 hour) — steps from the dock.`,
    'contact.cta.title': 'See you soon',
    'contact.cta.subtitle': 'No booking? Walk-ins always welcome.',
    'contact.cta.btn': `Call: ${phone}`,

    // FOOTER
    'footer.nav': 'Navigate',
    'footer.find': 'Find us',
    'footer.copyright': `${brand} ${addr.cityEn}. All rights reserved.`,
  },
} as const;

export type UIKeys = keyof (typeof ui)['el'];
