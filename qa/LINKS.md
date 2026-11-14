# Link audit — 2026-10-14

Desktop. Every `<a>` rendered on the 7 built pages (`links.mjs`, headless Chrome on `127.0.0.1:9292`), before → after.
Targets: live site (feliceacupuncture.com) first, then the matching built page. Header, footer, book-a-visit and gallery links are listed once under "All pages".

**Result:** 0 links left as `#`, empty or `javascript:`; every external link opens in a new tab with `rel="noopener noreferrer"` (shared snippet `fa-link-target`). Dropdown toggles, accordions and carousel arrows are already `<button>`s.

## Target page not built yet

- `/pages/concierge?view=concierge` — store page created (2026-10-14); resolves
- `/policies/terms-of-service` — Terms of Service policy not set (Settings › Policies)
- `/pages/e-courses` — built 2026-10-14 (`page.courses.json`); links now use `/pages/e-courses?view=courses`
- `/pages/e-books` — built 2026-10-14 (`page.books.json`); links now use `/pages/e-books?view=books`

## Update 2026-10-14 (later)

Re-audit of all 9 pages (incl. E-Courses, E-Books): 0 dead links; every internal target returns 200 except
`/policies/terms-of-service` (no Terms of Service policy in Settings › Policies yet). More specific targets:
homepage service cards → `/pages/services?view=services#treatment-<handle>`; team cards (homepage, article) →
`/pages/our-team?view=team#felice|sam|caroline|sarah`; condition "Learn more" links (homepage, Our Approach,
E-Books) → `/pages/our-team?view=team#find-a-practitioner` (live site: "Learn more" → Our Team). All anchors verified.
Store pages still use the default template, so internal links keep `?view=`.

## Links

