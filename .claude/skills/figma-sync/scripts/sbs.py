"""Side-by-side old|new crops: sbs.py old.png new.png outdir name:newY0:newY1:offset[:scale] ..."""
import sys, os
from PIL import Image

old = Image.open(sys.argv[1]).convert('RGB')
new = Image.open(sys.argv[2]).convert('RGB')
out = sys.argv[3]
os.makedirs(out, exist_ok=True)
for spec in sys.argv[4:]:
    p = spec.split(':')
    name, y0, y1, off = p[0], int(p[1]), int(p[2]), int(p[3])
    s = float(p[4]) if len(p) > 4 else 0.5
    x0 = int(p[5]) if len(p) > 5 else 0
    x1 = int(p[6]) if len(p) > 6 else 1440
    a = old.crop((x0, y0 - off, x1, y1 - off))
    b = new.crop((x0, y0, x1, y1))
    w, h = int((x1 - x0) * s), int((y1 - y0) * s)
    c = Image.new('RGB', (w * 2 + 8, h), (255, 0, 255))
    c.paste(a.resize((w, h), Image.LANCZOS), (0, 0))
    c.paste(b.resize((w, h), Image.LANCZOS), (w + 8, 0))
    c.save(os.path.join(out, name + '.jpg'), quality=85)
    print(name, c.size)
