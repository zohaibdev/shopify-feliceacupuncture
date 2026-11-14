# Felice Acupuncture — Project Context

Hand-over doc for the Figma → Shopify build (homepage + Our Services page template). Read it before touching the `fa-*` files; update it when
architecture or design decisions change. Generic standards: `E:\Edits\figma-to-shopify-claude-master-rules.md`.

## Project overview

| | |
|---|---|
| **Client** | Felice Acupuncture, Culver City (live site: feliceacupuncture.com, booking on Jane App) |
| **Theme** | Dawn 16.0.0 (clean download, 2026-09-29) |
| **Figma** | https://www.figma.com/design/qQia718990mb555JZaqqLk/01.-Felice-Acupuncture-%7C-WEBSITE--Client-?node-id=414-251 — section `414:251` "V4", version tag dated 23-09-2026 |
| **Frames** | Desktop `414:255` 1440×8898 · Mobile `414:975` 375×6111. `414:251` is too big for one `get_metadata` read — address child nodes directly. |
| **Status** | Homepage complete (header, 9 sections, footer); Figma QA passes 1–4 done (section QA, global typography/spacing/icons, final integration). **Our Services page** template `templates/page.services.json` built 2026-09-30, updated to Figma v2 2026-10-01 (see "Our Services page" below). Not yet checked in a real store. |
| **Figma (services)** | v2: file `B4QcctWXiG9ywP3uRA3coG`, section `2263:2285` (tag 30-09-2026), desktop `2263:2286` 1440×10924, mobile `2264:6705` 375×9589. (v1 `394:3067` superseded.) |

## Architecture

Everything custom is prefixed `fa-`. Dawn files are untouched except these wiring points:

- **`layout/theme.liquid`**: `{% render 'fa-head' %}` after `base.css` (the only change; leave the file alone).
- **`snippets/fa-head.liquid`**: `@font-face` rules, font preload, `fa-base.css`, the inline `html.fa-motion` switch and
  `fa-motion.js` (defer) — see Motion.
- **`config/settings_schema.json`**: "Felice" group — `fa_marisa_uploaded`, `fa_marisa_medium_uploaded`.
- **`sections/header-group.json`**: `fa-header` only. **`sections/footer-group.json`**: `fa-footer` only.
- **`templates/index.json`**: `fa-hero`, `fa-conditions`, `fa-first-visit`, `fa-services`, `fa-cta-banner`, `fa-team`,
  `fa-testimonials`, `fa-faq`, `fa-book-visit`. (Figma groups book-visit with the footer; in the theme it is the last
  index section.)

