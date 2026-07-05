"""Download architecture/engineering images for Approach page and convert to WebP."""
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "assets" / "about" / "approach"
OUT_DIR.mkdir(parents=True, exist_ok=True)

IMAGES = [
    (
        "hero",
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=85",
        1600,
    ),
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}


def download_and_convert(name: str, url: str, max_width: int) -> None:
    req = Request(url, headers=HEADERS)
    with urlopen(req, timeout=30) as response:
        data = response.read()

    with Image.open(BytesIO(data)) as img:
        img = img.convert("RGB")
        if img.width > max_width:
            ratio = max_width / img.width
            img = img.resize((max_width, int(img.height * ratio)), Image.Resampling.LANCZOS)
        out = OUT_DIR / f"{name}.webp"
        img.save(out, "WEBP", quality=82, method=6)
        print(f"{out.name}: {out.stat().st_size // 1024} KB, {img.size}")


if __name__ == "__main__":
    for name, url, max_w in IMAGES:
        try:
            download_and_convert(name, url, max_w)
        except Exception as err:
            print(f"FAILED {name}: {err}")
    print("Done.")
