import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outputDir = join(root, 'public', 'assets', 'about', 'overview-slider');

const SOURCES = ['img-1', 'img-2', 'img-3'];

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
    max_w = 1600
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, int(img.height * ratio)), Image.Resampling.LANCZOS)
    img.save(out, 'WEBP', quality=82, method=6)
print(f'{out.name}: {out.stat().st_size} bytes')
`,
    ],
    { stdio: 'inherit' }
  );
}

function main() {
  mkdirSync(outputDir, { recursive: true });

  for (const name of SOURCES) {
    const jpgPath = join(root, `${name}.jpg`);
    const webpPath = join(outputDir, `${name}.webp`);

    if (!existsSync(jpgPath)) {
      throw new Error(`Missing source image: ${jpgPath}`);
    }

    convertJpgToWebp(jpgPath, webpPath);
    console.log(`OK ${webpPath}`);
  }

  console.log('Overview slider images ready.');
}

main();
