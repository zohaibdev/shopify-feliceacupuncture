/*
  Felice photo gallery (sections/fa-photo-gallery.liquid).
  <fa-photo-gallery data-layout="carousel|strip">:
  - carousel: one active photo, centred and largest. Prev / next buttons, a horizontal swipe or mouse drag on the
    row, or a click on a side photo change it; the script only updates --fa-pg-active and each photo's
    data-distance (0 / 1 / 2+), CSS does the layout and the slide. The arrows disable at the ends (a focused arrow
    hands focus to the other one first); a polite live region announces "n of N". Liquid renders the start state,
    so no-JS / Theme Editor show the Figma row.
  - strip: a native scroll-snap row ([data-viewport], focusable, so arrow keys scroll it) that starts centred and
    keeps re-centring on resize until the visitor moves it; mouse drag; optional arrows scroll one photo.
  Both: shopify:block:select brings the selected photo to the middle. Safe to load twice; re-initialises after
  Theme Editor section re-renders (connectedCallback).

  Desktop motion (900px and wider only — below that everything above stays exactly as it is):
  - [data-loop] carousel: aria-hidden, unfocusable copies of the photos on both sides; after each slide the row jumps back
    to the matching original without a transition ([data-instant]), so it never reaches an end. Arrows never disable.
  - [data-loop] strip ("ticker"): the native scroll row becomes a transformed track ([data-ticker]) with copies,
    wrapped by one set width. Mouse drag, horizontal wheel / trackpad, the arrow keys on the focused row and the
    optional arrows still move it.
  - [data-autoplay]: carousel = next photo every data-interval ms, paused while hovered (mouse), while a control has
    keyboard focus, off screen, in a background tab and while a block is selected in the Theme Editor. Strip =
    continuous drift at data-speed px/s, paused for keyboard focus, drags, off screen, hidden tab, Theme Editor
    selection. No autoplay with prefers-reduced-motion.
  - [data-lightbox] strip: each photo is a button that opens <dialog data-lightbox-dialog> with the whole photo
    (contain, never cropped or upscaled); the close button, Escape or a click outside the photo closes it and focus
    returns to the photo. Autoplay keeps running.
*/
(() => {
  if (customElements.get('fa-photo-gallery')) return;

  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => reduceQuery.matches;
  const DESKTOP = '(min-width: 900px)';
  const SWIPE = 40; // px of horizontal movement that counts as a swipe (carousel)
  const DRAG = 5; // px before a mouse press becomes a drag (strip)
  const GLIDE = 520; // ms for a keyboard / arrow / focus move of the ticker
  const mod = (n, m) => ((n % m) + m) % m;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  class FaPhotoGallery extends HTMLElement {
    connectedCallback() {
      this.viewport = this.querySelector('[data-viewport]');
      this.list = this.viewport ? this.viewport.querySelector('ul') : null;
      // Markup re-parsed from a live page (not fresh from the server) still carries the desktop motion state.
      if (this.list) {
        this.list.querySelectorAll(':scope > [data-copy]').forEach((copy) => copy.remove());
        this.list.style.removeProperty('transform');
        this.list.querySelectorAll(':scope > li').forEach((item) => {
          ['role', 'tabindex', 'aria-haspopup'].forEach((name) => item.removeAttribute(name));
        });
      }
      ['data-ticker', 'data-instant', 'data-dragging', 'data-lightbox-ready'].forEach((name) => this.removeAttribute(name));
      this.items = this.viewport ? Array.from(this.viewport.querySelectorAll('li')) : [];
      this.originals = this.items.slice();
      this.prev = this.querySelector('[data-prev]');
      this.next = this.querySelector('[data-next]');
      this.status = this.querySelector('[data-status]');
      this.carousel = this.dataset.layout === 'carousel';
      if (!this.viewport || !this.items.length) return;

      // Block videos (V6): muted autoplay loop (not with reduced motion); the buttons' state follows the video.
      this.onVideoState = (event) => this.videoState(event.target);
      this.addEventListener('play', this.onVideoState, true);
      this.addEventListener('pause', this.onVideoState, true);
      this.querySelectorAll('video[data-fa-video]').forEach((video) => {
        video.muted = true;
        if (!reduceMotion()) video.play().catch(() => {});
      });

      this.onPrev = () => { this.step(-1); this.restartAuto(); };
      this.onNext = () => { this.step(1); this.restartAuto(); };
      this.onSelect = (event) => {
        const item = event.target.closest && event.target.closest('li');
        if (!item || !this.viewport.contains(item)) return;
        this.moved = true;
        this.hold('editor', true);
        if (this.carousel) this.go(this.looping ? this.base + this.originals.indexOf(item) : this.items.indexOf(item));
        else this.centre(item, 'auto');
      };
      this.onDeselect = () => this.hold('editor', false);
      this.onPointerDown = (event) => this.dragStart(event);
      this.onPointerMove = (event) => this.dragMove(event);
      this.onPointerUp = (event) => this.dragEnd(event);
      this.onClick = (event) => this.click(event);
      this.prev?.addEventListener('click', this.onPrev);
      this.next?.addEventListener('click', this.onNext);
      this.viewport.addEventListener('pointerdown', this.onPointerDown);
      this.viewport.addEventListener('click', this.onClick, true);
      this.addEventListener('shopify:block:select', this.onSelect);
      this.addEventListener('shopify:block:deselect', this.onDeselect);

      // Desktop motion state (see the header comment).
      this.holds = new Set();
      this.desktop = window.matchMedia(DESKTOP);
      this.onMedia = () => this.mode();
      this.onMotionPref = () => this.restartAuto();
      this.desktop.addEventListener('change', this.onMedia);
      reduceQuery.addEventListener('change', this.onMotionPref);

      if (this.carousel) {
        this.active = Math.min(Math.max(parseInt(this.dataset.active, 10) || 0, 0), this.items.length - 1);
        this.go(this.active, true);
        // Carousel autoplay runs at every width (phones too). These pauses work at every width; desktop adds
        // hover and keyboard focus on top (enableDesktop).
        this.autoOn = this.hasAttribute('data-autoplay');
        this.interval = Math.max(parseFloat(this.dataset.interval) || 4000, 1000);
        this.onPageVisibility = () => this.hold('hidden', document.hidden);
        document.addEventListener('visibilitychange', this.onPageVisibility);
        if ('IntersectionObserver' in window) {
          this.onScreen = new IntersectionObserver((entries) => {
            entries.forEach((entry) => this.hold('offscreen', !entry.isIntersecting));
          });
          this.onScreen.observe(this.viewport);
        }
        this.onPageVisibility();
        this.mode();
        return;
      }

      this.moved = false;
      this.frame = 0;
      this.onResize = () => {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => this.layout());
      };
      this.onScroll = () => {
        cancelAnimationFrame(this.scrollFrame);
        this.scrollFrame = requestAnimationFrame(() => this.updateArrows());
      };
      this.onUser = () => { this.moved = true; };
      ['wheel', 'touchstart', 'keydown'].forEach((type) => this.viewport.addEventListener(type, this.onUser, { passive: true }));
      this.viewport.addEventListener('scroll', this.onScroll, { passive: true });
      if ('ResizeObserver' in window) {
        this.observer = new ResizeObserver(this.onResize);
        this.observer.observe(this.viewport);
      } else {
        window.addEventListener('resize', this.onResize);
      }
      this.layout();
      this.mode();
    }

    disconnectedCallback() {
      if (!this.viewport) return;
      this.prev?.removeEventListener('click', this.onPrev);
      this.next?.removeEventListener('click', this.onNext);
      this.viewport.removeEventListener('pointerdown', this.onPointerDown);
      this.viewport.removeEventListener('click', this.onClick, true);
      this.removeEventListener('shopify:block:select', this.onSelect);
      this.removeEventListener('shopify:block:deselect', this.onDeselect);
      this.removeEventListener('play', this.onVideoState, true);
      this.removeEventListener('pause', this.onVideoState, true);
      if (this.onUser) ['wheel', 'touchstart', 'keydown'].forEach((type) => this.viewport.removeEventListener(type, this.onUser));
      if (this.onScroll) this.viewport.removeEventListener('scroll', this.onScroll);
      this.observer?.disconnect();
      window.removeEventListener('resize', this.onResize);
      cancelAnimationFrame(this.frame);
      cancelAnimationFrame(this.scrollFrame);
      this.stopListening();
      this.desktop.removeEventListener('change', this.onMedia);
      reduceQuery.removeEventListener('change', this.onMotionPref);
      if (this.onPageVisibility) document.removeEventListener('visibilitychange', this.onPageVisibility);
      this.onScreen?.disconnect();
      this.disableDesktop();
      this.stopAuto();
    }

    /* ---------- carousel ---------- */

    go(index, initial) {
      const last = this.items.length - 1;
      this.active = Math.min(Math.max(index, 0), last);
      this.style.setProperty('--fa-pg-active', this.active);
      this.items.forEach((item, i) => {
        item.dataset.distance = String(Math.min(Math.abs(i - this.active), 2));
      });
      if (this.looping) {
        this.setArrows(false, false);
        // Back to the matching original once the slide has finished (never mid-slide: that would jump).
        clearTimeout(this.settleTimer);
        if (!initial) this.settleTimer = setTimeout(() => this.settle(), this.slideMs() + 50);
      } else {
        this.setArrows(this.active === 0, this.active === last);
      }
      // While sound is on, it follows the photo in the middle.
      // Never unmutes on its own: only when the sound button was just pressed (pendingSound) or a clip in this
      // gallery really has sound right now. A stale "sound on" with every clip muted is cleared instead.
      if (this.pendingSound || (this.soundOn && this.audible())) {
        this.soundTo(this.items[this.active]?.querySelector('video'));
      } else if (this.soundOn) {
        this.soundOn = false;
        this.hold('sound', false);
      }
      this.pendingSound = false;
      if (this.status && !initial && !this.autoStep) {
        const n = this.looping ? mod(this.active - this.base, this.originals.length) : this.active;
        this.status.textContent = `${n + 1} ${this.dataset.labelOf || 'of'} ${this.originals.length}`;
      }
    }

    step(direction) {
      if (this.carousel) {
        if (this.looping) {
          // A burst of presses can outrun the copies: jump back to the originals first (rare; visible only then).
          const next = this.active + direction;
          if (next < this.reach || next > this.items.length - 1 - this.reach) this.settle();
        }
        this.go(this.active + direction);
        return;
      }
      // strip: one photo (plus the gap) per press
      this.moved = true;
      const item = this.items[0];
      const gap = parseFloat(getComputedStyle(item.parentElement).columnGap) || 0;
      if (this.ticker) {
        this.glideTo(this.offset + direction * (item.offsetWidth + gap));
        return;
      }
      this.viewport.scrollBy({ left: direction * this.rtl() * (item.offsetWidth + gap), behavior: reduceMotion() ? 'auto' : 'smooth' });
    }

    /* ---------- strip ---------- */

    rtl() {
      return getComputedStyle(this.viewport).direction === 'rtl' ? -1 : 1;
    }

    max() {
      return this.viewport.scrollWidth - this.viewport.clientWidth;
    }

    layout() {
      if (this.ticker) {
        this.layoutTicker();
        return;
      }
      const max = this.max();
      this.toggleAttribute('data-overflow', max > 1);
      // Nothing to scroll: no empty tab stop.
      if (max > 1) this.viewport.setAttribute('tabindex', '0');
      else this.viewport.removeAttribute('tabindex');
      if (!this.moved && this.dataset.active !== '0' && max > 1) {
        this.viewport.scrollTo({ left: (this.rtl() * max) / 2, behavior: 'auto' });
      } else if (!this.moved && max > 1) {
        this.viewport.scrollTo({ left: 0, behavior: 'auto' });
      }
      this.updateArrows();
    }

    updateArrows() {
      if (this.ticker) return;
      const max = this.max();
      const left = Math.abs(this.viewport.scrollLeft);
      this.setArrows(max <= 1 || left <= 1, max <= 1 || left >= max - 1);
    }

    /* ---------- both ---------- */

    // A focused button that gets disabled drops keyboard focus to <body>: hand it to the other arrow (or, in the
    // strip, the focusable row) first. Same pattern as fa-testimonials.js.
    // Enable first, so the other arrow can take focus even if it was disabled a moment ago (e.g. a jump straight
    // from one end to the other).
    setArrows(prevOff, nextOff) {
      const focused = document.activeElement;
      if (this.prev && !prevOff) this.prev.disabled = false;
      if (this.next && !nextOff) this.next.disabled = false;
      if ((focused === this.prev && prevOff) || (focused === this.next && nextOff)) {
        const other = focused === this.prev ? this.next : this.prev;
        const otherOff = focused === this.prev ? nextOff : prevOff;
        const target = other && !otherOff ? other : (!this.carousel && this.viewport.hasAttribute('tabindex') ? this.viewport : null);
        target?.focus({ preventScroll: true });
      }
      if (this.prev) this.prev.disabled = prevOff;
      if (this.next) this.next.disabled = nextOff;
    }

    centre(item, behavior) {
      if (this.ticker) {
        this.glideTo(item.offsetLeft + item.offsetWidth / 2 - this.viewport.clientWidth / 2, behavior === 'auto');
        return;
      }
      const box = item.getBoundingClientRect();
      const view = this.viewport.getBoundingClientRect();
      this.viewport.scrollBy({
        left: box.left + box.width / 2 - (view.left + view.width / 2),
        behavior: behavior || (reduceMotion() ? 'auto' : 'smooth'),
      });
    }

    /* ---------- pointer: carousel swipe (all pointers), strip drag (mouse only) ---------- */

    dragStart(event) {
      if (event.button !== 0 || event.target.closest('[data-video-controls]')) return;
      if (!this.carousel && (event.pointerType !== 'mouse' || (!this.ticker && this.max() <= 1))) return;
      this.drag = { x: event.clientX, y: event.clientY, left: this.viewport.scrollLeft, offset: this.offset, active: false };
      window.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('pointerup', this.onPointerUp);
      window.addEventListener('pointercancel', this.onPointerUp);
    }

    dragMove(event) {
      if (!this.drag) return;
      const dx = event.clientX - this.drag.x;
      if (!this.drag.active) {
        if (Math.abs(dx) < DRAG || Math.abs(dx) < Math.abs(event.clientY - this.drag.y)) return;
        this.drag.active = true;
        this.moved = true;
        this.setAttribute('data-dragging', '');
        if (this.ticker) {
          this.glide = null;
          this.hold('drag', true);
        }
      }
      if (this.ticker) {
        this.offset = this.drag.offset - dx;
        this.wrap();
        this.render();
      } else if (!this.carousel) {
        this.viewport.scrollLeft = this.drag.left - dx;
      }
    }

    dragEnd(event) {
      this.stopListening();
      if (!this.drag) return;
      const { active, x } = this.drag;
      this.drag = null;
      if (!active) return;
      this.removeAttribute('data-dragging');
      this.hold('drag', false);
      // The click that ends a drag must not also select the photo under the pointer.
      this.suppressClick = true;
      setTimeout(() => { this.suppressClick = false; }, 0);
      if (this.carousel && event && event.type === 'pointerup') {
        const dx = event.clientX - x;
        if (Math.abs(dx) >= SWIPE) {
          this.step(dx < 0 ? this.rtl() : -this.rtl());
          this.restartAuto();
        }
      }
    }

    stopListening() {
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerup', this.onPointerUp);
      window.removeEventListener('pointercancel', this.onPointerUp);
    }

    click(event) {
      if (this.videoControl(event)) return;
      if (this.suppressClick) {
        event.preventDefault();
        event.stopPropagation();
        this.suppressClick = false;
        return;
      }
      const item = event.target.closest('li');
      if (!item || !this.viewport.contains(item)) return;
      if (this.lightboxOn) {
        this.openLightbox(item);
        return;
      }
      if (!this.carousel) return;
      this.go(this.items.indexOf(item));
      this.restartAuto();
    }

    /* ---------- block videos ---------- */

    // Pause / sound buttons on a photo; returns true when the click was one of them (it must not move the carousel).
    videoControl(event) {
      const button = event.target.closest('[data-video-play], [data-video-mute]');
      if (!button || !this.contains(button)) return false;
      event.stopPropagation();
      const video = button.closest('.fa-photo-gallery__media')?.querySelector('video');
      if (!video) return true;
      if (button.hasAttribute('data-video-play')) {
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      } else if (video.muted) {
        // Sound on: this clip only, and the carousel stops auto-scrolling until sound is turned off again.
        // A clip off to the side is brought to the middle first (go() then hands it the sound).
        this.soundOn = true;
        this.hold('sound', true);
        const index = this.carousel ? this.items.indexOf(button.closest('li')) : -1;
        if (index >= 0 && index !== this.active) {
          this.pendingSound = true;
          this.go(index);
        } else {
          this.soundTo(video);
        }
      } else {
        this.soundOn = false;
        video.muted = true;
        this.muteButton(video);
        this.hold('sound', false);
      }
      return true;
    }

    // One clip has sound at a time: unmute (and play) this one, mute every other gallery video on the page, loop copies
    // included. Moving from a loop copy to its original keeps the playback position, so the jump is not heard.
    soundTo(video) {
      if (!(video instanceof HTMLVideoElement)) return;
      const previous = this.soundVideo;
      if (previous && previous !== video && previous.currentSrc && previous.currentSrc === video.currentSrc) {
        try { video.currentTime = previous.currentTime; } catch (error) { /* not seekable yet */ }
      }
      document.querySelectorAll('.fa-photo-gallery__video').forEach((other) => {
        if (other === video || other.muted) return;
        other.muted = true;
        this.muteButton(other);
      });
      video.muted = false;
      this.muteButton(video);
      this.soundVideo = video;
      if (video.paused) {
        video.play().catch(() => {
          // The browser refused sound without a fresh tap: fall back to muted, and sound counts as off again.
          video.muted = true;
          this.muteButton(video);
          if (!this.audible()) {
            this.soundOn = false;
            this.hold('sound', false);
          }
        });
      }
    }

    // True when any clip in this gallery (loop copies included) is playing with sound.
    audible() {
      return Array.from(this.querySelectorAll('video')).some((v) => !v.muted);
    }

    muteButton(video) {
      video.parentElement.querySelector('[data-video-mute]')?.setAttribute('aria-pressed', String(!video.muted));
    }

    videoState(video) {
      if (!(video instanceof HTMLVideoElement)) return;
      const controls = video.parentElement.querySelector('[data-video-controls]');
      if (!controls) return;
      controls.toggleAttribute('data-paused', video.paused);
      controls.querySelector('[data-video-play]')?.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
    }

    /* ---------- desktop motion: switching ---------- */

    mode() {
      const on = this.desktop.matches;
      if (on && !this.enhanced) this.enableDesktop();
      else if (!on) {
        if (this.enhanced) this.disableDesktop();
        if (this.carousel) this.restartAuto(); // phone width: the carousel keeps auto-scrolling
      }
    }

    enableDesktop() {
      this.enhanced = true;
      this.autoOn = this.hasAttribute('data-autoplay');
      this.interval = Math.max(parseFloat(this.dataset.interval) || 4000, 1000);
      this.speed = parseFloat(this.dataset.speed) || 30;

      this.onEnter = (event) => { if (event.pointerType !== 'touch') this.hold('hover', true); };
      this.onLeave = (event) => { if (event.pointerType !== 'touch') this.hold('hover', false); };
      this.onFocusIn = (event) => this.focusIn(event);
      this.onFocusOut = (event) => { if (!this.contains(event.relatedTarget)) this.hold('focus', false); };
      this.onVisibility = () => this.hold('hidden', document.hidden);
      // Clinic carousel: hover pauses. The strip keeps drifting under the pointer (its photos open the larger view).
      if (this.carousel) {
        this.addEventListener('pointerenter', this.onEnter);
        this.addEventListener('pointerleave', this.onLeave);
      }
      this.addEventListener('focusin', this.onFocusIn);
      this.addEventListener('focusout', this.onFocusOut);
      document.addEventListener('visibilitychange', this.onVisibility);
      if ('IntersectionObserver' in window) {
        this.seen = new IntersectionObserver((entries) => {
          entries.forEach((entry) => this.hold('offscreen', !entry.isIntersecting));
        });
        this.seen.observe(this.viewport);
      }
      this.onVisibility();

      if (this.hasAttribute('data-loop')) {
        if (this.carousel) this.enableLoop();
        else if (this.rtl() === 1) this.enableTicker();
      }
      if (!this.carousel && this.hasAttribute('data-lightbox')) this.enableLightbox();
      this.restartAuto();
    }

    disableDesktop() {
      if (!this.enhanced) return;
      this.enhanced = false;
      this.stopAuto();
      this.removeEventListener('pointerenter', this.onEnter);
      this.removeEventListener('pointerleave', this.onLeave);
      this.removeEventListener('focusin', this.onFocusIn);
      this.removeEventListener('focusout', this.onFocusOut);
      document.removeEventListener('visibilitychange', this.onVisibility);
      this.seen?.disconnect();
      // Drop only the desktop-only pauses: sound, off screen, hidden tab, drag and editor still apply on phones.
      this.holds.delete('hover');
      this.holds.delete('focus');
      if (!this.carousel) this.holds.clear();
      if (this.soundOn) this.holds.add('sound'); // still no auto-scroll while a clip has sound
      this.disableLightbox();
      if (this.looping) this.disableLoop();
      if (this.ticker) this.disableTicker();
    }

    // Unannounced, unfocusable copies of the original photos (no Theme Editor block attributes, ids or button role).
    // Not inert: a click on a copy still has to bring that photo to the middle / open the larger view.
    copies() {
      return this.originals.map((item) => {
        const copy = item.cloneNode(true);
        Array.from(copy.attributes).forEach((attr) => {
          if (/^(data-shopify|id$|role$|tabindex$|aria-haspopup$)/.test(attr.name)) copy.removeAttribute(attr.name);
        });
        copy.setAttribute('aria-hidden', 'true');
        copy.setAttribute('data-copy', '');
        copy.querySelectorAll('img').forEach((img) => img.setAttribute('loading', 'eager'));
        copy.querySelectorAll('button').forEach((button) => button.setAttribute('tabindex', '-1'));
        copy.querySelectorAll('video').forEach((video) => {
          video.muted = true;
          video.autoplay = !reduceMotion();
        });
        return copy;
      });
    }

    removeCopies() {
      this.list.querySelectorAll(':scope > [data-copy]').forEach((copy) => copy.remove());
      this.items = this.originals.slice();
    }

    instant(fn) {
      this.setAttribute('data-instant', '');
      fn();
      void this.list.offsetWidth;
      this.removeAttribute('data-instant');
    }

    /* ---------- desktop motion: carousel loop ---------- */

    px(name) {
      return parseFloat(getComputedStyle(this).getPropertyValue(name)) || 0;
    }

    slideMs() {
      const value = getComputedStyle(this.list).transitionDuration.split(',')[0] || '0s';
      return parseFloat(value) * (value.includes('ms') ? 1 : 1000) || 0;
    }

    enableLoop() {
      const n = this.originals.length;
      // Photos needed beyond the active one to fill half the screen, plus room for a few quick presses.
      const pitch = this.px('--fa-pg-w') + this.px('--fa-pg-gap') || 320;
      this.reach = Math.ceil((window.innerWidth / 2 + this.px('--fa-pg-w-active')) / pitch) + 1;
      this.sets = Math.ceil((this.reach + 3) / n);
      this.loopWidth = window.innerWidth;
      const logical = this.active;
      for (let s = 0; s < this.sets; s += 1) {
        this.list.prepend(...this.copies());
        this.list.append(...this.copies());
      }
      this.items = Array.from(this.list.children);
      this.base = this.sets * n;
      this.looping = true;
      this.instant(() => this.go(this.base + logical, true));
      this.onLoopResize = () => {
        // A much wider window needs more copies: rebuild around the current photo.
        if (window.innerWidth <= this.loopWidth) return;
        this.disableLoop();
        this.enableLoop();
      };
      window.addEventListener('resize', this.onLoopResize);
    }

    disableLoop() {
      clearTimeout(this.settleTimer);
      window.removeEventListener('resize', this.onLoopResize);
      const logical = mod(this.active - this.base, this.originals.length);
      this.removeCopies();
      this.looping = false;
      this.instant(() => this.go(logical, true));
    }

    settle() {
      if (!this.looping) return;
      const n = this.originals.length;
      const home = this.base + mod(this.active - this.base, n);
      if (home !== this.active) this.instant(() => this.go(home, true));
    }

    /* ---------- desktop motion: strip ticker ---------- */

    enableTicker() {
      // Keep the photos exactly where they are on screen while the track takes over from the scroll row.
      const view = this.viewport.getBoundingClientRect();
      const screenX = this.originals[0].getBoundingClientRect().left - view.left;
      this.ticker = true;
      this.setAttribute('data-ticker', '');
      this.toggleAttribute('data-overflow', true);
      this.viewport.setAttribute('tabindex', '0');
      this.viewport.scrollLeft = 0;
      this.buildTicker();
      this.offset = this.originals[0].offsetLeft - screenX;
      this.wrap();
      this.render();
      this.setArrows(false, false);

      this.onWheel = (event) => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
        event.preventDefault();
        this.glide = null;
        this.offset += event.deltaX;
        this.wrap();
        this.render();
      };
      this.onKey = (event) => {
        if (event.target !== this.viewport) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        this.step(event.key === 'ArrowRight' ? 1 : -1);
      };
      this.viewport.addEventListener('wheel', this.onWheel, { passive: false });
      this.viewport.addEventListener('keydown', this.onKey);
    }

    buildTicker() {
      this.removeCopies();
      const first = this.originals[0];
      const gap = parseFloat(getComputedStyle(this.list).columnGap) || 0;
      this.setWidth = this.originals.length * (first.offsetWidth + gap);
      // One set before the originals and enough after them to cover the screen at any offset in range.
      const after = Math.max(1, Math.ceil((this.viewport.clientWidth + gap) / this.setWidth));
      this.list.prepend(...this.copies());
      for (let s = 0; s < after; s += 1) this.list.append(...this.copies());
      this.items = this.originals.slice();
      this.span = (after + 2) * this.setWidth - gap;
    }

    layoutTicker() {
      const oldStart = this.originals[0].offsetLeft;
      const phase = this.setWidth ? (this.offset - oldStart) / this.setWidth : 0;
      this.buildTicker();
      this.offset = this.originals[0].offsetLeft + phase * this.setWidth;
      this.wrap();
      this.render();
    }

    disableTicker() {
      this.ticker = false;
      this.glide = null;
      cancelAnimationFrame(this.tickFrame);
      this.tickFrame = 0;
      this.viewport.removeEventListener('wheel', this.onWheel);
      this.viewport.removeEventListener('keydown', this.onKey);
      this.removeCopies();
      this.list.style.removeProperty('transform');
      this.removeAttribute('data-ticker');
      this.moved = false;
      this.layout();
    }

    // Keep the offset inside [0, span - screen]; one set width earlier / later shows the same photos.
    wrap() {
      const hi = this.span - this.viewport.clientWidth;
      let shift = 0;
      while (this.offset + shift > hi) shift -= this.setWidth;
      while (this.offset + shift < 0) shift += this.setWidth;
      if (!shift) return;
      this.offset += shift;
      if (this.glide) {
        this.glide.from += shift;
        this.glide.to += shift;
      }
    }

    render() {
      this.list.style.transform = `translate3d(${(-this.offset).toFixed(2)}px, 0, 0)`;
    }

    glideTo(target, now) {
      if (now || reduceMotion()) {
        this.glide = null;
        this.offset = target;
        this.wrap();
        this.render();
        return;
      }
      this.glide = { from: this.offset, to: target, start: performance.now() };
      this.tick();
    }

    tick() {
      if (this.tickFrame) return;
      let last = performance.now();
      const frame = (time) => {
        this.tickFrame = 0;
        if (!this.ticker) return;
        const dt = Math.min(time - last, 50);
        last = time;
        if (this.glide) {
          const t = Math.min((time - this.glide.start) / GLIDE, 1);
          this.offset = this.glide.from + (this.glide.to - this.glide.from) * easeOut(t);
          if (t >= 1) this.glide = null;
        } else if (this.drifting()) {
          this.offset += (this.speed * dt) / 1000;
        }
        this.wrap();
        this.render();
        if (this.glide || this.drifting()) this.tickFrame = requestAnimationFrame(frame);
      };
      this.tickFrame = requestAnimationFrame(frame);
    }

    /* ---------- desktop motion: autoplay ---------- */

    drifting() {
      // Carousel: every width. Strip ticker: desktop only (it needs the enhanced track).
      return (this.enhanced || this.carousel) && this.autoOn && !reduceMotion() && this.holds.size === 0;
    }

    hold(reason, on) {
      if (!this.holds) return;
      if (on) this.holds.add(reason);
      else this.holds.delete(reason);
      this.restartAuto();
    }

    stopAuto() {
      clearTimeout(this.autoTimer);
      this.autoTimer = 0;
    }

    restartAuto() {
      this.stopAuto();
      if (!this.drifting()) return;
      if (this.ticker) {
        this.tick();
        return;
      }
      if (!this.carousel) return;
      this.autoTimer = setTimeout(() => {
        this.autoStep = true;
        if (this.looping) this.step(1);
        else this.go(this.active >= this.items.length - 1 ? 0 : this.active + 1);
        this.autoStep = false;
        this.restartAuto();
      }, this.interval);
    }

    // Keyboard focus inside the gallery pauses autoplay; a photo reached with Tab glides fully into view. Focus put
    // back on a photo when the larger view closes doesn't count (the visitor didn't tab there).
    focusIn(event) {
      if (this.restoring) {
        this.restoring = false;
        return;
      }
      if (this.dialog && this.dialog.contains(event.target)) return;
      const keyboard = event.target.matches(':focus-visible');
      this.hold('focus', keyboard);
      if (!this.ticker || !keyboard) return;
      const item = event.target.closest('li');
      if (!item || !this.viewport.contains(item)) return;
      const view = this.viewport.getBoundingClientRect();
      const box = item.getBoundingClientRect();
      if (box.left < view.left || box.right > view.right) this.centre(item);
    }

    /* ---------- desktop motion: larger view ---------- */

    enableLightbox() {
      this.dialog = this.querySelector('[data-lightbox-dialog]');
      if (!this.dialog || typeof this.dialog.showModal !== 'function') return;
      this.figure = this.dialog.querySelector('[data-lightbox-figure]');
      this.lightboxOn = true;
      this.originals.forEach((item) => {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-haspopup', 'dialog');
      });
      this.onItemKey = (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const item = event.target.closest('li');
        if (!item || event.target !== item) return;
        event.preventDefault();
        this.openLightbox(item);
      };
      this.onDialogClick = (event) => {
        if (event.target.closest('[data-lightbox-close]') || !event.target.closest('img')) this.closeLightbox();
      };
      // Escape: the browser closes the dialog and puts focus back itself, so flag that first.
      this.onDialogCancel = () => { this.restoring = true; };
      this.onDialogClose = () => {
        this.figure.replaceChildren();
        document.documentElement.removeAttribute('data-fa-lightbox');
        const back = this.trigger;
        this.trigger = null;
        if (back && back.isConnected && document.activeElement !== back) {
          this.restoring = true;
          back.focus({ preventScroll: true });
        }
        // Focus may not have moved: don't let the flag swallow a later Tab.
        setTimeout(() => { this.restoring = false; }, 0);
      };
      this.list.addEventListener('keydown', this.onItemKey);
      this.dialog.addEventListener('click', this.onDialogClick);
      this.dialog.addEventListener('cancel', this.onDialogCancel);
      this.dialog.addEventListener('close', this.onDialogClose);
      this.setAttribute('data-lightbox-ready', '');
    }

    disableLightbox() {
      if (!this.lightboxOn) return;
      this.lightboxOn = false;
      // The close event comes a task later, after its listener is gone: tidy up here (scroll lock, photo).
      this.closeLightbox();
      this.figure.replaceChildren();
      document.documentElement.removeAttribute('data-fa-lightbox');
      this.trigger = null;
      this.originals.forEach((item) => {
        item.removeAttribute('role');
        item.removeAttribute('tabindex');
        item.removeAttribute('aria-haspopup');
      });
      this.list.removeEventListener('keydown', this.onItemKey);
      this.dialog.removeEventListener('click', this.onDialogClick);
      this.dialog.removeEventListener('cancel', this.onDialogCancel);
      this.dialog.removeEventListener('close', this.onDialogClose);
      this.removeAttribute('data-lightbox-ready');
    }

    openLightbox(item) {
      const index = parseInt(item.dataset.index, 10) || 0;
      const source = this.originals[index] || item;
      const thumb = source.querySelector('img');
      const src = source.dataset.full || (thumb && (thumb.currentSrc || thumb.src));
      if (!src) return;
      const img = document.createElement('img');
      img.className = 'fa-photo-gallery__lightbox-img';
      img.alt = thumb ? thumb.alt : '';
      img.decoding = 'async';
      img.src = src;
      this.figure.replaceChildren(img);
      this.trigger = source;
      document.documentElement.setAttribute('data-fa-lightbox', '');
      this.dialog.showModal();
    }

    closeLightbox() {
      if (!this.dialog.open) return;
      this.restoring = true;
      this.dialog.close();
    }
  }

  customElements.define('fa-photo-gallery', FaPhotoGallery);
})();
