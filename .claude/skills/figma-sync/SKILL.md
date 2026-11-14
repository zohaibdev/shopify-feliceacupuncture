---
name: figma-sync
description: Sync the Felice Shopify theme (Dawn 16 + fa-* sections) with an updated Figma design. Use when the client changes a page in Figma (new frame / "V<n> - Latest version") and the existing Liquid/CSS must be brought pixel-perfect to it, section by section, without rebuilding unchanged sections.
---

# Figma → theme sync (Felice)

## Inputs (fill these in; nothing else is needed to start)
- Figma URL / file key: `B4QcctWXiG9ywP3uRA3coG` (02. Felice Acupuncture | Internal)
- NEW frame node id: `<e.g. 2669:25037>` — the page frame, not the section around it
- PREVIOUS render of what is built today: `<path to 1:1 PNG>` (last: V6 frame 2669:25037, see context.md "Homepage — Figma V6")
- Target template: `<templates/index.json | page.services.json | page.approach.json>`
- Scope: `<desktop only | desktop + mobile>`

## Project facts
- Theme root `E:\Edits\felicea`; read `context.md` first (architecture, tokens, decisions, client open items). No git:
  back up every file before editing (`<scratchpad>/backup/`).
- Every custom file is `fa-<section>` : `sections/fa-x.liquid`, `assets/fa-x.css` (+ `.js`), `snippets/fa-x-*.liquid`,
  images `assets/fa-x-<name>.jpg|png|svg`. Shared: `assets/fa-base.css` (tokens `--fa-garnet/linen/clay/moss/beige/
  peach/paper`, `.fa-container`, `.fa-heading__*`, `.fa-btn--primary|light`, `.fa-swipe`, motion tokens),
  `snippets/fa-icon.liquid` (shared icons), `snippets/fa-link-target.liquid` (external links → new tab).
- Styling: plain CSS per section, Figma's own px numbers (size / line-height / letter-spacing), BEM-ish
  `.fa-x__el--mod`; breakpoints literal `max-width: 899px` / `min-width: 1100px` etc. No `!important`, no inline styles
  except CSS custom properties.
- Fonts: Marisa (licensed, missing) → Federo stand-in; Futura → Jost; body Libre Caslon Condensed 500. Build heights run
  slightly taller than Figma because of the stand-in — compare positions/sizes, not glyphs.
- Section settings: never rename/remove an id; new settings default to today's behaviour (sections are shared by the
  Services and Our Approach templates). Photo blocks = `image` picker + `fallback_asset` (bundled asset filename).
- Homepage `templates/index.json` is generated from `<old scratchpad>/home-v5/parts/NN-<key>.json` by `assemble.py`;
  validate with `validate_templates.py` (→ ALL VALID). If the scratchpad is gone, edit index.json directly.
- Harness: `.claude/launch.json` → `felice-harness` (liquidjs, port 9393; `?section=fa-x`, `?template=page.services`).
  `harness/shot.mjs <url> <w> <out.png> [selector] [--eval js]`; regressions `fix-check.mjs` (services),
  `approach-check.mjs`. It lives in a session scratchpad — rebuild it if missing.
- Python: `C:/Users/Zohaib/AppData/Local/Python/pythoncore-3.14-64/python.exe` with Windows paths (`py`/`python` aliases
  unreliable). PIL + numpy installed. Node + `shopify` CLI available.

## Workflow
1. **Skill + context** — this file, `context.md`, memory. Don't re-read sections you won't touch.
2. **Map** — `get_metadata` on the new frame. It is ~100 KB for a full page: let it save to file and print only the
   top 2–3 levels with node (`indent <= 8`). The old frame is often DELETED when the designer duplicates the page, so
   don't plan on a metadata-to-metadata diff.
3. **Diff cheaply (pixels, not JSON)** — `get_screenshot` of the new frame at `maxDimension = frame height` (1:1),
   then compare with the previous 1:1 render (scripts in `scripts/` next to this file; `band-dump.js` too):
   - `rowdiff.py old new` (difflib on row signatures) → per-band y offset (e.g. header +6).
   - `secdiff.py old new` → per-section mean diff + changed row ranges at that offset.
   - `sbs.py old new outdir name:y0:y1:offset:scale` → side-by-side crops; look at them at 0.35–0.6 scale.
   Classify each section Unchanged / Modified / New / Removed. Noise floor: grainy photo textures give peaks < 8 with
   no visible change — call those Unchanged after one crop look.
