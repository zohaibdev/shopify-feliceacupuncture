# Graph Report - felicea  (2026-10-21)

## Corpus Check
- 135 files · ~903,688 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 244 file(s) not represented in the graph (top: .liquid 137, .css 100, .woff2 7)

## Summary
- 746 nodes · 1238 edges · 50 communities (21 shown, 29 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- FaPhotoGallery
- fa- prefixed sections on Dawn 16
- global.js
- Cart Items & Updates
- product-info.js
- FacetFiltersForm
- quick-order-list.js
- PredictiveSearch
- SlideshowComponent
- FaLinkGallery
- qa-text.mjs
- CartDisclosureModal
- Quick Add Bulk
- CartDrawer
- localization-form.js
- recipient-form.js
- FaTestimonialsCarousel
- BulkAdd
- CustomerAddresses
- band-dump.js
- CartNotification
- VariantSelects
- pickup-availability.js
- qa-dump.js
- DetailsDisclosure
- media-gallery.js
- DetailsModal
- MainSearch
- price-per-item.js
- QuantityInput
- magnify.js
- SearchForm
- product-model.js
- standard-actions-override.js
- animations.js
- product-modal.js
- text-dump.js
- cart-disclosure-tooltip.js
- pubsub.js
- DisclosuresContent
- PasswordModal
- constants.js
- graphify Usage Rules

## God Nodes (most connected - your core abstractions)
1. `FaPhotoGallery` - 75 edges
2. `fa- prefixed sections on Dawn 16` - 32 edges
3. `PredictiveSearch` - 25 edges
4. `FacetFiltersForm` - 22 edges
5. `Felice Acupuncture Shopify theme` - 21 edges
6. `CartItems` - 19 edges
7. `FaLinkGallery` - 18 edges
8. `SlideshowComponent` - 17 edges
9. `Homepage (Figma V6 2669:25037)` - 16 edges
10. `CartDisclosureModal` - 15 edges

## Surprising Connections (you probably didn't know these)
- `fa-testimonials section` --references--> `FaTestimonialsCarousel`  [EXTRACTED]
  context.md → assets/fa-testimonials.js
- `Figma variances between pages (kept build)` --semantically_similar_to--> `Figma-literal choices kept as drawn`  [INFERRED] [semantically similar]
  qa/REPORT.md → context.md
- `Page review checklist (client review docs)` --conceptually_related_to--> `External links open in a new tab (fa-link-target)`  [INFERRED]
  .claude/skills/figma-sync/SKILL.md → context.md
- `Full desktop QA report vs Figma (2026-10-14)` --implements--> `Full QA checklist (computed styles vs Figma)`  [INFERRED]
  qa/REPORT.md → .claude/skills/figma-sync/SKILL.md
- `Component patterns (hero video, page links, Book Now dropdown, reviews, FAQ default open)` --references--> `Google reviews widget (Featurable ID)`  [EXTRACTED]
  .claude/skills/figma-sync/SKILL.md → context.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flowers crossing section lines via Figma transforms** — context_fa_botanical, context_fa_signup, context_fa_faq, context_botanical_figma_transforms [EXTRACTED 1.00]
- **Computed-style QA toolchain** — claude_skills_figma_sync_skill_full_qa_checklist, claude_skills_figma_sync_scripts_dom_extract, claude_skills_figma_sync_scripts_qa_figma_match, qa_report_desktop_qa_report [EXTRACTED 1.00]
- **Education pages (blog, article, e-courses, e-books)** — context_blog_page_v1, context_article_v2, context_e_courses_v1, context_e_books_v2 [INFERRED 0.85]

## Communities (50 total, 29 thin omitted)

### Community 1 - "fa- prefixed sections on Dawn 16"
Cohesion: 0.09
Nodes (52): Dawn Theme Instructions (OS 2.0, keep setting IDs), Component patterns (hero video, page links, Book Now dropdown, reviews, FAQ default open), Figma → theme sync workflow, Page review checklist (client review docs), Pixel-perfect checklist, Article single template (Figma V2 2719:22580), Blog listing page template (Figma V1 2719:19545), Concierge page (Figma V1 2644:15168) (+44 more)

### Community 2 - "global.js"
Cohesion: 0.07
Nodes (13): BulkModal, DeferredMedia, getFocusableElements(), HeaderDrawer, MenuDrawer, addTrapFocus(), ModalDialog, ModalOpener (+5 more)

### Community 3 - "Cart Items & Updates"
Cohesion: 0.09
Nodes (7): CartItems, CartRemoveButton, CartPerformance, createCartLinesUpdateEvent(), handleErrorMessage(), onSubmitHandler(), resolveCartLinesUpdate()

### Community 4 - "product-info.js"
Cohesion: 0.06
Nodes (26): HTMLUpdateUtility, SectionId, buildRequestUrlWithParams(), connectedCallback(), getSelectedVariant(), getVariantSelects(), handleOptionValueChange(), handleSwapProduct() (+18 more)

### Community 5 - "FacetFiltersForm"
Cohesion: 0.12
Nodes (3): FacetFiltersForm, FacetRemove, PriceRange

### Community 6 - "quick-order-list.js"
Cohesion: 0.09
Nodes (22): cleanErrorMessageOnType(), connectedCallback(), constructor(), getCartQuantityForLine(), getSectionsToRender(), getTotalBar(), handleScrollIntoView(), handleSwitchVariantOnEnter() (+14 more)

### Community 11 - "qa-text.mjs"
Cohesion: 0.05
Nodes (17): hover, [url, out], DYT, figB, issues, out, used, byKey (+9 more)

### Community 13 - "Quick Add Bulk"
Cohesion: 0.21
Nodes (8): constructor(), getSectionsToRender(), getSectionsUrl(), listenForActiveInput(), listenForKeydown(), renderSections(), selectProgressBar(), updateMultipleQty()

### Community 14 - "CartDrawer"
Cohesion: 0.19
Nodes (3): CartDrawer, CartDrawerItems, onKeyUpEscape()

### Community 15 - "localization-form.js"
Cohesion: 0.21
Nodes (7): closeSelector(), filterCountries(), hidePanel(), normalizeString(), onContainerKeyUp(), openSelector(), resetFilter()

### Community 16 - "recipient-form.js"
Cohesion: 0.27
Nodes (10): clearErrorMessage(), clearInputFields(), constructor(), disableableFields(), disableInputFields(), displayErrorMessage(), enableInputFields(), inputFields() (+2 more)

### Community 19 - "CustomerAddresses"
Cohesion: 0.24
Nodes (3): attributes, CustomerAddresses, selectors

### Community 20 - "band-dump.js"
Cohesion: 0.18
Nodes (7): b, fillStr(), full, hex(), nodes, styles, t

### Community 24 - "pickup-availability.js"
Cohesion: 0.29
Nodes (6): constructor(), fetchAvailability(), handleBodyClick(), hide(), onClickRefreshList(), update()

### Community 26 - "qa-dump.js"
Cohesion: 0.22
Nodes (5): B, hex(), paint(), R, S

### Community 28 - "media-gallery.js"
Cohesion: 0.39
Nodes (8): announceLiveRegion(), constructor(), onSlideChanged(), playActiveMedia(), preventStickyHeader(), removeListSemantic(), setActiveMedia(), setActiveThumbnail()

### Community 31 - "price-per-item.js"
Cohesion: 0.36
Nodes (5): constructor(), getCartQuantity(), getVolumePricingArray(), onInputChange(), updatePricePerItem()

### Community 33 - "magnify.js"
Cohesion: 0.57
Nodes (6): createOverlay(), enableZoomOnHover(), magnify(), moveWithHover(), prepareOverlay(), toggleLoadingSpinner()

### Community 36 - "standard-actions-override.js"
Cohesion: 0.40
Nodes (4): collectCartSections(), DAWN_CART_TAGS, DAWN_PUBSUB_REFRESHED_SECTIONS, refreshDawnCartUI()

### Community 37 - "animations.js"
Cohesion: 0.60
Nodes (4): initializeScrollAnimationTrigger(), initializeScrollZoomAnimationTrigger(), onIntersection(), percentageSeen()

### Community 38 - "product-modal.js"
Cohesion: 0.50
Nodes (3): hide(), show(), showActiveMedia()

## Knowledge Gaps
- **7 isolated node(s):** `fa-first-visit steps`, `Scroll-reveal motion (fa-motion.js, html.fa-motion)`, `Local liquidjs harness + headless Chrome checks`, `Link targets not built yet (concierge page, terms policy)`, `Pixel-perfect checklist` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 209 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `onKeyUpEscape()` connect `CartDrawer` to `global.js`, `FacetFiltersForm`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `fa-first-visit steps`, `Scroll-reveal motion (fa-motion.js, html.fa-motion)`, `Local liquidjs harness + headless Chrome checks` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `FaPhotoGallery` be split into smaller, more focused modules?**
  _Cohesion score 0.06771929824561404 - nodes in this community are weakly interconnected._
- **Why does `HTMLUpdateUtility` connect `product-info.js` to `global.js`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `fa- prefixed sections on Dawn 16` be split into smaller, more focused modules?**
  _Cohesion score 0.08806963645673323 - nodes in this community are weakly interconnected._
- **Why does `CartPerformance` connect `Cart Items & Updates` to `global.js`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `global.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07272727272727272 - nodes in this community are weakly interconnected._