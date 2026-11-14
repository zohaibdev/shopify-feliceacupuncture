/*
  Felice link gallery row.
  <fa-link-gallery> wraps a native scroll-snap track ([data-track], focusable, so arrow keys scroll it). It:
  - starts centred (data-start="center", Figma: the middle card in the middle of the screen, outer cards cut by the
    edges) and keeps re-centring on resize until the visitor moves the row themselves;
  - sets [data-overflow] while the cards don't all fit (CSS shows a grab cursor) and keeps the track in the tab order
    only then (the markup's tabindex="0" stays for no-JS);
  - centres a card that receives keyboard focus while it is cut by the screen edge;
  - lets a mouse drag the row ([data-dragging] pauses snapping); a drag never follows the link under the pointer;
  - brings the selected card into view in the Theme Editor (shopify:block:select).
  Touch, trackpad and Shift+wheel scrolling are the browser's own. Safe to load twice; re-initialises after
  Theme Editor section re-renders (connectedCallback).
*/
(() => {
  if (customElements.get('fa-link-gallery')) return;

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DRAG_THRESHOLD = 5;

  class FaLinkGallery extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-track]');
      if (!this.track) return;

      this.moved = false; // the visitor has scrolled / focused the row: stop auto-centring
      this.frame = 0;
      this.onResize = () => {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => this.layout());
      };
      this.onUser = () => { this.moved = true; };
      this.onSelect = (event) => {
        const item = event.target.closest && event.target.closest('li');
        if (!item || !this.track.contains(item)) return;
        this.moved = true;
        this.centre(item, 'auto');
      };
      // Keyboard focus only (:focus-visible): a mouse press on a card must not start a scroll under a drag.
      this.onFocus = (event) => {
        const item = event.target.closest('li');
        if (!item || !event.target.matches(':focus-visible')) return;
        const box = item.getBoundingClientRect();
        const view = this.track.getBoundingClientRect();
        if (box.left < view.left || box.right > view.right) this.centre(item);
      };
      this.onPointerDown = (event) => this.dragStart(event);
      this.onPointerMove = (event) => this.dragMove(event);
      this.onPointerUp = () => this.dragEnd();
      this.onClick = (event) => {
        if (!this.suppressClick) return;
        event.preventDefault();
        event.stopPropagation();
        this.suppressClick = false;
      };

      ['wheel', 'touchstart', 'keydown', 'focusin'].forEach((type) => this.track.addEventListener(type, this.onUser, { passive: true }));
      this.track.addEventListener('focusin', this.onFocus);
      this.track.addEventListener('pointerdown', this.onPointerDown);
      this.track.addEventListener('click', this.onClick, true);
      this.addEventListener('shopify:block:select', this.onSelect);

      if ('ResizeObserver' in window) {
        this.observer = new ResizeObserver(this.onResize);
        this.observer.observe(this.track);
      } else {
        window.addEventListener('resize', this.onResize);
      }
      this.layout();
    }

    disconnectedCallback() {
      if (!this.track) return;
      cancelAnimationFrame(this.frame);
      ['wheel', 'touchstart', 'keydown', 'focusin'].forEach((type) => this.track.removeEventListener(type, this.onUser));
      this.track.removeEventListener('focusin', this.onFocus);
      this.track.removeEventListener('pointerdown', this.onPointerDown);
      this.track.removeEventListener('click', this.onClick, true);
      this.removeEventListener('shopify:block:select', this.onSelect);
      this.observer?.disconnect();
      window.removeEventListener('resize', this.onResize);
      this.dragEnd();
    }

    rtl() {
      return getComputedStyle(this.track).direction === 'rtl' ? -1 : 1;
    }

    max() {
      return this.track.scrollWidth - this.track.clientWidth;
    }

    layout() {
      const max = this.max();
      this.toggleAttribute('data-overflow', max > 1);
      // Nothing to scroll: no empty tab stop (linked cards stay focusable on their own).
      if (max > 1) this.track.setAttribute('tabindex', '0');
      else this.track.removeAttribute('tabindex');
      if (!this.moved && this.dataset.start !== 'start' && max > 1) {
        this.track.scrollTo({ left: (this.rtl() * max) / 2, behavior: 'auto' });
      }
    }

    centre(item, behavior) {
      const box = item.getBoundingClientRect();
      const view = this.track.getBoundingClientRect();
      this.track.scrollBy({
        left: box.left + box.width / 2 - (view.left + view.width / 2),
        behavior: behavior || (reduceMotion() ? 'auto' : 'smooth'),
      });
    }

    // Mouse drag only: touch and pen keep native panning.
    dragStart(event) {
      if (event.pointerType !== 'mouse' || event.button !== 0 || this.max() <= 1) return;
      this.drag = { x: event.clientX, left: this.track.scrollLeft, active: false };
      window.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('pointerup', this.onPointerUp);
      window.addEventListener('pointercancel', this.onPointerUp);
    }

    dragMove(event) {
      if (!this.drag) return;
      const dx = event.clientX - this.drag.x;
      if (!this.drag.active) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        this.drag.active = true;
        this.moved = true;
        this.setAttribute('data-dragging', '');
      }
      this.track.scrollLeft = this.drag.left - dx;
    }

    dragEnd() {
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerup', this.onPointerUp);
      window.removeEventListener('pointercancel', this.onPointerUp);
      if (!this.drag) return;
      if (this.drag.active) {
        // The click that ends a drag must not open the card under the pointer.
        this.suppressClick = true;
        setTimeout(() => { this.suppressClick = false; }, 0);
        this.removeAttribute('data-dragging');
      }
      this.drag = null;
    }
  }

  customElements.define('fa-link-gallery', FaLinkGallery);
})();
