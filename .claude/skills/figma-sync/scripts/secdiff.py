"""Per-section pixel diff: secdiff.py old.png new.png name:y0:y1:off ... — new bands vs the old render at a given offset; prints changed row ranges."""
import sys
import numpy as np
from PIL import Image

old = np.asarray(Image.open(sys.argv[1]).convert('RGB'), dtype=np.int16)
new = np.asarray(Image.open(sys.argv[2]).convert('RGB'), dtype=np.int16)
# (name, new_y0, new_y1, offset new-old)
bands = []  # pass bands as args: name:newY0:newY1:offset  (offset = new y - old y)
extra = sys.argv[3:]
for e in extra:
    n, a, b, o = e.split(':'); bands.append((n, int(a), int(b), int(o)))

for name, y0, y1, off in bands:
    o0, o1 = y0 - off, y1 - off
    if o0 < 0 or o1 > old.shape[0]:
        print(name, 'out of range'); continue
    d = np.abs(new[y0:y1] - old[o0:o1]).mean(axis=2)  # h x w
    rowmean = d.mean(axis=1)
    bad = rowmean > 2.0
    frac = bad.mean()
    # group bad rows into ranges (merge gaps < 8)
    ranges, start, last = [], None, None
    for y, v in enumerate(bad):
        if v:
            if start is None: start = y
            elif y - last > 8: ranges.append((start, last)); start = y
            last = y
    if start is not None: ranges.append((start, last))
    cols = (d > 30).any(axis=0).nonzero()[0]
    xr = f'x {cols.min()}-{cols.max()}' if len(cols) else ''
    print(f'{name:13} new {y0}-{y1} off {off:+}  mean {d.mean():5.2f}  changed rows {frac*100:5.1f}%  {xr}')
    for a, b in ranges[:12]:
        print(f'      rows new {y0+a}-{y0+b}  (rel {a}-{b})  peak {rowmean[a:b+1].max():.1f}')