4. **Tokens** — `get_variable_defs` once on the frame; compare with `fa-base.css` tokens.
5. **Fetch only changed nodes** — exact values from the read-only band dump (`use_figma` + `band-dump.js`, artboard y
   range; compact text styles + boxes, ~20 KB per band). `get_design_context` only for a small node needing effects,
   gradients or vectors. Assets: `download_assets` / node screenshot for new or changed images/icons only.
6. **Implement** — extend the existing section (settings / blocks / modifier classes), set homepage values in the part
   file, keep the editor working. One session, section by section — no parallel sub-agents (user preference).
   Run `assemble.py` + `validate_templates.py` (ALL VALID) after each part edit.
7. **QA text specs** — compact `use_figma` text dump (style table + rows, ≤20 KB per call, chunk by y) saved as
   `{chunks:[{S,R}]}`, then `node scripts/qa-text.mjs dump.json <url>` (puppeteer-core) lists size / tracking /
   line-height / weight / colour / underline / x mismatches and per-section y drift.
8. **Verify** — per modified section one Figma crop vs one build crop at 1440 (same scale, side by side); ≤ 2 fix rounds.
   Then 375 overflow / JS errors, services + approach regression, `shopify theme check`.
9. **Record** — update `context.md` (new frame id, section table, client items) and the memory; save the new 1:1 render
   path as the next run's "previous render".

## Pixel-perfect checklist
- Typography: family, weight, size, line-height, letter-spacing (Figma % → em), case, colour, alignment, text-box width
  (wrap points!).
- Spacing: section padding, gaps between title / intro / cards / button, auto-layout padding + itemSpacing.
- Boxes: width / height / max-width, radius (check every card — designers drop radius per version), border, shadow.
- Colour: fills via tokens, opacities (composite on the real background), image shades / overlays.
- UI: buttons (size, label, colour, hover/focus), icons (stroke vs fill, size box), arrows, dividers, video controls.
- Images: crop / object-position, new photos exported at ≤ 2× display width.
- Copy verbatim; links from the live site only (never content).

## Token-saving rules
- Never pull `get_design_context` for a whole page or big section; never paste Figma JSON or code into chat.
- Diff with pixels first; only dump bands that changed.
- Cache every Figma response in the scratchpad; the MCP is rate-limited.
- Targeted Edits, no file rewrites; no refactors outside the changed sections.

## Mistakes seen
- Don't spawn parallel sub-agents for the sections (user preference): work section by section in one session.
- `assemble.py` drops "" values, so a blanked text setting falls back to its schema default — keep defaults in
  presets instead of the schema when a design blanks them.
- A desktop override placed above the base rule in the same file loses the cascade — add a parent class.
- Look for design-system shifts across sections (V6: all primary buttons hug + white label → one shared modifier).
- Figma raster-mask icons: `download_assets` rawImages give the 512px mask → save 128px alpha PNG, paint with CSS
  `mask` + `currentColor`. Image fills in CROP mode: read `imageTransform` via `use_figma` and crop the raw image.
- The browser pane tab can be stale; reload before reading the DOM.
- The scratchpad gets wiped: keep reusable scripts in `scripts/` here; edit templates directly.
- `use_figma` returns at most 20 KB; MCP outputs that are too big for the chat are saved to files only for other tools.
- Old frame id deleted → diff against the cached 1:1 render instead of re-fetching.
- Inner pages reuse homepage sections: pixel-diff those bands against the homepage render (`secdiff.py` with per-band
  offsets) and copy the homepage part files instead of dumping them again.
- Backgrounds: `download_assets` on the band's bg node / bg-only group gives the exact composite (check diff 0 vs the
  render). Opaque exports of coloured masks → alpha from colour distance to the background.
- Bash heredocs with mixed quotes fail here: write Python edit scripts to the scratchpad and run them.
- Inserting schema settings "after the setting with id X": find the setting's closing brace by bracket matching —
  the first "}" after a select's id is inside its options array.
- New pages: map every band to an existing section first (pixel-diff vs homepage bands, colour-match textures against
  existing bg files) and extend with a style/option before writing a new section. Blank "" values are valid in
  templates (Dawn uses them) — keep them in generated JSON so schema defaults don't resurface.
