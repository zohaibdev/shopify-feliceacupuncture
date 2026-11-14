# Full desktop QA vs Figma — 2026-10-14

Viewport 1440, `http://127.0.0.1:9292`. Method: computed styles from Chrome (puppeteer, `dom-extract.mjs`) matched against the Figma
frames inside `use_figma` (`qa-figma-match.js`); text pass + box pass per page, real hover / focus per button. Mismatches only.
Article images (featured / thumbnails / body) were skipped as instructed.

Status: **Fixed** (verified by re-extracting computed styles), **Variance** (Figma pages disagree with each other for the same
component — build kept), **Unclear** (needs client / designer decision), **Content** (store data, not theme code).

## Home (2669:25037)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| Book a visit | Map | border-radius | 2 (V6 Rectangle 63) | 10 | Fixed → 2 |
| Book a visit | "Open in Google Maps" button | border-radius | 0 | 2 | Fixed → 0 |
| Footer | "Join now" submit | border-radius | 0 | 2 | Fixed → 0 |
| Footer / address / follow | links | underline | none | transparent underline (hover affordance) | Not a mismatch (invisible at rest) |

## Our Approach (2669:35779)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| Hero | Book in-clinic / Book concierge | width | 250 fixed | 210 / 229 (hug) | Fixed → 250 (`button_compact: false`) |
| What is acupuncture (CTA feature) | Book now | width | 222 fixed | 179 (hug) | Fixed → min-width 222 |
| Profile | "Join Dr. Felice's waitlist" outline | hover | (no variant) | no hover change | Fixed → linen fill, garnet label (as team outline) |
| Profile | outline button | width | 295 (hug, p32) | 314 | Variance: font metrics of hosted Marisa |
| Science cards | "Palpation-based…" body | line-height | 22.4 (one card; others 20) | 20 | Unclear: designer slip, kept 20 |
| First visit | "Book your first visit" | width | 289 | 282 | Variance: font metrics |

## Our Team (2669:33510)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| Hero | Book in-clinic / Book concierge | width | 250 fixed | 210 / 229 | Fixed → 250 |
| Profiles | Substack / blog outline buttons | hover | (no variant) | no hover change | Fixed (shared rule) |
| Profiles | "Read Dr. Sarah's Substack" label | color | linen #EEE1D1 (other 2 white) | white | Unclear: designer slip, kept white |
| Find the right practitioner | Title (2 lines) | line-height | 56 | 50 | Fixed → 56 |
| Find the right practitioner | "Still not sure?" note | background | white @ 59% | white @ 36% | Fixed → 59% |
| Appointments | Table frame | border-radius | 2 | 12 | Fixed → 2 |
| Appointments | Table layout | structure | matrix: practitioner columns with ● / – and a "Book now" row (18px, −6%) | list: appointment / duration / practitioners / "Book →" per row | Unclear: different design version; layout change out of QA scope |
| More ways to start | "Book now" | height | 52 | 54 | Fixed → 52 |

## In-Clinic Services (2669:28405)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| Treatments | Price / duration tags | letter-spacing | +3% (0.6px) | 0 | Fixed → 0.03em (contrast therapy keeps −2%) |
| What is acupuncture | Book now | width | 222 fixed | 179 | Fixed (shared CTA rule) |
| Science cards | Card | border-radius / stroke | 2 + 1px stroke | 9 (Approach Figma: 9) | Variance: Approach and Services disagree; kept 9 |
| Concierge band | Option cards | border-radius | 5 | 2 (V6) | Variance: kept V6 r2 |
| Book a visit | Map | border-radius | 4 | 2 | Variance: other pages r2 |

## Concierge (2644:15168)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| Intro | At your home / Virtually cards | border-radius | 2 | 8 | Fixed → 2 |
| Intro | Virtually card | stroke | 1.18 inside, same colour as fill | none | Not fixed: invisible |
| Inquiry | Radio labels (Myself / …) | font-weight | 400 (Libre Caslon Text Regular) | 500 | Fixed → 400 |
| First-visit cards | Photo | stroke | white 1px on a mask child (not rendered) | none | Not a mismatch |
| Final CTA | "Book your first visit" | width | 289 (p42) | 262 (p32; Services Figma 262) | Variance: same section, pages disagree |
| Book a visit | Map | border-radius | 1 | 2 | Variance |

