// use_figma (read-only) full-QA dump of one page frame, compact enough for the 20 KB return limit.
// Replace __ART__ (frame id), __MODE__ ('t' texts | 'b' boxes), __Y0__/__Y1__ (frame y range; split if the call errors).
// Texts: S = style table "family|style|size|lineHeight(null=auto)|letterSpacing px|case|deco|hex|alpha|align",
//        R = [text24, x, y, w, h, styleIdx]. Boxes: [name12, x, y, w, h, fill, stroke(hex/weight+align), radius, pad]
// (only boxes with a radius, a stroke, or a solid fill narrower than 1400; image-only fills skipped).
// Save each result to a JSON file and merge with qa-merge.py; compare with qa-full.mjs.
const art = await figma.getNodeByIdAsync('__ART__');
const MODE = '__MODE__', Y0 = __Y0__, Y1 = __Y1__;
const ax = art.absoluteTransform[0][2], ay = art.absoluteTransform[1][2];
const hex = (c) => [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const vis = (n) => { for (let p = n; p && p !== art.parent; p = p.parent) if (p.visible === false) return false; return true; };
const op = (n) => { let o = 1; for (let p = n; p && p !== art.parent; p = p.parent) if ('opacity' in p) o *= p.opacity; return o; };
const r0 = (v) => Math.round(v);
const paint = (arr) => (Array.isArray(arr) ? arr : []).filter((f) => f.visible !== false).map((f) => (f.type === 'SOLID' ? hex(f.color) + (f.opacity < 0.999 ? '@' + +f.opacity.toFixed(2) : '') : f.type === 'IMAGE' ? 'IMG' : f.type.startsWith('GRAD') ? 'GRAD' : f.type)).join('+');
const S = [], R = [], B = [];
const si = (k) => { let i = S.indexOf(k); if (i < 0) { S.push(k); i = S.length - 1; } return i; };
const types = MODE === 't' ? ['TEXT'] : ['FRAME', 'RECTANGLE', 'INSTANCE', 'BOOLEAN_OPERATION', 'ELLIPSE', 'COMPONENT'];
for (const n of art.findAllWithCriteria({ types })) {
  const b = n.absoluteBoundingBox; if (!b) continue;
  const x = r0(b.x - ax), y = r0(b.y - ay), w = r0(b.width), h = r0(b.height);
  if (y < Y0 || y >= Y1 || !vis(n)) continue;
  if (MODE === 't') {
    const segs = n.getStyledTextSegments(['fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'textCase', 'fills', 'textDecoration']);
    const s = segs.reduce((a, c) => (c.end - c.start > a.end - a.start ? c : a), segs[0]);
    const f = (s.fills || []).find((q) => q.visible !== false && q.type === 'SOLID');
    const lh = s.lineHeight.unit === 'PIXELS' ? +s.lineHeight.value.toFixed(1) : s.lineHeight.unit === 'PERCENT' ? +(s.lineHeight.value * s.fontSize / 100).toFixed(1) : null;
    const ls = s.letterSpacing.unit === 'PIXELS' ? +s.letterSpacing.value.toFixed(2) : +(s.letterSpacing.value * s.fontSize / 100).toFixed(2);
    const a = f ? +((f.opacity ?? 1) * op(n)).toFixed(2) : +op(n).toFixed(2);
    R.push([n.characters.replace(/\s+/g, ' ').trim().slice(0, 24), x, y, w, h, si([s.fontName.family, s.fontName.style, s.fontSize, lh, ls, s.textCase[0], s.textDecoration[0], f ? hex(f.color) : '', a, n.textAlignHorizontal[0]].join('|'))]);
  } else {
    if (w < 8 || h < 8) continue;
    const fill = paint(n.fills); const st = paint(n.strokes);
    const rad = n.type === 'ELLIPSE' ? 'E' : typeof n.cornerRadius === 'number' ? +n.cornerRadius.toFixed(1) : [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius].join('/');
    const solid = fill && !/IMG|GRAD/.test(fill) && w < 1400;
    if (!rad && !st && !solid) continue;
    B.push([n.name.slice(0, 12), x, y, w, h, fill, st ? st + '/' + (typeof n.strokeWeight === 'number' ? +n.strokeWeight.toFixed(1) : 'm') + (n.strokeAlign || 'C')[0] : '', rad,
      n.layoutMode && n.layoutMode !== 'NONE' ? [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft, n.itemSpacing].join('/') : '']);
  }
}
return MODE === 't' ? { f: '__ART__', y: [Y0, Y1], S, R } : { f: '__ART__', y: [Y0, Y1], B };
