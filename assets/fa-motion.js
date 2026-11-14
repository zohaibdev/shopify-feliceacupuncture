/*
  Felice motion — one-shot scroll reveals for fa-* sections (styles: "Motion" block in fa-base.css).

  Markup API
  - data-fa-reveal="up" | "fade"   The element rises ~20px and fades in (up, the default) or only fades in.
  - data-fa-reveal-stagger         Put on a grid / list together with data-fa-reveal: its children reveal instead,
                                   cascading 80ms apart (capped at 4 steps). Children entering together cascade
                                   together, so a second grid row cascades when it scrolls in. A horizontally
                                   scrolling row (mobile swipe rows) reveals as one group: the row rises, its
                                   cards fade in one after another.

  Rules
  - Progressive enhancement: nothing is hidden by CSS alone. snippets/fa-head.liquid sets html.fa-motion before
    first paint (not with prefers-reduced-motion: reduce, not in the Theme Editor); this script then hides only
    elements that are still entirely below the viewport, so no-JS visitors, crawlers and above-the-fold content
    never see a hidden state. Without IntersectionObserver nothing is hidden.
  - Resting state = Figma: once an element has revealed, every helper class and custom property is removed.
  - One-shot: each element is unobserved after it reveals. No scroll listeners.
  - Theme Editor: shopify:section:load / shopify:block:select reveal immediately (design mode never hides anyway).
  Safe to load more than once.
*/
(() => {
  if (window.faMotion) return;

  const root = document.documentElement;
  const HIDE = 'fa-reveal-hide';
  const FADE = 'fa-reveal--fade';
  const RUN = 'fa-reveal-run';
  const STEP = 80; // ms between cascading children
  const MAX_STEPS = 4;
  const DURATION = 650; // keep in sync with --fa-dur-reveal

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const designMode = Boolean(window.Shopify && window.Shopify.designMode);
  const enabled = root.classList.contains('fa-motion') && !reduce.matches && !designMode && 'IntersectionObserver' in window;

  // Remove every trace of the reveal state from an element (used after the transition and for instant reveals).
  const clean = (el) => {
    el.classList.remove(HIDE, FADE, RUN);
    el.style.removeProperty('--fa-reveal-delay');
  };

  const pending = new Set();
  let observer = null;

  const show = (el, delay) => {
    if (!pending.delete(el)) return;
    if (observer) observer.unobserve(el);
    el.style.setProperty('--fa-reveal-delay', `${delay}ms`);
    el.classList.add(RUN);
    el.classList.remove(HIDE);
    window.setTimeout(() => clean(el), DURATION + delay + 100);
  };

  const showNow = (el) => {
    pending.delete(el);
    if (observer) observer.unobserve(el);
    clean(el);
  };

  const revealWithin = (scope) => {
    pending.forEach((el) => {
      if (scope === document || scope.contains(el) || el.contains(scope)) showNow(el);
    });
  };

  window.faMotion = { revealAll: () => revealWithin(document) };

  document.addEventListener('shopify:section:load', (event) => revealWithin(event.target));
  document.addEventListener('shopify:block:select', (event) => {
    const section = event.target.closest && event.target.closest('.shopify-section');
    revealWithin(section || event.target);
  });
  window.addEventListener('beforeprint', () => revealWithin(document));
  if (reduce.addEventListener) reduce.addEventListener('change', () => revealWithin(document));

  if (!enabled) return;

  // Group members (children of a stagger container, or a swipe row's cards) keyed by the observed element.
  const groups = new Map();

  observer = new IntersectionObserver((entries) => {
    const batch = new Map(); // parent -> entering children, for cascades
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (groups.has(el)) {
        show(el, 0);
        groups.get(el).forEach((child, i) => show(child, Math.min(i, MAX_STEPS) * STEP));
        groups.delete(el);
      } else if (el.parentElement && el.parentElement.hasAttribute('data-fa-reveal-stagger')) {
        const list = batch.get(el.parentElement) || [];
        list.push(el);
        batch.set(el.parentElement, list);
      } else {
        show(el, 0);
      }
    });
    batch.forEach((list) => {
      list
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        .forEach((el, i) => show(el, Math.min(i, MAX_STEPS) * STEP));
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });

  const viewport = window.innerHeight || root.clientHeight;
  const below = (el) => el.getBoundingClientRect().top >= viewport;
  const moves = (el) => getComputedStyle(el).transform === 'none';

  // Hide an element until it scrolls in. Elements with a resting transform only fade (never overwrite it).
  const hide = (el, fadeOnly) => {
    el.classList.add(HIDE);
    if (fadeOnly || !moves(el)) el.classList.add(FADE);
    pending.add(el);
  };

  document.querySelectorAll('[data-fa-reveal]').forEach((el) => {
    if (el.closest('[data-fa-reveal] [data-fa-reveal]')) return; // nested: the outer element owns the motion
    const fade = el.getAttribute('data-fa-reveal') === 'fade';
    if (!el.hasAttribute('data-fa-reveal-stagger')) {
      if (below(el)) {
        hide(el, fade);
        observer.observe(el);
      }
      return;
    }
    const children = [...el.children];
    if (el.scrollWidth > el.clientWidth + 1) {
      // Horizontal scroll row: off-screen cards never intersect, so the row reveals as one group.
      if (!below(el)) return;
      hide(el, fade);
      children.forEach((child) => hide(child, true));
      groups.set(el, children);
      observer.observe(el);
      return;
    }
    children.forEach((child) => {
      if (!below(child)) return;
      hide(child, fade);
      observer.observe(child);
    });
  });
})();

/*
  Swipe rows (≤899px, .fa-swipe): a card reached with the keyboard that is only partly inside its row scrolls fully
  into view. Browsers only scroll a focus target that is completely hidden, so a card whose edge peeks in kept its
  focus ring off-screen. Keyboard focus only (:focus-visible), instant with reduced motion. Safe to load twice.
*/
(() => {
  if (window.faSwipeFocus) return;
  window.faSwipeFocus = true;
  const mobile = window.matchMedia('(max-width: 899px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('focusin', (event) => {
    const target = event.target;
    if (!mobile.matches || !target.closest || !target.matches(':focus-visible')) return;
    const row = target.closest('.fa-swipe');
    if (!row) return;
    const item = [...row.children].find((child) => child.contains(target));
    if (!item) return;
    const r = item.getBoundingClientRect();
    const box = row.getBoundingClientRect();
    if (r.left >= box.left - 0.5 && r.right <= box.right + 0.5) return;
    item.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' });
  });
})();
