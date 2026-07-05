"""Download architecture office images and convert to optimized WebP."""
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "assets" / "about" / "overview"
OUT_DIR.mkdir(parents=True, exist_ok=True)

IMAGES = [
    ("hero", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=85", 1600),
    ("intro-main", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=85", 1200),
    ("intro-a", "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=85", 700),
    ("intro-b", "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=85", 700),
    ("office-01", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=85", 1000),
    ("office-02", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85", 1000),
    ("office-03", "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=85", 1000),
    ("office-04", "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=85", 1000),
    ("office-05", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85", 1000),
    ("office-06", "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=85", 1000),
    ("cta-bg", "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=85", 1600),
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
