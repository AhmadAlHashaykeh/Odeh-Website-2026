"""Download team member photos from odeh-design.com and convert to WebP."""
import re
import ssl
from io import BytesIO
from pathlib import Path
from urllib.parse import quote, urljoin, unquote
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "assets" / "about" / "team"
OUT_DIR.mkdir(parents=True, exist_ok=True)

TEAM_URL = "https://www.odeh-design.com/team"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
HERO_URL = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85"

MEMBERS = [
    ("mohammad-odeh", "Mohammad Odeh"),
    ("mohammad-al-najjar", "Mohammad Al-Najjar, M.Sc."),
    ("yazan-abu-al-hayja", "Yazan Abu Al-Hayja"),
    ("basel-abu-asal", "Basel Abu Asal"),
    ("khalid-dawodi", "Khalid Dawodi"),
    ("mahmoud-saleh", "Mahmoud Saleh"),
    ("mazin-hijazi", "Mazin Hijazi"),
    ("yazan-abu-alia", "Yazan Abu Alia"),
    ("tarek-ammouri", "Tarek Ammouri, M.Sc."),
    ("abdullah-odat", "Abdullah Odat, M.Sc."),
    ("abdulrahman-jadallah", "Abdulrahman Jadallah"),
    ("malek-al-attar", "Malek Al Attar"),
    ("zaid-al-nwerat", "Zaid Al Nwerat"),
    ("mohammed-al-yousef", "Mohammed Al Yousef"),
    ("mohammed-al-faqi", "Mohammed Al Faqi"),
    ("mohammad-bani-ahmad", "Mohammad Bani Ahmad"),
    ("ahmad-mustafa", "Ahmad Mustafa"),
    ("mohammad-kuzmar", "Mohammad Kuzmar"),
    ("hamzeh-sawalmeh", "Hamzeh Sawalmeh"),
    ("mohammad-yaghi", "Mohammad Yaghi"),
    ("ashraf", "Ashraf"),
]


def ssl_context():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx


def fetch(url: str) -> bytes:
    safe = quote(unquote(url), safe=":/?&=%#")
    req = Request(safe, headers=HEADERS)
    with urlopen(req, context=ssl_context(), timeout=30) as response:
        data = response.read()
    if len(data) < 500:
        raise ValueError(f"Response too small ({len(data)} bytes)")
    return data


def save_webp(img: Image.Image, path: Path, max_width: int = 800) -> None:
    img = img.convert("RGB")
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, int(img.height * ratio)), Image.Resampling.LANCZOS)
    img.save(path, "WEBP", quality=82, method=6)
    print(f"Saved {path.name}: {path.stat().st_size // 1024} KB, {img.size}")


def initials(name: str) -> str:
    parts = [p for p in name.replace(",", "").split() if p and p[0].isalpha()]
    if len(parts) <= 1:
        return (parts[0][:2] if parts else "OP").upper()
    return (parts[0][0] + parts[1][0]).upper()


def create_placeholder(name: str, path: Path) -> None:
    size = (800, 1000)
    img = Image.new("RGB", size)
    draw = ImageDraw.Draw(img)
    for y in range(size[1]):
        t = y / size[1]
        draw.line([(0, y), (size[0], y)], fill=(int(31 + 8 * t), int(31 + 12 * t), int(31 + 18 * t)))
    draw.rectangle([0, size[1] - 6, size[0], size[1]], fill=(0, 138, 166))
    try:
        font = ImageFont.truetype("arial.ttf", 120)
    except OSError:
        font = ImageFont.load_default()
    text = initials(name)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((size[0] - tw) / 2, (size[1] - th) / 2 - 20), text, fill=(255, 255, 255), font=font)
    save_webp(img, path)


def extract_user_images(html: str) -> list[str]:
    pattern = r'/public/storage/images/users/[^"\']+\.(?:jpg|jpeg|png|webp)'
    matches = re.findall(pattern, html, re.I)
    ordered = []
    seen = set()
    for match in matches:
        if match not in seen:
            seen.add(match)
            ordered.append(match)
    return ordered


def main():
    try:
        with Image.open(BytesIO(fetch(HERO_URL))) as img:
            save_webp(img, OUT_DIR / "hero.webp", max_width=1600)
    except Exception as err:
        print(f"Hero failed: {err}")

    remote: list[str] = []
    try:
        html = fetch(TEAM_URL).decode("utf-8", errors="ignore")
        remote = extract_user_images(html)
        print(f"Found {len(remote)} user images")
        for url in remote:
            print(" ", url)
    except Exception as err:
        print(f"Team page failed: {err}")

    for i, (slug, name) in enumerate(MEMBERS):
        out = OUT_DIR / f"{slug}.webp"
        downloaded = False
        if i < len(remote):
            try:
                url = urljoin(TEAM_URL, remote[i])
                with Image.open(BytesIO(fetch(url))) as img:
                    save_webp(img, out, max_width=800)
                    downloaded = True
            except Exception as err:
                print(f"Remote failed {slug}: {err}")
        if not downloaded:
            create_placeholder(name, out)

    print("Done.")


if __name__ == "__main__":
    main()
