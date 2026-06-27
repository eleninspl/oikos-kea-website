# Codebase Health Report — OIKOS Kéa

**Branch:** `chore/codebase-health-pass` (14 themed commits, not pushed, no PR opened)
**Scope:** Astro 5 static site (`src/`) + Sanity Studio CMS (`studio/`)
**Method:** repo mapped, then a multi-agent read-only audit across 7 dimensions
(dead code/assets/deps, correctness, a11y/SEO, studio, DRY) whose findings were
adversarially verified, then fixed in small reviewable commits. After every group
the site was rebuilt and the rendered menu was checked against a fixed canary
(889 `menu-item*` nodes / 7 tabs, EL & EN). Behaviour-affecting changes were
verified live in a browser preview.

---

## TL;DR

- **Removed ~10.5 MB of dead video assets** that no longer have any reference.
- **`public/` dropped 12 MB → 1.8 MB; `dist/` build output 16 MB → 2.5 MB (−84%).**
- Removed dead CSS (6 selectors, 3 unused tokens), dead i18n keys, and a dead export.
- Fixed real a11y gaps (keyboard menu, focus management, heading hierarchy, ARIA),
  two latent menu data/navigation bugs, and SEO `x-default`/favicon wiring.
- DRY: extracted `langBase()`, a `site.ts` contact module, and `PageHero` + `CtaBanner` components.
- Fixed studio dependencies (removed an erroneous `react-is`, declared the used `@sanity/icons`),
  corrected stale owner-facing help text, and flagged a dangerous obsolete migration script.
- Added Prettier + EditorConfig (no formatter existed) and applied it — **provably no visual change**.
- **The build passes throughout; product behaviour and visual output are preserved.**

---

## Before / After metrics

| Metric | Before | After | Δ |
|---|---:|---:|---|
| Tracked files | 96 | 98 | +6 new, −4 deleted |
| `public/` assets | 12 MB | 1.8 MB | **−10.2 MB** |
| `dist/` build output | 16 MB (36 files) | 2.5 MB (32 files) | **−13.5 MB** |
| Root dependencies | 4 deps / 0 devDeps | 4 deps / 2 devDeps | +Prettier tooling |
| Studio dependencies | 6 deps / 3 devDeps | 6 deps / 3 devDeps | swapped `react-is` → `@sanity/icons` |
| Pages built | 8 (green) | 8 (green) | — |
| Menu render (canary) | 889 nodes / 7 tabs | 889 nodes / 7 tabs | unchanged ✓ |
| Formatter / EditorConfig | none | Prettier + `.editorconfig` | added |

---

## Changes by theme

### 1. Dead assets removed
- **`public/videos/{brunch,dishes,drinkvid,fitnessomelette}.mp4`** (~10.5 MB, git-tracked) —
  leftovers from an earlier hero-video design that was replaced with still images.
  Proven unreferenced across all source, templates, CSS, config and dynamic paths
  (no `<video>`/`<source>` element exists anywhere). _(commit: remove dead video assets)_

### 2. Dead code & cruft removed
- **CSS** (`global.css`): removed 6 unused selectors — `.section-subtitle` (which also had
  a duplicate `font-size`), `.menu-section-chevron`, `.menu-category__emoji`,
  `.menu-item__price-glass`, `.menu-item--wine`, `.menu-item--wide` — plus 3 unused
  custom properties (`--color-light`, `--radius-lg`, `--text-gold`). _(remove dead CSS)_
- **i18n** (`ui.ts`): removed unused keys `menu.intro` and `menu.cat.*` (brunch/bowls/sushi/
  desserts/cocktails/smoothies) in both EL and EN — leftovers from a pre-CMS static menu. _(remove unused i18n keys)_
- **Dead export**: `getLangFromPath()` in `i18n/utils.ts` — never imported. _(remove dead export)_

### 3. Correctness fixes
- **`getMenu()` fallback** (`lib/sanity.ts`): now falls back to seed data when `assembleMenu()`
  returns an empty array (every tab filtered out), instead of shipping an empty menu page.
- **Empty-subsections guard** (`MenuPage.astro`): `section.subsections?.length` so a section with an
  empty `subsections: []` array correctly falls through to its items grid (latent footgun).
- **Menu "back" button** (`MenuPage.astro`): clears the hash via `pushState` instead of
  `history.back()`, which would **leave the site** when the page was opened directly on a
  `#category` (shared link, or after a language switch that copies the hash).
