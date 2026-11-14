// Figma-vs-build text QA. Usage (run from the harness folder so puppeteer-core resolves):
//   node qa-text.mjs <figma.json> <url> [width=1440]
// figma.json = {chunks:[{S:[style keys], R:[[text22, x, y, w, styleIdx, align]]}]} from the compact use_figma dump
// (style key: family|style initial|size|lineHeight or A|letterSpacing px|hex|alpha|u). Prints mismatches only.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [figPath, url, width = '1440'] = process.argv.slice(2);
const fig = JSON.parse(fs.readFileSync(figPath, 'utf8'));
const rows = fig.chunks.flatMap((c) => c.R.map(([t, x, y, w, si, al]) => {
  const [fam, sty, fs_, lh, ls, col, a, u] = c.S[si].split('|');
  return { t, x, y, w, al, fam, sty, fs: +fs_, lh: lh === 'A' ? null : +lh, ls: +ls, col, a: +a, u: u === 'u' };
}));
const norm = (s) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().slice(0, 20);

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: +width, height: 1000, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await page.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
const dom = await page.evaluate(() => {
  const out = []; const seen = new Set();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    let el = n.parentElement; if (!el || seen.has(el)) continue;
    if (el.closest('script,style,noscript,template,.fa-visually-hidden,.visually-hidden,[hidden]')) continue;
    // climb out of inline wrappers (span / a / strong) to the text block, unless the wrapper is styled differently
    seen.add(el);
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden') continue;
    let o = 1; for (let p = el; p; p = p.parentElement) o *= +getComputedStyle(p).opacity;
    if (o < 0.05) continue;
    const sec = el.closest('.shopify-section'); const sr = sec ? sec.getBoundingClientRect() : { top: 0 };
    // text-only range rect (the ink line box, not the padded element box)
    const range = document.createRange(); range.selectNodeContents(el); const tr = range.getBoundingClientRect();
    out.push({ t: el.innerText, x: tr.left, y: tr.top + scrollY, w: tr.width, h: tr.height, sec: sec ? sec.id.replace('shopify-section-', '') : '-', secTop: sr.top + scrollY,
      fs: parseFloat(cs.fontSize), lh: cs.lineHeight === 'normal' ? null : parseFloat(cs.lineHeight), ls: cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing),
      fw: +cs.fontWeight, fam: cs.fontFamily.split(',')[0].replace(/"/g, ''), col: cs.color, op: o, deco: cs.textDecorationLine, decoCol: cs.textDecorationColor, tt: cs.textTransform });
  }
  return out;
});
await browser.close();

const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
const hexRgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
const famOk = (f, d) => (f === 'Marisa' ? /federo|marisa/i.test(d) : f === 'Libre' ? /libre caslon/i.test(d) : f === 'Futura' ? /jost|futura/i.test(d) : true);
const wt = (s) => ({ B: 700, M: 500, R: 400, S: 600 }[s] || 400);

const byKey = new Map();
for (const d of dom) { const k = norm(d.t); if (!k) continue; (byKey.get(k) || byKey.set(k, []).get(k)).push(d); }
const figByKey = new Map();
for (const r of rows) { const k = norm(r.t); (figByKey.get(k) || figByKey.set(k, []).get(k)).push(r); }

const issues = [], missing = [], pairs = [];
for (const [k, fr] of figByKey) {
  let cands = byKey.get(k);
  if (!cands) { const alt = [...byKey.keys()].find((dk) => dk.startsWith(k.slice(0, 12)) || k.startsWith(dk.slice(0, 12))); cands = alt ? byKey.get(alt) : null; }
  if (!cands) { fr.forEach((r) => missing.push(`${r.t} @y${r.y}`)); continue; }
  const fs_ = [...fr].sort((a, b) => a.y - b.y || a.x - b.x), ds = [...cands].sort((a, b) => a.y - b.y || a.x - b.x);
  fs_.forEach((r, i) => { const d = ds[Math.min(i, ds.length - 1)]; pairs.push([r, d]); });
}
for (const [r, d] of pairs) {
  const p = [];
  if (!famOk(r.fam, d.fam)) p.push(`family ${r.fam}→${d.fam}`);
  if (r.fam !== 'Inter' && wt(r.sty) !== d.fw) p.push(`weight ${wt(r.sty)}→${d.fw}`);
  if (Math.abs(r.fs - d.fs) > 0.3) p.push(`size ${r.fs}→${d.fs}`);
  if (Math.abs(r.ls - d.ls) > 0.3) p.push(`ls ${r.ls}→${d.ls.toFixed(2)}`);
  if (r.lh && d.h > r.lh * 1.6 && d.lh && Math.abs(r.lh - d.lh) > 1) p.push(`lh ${r.lh}→${d.lh}`);
  const c = rgb(d.col); const fc = hexRgb(r.col);
  const cd = Math.abs(c[0] - fc[0]) + Math.abs(c[1] - fc[1]) + Math.abs(c[2] - fc[2]);
  const da = (c[3] ?? 1) * d.op;
  if (cd > 18) p.push(`color #${r.col}→${d.col}`);
  if (Math.abs(r.a - da) > 0.07) p.push(`alpha ${r.a}→${da.toFixed(2)}`);
  const du = /underline/.test(d.deco) && !/, 0\)$/.test(d.decoCol) && d.decoCol !== 'transparent';
  if (r.u !== du) p.push(`underline ${r.u}→${du}`);
  const fx = r.al === 'C' ? r.x + r.w / 2 : r.al === 'R' ? r.x + r.w : r.x;
  const dx = r.al === 'C' ? d.x + d.w / 2 : r.al === 'R' ? d.x + d.w : d.x;
  if (Math.abs(fx - dx) > 5 && r.al !== 'C' || r.al === 'C' && Math.abs(fx - dx) > 8) p.push(`x ${Math.round(fx)}→${Math.round(dx)}`);
  r._dy = d.y - r.y; r._sec = d.sec;
  if (p.length) issues.push(`[${d.sec}] "${r.t}" ${p.join('; ')}`);
}
// spacing: within a section, each text's offset from Figma relative to the section's first text
const secs = new Map();
for (const [r] of pairs) { (secs.get(r._sec) || secs.set(r._sec, []).get(r._sec)).push(r); }
const spacing = [];
for (const [s, list] of secs) {
  list.sort((a, b) => a.y - b.y);
  const base = list[0]._dy;
  for (const r of list) { const rel = r._dy - base; if (Math.abs(rel) > 12) spacing.push(`[${s}] "${r.t}" y drift ${rel > 0 ? '+' : ''}${Math.round(rel)} (section offset ${Math.round(base)})`); }
}
console.log(`matched ${pairs.length}/${rows.length} Figma texts`);
if (missing.length) console.log(`NOT FOUND (${missing.length}): ` + missing.join(' | '));
console.log(`STYLE ISSUES (${issues.length}):\n` + issues.join('\n'));
console.log(`SPACING DRIFT >12px (${spacing.length}):\n` + spacing.join('\n'));
