"""Generate a neutral unknown-person placeholder for team cards."""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public" / "assets" / "about" / "team" / "placeholder.webp"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 400, 480
img = Image.new("RGB", (W, H), (38, 38, 38))
draw = ImageDraw.Draw(img)

# Soft vignette
for y in range(H):
    t = y / H
    shade = int(34 + 10 * t)
    draw.line([(0, y), (W, y)], fill=(shade, shade, shade + 2))

cx, cy = W // 2, H // 2 - 10
head_r = 52
draw.ellipse(
    (cx - head_r, cy - head_r - 40, cx + head_r, cy + head_r - 40),
    fill=(72, 72, 74),
)
draw.ellipse(
    (cx - 88, cy + 20, cx + 88, cy + 200),
    fill=(72, 72, 74),
)

img.save(OUT, "WEBP", quality=82, method=6)
print(f"Created {OUT} ({OUT.stat().st_size // 1024} KB)")
