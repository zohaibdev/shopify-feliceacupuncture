// Runs INSIDE use_figma (read-only), two passes per page (each call < 50 KB of code, < 20 KB returned).
// qa-build.py fills __ART__ (frame id), __MODE__ ('t' texts / 'b' boxes), __DOM__ (dom-extract.mjs output, families
// shortened: M Marisa, T Tenor Sans, L Libre Caslon Condensed, X Libre Caslon Text, J Jost) ('b' gets texts as [key, y] only, to rebuild the
// local y offsets). Returns grouped mismatches only.
const art = await figma.getNodeByIdAsync('__ART__');
const MODE = '__MODE__';
const FY0 = __Y0__, FY1 = __Y1__; // Figma y range of this call (texts); the DOM data is split at the same y
const DOM = __DOM__;
const ax = art.absoluteTransform[0][2], ay = art.absoluteTransform[1][2];
const hex = (c) => [c.r, c.g, c.b].map((v) => Math.round(v * 255));
const vis = (n) => { for (let p = n; p && p !== art.parent; p = p.parent) if (p.visible === false) return false; return true; };
const op = (n) => { let o = 1; for (let p = n; p && p !== art.parent; p = p.parent) if ('opacity' in p) o *= p.opacity; return o; };
const norm = (s) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().slice(0, 18);
const wt = (s) => (/semi/i.test(s) ? 600 : /bold/i.test(s) ? 700 : /medium/i.test(s) ? 500 : 400);
const famOk = (f, d) => (/marisa/i.test(f) ? /^[MT]$/.test(d) : /libre caslon condensed/i.test(f) ? d === 'L' : /libre caslon text/i.test(f) ? d === 'X' : /futura/i.test(f) ? d === 'J' || /futura/i.test(d) : true);
const num = (v, d) => (typeof v === 'number' ? v : d);
const cdiff = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const issues = new Map(); const add = (sig, where) => { const e = issues.get(sig) || []; e.push(where); issues.set(sig, e); };