- `python` alias opens the Store; Unix paths break Windows Python — use the full exe + `C:/` paths.
- A 1440 × 13 000 PNG is ~17 MB: never Read it whole; crop with `sbs.py`.
- Figma reproductions: keep designer slips as drawn and list them (see memory `figma-literal-fidelity`).

## Component patterns (2026-10-14)
- **Hero video** — `sections/fa-hero.liquid`, Theme Editor → Hero → "Background video": `video` (Shopify file),
  `video_url` (direct .mp4/.webm), `video_poster`. Empty = original `<picture>` slots (no `<video>` in the DOM); set =
  one `<video autoplay muted loop playsinline preload="metadata">` spanning both slots (`.fa-hero__img--video`),
  overlay / copy unchanged, pause button outside the aria-hidden media layer, reduced motion pauses it.
- **Page links** — store pages exist but templates are not assigned in the admin, so links use `?view=` URLs:
  `/pages/our-approach?view=approach`, `/pages/our-team?view=team`, `/pages/services?view=services`; e-courses /
  e-books / `/blogs/news` plain. Missing pages (concierge, terms, privacy) stay blank (`url` settings must not hold a
  bare `#`; the sections print `#`). Probe the dev store (`curl :9292/pages/x`) before linking. Nav order = live site.
- **Book Now dropdown** — `fa-header.liquid` setting `button_sub_links` ("Label | URL" lines) wraps the CTA in the
  shared nav dropdown (`.fa-header__nav-item--parent[data-fa-dropdown]`): CSS hover opens, a visually hidden
  `[data-fa-dropdown-toggle]` opens it from the keyboard, the header IIFE handles Escape / outside click. External
  items get `target="_blank" rel="noopener noreferrer"` (live site).

- **Google reviews widget** — theme setting `fa_reviews_widget_id` (Theme settings → Felice → Google reviews; free Featurable widget ID) feeds every `fa-testimonials` section: `assets/fa-testimonials.js` fetches `api.featurable.com/v1/widgets/<id>` when the section nears the viewport and refills the Liquid cards (blocks = fallback); change the ID there, nowhere else.

- **FAQ default open** — `sections/fa-faq.liquid` renders `open` + `aria-expanded="true"` (and `data-open-mobile`) on the first question in Liquid (item_index 1), so it is open on first paint on every page; per-question open settings are unused; `single_open` (native `<details name>`) stays per page.

## Heading font debugging checklist
1. Computed style in the browser: `getComputedStyle(h).fontFamily` + `[...document.fonts]` status — is the first
   family actually loaded (`document.fonts.check('700 70px Marisa')`)? A stand-in rendering = the face is missing.
2. Here the cause was: `@font-face 'Marisa'` only emitted when a theme setting said the file was uploaded, and no
   file existed → every heading fell back to the stand-in.
3. Find the live source: on the live site list `CSSFontFaceRule`s + family names (Wix: `orig_<name>`); `curl -I`
   the file for `Access-Control-Allow-Origin`. Never swap in a lookalike silently; if no source, name the file needed.
4. Fix at the source (`snippets/fa-head.liquid`): one face, weight range `100 900` (no faux bold), `font-display:
   swap`, preload, theme asset first then the URL setting `fa_marisa_url`; keep Figma's size / lh / tracking tokens.
5. Verify: loaded status, computed family, line widths vs Figma (hero H1 431 / 644 vs 429 / 647), section heights.

## Page review checklist (client review docs, 2026-10-14)
A review doc (PDF of annotated screenshots) beats Figma where they disagree. Extract it with pypdf (`page.images` +
`extract_text()`; no poppler here) and pair each image with its note by order on the page.
1. **Buttons** — `.fa-btn*` use `--fa-radius` (2px) and no border except outline styles (1px). One-off buttons that
   don't use `.fa-btn` (book-visit "Open in Google Maps", r8 / r6) drift: grep `border-radius` in the section CSS.
2. **Unwanted radius** — `rg "border-radius" assets/fa-*.css`. Shared bases set it for every style: `.fa-feature-cards__card`
   r8 (pillars inherited it), `.fa-faq__item` r8 / `[open]` r12 (+ a radius transition), tablet / mobile overrides
   repeat it. "Remove corner radius" = `var(--fa-radius)` (the square corner the V6 cards / buttons use), set on the
   style modifier, and delete the breakpoint copies. Cards with `overflow: hidden` clip their photo — no media rule needed.
