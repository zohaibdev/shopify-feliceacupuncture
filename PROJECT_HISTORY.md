# Felice Acupuncture: Project History

Work log of the Figma → Shopify theme build, all Claude Code sessions (2026-09-29 → 2026-10-23).
Sources: `context.md`, `qa/REPORT.md`, `qa/MAP.md`, `qa/LINKS.md`, `.claude/skills/figma-sync/SKILL.md`, the session
transcripts in `~/.claude/projects/E--Edits-felicea/` (user prompts + final summaries only) and spot checks of the code.
**No git history:** the project folder is not a git repository, so dates come from session timestamps and QA notes.

## 1. Project overview

- **Site:** Felice Acupuncture, Culver City. Live site feliceacupuncture.com (Wix); booking on Jane App
  (`feliceacupuncture.janeapp.com`).
- **Stack:** Shopify OS 2.0 theme built on Dawn 16.0.0. Liquid sections + JSON templates, plain CSS per section
  (`assets/fa-*.css`), small vanilla JS custom elements (`assets/fa-*.js`). No build step, no framework.
- **Custom code:** everything custom is prefixed `fa-` (sections, snippets, assets). Dawn files are left alone except
  wiring points in `layout/theme.liquid`, `snippets/fa-head.liquid` and `config/settings_schema.json` ("Felice" group).
- **Content:** page content lives in section/block settings in `templates/*.json` (editable in the theme editor).
  Blog posts are real Shopify articles (blog handle `blogs`).