## Blog listing (2719:19545)

No style mismatches. (Card / featured / input / button radii and sizes match: featured r5, cards r2, inputs r4, hero 250 × 54.)

## Blog article (2719:22580)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| Sidebar | "In this article" contents box | presence | shown | hidden (H2-only) | Fixed: lists H2 and H3 headings (H3s nested under their H2), each heading gets an anchor id |
| Team | "Join the waitlist" | border | none | 1px linen on linen | Not a mismatch (invisible) |

## Checked and matching (all pages)

Typography (family, weight, size, line-height, letter-spacing, case, colour, opacity) on every paired text; header, footer, FAQ
(first item open), reviews widget, inputs; button radius 2 / 0 per Figma; hover on every `.fa-btn` (background change) and
focus ring (solid two-tone) on all buttons; hero video renders only when a video is set, otherwise the image.

---

# QA pass 2 — new pages + homepage mobile (2026-10-14, later)

Method: `dom-extract.mjs` (W=1440 / W=375) → computed styles; Figma text styles dumped once per frame with `use_figma`
and compared locally (`scripts/qa-text-cmp.py`); box sizes / radii from the same extraction. The 7 desktop pages of
pass 1 were re-rendered after the shared changes: section heights unchanged (the new rules are mobile-only or behind
new settings). Remaining hits in every page: transparent hover underlines (false positives).

## E-Courses (2770:2692)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| What's included | "Enroll now" | width | 219 | 195 (hug) | Fixed → min-width 219 |
| Meet your teacher | outline button | width | 312 (hug) | 333 | Variance: font metrics |

## E-Books (2792:3796)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| E-book form | Title | size / line-height / tracking / colour | 70 / 60, -4%, white | 62 / 54, 0, linen | Fixed |
| E-book form | Intro | size / tracking | 20 / 30, 0 | 18 / 30, -2% | Fixed |
| Course promo | "Enroll now" | width | 219 | 195 | Fixed → min-width 219 |
| Testimonials | Cards | height | 290 (sample text) | 656 (live reviews) | Content (all pages) |

## Home — mobile 375 (2794:1089)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| Hero | Eyebrow | letter-spacing | -0.6 (-5%) | -0.12 | Fixed |
| Hero | "Book in-clinic" label | color | #FFFFFF | linen | Fixed |
| Inside the clinic | Title | letter-spacing | -4% | -7% | Fixed |
| Our services | Card | size / photo | 275 x 384, photo 250 x 243 inset 15 / 12.5 | 276 x 375, photo 264 x 254 inset 6 | Fixed (card stretches to 446 with the longer desktop copy) |
| Our services | Title / text | size | 32 / 22, 16 / 20 | 20, 14 / 24 | Fixed |
| Our services | "View services" | width | 139 (hug) | 170 | Fixed |
| Your care team | Card buttons | size / label | 40 tall, 16px | 36, 14px | Fixed |
| Concierge care | Intro | color / opacity | linen 100% | white 90% | Fixed |
| Chinese medicine, explained | Card photo | height | 206 | 174 | Fixed |
| What people are saying | Cards / arrows | height, arrow position | 210, arrows below | live reviews, arrows overlay | Content / unclear (shared widget) |
| Several | Headings, FAQ questions | wrap points | Figma hand-wraps | natural wraps (stand-in font wider) | Not fixed (font) |
| Several | Card copy, "View services", "25 min" | text | mobile copy | desktop copy | Content (shared settings) |
| Header | Sticky "Call or text / Book now" bar | presence | not drawn | shown | Kept (earlier decision) |

---

# Re-check 2026-10-15 — Blog article + Blog listing (desktop)

Store content changed: the demo posts were replaced by the live-site posts; the article frame's own post
("Bridging East and West", `/blogs/news/bridging-east-and-west`) now exists and was used for the comparison.