3. **Background / photo crop** — page heroes are `<img>` + `object-fit: cover; object-position: 50%
   var(--fa-hero-photo-y)` from setting `photo_position`. Match it to Figma by normalised cross-correlation of the
   Figma band against the asset (left / right 300px strips, skip the copy): scale 1.0 + offset y → percentage
   y / (scaled h − band h). Found: team hero sat at 50% while Figma is top-aligned (0%) → foliage cut on wide screens;
   approach 47% was right. Check at > 1440 too: cover crops the top once the viewport is wider than the frame.
4. **Borders** — FAQ item 1px rgba(181,173,165,.13) stroke stays; outline buttons 1px linen.
5. **Links** — "pull from live site": run a link dump on feliceacupuncture.com (`a[href]` list); Wix pages render
   reviews as static text (no widget). Never invent social URLs: what Google / the live site can't confirm stays blank
   and goes in the report.
6. **Dev server** — `shopify theme dev` uploads every file in the theme folders: `sed -i` temp files
   (`templates/sedXXXX`) break it ("Failed to Upload Theme Files") until it restarts. Edit with Python / Edit, not `sed -i`.

## Full QA checklist (all pages vs Figma, desktop, 2026-10-14)
1. **Map first** — `graphify query` + `templates/*.json` → page → section → CSS / snippet map in `qa/MAP.md`; shared CSS
   (`fa-base.css` `.fa-btn`, tokens) is fixed once, then every page re-checked.
2. **Computed styles, not source** — `scripts/dom-extract.mjs <url> <out.json>` (puppeteer-core, 1440, reduced motion,
   scrolls for lazy content) dumps every text block (family / weight / size / lh / ls / case / rgba / opacity /
   underline), every styled box (radius / bg / border / padding) and each button before / after a real `page.hover()`
   plus its focus outline. Use `127.0.0.1:9292` — `localhost` hits the store password page (6 texts = wrong page).
3. **Compare inside Figma** — embed the trimmed DOM JSON into `scripts/qa-figma-match.js` and run it with `use_figma`:
   texts pair by an 18-char key + nearest y, boxes by size ±6 / position after a local y offset (median of the paired
   texts nearby). Only mismatches come back (20 KB return / 50 KB code limits): drop header + shared sections already
   checked on another page, dedupe repeated cards, keep one text per ~60px for the y offsets. A "size" hit on a box
   means no exact match — query that frame's `layoutSizingHorizontal` + padding before fixing.
4. **Hover / focus** — Figma has no variants: every button must change on hover (shared `.fa-btn--*:hover` bg) and show
   the two-tone focus ring; a button missing its variant class (`fa-btn` + section class only) gets no hover. Child-only
   hovers (footer submit chevron) and `span.fa-btn` inside a card link are fine.
5. **Common causes found** — fixed-width Figma buttons (250 / 222, `FIXED`) built as hugging (`fa-btn--compact` or
   `min-width: 0`); one-off radii (12 / 8 / 10) where Figma is r2 / r0; a page-specific tweak in Figma (title lh 56,
   note @59%, tag +3%) on a shared section → add it on that page's style modifier; inherited body weight 500 on a
   Regular-only face. Noise: transparent underlines, strokes the same colour as the fill, strokes on mask children,
   content-driven pairs (different blog posts), ±7px widths from hosted-Marisa metrics.
6. **Cheaper variant (pass 2)** — dump Figma text styles once per frame with `use_figma` (style table + rows
   `[key18, y, h, style]`, dedupe repeated cards so it stays < 20 KB), save it, and compare locally:
   `python scripts/qa-text-cmp.py fig.json dom.json`. Iterating needs no new Figma calls. `W=375 node dom-extract.mjs`
   for phone frames (touch emulation: hover rules behind `@media (hover: hover)` correctly report no change).
7. **Mobile causes found** — swipe rows where the phone frame draws a grid / stack (add a `mobile_layout` setting,
   default = old behaviour, so other pages keep theirs); mobile-only button sizes (Figma reuses the 250 x 54 / 212 x 54
   desktop buttons); white labels on garnet mobile buttons; linen vs white 90% intros; fixed button widths (219)
   built as hugging. Live reviews are always taller than Figma's sample cards — report, don't clamp.
8. **Report** — `qa/REPORT.md`, one table per page; mark pages that disagree for the same component as Variance
   (keep the build), designer slips as Unclear, store data (article H3s) as Content. Never touch article images.

