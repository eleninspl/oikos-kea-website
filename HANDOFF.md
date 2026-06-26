# OIKOS — Διαχειριστικό Μενού (Sanity CMS) — Handoff

Κατάσταση μέχρι τώρα και τι μένει. Όλα τα τεχνικά κομμάτια του κώδικα είναι **έτοιμα
και επαληθευμένα**. Μένουν βήματα που χρειάζονται τον λογαριασμό σου.

---

## ✅ Τι έγινε & επαληθεύτηκε

- **Sanity Studio** στο `studio/` με επίπεδο schema (menu, category, subsection,
  menuItem). Οι **καρτέλες (menu)** ΚΑΙ οι **κατηγορίες** είναι documents που
  διαχειρίζεται ο ιδιοκτήτης. Η κατηγορία αναφέρεται (reference) σε μία ή
  περισσότερες καρτέλες μέσω «Εμφανίζεται σε» (τα κρασιά → All Day + Κουζίνα).
- **Migration**: το `studio/menu.ndjson` περιέχει τα 5 documents (4 tabs + λίστα
  κρασιών), 130 μοναδικά προϊόντα. Έτοιμο για import.
- **Astro integration**: `src/lib/sanity.ts` τραβάει το μενού με GROQ, ενώνει τη
  λίστα κρασιών σε All Day & Κουζίνα, φιλτράρει τα κρυφά (hidden).
- **Render**: υποστήριξη `priceAlt` (Sashimi/Nigiri), `sectionPrice` (Milkshake),
  `hidden` σε κάθε επίπεδο.
- **Safety fallback**: αν το Sanity είναι άδειο/απρόσιτο, το site πέφτει αυτόματα
  στα τοπικά seed δεδομένα — **το build δεν σπάει ποτέ**.
- **Επαληθεύσεις**: `studio/scripts/verify.ts` → 11/11 pass· `npm run build` → 8
  σελίδες χωρίς σφάλματα· EL & EN σελίδες μενού renderάρουν σωστά (158 items).

---

## ✨ Νέα deliverables (Φάση 3 — επαγγελματικό polish)

- **Studio branding**: OIKOS λογότυπο + χρυσό/σκούρο θέμα στο Studio
  (`studio/components/Logo.tsx`, `studio/theme.ts`).
- **Οδηγίες μέσα στο Studio**: item «📖 Οδηγίες Χρήσης» στο sidebar
  (`studio/components/HelpGuide.tsx`).
- **Οδηγός ιδιοκτήτη**: `studio/ΟΔΗΓΟΣ-ΙΔΙΟΚΤΗΤΗ.md` + έτοιμο επαγγελματικό
  **PDF** `studio/ΟΔΗΓΟΣ-ΙΔΙΟΚΤΗΤΗ.pdf` (branded, για παράδοση στον πελάτη).
- Επαληθεύτηκε: `sanity build` περνά καθαρά με όλα τα παραπάνω.

---

## ✅ LIVE — auth & data λύθηκαν (27 Ιουν)

- **Auth**: το project ανήκε στην **GitHub** ταυτότητα του `eleni.nspl@gmail.com`
  (το Sanity ξεχωρίζει Google vs GitHub vs Email ως διαφορετικούς χρήστες με
  ίδιο email). Λύθηκε με `npx sanity login` → **GitHub**.
- **Import**: 5 documents ανέβηκαν (`sanity dataset import menu.ndjson production --replace`).
- **Read token**: δημιουργήθηκε viewer token (label `astro-build-read`) και μπήκε
  στο `.env` ως `SANITY_READ_TOKEN` (build-time only, gitignored). Το `.env` ΔΕΝ
  ανεβαίνει στο git.
- **Αποτέλεσμα**: το site (localhost) διαβάζει **live από Sanity** — επαληθεύτηκε
  (priceAlt splits, sectionPrice, wine merge, EL+EN, 158 items).

> ⚠️ Για το **Vercel deploy**: πρόσθεσε το `SANITY_READ_TOKEN` (την τιμή από το
> τοπικό `.env`) στα Environment Variables του Vercel — αλλιώς το production build
> θα πέσει σε fallback. Δες Βήμα 3 παρακάτω.

---

## 📋 Υπόλοιπα βήματα (με ακριβείς εντολές)

> Σε ΚΑΘΕ terminal πρώτα: `cd /Users/eleni/oikos-kea-website/studio && nvm use 22`

### 1) Import δεδομένων (μόλις λυθεί το auth)
```bash
npx sanity dataset import menu.ndjson production --replace
```
Έλεγχος: άνοιξε το Studio (`npm run dev` → http://localhost:3333) — θα δεις
γεμάτα tabs & τη λίστα κρασιών.

### 2) Deploy του Studio (δημόσιο URL για τον ιδιοκτήτη)
```bash
npx sanity deploy
# διάλεξε hostname, π.χ. oikos-kea  →  https://oikos-kea.sanity.studio
```

### 3) Σύνδεση site ↔ Sanity στο Vercel
- Στο Vercel project του site → **Settings → Environment Variables**, πρόσθεσε:
  - `PUBLIC_SANITY_PROJECT_ID = s7x6np2r`
  - `PUBLIC_SANITY_DATASET = production`
  - `SANITY_READ_TOKEN = <η τιμή από το τοπικό studio .env / root .env>` ⚠️ απαραίτητο
- **Settings → Git → Deploy Hooks**: φτιάξε hook "Sanity publish" → αντιγραφή URL.
- Στο https://sanity.io/manage → project → **API → Webhooks → Create**:
  - Name: `Vercel rebuild`
  - URL: (το Deploy Hook URL από πάνω)
  - Trigger on: Create / Update / Delete · Dataset: production
  - **Αποτέλεσμα**: ο ιδιοκτήτης πατά Publish → site rebuild σε ~30–60 δευτ.

### 4) Πρόσκληση ιδιοκτήτη
- https://sanity.io/manage → project → **Members → Invite** → email ιδιοκτήτη
  ως **Editor** (όχι Administrator — να μην πειράζει ρυθμίσεις).
- Μπαίνει στο `https://oikos-kea.sanity.studio`, κάνει αλλαγές, πατά **Publish**.

---

## 🔁 Αν αλλάξει το μενού στον κώδικα και θες re-migration
```bash
cd studio
npx tsx scripts/migrate.ts > menu.ndjson     # ξαναφτιάχνει το NDJSON
npx sanity dataset import menu.ndjson production --replace
```

## 🧪 Re-run επαλήθευσης
```bash
cd studio && npx tsx scripts/verify.ts        # 11 assertions
cd .. && npm run build                        # production build
```

---

## 🗺️ Πώς δουλεύει (σύνοψη)

```
Ιδιοκτήτης ─edit→ Sanity Studio ─publish→ Sanity API
                                              │ webhook
                                              ▼
                                       Vercel rebuild
                                              │ GROQ fetch (build-time)
                                              ▼
                                   oikoskea.gr (στατικό, γρήγορο)
```

- Πηγή αλήθειας = Sanity. Το `src/i18n/menuData.ts` μένει ως **seed/fallback**.
- Τα κρασιά είναι κατηγορίες με `tabs:['allday','cuisine']` → γράφονται **μία
  φορά**, εμφανίζονται σε All Day & Κουζίνα.
- Κρυφά (hidden) items δεν φτάνουν καν στο published HTML (φιλτράρονται στο GROQ).