## Blog article (2719:22580)

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| Header | Subtitle | element / style | clay line under the title (LCC 22 / 28) | leading H2 in the body (Marisa 42) | Fixed: a leading H2 becomes the subtitle when the metafield is empty |
| Body | Section headings | size / line-height | 42 / 46 | 30 / 34 (the post uses H3s) | Fixed: H3 sections take the H2 style when the body has no H2 |
| Body | E-book form | position | before the 2nd section | end of the article (counted H2s only) | Fixed: counts H3 sections in H3-only posts |
| Sidebar | Contents box | items | 1–3 (the sections) | subtitle H2 with a–c below it | Fixed (follows the two fixes above) |
| Header | Eyebrow author | text | Dr. Felice Chan, DACM | Ovais Patel (post author) | Content |
| Related | Post titles / dates | text | sample posts | live posts | Content |

## Blog listing (2719:19545)

No style mismatches (text styles, card radii r5 / r2, sizes, hero buttons all match).

| Section | Element | Property | Figma value | Current value | Status |
|---|---|---|---|---|---|
| Articles | Meta tag ("· Gut Health") | presence | shown | missing | Content: store posts have no tags |
| Articles | Pagination | presence | not drawn (7 posts) | shown (more than 7 posts) | Unclear: needed for the live post count |

---

# Mobile re-check 2026-10-16 — Our Approach (2821:6541) + Home (2794:1089), 375 / 390 / 360

Settings added (default = old look, on only where named): `mobile_style: compact` (hero, glyph columns, profile, CTA
banner — Approach), `mobile_layout` grid / stack (pillars, science, conditions, first visit — Approach),
`show_arrows_mobile` (gallery — Approach), `map_height_mobile: page` (book visit — Approach + Home).

| Page | Section | Figma | Before | Status |
|---|---|---|---|---|
| Approach | Hero | 360 tall, copy centred | 422, copy at the bottom | Fixed |
| Approach | Philosophy | 57px characters, 20 apart, note 16 / 17 | 72px, 32 apart, 14 / 18 | Fixed (793 = Figma) |
| Approach | Pillars / Science | 2 x 2 grids, 171px cards | swipe rows | Fixed (pillars 683 = Figma) |
| Approach | Profile | title 28, quote 24 / 26, full-width 39px buttons | 32, 16 / 20, hug buttons | Fixed (963 = Figma) |
| Approach | What is acupuncture | 496 tall, 26 x 57 characters | 727, 56 x 125 | Fixed (496 = Figma) |
| Approach | Conditions / First visit / Gallery | grid / stacked / 171px squares + arrows | swipe / swipe / 334px, no arrows | Fixed |
| Both | Book a visit | map 323, title 28, intro 12 / 22, "Book now" beside maps | map 248, 32, 14 | Fixed |
| All | Footer "Join now" | one line, 14px | wrapped onto two lines (36px button width) | Fixed (mobile, all pages) |
| Home | Truth cards | two-line titles 18 / 15 | 18 / 20 | Fixed |
| Approach | Pillar / science card copy, intro text | mobile copy ("It's time-tested", "It treats the root"...) | desktop copy | Content (shared settings) |
| Approach | Science card 4 | inner gaps 10 / 3 (others 12 / 6) | 12 / 6 | Designer slip, kept 12 / 6 |
| Both | Footer link lists | Marisa 18 uppercase links, 33px apart; Education open | LCC 14 / 28 links 40 apart; Explore open | Needs decision (global footer; differs from Footer component 2519:4184) |
| Both | Headings, team roles, FAQ questions | Figma wraps | stand-in Marisa wraps differently | Not fixed (font) |
| Both | Testimonials | 455 | 687 (live reviews) | Content |

Desktop unchanged (Home 13552, Approach 11335); Team, article: no overflow at 390 / 375 / 360 / 1440. PDP: the store has no
products, so no product page could be rendered.

# Our Team mobile (2821:4461) — 2026-10-16

All new rules are mobile-only and switched on by settings in `page.team.json` only: hero / profiles `mobile_style: compact`,
practitioners + first visit + more ways grid / stack, gallery small + mobile arrows, book visit `map_height_mobile: page`.

