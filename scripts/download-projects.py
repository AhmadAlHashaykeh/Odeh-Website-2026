"""Scrape Odeh Design selected projects and download optimized WebP assets."""
from __future__ import annotations

import json
import re
import ssl
import time
from io import BytesIO
from pathlib import Path
from urllib.parse import quote, unquote, urlparse, urlunparse
from urllib.request import Request, urlopen

SSL_CONTEXT = ssl._create_unverified_context()

from PIL import Image

BASE = "https://odeh-design.com"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "public" / "assets" / "projects"
CATEGORIES_DIR = ASSETS / "categories"
DATA_OUT = ROOT / "src" / "data" / "projectsContent.generated.json"

CATEGORY_DESCRIPTIONS = {
    "resorts-and-hotels": "Luxury hospitality structures engineered for complex geometries, long spans, and demanding site conditions across the region.",
    "private-villas": "Bespoke residential villas combining architectural ambition with precise structural detailing and refined material expression.",
    "residential-complexes": "Multi-unit residential developments delivered with coordinated structural systems and efficient, buildable solutions.",
    "commercial-complexes": "Commercial towers and mixed-use complexes designed for scale, performance, and urban context.",
    "institutional-cultural": "Institutional and cultural landmarks where structural clarity supports bold architectural identity.",
    "governmental": "Government buildings and civic infrastructure engineered for durability, safety, and long-term public use.",
    "hospitals-and-medical-clinics": "Healthcare facilities requiring rigorous structural coordination, vibration control, and flexible planning.",
    "mosques": "Sacred architecture supported by thoughtful structural design that honors form, light, and community gathering.",
    "fueling-and-car-charging-stations": "Specialized canopy and station structures optimized for rapid deployment and operational efficiency.",
    "restoration-conservation": "Heritage restoration and conservation projects balancing historical integrity with modern structural requirements.",
    "steel-structures": "Steel-framed structures and long-span systems engineered for strength, precision, and constructability.",
}


def slugify(value: str) -> str:
    value = unquote(value.replace("&amp;", " and "))
    value = value.lower().strip()
    value = re.sub(r"^[\d\-]+\-?", "", value)
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def fetch(url: str) -> str:
    req = Request(url, headers=HEADERS)
    with urlopen(req, timeout=45, context=SSL_CONTEXT) as response:
        return response.read().decode("utf-8", errors="replace")


def normalize_image_url(url: str) -> str:
    if url.startswith("//"):
        url = "https:" + url
    elif url.startswith("/"):
        url = BASE + url

    if url.startswith(f"{BASE}/storage/"):
        url = url.replace(f"{BASE}/storage/", f"{BASE}/public/storage/", 1)

    parsed = urlparse(url)
    encoded_path = quote(unquote(parsed.path), safe="/")
    return urlunparse(parsed._replace(path=encoded_path))


def download_webp(url: str, dest: Path, max_width: int) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        return True

    try:
        req = Request(normalize_image_url(url), headers=HEADERS)
        with urlopen(req, timeout=45, context=SSL_CONTEXT) as response:
            data = response.read()

        with Image.open(BytesIO(data)) as img:
            img = img.convert("RGB")
            if img.width > max_width:
                ratio = max_width / img.width
                img = img.resize((max_width, int(img.height * ratio)), Image.Resampling.LANCZOS)
            img.save(dest, "WEBP", quality=82, method=6)
        print(f"  saved {dest.relative_to(ROOT)} ({dest.stat().st_size // 1024} KB)")
        return True
    except Exception as err:
        print(f"  FAILED {dest.name}: {err}")
        return False


def parse_categories(html: str) -> list[dict]:
    pattern = re.compile(
        r'href="https://odeh-design\.com/projects/(\d+)"[^>]*>\s*'
        r'<div class="proImg"><img src="([^"]+)"[^>]*></div>\s*'
        r'<div class="catTitle">([^<]+)</div>',
        re.S,
    )
    categories = []
    for cat_id, image_url, title in pattern.findall(html):
        slug = slugify(title)
        categories.append(
            {
                "id": slug,
                "legacyId": cat_id,
                "slug": slug,
                "title": unquote(title.replace("&amp;", "&")),
                "coverImageUrl": image_url,
            }
        )
    return categories


def parse_category_projects(html: str) -> list[dict]:
    pattern = re.compile(
        r'<div class="proImg"><img src="([^"]+)"[^>]*></div>\s*'
        r'<div class="disc">\s*<h2>([^<]+)</h2>\s*<span>([^<]*)</span>\s*'
        r'<a href="https://odeh-design\.com/show-project/(\d+)"',
        re.S,
    )
    projects = []
    for cover_url, title, description, legacy_id in pattern.findall(html):
        title = unquote(title.replace("&amp;", "&"))
        slug = slugify(title)
        projects.append(
            {
                "legacyId": legacy_id,
                "slug": slug,
                "title": title,
                "description": unquote(description.replace("&amp;", "&")).strip(),
                "coverImageUrl": cover_url,
            }
        )
    return projects