if (MODE === 't') {
// ---- texts
const figT = [];
for (const n of art.findAllWithCriteria({ types: ['TEXT'] })) {
  if (!vis(n)) continue; const b = n.absoluteBoundingBox; if (!b) continue;
  if (b.y - ay < FY0 || b.y - ay >= FY1) continue;
  const segs = n.getStyledTextSegments(['fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'textCase', 'fills', 'textDecoration']);
  const s = segs.reduce((a, c) => (c.end - c.start > a.end - a.start ? c : a), segs[0]);
  const f = (s.fills || []).find((q) => q.visible !== false && q.type === 'SOLID');
  figT.push({ k: norm(n.characters), t: n.characters.replace(/\s+/g, ' ').trim().slice(0, 30), x: b.x - ax, y: b.y - ay, w: b.width, h: b.height, fam: s.fontName.family, sty: s.fontName.style, fs: s.fontSize,
    lh: s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value : s.lineHeight.unit === 'PERCENT' ? s.lineHeight.value * s.fontSize / 100 : null,
    ls: s.letterSpacing.unit === 'PIXELS' ? s.letterSpacing.value : s.letterSpacing.value * s.fontSize / 100, tc: s.textCase, u: s.textDecoration === 'UNDERLINE',
    col: f ? hex(f.color) : null, a: (f ? (f.opacity ?? 1) : 1) * op(n), al: n.textAlignHorizontal });
}
const domBy = new Map(); for (const d of DOM.texts) { (domBy.get(d[0]) || domBy.set(d[0], []).get(d[0])).push(d); }
const figBy = new Map(); for (const f of figT) { (figBy.get(f.k) || figBy.set(f.k, []).get(f.k)).push(f); }
const pairs = []; let missing = 0; const missList = [];
for (const [k, fl] of figBy) {
  const dl = domBy.get(k); if (!dl) { missing += fl.length; if (missList.length < 40) missList.push(fl[0].t + '@' + Math.round(fl[0].y)); continue; }
  // duplicates (nav vs heading, repeated labels): each Figma text takes the nearest unused DOM text by y
  const free = [...dl];
  for (const f of [...fl].sort((a, b) => a.y - b.y)) { if (!free.length) break; let bi = 0; free.forEach((d, i) => { if (Math.abs(d[1] - f.y) < Math.abs(free[bi][1] - f.y)) bi = i; }); pairs.push([f, free.splice(bi, 1)[0]]); }
}
for (const [f, d] of pairs) {
  const [, dy, dh, dfam, dfw, dfs, dlh, dls, dtt, dcol, dop, du] = d; // DOM text: key, y, h, family, weight, size, lh, ls, transform, rgba, opacity, underline
  const where = `"${f.t}"@${Math.round(f.y)}`;
  const tag = `${f.fam.replace('Libre Caslon Condensed', 'LCC')} ${f.sty} ${f.fs}`;
  if (!famOk(f.fam, dfam)) add(`family ${f.fam}→${dfam}`, where);
  if (wt(f.sty) !== dfw) add(`weight ${tag}: ${wt(f.sty)}→${dfw}`, where);
  if (Math.abs(f.fs - dfs) > 0.5) add(`size ${tag}: ${f.fs}→${dfs}`, where);
  if (Math.abs(f.ls - dls) > 0.3) add(`letter-spacing ${tag}: ${+f.ls.toFixed(2)}→${dls}`, where);
  if (f.lh && dh > f.lh * 1.6 && dlh && Math.abs(f.lh - dlh) > 1) add(`line-height ${tag}: ${+f.lh.toFixed(1)}→${dlh}`, where);
  const c = dcol.split(',').map(Number);
  if (f.col && cdiff(f.col, c) > 18) add(`color ${tag}: rgb(${f.col})→rgb(${c.slice(0, 3)})`, where);
  const da = (c[3] ?? 1) * dop; if (Math.abs(f.a - da) > 0.08) add(`opacity ${tag}: ${+f.a.toFixed(2)}→${+da.toFixed(2)}`, where);
  if (f.u !== !!du) add(`underline ${tag}: ${f.u}→${!!du}`, where);
  if (f.tc === 'UPPER' && dtt !== 'u' && d[0] !== d[0].toUpperCase()) add(`text-transform ${tag}: UPPER→${dtt}`, where);
  f.dy = dy - f.y;
}
const out = [...issues.entries()].sort((a, b) => b[1].length - a[1].length).map(([sig, w]) => `${sig}  ×${w.length}: ${w.slice(0, 4).join(' | ')}`);
return { frame: '__ART__', figTexts: figT.length, domTexts: DOM.texts.length, paired: pairs.length, figNotFound: missing, notFoundSample: missList, issues: out.slice(0, 110) };
}
// ---- boxes: Figma candidates (all frames / shapes) vs DOM boxes, local y offset from the text pass
// DY table: rebuilt here from DOM.texts = [[key, y], ...] (texts paired by content, in y order)
const DYT = [];
{ const fk = new Map();
  for (const n of art.findAllWithCriteria({ types: ['TEXT'] })) { if (!vis(n)) continue; const bb = n.absoluteBoundingBox; if (!bb) continue; const k = norm(n.characters); (fk.get(k) || fk.set(k, []).get(k)).push(bb.y - ay); }
  const dk = new Map(); for (const [k, y] of DOM.texts) (dk.get(k) || dk.set(k, []).get(k)).push(y);
  for (const [k, fy] of fk) { const free = dk.get(k); if (!free) continue; for (const y of fy.sort((a, b) => a - b)) { if (!free.length) break; let bi = 0; free.forEach((d, i) => { if (Math.abs(d - y) < Math.abs(free[bi] - y)) bi = i; }); DYT.push([y, free.splice(bi, 1)[0] - y]); } } }
const localDy = (y) => { const near = DYT.filter((p) => Math.abs(p[0] + p[1] - y) < 350).map((p) => p[1]).sort((a, b) => a - b); return near.length ? near[near.length >> 1] : 0; };
const paint = (arr) => (Array.isArray(arr) ? arr : []).filter((p) => p.visible !== false);
const figB = [];
for (const n of art.findAllWithCriteria({ types: ['FRAME', 'RECTANGLE', 'INSTANCE', 'BOOLEAN_OPERATION', 'ELLIPSE', 'COMPONENT'] })) {
  if (!vis(n)) continue; const b = n.absoluteBoundingBox; if (!b || b.width < 8 || b.height < 8) continue;
  const fills = paint(n.fills), strokes = paint(n.strokes);
  const solid = fills.find((p) => p.type === 'SOLID');
  const rad = n.type === 'ELLIPSE' ? 999 : ('cornerRadius' in n ? num(n.cornerRadius, ('topLeftRadius' in n ? num(n.topLeftRadius, 0) : 0)) : 0);
  const sw = 'strokeWeight' in n ? num(n.strokeWeight, 1) : 0;
  figB.push({ name: n.name.slice(0, 20), x: b.x - ax, y: b.y - ay, w: b.width, h: b.height, rad, img: fills.some((p) => p.type === 'IMAGE'),
    bg: solid ? [...hex(solid.color), num(solid.opacity, 1)] : null, st: strokes.length && sw > 0 && strokes[0].color ? [hex(strokes[0].color), sw, num(strokes[0].opacity, 1)] : null });
}
const used = new Set();
for (const d of DOM.boxes) {
  const [sel, x, y, w, h, rad, bg, hasImg, border] = d;
  if (w >= 1400) continue;
  const ldy = localDy(y);
  let best = null, bd = 1e9;
  for (const f of figB) {
    if (Math.abs(f.w - w) > 6 || Math.abs(f.h - h) > 6) continue;
    const dist = Math.abs(f.x - x) + Math.abs(f.y + ldy - y);
    if (Math.abs(f.x - x) > 12 || Math.abs(f.y + ldy - y) > 45) continue;
    // prefer a node that carries the visual (radius / fill / stroke / image)
    const score = dist - (f.rad ? 6 : 0) - (f.bg ? 4 : 0) - (f.st ? 4 : 0) - (f.img ? 3 : 0);
    if (score < bd) { bd = score; best = f; }
  }
  const where = `${sel} ${w}x${h}@${y}`;
  if (!best) {
    // buttons / small boxes: report the size difference against the nearest Figma box at the same place
    let near = null, nd = 1e9;
    for (const f of figB) { if (Math.abs(f.x + f.w / 2 - (x + w / 2)) > 30 || Math.abs(f.y + f.h / 2 + ldy - (y + h / 2)) > 30 || Math.abs(f.h - h) > 20 || Math.abs(f.w - w) > 80 || !(f.bg || f.st || f.rad)) continue; const dd = Math.abs(f.w - w) + Math.abs(f.h - h); if (dd < nd) { nd = dd; near = f; } }
    if (near) add(`size ${near.name}: ${Math.round(near.w)}x${Math.round(near.h)} r${+near.rad.toFixed(1)}→${w}x${h} r${rad}`, where);
    else if (rad > 0 && rad < 100) add(`radius ${rad} on a box with no Figma counterpart (unclear)`, where);
    continue;
  }
  used.add(best);
  const frad = best.rad >= Math.min(best.w, best.h) / 2 - 0.5 ? 'circle' : +best.rad.toFixed(1);
  const drad = rad >= Math.min(w, h) / 2 - 0.5 ? 'circle' : rad;
  if (frad !== drad && !(frad === 'circle' && drad === 'circle') && Math.abs((+frad || 0) - (+drad || 0)) > 0.6) add(`radius ${best.name}: ${frad}→${drad}`, where);
  if (best.bg && bg && !hasImg && !best.img) { const c = bg.split(',').map(Number); if (cdiff(best.bg, c) > 18 || Math.abs(best.bg[3] - (c[3] ?? 1)) > 0.08) add(`background ${best.name}: rgba(${best.bg.map((v) => +(+v).toFixed(2))})→rgba(${c})`, where); }
  if (best.bg && !bg && !hasImg && !best.img && best.bg[3] > 0.05) add(`background ${best.name}: rgba(${best.bg.map((v) => +(+v).toFixed(2))})→none`, where);
  if (best.st && !border && !hasImg && cdiff(best.st[0], best.bg || [0, 0, 0]) > 18) add(`border ${best.name}: ${best.st[1]}px rgba(${best.st[0]},${+best.st[2].toFixed(2)})→none`, where);
  if (!best.st && border && !/0\)$/.test(border)) add(`border ${best.name}: none→${border}`, where);
  if (best.st && border) { const bw = parseFloat(border); if (Math.abs(bw - best.st[1]) > 0.6) add(`border-width ${best.name}: ${best.st[1]}→${bw}`, where); }
}
const out = [...issues.entries()].sort((a, b) => b[1].length - a[1].length).map(([sig, w]) => `${sig}  ×${w.length}: ${w.slice(0, 4).join(' | ')}`);
return { frame: '__ART__', boxes: DOM.boxes.length, issues: out.slice(0, 120) };
