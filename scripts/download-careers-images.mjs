import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const careersDir = join(root, 'public', 'assets', 'careers');

const SOURCE_URLS = [
  {
    name: 'hero',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
  },
];

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
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
img = Image.open(r"${jpgPath.replace(/\\/g, '\\\\')}")
img.save(r"${webpPath.replace(/\\/g, '\\\\')}", 'WEBP', quality=82, method=6)
print('Saved', r"${webpPath.replace(/\\/g, '\\\\')}")
`.trim(),
    ],
    { stdio: 'inherit' },
  );
}

async function main() {
  mkdirSync(careersDir, { recursive: true });

  for (const { name, url } of SOURCE_URLS) {
    const jpgPath = join(careersDir, `${name}.jpg`);
    const webpPath = join(careersDir, `${name}.webp`);

    console.log(`Downloading ${name}...`);
    const buffer = await downloadImage(url);
    writeFileSync(jpgPath, buffer);

    console.log(`Converting ${name} to WebP...`);
    convertJpgToWebp(jpgPath, webpPath);

    if (existsSync(jpgPath)) {
      unlinkSync(jpgPath);
    }

    console.log(`Done: ${webpPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
