# Codebase Health Report — OIKOS Kéa (Pass 2)

**Branch:** `chore/codebase-health-pass-2` (11 themed commits, **not pushed, no PR opened**)
**Scope:** Astro 5 static site (`src/`) + Sanity Studio CMS (`studio/`)
**Method:** repo + media fully mapped, then a 6-dimension multi-agent read-only
audit (dead code/CSS/assets/deps, correctness, a11y/SEO, studio) whose every
proposed removal/change was **adversarially verified** (a second agent tried to
prove each one wrong, defaulting to "keep"). Fixes were applied in small,
independently-reviewable commits; the site was rebuilt after every group and the
rendered menu checked against a fixed canary (**1069 `menu-item` nodes, EL & EN**).
Visual-affecting changes were verified live in the browser preview.

> **Context:** this is the **second** health pass. Pass 1 (merged via PR #30)
> already removed dead videos, dead CSS/i18n, organized media into
> `public/images/{brand,food,drinks,ui,place}/`, added Prettier and fixed studio
> deps. This pass works on top of an already-clean tree, so the wins are
> concentrated in **media weight**, a few latent **bugs**, **a11y/SEO polish**,
> and **formatting drift** that crept in via feature branches merged since Pass 1.

---

## TL;DR

- **Cut tracked media from 17.3 MB → 6.0 MB (−65 %)** and the build output
  `dist/` from **21 MB → 7.9 MB (−62 %)** — with no visible quality loss.
- Converted 5 oversized food/drink PNGs (a 3.1 MB chirashi photo, a 2.9 MB
  smoothie photo, …) to WebP; removed 5 proven-dead images; recompressed the
  two large brand JPGs; renamed `hero.MP4 → hero.mp4`.
- Fixed a real CSS bug (`var(--radius)` was never defined → menu thumbnails &
  lightbox rendered with square corners) and a latent EN empty-name fallback.
- Surfaced two **owner-entered CMS fields that were silently dropped**
  (`priceNote`, per-category `note`) — now rendered (additive; today's menu is
  byte-identical because they're currently empty).
- a11y/SEO: skip-to-content link, localized logo `aria-label` on EN pages,
  corrected `og:image` dimensions, added `robots`/`theme-color`/social-image alt.
- Declared `@sanity/ui` as a direct studio dependency; re-applied Prettier
  repo-wide (**provably whitespace-only — rendered HTML unchanged**).
- **`astro build` green throughout (8 pages); behaviour & visuals preserved.**

---

## Before / After metrics

| Metric | Before | After | Δ |
|---|---:|---:|---|
| Tracked files | 112 | 107 | −5 (dead images; 5 PNG→WebP are net-zero) |
| `public/` assets (git bytes) | 17.32 MB | 5.98 MB | **−11.35 MB (−65 %)** |
| `dist/` build output | 21 MB (44 files) | 7.9 MB (39 files) | **−13 MB (−62 %)** |
| Heaviest single asset | `donburi.png` 3.13 MB | `hero.mp4` 1.45 MB | the multi-MB PNGs are gone |
| Root dependencies | 4 deps / 2 devDeps | 4 deps / 2 devDeps | unchanged |
| Studio dependencies | 6 deps / 3 devDeps | 7 deps / 3 devDeps | +`@sanity/ui` (was transitive) |
| Pages built | 8 (green) | 8 (green) | — |
| Menu render (canary) | 1069 nodes / EL+EN | 1069 nodes / EL+EN | unchanged ✓ |
| `prettier --check .` | 7 files drifted | clean | fixed |

---

## Media — rename / move / optimize table

Folder structure was already category-organized in Pass 1 (`brand/ food/ drinks/
ui/ place/`), so no re-foldering was needed. Names were already descriptive
kebab-case; the only naming fix was the uppercase video extension.

| Old path | New path | Action | Before | After |
|---|---|---|---:|---:|
| `brand/hero.MP4` | `brand/hero.mp4` | rename (lowercase ext) | 1.45 MB | 1.45 MB |
| `food/donburi.png` | `food/donburi.webp` | convert (q85) | 3.13 MB | **171 KB** |
| `drinks/smoothies.png` | `drinks/smoothies.webp` | convert + resize 1396²→718×800¹ | 2.99 MB | **72 KB** |
| `food/spicy-maguro.png` | `food/spicy-maguro.webp` | convert (q85) | 1.58 MB | **66 KB** |
| `food/vegetarian.png` | `food/vegetarian.webp` | convert (q85) | 1.55 MB | **66 KB** |
| `food/kyuri.png` | `food/kyuri.webp` | convert (q85) | 1.52 MB | **97 KB** |
| `brand/og-image.jpg` | (same) | recompress q88 in place | 447 KB | 392 KB |
| `brand/sign.jpg` | (same) | recompress q88 in place | 447 KB | 392 KB |
| `food/acai-bowl.jpg` | — | **deleted** (unreferenced) | 175 KB | — |
| `food/caprese.jpg` | — | **deleted** (old hero, now a video) | 285 KB | — |
| `food/dessert.jpg` | — | **deleted** (unreferenced) | 111 KB | — |
| `food/granola-bowl.jpg` | — | **deleted** (unreferenced) | 138 KB | — |
| `drinks/cocktails-selection.jpg` | — | **deleted** (unreferenced) | 224 KB | — |

¹ `smoothies` is only ever an 88 px menu-tab thumbnail (never lightboxed), so the
source was down-scaled before encoding. The four food PNGs keep native resolution
because they **are** opened full-screen in the lightbox. All five PNGs are opaque
photos (no alpha) — WebP q85 is visually lossless.

**Every reference was updated** in lock-step: seed data (`menuData.ts`), the
local-image fallback map (`sanity.ts`), the menu tab fallback (`MenuPage.astro`),
and the studio upload script (`upload-images.ts`, including its content-type
logic, which now emits `image/webp`). Live menu item images come from the Sanity
CDN; these local files are the seed/fallback path only. Verified zero broken
references; `donburi.webp` & `smoothies.webp` confirmed serving `200 image/webp`
in the live preview.

---

## Changes by theme (one commit each)

1. **`chore`** — carried the pre-existing uncommitted WIP (shorter service copy,
   responsive service cards) onto the branch as an isolated first commit, so it
   is preserved and reviewable separately.
2. **`chore(assets)`** — removed 5 proven-unreferenced images (~932 KB);
   re-proved zero refs across source, templates, CSS, config, dynamic paths and
   studio scripts immediately before deletion.
3. **`chore(assets)`** — renamed `hero.MP4 → hero.mp4` (consistent with
   `all-day.mp4`; avoids case-sensitivity surprises on the Linux/Vercel host).
4. **`perf(assets)`** — PNG → WebP conversion (≈10 MB → ≈0.5 MB).
5. **`perf(assets)`** — recompressed the two 447 KB brand JPGs at q88.
6. **`fix(css)`** — `var(--radius)` was referenced on `.img-lightbox__img` and
   `.menu-item__img` but **never defined** (`:root` only has `--radius-sm/-md/-full`).
   The declaration was invalid and dropped, so both rendered square. Mapped the
   thumbnail to `--radius-sm` (matches its sibling `.menu-tab-img`) and the
   lightbox to `--radius-md`. _Intentional behaviour change — restores the
   designed rounding; verified live (computed `border-radius: 4px`)._
7. **`fix(menu)`** — render `priceNote` and per-category `noteEl/noteEn` (both
   fetched from Sanity but never output), plus an EN empty-name fallback. All
   additive: the live CMS has none of these populated, so the rendered menu is
   byte-identical today (1069 nodes) while no longer silently discarding owner data.
8. **`a11y`** — skip-to-content link (hidden until keyboard focus); localized the
   logo `aria-label` (was hardcoded Greek "Αρχική" even on EN pages); added
   `decoding="async"` to the about image to match its siblings.
9. **`seo`** — corrected `og:image:width/height` to the real 1206×1548; added
   `robots`, `theme-color` and localized `og:image:alt`/`twitter:image:alt`.
10. **`chore(studio)`** — declared `@sanity/ui` directly (it was imported by two
    core components but only resolved transitively); `sanity build` green.
11. **`style`** — re-applied Prettier across the 7 drifted files; proven
    whitespace-only (before/after build = byte-identical HTML).

---

## Verification performed

- `astro build` green after **every** commit (8 pages).
- Menu canary held at **1069 `menu-item` nodes** (EL + EN) across all changes.
- Prettier reformat proven visually identical: a build before and after the
  `style` commit produced **byte-identical** `dist/menu/index.html`.
- `sanity build` green after the studio dependency change.
- Live preview (astro dev): menu drill-down renders, **menu thumbnails now have
  4 px rounding**, `hero.mp4`/`sign.jpg`/`og-image.jpg`/`*.webp` all serve `200`
  with correct content-types, skip link present, **zero console errors**.
- `prettier --check .` passes; working tree clean.

---

## Deliberately left untouched (and why)

- **`logo.png` (~54 KB)** & **`icons/favicon-512.png` (~15 KB)** — provably
  unreferenced, but kept by Pass 1 as a brand source / future-PWA icon. Unchanged
  here; removal remains the owner's call.
- **`og-image.jpg` == `sign.jpg` (byte-identical)** — the OG card is currently the
  portrait `sign` photo. Kept as two files (different semantic roles that may
  diverge); see recommendation 1 for the proper landscape OG card.
- **`studio/scripts/*.ts`** — intentional one-off operational history; not
  deleted. Their string references were updated where a converted image is
  involved (zero broken refs), but no script logic was changed beyond the
  `upload-images.ts` content-type fix.
- **Exported-but-internal-only symbols** (`LABEL_MAP`, `ALLERGEN_MAP`,
  `defaultLang`, `MENU_QUERY`, `sanity`, `wineListSections`, `PriceVariant`,
  `Extra`) — flagged by the audit as redundant `export`s. They are **not dead**
  (all used in-file), `menuData.ts`/`sanity.ts` are documented shared surfaces,
  and tree-shaking already drops them. Un-exporting is a zero-benefit micro-change
  with non-zero risk (future test/script imports), so left as-is.
- **`.menu-item--has-img`** — applied in `MenuItem.astro` but currently has no CSS
  rule. Left in place: the menu-images feature is actively evolving and this reads
  as an intentional styling hook, not cruft.
- **Hero/about background videos** (`hero.mp4` 1.45 MB, `all-day.mp4` 1.38 MB) —
  reasonable for looping backgrounds; further compression needs `ffmpeg` (not
  installed) and a poster frame is an owner design choice (recommendation 4).
- **`--text-muted` / `--color-gold` text contrast** (below WCAG AA on cream) —
  darkening changes the brand's visual output; owner decision (recommendation 2),
  unchanged as in Pass 1.
- **`HANDOFF.md`** — owner deployment doc; the deploy steps remain valid and it
  already carries a staleness banner. Not rewritten (recommendation 6).

---

## Remaining recommendations (need a human decision)

1. **Dedicated landscape OG image** — `og-image.jpg` is the portrait 1206×1548
   `sign` photo. The meta now declares the true dimensions, but a real 1200×630
   landscape social card would preview far better on Facebook/LinkedIn/X
   (`summary_large_image`). Swapping a brand asset is an owner call.
2. **Colour contrast (WCAG AA)** — `--text-muted` (#7c7a76 ≈ 3.9:1 on cream) and
   `--color-gold` text (#8d8a85 ≈ 3.1:1) fall below AA for small text. Darkening
   (`--text-muted → ~#6b6964`, eyebrows → `--color-gold-dim`) fixes it but changes
   the brand palette → needs sign-off.
3. **Localize content-image `alt` text** — food-photo `alt` strings on HomePage/
   AboutPage are hardcoded English and read out in English on the Greek pages. A
   faithful translation (e.g. _"Poached eggs with halloumi…" → "Αυγά ποσέ με
   χαλούμι και σαλάτα στο OIKOS"_) would close the gap; left as content for the
   owner to phrase. (The logo `aria-label`, which reuses an existing key, **was**
   fixed.)
4. **Video posters / dimensions** — give the hero & about videos a `poster` (first
   frame) so the first paint isn't blank while the MP4 buffers. Owner picks the frame.
5. **Wire the unused `image.alt` CMS subfield** — `menuItem.image.alt` is editable
   in the Studio but never fetched (GROQ only takes `image.asset->url`), and the
   thumbnails ship `alt=""` (intentionally decorative, since the dish name is
   adjacent). Decide: fetch `image.alt` and use it for the **lightbox** image
   (where standalone alt helps), or drop the schema subfield. _Not auto-changed —
   it touches the Pass-1 decorative-alt decision._
6. **Studio polish (low priority, admin-only)** — brand hex literals are
   duplicated across `Logo.tsx`, `HelpGuide.tsx`, `TranslateInput.tsx` and
   `menuItem.tsx` instead of coming from `theme.ts`; and `HANDOFF.md` still
   describes the older 5-tab data model. Cosmetic/owner-facing; not user-impacting.
7. **Script reproducibility (optional)** — `studio/scripts/*` import `@sanity/client`
   and `lexorank` that resolve only transitively. Fine for ad-hoc `npx tsx` use; if
   these one-offs should be reproducible, declare them in studio `devDependencies`.
8. **Dependency advisories** — pre-existing `npm audit` items in Astro's bundled
   esbuild and `@astrojs/vercel`'s path-to-regexp need **breaking** major upgrades;
   schedule + test deliberately. Not introduced by this pass. (Sanity also warns it
   moves to v4 / Node 20+ on 2025-07-15 — plan the studio bump.)

---

_Generated during an autonomous codebase health pass. All work is on
`chore/codebase-health-pass-2` for review; nothing was pushed and no PR was opened._