def parse_project_detail(html: str) -> dict:
    location_match = re.search(
        r'<img class="location"[^>]*alt="">([^<]+)</span>',
        html,
        re.S,
    )
    location = location_match.group(1).strip() if location_match else ""

    gallery_urls = re.findall(
        r'<div class="swiper-slide">\s*<img src="([^"]+)"',
        html,
    )
    if not gallery_urls:
        hero_match = re.search(r'<div class="img-con">\s*<img src="([^"]+)"', html)
        if hero_match:
            gallery_urls = [hero_match.group(1)]

    desc_match = re.search(r'<p class="before[^"]*">([^<]+)</p>', html)
    description = desc_match.group(1).strip() if desc_match else ""

    data_blocks = re.findall(r'<div class="data[^"]*">(.*?)</div>', html, re.S)

    def clean_text(raw: str) -> str:
        text = re.sub(r"<[^>]+>", "", raw)
        return unquote(text.replace("&amp;", "&")).strip()

    fields: dict[str, str] = {}
    for block in data_blocks:
        label_match = re.search(r'<span class="m">([^:<]+)', block, re.I)
        if not label_match:
            continue
        label = label_match.group(1).strip().lower()
        if label.startswith("area"):
            area_match = re.search(r"area\s*:\s*([\d,]+)", block, re.I)
            fields["area"] = f"{area_match.group(1).replace(',', '')} m²" if area_match else ""
            continue
        if "</span>" in block:
            value = clean_text(block.split("</span>", 1)[1])
        else:
            value = clean_text(block)
        fields[label] = value

    return {
        "location": location,
        "description": description,
        "galleryUrls": gallery_urls,
        "type": fields.get("type", "").title(),
        "area": fields.get("area", ""),
        "status": fields.get("status", ""),
        "services": fields.get("services", ""),
    }


def main() -> None:
    print("Fetching categories...")
    categories_html = fetch(f"{BASE}/selected-projects")
    categories = parse_categories(categories_html)
    print(f"Found {len(categories)} categories")

    all_projects: list[dict] = []

    for category in categories:
        slug = category["slug"]
        print(f"\nCategory: {category['title']} ({slug})")

        cover_dest = CATEGORIES_DIR / f"{slug}.webp"
        download_webp(category["coverImageUrl"], cover_dest, 1600)
        category["coverImage"] = f"/assets/projects/categories/{slug}.webp"
        category["description"] = CATEGORY_DESCRIPTIONS.get(
            slug,
            f"A curated selection of {category['title'].lower()} delivered by ODEH & PARTNERS DESIGN.",
        )

        cat_html = fetch(f"{BASE}/projects/{category['legacyId']}")
        projects = parse_category_projects(cat_html)
        print(f"  {len(projects)} projects")

        for project in projects:
            project_slug = project["slug"]
            project_dir = ASSETS / project_slug
            print(f"  Project: {project['title']}")

            detail_html = fetch(f"{BASE}/show-project/{project['legacyId']}")
            detail = parse_project_detail(detail_html)
            time.sleep(0.15)

            if detail["description"]:
                project["description"] = detail["description"]

            cover_dest = project_dir / "cover.webp"
            download_webp(project["coverImageUrl"], cover_dest, 1400)

            gallery = []
            for index, url in enumerate(detail["galleryUrls"], start=1):
                gallery_dest = project_dir / f"gallery-{index:02d}.webp"
                if download_webp(url, gallery_dest, 1920):
                    gallery.append(
                        {
                            "src": f"/assets/projects/{project_slug}/gallery-{index:02d}.webp",
                            "alt": f"{project['title']} — image {index}",
                        }
                    )

            if not gallery and cover_dest.exists():
                gallery = [
                    {
                        "src": f"/assets/projects/{project_slug}/cover.webp",
                        "alt": project["title"],
                    }
                ]

            record = {
                "id": project_slug,
                "slug": project_slug,
                "categorySlug": slug,
                "title": project["title"],
                "description": project["description"],
                "coverImage": f"/assets/projects/{project_slug}/cover.webp",
                "gallery": gallery,
                "location": detail["location"],
                "type": detail["type"],
                "area": detail["area"],
                "status": detail["status"],
                "services": detail["services"],
            }
            all_projects.append(record)

        category["projectCount"] = len(projects)
        del category["legacyId"]
        del category["coverImageUrl"]

    payload = {"categories": categories, "projects": all_projects}
    DATA_OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {DATA_OUT.relative_to(ROOT)}")
    print(f"Total projects: {len(all_projects)}")


if __name__ == "__main__":
    main()