## Mobile responsive (2026-10-16)

- **Breakpoint:** mobile = `@media screen and (max-width: 899px)`; tablet 900–1099 (not drawn); desktop ≥ 1100. Figma mobile
  frames are 375 wide; check at 390 / 375 / 360.
- **Scoping:** never change a shared rule's mobile look in place. Add a section setting whose default keeps the old
  behaviour (`mobile_layout` swipe|grid|stack, `mobile_photo_size`, …), emit a modifier class
  (`fa-feature-cards--mobile-grid`, `fa-services--mobile-grid`, `fa-team--mobile-stack`, `fa-photo-gallery--mobile-small`),
  put the CSS inside the 899px query, and turn it on only in the page's template JSON. Grids drop `fa-swipe` with
  `{% unless section.settings.mobile_layout == 'grid' %} fa-swipe{% endunless %}`. When one card style needs other values,
  chain the style class (`.--mobile-grid.--moss-photo`). Schema changes: `touch` the template so theme dev re-uploads it.
- **Mobile menu:** `sections/fa-header.liquid` + `assets/fa-header.css` (3-item bar, wordmark, menu panel below 1100px);
  sticky heights come from the header's ResizeObserver (`--fa-header-bar-h` / `--fa-header-main-h`).
- **Regression check:** after a mobile change, render the desktop page (1440) and compare its section heights with the
  previous run (`fullshot.mjs`); open other templates that use the same section (grep `templates/*.json` for its type)
  at desktop and 375; open the PDP (`templates/product.json`) at both widths; run the overflow check (`mob.mjs`) —
  `scrollWidth` must equal the viewport.
- **Common mobile mismatches:** Figma hand-wraps headings (stand-in Marisa is wider → different wrap points, report as
  font, don't shrink); the same component carries different sizes per page (pillars vs truth vs science cards); card copy
  is shared with desktop (mobile copy differences = content); live reviews make testimonial cards taller; Figma
  sibling cards with one-off gaps (designer slips: keep the majority value, flag it); a desktop `line-height` (e.g. 52px)
  leaking into a new mobile variant — set every type property the frame gives.
  Figma reports Libre Caslon body boxes untrimmed (lines x line-height) while our `text-box: trim` shortens them —
  a section a few px short per paragraph means set `text-box: none` in that variant. `<br>` in a rich-text setting that
  the mobile frame doesn't break: hide it on mobile and keep a space before it in the text. A template JSON uploaded
  before its section's new schema setting loses the setting: change the template content (touch is not enough).

## PPC landing page template (2026-10-20)

- **Figma:** section "LP" 3014:4049 (frames are named "Our Approch" by mistake): desktop 3014:4054, mobile 3031:4731.
- **Template:** `templates/page.ppc.json`. Route: any Shopify page with the template assigned (admin: page → Theme
  template "ppc"); preview with `?view=ppc` on any page URL (e.g. `/pages/blog?view=ppc`).
- **Header variant:** `sections/ppc-header-group.json` — an `fa-header` instance with "Layout: PPC landing page" (logo +
  wordmark + one button, no nav / menu, mobile label "Book · $150"). `layout/theme.liquid` renders it for every
  template whose suffix starts with `ppc`; all other templates keep `header-group`. Footer: shared (Figma is the same).
- **New sections** (styles `assets/fa-ppc.css`): `fa-ppc-hero` (rating, title, intro, price / regular / badge, button,
  call line + tel link, photo with mobile crop and mobile caption, background), `fa-ppc-offer` (layouts "Garnet strip"
  and "Photo banner": eyebrow, title, badge, prices, "Regular" label, button, small print, background + extra
  darkening), `fa-ppc-pricing` (heading, intro, offer panel fields, "What's included" items one per line, "Regular
  pricing" items one per line, background). Bundled images `assets/fa-ppc-*.webp` (Figma 2x exports).
- **Reused as-is:** conditions, first visit, truth cards, team, clinic gallery, testimonials, FAQ (flower off), trust
  bar, book visit (settings copied from `index.json`, so mobile grids / stacks match the homepage).
- **Another PPC page:** duplicate `page.ppc.json` as `page.ppc-<name>.json` (suffix must start with `ppc`), edit the
  copy in the theme editor, create the page in admin and pick the new template. Page title / meta description: the
  page's SEO fields in admin. The PPC header group is shared by every PPC template, so its button text applies to
  all PPC pages.
