# TEMPLATE — Πώς κλωνοποιώ το repo για νέο εστιατόριο

Αυτό το repo είναι φτιαγμένο ώστε **ένα νέο site να χρειάζεται αλλαγές μόνο σε:
config + design tokens + περιεχόμενο + assets** — όχι στη λογική των components.

Παρακάτω η σειρά βημάτων, από το «τι αλλάζει σχεδόν πάντα» στο «τι αλλάζει σπάνια».

---

## 1) Στοιχεία επιχείρησης → `src/lib/site.ts`

**Μία πηγή αλήθειας** για όλα τα facts. Άλλαξε τις τιμές· διαβάζονται παντού
(nav, footer, σελίδα επικοινωνίας, JSON-LD/OG meta, sitemap URL, ωράριο, κ.λπ.).

| Ομάδα      | Πεδία                                                                                  |
| ---------- | -------------------------------------------------------------------------------------- |
| `brand`    | `name`, `legalName`, `taglineEl/En`                                                     |
| `contact`  | `phoneTel` (E.164), `phoneDisplay`, `phoneDisplayIntl`, `email`                         |
| `address`  | `areaEl/En`, `cityEl/En`, `regionEl/En`, `countryEl/En`, `countryCode`, `postalCode`, `line1El/En`, `line2El/En` |
| `geo`      | `lat`, `lng` (για schema.org / χάρτη)                                                   |
| `hours`    | `opens`, `closes`, `display`, `noteEl/En`, `summaryEl/En`                               |
| `social`   | `instagram`, `instagramHandle`, `facebook`, `googleMaps`, `googleMapsEmbed`, `googleReviews`, `googleRating` |
| `web`      | `siteUrl`, `defaultOgImage`, `ogImageWidth/Height`                                      |
| `legal`    | `marketSupervisorEl/En` (αγορανομικός υπεύθυνος)                                        |

- Το `web.siteUrl` περνά αυτόματα και στο `astro.config.mjs` (`site:`) → canonical URLs, sitemap, OG.
- Το `social.googleMapsEmbed` είναι το `src` του ενσωματωμένου χάρτη (iframe) — πάρ' το από
  Google Maps → Share → Embed a map.

## 2) Αισθητική → brand primitives στο `src/styles/global.css`

Στο `:root` υπάρχουν τα **BRAND PRIMITIVES**. Άλλαξε αυτές τις λίγες τιμές → αλλάζει
**όλο** το site (solid χρώματα ΚΑΙ ημιδιαφανή overlays/borders, που παράγονται με
`rgb(from var(--brand-*) r g b / α)`):

```
--brand-ink     /* σκούρες επιφάνειες & βασικό κείμενο */
--brand-cream   /* ανοιχτές επιφάνειες & κείμενο σε σκούρο */
--brand-accent  /* τόνος έμφασης (links, borders, eyebrow) */
--brand-star    /* χρυσό αστεριών (rating) */
/* + δευτερεύουσες: --brand-mid, --brand-cream-alt, --brand-accent-dim, --brand-muted */
```

- **Fonts:** μία πηγή στην κορυφή του `global.css` — το `@import` URL + τα `--font-heading` /
  `--font-body` tokens. Άλλαξέ τα μαζί.
- **Studio:** η παλέτα του admin είναι στο `studio/theme.ts`, με ρητή αντιστοίχιση στα ίδια
  primitives (το studio είναι ξεχωριστό package → οι τιμές αντιγράφονται). Άλλαξέ τες **μαζί**
  με του site για να μείνει συγχρονισμένο.

## 3) Εικόνες / βίντεο — δύο φάκελοι

Από το refactor υπάρχουν **δύο** τοποθεσίες:

- **`src/assets/images/`** → στατικές marketing/brand εικόνες που περνούν από το
  Astro `<Image>` pipeline (αυτόματο WebP/srcset/διαστάσεις). Αλλάζεις το αρχείο
  → αλλάζει το import. Εδώ ζουν: `brand/logo-wordmark.png`, `brand/sign.jpg`,
  `sushi-rolls-cocktail.jpg`, `bartender-cocktail-mint.jpg`, `chefs-kitchen-bw.jpg`,
  `reserved-table-night.jpg`.
- **`public/images/`** → ό,τι αναφέρεται με runtime string path: fallback εικόνες
  menu items (seed/`localItemImages`), OG εικόνα, βίντεο, placeholder. Μένουν `<img>`/
  `<video>`. Κράτα **ίδια ονόματα αρχείων** για zero αλλαγές (ή ενημέρωσε αναφορές).

