// ─────────────────────────────────────────────────────────────────────────────
//  ΚΕΝΤΡΙΚΟ CONFIG ΕΠΙΧΕΙΡΗΣΗΣ — ΜΙΑ ΠΗΓΗ ΑΛΗΘΕΙΑΣ
// ─────────────────────────────────────────────────────────────────────────────
//  Όλα τα στοιχεία ταυτότητας/επικοινωνίας της επιχείρησης ζουν ΕΔΩ και μόνο εδώ.
//  Κανένα τηλέφωνο/email/διεύθυνση/social/νομικό δεν επαναλαμβάνεται hardcoded στα
//  components ή στο layout — όλα διαβάζονται από το `site`.
//
//  ▶ TEMPLATE: για νέο εστιατόριο, άλλαξε ΜΟΝΟ τις τιμές αυτού του αρχείου
//    (μαζί με τα design tokens στο src/styles/global.css και το περιεχόμενο στο
//    src/i18n/ui.ts). Δες TEMPLATE.md.
//
//  Σύμβαση: κάθε κείμενο που διαφέρει ανά γλώσσα έχει κατάληξη `El` / `En`.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  // ── Brand / ταυτότητα ──────────────────────────────────────────────────────
  brand: {
    name: 'OIKOS', // εμπορική ονομασία (όπως εμφανίζεται παντού)
    legalName: 'OIKOS', // νομική επωνυμία (προσάρμοσέ την αν διαφέρει)
    taglineEl: 'All day cuisine & bar',
    taglineEn: 'All day cuisine & bar',
  },

  // ── Επικοινωνία ────────────────────────────────────────────────────────────
  contact: {
    phoneTel: '+302288022507', // για tel: links — μορφή E.164
    phoneDisplay: '22880 22507', // εθνική μορφή για εμφάνιση
    phoneDisplayIntl: '+30 22880 22507', // διεθνής μορφή για εμφάνιση
    email: 'oikoskeas@gmail.com',
  },

  // ── Διεύθυνση ──────────────────────────────────────────────────────────────
  // Δομημένα μέρη (για schema.org) + έτοιμες μορφοποιημένες γραμμές (για εμφάνιση).
  address: {
    areaEl: 'Κορρησία',
    areaEn: 'Korrisia',
    cityEl: 'Κέα',
    cityEn: 'Kéa',
    regionEl: 'Κυκλάδες',
    regionEn: 'Cyclades',
    countryEl: 'Ελλάδα',
    countryEn: 'Greece',
    countryCode: 'GR',
    postalCode: '84002',
    // Έτοιμες γραμμές διεύθυνσης (όπως εμφανίζονται στη σελίδα Επικοινωνίας).
    line1El: 'Κορρησία, Κέα',
    line1En: 'Korrisia, Kéa',
    line2El: 'Κυκλάδες, Ελλάδα 84002',
    line2En: 'Kikladhes, Greece 84002',
  },

  // ── Γεωγραφικές συντεταγμένες (schema.org / χάρτης) ────────────────────────
  geo: {
    lat: 37.660513,
    lng: 24.312061,
  },

  // ── Ωράριο ─────────────────────────────────────────────────────────────────
  // Δομημένο ωράριο. Εδώ είναι ίδιο κάθε μέρα (06:00–02:00). Για ανά-ημέρα ωράριο,
  // επέκτεινε αυτό το αντικείμενο και ενημέρωσε όπου διαβάζεται.
  hours: {
    opens: '06:00', // schema.org OpeningHoursSpecification
    closes: '02:00',
    daily: true,
    display: '06:00 – 02:00', // μορφή για εμφάνιση (en dash με κενά)
    noteEl: 'Καθημερινά',
    noteEn: 'Every day',
    summaryEl: 'Ανοιχτοί καθημερινά 06:00 – 02:00',
    summaryEn: 'Open every day from 06:00 to 02:00',
  },

  // ── Social / εξωτερικοί σύνδεσμοι ──────────────────────────────────────────
  social: {
    instagram: 'https://www.instagram.com/oikos_kea/',
    instagramHandle: '@oikos_kea',
    facebook: null as string | null, // δεν υπάρχει — βάλε URL αν αποκτηθεί
    googleMaps: 'https://share.google/Yw4cgwG7pkaVCz3eY', // σύνδεσμος «οδηγίες»
    // src του ενσωματωμένου χάρτη (iframe) στη σελίδα Επικοινωνίας
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3158.5179546424097!2d24.309501777345556!3d37.660535472014416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a2193279dfe6a1%3A0xa33f4ef20b336bab!2zzp_Ouc66zr_PgiDOms61zrE!5e0!3m2!1sen!2sgr!4v1782665897124!5m2!1sen!2sgr',
    googleReviews: 'https://share.google/3bZUCeosoxPlrULbs',
    googleRating: { value: '4.7', count: '330' }, // αστέρια & πλήθος κριτικών
  },

  // ── Web ────────────────────────────────────────────────────────────────────
  web: {
    siteUrl: 'https://oikoskea.gr', // πρέπει να ταυτίζεται με astro.config.mjs `site`
    defaultOgImage: '/images/brand/og-image.jpg',
    ogImageWidth: 1206,
    ogImageHeight: 1548,
  },

  // ── Νομικά ─────────────────────────────────────────────────────────────────
  legal: {
    marketSupervisorEl: 'Αλμπαντίδης Νικόλαος', // αγορανομικός υπεύθυνος
    marketSupervisorEn: 'Almpantidis Nikolaos',
  },
} as const;

export type Site = typeof site;