| Section | Figma | Before | Status |
|---|---|---|---|
| Hero | 360, no tagline | 422 with the tagline line | Fixed (tagline hidden on mobile in Compact) |
| Profiles | one band, rows 32 apart; photo 351 x 354 r6; 28 / 18 / 14-20 / 18-20 type; buttons side by side 172 x 39 | 60 / 60 sections, stacked hug buttons | Fixed (positions match Figma to the px) |
| Find the right practitioner | 2 x 3 grid of 171 x 196 cards, 10px rows | swipe row of 266 x 396 | Fixed (920 = Figma) |
| First visit / Gallery / Book visit | stacked / 171px + arrows / map 323 + "Book now" | swipe / 334px / map 248 | Fixed |
| More ways to start | 2 x 3 grid of 171 x 225 cards | swipe row of 314 x 351 | Fixed (934 vs 916: 3-line titles, font) |
| Profiles (Felice, Caroline) | no "Books online (existing patients)…" note | note shown | Needs decision (content; kept) |
| Appointments | practitioner matrix (● / –, "Waitlist", "Book now" row) | list (name / duration / practitioners / Book) | Needs decision (same as desktop QA; matrix needs per-practitioner data the blocks don't have, e.g. "Waitlist") |
| Practitioner cards | "Book now →", photos | "Book →", live condition photos | Content |
| Dr. Sarah's outline button | one line | "Read Dr. Sarah's Substack" wraps | Font metrics |

Desktop Our Team unchanged (12476); Home / Approach / Concierge / E-Courses: no overflow at 390 / 375 / 360 / 1440.

# In-Clinic Services mobile (2855:16669) — 2026-10-16

Settings in `page.in-clinic-services.json` only: hero / treatments / acupuncture `mobile_style: compact`, first visit stack,
science grid, gallery small + mobile arrows, book visit `map_height_mobile: page` + "Book now". New: `fa-treatments`
"Mobile style" setting; the hero's "Space below content (mobile)" is now a number field (range max 100 was too small).

| Section | Figma | Before | Status |
|---|---|---|---|
| Hero | 360, copy 112 from the top, title 40 / 33 | 422, copy at the bottom | Fixed |
| Treatments | photo 351 x 262 r2; title 28; 31px tags; lead Marisa Medium 18 / 20; text 14 / 20; full-width 39px button, garnet label | 292 r12; 26; 25px tags; lead 12 bold; text 12 / 18; hug button, moss label | Fixed (every row lines up with Figma) |
| First visit / Acupuncture / Science / Gallery / Book visit | stacked / 496 / 2 x 2 grid / 171px + arrows / map 323 | swipe / 727 / swipe / 334px / 248 | Fixed |
| Concierge care (all pages, mobile) | options 191px under the title, list 14px under the panel title | +19px (untrimmed intro and panel title) | Fixed in the shared mobile rule (Home and this page draw it identically): 675 vs 676 |
| Treatments intro | "Pulled live from Google. 5.0 across 42 reviews…" (2 lines) | store intro (4 lines, +44px) | Content (Figma copy looks like a designer slip) |
| Hero | title -3%, 255px copy column | -7% (shared hero), 346px | Variance kept (Approach / Team frames use -7% and 347px) |
| Science cards | mobile copy | desktop copy | Content |
| Testimonials | 455 | 687 (live reviews) | Content |

Desktop unchanged (12456; Home 13552, Concierge 10441); no overflow at 390 / 375 / 360 / 1440.

# Concierge mobile (2857:23149) — 2026-10-16

Settings in `page.concierge.json` only: hero / approach (membership split) / includes (numbered glyph columns) /
inquiry `mobile_style: compact` (new setting on `fa-membership` and `fa-inquiry`), expect stack, pillars + truth grid,
gallery small + arrows, book visit page map + "Book now".

| Section | Figma | Before | Status |
|---|---|---|---|
| Hero | 360, copy centred | 422 | Fixed |
| Intro (approach) | centred 32 / 31 title + 14 / 20 text; cards 8 apart (24 / 16-24 / 18-27 type); "Book…" button under the cards | left-aligned, button above the cards | Fixed (824 vs 826) |
| What your membership includes | 2 x 2 grid, numbers 38, titles 14 / 16, checks 11 / 15 | single column, 48 / 24 / 17 | Fixed (519 vs 515) |
| Ready to begin (inquiry) | 14 / 20 intro, 20px steps title, 44px fields, 16px labels, radios in a row, full-width 46px submit | 16 / 24, 22px, 52px, 18px, stacked radios, hug button | Fixed (1317 = Figma); the third radio wraps (hosted face wider): +26px |
| What to expect | stacked 351 x 411 moss cards | swipe row | Fixed (1549 vs 1547) |
| Pillars / Truth / Gallery / Book visit | grids / 171px + arrows / map 323 | swipe / 334 / 248 | Fixed (pillars 683 = Figma; truth 818 vs 793 as on Home: three-line title, font) |
| Intro button | "Book your first visit" | "Book now" (setting) | Content |
| Hero | rating line 14px above the title, title -3% | 19px, -7% (shared compact hero) | Variance kept |

Desktop unchanged (Concierge 10441, Home 13552, article 8551); no overflow at 390 / 375 / 360 / 1440.

# Blog listing mobile (2860:24040) — 2026-10-16

`fa-blog-listing` (blog page only) gets Figma's mobile layout in place of the old undrawn one. Settings in
`page.blogs.json` only: hero compact (83px below), "Ready to start" CTA and e-book sign-up `mobile_style: compact` (new
setting on `fa-signup`), gallery small + arrows, book visit page map + "Book now".

| Section | Figma | Before | Status |
|---|---|---|---|
| Hero | 360 | 422 | Fixed |
| Featured post | 351 x 228 row card: photo 175 left, meta 9, title 17 / 17, excerpt 12 / 15 (4 lines, ellipsis), link 14 | full-width stacked card, 26 / 16 / 18 type | Fixed |
| Post cards | 2-column grid of 172 x 299 cards (photo 139, 15 / 13 titles, 2-line excerpts) | one column of 351 x 445 | Fixed (cards 299 = Figma) |
| Ready to start your care? | 331, buttons side by side | 494, stacked | Fixed (331 = Figma) |
| E-book sign-up | 563: 32 / 30 title in 244, 14 / 20 intro, 40px fields, 137px button | 696 | Fixed (563 = Figma) |
| Pagination | not drawn | shown (more than 7 posts) | Unclear (as on desktop): +83px |
| Post data | sample posts, tags in the meta | live posts, no tags | Content |

No overflow at 390 / 375 / 360 / 1440; article and E-Books (shared CTA / sign-up sections) unchanged.

# Article mobile (2860:25002) — 2026-10-16

`fa-article` (article template only) gets Figma's mobile type and spacing in place of the old undrawn values. Settings in
`article.json`: "Ready to start" CTA compact, team stacked, gallery small + arrows, book visit page map + "Book now".

| Section | Figma | Before | Status |
|---|---|---|---|
| Header | eyebrow 14, title 40 / 32, subtitle 16 / 24 in 279, meta 16, photo 351 x 244 | 16, 34 / 34, 18 / 24, 15, 351 x 167 | Fixed (positions match to 1px) |
| Contents / booking boxes | title 24, links 14, full-width 39px button | 24, 15, hug button | Fixed |
| Body | LCC 14 / 20, headings Marisa 24 / 24 | 18 / 28, 28 / 30 | Fixed |
| E-book box | 20px padding, title 20 / 22 in 235, 40px fields 10 apart, full-width button | 18px, 22 / 26, 50px fields, hug button | Fixed (box offsets match Figma) |
| Ready / Team / Gallery / Book visit | 331 / stacked 1875 / 368 / map 323 | 494 / swipe / 533 / 248 | Fixed (331, 1867, 370) |
| Body copy | abridged sample text ("…") | full post | Content (article band 3716 vs 2591) |
| Paragraph spacing | 24px in the intro, 14px inside "The Trinity…" | 24px everywhere | Designer variance, kept 24 |

Desktop unchanged (8551); no overflow at 390 / 375 / 360 / 1440.

# E-Courses mobile (2860:26195) — 2026-10-16

`fa-checklist` and `fa-modules` (E-Courses only) get Figma's mobile values in place of the old undrawn ones. Settings in
`page.courses.json`: hero / teacher / CTA / e-book compact, pillars grid + light mobile background, gallery small +
arrows, book visit page map + "Book now". Compact hero: a lone button is 164 wide and centred.

| Section | Figma | Before | Status |
|---|---|---|---|
| Hero | 360, centred 164px "Enroll now" | 422, full-width button | Fixed (button at Figma's x 106 / y 235) |
| What's included | photo 351 x 283; items 18 / 20 + 16 / 18; full-width button | 351 x 259; 22 / 22 + 16 / 24; hug button | Fixed (798 = Figma) |
| What you will learn | cards 12 apart: 1st / 5th photo 307 x 274, others 311 x 140; label 14, title 24 / 26 | 280px rows | Fixed (1699 vs 1706) |
| Meet your teacher | photo r6, 28 / 24-26 type, full-width 39px buttons | 32 / 16 type, hug buttons | Fixed (857 = Figma) |
| Ready / E-book | 331 / 563 | 494 / 696 | Fixed (= Figma) |
| Four pillars | 2 x 2 grid on a light band, moss heading | swipe row; moss heading on the dark mobile texture (unreadable) | Fixed (683 = Figma) |
| Pillar copy | "It's time-tested" | "Acupuncture" | Content |
| Module photos | sample photos | store photos | Content |

Desktop unchanged (8318); no overflow at 390 / 375 / 360 / 1440 (also Our Team, E-Books).

# E-Books mobile (2860:27436) — 2026-10-16

Settings in `page.books.json`: hero sign-up (split) and newsletter (email only) `mobile_style: compact`, truth +
conditions grid, CTA compact, gallery small + arrows, book visit page map + "Book now". `fa-media-text` (E-Books only)
gets Figma's mobile values.

| Section | Figma | Before | Status |
|---|---|---|---|
| E-book form | form first (title 40 / 35, 14 / 22 text, 40px fields, full-width button), cover 351 x 419 r4 below | cover first (442 tall, r10), 32 / 32 title, 52px fields | Fixed (987 = Figma, every element on Figma's y) |
| Truth / What brings you in | 2 x 2 / 2 x 3 grids | swipe rows | Fixed (conditions 1181 vs 1179; truth 818 vs 793 as on Home) |
| Ready to start | 331 | 494 | Fixed |
| Not ready to download | 300: 48px field, 133px button inside | 466 | Fixed (300 = Figma) |
| Course promo | photo 351 x 354 r4, title 30 / 32, text 14 / 16, full-width buttons | 351 x 279 r10, 32 / 32, 16 / 24, hug buttons | Fixed (717 = Figma) |
| Gallery / Book visit | 171px + arrows / map 323 | 334 / 248 | Fixed |

Desktop unchanged (8307; Blog 5904, E-Courses 8318); no overflow at 390 / 375 / 360 / 1440.

# Re-verification, all mobile pages — 2026-10-16

All 9 pages rendered at 375 / 390 / 360 / 1440 after every change of the day; Figma vs build compared side by side.

| Page | 375 height | Overflow (390 / 375 / 360 / 1440) | Desktop 1440 | Theme JS errors |
|---|---|---|---|---|
| Home | 13062 | none | 13552 (unchanged) | none |
| Our Approach | 11119 | none | 11334 | none |
| Our Team | 12815 | none | 12476 (unchanged) | none |
| In-Clinic Services | 12528 | none | 12455 | none |
| Concierge | 10634 | none | 10441 (unchanged) | none |
| Blog | 4948 | none | 5904 | none |
| Article | 8648 | none | 8551 (unchanged) | none |
| E-Courses | 8883 | none | 8318 (unchanged) | none |
| E-Books | 7781 | none | 8307 (unchanged) | none |

(Approach / Services desktop ±1px vs earlier runs: sub-pixel rounding. Only console noise: Shopify's preview CDN / shop.app CSP.)

Still open (content / decisions, unchanged): homepage "What brings you in" button ("View services" outline in the mobile
frame vs the shared "Book now" setting); Our Team appointments matrix and profile notes; footer link-list style;
blog pagination; live reviews / posts / photos vs Figma samples; Marisa wrap points.

# Mobile style verification, all pages — 2026-10-16 (text-level)

Every text layer of the 9 mobile frames (page-specific bands; shared bands on Home) dumped with `use_figma`
(family / weight / size / line height / tracking / colour) and matched to the computed styles at 375
(`dom-extract.mjs`, compared locally): 428 texts matched.

| Page | Element | Figma | Before | Status |
|---|---|---|---|---|
| Approach / Team / E-Courses | Profile name, focus line, text, quote | white | linen | Fixed (compact profile) |
| In-Clinic Services | Treatment title / lead / text | white, title 0 tracking | linen, -4% | Fixed |
| Approach | Pillar card title / text | linen | white | Fixed |
| Concierge | "What happens after you submit" steps | garnet | clay | Fixed |
| Concierge | "What to expect" durations | -4% | -6% | Fixed |
| Our Team | "Still not sure?" note | 17 / 18 | 17 / 16 | Fixed |
| Blog | E-book intro / button label | linen / white | white / linen | Fixed |
| Home (+ article) | "Meet the team" label | white | linen | Fixed |
| All | Review text | 14 / 20 | 14 / 22 | Fixed (shared mobile rule) |
| Blog / E-Courses | Two-line hero title | 40 / 35 | 40 / 33 (rule added for Services) | Fixed: back to 35; Services' 33 is the one-off (+2px) |
| Services / Concierge | Hero title tracking | -3% | -7% (Approach / Team / Blog / E-Courses frames) | Variance kept |
| Our Team | Caroline / Sarah outline labels | 13px | 14px | One-off in Figma, kept |
| Home | "What brings you in" button | "View services", outline | "Book now", garnet (shared setting) | Content |

Remaining comparator hits are false pairs (same opening words in two places, the blog's featured post differs from the
store's). After the fixes: no overflow at 390 / 375 / 360 / 1440, no theme JS errors, desktop heights unchanged.

# Our Team mobile — client review fixes (2026-10-16)

| Section | Figma 2821:4461 | Before | Status |
|---|---|---|---|
| Profiles (Felice, Caroline) | no "Books online (existing patients)…" note | note under the buttons | Fixed: hidden on mobile (compact team profile); Felice 847 = Figma |
| Profiles | outline labels on one line (13px) | "Read Caroline's Substack" wrapped | Fixed: 13px, no wrap |
| Find the right practitioner | note on three centred lines (link on its own line), full width, 17 / 22; band ends 47px under it | two lines, narrow box, 18 lh, 60px | Fixed (925 vs 920: one two-line card title) |
| Appointments | practitioner matrix: moss head row, label bar + cell row per appointment, ● / --- / "Waitlist", "Book now →" foot | desktop list | Fixed: new "Layout on mobile: Practitioner matrix" setting on `fa-appointments` (desktop keeps the list); 1254 vs 1246 |

Needs decision / data:
- The matrix heading in Figma repeats "Find the right practitioner"; the section keeps "Appointments by practitioner".
- Figma marks Dr. Sarah "---" for Cupping New Patient and Cupping Follow-up; the store rows list her. Edit the rows'
  Practitioners field if Figma is right.
- "Waitlist" for Dr. Felice on Initial Visit comes from the new per-row "Waitlist" field (set to match Figma).
- All "Book now →" links use the section's default booking link (Figma has no per-practitioner targets).

# Photos vs Figma — truth cards + E-Courses modules (2026-10-16)

The bundled photos were older picks (modules 3 and 4 even shared one file). Figma uses the same photos on desktop and
mobile, cropped per frame, so both crops were exported at 2x from the latest frames and saved as WebP:

| Section | Figma nodes (desktop / mobile) | New assets | Pages |
|---|---|---|---|
| The truth about TCM (4 cards) | 2669:25130–25148 / 2869:2266–2285 | `fa-feature-cards-truth-*-v2.webp` (652 x 420) + `*-mobile-v2.webp` (342 x 332) | Home, E-Books, Concierge |
| What you will learn (5 modules) | 2770:2789 / 2818 / 2814 / 2806 / 2796 and 2860:26401 / 26416 / 26427 / 26435 / 26408 | `fa-modules-{1-5}-v2.webp` + `-mobile-v2.webp` | E-Courses |

New block setting "Bundled image file (mobile)" on `fa-feature-cards` and `fa-modules`: a `<picture>` source up to 899px.
Verified: every card loads the right file at 375 and 1440, no broken images, section heights and desktop page heights
unchanged, no overflow. The old .jpg files stay in assets (unused by these templates).

# PPC Landing Page (Figma LP 3014:4049) — 2026-10-20

Built as `templates/page.ppc.json` + PPC header group. Section heights vs Figma (desktop / mobile): header 122 / 94,
hero 683 / 655 (656), strip 119 / 137 (135), conditions 1443 (1447) / 1181 (1179), first visit 1189 / 1658 (1656),
pricing 762 (761) / 759 (754), truth 700 (698) / 818 (793, as Home), team 952 (951) / 1867 (1875), clinic 1086 /
806, FAQ 795 / 870, banner 476 (477) / 236, trust 172 / 304, book visit + footer 857 (855). Testimonials 998 / 653
vs 634 / ~475: live reviews (as on every page). No overflow at 390 / 375 / 360 / 1440; Home 13552 and Our Approach
11335 unchanged with the standard header.

Needs decision / placeholders:
- Hero mobile caption contains "[client to confirm]" (Figma copy, shown as written).
- "Regular pricing" repeats "Cupping add-on · $100" twice in Figma (kept as drawn).
- All booking buttons use the site's Jane booking link; the call line uses (424) 478-0019 (header / footer number).
- No form on this page in Figma (nothing to connect).
- noindex: not set (not confirmed). Page title / meta description: the page's SEO fields in Shopify admin.
- The page itself must be created in admin (title "PPC Landing Page", template "ppc"); no product exists for a PDP check.
- Mobile conditions button reads "View services" in Figma, "Book now" on desktop: kept "Book now" (shared copy).

# 2026-10-21
- "What people are saying" (fa-testimonials) disabled on every template (`"disabled": true`: index, approach, team,
  in-clinic services, concierge, books, ppc) — re-enable per page in the theme editor.
- PPC Landing Page: the homepage photo strip (fa-photo-gallery "gallery": 5 photos, arrows, Facebook / Instagram,
  "Follow @feliceacupuncture"; small squares + arrows on mobile) added after the FAQ.
- Not verified in the browser: port 9292 was serving another store's theme (Moonbow) at the time.
- Blog listing: new "Show all articles on one page" setting (fa-blog-listing; paginates by 250), on in page.blogs.json — no page links. Not browser-verified (no Felice dev server on 9292).
- Our Team appointments: practitioner matrix on desktop too (new "Layout on desktop" setting; Figma 2995:26395):
  1172px frame, 57 / 58px rows, 520 + 4 x 150 columns, Book now under each practitioner; frame 873 = Figma.
- Our Team "Find the right practitioner": one line (heading width 790; setting range now 600–800).
- Hero buttons: white label at all widths (blog desktop linen via setting); E-Books split title linen.
- Treatment Book now label garnet (was moss). Inner-page galleries 765 / photos at 120 (= Home and Figma).
- PPC: struck $250 in hero + strip in Libre Caslon Text (78 / 64 wide = Figma 78 / 65); banner row 476 space-between.
- Not changed (Figma disagrees with the review notes): PPC banner "Regular" sits after $250 in one row (3014:4054
  2147256069) and $250 = Marisa Regular 37.1 (build 77px wide = Figma 77); PPC pricing offer panel = 456 x 397 at the
  same top as the "What's included" side (2147255934) — build 456 x 398.
- Hero eyebrow 16 / 20 on desktop (title unmoved); conditions mobile button white, 42px sides, Home / PPC "View services"
  (new mobile label / link settings); mobile footer headings 18px; Herbal Wellness card restored (was "Virtual
  Wellness" in index.json); home hero buttons 250 x 54; spacious CTA button 289 x 54; treatment rows: photo 682 x 422
  at the top of the 500px row; related articles skip the current post; menu / footer "Our Services" links ->
  /pages/services (the ?view=services template no longer exists).
- Not changed (already = Figma): concierge text opacity (white 90% / moss 80% / linen 80%), footer desktop columns.
- Content: the organ-clock post has no H2 / H3 headings, so no contents box and the e-book sits at the end.
- Several review notes describe the live (published) theme, which does not receive dev-theme changes.
- PPC banner mobile: "Regular" and the offer terms raised to 12px (Figma 7.9 / 8.7) — still fit the 296px row.
- PPC mobile sticky booking bar on (Call or text / Book · $150), via ppc-header-group.
- Tap targets (mobile): footer links 44px rows; "Follow @…" 45px hit area; practitioner "Book →" rows 44px (cards taller).
- Pending: Jane treatment 33 for PPC offer buttons (awaiting Iram); PPC page SEO title / description (admin page fields).
- FAQ: questions with a blank answer are hidden ("What should I wear…" has no answer anywhere, Figma included — needs copy). Inquiry: blank first option (required now fires), phone digits / + ( ) - . only. Concierge intro "Book now" -> #inquiry form.
- Blog index redirect reverted (no redirection work, per client).