| Section | Figma desktop / mobile | Notes |
|---|---|---|
| `fa-header` | 414:569 / 414:976 + 414:996 | Top bar (address, phone, hours, X / Facebook / Instagram) + logo / nav blocks / Book Now. Below 1100px a menu panel replaces the nav (not drawn in Figma); tablet (900–1099) keeps Book Now in the row, mobile (≤899) moves it into the panel and shows only address + phone (centred) in the top bar. Inline IIFE script. |
| `fa-hero` | 414:632 + 414:636 / 414:1011 + 414:1012 | Each photo slot is a `<picture>`: up to 899px the left slot resolves to a 1×1 GIF and the right slot to the optional mobile image, so phones fetch one photo. Photos 2259px wide; Figma's noise via `fa-hero-grain.png` overlay; dark band / mobile gradient = `.fa-hero__media::after`. |
| `fa-conditions` | 414:422–425, 414:428 / 414:1004, 414:1056 | 6 `condition` blocks, Chinese characters over the photo. Per-card text-width range settings `text_width` (340–418) / `text_width_mobile` (200–250) → inline CSS vars, reproducing Figma's hand-set wraps. Background `fa-conditions-bg.jpg` (1440) + `-2x.jpg` (2880) via srcset. 3 cols ≥900 (tablet: narrower columns, 28px titles); swipe row ≤899. |
| `fa-first-visit` | 414:419, 414:495, 414:563 / 414:1131–1133 | 3 `step` blocks (duration_1/text_1/duration_2/text_2). Owns the flower that rises into conditions. 3 cols ≥900; swipe row ≤899 (centred when all three cards fit, e.g. 899px). Mobile button label white (Figma). |
| `fa-services` | 414:417, 414:681, 414:564/565 / 414:1005, 414:1193 | 6 `service` blocks; "Text width" select (Standard 349 / Narrow 254). Photo notches via `clip-path`. 3 cols ≥900; 1100–1279 two-line titles get line-height 1.1 (Figma's 58px would gap them). Owns the flower that rises into first-visit. Mobile button label white (Figma). |
| `fa-cta-banner` | 414:763 / 414:1237 + 414:1239 | Photo banner; `fa-cta-banner-bg.jpg` 1440 + `-2x.jpg` 2880 (srcset), mobile file; button links to Jane App. Bundled photos already include Figma's darkening; `overlay_opacity` adds a shade for own photos. |
| `fa-team` | 414:416, 414:773, 414:872 / 414:1007, 414:1246 | 4 `member` blocks. Instagram / Facebook / X always render (team-specific glyphs in `fa-icons-team`, X traced from Figma's raster mask): link when the block URL is set (Instagram falls back to the practice account), else a decorative span. Tablet 900–1099: the desktop row of four with the mobile panel layout (name row, arrow beside the icons, 18px names) so names fit. 1100–1279: tighter panel inset. |
| `fa-testimonials` | 414:257, 414:873 / 414:1006, 414:1360 | Static review blocks. `<fa-testimonials-carousel>` (`assets/fa-testimonials.js`: scroll-snap + prev/next, `shopify:block:select`). Cards per view: 4 (≥1280), 3 (900–1279; tablet card padding 20, 20px name), mobile swipe row of 284px cards. Desktop disabled prev arrow keeps Figma's full look (no fade); mobile hides it (Figma draws only "next"). |
| `fa-faq` | 414:354, 414:874 / 414:1008, 414:1313 | Native `<details>`; items open/close independently. Block settings "Open by default on desktop" (`open`) / "on mobile" (`open_mobile`); Liquid renders desktop defaults (also no-JS), an inline script applies mobile defaults ≤899px before paint; `fa-faq.js` only syncs `aria-expanded` + editor events (`shopify:section:load` re-applies mobile defaults, `shopify:block:select` opens without closing others). Defaults: desktop/tablet "first visit" + "does it hurt" open, mobile "first visit" only. Desktop (≥1100): first half of blocks (rounded up) in the left column; tablet one centred 820px column (questions would wrap in two columns); mobile one column, max 560px centred on larger phones. |
| `fa-book-visit` | top of 414:875 / top of 414:1462 | Live Google Maps iframe (key-less embed built from `map_address`, fallback: first Location contact line; `map_embed_url` overrides) in the Figma box (823×420 r10 at x = 51 / 351×323 r6; the desktop book-visit + footer group sits 1px in from the gutter as in Figma). Contact blocks; hours row = mail icon as in Figma (clock option exists). Side by side ≥900 (tablet: 400px details column, 36px title); mobile stacked, map height `clamp(323px, 46vw, 420px)` (323 at 375). `z-index: 1` so its flower overlaps the footer. |
| `fa-footer` | bottom of 414:875 / 414:1463 + 414:1555 | Facebook / Instagram / TikTok always render (link when URL known). Link columns: pick a menu, or a "Label \| URL" textarea fallback. Newsletter `{% form 'customer' %}` tagged `newsletter`. Shares one paper texture with book-visit (seamless split). |

**Other files**
- **Styles:** `assets/fa-<name>.css` per section (loaded from the section); shared `assets/fa-base.css`.
- **Scripts:** `fa-motion.js` (scroll reveals, all pages), `fa-testimonials.js`, `fa-faq.js`; header menu = inline IIFE.
- **Icons:** `snippets/fa-icon.liquid` = shared set: store, phone, clock (in Figma's 12px frame), x, facebook,
  instagram, star, menu, close, `chevron` (team arrow, FAQ, testimonials). Section-only drawings:
  `fa-icons-team` (instagram, facebook, x), `fa-icons-testimonials` (star, google), `fa-icons-footer` (pin, mail,
  phone, navigate, navigate-sm, instagram outline, facebook, tiktok, chevron-lg, chevron-md).

## Design system (`assets/fa-base.css`)

- **Colours (Figma variables):** `--fa-garnet` #922039 · `--fa-linen` #EEE1D1 · `--fa-clay` #A9505F ·
  `--fa-moss` #736D46 · `--fa-beige` #EFE7DB · `--fa-peach` #FFDAB1 · `--fa-paper` #F6F0E8 (header).
- **Fonts** (`snippets/fa-head.liquid`):
  - Display **Marisa Bold** (licensed, not bundled; always uppercase). Stand-in **Federo** with `size-adjust: 89%`,
    `ascent-override 88.5% / descent-override 16% / line-gap 0` (keeps every Figma line break; caps stay ~30%
    taller). Upload `assets/fa-marisa-bold.woff2` + tick "Marisa font uploaded".
  - Team roles use **Marisa Medium** (500): optional `assets/fa-marisa-medium.woff2` + `fa_marisa_medium_uploaded`;
    without it they render in Marisa Bold / Federo.
  - Body **Libre Caslon Condensed** 400/500/600, self-hosted (OFL); Figma uses Medium 500 throughout.
  - Top bar **Futura PT** Medium 12px: real font wins when installed; stand-in **Jost 500** (`size-adjust: 91.5%`).
  - CSS keeps Figma's own size / line-height / letter-spacing numbers — nothing changes when real fonts arrive.
- **Layout:** `.fa-container` = 1340px content, gutters 50 / 32 (≤1099) / `clamp(12px, 3.2vw, 32px)` (≤899: exactly 12px
  at 375 and below, ~25px at 768, 29px at 899). `--fa-section-pad` 120 / 96 / 50
  applied by `.fa-section--pad` (conditions, first visit, services, team, testimonials, FAQ; hero, CTA,
  book-visit, footer use their own Figma paddings). `.fa-card-row` = 3 × 438px + 12px gaps, centred.
- **Breakpoints (client decision 2026-09-30):** mobile ≤899 (the 375 Figma frame, scaled up) · tablet 900–1099 (not
  in Figma: a condensed desktop — 3-up conditions/first-visit/services, team row of 4, 3 testimonials per view,
  book-visit side by side, FAQ one column, header logo + Book Now + menu, stacked footer) · desktop ≥1100 (1440
  frame) with 1100–1279 tweaks (team panel inset, 3 testimonial cards, services title line-height) · ≤359 fallbacks
  (header bar, hero rating line, CTA title balance). Queries use literal `max-width: 899px` / `min-width: 900px`,
  `max-width: 1099px` / `min-width: 1100px` (plus 1279/1280, 359) — also in the hero `<source media>`, the FAQ inline
  script / `fa-faq.js` matchMedia and the header's `(min-width: 1100px)` listener. `≤1099` blocks hold values shared
  by tablet and mobile; `≤899` blocks override them with the Figma mobile values.
- **Wider phones (376–899):** the mobile design keeps Figma's card widths and type; intros are capped at 363px
  (`.fa-heading__text`, first visit / services keep their narrower Figma widths), the FAQ column at 560px, the
  newsletter field at 431px; textures use the 750px-wide mobile files (up to 1.2× at 899).
- **Text trimming:** `text-box: trim-both cap alphabetic` (`.fa-trim`, headings) mirrors Figma, so gaps use Figma's
  numbers. Firefox lacks support (gaps slightly larger).
- **Headings:** `.fa-heading__title` 60/50 −0.04em desktop (sections set their own Figma line-height), 48/44 tablet,
  32/29 −0.07em mobile; intro 16/27 → 14/22 (mobile max 363px).
- **Buttons:** `.fa-btn--primary` (garnet, linen label) / `.fa-btn--light`: 250×54 desktop, 170×39 mobile,
  Marisa 20 / 14px, −3%.
- **Mobile swipe row:** `.fa-swipe` — grid on desktop/tablet, scroll-snap flex row ≤899 (resets grid columns,
  centring and widths, bleeds to both screen edges, first card at the gutter, last card ends at the gutter; when
  every card fits the row centres via auto margins). Tune with `--fa-swipe-item` / `--fa-swipe-gap`.
- **Backgrounds and flowers:** `.fa-bg` (z −2) holds textures; `.fa-deco` (z −1) botanicals. A flower crossing a
  section edge belongs to the later section. Sections clip horizontally (no horizontal scroll at any width).
- **Dawn `:empty` rule:** Dawn's base.css hides `div:empty` etc. Photo/map boxes carry `.fa-media`
  (`.fa-section .fa-media:empty { display: block }`) so a block without a photo keeps its placeholder box; the CTA
  shade uses a two-class selector; the hero band is a pseudo-element. Don't add empty divs without this.

## Motion (round 3, client request 2026-09-30)

Figma has no motion data. Rule: the **resting state is the Figma state**; motion only changes how things arrive and
react. Calm and short: 150–350ms UI, 650ms reveals, 800ms photo zoom, one easing `cubic-bezier(.22,.61,.36,1)`.

- **Tokens** (`fa-base.css`, "Motion" block): `--fa-ease-out`, `--fa-dur-hover` .25s, `--fa-dur-ui` .35s,
  `--fa-dur-zoom` .8s, `--fa-dur-reveal` .65s (= `DURATION` in `fa-motion.js`), `--fa-zoom` 1.04, `--fa-nudge` 4px,
  `--fa-press` .98, `--fa-reveal-y` 20px (16px ≤899). Each section's hover/transition rules sit in a "Motion" block at
  the end of its CSS file and use these tokens.
- **Scroll reveals** (`assets/fa-motion.js`): `data-fa-reveal="up|fade"` on an element; add `data-fa-reveal-stagger`
  to a grid/list to reveal its children in an 80ms cascade (max 4 steps; children entering together cascade, so a
  second grid row cascades on its own). A horizontally scrolling row (mobile swipe rows) reveals as one group: the
  row rises, its cards fade in turn. Applied to: section headings (title → intro), conditions / first-visit / services /
  team card rows, the section buttons, CTA content, testimonials carousel (as a whole: the track clips vertical
  movement), FAQ heading + the whole question list (one group), book-visit map → details, footer brand + link columns
  (fade only). Not the header. IntersectionObserver (`rootMargin` −6% bottom), one-shot, no scroll listeners; after a
  reveal every helper class / custom property is removed. Transform + opacity only (no layout shift).
- **Progressive enhancement:** an inline script in `fa-head.liquid` adds `html.fa-motion` before first paint unless
  `request.design_mode` / `Shopify.designMode` or `prefers-reduced-motion: reduce`. `fa-motion.js` then hides
  (`.fa-reveal-hide`) only elements that are entirely below the viewport, so no-JS visitors, crawlers and
  above-the-fold content never see a hidden state; without IntersectionObserver nothing is hidden.
  `shopify:section:load` / `shopify:block:select` / `beforeprint` reveal immediately; `window.faMotion.revealAll()`.
- **Hero entrance** (`fa-hero.css`): meta, title, text, buttons rise 16px + fade, 0.05–0.29s delays, 0.7s. The photos
  are deliberately not animated: a transform animation on the LCP photo left Chrome rendering all page text with
  greyscale instead of subpixel anti-aliasing after it ended.
- **Hover / focus / press** (hover only inside `@media (hover: hover)`; keyboard focus mirrors it): buttons colour
  shift + .98 press; nav underline draws (also on focus); top-bar, contact, footer links fade a (transparent at rest)
  underline in; card photos zoom 1.04 inside their clipped frames (conditions, first visit, services — inside the
  clip-path notches — and team); "Learn more →" arrow slides 4px (the arrow is wrapped in `.fa-arrow-nudge` by
  `fa-conditions.liquid` when the label ends in "→"; relative offset so the underline stays, leaving a small gap
  under the moved arrow while hovered); team arrow turns white + chevron nudge; carousel arrows darken + chevron
  nudge; FAQ bar deepens (0.8 → 0.88); footer social squares brighten, newsletter arrow slides. Testimonial cards
  have no hover (a lift would be clipped by the scroll track).
- **State transitions:** FAQ open/close height via `::details-content` + `interpolate-size` (Chrome/Edge 131+, others
  open instantly), chevron and corner radius ease. Mobile/tablet menu panel fades + settles 8px via `@starting-style`
  and a discrete `display` transition — `hidden` stays the source of truth (toggle, Escape, focus unchanged).
  In-page anchors: `html.fa-motion:focus-within { scroll-behavior: smooth }` (only after an interaction, so scripted
  scrolls stay instant); carousel arrows already scroll smoothly from JS.
- **Reduced motion:** no `fa-motion` class → no reveals, no hero entrance; the tokens drop movement to 0 (no zoom,
  nudges, press, menu slide, FAQ height animation); colour/opacity changes stay (0.1s).
- **Verified** (harness `motion-test.mjs`, 149 checks at 320–1920; `faq-test.mjs` 228): hidden only below the fold,
  revealed on scroll, nothing left hidden after a full scroll, no horizontal overflow (also mid-reveal / while
  zoomed); reduced motion, no-JS and design mode never hide; hovers change and return; menu fade + Escape; FAQ
  height animates; no `will-change`. Resting geometry with motion on = motion off (0 of 870 elements differ at
  375 / 900 / 1024 / 1440).

## Homepage mobile — Figma **Mobile V1** (2026-10-14)

Frame `2794:1089` (375 × 11277) in section `2715:2467` "Mobile". Build at 375 matches every band height except the
testimonials (live Google reviews are longer than Figma's sample text). New section settings (default = old
behaviour, so other pages keep their mobile layouts): conditions `mobile_layout` grid (2 × 3 cards 171 × 281),
first visit `mobile_layout` stack (351 × 440 cards), book visit `button_label_2` / `button_link_2` (mobile-only linen
"Book now"). Shared mobile changes (apply on every page): header bar = 3 two-line items (10 / 14) at 44px, nav row
seal 22 + wordmark `fa-header-wordmark.png` (cut from Figma) at 53px; hero "centred" layout 495 tall, copy centred,
27% shade; linen feature cards 306 × 358; spacious CTA 77 / 76 padding (260 band); booking team left heading,
316 cards (photo 316 × 364), 250 × 54 button; membership 18px option padding, 16px list, square band corners; photo
gallery carousel 302 × 520 active / 242 × 420, square strip 334; blog posts 317 cards, garnet 18px "Read article";
trust bar 24 / 39 / 44 spacing; FAQ 24px title gap (homepage padding 80). Copy slips on mobile (different card texts,
"View services" button, "25 min") keep the desktop copy (shared settings).

## Homepage — Figma **V6** (2026-10-13, current source of truth)

Desktop frame `2669:25037` (1440 × 13091) in section `2669:25031` "V6 - Latest version" (tag 13-10-2026). The V5 frame
2612:3077 was deleted. Desktop-only sync (no V6 mobile frame). 1:1 render for the next diff: session scratchpad
`fig/v6-desktop.png` (re-export with `get_screenshot` maxDimension 13091 if gone). Process: `.claude/skills/figma-sync`.
Changes vs V5 (new settings default to the V5 look; homepage values in the parts):
- Header bar 38px desktop, phone link underlined at rest, Substack hidden (`show_substack` false).
- Hero: `eyebrow_stars` (5 clay pointed stars, new `fa-icon` "star-pointed"); `button_compact`.
- Shared `.fa-btn--compact` (fa-base.css): hug label, 42px padding, white label on garnet — setting `button_compact` on
  hero, conditions, first-visit, services.
- Conditions: brush characters `fa-conditions-brush-*.svg` (60px, gut 64), shade 20 (gut 30), botanical "raised" (28px
  higher, overlaps the hero, desktop only).
- Truth: four photos `fa-feature-cards-truth-*.jpg`, linen cards r2, heading is now a textarea (line break).
- First visit: intro width 560 (reproduces Figma's wrap; box is 592). Services: herbal photo `-shelf.jpg`.
- Team: specialties 14px full opacity; header button "Meet the team" → live /our-team.
- Testimonials: `card_style` square (r2, clay stars).
- Clinic carousel: five photos `fa-photo-gallery-clinic-1..5.jpg`, block `shade` (20/30%) and block `video` (muted loop,
  pause + sound buttons as drawn; controls only render when a video is uploaded — Figma has stills only).
- Gallery strip: no heading, `strip_shape` square 424 / 20 gap, `follow_position` edge_start (x 10), paddings 80 / 70.
- Concierge: no card / panel buttons, centred "Book concierge" (`button_label`), Virtual icon "video" (mask PNG),
  r2 cards/panel, garnet checklist, paddings 116 / 109 (`padding_top/bottom`).
- Posts: "Explore all blogs" (`button_label/link` → live /blog), cards r2 no stroke, moss titles, 38px gaps.
- Trust bar: mask icons `fa-trust-bar-icon-*.png` 32px, 14px gap, `icon_color` (4th icon grey #D9D9D9 as drawn).
- Book visit: rows hours/phone/email/address, underline "links" + block `no_underline` (address).
- Footer (global): plain social glyphs, 13px newsletter text, field r2 455 with "Join now" (`newsletter_button_label`),
  links 16/32 at 100% as typed, columns Explore / Visit / Education, copyright "Felice acupuncture ©2023-2026 • culver
  city", 42px top padding, 2px strip under the bar. Services / approach pages −60px @1440, −58 @375 (footer only).
Schema defaults moved to presets (photo-gallery heading, membership button labels) because assemble.py drops "" values.

## Homepage — Figma **V5 / "V3 - Latest version"** (2026-10-12, superseded by V6)

Desktop frame `2612:3077` (1440 × 12939) in section `2612:2287` "V3 - Latest version" (tag 11-10-2026), file
`B4QcctWXiG9ywP3uRA3coG`. **No mobile frame exists for this version**: mobile (≤899) follows the V4 mobile homepage and
the mobile versions of the same components (60px padding, 12px gutters, swipe rows); the footer follows the mobile
"Footer" component 2519:4184 (accordion). Ask the client for a V5 mobile frame before final sign-off.

`templates/index.json` is now GENERATED from `scratchpad/home-v5/parts/NN-<key>.json` by `scratchpad/home-v5/assemble.py`
(seeded from the V4 index.json; original kept as `home-v5/index.before-v5.json`). Order and sections:

| key | section | V5 notes |
|---|---|---|
| hero | `fa-hero` | NEW layout `centered` (714 tall, centred copy, blurred 44% shade) + `eyebrow` ("Culver City's ★ 5.0-Rated Acupuncture Clinic"; replaces the rating line) |
| conditions | `fa-conditions` | NEW `button_style` (light / primary), block `glyph_height`; set-type character SVGs `fa-conditions-type-*.svg`; "Book now" → Jane |
| truth | `fa-feature-cards` | NEW `card_style` (moss / linen), `heading_color`, `heading_width`, `heading_line_height`; block title is a textarea |
| first_visit | `fa-first-visit` | NEW botanical style "corners", block `tag` (tab over the photo), `card_text_layout` even; "Book your first visit" |
| clinic | **`fa-photo-gallery`** (new) | layout carousel (arrows, swipe, side-photo click) or strip (curved edges); follow line (Instagram / Facebook); botanical; `fa-photo-gallery.js` |
| services | `fa-services` | NEW `text_width` custom + `text_width_custom`; homepage botanicals off (the clinic / CTA sections draw the crossing flowers) |
| cta_banner | `fa-cta-banner` | NEW layout "spacious", `show_botanicals`; `text` has no schema default any more (concierge sets its own) |
| team | `fa-team` | NEW `layout` booking ("Your care team": header button, per-member button label / link / style, Substack); classic layout unchanged |
| testimonials | `fa-testimonials` | NEW `arrow_size` (large 38.3 on the homepage); homepage botanical off (team draws it) |
| concierge | **`fa-membership`** (new) | option-card blocks (pin / phone icon, text, button) + checklist blocks + panel; corners setting; buttons `#` per the client |
| faq | `fa-faq` | 11 questions (5 + 6 via `left_column_count`), NEW `heading_width`, `answer_size`, `background_asset`, `flower_position`, `padding_bottom`; only "first visit" answer from Figma — the rest are placeholders; "What should I wear…" drawn open with no answer |
| gallery | `fa-photo-gallery` | strip layout with curved edges |
| posts | **`fa-blog-posts`** (new) | latest articles of a chosen blog (date, read time, first tag) or manual post blocks; cards link to the live blog posts until a Shopify blog exists |
| book_visit | `fa-book-visit` | NEW `contact_underline` (all), `map_height_mobile` (compact 248) |

Header (all pages): bar 14px Futura, "Call or text" phone label, hours "Open 7 days a week, 8 AM to 8 PM", socials
Facebook / Instagram / Substack (`show_x`, `show_substack`, `substack_url`; new snippet `fa-header-social.liquid`);
nav = Our Approach, Services ▾, Team, Education ▾ (Conditions and Events removed). Footer (all pages): V5 "Footer Web"
— logo row ≥900 (`fa-footer-logo-row.png`), "Join the TCM collective" newsletter copy, TikTok hidden (`show_tiktok`),
mobile accordion columns (button in each h2, Explore open by default, no-JS shows all). Services / Our Approach page
heights therefore changed only by the footer: services 9475 @375 / 10968 @1440, approach 8512 / 9267.
Homepage build height 13071 @1440 (Figma 12939; stand-in font), 9533 @375. Geometry baseline re-saved
(`scratchpad/svc/home-geom-base.json`; V4 baseline kept as `home-geom-base-pre-v5.json`).

Copy / content to confirm with the client (reproduced as drawn): hero says 5.0-rated (elsewhere 4.9); bar hours
"8 AM to 8 PM" vs book-visit "9AM – 8PM"; Hormones card text duplicates Anxiety; the four "truth" cards share one food
photo and card 3 "We do read labs"; first-visit durations 20 + 30 + 45 vs "75-minute consultation"; the clinic and
gallery repeat one photo (gallery source only 640px); blog cards all "Mar 5, 2025 · 3 min read"; FAQ placeholder
answers and the open "What should I wear…" with no answer; "Join the waitlist" (Dr. Felice) has no link; Facebook /
Substack (practice) URLs unknown; copyright "Yandara".

## Homepage — Figma **V4** (2026-10-02)

Source: file `B4QcctWXiG9ywP3uRA3coG` ("02. Felice Acupuncture | Internal"), section `2237:294` "V4" (tag 28-09-2026):
desktop `2237:297` (1440 × 8898), mobile `2264:776` (375 × 6243). Diffed in Figma against the dump of the version the
build followed (qQia… 414:255 / 414:975; scratchpad `figma-cache/v4/`):
- Desktop: every text, style and box identical (±0.3px) except the conditions band — row-1 photo shade 10 → 15%,
  Chinese characters as white brush vectors (the services-page `fa-conditions-chars-*.svg`, block "Fallback
  characters asset").
- Mobile (+132px): conditions / first-visit / services / team / testimonials / FAQ use 60px top and bottom padding
  (was 50) and 16px title → intro gaps (conditions, first visit), conditions button 24px below the cards; botanicals:
  conditions flower turned 76.11deg (mirrored) 132.2 × 101.1 box at x 272.4 / −34.8, first-visit flower 148.1 × 191.3
  at −36 / −119, NEW services flower (145.9 × 188.5 at 272 / −111), team flower (122 × 97 at 279 / −21), testimonials
  flower (= the services small mobile one) and FAQ flower (107.3 × 86 at 283 / −3; setting "Mobile botanical size:
  Small"). All verified to ±0.1px.
- New settings: `padding_mobile` on fa-services / fa-team; `anchor_id` on fa-conditions / fa-first-visit / fa-faq
  (homepage: conditions, first-visit, faq); `flower_mobile_size` on fa-faq.
- Kept as before (copy rule / designer slips): mobile condition order (Figma: Gut, Sleep, Skin last three) and the
  mobile Gut / Sleep / Skin texts, first-visit / services mobile button labels, "Dr. sam audette" on mobile team card 1,
  testimonials intro "Pulled live from Google. 5.0 …" (Figma copy on the homepage).
- Links (from the live site, no live content pulled): Jane https://feliceacupuncture.janeapp.com/ on every booking
  button (header, hero, first visit, CTA, footer "Book an Appointment"); nav Services → /in-clinic-services, Our
  Approach → /our-approach, Team → /our-team, Education → /e-courses (all https://www.feliceacupuncture.com/…),
  Conditions → /#conditions, Events → none on the live site (`#`); hero "First visit details" → /#first-visit;
  condition "Learn more" + "View services" and service cards → /in-clinic-services; team cards → /our-team; footer
  Explore / Visit / Learn, Terms, Privacy, Concierge, Blog, E-books (Resources) → live pages, "What We Treat" /
  "FAQs" / "New Patients" → homepage anchors, Contact → mailto, Newsletter → the footer form. Absolute live URLs
  will need updating to Shopify page URLs once the domain moves to Shopify.

## Article page (`templates/article.json`) — Figma **V2** (2026-10-14)

Desktop frame `2719:22580` (1440 × 7207); desktop only. Replaces Dawn's main-article (default kept in the session
backup; blog comments are not shown). **NEW `fa-article`**: header from the article (eyebrow setting · author,
title, subtitle = metafield `custom.subtitle`, byline · date · read time, image 1200 × 570), text 818 + sidebar 356:
"In this article" lists the article's H2s (ids `section-N` added in Liquid), booking box (Jane link, tel note),
mid-article e-book customer form inserted before the Nth H2 (`ebook_before`, default 2; end of text if fewer),
share links (Facebook / X / LinkedIn / copy link; mask icons `fa-article-share-*.png`), bg `fa-team-bg.jpg`.
Then ready (blog-page CTA, NEW `content_offset` 28), team (home), related (team posts, heading "Related articles",
`padding_bottom` 100), gallery, trust, book visit. Verified with Figma's own text in a temporary copy of the section
(removed): header / text / sidebar positions = Figma; deltas from Figma itself: first H2 drawn with a 24px line height
(others 46), the organ paragraphs separated by blank lines (35) instead of 24px paragraph gaps.

## Blog page (`templates/page.blogs.json`) — Figma **V1** (2026-10-14)

Desktop frame `2719:19545` (1440 × 5820); desktop only. A **page** template (user decision), not `blog.json`: create
a page "Blog" and assign template `blogs` (preview with `?view=blogs`); point "Explore all blogs" / footer "Blog" at it
once it exists. Bands: hero (`fa-hero` page, photos `fa-page-hero-blog-left/right.jpg` cut from Figma's originals, 488,
shade 20, two 250px buttons) · articles (**NEW `fa-blog-listing`**: blog picker (`news`), `paginate` 7 per page, the
newest article featured on page 1 (photo 700 + body, r5), cards 437 × 476 three to a row (r2); meta = date · read
time · first tag (author on the featured post); excerpt = article excerpt or the start of the content; botanical
top right; bg `fa-blog-posts-bg.jpg`) · ready (`fa-cta-banner` NEW layout `buttons`, bundled photo `treatment`
(`fa-cta-banner-treatment(-2x).jpg`), `button_style`, second button; heading is now a textarea for hand breaks) ·
e-book (**NEW `fa-signup`**: Shopify customer form, first / last name + email, tags `newsletter, ebook-gut-health`;
uses fa-inquiry.css field styles; the theme does not send the e-book — automate it on the tag) · CTA, gallery (home),
trust, book visit. Build 1440: every band = Figma (gallery −1). Open: the e-book intro in Figma is the concierge copy
(designer placeholder, kept); dev-store articles have no images / tags.

## E-Books page (`templates/page.books.json`) — Figma **V2** (2026-10-14)

Desktop frame `2792:3796` (1440 × 7939) in section `2770:5749` "V2 - Latest Version" (tag 14-10-2026); desktop only.
Store page `e-books` exists: assign template `books` (preview `?view=books`; header / footer E-books links use it).
Bands: e-book form (`fa-signup` NEW `layout` "split": cover `fa-signup-ebook-cover.jpg` 433 × 545 r10 + form, title
62 / 54 in a 560px box) · truth (homepage) · conditions (homepage, own botanical off) · ready (blog page) · newsletter
(`fa-signup` NEW `layout` "inline": light band `fa-signup-bg-light.jpg`, one email field with the button inside, tag
`newsletter`) · course (**NEW `fa-media-text`**: photo `fa-media-text-course.jpg` 581 × 461 r10, title 62 / 54, text,
linen + outline buttons → Kajabi checkout / E-Courses page) · testimonials (homepage) · gallery (blog page) · posts,
trust, book visit. Flowers across section lines: **NEW `fa-botanical`** — a zero-height section between two sections
that draws `fa-first-visit-botanical.png` from the Figma layer's X / Y (Y from the next section's top), size,
rotation, flip, zoom (crop fills) and opacity; three on this page. Build 1440: every band = Figma except the
testimonials (live Google reviews are longer than Figma's sample text, so the cards run taller — same on every page).

## E-Courses page (`templates/page.courses.json`) — Figma **V1** (2026-10-14)

Desktop frame `2770:2692` (1440 × 8321) in section `2760:4055` "Copy review · E-Courses" (tag 14-10-2026); desktop
only. Store page `e-courses` exists: assign template `courses` (preview `?view=courses`; header / footer E-courses links
already use it). Bands: hero (`fa-hero` page, one photo `fa-page-hero-courses.jpg` = Figma crop with its −13% tone
baked in, shade 35, `padding_top` 122, `copy_width` 534 (schema min lowered to 532), one 250px "Enroll now") ·
included (**NEW `fa-checklist`**: heading, photo 672 × 495 r2 + ticked items (title / text blocks) + button,
bg `fa-checklist-bg.jpg`) · modules (**NEW `fa-modules`**: bento grid, first five blocks placed as drawn, photos
`fa-modules-1/2/3/5.jpg` (3 = 4 in Figma), bg `fa-modules-bg.jpg`, card texture `fa-checklist-bg.jpg`) · teacher
(`fa-profile` + NEW `photo_height` 503, photo `fa-profile-felice-chan-course.jpg`) · ready (blog page CTA) · pillars
(`fa-feature-cards` moss heading on `fa-feature-cards-pillars-light-bg.jpg`) · e-book (`fa-signup` + NEW
`show_botanicals`: two copies of `fa-first-visit-botanical.png` with Figma's matrices, z-index 2) · FAQ (`fa-faq` NEW
`flower_position` bottom_right, desktop only) · gallery (blog page) · posts, trust, book visit. Enroll links go to the
live site's Kajabi checkout. Build 1440: every band = Figma (total 8318 vs 8321).

## Concierge page (`templates/page.concierge.json`) — Figma **V1** (2026-10-14)

Desktop frame `2644:15168` (1440 × 10106) in section `2644:14066` "Copy review" (tag 12-10-2026); desktop only. No
store page yet: create page "Concierge" (handle `concierge`) and assign template `concierge` (preview meanwhile with
`?view=concierge` on any page). Bands: hero (services photos, 481, shade 35, `padding_top` 182) · approach
(`fa-membership` NEW `layout` split + `botanical` top_left: text + button left, option cards stacked right, linen /
moss alternating r8; a blank line in a card text = new paragraph) · includes (`fa-glyph-columns` NEW `style` numbered +
`botanical` rising_right, blocks `number` / `items` check list, bg `fa-faq-bg.jpg`) · inquiry (**NEW `fa-inquiry`**:
Shopify contact form → store email; fields first/last name, email, phone, interest select, message, inquiring-for
radios; options from the live site; `fa-inquiry-bg.jpg` composited from Figma's layers; radios in self-hosted Libre
Caslon Text) · expect (`fa-first-visit` NEW `card_style` moss: olive card texture `fa-first-visit-moss-card.jpg`, linen
frame / tag on the photo edge, no badges; photos re-cut from Figma's originals) · then pillars (approach), truth
(home), CTA, testimonials, FAQ, gallery, posts, trust, book visit (services copies). Botanicals: the first-visit
botanical rendered at Figma's transform (`fa-concierge-botanical-left/right.png`). Build 1440: every band ±1px of
Figma except testimonials (real reviews). Open: "Book now" (approach) has no link (concierge booking unlinked, client
decision); numbers 01–04 and step numbers are Marisa Regular in Figma (hosted file is Bold only).

## In-Clinic TCM Services page (`templates/page.services.json`) — Figma **V5** (2026-10-14, current)

Desktop frame `2669:28405` (1440 × 12043) in section `2669:28400` "V5 - Latest version" (tag 13-10-2026); desktop
only, no V5 mobile frame (mobile keeps the v2 treatments / hero rules). Same store page + URL as v2
(`/pages/services?view=services`); v2 template backed up in the session scratchpad. Band diff vs other renders: only
hero + treatments are new; first visit / FAQ / gallery / posts = Our Team, testimonials / acupuncture / science /
trust = Our Approach, CTA ("Your first step…") / concierge / book visit = homepage (sections copied with their blocks).
- Hero: services photos (left / right), 408 tall (`min_height` is now a number setting), shade 20, `padding_top`
  136, `copy_width` 672 (the one-line 668px title); `.fa-hero__content` now widens with `copy_width` > 658 (Our Team's
  698 used to be capped at 658).
- Treatments (`fa-treatments`, only used here): V5 desktop = 120 padding, 683/682 × 500 photos r18 first on odd rows,
  24px row gap, block `price_tags` (linen tags, Marisa 20 garnet, square; `price_tags_compact` for Contrast Therapy),
  `paragraph_gap` (trimmed paragraphs, 24; Herbal 41), `copy_gap` (32; Cupping 24, Herbal 36), lead in Marisa 18
  −6%, hugging "Book now". The hosted Marisa woff2 has no "·": tags draw a 3.5px CSS dot. Photos re-cut at 2× from the
  Wix originals (Figma's uploads are 280px). Build 1440: band 3607 = Figma, text columns ±1px.
- Kept as drawn (confirm with the client): Cosmetic Acupuncture shows 推拿 (Tui Na characters); the herbal photo is
  stretched ~17% vertically in Figma (reproduced); Contrast Therapy's text column sits 10px further right than Figma's
  (Figma's 609px column); testimonials show the 4 real Google reviews (taller than Figma's placeholders).

## Our Services page (`templates/page.services.json`) — Figma **v2** (2026-10-01, superseded by V5)

Source of truth: file `B4QcctWXiG9ywP3uRA3coG` ("02. Felice Acupuncture | Internal"), section `2263:2285` "v2"
(tag 30-09-2026): desktop `2263:2286` 1440×10924, **mobile `2264:6705` 375×9589** (mobile ≤899 reproduces it).
v1 (`qQia…` 394:3067) is superseded. Dump: `scratchpad/figma-cache/v2-services.dump.md` (session scratchpad).
Assign in admin: Pages → "Our Services" → template **page.services**; point the header "Services" nav at it.

| Key | Section | v2 desktop / mobile | What is specific to this page |
|---|---|---|---|
| `hero` | `fa-hero` | 2263:2437 / 2264:6738+7459 | `layout: page` (481 + 7 under stats), title "Our TCM Services", copy centred; `fallback_left/right` = `fa-page-hero-services-*`; mobile 422 tall with the LEFT photo (`mobile_photo: left`), even 26% shade (`overlay_opacity_mobile`). |
| `stats` | `fa-stats-bar` | 2263:2486 / 2264:7504 | Clay strip; **ticker at every width** (client request 2026-10-01; desktop at Figma 24px / 44px gaps / 17.25px swirls, 49px strip, ~48px/s; mobile 14px, 37px, ~28px/s): the real list + `aria-hidden inert` copies (enough to cover screens up to 2560px; 4 lists for the default copy), CSS transform loop, durations from copy length, pauses on hover / focus (section `tabindex=0`; dropped only for reduced motion ≥900), blank stat blocks skipped. Reduced motion: Figma's static centred desktop row ≥900, static swipe row below. |
| `service_menu` | `fa-services` | 2263:2528 / 2264:7630 | `card_layout: price_list` (`fa-services--menu`), price / duration rows, `anchor` → `#treatment-<handle>`; 6th card "virtual consults." (unlinked); block `fallback_asset_mobile`. No eyebrow (setting removed). |
| `treatments` | `fa-treatments` | 2263:2686 / 2264:8016 | Rows with `id="treatment-<handle>"`; eyebrow "Our team" desktop only; owns botanicals 2857 / 8321 (`botanical`); mobile assets `fa-treatments-*-mobile.jpg`, `background_mobile`; block `shade_mobile`, `glyph_height_mobile`, `button_compact_mobile`; rows 1–2 characters 14.5px low as drawn (`glyph_y`). |
| `conditions` | `fa-conditions` | 2263:2289 / 2264:6708 | Homepage card texts; characters = Figma brush vectors `fa-conditions-chars-*.svg` (block `glyph_image` / `glyph_asset`); block `shade` (row 1 15%); `botanical_style: left` (2858 / 6737); `padding_mobile`, `text_gap_mobile`, `heading_line_height_mobile`, `button_gap_mobile`; padding 120/109. |
| `first_visit` | `fa-first-visit` | 2263:2775 / 2264:6870 | Homepage duration cards; `botanical_style: right` (2845 / 6977); `padding_mobile` 60, `text_gap_mobile` 16. (`inline` layout removed.) |
| `concierge` | `fa-cta-banner` | 2263:2847 / 2265:8299 | `layout: tall` 179/166 ≥1100 (reviews overlaps the 667 band by 13px; photo `object-position` keeps the 667 crop), tablet 132/132, mobile 105/105; concierge photo, mobile export <750, `bg_wide` 750–899. No eyebrow / flourishes. |
| `testimonials` | `fa-testimonials` | 2263:2861 / 2264:7058 | Homepage desktop texture; `mobile_background_asset` = `fa-testimonials-bg-services.jpg`; `botanical_style: small`; `padding_mobile` 60. |
| `faq` | `fa-faq` | 2263:2958 / 2264:7162 | `show_flower` (homepage position) + `show_flower_mobile` (7210); `padding_mobile` 60. |
| `book_visit` | `fa-book-visit` | 2263:3022 / 2264:7212 | Same as homepage, `show_flower: true`. |

- Eyebrows: v2 removed them everywhere except treatments desktop; the `eyebrow` setting was deleted from fa-services,
  fa-cta-banner, fa-testimonials and fa-faq (unused); still available on fa-conditions / fa-first-visit /
  fa-book-visit / fa-treatments. Shared `snippets/fa-eyebrow.liquid` (+3% tracking, `tone: 'light'`) stays.
- Every new setting defaults to the homepage behaviour; homepage geometry verified identical (0 / 870 at 375 / 900 /
  1440) after the v2 update; FAQ suite 228/228; `validate_templates.py` ALL VALID.
- v2 mobile uses 60px section padding (homepage 50): handled per section (`padding_mobile` on first-visit, FAQ,
  testimonials, conditions); a shared token would be a possible cleanup.
- Page heights (stand-in font): 10,999px @1440 (Figma 10,924), 9,622px @375 (Figma 9,589).
- **Mobile copy differences kept as desktop copy** (settings shared): "View Services" on the menu / first-visit /
  concierge mobile buttons, first-visit mobile heading "What to expect…" / "Your 75-minute…", mobile condition order
  and Gut / Sleep / Skin texts, all mobile reviewers "Sophia Mart", treatment row 6 mobile price.
- **Services fixes applied 2026-10-01** (the earlier client list; all editable in the Theme Editor):
  1. Prices / session lengths from the live in-clinic page: Acupuncture $200–$300 · 60; Cosmetic $275 · 60; Cupping
     $100–$200 · 30; Tui Na $275 · 60; Contrast $75–$100 · 60; Herbal "Price varies" (60 min kept from Figma, not on
     the live site). Same values on the menu cards and treatment rows.
  2. 6th menu card "virtual consults." -> "Herbal Wellness" (its photo, the 6th treatment row, "Jump to a treatment"),
     price label "Price" / "Varies" via the new per-card `price_label`, jumps to #treatment-herbal-wellness.
  3. Row 1 title "Thai Massage" -> "Acupuncture — Treatment"; rows 1–2 characters centred (`glyph_y` 0); row 2
     characters 推拿 -> 焕肤 (`fa-treatments-glyph-cosmetic-acupuncture.png`, rendered from the Skin brush vector in
     pale pink, 2x).
  4. Intros rewritten from the designer notes: menu "Six treatments, each with its price and session length…",
     conditions "Six of the concerns we see most often…", first visit "Seventy-five minutes…" (matches the 75-minute
     consultation elsewhere), reviews "What our patients say on Google: 4.9 stars across 42 reviews."
  5. Links: condition "Learn more →" jump to treatment rows (Pain / Anxiety / Sleep -> acupuncture, Hormones / Gut ->
     herbal wellness, Skin -> cosmetic acupuncture; block `anchor`), "View Services" -> #service-menu (section
     `button_anchor`; fa-services `anchor_id` = service-menu). "Book concierge" (hero + concierge band) left unlinked
     on request until the concierge flow exists.
  6. Stats strip: tab stop only up to 899px (inline script), desktop static row no longer focusable.
  7. Photos replaced with the client's originals from the live Wix site (same crops, colour-checked): the six desktop
     treatment photos (were 280px, now 628–1366px), `fa-conditions-sleep.jpg` (900), `fa-page-hero-services-right.jpg`
     (1440), menu cosmetic / contrast cards (816). Low-res originals kept in the scratchpad `removed-assets/lowres/`.
- **Still to confirm / supply:** `fa-page-hero-services-left.jpg` (630px, no original on the live site), the herbal
  wellness photos (not on the live site at higher res), concierge link, homepage "View services" / "Learn more" URLs
  (need the services page handle), Marisa font files, real FAQ answers, social URLs, copyright name.
- **Per-section QA pass 2026-10-01** (10 agents, services page, 1440 / 375 + 375–1920 sweep): all bands match Figma v2
  within tolerance except stand-in-font deltas. Fixes: hero uploaded-image srcsets up to 1920 / mobile 1800; stats
  short-list ticker coverage, blank blocks skipped, reduced-motion row centred; service-menu labels may wrap, wrapped
  card titles line-height 1.1; treatments glyph img real width/height; concierge wide photo 1600px original,
  paragraph strip bug, `aria-labelledby` only with a heading; testimonials keyboard focus kept when an arrow disables,
  Google mark pinned right on empty meta, short rows centred; FAQ blank questions skipped, single column spans,
  balanced question wraps ≥900; book-visit blank contact rows skipped; header `tel:` gets +1; global two-tone
  `.fa-btn:focus-visible` ring (garnet-dark ring + linen halo, replaces the hero / first-visit overrides).
- **QA leftovers (assets / client):** treatment character PNGs 1–5 are 1x in Figma (61–79px wide, soft at 2x DPR;
  designer export needed); desktop textures 1440 wide (faq / first-visit / testimonials / book-visit bg: 1x at 2x
  DPR); concierge desktop original only 1024px; anxiety / hormones condition photos 616 / 800px; first-visit mobile
  texture lacks Figma's ~30px fade to linen at the bottom (shared with homepage); header "Book now" opens Jane in the
  same tab while the footer uses a new tab; copy slips "body work" (Tui Na) and "a reset, and relaxation" (Contrast).

### Header redesign (2026-10-12, Figma navigation `2519:3714` "Design V1 (Hashir 08-10)")
- Desktop: Services and Education items get a 9 x 3 chevron (8px after the label) and a dropdown: 5px-radius panel
  (#e4d4c0 + `fa-header-dropdown-bg.jpg`, texture 30% multiply baked in), 17px padding, items 18px apart (Marisa 18
  uppercase), a 17px triangle rising 10px; panel top 68px below the nav row top, centred under the item. Opens on hover
  (pointer, ≥1100) or with the chevron button (aria-expanded; Escape returns focus; outside click / focus leaving
  closes; one open at a time; Theme Editor block select opens it). Nav row base is white under the 80% texture (render
  match), nav gap 20 at 1100–1279.
- Mobile / tablet (<1100) menu panel: fills the screen below the header row (#d9c39c + `fa-header-menu-bg.jpg`, 22%
  multiply), Home first (setting `show_home_link` / `home_label`), rows 45px apart with a 0-height 10% black rule,
  current page in moss, items with sub-links are accordions (13 x 5 chevron, numbered sub-links Marisa Medium 18 at 80%,
  14px under the parent, 16px apart), full-width Book Now (20px label) at the foot; hours / phone list removed (not in
  the design). Close icon = Figma's 9.8px X.
- Data: link blocks gain `sub_links` ("Label | URL" lines); an optional section `menu` (link_list) replaces the blocks
  and uses Shopify's nested links. Markup per item in `snippets/fa-header-item.liquid`, chevrons in
  `snippets/fa-header-caret.liquid`. Header group: Services → In-Clinic (/pages/services?view=services), Concierge
  (live /concierge); Education → E-Courses, E-Books, Blog (live pages).
- Figma slips not copied: the mobile Education accordion repeats In-Clinic / Concierge (built with the Education
  sub-links), the collapsed mobile frame draws the chevrons pointing up (built pointing down when closed).
- Menu QA (2026-10-12): dropdown fill corrected to Figma's boolean fill (#d9c39c + texture 22%, re-baked
  `fa-header-dropdown-bg.jpg`), pointer = the 10 x 10 tip; open / hovered nav label gets Figma's 0.2px stroke; chevron
  buttons named "{label} submenu"; the menu panel is a `nav` landmark; Escape also hides a hover-opened dropdown and
  hovering an item closes a click-opened sibling; block select below 1100 expands that accordion; mobile hit areas
  enlarged (layout unchanged); long menus wrap to a second centred nav line instead of running under Book Now.
  Behaviour suite `scratchpad/harness/qa-hv2-behav.mjs` 68/68. Known: on mobile a parent item with sub-links is
  accordion-only (its own URL is reachable through a sub-link); Education's Figma panel has 13px bottom padding (not
  copied, 17 like Services).
- The same Figma frame also holds new desktop and mobile (accordion) footer designs — not implemented yet.

### Homepage QA pass (2026-10-07, 8 agents, Figma V4)
All bands match V4 within tolerance apart from stand-in-font deltas. Fixes:
- Header: menu script rewritten — Tab / Shift+Tab cycle inside the header while the menu is open, Escape from
  anywhere (focus back to the toggle), closes on outside click / focus leaving the header, Theme Editor section
  load/unload + block select/deselect, panel height capped below the header row (`--fa-menu-top`), `aria-current` on
  links to the current page, blank link blocks skipped, address link via fa-link-target, empty mobile bar hidden,
  no-JS fallback (`@media (scripting: none)`), mobile row on white under the 80% texture, nav gap 24 at 1100–1279.
- Hero: stars `aria-hidden` when rating text is set.
- Conditions: card body bottom padding (desktop 24, mobile 12) so long merchant copy never touches.
- First visit: block setting `alt` (photo description; filled on all three pages); `text-wrap: pretty` 900–1439.
- Services: card title line-height 1.1 at all widths; mobile swipe row has room for the focus ring.
- CTA banner: mobile padding 115 / 114 (V4); the studio mobile photo only ≤749 (desktop photo 750–899).
- Team: `aria-labelledby` only with a heading; social labels without a name; social links via fa-link-target;
  list is a wrapping flex row (short rows centred).
- Testimonials: homepage mobile texture `fa-testimonials-bg-services.jpg` (V4 2264:2515); 635px intro width only
  ≥900; carousel gap only after a heading; arrows hidden until the script runs.
- FAQ: `text-wrap: balance` ≤359px.
- Book visit: Maps button via fa-link-target and the shared two-tone focus ring. Footer: 4th link column wraps;
  newsletter focus ring visible in forced-colors mode.
- Homepage geometry baseline re-saved after the pass (`scratchpad/svc/home-geom-base.json`).
- Internal links (2026-10-07, set outside this pipeline and kept): header Services → `/pages/services?view=services`,
  Our Approach → `/pages/our-approach?view=approach`; homepage conditions / services "View services" buttons →
  `/pages/services?view=services`.
- Copy slips noted: team intro ends with a stray `"` in Figma (build omits it); mobile hero title has no full stop.

## Fonts, hero video, links, Book Now (2026-10-14, later)

- **Marisa now loads** from theme setting "Marisa font URL" (default: the client's Marisa Bold upload on the live Wix
  site, CORS *), or from `assets/fa-marisa-bold.woff2` when uploaded + "Marisa font uploaded" ticked. Tenor Sans is
  only the last fallback. Headings now match Figma widths / heights. Upload the licensed file before Wix closes.
- Hero: optional background video (file / URL / poster) — see the skill. Header: "Book Now" dropdown
  (`button_sub_links`: In-Clinic → Jane Initial Visit, Concierge → blank). Nav order = live site: Our Approach, Our
  Team, Our Services, Education. Links use `?view=` template URLs; concierge / terms / privacy blank (no pages).

## Homepage update + dev notes (2026-10-14; Figma 2669:25037, notes frame 2728:741)

- Display stand-in is now **Tenor Sans** (`assets/fa-tenor-sans-400.woff2`, size-adjust 80%, ascent 93.1% / descent
  23.1%) — Federo was ~35% heavier than Marisa. Figma still uses Marisa Bold / Medium + Libre Caslon Condensed
  (the Actay / Inter layers are hidden leftovers). Upload the licensed Marisa files to replace the stand-in.
- Figma changes: nav "Our Services" / "Our Team"; homepage gallery without the reviews line (120 / 120 padding, new
  `row_gap` 32).
- Dev notes applied: Jane Initial Visit link (`…/#/discipline/1/treatment/1`) on every in-clinic booking button (all
  templates, header, footer); staff links (Sam /2, Caroline /4, Sarah /3), Dr. Felice waitlist mailto; concierge →
  /pages/concierge; Learn more / View services → /pages/in-clinic-services; team → /pages/our-team; header nav handles
  per the notes; blog section reads blog "news", Explore → /blogs/news; review links → Google Maps; FAQ
  `single_open` (one at a time, all closed) + FAQPage JSON-LD (`faq_schema`); Herbal Wellness card → Virtual Wellness
  (copy from the notes, photo unchanged); header `sticky_bar` (mobile Call or text + Book now).
- Not done (needs input / design): "Book now ▾" header dropdown, hero video background, review "Read more" expansion,
  review count wording ("42 reviews" is in the Figma copy; notes say no hardcoded count), Facebook URL, MailerLite
  newsletter (theme uses the Shopify customer form), Virtual Wellness photo.

## QA pass 2026-10-13 (homepage V6, Our Approach V3, Our Team V3) — and scratchpad loss

The old session scratchpad (harness files, `home-v5/parts`, `approach/parts`, assemble / validate scripts, Figma renders)
was wiped. **Edit `templates/*.json` directly** from now on (keep "" values; check setting ids exist). The running
harness on :9393 still serves; restart needs a rebuilt `serve.mjs`.
Text QA (`.claude/skills/figma-sync/scripts/qa-text.mjs` + compact `use_figma` dumps): all Figma texts matched on the
three pages; fixed — homepage gallery updated to the new Figma band (reviews line, arrows, centred follow, 766 tall;
same settings as the team page), first-visit "even" cards tab tracking -2% + texts at 80%, conditions / services
setting "Intro text size" (16/25 home + approach, 18/29 team), philosophy columns 78px apart, more-ways intro 16/27,
team focus line 23px. Remaining deltas are stand-in font (+9–17px per band with a Marisa heading, narrower caps) and
designer slips kept consistent: services Herbal Wellness text 24px lines, science card 4 text 22.4px lines,
Dr. Sarah's Substack button linen (others white).

## Client review 2026-10-14 (PDF + chat screenshot)

- Square corners (`var(--fa-radius)`) instead of Figma's r8/r12: FAQ items (all pages, open state too), book-visit
  "Open in Google Maps" button, pillars cards (`fa-feature-cards` `moss_large`).
- Team gallery: reviews line removed (`review_label` ""). Team hero `photo_position` 50 → 0 (Figma is top-aligned;
  centred crop cut the foliage on wide screens). Approach hero 47% already matches.
- Testimonials (home, team, approach): the 4 real Google reviews from the live site (no dates / photos there →
  Google-style initial avatar). New `widget_code` setting + `@app` block: a live Google reviews widget replaces the cards.
- Team profiles: second buttons linked (Felice / Caroline / Sarah Substacks from the live site; Sam's Blogs → /blogs/news).
- Clinic Facebook (from the user): https://www.facebook.com/feliceacupuncture/ — header, footer, all galleries, Dawn
  `social_facebook_link`; team-card Facebook icons fall back to it (like Instagram). Practitioners' personal Instagram /
  Facebook still unknown (ask the client).

- Live Google reviews (2026-10-14): Featurable free API (1 widget, 15 reviews, unlimited views; its embed shows branding,
  the API does not). Theme setting `fa_reviews_widget_id` → `fa-testimonials.js` refills the Figma cards lazily (1 h
  sessionStorage cache); static review blocks stay as fallback. Empty until the client creates the widget.

## Our Team page (`templates/page.team.json`) — Figma V3 `2669:33510` (2026-10-13)

Desktop frame 1440 × 12044 in section `2669:30124`; desktop-only (no mobile frame). Generated by
`scratchpad/team_template.py` (keeps "" values, unlike the assemble scripts). Assign the template to the Team page in
the admin (suffix `team`). Order and reuse:
hero (`fa-hero` page: NEW `tagline`, `copy_width` 698, min height 527) · four `fa-profile` sections (NEW `style` team —
616 × 566 photo, specialties in the quote field —, `note`, `padding_top/bottom` 120/16/16/120, olive bg each) ·
practitioners (`fa-conditions` NEW `card_style` booking + block `practitioners` "Name | URL" + `book_label`, `tone`
light, `note`, `background_asset`) · first visit, testimonials, FAQ, posts, trust, book visit = homepage parts ·
appointments (**NEW `fa-appointments`**: table of row blocks) · more ways (`fa-feature-cards` NEW card_style `moss_icon`:
block `icon_asset/icon_image`, `button_label`, tag = meta line) · gallery (`fa-photo-gallery` NEW `review_label/link`,
strip_shape `square_tight`). Build 1440: profiles 2600 exact; other bands +8–34px (stand-in font).
Not built: the botanicals at the appointments / more-ways / practitioners edges. Links blank: waitlist, Substack /
blog buttons, appointment rows use the Jane default link.

## Our Approach page — Figma **V3** (2026-10-13, current)

Desktop frame `2669:35779` (1440 × 10973) in section `2669:35774` "V3 - Latest Version"; desktop-only sync, no V3 mobile
frame. Template rebuilt from `scratchpad/approach/parts` (v1 parts kept in `parts-v1-backup/`). Order: hero (star eyebrow,
compact buttons, `min_height` 488), philosophy (**new `fa-glyph-columns`**: coloured character masks
`fa-glyph-columns-*.png`, note bar), pillars (`fa-feature-cards` card_style `moss_large`, linen heading, pillars bg),
profile (`button_label_2` outline button, olive bg, 120px padding), acupuncture (`fa-cta-banner` layout `feature`,
`bundled_photo` acupuncture, `glyph_asset`, `subheading`), science (`fa-feature-cards` card_style `moss_photo`, heading
`moss`), then the homepage V6 sections: conditions (botanical standard, 120/120), first visit, testimonials, FAQ, gallery
(follow centred, 78/62), posts (`padding_bottom` 100), trust bar, book visit. Removed: stats bar, three-treasures
illustrated cards, two-languages comparison, evidence link gallery, "where to go next" steps. Build 1440: hero 488,
profile 873 exact; other bands +8–23px (stand-in font). Wraps matched with hand breaks: pillars intro, science intro,
"Invigorates the / nervous system". Links: Dr. Felice waitlist button blank (`#`).

## Our Approach page (`templates/page.approach.json`) — Figma `2275:19513` v1 (2026-10-02, superseded by V3)

Desktop `2267:16180` (1440 × 9188), mobile `2305:4556` (375 × 8589), file `B4QcctWXiG9ywP3uRA3coG`. Assembled from
`scratchpad/approach/parts/NN-*.json` by `scratchpad/approach/assemble.py` (never hand-edit while the scratchpad
exists). Build height 9271 @1440 / 8637 @375 (stand-in font). Order and sections:

| key | section | notes |
|---|---|---|
| hero | `fa-hero` (page) | NEW settings `desktop_photos` (two / one), `photo_position`, `fallback_mobile`, `padding_top`, `padding_bottom_mobile` (defaults = old behaviour); assets `fa-page-hero-approach(-mobile).jpg` |
| stats | `fa-stats-bar` | same copy as services |
| profile | **`fa-profile`** (new) | photo + name + roles (`|`-separated) + lead + richtext + pull quote + button; image left/right; desktop / mobile backgrounds; anchor |
| pillars | **`fa-feature-cards`** (new) | heading, intro, optional button, 2–4 per row; card blocks: image, title, text, tag panel, link, text width, smaller mobile text |
| concepts | **`fa-illustrated-cards`** (new) | illustration on paper panel + olive caption; card blocks (max 6) |
| languages | **`fa-comparison`** (new) | column blocks (image, title, richtext quotes, widths), botanical (reuses fa-first-visit-botanical.png) |
| evidence | **`fa-link-gallery`** (new) | scroll-snap carousel starting centred (or first), drag / keys, cards: image, label bar + arrow, optional link; `fa-link-gallery.js` |
| first_visit | `fa-first-visit` | NEW botanical style "Small (left)" + "Show botanical on" (all / desktop+tablet / mobile) |
| next_steps | **`fa-steps`** (new) | photo band + shade, steps (circle photo, number badge, title, text, link, widths), two buttons |
| testimonials | `fa-testimonials` | NEW "Show botanical on" + "Let the botanical rise into the section above" |
| faq | `fa-faq` | NEW mobile flower size "Large, raised" |
| book_visit | `fa-book-visit` | flower off |

QA pass 2026-10-02 (8 agents): hero meta row only renders when it has content; profile role dots never start a
wrapped line; feature cards upload sizes up to 1400w + Food-as-Medicine photo at its full source crop; illustrated
cards use Figma's 1343 / 48px content frame ≥1100 + title line-height 1.1; comparison / steps rows centre a short
last row; steps photo descriptions (alt) + Figma mobile button widths; link gallery centres a keyboard-focused card,
tab stop only while it overflows, no double card names, block-select stops auto-centring; first visit NEW desktop
`padding_top` / `padding_bottom` (approach 125 / 115); FAQ section `overflow-x: clip` (was hidden) so the mobile
flower rises into the reviews band as drawn (services mobile now matches its Figma too).

Copy to confirm with the client (reproduced verbatim from Figma): concepts title repeats "The four pillars of
healing"; comparison intro "…This is the section that does the work of the whole page" (designer note); first visit
"Ninety minutes…" (services page uses the approved "Seventy-five minutes…", FAQ says 75); testimonials "Pulled live
from Google. 5.0 … filterable…" (services uses the approved 4.9 line); feature card 3 "…flavor, and health how to
choose foods…"; steps "…Medicine $350 for 5 modules…" (missing punctuation); profile paragraphs mention neuroscience
twice; evidence intro is an unattributed quotation. Mobile-only copy kept as desktop (first visit heading/intro,
"View Services" buttons, steps card 3 duplicate of card 1, review names).
Low-resolution Figma sources (need originals): pillars acupuncture photo (218 × 126 source), evidence mental-health
photo (515 px), steps photos (282–310 px) and background (980 px), comparison photos (980 px).
"Book concierge" buttons are blank (`#`) as on services.

## Important decisions

- **Bundled images:** every photo block has an `image` picker plus a `fallback_asset` text setting (theme asset
  filename), so the page shows the Figma photography until the client uploads images. Textures are bundled with
  Figma's crop / opacity / base colour baked in; mobile versions are separate files where Figma crops differently.
- **Real client links:** booking https://feliceacupuncture.janeapp.com/ · Instagram
  https://www.instagram.com/feliceacupuncture/ · Maps https://maps.app.goo.gl/RF9weZgD2BE3JN898 · Google reviews
  https://g.co/kgs/mxocT19. No Facebook / X / TikTok URLs are known.
- **Social icons render as drawn** (header, team, footer): `<a aria-label>` when a URL exists, otherwise a
  non-interactive `<span aria-hidden="true">`.
- **External links open in a new tab:** `snippets/fa-link-target.liquid` adds `target="_blank" rel="noopener"` to any
  absolute http(s) link whose host is not the store's (`request.host`); store pages, `/#anchors`, `tel:` and `mailto:`
  stay in the same tab. Used on every setting-driven link (header, hero, buttons, cards, footer, book-visit).
- **Blank links** render `href="#"` (nav blocks, most "Learn more" / footer links).
- **Mobile copy:** settings are shared; Figma mobile layout/styling is reproduced, but mobile copy slips keep the
  desktop copy (see client list below).
- **Reviews** are static blocks ("Pulled live from Google" would need a reviews app).

## Figma-literal choices to confirm with the client (kept as drawn)

1. Hours row "7 Days/Week 9AM – 8PM" uses the envelope (mail) icon, desktop + mobile — probable designer slip
   (a clock option exists in the block setting).
2. Mobile FAQ: the open item's chevron points down (not rotated), unlike desktop.
3. Mobile copy slips kept as desktop copy: "View Services" on the first-visit / CTA mobile buttons, the Cosmetic
   Acupuncture text, a different mobile condition order, "Dr. sam audette" on the first mobile team card.
4. Figma mobile draws only 3 service cards and 3 team cards; the build keeps all 6 services and 4 members in the
   swipe rows.
5. Copyright reads "© 2026-2027 All Rights Reserved Yandara" as in Figma.
6. 6 of 8 FAQ answers are placeholders (only "first visit" and "does it hurt" come from Figma).
7. Marisa Bold / Marisa Medium files are missing (licensed) — see Fonts.
8. Mobile footer bottom bar keeps the desktop bar's 50 / 68px side padding, so the copyright and policy links sit
   9px left of the screen centre (as drawn; `.fa-footer__bar-inner` ≤899, one rule to centre it).

Figma inconsistencies *not* copied (round-3 spec audit, 2026-09-30; single elements deviating from their siblings):
FAQ background starting at x = 2 (2px paper strip; items therefore centred 1px right), one open FAQ item at 86%
moss (others 80%), Hormones card text −0.2px tracking, Herbal Wellness text 24px line-height (others 28), mobile
review cards 3–4 radius 16 (1–2: 8), row-2 condition cards radius 3 (row 1: 2.36), alternating 47/48px avatars,
the Pain / Sleep characters hand-placed 5–7px higher than their row siblings, and the services / testimonials rows
overrunning the 1340px content width by 2 / 3px (build keeps the container and Figma's 17 / 13px gaps).
Services v2 (QA 2026-10-01): the hero drawn from y116 over the header's last pixel (build stacks at 117, everything
below 1px lower, same as the homepage), the mobile conditions column 1px right of the gutter, the Sleep text box
1.7px left of centre, card-1 photo inset 1px, first-visit card-1 text 6–7px lower than cards 2–3.

## Pending / known issues

1. **Marisa font:** until it is uploaded the stand-in makes headings taller: desktop page 8,985px (Figma 8,898),
   mobile 6,166px (Figma 6,111); some mobile FAQ questions wrap to 2 lines. Re-measure after upload.
2. **Links:** nav block URLs and most "Learn more" / footer link URLs are empty (`#`) — need the new page URLs.
3. **Low-resolution photos:** most replaced with the live-site originals (2026-10-01); `fa-page-hero-services-left.jpg`
   (630px) still needs a larger source.
4. **Not verified in a real store yet:** checked in the local Liquid harness only. Run
   `shopify theme dev --store <store>` and check the Theme Editor (block add/reorder, carousel / header menu / FAQ
   re-render), the map iframe and the newsletter form.

## Verification tooling (local, scratchpad — not part of the theme)

liquidjs-based renderer (`harness/serve.mjs`, port 9393; `.claude/launch.json` starts it) + headless Chrome
(`shot.mjs` screenshots/measurements; `sweep.mjs` multi-width sweep: section heights, overflow/protrusion, label
wraps, upscaled images, swipe-row gutters, per-section PNGs; `geom.mjs` element geometry/style fingerprint to prove
375/1440 unchanged; `tile.mjs` tiling + pixel diff; `faq-test.mjs` 228 FAQ checks at 375/768/899/900/1440 on `/`
and `?section=fa-faq`; `r3-match.mjs` Figma spec matcher: every Figma text / styled box from the cached `use_figma`
dumps in `figma-cache/` vs the DOM — typography, composited colour, cap-box geometry per section, box size / radius /
fill — with reviewed deltas classified; `r3-pixel.mjs` box alignment + section colour sampling against the Figma
renders). There is no fixture/merge step any more: edit `templates/index.json` and the two group
files directly. It lives in the Claude session scratchpad; recreate it if that folder is gone.
- `http://localhost:9393/` = header group + index + footer group; `?section=fa-x` renders one section;
  `?template=page.services` renders another template (combine with `section=`).
- `validate_templates.py` (scratchpad): checks every template / group value and every schema preset against the
  section schemas the way Shopify does on upload (range min/max/step, ≤101 steps, select options, unknown ids,
  url formats). Run it before pushing — theme check does NOT catch out-of-range values.
- `shopify theme check`: 0 offenses in fa-* / groups / index / theme.liquid / settings_schema (the remaining 8 are
  in untouched Dawn files).

## Do not change

- The `fa-base.css` tokens and the heading / button metrics: every section depends on them.
- Dawn core files beyond the wiring points listed under Architecture.