- **Price-label fallback** (`MenuItem.astro`): made symmetric so an EL-only/EN-only variant
  label still shows in the other language.
  _(commit: harden menu data fallback and navigation edge cases)_

### 4. Accessibility
- **Mobile menu**: `aria-expanded` (kept in sync) + `aria-controls`/`id`, focus moves to the first
  link on open, **Escape closes and returns focus to the burger**, body scroll locks/unlocks.
- **Menu drill-down**: focus moves to the panel heading (`tabindex="-1"`) when a category opens,
  so keyboard / screen-reader users land in the revealed content.
- **Heading hierarchy**: panel title stays `h2`, category `h2→h3`, subsection `h3→h4` (styling is
  class-based, so visuals are unchanged) — fixes a flat outline.
- **Removed incomplete/misleading ARIA tabs** (`role=tablist/tab/tabpanel` + `aria-selected`):
  this is a grid→detail drill-down, not a tabs widget, and lacked roving tabindex/arrow keys.
  Native buttons + headings now carry correct semantics (`aria-controls` links tile → panel).
- **Decorative images**: logo `<img>` (the link already has an `aria-label`) and the menu-item
  thumbnail (name is adjacent visible text) now use `alt=""` to avoid double announcement.
  _(commit: a11y keyboard, focus, heading hierarchy and ARIA fixes — verified live)_

### 5. SEO
- **`x-default` hreflang** now points to each page's EL equivalent instead of always the homepage.
- **Wired the 16×16 favicon** (`favicon-16.png`) that was shipped but never referenced in `<head>`.
  _(commit: per-page x-default hreflang and wire 16px favicon)_

### 6. DRY / structure
- **`langBase(lang)`** helper replaces the `lang === 'en' ? '/en' : ''` expression duplicated in 4 files.
- **`src/lib/site.ts`** centralises phone (tel + display), email, Instagram and Google-reviews URLs,
  previously hardcoded across 7 files and the JSON-LD.
- **`PageHero.astro`** and **`CtaBanner.astro`** replace the page-hero block (×3) and cta-banner
  block (×4); a `.cta-actions` utility class replaces a repeated inline style.
  _(commits: extract langBase; centralize site contact details; extract PageHero and CtaBanner)_

### 7. Studio (Sanity CMS)
- **Dependencies**: removed `react-is@^19.2.7` (unused, and v19 clashed with React 18); declared
  `@sanity/icons@^3.7.4` (imported in 5 files but only resolved transitively). Lockfile synced;
  verified with a full `sanity build`.
- **Owner help** (`HelpGuide.tsx`): rewrote the in-Studio instructions, which referenced sidebar
  items/fields that no longer exist and a multi-tab feature the schema dropped, to match the
  current structure and real field names.
- **`migrate.ts`**: added a prominent **OBSOLETE / do-not-run** banner — it targets the old data
  model and runs `dataset import --replace`, which would wipe production. Kept as history.
  _(commits: studio dependencies; studio docs)_

### 8. Tooling
- Added **Prettier** (+ `prettier-plugin-astro`), **`.editorconfig`**, a scoped `.prettierignore`
  (excludes build output, lockfiles, prose docs, the owner guide, and the hand-aligned
  `menuData.ts`), and `format` / `format:check` scripts. Applied repo-wide.
  _(commits: add Prettier and EditorConfig; apply Prettier formatting)_

---

## Verification performed

- `astro build` green after **every** commit (8 pages); `sanity build` green after each studio change.
- Menu render canary (889 nodes / 7 tabs, EL + EN) held across all changes.
- The Prettier reformat was proven **visually identical**: a whitespace-insensitive HTML diff of all
  rendered pages showed only insignificant boundary whitespace (block-level headings, inter-tag
  newlines, SVG self-closing→explicit) — no text or structural change.
- Live browser checks: menu grid→detail drill-down, focus-to-heading, the fixed back button
  (stays on site), mobile burger `aria-expanded`, Escape-to-close + focus return — all working,
  zero console errors.
- `prettier --check .` passes; working tree clean.

---

## Deliberately left untouched (and why)

- **`public/images/brand/logo.png`** (~54 KB) — provably unreferenced (the site uses
  `logo-wordmark.png`), but it is a primary **brand asset** likely kept as a source/icon file.
  Removing a brand logo is the owner's call; flagged, not deleted.
