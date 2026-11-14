/*
  Felice FAQ. Items are native <details>: each question opens and closes on its own, and several can be open.
  This file only:
  - keeps aria-expanded on each <summary> in sync with its item (native `toggle` event);
  - Theme Editor: shopify:section:load re-applies the mobile defaults to the re-rendered section (the desktop
    defaults come from Liquid), shopify:block:select opens the selected question without closing others.
  The initial mobile defaults are applied by the inline script in sections/fa-faq.liquid (before first paint).
  Safe to load more than once.
*/
(() => {
  if (window.faFaqReady) return;
  window.faFaqReady = true;

  const ITEM = 'details.fa-faq__item';
  const MOBILE = window.matchMedia('(max-width: 899px)');

  const sync = (item) => {
    item.firstElementChild.setAttribute('aria-expanded', item.open ? 'true' : 'false');
  };

  // `toggle` does not bubble, so listen in the capture phase.
  document.addEventListener('toggle', (event) => {
    if (event.target.matches && event.target.matches(ITEM)) sync(event.target);
  }, true);

  document.addEventListener('shopify:section:load', (event) => {
    event.target.querySelectorAll(ITEM).forEach((item) => {
      if (MOBILE.matches) item.open = item.hasAttribute('data-open-mobile');
      sync(item);
    });
  });

  document.addEventListener('shopify:block:select', (event) => {
    const item = event.target.closest && event.target.closest(ITEM);
    if (item) item.open = true;
  });

  // Items toggled before this deferred script ran.
  document.querySelectorAll(ITEM).forEach(sync);
})();
