/**
 * Lightweight Node checks for media URL helpers (no Vitest in package.json).
 * Run: node --experimental-vm-modules scripts/check-media-url.mjs
 *
 * Mirrors the core absolutize / resolve rules from src/utils/mediaUrl.ts.
 */

function getApiOrigin(baseUrl) {
  if (typeof baseUrl !== 'string' || baseUrl.trim() === '') return '';
  try {
    return new URL(baseUrl).origin;
  } catch {
    return '';
  }
}

function absolutizeMediaUrl(url, baseUrl) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed === '') return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) || trimmed.startsWith('//')) return trimmed;
  if (trimmed.startsWith('/storage/')) {
    const origin = getApiOrigin(baseUrl);
    return origin ? `${origin}${trimmed}` : trimmed;
  }
  return trimmed;
}

function resolveMediaUrl(value, baseUrl) {
  if (!value) return '';
  if (typeof value === 'string') return absolutizeMediaUrl(value, baseUrl);
  if (typeof value.url === 'string' && value.url.trim() !== '') {
    return absolutizeMediaUrl(value.url, baseUrl);
  }
  if (typeof value.path === 'string' && value.path.trim() !== '') {
    return absolutizeMediaUrl(value.path, baseUrl);
  }
  if (typeof value.src === 'string' && value.src.trim() !== '') {
    return absolutizeMediaUrl(value.src, baseUrl);
  }
  return '';
}

const base = 'http://127.0.0.1:8000/api';
const cases = [
  ['absolute unchanged', resolveMediaUrl('https://cdn.example.com/a.webp', base), 'https://cdn.example.com/a.webp'],
  ['storage relative', resolveMediaUrl('/storage/uploads/x.webp', base), 'http://127.0.0.1:8000/storage/uploads/x.webp'],
  ['storage object url', resolveMediaUrl({ path: '/storage/x.webp', url: 'http://127.0.0.1:8000/storage/x.webp' }, base), 'http://127.0.0.1:8000/storage/x.webp'],
  ['frontend asset relative', resolveMediaUrl('/odeh-logo2.png', base), '/odeh-logo2.png'],
  ['empty', resolveMediaUrl(null, base), ''],
  ['storage without env', resolveMediaUrl('/storage/x.webp', ''), '/storage/x.webp'],
];

let failed = 0;
for (const [name, actual, expected] of cases) {
  if (actual !== expected) {
    console.error(`FAIL ${name}: got ${JSON.stringify(actual)} expected ${JSON.stringify(expected)}`);
    failed += 1;
  } else {
    console.log(`PASS ${name}`);
  }
}

if (failed > 0) {
  process.exit(1);
}

console.log(`All ${cases.length} media URL checks passed.`);
