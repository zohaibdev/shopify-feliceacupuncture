"""Local Figma-vs-DOM text style comparison: python cmp.py <fig.json> <dom.json> [scale_y]
Figma rows: [key18, y, h, styleIdx]; style "fam|style|size|lh|ls|case|deco|hex|alpha".
DOM texts (dom-extract.mjs): [key24, x, y, w, h, family, weight, size, lh, ls, transform, 'r,g,b,a', opacity, underline]."""
import json, sys, collections
fig = json.load(open(sys.argv[1], encoding='utf-8'))
dom = json.load(open(sys.argv[2], encoding='utf-8'))
FAM = {'Marisa': ('Marisa', 'Tenor Sans'), 'Libre ': ('Libre Caslon Condensed', 'Libre Caslon Text')}
by = collections.defaultdict(list)
for d in dom['texts']:
    by[d[0][:18]].append(d)
issues = collections.defaultdict(list)
miss = []
for key, fy, fh, si in fig['R']:
    fam, sty, size, lh, ls, case, deco, hexc, a = fig['S'][si].split('|')
    cands = by.get(key)
    if not cands:
        miss.append(f'{key}@{fy}')
        continue
    d = min(cands, key=lambda c: abs(c[2] - fy))
    _, x, y, w, h, dfam, dw, dsize, dlh, dls, dtt, dcol, dop, du = d
    where = f'"{key}"@{fy}'
    tag = f'{fam.strip()} {sty} {size}'
    size, ls = float(size), float(ls)
    if not any(dfam.startswith(f) for f in FAM[fam]):
        issues[f'family {fam.strip()}→{dfam}'].append(where)
    want_w = 700 if sty == 'Bold' else 500
    if dw != want_w:
        issues[f'weight {tag}: {want_w}→{dw}'].append(where)
    if abs(size - dsize) > 0.5:
        issues[f'size {tag}: {size}→{dsize}'].append(where)
    if abs(ls - dls) > 0.3:
        issues[f'letter-spacing {tag}: {ls}→{dls}'].append(where)
    if lh and dlh and h > float(lh) * 1.6 and abs(float(lh) - dlh) > 1:
        issues[f'line-height {tag}: {lh}→{dlh}'].append(where)
    fc = [int(hexc[i:i + 2], 16) for i in (0, 2, 4)]
    dc = [float(v) for v in dcol.split(',')]
    if sum(abs(fc[i] - dc[i]) for i in range(3)) > 18:
        issues[f'color {tag}: #{hexc}→rgb({",".join(str(int(v)) for v in dc[:3])})'].append(where)
    da = (dc[3] if len(dc) > 3 else 1) * dop
    if abs(float(a) - da) > 0.08:
        issues[f'opacity {tag}: {a}→{round(da, 2)}'].append(where)
    if (deco == 'U') != bool(du):
        issues[f'underline {tag}: {deco == "U"}→{bool(du)}'].append(where)
for k, v in sorted(issues.items(), key=lambda kv: -len(kv[1])):
    print(f'{k}  ×{len(v)}: {" | ".join(v[:4])}')
print('not found in DOM:', miss[:20])
