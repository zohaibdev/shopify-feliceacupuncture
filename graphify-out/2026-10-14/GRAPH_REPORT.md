# Graph Report - felicea  (2026-10-14)

## Corpus Check
- Large corpus: 457 files · ~866,204 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 739 nodes · 1218 edges · 52 communities (22 shown, 30 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Photo Gallery Carousel
- Project Docs & Page Map
- Dawn Global Components
- Cart Items & Updates
- Section Rendering Utilities
- Collection Facet Filters
- Quick Order List
- Predictive Search
- Slider & Slideshow
- DOM Extract & Text QA
- Link Gallery Drag
- Figma Match QA Script
- Cart Disclosure Modal
- Quick Add Bulk
- Cart Drawer
- Localization Form
- Gift Card Recipient Form
- Testimonials Carousel & Reviews
- Bulk Add to Cart
- Customer Addresses
- Figma Band Dump
- Cart Notification
- Variant Selection
- Pickup Availability
- Quick Add Modal
- Figma QA Dump
- Details Disclosure Menus
- Product Media Gallery
- Details Modal
- Main Search
- Volume Pricing
- Quantity Input
- Image Magnify
- Search Form
- 3D Product Model
- Cart Standard Actions
- Scroll Animations
- Product Modal
- Figma Text Dump
- Cart Tooltip
- PubSub Events
- Disclosures Content
- Password Modal
- PubSub Constants
- Graphify Usage Rules

## God Nodes (most connected - your core abstractions)
1. `FaPhotoGallery` - 72 edges
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
- `Dawn Theme Instructions (OS 2.0, keep setting IDs)` --conceptually_related_to--> `fa- prefixed sections on Dawn 16`  [INFERRED]
  AGENTS.md → context.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flowers crossing section lines via Figma transforms** — context_fa_botanical, context_fa_signup, context_fa_faq, context_botanical_figma_transforms [EXTRACTED 1.00]
- **Education pages (blog, article, e-courses, e-books)** — context_blog_page_v1, context_article_v2, context_e_courses_v1, context_e_books_v2 [INFERRED 0.85]
- **Computed-style QA toolchain** — claude_skills_figma_sync_skill_full_qa_checklist, claude_skills_figma_sync_scripts_dom_extract, claude_skills_figma_sync_scripts_qa_figma_match, qa_report_desktop_qa_report [EXTRACTED 1.00]

## Communities (52 total, 30 thin omitted)

### Community 1 - "Project Docs & Page Map"
Cohesion: 0.09
Nodes (52): Dawn Theme Instructions (OS 2.0, keep setting IDs), Component patterns (hero video, page links, Book Now dropdown, reviews, FAQ default open), Figma → theme sync workflow, Page review checklist (client review docs), Pixel-perfect checklist, Article single template (Figma V2 2719:22580), Blog listing page template (Figma V1 2719:19545), Concierge page (Figma V1 2644:15168) (+44 more)

### Community 2 - "Dawn Global Components"
Cohesion: 0.07
Nodes (13): BulkModal, DeferredMedia, getFocusableElements(), HeaderDrawer, MenuDrawer, addTrapFocus(), ModalDialog, ModalOpener (+5 more)

### Community 3 - "Cart Items & Updates"
Cohesion: 0.09
Nodes (7): CartItems, CartRemoveButton, CartPerformance, createCartLinesUpdateEvent(), handleErrorMessage(), onSubmitHandler(), resolveCartLinesUpdate()

### Community 4 - "Section Rendering Utilities"
Cohesion: 0.08
Nodes (19): HTMLUpdateUtility, SectionId, buildRequestUrlWithParams(), connectedCallback(), getSelectedVariant(), getVariantSelects(), handleOptionValueChange(), handleSwapProduct() (+11 more)

### Community 5 - "Collection Facet Filters"
Cohesion: 0.11
Nodes (4): FacetFiltersForm, FacetRemove, PriceRange, onKeyUpEscape()

### Community 6 - "Quick Order List"
Cohesion: 0.09
Nodes (22): cleanErrorMessageOnType(), connectedCallback(), constructor(), getCartQuantityForLine(), getSectionsToRender(), getTotalBar(), handleScrollIntoView(), handleSwitchVariantOnEnter() (+14 more)

### Community 9 - "DOM Extract & Text QA"
Cohesion: 0.10
Nodes (12): hover, [url, out], byKey, fig, figByKey, [figPath, url, width = '1440'], issues, missing (+4 more)

### Community 11 - "Figma Match QA Script"
Cohesion: 0.12
Nodes (5): DYT, figB, issues, out, used

### Community 13 - "Quick Add Bulk"
Cohesion: 0.21
Nodes (8): constructor(), getSectionsToRender(), getSectionsUrl(), listenForActiveInput(), listenForKeydown(), renderSections(), selectProgressBar(), updateMultipleQty()

### Community 15 - "Localization Form"
Cohesion: 0.21
Nodes (7): closeSelector(), filterCountries(), hidePanel(), normalizeString(), onContainerKeyUp(), openSelector(), resetFilter()

### Community 16 - "Gift Card Recipient Form"
Cohesion: 0.27
Nodes (10): clearErrorMessage(), clearInputFields(), constructor(), disableableFields(), disableInputFields(), displayErrorMessage(), enableInputFields(), inputFields() (+2 more)

### Community 19 - "Customer Addresses"
Cohesion: 0.24
Nodes (3): attributes, CustomerAddresses, selectors

### Community 20 - "Figma Band Dump"
Cohesion: 0.18
Nodes (7): b, fillStr(), full, hex(), nodes, styles, t

### Community 24 - "Pickup Availability"
Cohesion: 0.29
Nodes (6): constructor(), fetchAvailability(), handleBodyClick(), hide(), onClickRefreshList(), update()

### Community 25 - "Quick Add Modal"
Cohesion: 0.31
Nodes (7): hide(), preprocessHTML(), preventDuplicatedIDs(), preventVariantURLSwitching(), removeDOMElements(), removeGalleryListSemantic(), updateImageSizes()

### Community 26 - "Figma QA Dump"
Cohesion: 0.22
Nodes (5): B, hex(), paint(), R, S

### Community 28 - "Product Media Gallery"
Cohesion: 0.39
Nodes (8): announceLiveRegion(), constructor(), onSlideChanged(), playActiveMedia(), preventStickyHeader(), removeListSemantic(), setActiveMedia(), setActiveThumbnail()

### Community 31 - "Volume Pricing"
Cohesion: 0.36
Nodes (5): constructor(), getCartQuantity(), getVolumePricingArray(), onInputChange(), updatePricePerItem()

### Community 33 - "Image Magnify"
Cohesion: 0.57
Nodes (6): createOverlay(), enableZoomOnHover(), magnify(), moveWithHover(), prepareOverlay(), toggleLoadingSpinner()

### Community 36 - "Cart Standard Actions"
Cohesion: 0.40
Nodes (4): collectCartSections(), DAWN_CART_TAGS, DAWN_PUBSUB_REFRESHED_SECTIONS, refreshDawnCartUI()

### Community 37 - "Scroll Animations"
Cohesion: 0.60
Nodes (4): initializeScrollAnimationTrigger(), initializeScrollZoomAnimationTrigger(), onIntersection(), percentageSeen()

### Community 38 - "Product Modal"
Cohesion: 0.50
Nodes (3): hide(), show(), showActiveMedia()

## Knowledge Gaps
- **7 isolated node(s):** `Dawn Theme Instructions (OS 2.0, keep setting IDs)`, `graphify Usage Rules`, `Scroll-reveal motion (fa-motion.js, html.fa-motion)`, `fa-first-visit steps`, `Local liquidjs harness + headless Chrome checks` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 206 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `onKeyUpEscape()` connect `Collection Facet Filters` to `Dawn Global Components`, `Cart Drawer`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `Dawn Theme Instructions (OS 2.0, keep setting IDs)`, `graphify Usage Rules`, `Scroll-reveal motion (fa-motion.js, html.fa-motion)` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Photo Gallery Carousel` be split into smaller, more focused modules?**
  _Cohesion score 0.06735159817351598 - nodes in this community are weakly interconnected._
- **Why does `HTMLUpdateUtility` connect `Section Rendering Utilities` to `Dawn Global Components`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `Project Docs & Page Map` be split into smaller, more focused modules?**
  _Cohesion score 0.08806963645673323 - nodes in this community are weakly interconnected._
- **Why does `CartPerformance` connect `Cart Items & Updates` to `Dawn Global Components`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `Dawn Global Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07272727272727272 - nodes in this community are weakly interconnected._