- **`public/icons/favicon-512.png`** (~16 KB) — unreferenced; it is the conventional PWA/Android
  icon size with no web manifest to consume it. Kept for a future manifest (see recommendations).
- **JSON-LD `geo` + contact-page map** use placeholder coordinates (`37.6442 / 24.3326`) and a
  fabricated map embed. Correcting these needs the **real** coordinates / a genuine Google "Embed
  a map" URL — guessing new numbers would not be clearly better. Left for the owner.
- **Place-name spelling** (`Korrisia`, `Kikladhes`) — flagged by the audit as non-standard, but it
  matches the owner's established spelling across the site; treated as content, not a bug.
- **`lib/sanity.ts` GROQ `coalesce(menu->key.current, menus[0]->key.current)`** — the `menus[0]`
  branch is legacy (the schema now has a single `menu` ref), but it is a harmless, intentionally
  "transition-safe" fallback on the site's most critical query. Left as-is to avoid risk for
  near-zero benefit.
- **`@sanity/vision`** (studio devDep) — unused/not wired into the Studio, but it is a deliberately
  installed dev affordance (GROQ playground); kept.
- **20 `studio/scripts/*.ts`** one-off migration/rebuild scripts — not imported by code but they are
  intentional operational history; not deleted (only `migrate.ts` got a danger banner).
- **`src/pages/**` 8 thin route wrappers** — duplicative-looking but required by Astro's file-based
  routing; collapsing them to a `[lang]` dynamic route is optional and changes routing structure.
- **Brand-colour contrast** (`--text-muted` ~3.9:1, `--color-gold` ~3.0:1 on cream) — below WCAG AA
  for small text, but darkening these tokens **changes the brand's visual output**, which is an
  owner decision (see recommendations).

---

## Remaining recommendations (need a human decision)

1. **Map & geo coordinates** — replace the placeholder Google Maps embed in `ContactPage.astro`
   with a real "Embed a map" URL and set the JSON-LD `geo` to OIKOS's true lat/lon (keep both in
   sync). _High value for local SEO + users finding the restaurant._
2. **Colour contrast (WCAG AA)** — darken `--text-muted` (→ ~`#6b6964`) and use `--color-gold-dim`
   for small eyebrow/accent text on cream backgrounds. Visual/brand change → needs sign-off.
3. **Image optimisation** — page images are served unoptimised from `public/` with no
   `width`/`height` (e.g. the LCP hero `caprese.jpg` ~279 KB). Moving them to `src/assets` with
   Astro `<Image>` would emit responsive AVIF/WebP and cut bytes + layout shift. _Behaviour-adjacent
   (changes markup/bytes) → verify visually._
4. **CMS fields collected but never shown** — `menuItem.priceNote`, `category.noteEl/noteEn`, and the
   image `alt` field are editable in the Studio but not rendered/fetched by the site. Either render
   them (the note fields look intended to display; `image.alt` would improve a11y) or remove them so
   the owner isn't entering data with no effect.
5. **Phone number in i18n copy** — the pretty number is still embedded in a few translatable CTA
   strings in `ui.ts` (e.g. "Call us: 22880 22507"); the rest now use `site.ts`. Composing these
   strings from `site.phoneDisplay` would fully de-duplicate, at the cost of touching the i18n copy.
6. **Dependency advisories** — `npm audit` reports 5 pre-existing vulns (1 low, 4 high) in
   `astro`'s bundled **esbuild** (dev-server, Windows only) and `@astrojs/vercel`'s
   **path-to-regexp**. Fixes require **breaking** major upgrades (`astro@7`, `@astrojs/vercel@11`);
   schedule + test these deliberately. Not introduced by this pass.
7. **`HANDOFF.md` is partly stale** — it documents the earlier 5-tab / subsection / `category.tabs`
   data model (the current model is 7 tabs, items-as-documents, single `menu` ref). The deploy
   steps remain valid. A staleness note was added at the top; a full rewrite is recommended.
8. **Studio polish (low priority)** — brand hex colours are duplicated across studio components
   instead of being exported from `theme.ts`; and the Studio admin UI still uses the old gold/dark
   palette while the public site moved to white/grey (admin-only, cosmetic).
9. **Studio changes require redeploy** — the `HelpGuide`/dependency fixes only reach the live Studio
   after `sanity deploy`; the site changes deploy via the normal Vercel build on merge.

---

_Generated during an autonomous codebase health pass. All work is on
`chore/codebase-health-pass` for review; nothing was pushed and no PR was opened._
