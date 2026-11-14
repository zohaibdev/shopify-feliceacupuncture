/*
  Felice testimonials carousel.
  <fa-testimonials-carousel> wraps a native scroll-snap track ([data-track]) and two buttons
  ([data-prev] / [data-next]). Buttons scroll by one card and are disabled at either end (focus moves
  to the other arrow first, so keyboard users don't lose it); when nothing overflows the element gets [data-static] and the buttons are hidden by CSS.
  Safe to load twice and re-initialises itself after Theme Editor section re-renders.

  Live Google reviews: with [data-reviews-widget] (theme setting "Featurable widget ID") the cards are refilled from
  the free Featurable API once the section nears the viewport. The first Liquid card is cloned as the template, so
  the Figma markup stays in the section; the static cards remain on screen until the data arrives (no layout jump)
  and stay as the fallback on any error. Responses are cached per tab for an hour (sessionStorage).
*/
(() => {
  if (customElements.get('fa-testimonials-carousel')) return;

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const REVIEWS_API = 'https://api.featurable.com/v1/widgets/';
  const CACHE_MS = 60 * 60 * 1000;
  const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const readCache = (key) => {
    try {
      const hit = JSON.parse(sessionStorage.getItem(key));
      return hit && Date.now() - hit.t < CACHE_MS ? hit.data : null;
    } catch (e) {
      return null;
    }
  };

  const writeCache = (key, data) => {
    try {
      sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), data }));
    } catch (e) {
      /* private mode / quota: just skip the cache */
    }
  };

  const fetchReviews = async (id) => {
    const key = `fa-reviews:${id}`;
    const cached = readCache(key);
    if (cached) return cached;
    const res = await fetch(REVIEWS_API + encodeURIComponent(id), { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Reviews API ${res.status}`);
    const data = await res.json();
    if (!data || !data.success || !Array.isArray(data.reviews)) throw new Error('Reviews API: no reviews');
    writeCache(key, data);
    return data;
  };

  // Fill a clone of the first Liquid card (li.fa-testimonials__item) with one Featurable review.
  const buildCard = (template, review) => {
    const item = template.cloneNode(true);
    item.removeAttribute('data-shopify-editor-block');
    const name = (review.reviewer && review.reviewer.displayName) || 'Google user';
    const photo = review.reviewer && !review.reviewer.isAnonymous && review.reviewer.profilePhotoUrl;

    const avatar = item.querySelector('.fa-testimonials__avatar');
    if (avatar) {
      if (photo) {
        const img = Object.assign(document.createElement('img'), { src: photo, alt: '', width: 96, height: 96, loading: 'lazy' });
        img.referrerPolicy = 'no-referrer';
        avatar.replaceChildren(img);
      } else {
        const initial = Object.assign(document.createElement('span'), { className: 'fa-testimonials__initial', textContent: name.trim().charAt(0).toUpperCase() });
        initial.setAttribute('aria-hidden', 'true');
        avatar.replaceChildren(initial);
      }
    }

    const meta = item.querySelector('.fa-testimonials__meta');
    const nameEl = item.querySelector('.fa-testimonials__name');
    if (nameEl) nameEl.textContent = name;
    let dateEl = item.querySelector('.fa-testimonials__date');
    const time = review.createTime && new Date(review.createTime);
    if (time && !isNaN(time)) {
      if (!dateEl && meta) dateEl = meta.appendChild(Object.assign(document.createElement('p'), { className: 'fa-testimonials__date' }));
      if (dateEl) dateEl.textContent = dateFormat.format(time);
    } else {
      dateEl?.remove();
    }

    item.querySelector('a.fa-testimonials__source')?.setAttribute('aria-label', `Read ${name}'s review on Google`);

    const stars = Math.max(0, Math.min(5, Math.round(review.starRating || 0)));
    const rating = item.querySelector('.fa-testimonials__rating');
    if (rating) {
      rating.setAttribute('aria-label', `${stars} out of 5 stars`);
      rating.querySelectorAll('.fa-testimonials__star').forEach((star, i) => {
        star.classList.toggle('fa-testimonials__star--empty', i >= stars);
      });
    }

    const text = item.querySelector('.fa-testimonials__text p');
    if (text) {
      text.replaceChildren();
      review.comment.trim().split(/\r?\n/).forEach((line, i) => {
        if (i) text.append(document.createElement('br'));
        text.append(line);
      });
    }
    return item;
  };

  class FaTestimonialsCarousel extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-track]');
      this.prev = this.querySelector('[data-prev]');
      this.next = this.querySelector('[data-next]');
      if (!this.track) return;

      this.frame = 0;
      this.onScroll = () => {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => this.update());
      };
      this.onPrev = () => this.go(-1);
      this.onNext = () => this.go(1);
      // Theme Editor: bring the selected review block into view.
      this.onSelect = (event) => {
        const item = event.target.closest && event.target.closest('li');
        if (!item || !this.track.contains(item)) return;
        this.track.scrollTo({ left: item.offsetLeft - this.track.firstElementChild.offsetLeft, behavior: 'auto' });
      };
      this.addEventListener('shopify:block:select', this.onSelect);

      this.track.addEventListener('scroll', this.onScroll, { passive: true });
      this.prev?.addEventListener('click', this.onPrev);
      this.next?.addEventListener('click', this.onNext);

      if ('ResizeObserver' in window) {
        this.observer = new ResizeObserver(this.onScroll);
        this.observer.observe(this.track);
      } else {
        window.addEventListener('resize', this.onScroll);
      }
      this.update();
      this.watchLiveReviews();
    }

    // Load the live reviews only when the section is about to scroll into view.
    watchLiveReviews() {
      const id = this.dataset.reviewsWidget;
      if (!id || this.dataset.reviews === 'live') return;
      const start = () => this.loadLiveReviews(id);
      if (!('IntersectionObserver' in window)) return start();
      this.liveObserver = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        this.liveObserver.disconnect();
        start();
      }, { rootMargin: '600px 0px' });
      this.liveObserver.observe(this);
    }

    async loadLiveReviews(id) {
      const list = this.track.querySelector('ul');
      const template = list && list.querySelector('li');
      if (!template) return;
      try {
        const data = await fetchReviews(id);
        const reviews = data.reviews.filter((review) => review && typeof review.comment === 'string' && review.comment.trim());
        if (!reviews.length || !this.isConnected) return;
        list.replaceChildren(...reviews.map((review) => buildCard(template, review)));
        this.dataset.reviews = 'live';
        this.track.scrollLeft = 0;
        this.update();
      } catch (error) {
        console.warn('[fa-testimonials] Live Google reviews unavailable, keeping the static reviews.', error);
      }
    }

    disconnectedCallback() {
      if (!this.track) return;
      cancelAnimationFrame(this.frame);
      this.track.removeEventListener('scroll', this.onScroll);
      this.prev?.removeEventListener('click', this.onPrev);
      this.next?.removeEventListener('click', this.onNext);
      this.removeEventListener('shopify:block:select', this.onSelect);
      this.observer?.disconnect();
      this.liveObserver?.disconnect();
      window.removeEventListener('resize', this.onScroll);
    }

    step() {
      const item = this.track.querySelector('li');
      if (!item) return this.track.clientWidth;
      const list = item.parentElement;
      const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
      return item.getBoundingClientRect().width + gap;
    }

    go(direction) {
      const rtl = getComputedStyle(this.track).direction === 'rtl' ? -1 : 1;
      this.track.scrollBy({
        left: direction * rtl * this.step(),
        behavior: reduceMotion() ? 'auto' : 'smooth',
      });
    }

    update() {
      const max = this.track.scrollWidth - this.track.clientWidth;
      const pos = Math.abs(this.track.scrollLeft);
      const prevOff = pos <= 2;
      const nextOff = pos >= max - 2;
      // A focused button that gets disabled drops keyboard focus to <body>: enable the arrows that stay usable
      // first, hand focus to the other arrow (or the track when both are off), then disable.
      this.toggleAttribute('data-static', max <= 2);
      if (this.prev && !prevOff) this.prev.disabled = false;
      if (this.next && !nextOff) this.next.disabled = false;
      const active = document.activeElement;
      if ((active === this.next && nextOff) || (active === this.prev && prevOff)) {
        const other = active === this.next ? this.prev : this.next;
        const otherOff = active === this.next ? prevOff : nextOff;
        (other && !otherOff ? other : this.track).focus({ preventScroll: true });
      }
      if (this.prev) this.prev.disabled = prevOff;
      if (this.next) this.next.disabled = nextOff;
    }
  }

  customElements.define('fa-testimonials-carousel', FaTestimonialsCarousel);
})();