Προτεινόμενες διαστάσεις = οι τρέχουσες:

| Αρχείο                              | Διαστάσεις  | Χρήση                                   |
| ----------------------------------- | ----------- | --------------------------------------- |
| `src/assets/…/brand/logo-wordmark.png` | 450×106  | Λογότυπο σε nav & footer (`<Image>`)    |
| `brand/logo.png`                    | 916×766     | Λογότυπο studio                          |
| `brand/og-image.jpg`                | 1206×1548   | Προεπιλεγμένη OG/Twitter εικόνα (δες `web.ogImage*`) |
| `src/assets/…/brand/sign.jpg`       | 1206×1548   | Φωτό «about strip» (αρχική & σελίδα Σχετικά, `<Image>`) |
| `brand/hero.mp4`                    | —           | Hero video αρχικής                       |
| `brand/all-day.mp4`                 | —           | Video «philosophy» (σελίδα Σχετικά)      |
| `food/brunch.jpg` `food/sushi.jpg` `food/risotto.jpg` | ~560×700 | Κάρτες «services» (αρχική) |
| `drinks/cocktail.jpg`               | 560×700     | Κάρτα «cocktails» (αρχική)               |
| `food/*` `drinks/*` (υπόλοιπα)       | ποικίλες    | Fallback εικόνες menu items (δες `src/lib/sanity.ts` → `localItemImages`) |
| `ui/menu-placeholder.svg`           | 96×96       | Placeholder προϊόντος χωρίς εικόνα       |
| `icons/favicon-*` `favicon.ico`     | 16/32/180/512 | Favicons (δες `BaseLayout.astro`)     |

## 4) Περιεχόμενο (κείμενα & μενού)

- **UI / marketing copy → `src/i18n/ui.ts`** (δίγλωσσο EL/EN). Τα facts & το brand name είναι
  ήδη interpolated από το `site` — εδώ αλλάζεις τα _κείμενα_. Πρόσεξε τις λίγες προτάσεις που
  κρατούν τοπωνύμια σε **κλιτή ελληνική μορφή** (περιεχόμενο, όχι config):
  `hero.subtitle`, `home.seo.desc`, `about.who.text1`, `about.space.text`, `contact.here.text`.
- **Seed μενού → `src/i18n/menuData.ts`** (fallback όταν δεν υπάρχει Sanity· δες §5).
- **Alt κείμενα εικόνων** στα `src/components/pages/*.astro` (περιγράφουν συγκεκριμένες φωτό).
- **Reviews** (ονόματα/κείμενα) στο `src/components/pages/HomePage.astro`.

## 5) Sanity (CMS μενού)

1. Νέο project: <https://sanity.io/manage> → πάρε **Project ID** & **dataset** (`production`).
2. **Site env** (`.env`, δες `.env.example`): `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`,
   `SANITY_READ_TOKEN` (API → Tokens, ρόλος Viewer). _Αν μείνει κενό, το site πέφτει στα seed._
3. **Studio env** (`studio/.env`, δες `studio/.env.example`): `SANITY_STUDIO_PROJECT_ID`,
   `SANITY_STUDIO_DATASET`, προαιρετικά `SANITY_STUDIO_HOST` (υποτομέας `*.sanity.studio`),
   και `SANITY_WRITE_TOKEN` για τα maintenance scripts.
4. `cd studio && npm install && npx sanity dev` (ή `build` / `deploy`). **Node 22.**
5. Τα `studio/scripts/*` (import/rebuild/merge) διαβάζουν projectId/dataset από env μέσω
   `studio/scripts/_env.ts` — δεν υπάρχει hardcoded id.

## 6) Domain & deploy

- Βάλε το domain στο `site.web.siteUrl` (περνά αυτόματα στο `astro.config.mjs`).
- Deploy: Vercel (adapter ήδη ρυθμισμένος). Σύνδεσε το repo, όρισε τα ίδια env vars στο Vercel,
  και (προαιρετικά) webhook από Sanity → Vercel για rebuild σε αλλαγή μενού.

---

### Γρήγορος έλεγχος μετά το rebranding

```bash
# Δεν έμεινε κανένα fact του παλιού brand εκτός config/περιεχομένου:
grep -rn "<old-phone>\|<old-email>\|<old-domain>" src astro.config.mjs   # → μόνο src/lib/site.ts
npm run build                                                            # site
cd studio && SANITY_STUDIO_PROJECT_ID=… npx sanity build                # studio (Node 22)
```
