// Full-QA browser side: computed styles of every text block, styled box and button (with a real hover) at 1440.
// Usage (from a folder with puppeteer-core installed): [W=375] node dom-extract.mjs <url> <out.json>
// Output: { texts: [key, x, y, w, h, family, weight, size, lh|null, ls, transform, 'r,g,b,a', opacity, underline],
//           boxes: [sel, x, y, w, h, radius, bg, hasBgImage, border, padding],
//           hover: [sel, text, before{bg,color,border,shadow,transform}, after{...}, transition] }
// Pair with qa-figma-match.js (runs inside use_figma with this JSON embedded) — results are mismatches only.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [url, out] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
const page = await browser.newPage();
const W = +(process.env.W || 1440); // W=375 node dom-extract.mjs … for a phone frame
await page.setViewport({ width: W, height: W < 900 ? 812 : 1000, deviceScaleFactor: 1, isMobile: W < 900, hasTouch: W < 900 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
await page.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
await new Promise((r) => setTimeout(r, 600));
const data = await page.evaluate(() => {
  const r1 = (v) => Math.round(v);
  const rgba = (s) => { const m = (s.match(/[\d.]+/g) || []).map(Number); return m.length ? [m[0], m[1], m[2], m[3] ?? 1].join(',') : ''; };
  const norm = (s) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().slice(0, 24);
  const texts = []; const seen = new Set();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    if (el.closest('script,style,noscript,template,.fa-visually-hidden,.visually-hidden,[hidden],[aria-hidden="true"] [aria-hidden="true"]')) continue;
    const range = document.createRange(); range.selectNodeContents(el); const tr = range.getBoundingClientRect();
    if (tr.width < 1 || tr.height < 1) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden') continue;
    let o = 1; for (let p = el; p; p = p.parentElement) o *= +getComputedStyle(p).opacity; if (o < 0.05) continue;
    texts.push([norm(el.innerText || n.nodeValue), r1(tr.left), r1(tr.top + scrollY), r1(tr.width), r1(tr.height), cs.fontFamily.split(',')[0].replace(/["']/g, ''), +cs.fontWeight,
      +parseFloat(cs.fontSize).toFixed(1), cs.lineHeight === 'normal' ? null : +parseFloat(cs.lineHeight).toFixed(1), cs.letterSpacing === 'normal' ? 0 : +parseFloat(cs.letterSpacing).toFixed(2),
      cs.textTransform[0], rgba(cs.color), +o.toFixed(2), /underline/.test(cs.textDecorationLine) ? 1 : 0]);
  }
  const boxes = [];
  for (const el of document.querySelectorAll('main *, .shopify-section-group-header-group *, .shopify-section-group-footer-group *')) {
    const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 8) continue;
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const rad = parseFloat(cs.borderTopLeftRadius) || 0;
    const bg = cs.backgroundColor; const hasBg = bg && !/, 0\)$/.test(bg) && bg !== 'transparent';
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map((k) => [parseFloat(cs['border' + k + 'Width']) || 0, cs['border' + k + 'Style'], cs['border' + k + 'Color']]).filter((x) => x[0] > 0 && x[1] !== 'none');
    const side = sides.sort((x, y) => y[0] - x[0])[0]; const bw = side ? side[0] : 0; const hasB = !!side;
    if (!rad && !hasB && !(hasBg && r.width < innerWidth - 40)) continue;
    const sel = el.tagName.toLowerCase() + '.' + ([...el.classList].find((c) => c.startsWith('fa-')) || el.classList[0] || '');
    boxes.push([sel.slice(0, 40), r1(r.left), r1(r.top + scrollY), r1(r.width), r1(r.height), +rad.toFixed(1), hasBg ? rgba(bg) : '', cs.backgroundImage !== 'none' ? 1 : 0,
      hasB ? `${bw}/${side[1]}/${rgba(side[2])}${sides.length < 4 ? '/' + sides.length + 'sides' : ''}` : '', [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map((v) => r1(parseFloat(v))).join('/')]);
  }
  return { texts, boxes, h: document.body.scrollHeight };
});
// hover / focus on every visible button-like element
const handles = await page.$$('.fa-btn, a[class*="__button"], a[class*="-button"], button[class*="fa-"], .fa-article__share-link, .fa-blog-listing__link');
const hover = [];
const snap = (el) => el.evaluate((e) => { const c = getComputedStyle(e); return { bg: c.backgroundColor, color: c.color, border: c.borderTopColor + ' ' + c.borderTopWidth, shadow: c.boxShadow, transform: c.transform, deco: c.textDecorationLine, tr: c.transitionDuration + ' ' + c.transitionProperty.slice(0, 60) }; });
for (const h of handles) {
  const box = await h.boundingBox(); if (!box || box.width < 8) continue;
  const info = await h.evaluate((e) => [e.tagName.toLowerCase() + '.' + [...e.classList].slice(0, 3).join('.'), e.innerText.trim().slice(0, 30)]);
  await h.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.mouse.move(5, 5); await new Promise((r) => setTimeout(r, 60));
  const before = await snap(h);
  await h.hover(); await new Promise((r) => setTimeout(r, 450));
  const after = await snap(h);
  await h.focus(); const focus = await h.evaluate((e) => { const c = getComputedStyle(e); return c.outlineStyle + ' ' + c.outlineWidth + ' ' + c.outlineColor; });
  hover.push([...info, before, after, focus]);
}
await browser.close();
data.hover = hover;
fs.writeFileSync(out, JSON.stringify(data));
console.log(url, 'texts', data.texts.length, 'boxes', data.boxes.length, 'buttons', hover.length, 'height', data.h);
