# Contact sheet of one or more post folders, for checking slides at a glance.
# usage: python3 runner/sheet.py out.jpg media/2026-11-02/01-dinners/ media/2026-11-02/02-gift-guides/
import sys, glob, os
from PIL import Image, ImageDraw

out, folders = sys.argv[1], sys.argv[2:]
W, H, G = 240, 427, 8
rows = [sorted(glob.glob(os.path.join(f, '[0-9][0-9].jpg'))) for f in folders]
rows = [r for r in rows if r]
cols = max(len(r) for r in rows)
sheet = Image.new('RGB', (G + cols * (W + G), G + len(rows) * (H + 26 + G)), (28, 28, 28))
d = ImageDraw.Draw(sheet)
for y, r in enumerate(rows):
    top = G + y * (H + 26 + G)
    d.text((G, top), os.path.basename(os.path.dirname(r[0])), fill=(255, 255, 255))
    for x, f in enumerate(r):
        sheet.paste(Image.open(f).convert('RGB').resize((W, H)), (G + x * (W + G), top + 20))
sheet.save(out, quality=82)
print(out)
