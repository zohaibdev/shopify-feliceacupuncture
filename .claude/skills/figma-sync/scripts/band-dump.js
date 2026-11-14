// Band dump (use_figma, read-only). Replace __ART__ (artboard node id), __Y0__/__Y1__ (artboard y range). Positions are
// relative to the ARTBOARD. Row formats: see the _fmt fields. If the response is truncated (20 KB), split the range.
const ID = "__ART__"; const Y0 = __Y0__, Y1 = __Y1__;
const art = await figma.getNodeByIdAsync(ID);
const ax = art.absoluteTransform[0][2], ay = art.absoluteTransform[1][2];
const styles = []; const sidx = (s) => { let i = styles.indexOf(s); if (i < 0) { styles.push(s); i = styles.length - 1; } return i; };
const hex = (c) => [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const fillStr = (fills) => (Array.isArray(fills) ? fills : []).filter((f) => f.visible !== false).map((f) => {
  const o = f.opacity ?? 1; let s = f.type === 'SOLID' ? hex(f.color) : f.type === 'IMAGE' ? 'IMG' : f.type.startsWith('GRADIENT') ? 'GRAD' : f.type;
  if (o < 0.999) s += '@' + +o.toFixed(2); return s; }).join('+');
const visible = (n) => { for (let p = n; p && p !== art.parent; p = p.parent) if (p.visible === false) return false; return true; };
const effOp = (n) => { let o = 1; for (let p = n; p && p !== art.parent; p = p.parent) if ('opacity' in p) o *= p.opacity; return +o.toFixed(3); };
const r1 = (v) => +(+v).toFixed(1);
const t = [], b = [], full = {};
const nodes = [art, ...art.findAll(() => true)];
for (const n of nodes) {
  if (!visible(n)) continue;
  const bb = n.absoluteBoundingBox; if (!bb) continue;
  const x = r1(bb.x - ax), y = r1(bb.y - ay), w = r1(bb.width), h = r1(bb.height);
  if (y + h < Y0 || y > Y1) continue; // only nodes intersecting the band (artboard y)
  const id = n.id.includes(';') ? n.id : n.id.split(':')[1];
  if (n.type === 'TEXT') {
    const segs = n.getStyledTextSegments(['fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'textCase', 'fills', 'textDecoration']);
    const st = segs.map((s) => {
      const fam = s.fontName.family === 'Libre Caslon Condensed' ? 'LCC' : s.fontName.family;
      const lh = s.lineHeight.unit === 'PIXELS' ? +s.lineHeight.value.toFixed(2) : s.lineHeight.unit === 'PERCENT' ? +(s.lineHeight.value * s.fontSize / 100).toFixed(2) : 'A';
      const ls = s.letterSpacing.unit === 'PIXELS' ? +s.letterSpacing.value.toFixed(2) : +(s.letterSpacing.value * s.fontSize / 100).toFixed(2);
      const tc = s.textCase === 'ORIGINAL' ? '' : s.textCase; const deco = s.textDecoration === 'NONE' ? '' : s.textDecoration;
      return { i: sidx([fam, s.fontName.style, s.fontSize, lh, ls, tc, fillStr(s.fills), deco].join('|')), n: s.end - s.start };
    });
    const stS = st.length === 1 ? String(st[0].i) : st.map((s) => s.i + ':' + s.n).join(',');
    const txt = n.characters.replace(/\s+/g, ' ').trim();
    t.push([id, txt.slice(0, 34), x, y, w, h, effOp(n), n.textAutoResize[0] + n.textAlignHorizontal[0], stS]);
    full[id] = n.characters;
    continue;
  }
  if (!['FRAME', 'RECTANGLE', 'BOOLEAN_OPERATION', 'INSTANCE', 'ELLIPSE', 'COMPONENT'].includes(n.type)) continue;
  const fills = fillStr(n.fills);
  if (n.name === 'Bounding box' && fills === 'd9d9d9') continue;
  const strokes = (Array.isArray(n.strokes) ? n.strokes : []).filter((s) => s.visible !== false);
  const stroke = strokes.length ? fillStr(strokes) + '/' + (typeof n.strokeWeight === 'number' ? +n.strokeWeight.toFixed(2) : 'mixed') + (n.strokeAlign || 'C')[0] : '';
  const rad = typeof n.cornerRadius === 'number' ? n.cornerRadius : (n.topLeftRadius ?? 0);
  const al = n.layoutMode && n.layoutMode !== 'NONE' ? `AL:${n.layoutMode[0]}/${n.paddingTop}/${n.paddingRight}/${n.paddingBottom}/${n.paddingLeft}/${n.itemSpacing}` : null;
  if (!fills && !stroke && !rad && !al && n !== art) continue;
  const row = [id, n.type.slice(0, 2), n.name.slice(0, 14), x, y, w, h, effOp(n), fills, stroke, rad];
  if (n.blendMode && !['NORMAL', 'PASS_THROUGH'].includes(n.blendMode)) row.push('bm:' + n.blendMode);
  if (al) row.push(al);
  b.push(row);
}
return { texts: { _fmt: 'use_figma dump (v4 ' + ID + '); same format as 414-255.texts.json, ids after the colon unless nested instance ids', styles, t, full }, boxes: { _fmt: 'use_figma dump (v4 ' + ID + '); same format as 414-255.boxes.json', b } };