| Page | Section | Element / label | Current href (before) | Target | Status |
|---|---|---|---|---|---|
| All pages | fa_header | 8526 Washington Blvd, Culver City | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| All pages | fa_header | Call or text (424) 478-0019 | `tel:+14244780019` | `tel:+14244780019` | OK |
| All pages | fa_header | Facebook | `https://www.facebook.com/feliceacupuncture/` | `https://www.facebook.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | fa_header | Instagram | `https://www.instagram.com/feliceacupuncture/` | `https://www.instagram.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | fa_header | Internal Dev Store | `/` | `/` | OK |
| All pages | fa_header | OUR APPROACH | `/pages/our-approach?view=approach` | `/pages/our-approach?view=approach` | OK |
| All pages | fa_header | OUR TEAM | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| All pages | fa_header | OUR SERVICES | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| All pages | fa_header | (fa-header__nav-sublink) | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| All pages | fa_header | (fa-header__nav-sublink) | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| All pages | fa_header | EDUCATION | `/pages/e-courses` | `/pages/e-courses` | OK · target not built yet |
| All pages | fa_header | (fa-header__nav-sublink) | `/pages/e-courses` | `/pages/e-courses` | OK · target not built yet |
| All pages | fa_header | (fa-header__nav-sublink) | `/pages/e-books` | `/pages/e-books` | OK · target not built yet |
| All pages | fa_header | (fa-header__nav-sublink) | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
| All pages | fa_header | BOOK NOW | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| All pages | fa_header | (fa-header__nav-sublink) | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| All pages | fa_header | Home | `/` | `/` | OK |
| All pages | fa_header | Our Approach | `/pages/our-approach?view=approach` | `/pages/our-approach?view=approach` | OK |
| All pages | fa_header | Our Team | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| All pages | fa_header | In-Clinic | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| All pages | fa_header | Concierge | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| All pages | fa_header | E-courses | `/pages/e-courses` | `/pages/e-courses` | OK · target not built yet |
| All pages | fa_header | E-books | `/pages/e-books` | `/pages/e-books` | OK · target not built yet |
| All pages | fa_header | Blog | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
| All pages | fa_header | Book Now | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| All pages | fa_header | Call or text | `tel:+14244780019` | `tel:+14244780019` | OK |
| All pages | fa_header | Book now | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| All pages | clinic | Facebook | `https://www.facebook.com/feliceacupuncture/` | `https://www.facebook.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | clinic | Instagram | `https://www.instagram.com/feliceacupuncture/` | `https://www.instagram.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | clinic | FOLLOW @FELICEACUPUNCTURE | `https://www.instagram.com/feliceacupuncture/` | `https://www.instagram.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | gallery | Facebook | `https://www.facebook.com/feliceacupuncture/` | `https://www.facebook.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | gallery | Instagram | `https://www.instagram.com/feliceacupuncture/` | `https://www.instagram.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | gallery | FOLLOW @FELICEACUPUNCTURE | `https://www.instagram.com/feliceacupuncture/` | `https://www.instagram.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | book_visit | Call or text to book · +1 (424) 478-0019 | `tel:+14244780019` | `tel:+14244780019` | OK |
| All pages | book_visit | info@feliceacupuncture.com | `mailto:info@feliceacupuncture.com` | `mailto:info@feliceacupuncture.com` | OK |
| All pages | book_visit | 8526 Washington Blvd, Culver City, CA 90232 | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| All pages | book_visit | Open In Google Maps | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| All pages | fa_footer | Internal Dev Store | `/` | `/` | OK |
| All pages | fa_footer | Facebook | `https://www.facebook.com/feliceacupuncture/` | `https://www.facebook.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | fa_footer | Instagram | `https://www.instagram.com/feliceacupuncture/` | `https://www.instagram.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| All pages | fa_footer | Our Approach | `/pages/our-approach?view=approach` | `/pages/our-approach?view=approach` | OK |
| All pages | fa_footer | Our Team | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| All pages | fa_footer | Our Services | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| All pages | fa_footer | Book your first visit | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| All pages | fa_footer | Book in-clinic | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| All pages | fa_footer | Book concierge | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| All pages | fa_footer | E-courses | `/pages/e-courses` | `/pages/e-courses` | OK · target not built yet |
| All pages | fa_footer | E-books | `/pages/e-books` | `/pages/e-books` | OK · target not built yet |
| All pages | fa_footer | Blog | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
| All pages | fa_footer | Terms & Conditions | `#` | `/policies/terms-of-service` | Fixed (was dead) · target not built yet |
| All pages | fa_footer | Privacy Policy | `/policies/privacy-policy` | `/policies/privacy-policy` | OK |
| Home | - | Skip to content | `#MainContent` | `#MainContent` | OK |
| Home | hero | BOOK IN-CLINIC | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Home | hero | BOOK CONCIERGE | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| Home | conditions | LEARN MORE → PAIN | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | conditions | LEARN MORE → ANXIETY & STRESS | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | conditions | LEARN MORE → HORMONES & FERTILITY | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | conditions | LEARN MORE → GUT HEALTH | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | conditions | LEARN MORE → SKIN REJUVENATION | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | conditions | LEARN MORE → SLEEP | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | conditions | BOOK NOW | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Home | first_visit | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Home | services | ACUPUNCTURE With acupuncture, we elicit your  | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | services | COSMETIC ACUPUNCTURE Support for circulation, | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | services | CUPPING Cupping involves placing special suct | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | services | TUI NA MASSAGE Tui Na is an ancient Chinese s | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | services | CONTRAST THERAPY Spend time alternating betwe | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | services | VIRTUAL WELLNESS A video consultation to revi | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | services | VIEW SERVICES | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Home | cta_banner | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Home | team | MEET THE TEAM | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Home | team | DR. FELICE CHAN | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Home | team | Instagram | `https://www.instagram.com/feliceacupuncture/` | `https://www.instagram.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| Home | team | Facebook | `https://www.facebook.com/feliceacupuncture/` | `https://www.facebook.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| Home | team | Dr. Felice Chan on Substack | `https://drfelicechan.substack.com/` | `https://drfelicechan.substack.com/` | OK · new tab, noopener noreferrer |
| Home | team | JOIN THE WAITLIST | `mailto:info@feliceacupuncture.com?subject=Waitlist%20for%20Dr.%20Felice` | `mailto:info@feliceacupuncture.com?subject=Waitlist%20for%20Dr.%20Felice` | OK |
| Home | team | DR. SAM AUDETTE | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Home | team | BOOK WITH DR. SAM | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | OK · new tab, noopener noreferrer |
| Home | team | CAROLINE KIRK | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Home | team | Caroline Kirk on Substack | `https://substack.com/@carolinekirklac` | `https://substack.com/@carolinekirklac` | OK · new tab, noopener noreferrer |
| Home | team | BOOK WITH CAROLINE | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | OK · new tab, noopener noreferrer |
| Home | team | DR. SARAH VIDUCIC | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Home | team | Dr. Sarah Viducic on Substack | `https://drsarahviducic.substack.com/` | `https://drsarahviducic.substack.com/` | OK · new tab, noopener noreferrer |
| Home | team | BOOK WITH DR. SARAH | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | OK · new tab, noopener noreferrer |
| Home | testimonials | Read Sabrina Sarmiento's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Home | testimonials | Read Adam Francis's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Home | testimonials | Read Emily Chapel's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Home | testimonials | Read linda danh's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Home | concierge | BOOK CONCIERGE | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| Home | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | OK |
| Home | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | OK |
| Home | posts | READ ARTICLE → : THE HEALING HARMONY OF HYPNO | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK |
| Home | posts | EXPLORE ALL BLOGS | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
| Our Approach | - | Skip to content | `#MainContent` | `#MainContent` | OK |
| Our Approach | hero | BOOK IN-CLINIC | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Approach | hero | BOOK CONCIERGE | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| Our Approach | profile | BOOK NOW | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Approach | profile | JOIN DR. FELICE'S WAITLIST | `mailto:info@feliceacupuncture.com?subject=Waitlist%20for%20Dr.%20Felice` | `mailto:info@feliceacupuncture.com?subject=Waitlist%20for%20Dr.%20Felice` | OK |
| Our Approach | acupuncture | BOOK NOW | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Approach | conditions | LEARN MORE → PAIN | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Our Approach | conditions | LEARN MORE → ANXIETY & STRESS | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Our Approach | conditions | LEARN MORE → HORMONES & FERTILITY | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Our Approach | conditions | LEARN MORE → GUT HEALTH | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Our Approach | conditions | LEARN MORE → SKIN REJUVENATION | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Our Approach | conditions | LEARN MORE → SLEEP | `/pages/services?view=services` | `/pages/services?view=services` | OK |
| Our Approach | conditions | BOOK NOW | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Approach | first_visit | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Approach | testimonials | Read Sabrina Sarmiento's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Our Approach | testimonials | Read Adam Francis's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Our Approach | testimonials | Read Emily Chapel's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Our Approach | testimonials | Read linda danh's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Our Approach | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | OK |
| Our Approach | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | OK |
| Our Approach | posts | READ ARTICLE → : THE HEALING HARMONY OF HYPNO | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK |
| Our Approach | posts | EXPLORE ALL BLOGS | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
| Our Team | - | Skip to content | `#MainContent` | `#MainContent` | OK |
| Our Team | hero | BOOK IN-CLINIC | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | hero | BOOK CONCIERGE | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| Our Team | profile_felice | JOIN THE WAITLIST | `mailto:info@feliceacupuncture.com?subject=Waitlist%20for%20Dr.%20Felice` | `mailto:info@feliceacupuncture.com?subject=Waitlist%20for%20Dr.%20Felice` | OK |
| Our Team | profile_felice | DR. FELICE’S SUBSTACK | `https://drfelicechan.substack.com/` | `https://drfelicechan.substack.com/` | OK · new tab, noopener noreferrer |
| Our Team | profile_sam | BOOK WITH DR. SAM | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | OK · new tab, noopener noreferrer |
| Our Team | profile_sam | READ DR. SAM'S BLOGS | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
| Our Team | profile_caroline | BOOK WITH CAROLINE | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | OK · new tab, noopener noreferrer |
| Our Team | profile_caroline | READ CAROLINE'S SUBSTACK | `https://substack.com/@carolinekirklac` | `https://substack.com/@carolinekirklac` | OK · new tab, noopener noreferrer |
| Our Team | profile_sarah | BOOK WITH DR. SARAH | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | OK · new tab, noopener noreferrer |
| Our Team | profile_sarah | READ DR. SARAH'S SUBSTACK | `https://drsarahviducic.substack.com/` | `https://drsarahviducic.substack.com/` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → DR. SAM AUDETTE, PAIN | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → CAROLINE KIRK, PAIN | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → DR. SARAH VIDUCIC, PAIN | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → DR. SAM AUDETTE, ANXIETY & STRESS | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → CAROLINE KIRK, ANXIETY & STRESS | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → DR. SARAH VIDUCIC, ANXIETY & STRESS | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → CAROLINE KIRK, HORMONES & FERTILITY | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → DR. SARAH VIDUCIC, HORMONES & FERTILIT | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → CAROLINE KIRK, GUT HEALTH | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → DR. SAM AUDETTE, SKIN REJUVENATION | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → CAROLINE KIRK, SKIN REJUVENATION | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → DR. SARAH VIDUCIC, SKIN REJUVENATION | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | BOOK → CAROLINE KIRK, IMMUNE & AUTOIMMUNE | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | OK · new tab, noopener noreferrer |
| Our Team | practitioners | CALL OR TEXT US AT (424) 478-0019 | `tel:+14244780019` | `tel:+14244780019` | OK |
| Our Team | first_visit | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | testimonials | Read Sabrina Sarmiento's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Our Team | testimonials | Read Adam Francis's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Our Team | testimonials | Read Emily Chapel's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Our Team | testimonials | Read linda danh's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → INITIAL VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → FOLLOW-UP TREATMENT · 60 MIN | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → COSMETIC ACUPUNCTURE | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → CUPPING | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → CUPPING NEW PATIENT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → CONTRAST THERAPY | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → BALANCING JAPANESE ACUPRESSURE MASSAGE | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → COMMUNITY EAR ACUPUNCTURE | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → VIRTUAL WELLNESS | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → VIRTUAL TONGUE READING | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → 10-MINUTE CONSULTATION (VIDEO) | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | appointments | BOOK → HOUSE CALL ACUPUNCTURE | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | more_ways | 10-MINUTE CONSULTATION VIDEO · 10 MIN · ALL P | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | more_ways | VIRTUAL WELLNESS VIDEO · 45 MIN INITIAL, 30 M | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | more_ways | VIRTUAL TONGUE READING VIDEO · 20 MIN · DR. S | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | more_ways | HOUSE CALL ACUPUNCTURE AT YOUR HOME · 90 MIN  | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | more_ways | COMMUNITY EAR ACUPUNCTURE IN CLINIC · DR. SAM | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | more_ways | BALANCING JAPANESE ACUPRESSURE MASSAGE IN CLI | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Our Team | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | OK |
| Our Team | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | OK |
| Our Team | posts | READ ARTICLE → : THE HEALING HARMONY OF HYPNO | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK |
| Our Team | posts | EXPLORE ALL BLOGS | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
| In-Clinic Services | - | Skip to content | `#MainContent` | `#MainContent` | OK |
| In-Clinic Services | treatments | BOOK NOW | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| In-Clinic Services | first_visit | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| In-Clinic Services | cta_banner | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| In-Clinic Services | testimonials | Read Sabrina Sarmiento's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| In-Clinic Services | testimonials | Read Adam Francis's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| In-Clinic Services | testimonials | Read Emily Chapel's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| In-Clinic Services | testimonials | Read linda danh's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| In-Clinic Services | acupuncture | BOOK NOW | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| In-Clinic Services | concierge | BOOK CONCIERGE | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| In-Clinic Services | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | OK |
| In-Clinic Services | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | OK |
| In-Clinic Services | posts | READ ARTICLE → : THE HEALING HARMONY OF HYPNO | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK |
| In-Clinic Services | posts | EXPLORE ALL BLOGS | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
| Concierge | - | Skip to content | `#MainContent` | `#MainContent` | OK |
| Concierge | approach | BOOK NOW | `#` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | Fixed (was dead) · new tab, noopener noreferrer |
| Concierge | inquiry | info@feliceacupuncture.com | `mailto:info@feliceacupuncture.com` | `mailto:info@feliceacupuncture.com` | OK |
| Concierge | inquiry | Call or text to book · +1 (424) 478-0019 | `tel:+14244780019` | `tel:+14244780019` | OK |
| Concierge | expect | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Concierge | cta_banner | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Concierge | testimonials | Read Sabrina Sarmiento's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Concierge | testimonials | Read Adam Francis's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Concierge | testimonials | Read Emily Chapel's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Concierge | testimonials | Read linda danh's review on Google | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | `https://maps.app.goo.gl/RF9weZgD2BE3JN898` | OK · new tab, noopener noreferrer |
| Concierge | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | OK |
| Concierge | posts | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | OK |
| Concierge | posts | READ ARTICLE → : THE HEALING HARMONY OF HYPNO | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK |
| Concierge | posts | EXPLORE ALL BLOGS | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
| Blog listing | - | Skip to content | `#MainContent` | `#MainContent` | OK |
| Blog listing | hero | BOOK IN-CLINIC | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Blog listing | hero | BOOK CONCIERGE | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| Blog listing | articles | (fa-blog-listing__media) | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | OK |
| Blog listing | articles | PROTECTING YOUR LUNGS AND HEALTH DURING THE L | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | OK |
| Blog listing | articles | Read the post: Protecting Your Lungs and Heal | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | OK |
| Blog listing | articles | (fa-blog-listing__media) | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | OK |
| Blog listing | articles | PROTECTING YOUR LUNGS AND HEALTH DURING THE L | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | OK |
| Blog listing | articles | Read the post: Protecting Your Lungs and Heal | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | OK |
| Blog listing | articles | (fa-blog-listing__media) | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK |
| Blog listing | articles | THE HEALING HARMONY OF HYPNO-SOUND THERAPY &  | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK |
| Blog listing | articles | Read the post: The Healing Harmony of Hypno-S | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK |
| Blog listing | articles | (fa-blog-listing__media) | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time-1` | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time-1` | OK |
| Blog listing | articles | THE CHINESE ORGAN CLOCK: WHY YOUR BODY KEEPS  | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time-1` | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time-1` | OK |
| Blog listing | articles | Read the post: The Chinese Organ Clock: Why Y | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time-1` | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time-1` | OK |
| Blog listing | articles | (fa-blog-listing__media) | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time` | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time` | OK |
| Blog listing | articles | THE CHINESE ORGAN CLOCK: WHY YOUR BODY KEEPS  | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time` | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time` | OK |
| Blog listing | articles | Read the post: The Chinese Organ Clock: Why Y | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time` | `/blogs/news/the-chinese-organ-clock-why-your-body-keeps-waking-you-at-the-same-time` | OK |
| Blog listing | articles | (fa-blog-listing__media) | `/blogs/news/why-you-crash-every-afternoon-from-a-chinese-medicine-perspective` | `/blogs/news/why-you-crash-every-afternoon-from-a-chinese-medicine-perspective` | OK |
| Blog listing | articles | WHY YOU CRASH EVERY AFTERNOON (FROM A CHINESE | `/blogs/news/why-you-crash-every-afternoon-from-a-chinese-medicine-perspective` | `/blogs/news/why-you-crash-every-afternoon-from-a-chinese-medicine-perspective` | OK |
| Blog listing | articles | Read the post: Why you crash every afternoon  | `/blogs/news/why-you-crash-every-afternoon-from-a-chinese-medicine-perspective` | `/blogs/news/why-you-crash-every-afternoon-from-a-chinese-medicine-perspective` | OK |
| Blog listing | articles | (fa-blog-listing__media) | `/blogs/news/addressing-acne-holistically-a-traditional-chinese-medicine-tcm-perspective` | `/blogs/news/addressing-acne-holistically-a-traditional-chinese-medicine-tcm-perspective` | OK |
| Blog listing | articles | ADDRESSING ACNE HOLISTICALLY: A TRADITIONAL C | `/blogs/news/addressing-acne-holistically-a-traditional-chinese-medicine-tcm-perspective` | `/blogs/news/addressing-acne-holistically-a-traditional-chinese-medicine-tcm-perspective` | OK |
| Blog listing | articles | Read the post: Addressing Acne Holistically:  | `/blogs/news/addressing-acne-holistically-a-traditional-chinese-medicine-tcm-perspective` | `/blogs/news/addressing-acne-holistically-a-traditional-chinese-medicine-tcm-perspective` | OK |
| Blog listing | ready | BOOK IN-CLINIC | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Blog listing | ready | BOOK CONCIERGE | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| Blog listing | cta_banner | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Blog article | - | Skip to content | `#MainContent` | `#MainContent` | OK |
| Blog article | main | Facebook | `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Finternal-dev-store-3.myshopify.com%2Fblogs%2Fnews%2Fthe-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Finternal-dev-store-3.myshopify.com%2Fblogs%2Fnews%2Fthe-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK · new tab, noopener noreferrer |
| Blog article | main | X - Twitter | `https://twitter.com/intent/tweet?url=https%3A%2F%2Finternal-dev-store-3.myshopify.com%2Fblogs%2Fnews%2Fthe-healing-harmony-of-hypno-sound-therapy-ear-acupuncture&text=The+Healing+Harmony+of+Hypno-Sound+Therapy+%26+Ear+Acupuncture` | `https://twitter.com/intent/tweet?url=https%3A%2F%2Finternal-dev-store-3.myshopify.com%2Fblogs%2Fnews%2Fthe-healing-harmony-of-hypno-sound-therapy-ear-acupuncture&text=The+Healing+Harmony+of+Hypno-Sound+Therapy+%26+Ear+Acupuncture` | OK · new tab, noopener noreferrer |
| Blog article | main | LinkedIn | `https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Finternal-dev-store-3.myshopify.com%2Fblogs%2Fnews%2Fthe-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Finternal-dev-store-3.myshopify.com%2Fblogs%2Fnews%2Fthe-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK · new tab, noopener noreferrer |
| Blog article | main | BOOK YOUR FIRST VISIT | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Blog article | main | or call or text (424) 478-0019 | `tel:+14244780019` | `tel:+14244780019` | OK |
| Blog article | ready | BOOK IN-CLINIC | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | `https://feliceacupuncture.janeapp.com/#/discipline/1/treatment/1` | OK · new tab, noopener noreferrer |
| Blog article | ready | BOOK CONCIERGE | `#` | `/pages/concierge?view=concierge` | Fixed (was dead) · target not built yet |
| Blog article | team | MEET THE TEAM | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Blog article | team | DR. FELICE CHAN | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Blog article | team | Instagram | `https://www.instagram.com/feliceacupuncture/` | `https://www.instagram.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| Blog article | team | Facebook | `https://www.facebook.com/feliceacupuncture/` | `https://www.facebook.com/feliceacupuncture/` | OK · new tab, noopener noreferrer |
| Blog article | team | Dr. Felice Chan on Substack | `https://drfelicechan.substack.com/` | `https://drfelicechan.substack.com/` | OK · new tab, noopener noreferrer |
| Blog article | team | JOIN THE WAITLIST | `mailto:info@feliceacupuncture.com?subject=Waitlist%20for%20Dr.%20Felice` | `mailto:info@feliceacupuncture.com?subject=Waitlist%20for%20Dr.%20Felice` | OK |
| Blog article | team | DR. SAM AUDETTE | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Blog article | team | BOOK WITH DR. SAM | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | `https://feliceacupuncture.janeapp.com/#/staff_member/2` | OK · new tab, noopener noreferrer |
| Blog article | team | CAROLINE KIRK | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Blog article | team | Caroline Kirk on Substack | `https://substack.com/@carolinekirklac` | `https://substack.com/@carolinekirklac` | OK · new tab, noopener noreferrer |
| Blog article | team | BOOK WITH CAROLINE | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | `https://feliceacupuncture.janeapp.com/#/staff_member/4` | OK · new tab, noopener noreferrer |
| Blog article | team | DR. SARAH VIDUCIC | `/pages/our-team?view=team` | `/pages/our-team?view=team` | OK |
| Blog article | team | Dr. Sarah Viducic on Substack | `https://drsarahviducic.substack.com/` | `https://drsarahviducic.substack.com/` | OK · new tab, noopener noreferrer |
| Blog article | team | BOOK WITH DR. SARAH | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | `https://feliceacupuncture.janeapp.com/#/staff_member/3` | OK · new tab, noopener noreferrer |
| Blog article | related | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires-1` | OK |
| Blog article | related | READ ARTICLE → : PROTECTING YOUR LUNGS AND HE | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | `/blogs/news/protecting-your-lungs-and-health-during-the-la-fires` | OK |
| Blog article | related | READ ARTICLE → : THE HEALING HARMONY OF HYPNO | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | `/blogs/news/the-healing-harmony-of-hypno-sound-therapy-ear-acupuncture` | OK |
| Blog article | related | EXPLORE ALL BLOGS | `/blogs/news` | `/pages/blog?view=blogs` | Fixed (retargeted) |
