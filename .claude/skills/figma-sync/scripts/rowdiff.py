"""Row-aligned diff of two full-page renders: prints matching / changed y ranges (old -> new)."""
import sys, difflib
import numpy as np
from PIL import Image

a = np.asarray(Image.open(sys.argv[1]).convert('L'), dtype=np.int16)
b = np.asarray(Image.open(sys.argv[2]).convert('L'), dtype=np.int16)
print('old', a.shape, 'new', b.shape)

def sig(img):
    # 1440 -> 90 columns of 16px, quantised coarsely so tiny AA noise still matches
    h, w = img.shape
    m = img[:, : w // 16 * 16].reshape(h, -1, 16).mean(axis=2)
    return [bytes((r // 6).astype(np.uint8)) for r in m]

sa, sb = sig(a), sig(b)
sm = difflib.SequenceMatcher(None, sa, sb, autojunk=False)

print('--- summary: equal runs >= 20 rows (offset = new - old) ---')
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal' and i2 - i1 >= 20:
        print(f'old {i1:6}-{i2:6}  new {j1:6}-{j2:6}  offset {j1-i1:+5}')
