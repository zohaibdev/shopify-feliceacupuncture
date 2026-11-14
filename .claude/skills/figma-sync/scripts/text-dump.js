// use_figma (read-only): every visible text layer of a page frame with its style, positions relative to the frame.
// Replace __ART__ with the frame id. The result is padded so the MCP saves it to a file instead of the chat
// (read it with node from the tool-results path). Pair with qa-text.mjs.
const art = await figma.getNodeByIdAsync('__ART__');
const ax = art.absoluteTransform[0][2], ay = art.absoluteTransform[1][2];
const hex = (c) => [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const vis = (n) => { for (let p = n; p && p !== art.parent; p = p.parent) if (p.visible === false) return false; return true; };
const op = (n) => { let o = 1; for (let p = n; p && p !== art.parent; p = p.parent) if ('opacity' in p) o *= p.opacity; return +o.toFixed(3); };
const out = [];
for (const n of art.findAll((x) => x.type === 'TEXT')) {
  if (!vis(n)) continue;
  const b = n.absoluteBoundingBox; if (!b) continue;
  const segs = n.getStyledTextSegments(['fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'textCase', 'fills', 'textDecoration']);
  const s = segs.reduce((a, c) => (c.end - c.start > a.end - a.start ? c : a), segs[0]);
  const f = (s.fills || []).find((x) => x.visible !== false && x.type === 'SOLID');
  out.push({
    id: n.id, t: n.characters.replace(/\s+/g, ' ').trim().slice(0, 140),
    x: +(b.x - ax).toFixed(1), y: +(b.y - ay).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1),
    fam: s.fontName.family, sty: s.fontName.style, fs: s.fontSize,
    lh: s.lineHeight.unit === 'PIXELS' ? +s.lineHeight.value.toFixed(2) : s.lineHeight.unit === 'PERCENT' ? +(s.lineHeight.value * s.fontSize / 100).toFixed(2) : null,
    ls: s.letterSpacing.unit === 'PIXELS' ? +s.letterSpacing.value.toFixed(2) : +(s.letterSpacing.value * s.fontSize / 100).toFixed(2),
    tc: s.textCase, deco: s.textDecoration, col: f ? hex(f.color) : null, fo: f ? +(f.opacity ?? 1).toFixed(2) : 1, op: op(n),
    al: n.textAlignHorizontal, mixed: segs.length > 1,
  });
}
return { frame: '__ART__', w: art.width, h: art.height, texts: out, pad: 'x'.repeat(120000) };