- **Store / themes:** store `gauhj3-n8.myshopify.com`. Dev theme `189312729201`, the theme all work is on. The reviewer's draft theme
  `189307748465` does not receive dev changes unless pushed (push needs the client's confirmation).
- **Run:** `shopify theme dev --store gauhj3-n8.myshopify.com --theme 189312729201` → http://127.0.0.1:9292.
  Shareable preview: `https://gauhj3-n8.myshopify.com/?preview_theme_id=189312729201`.
- **Key folders:** `sections/` (fa-* sections), `templates/` (page JSON), `assets/` (CSS/JS/bundled images),
  `snippets/` (fa-head, fa-header-item, fa-link-target, icons), `qa/` (MAP, REPORT, LINKS), `graphify-out/`
  (code knowledge graph), `.claude/skills/figma-sync/` (workflow skill).

## 2. Timeline

### 2026-09-29 → 10-02: first build (session 94a8406a)
- Goal: build the homepage from Figma V4 (file `qQia718990mb555JZaqqLk`, `414:251`), desktop + mobile.
- Done: header, hero, conditions, first visit, services, CTA banner, team, testimonials, FAQ, book visit, footer;
  map iframe instead of a static map image; subtle motion (`fa-motion.js`, reveal classes); stats bar marquee.
- Our Services template started (2026-09-30), then moved to the Internal file `B4QcctWXiG9ywP3uRA3coG` (2263:2285).
- Our Approach page as reusable sections (2026-10-02); external links open in a new tab.
- Files: `sections/fa-*.liquid`, `assets/fa-*.css`, `templates/index.json`, `context.md`. Status: Done.

### 2026-10-07 → 10-12: QA + header redesign (session 94a8406a, continued)
- Home QA vs Figma; header redesign desktop + mobile (Figma 2519:3714) with dropdowns and mobile accordion menu.
- Home page re-synced to the client's updated design (2612:2294). Status: Done.

### 2026-10-13: Figma sync, new pages, fonts (session ddc47476)
- Home synced with updated Figma (token-efficient sync task); no sub-agents (client rule).
- Our Approach updated (2669:35774); Our Team page created (2669:30124); QA of the three pages.
- Heading font mismatch fixed (see §5). Hero video field, page linking, Book Now dropdown (desktop).
- FAQ: first item open by default on every page with an FAQ (Liquid renders `open`, no JS).
- Status: Done.

### 2026-10-13 → 10-14: page review, reviews widget, more pages (sessions 2ee88177, b5be38fe, 37af1132)
- Review of 3 pages from a client PDF: button borders, border radius, background positions.
- Facebook URL updated everywhere (`facebook.com/feliceacupuncture`).
- Google reviews widget (free option, Featurable) wired into testimonials (see §3).
- New pages: In-Clinic Services (2669:28400), Concierge (2644:14066), Blog listing (2719:19545), Article single
  (2719:21021, contents box from H2/H3 anchors, smooth scroll, sticky sidebar), E-Courses (2760:4055), E-Books (2770:5749).
- Full desktop QA of all pages (`qa/REPORT.md` "Full desktop QA … 2026-10-14"); site-wide link audit (`qa/LINKS.md`).
- Header/footer links updated; main header made sticky; graphify graph built (`graphify-out/`).
- Status: Done.

### 2026-10-14 → 10-16: mobile responsive (session 37af1132)
- Home mobile (2715:2467, later 2794:1089) and band/marquee after the hero matched to Figma.
- Final social links for practitioner cards (2026-10-15).
- Mobile syncs: Our Approach 2821:6541, Our Team 2821:4461, In-Clinic Services 2855:16669, Concierge 2857:23149,
  Blog 2860:24040, Article 2860:25002, E-Courses 2860:26195, E-Books 2860:27436; text-level style verification.
- Policy pages restyled with the current UI kit (`assets/fa-policy.css`). Home: 4 updated sections synced.
- Status: Done. Breakpoint is 899px (mobile ≤899). PDP page untouched (unverified).

### 2026-10-19 → 10-20: home tweaks + PPC landing page (session 37af1132)
- Home product-card link/hover + equal FAQ columns task (interrupted; result unverified).
- PPC Landing Page template from Figma "LP" 3014:4049 (frames mis-named "Our Approch"): see §3.
- Reviews section disabled site-wide (client); photo gallery added to the PPC page; blog listing shows all posts
  (no pagination, setting in `fa-blog-listing`). Status: Done.

### 2026-10-21 → 10-23: client review rounds (sessions b5be38fe, 37af1132)
- 19-item review fixed: offer banner button, hero label colours, practitioner heading on one line, appointments table
  rebuilt as a practitioner matrix (`fa-appointments`), conditions mobile "View services" button, gallery heights,
  treatment buttons (garnet on linen, 161×54), mobile 12px for PPC "Regular"/terms, tap targets ≥44px (footer links,
  Follow link, practitioner Book links), FAQ items without an answer hidden, inquiry form validation.
- 404 page: "Back to home" button → `/` (`sections/main-404.liquid`). `?view=` stripped from menu links.
- Booking links: PPC CTAs → Jane location booking URL; Services cards and Our Team rows → per-treatment Jane IDs;
  Dr. Felice → `staff_member/1`.
- Empty collection pages redirect home with JS (`layout/theme.liquid`); blog redirect was reverted (client: no redirects).
- Google Tag Manager `GTM-WH26D6W3` installed (theme setting).
- E-Books horizontal scroll on phones fixed (sign-up title no-wrap rule scoped); site-wide 12px mobile minimum was
  applied then reverted on request (2026-10-22).
- Services: "Your first step toward lasting balance" banner re-enabled; all four such banners use the living-room
  photo; Services/Blog button 265px; "Read article →" links garnet; E-Books newsletter title on two lines (2026-10-23).
- Status: Done on the dev theme; not pushed to the reviewer theme.

## 3. Feature summary by area

### Pages and routes (template → URL → Figma "Latest pages" 2993:8)
| Page | Template | URL |
|---|---|---|
| Home | `index.json` | `/` |
| Our Approach | `page.approach.json` | `/pages/our-approach` |
| Our Team | `page.team.json` | `/pages/our-team` |
| In-Clinic Services | `page.in-clinic-services.json` | `/pages/in-clinic-services` (`/pages/services` 301s here) |
| Concierge | `page.concierge.json` | `/pages/concierge` |
| Blog listing | `page.blogs.json` | `/pages/blog` |
| Article | `article.json` | `/blogs/blogs/<handle>` |
| E-Courses / E-Books | `page.courses.json` / `page.books.json` | `/pages/e-courses`, `/pages/e-books` |
| PPC Landing Page | `page.ppc.json` | `/pages/landing-page` (`/pages/ppc` 301s here) |
| Policies, 404, contact | Dawn templates + `fa-policy.css`, `main-404.liquid` | `/policies/*`, any bad URL |
Templates are assigned per page in admin; `?view=` URLs are no longer used. Section map per page: `qa/MAP.md`.

### Header variants
- Main: `sections/header-group.json` → `fa-header` (top bar, logo, nav with dropdowns, Book Now). Sticky.
- Book Now dropdown: header block with sub-links (`snippets/fa-header-item.liquid`), modelled on the live site.
- PPC: `sections/ppc-header-group.json`, rendered by `layout/theme.liquid` when the template suffix starts with `ppc`
  (logo + wordmark + one CTA, mobile sticky booking bar).

### Footer
- `sections/footer-group.json` → `fa-footer` (newsletter, columns, social). Shared by all pages including PPC.

### Hero video field
- `sections/fa-hero.liquid`: settings `video` (Shopify-hosted file) or `video_url` (.mp4/.webm). Empty = photos.
  The client adds it in the theme editor → page → Hero section.

### FAQ
- `sections/fa-faq.liquid`: native `<details>`, first item open by default; questions with a blank answer are hidden.

### Reviews widget
- Featurable (free). Theme setting `fa_reviews_widget_id` (Theme settings → Felice → Google reviews); loader in
  `assets/fa-testimonials.js`. Review blocks are the fallback. Testimonials sections are currently disabled site-wide.

### Links and booking
- Audit and fixes: `qa/LINKS.md`. External links open in a new tab (`snippets/fa-link-target.liquid`).
- Jane IDs used: treatments 1, 2, 7, 28 (discipline 1), 4, 6, 25, 29 (discipline 2), 9 (discipline 3);
  staff 1 Felice, 2 Sam, 3 Sarah, 4 Caroline (checked against Jane's booking page, 2026-10-22).

### Mobile responsive
- Breakpoint 899px; mobile settings add modifier classes with CSS inside `@media (max-width: 899px)`.

### PPC template: another PPC page
- Duplicate `templates/page.ppc.json` as `page.ppc-<name>.json`, create the page in admin, pick the template; SEO
  title/description in the page's admin fields. The PPC header group is shared by all PPC templates.

### Analytics
- GTM: theme setting `fa_gtm_id` (Theme settings → Felice → Google Tag Manager); snippet in `layout/theme.liquid`,
  skipped in the theme editor. No consent gating.

## 4. Design system notes

- Tokens: CSS custom properties in `assets/fa-base.css` (colours e.g. `--fa-garnet` #922039, `--fa-moss`,
  `--fa-linen`; radius, gutter, motion durations).
- Fonts: Marisa (display, licensed) + Libre Caslon (text). `@font-face` and preload in `snippets/fa-head.liquid`;
  theme asset first, else the `fa_marisa_url` setting (currently the Wix-hosted file). Libre Caslon Text declared in
  `assets/fa-ppc.css` for the struck PPC price.
- Breakpoints: desktop ≥900, mobile ≤899 (some sections also use 1100 / 1099 for tablet).
- Shared sections are reused across pages; page-specific looks are section settings (modifier classes), never page
  CSS. Scope rule: change a shared section only behind a setting or selector that leaves other pages unchanged.
- No `!important`; no `will-change` (motion rules).

## 5. Issues found and root causes

- Heading font wrong: `@font-face 'Marisa'` only emitted when a setting said the file was uploaded → fallback font.
  Fix: one face loading from the theme asset or the `fa_marisa_url` URL (`snippets/fa-head.liquid`).
- Template settings lost on upload: JSON uploaded before its new schema setting existed. Fix: re-save the template.
- Phone `pattern` ignored: Chrome uses v-flag regex. Fix: escape `( )` in the character class (`fa-inquiry.liquid`).
- E-Books side-scroll on phones: a 21 Oct "keep Gut Health E-book on one line" no-wrap rule hit every sign-up title.
  Fix: scoped to non-newsletter titles (`assets/fa-signup.css`).
- Services banner missing: section disabled in the theme editor. Fix: re-enabled in `page.in-clinic-services.json`.
- Dev server error pages: `sed -i` temp files in `templates/` were uploaded. Fix: edit with Python, restart server.
- Booking interstitial ("Are you sure you want to leave"): Shopify password-page behaviour, not the theme.
- Reviewer "still open" reports: the reviewer views theme 189307748465, which lacks dev changes.
- Border radius / background-position fixes (2026-10-13 review): details in that session (unverified here).

## 6. Pending / open items

- Push dev theme to the reviewer/live theme: needs client confirmation (declined on 2026-10-22).
- Kajabi checkout link (`felice-chan.mykajabi.com/offers/pTosH8gc/checkout`, E-Books + E-Courses) redirects to a login.
- Jane IDs needed for Tui Na Massage and Herbal Wellness (Services cards fall back to Initial Visit).
- Jane treatment 33 for PPC offers (awaiting Iram); PPC page SEO title/description (admin).
- FAQ "What should I wear to my appointment?" has no answer copy (hidden until provided).
- Marisa font still loads from the Wix URL; upload `fa-marisa-bold.woff2` before Wix closes.
- Review notes disputed against Figma (PPC banner button 193 vs 214, banner price sizes, pricing card): need the
  reviewer's node IDs.
- Mobile text under 12px and tap targets under 44px that follow Figma (e.g. header top bar 10px, "Learn more" 27px):
  client decision.
- Our Team appointment rows have no per-treatment links (Figma matrix shows none).
- GTM has no consent gating; store has 0 products (empty collections redirect home).

## 7. How to continue

- Prompt pattern: "Use the figma-sync skill. Figma URL: https://www.figma.com/design/B4QcctWXiG9ywP3uRA3coG/…?node-id=<node>
  Page: <page>. Desktop/mobile: <which>." Add review notes verbatim; state constraints (no sub-agents, no redirects).
- Before code questions: `graphify query "<question>"`; after code edits: `graphify update .` (see `CLAUDE.md`).
- Skills:
  - `figma-sync` (`.claude/skills/figma-sync/SKILL.md`): Figma → theme sync workflow, pixel-perfect and full-QA
    checklists, heading-font debugging, mobile rules, PPC template notes.
  - `graphify` (global): builds/queries the code knowledge graph in `graphify-out/`.
- QA aids: `qa/MAP.md` (page → section map), `qa/REPORT.md` (every QA round), `qa/LINKS.md` (link audit).
