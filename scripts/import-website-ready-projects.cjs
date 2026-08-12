/**
 * Import approved website-ready project content into this repo.
 *
 * - Replaces projects_content.json
 * - Copies only selected images into public/assets/projects
 * - Picks highest-quality variant that stays under MAX_BYTES (skips thumb/480/960)
 */
const fs = require('fs');
const path = require('path');

const SOURCE_ROOT = String.raw`d:\Ahmad\ODEH 2026\ODEH Social Media\WEBSITE\REV. 01\website-ready`;
const SOURCE_JSON = path.join(SOURCE_ROOT, 'data', 'projects.json');
const SOURCE_PROJECTS = path.join(SOURCE_ROOT, 'projects');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_JSON = path.join(REPO_ROOT, 'backend', 'database', 'seeders', 'data', 'projects_content.json');
const OUT_ASSETS = path.join(REPO_ROOT, 'public', 'assets', 'projects');

const MAX_BYTES = 400 * 1024; // prefer highest quality under ~400KB
const SMALL_WIDTHS = new Set([0, 480]); // ignore thumbs + tiny 480
const FALLBACK_WIDTHS = new Set([960]); // only if no larger variant exists

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function parseWidthFromName(fileName) {
  const base = path.basename(fileName, path.extname(fileName));
  if (base.endsWith('-thumb') || base === 'thumb') return 0;
  const match = base.match(/-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function listVariants(projectDir, imageId) {
  if (!fs.existsSync(projectDir)) return [];

  return fs
    .readdirSync(projectDir)
    .filter((name) => name.startsWith(`${imageId}-`) && name.endsWith('.webp'))
    .map((name) => {
      const full = path.join(projectDir, name);
      const stat = fs.statSync(full);
      return {
        name,
        full,
        width: parseWidthFromName(name),
        size: stat.size,
      };
    })
    .filter((item) => item.width > 0 && !SMALL_WIDTHS.has(item.width));
}

/**
 * Highest quality under MAX_BYTES; if none fit, pick the smallest of the large set.
 * Falls back to 960 only when no larger variant exists.
 */
function pickBestVariant(variants) {
  if (!variants.length) return null;

  const preferred = variants.filter((v) => !FALLBACK_WIDTHS.has(v.width));
  const pool = preferred.length ? preferred : variants;

  const sorted = [...pool].sort((a, b) => b.width - a.width || a.size - b.size);
  const underCap = sorted.filter((v) => v.size <= MAX_BYTES);
  if (underCap.length) return underCap[0];

  return [...pool].sort((a, b) => a.size - b.size)[0];
}

function uniqueCategories(projects) {
  const map = new Map();
  for (const project of projects) {
    if (!map.has(project.categorySlug)) {
      map.set(project.categorySlug, {
        id: project.categorySlug,
        slug: project.categorySlug,
        title: project.category,
        description: null,
        coverImage: null,
      });
    }
  }
  return [...map.values()];
}

function cleanOldAssets() {
  if (!fs.existsSync(OUT_ASSETS)) return;
  for (const entry of fs.readdirSync(OUT_ASSETS, { withFileTypes: true })) {
    if (entry.name === 'categories' || entry.name === '.gitignore') continue;
    const full = path.join(OUT_ASSETS, entry.name);
    fs.rmSync(full, { recursive: true, force: true });
  }
}

function main() {
  const sourceProjects = JSON.parse(fs.readFileSync(SOURCE_JSON, 'utf8'));
  if (!Array.isArray(sourceProjects) || sourceProjects.length === 0) {
    throw new Error('Source projects.json is empty');
  }

  ensureDir(OUT_ASSETS);
  cleanOldAssets();

  const categories = uniqueCategories(sourceProjects);
  const projectsOut = [];
  const report = {
    projects: 0,
    imagesCopied: 0,
    skippedImages: 0,
    overCapUsed: 0,
    totalBytes: 0,
  };

  for (const project of sourceProjects) {
    const slug = project.slug;
    const projectDir = path.join(SOURCE_PROJECTS, slug);
    const outDir = path.join(OUT_ASSETS, slug);
    ensureDir(outDir);

    const gallery = [];
    let coverImage = null;

    const imageIds = [];
    for (const image of project.images || []) {
      if (image?.id && !imageIds.includes(image.id)) imageIds.push(image.id);
    }

    // Fallback: discover ids from filesystem if JSON images missing
    if (!imageIds.length && fs.existsSync(projectDir)) {
      const ids = new Set();
      for (const name of fs.readdirSync(projectDir)) {
        const match = name.match(/^(\d+)-/);
        if (match) ids.add(match[1]);
      }
      imageIds.push(...[...ids].sort());
    }

    for (const imageId of imageIds) {
      const variants = listVariants(projectDir, imageId);
      const best = pickBestVariant(variants);
      if (!best) {
        report.skippedImages += 1;
        continue;
      }

      if (best.size > MAX_BYTES) report.overCapUsed += 1;

      const outName = `${imageId}.webp`;
      const outFull = path.join(outDir, outName);
      fs.copyFileSync(best.full, outFull);

      const publicPath = `/assets/projects/${slug}/${outName}`;
      const alt =
        (project.images || []).find((img) => img.id === imageId)?.alt ||
        `${project.name} — image ${imageId}`;

      gallery.push({ src: publicPath, alt });
      if (!coverImage) coverImage = publicPath;

      report.imagesCopied += 1;
      report.totalBytes += best.size;
    }

    projectsOut.push({
      id: slug,
      slug,
      categorySlug: project.categorySlug,
      title: project.name || project.serverName || slug,
      coverImage,
      gallery,
      location: project.location || null,
      architect: project.architect || null,
      area: project.areaDisplay || (project.area != null ? `${project.area} m²` : null),
    });

    // Category cover from first project cover in that category
    const cat = categories.find((c) => c.slug === project.categorySlug);
    if (cat && !cat.coverImage && coverImage) {
      cat.coverImage = coverImage;
    }

    report.projects += 1;
  }

  // Stable category order by title
  categories.sort((a, b) => a.title.localeCompare(b.title));
  // Keep projects ordered as in source JSON
  categories.forEach((cat, index) => {
    cat.projectCount = projectsOut.filter((p) => p.categorySlug === cat.slug).length;
    cat.description = `${cat.title} projects by ODEH & PARTNERS DESIGN.`;
  });

  const payload = {
    categories,
    projects: projectsOut,
  };

  ensureDir(path.dirname(OUT_JSON));
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify({
    ok: true,
    outJson: OUT_JSON,
    outAssets: OUT_ASSETS,
    ...report,
    totalMB: Number((report.totalBytes / (1024 * 1024)).toFixed(1)),
    categories: categories.map((c) => `${c.slug} (${c.projectCount})`),
  }, null, 2));
}

main();
