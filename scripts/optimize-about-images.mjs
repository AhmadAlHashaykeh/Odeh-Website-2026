import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const aboutDir = join(root, 'public', 'assets', 'about');

const SOURCE_URLS = [
  {
    name: 'office-01',
    url: 'https://scontent.famm2-3.fna.fbcdn.net/v/t39.30808-6/641628187_902035545907896_5960760213337468813_n.jpg',
  },
  {
    name: 'office-02',
    url: 'https://scontent.famm9-1.fna.fbcdn.net/v/t39.30808-6/641613196_902035512574566_5389609624572387024_n.jpg',
  },
  {
    name: 'office-03',
    url: 'https://scontent.fadj1-1.fna.fbcdn.net/v/t39.30808-6/643519859_902035472574570_8332421690233564615_n.jpg',
  },
  {
    name: 'office-04',
    url: 'https://scontent.fadj1-1.fna.fbcdn.net/v/t39.30808-6/643402219_902035449241239_3689198739640995906_n.jpg',
  },
];

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Referer: 'https://www.facebook.com/',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error(`Response too small (${buf.length} bytes)`);
  return buf;
}

function convertJpgToWebp(jpgPath, webpPath) {
  execFileSync(
    'python',
    [
      '-c',
      `
from PIL import Image
from pathlib import Path
src = Path(r'${jpgPath.replace(/\\/g, '\\\\')}')
out = Path(r'${webpPath.replace(/\\/g, '\\\\')}')
with Image.open(src) as img:
    img = img.convert('RGB')
    max_w = 1400
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, int(img.height * ratio)), Image.Resampling.LANCZOS)
    img.save(out, 'WEBP', quality=82, method=6)
print(out.stat().st_size)
`,
    ],
    { stdio: 'inherit' }
  );
}

function createFallbackCrops() {
  const scriptPath = join(aboutDir, '_fallback_crops.py');
  writeFileSync(
    scriptPath,
    `
from PIL import Image
from pathlib import Path

about = Path(r'${aboutDir.replace(/\\/g, '\\\\')}')
fallback = about / 'odeh-about-office.webp'
crops = [
    (0.00, 0.00, 0.55, 0.65),
    (0.35, 0.08, 0.60, 0.55),
    (0.05, 0.25, 0.70, 0.50),
    (0.20, 0.10, 0.65, 0.75),
]

with Image.open(fallback) as img:
    w, h = img.size
    for i, (lx, ty, cw, ch) in enumerate(crops, start=1):
        left = int(w * lx)
        top = int(h * ty)
        right = min(left + int(w * cw), w)
        bottom = min(top + int(h * ch), h)
        cropped = img.crop((left, top, right, bottom))
        max_w = 1400
        if cropped.width > max_w:
            ratio = max_w / cropped.width
            cropped = cropped.resize((max_w, int(cropped.height * ratio)), Image.Resampling.LANCZOS)
        cropped.save(about / f'office-0{i}.webp', 'WEBP', quality=82, method=6)
        print(f'Created office-0{i}.webp')
`
  );
  execFileSync('python', [scriptPath], { stdio: 'inherit' });
  unlinkSync(scriptPath);
}

async function main() {
  mkdirSync(aboutDir, { recursive: true });
  let downloaded = 0;

  for (const { name, url } of SOURCE_URLS) {
    const jpgPath = join(aboutDir, `${name}.jpg`);
    const webpPath = join(aboutDir, `${name}.webp`);
    try {
      const buf = await downloadImage(url);
      writeFileSync(jpgPath, buf);
      convertJpgToWebp(jpgPath, webpPath);
      unlinkSync(jpgPath);
      downloaded += 1;
      console.log(`OK ${name}.webp`);
    } catch (err) {
      console.warn(`Skip ${name}: ${err.message}`);
      if (existsSync(jpgPath)) unlinkSync(jpgPath);
    }
  }

  if (downloaded < 4) {
    const fallback = join(aboutDir, 'odeh-about-office.webp');
    if (!existsSync(fallback)) {
      throw new Error('No fallback image at public/assets/about/odeh-about-office.webp');
    }
    console.log(`Using fallback crops (${downloaded}/4 URLs worked)`);
    createFallbackCrops();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
