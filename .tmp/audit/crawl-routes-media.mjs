/**
 * Crawl public + admin pages via fetch of HTML shell + key page API deps.
 * Browser visual checks done separately; this catches route/API wiring.
 */
import fs from 'node:fs';

const FE = 'http://127.0.0.1:5173';
const API = 'http://127.0.0.1:8000/api';

const PUBLIC_ROUTES = [
  '/',
  '/about/overview',
  '/about/approach',
  '/about/history',
  '/about/team-members',
  '/about/activities',
  '/projects',
  '/careers',
  '/reach-out',
  '/search',
  '/privacy-policy',
  '/terms-and-conditions',
  '/terms',
  '/thank-you',
  '/connect',
  '/about/unknown-section',
  '/services/design-solutions',
  '/services/site-supervision',
  '/does-not-exist-page-xyz',
];

const ADMIN_ROUTES = [
  '/admin/login',
  '/admin/dashboard',
  '/admin/projects',
  '/admin/project-categories',
  '/admin/team-categories',
  '/admin/team-members',
  '/admin/activities',
  '/admin/services',
  '/admin/careers',
  '/admin/applications',
  '/admin/contact-messages',
  '/admin/home-page',
  '/admin/about-pages',
  '/admin/navigation-footer',
  '/admin/connect-page',
  '/admin/legal-pages',
  '/admin/seo',
  '/admin/website-settings',
  '/admin/users-roles',
  '/admin/missing-module-xyz',
];

async function get(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const text = await res.text();
    return {
      url,
      status: res.status,
      ok: res.ok,
      redirected: res.status >= 300 && res.status < 400,
      location: res.headers.get('location'),
      ms: Date.now() - started,
      hasRoot: text.includes('id="root"') || text.includes("id='root'"),
      len: text.length,
    };
  } catch (e) {
    return { url, status: 0, ok: false, error: String(e.message || e) };
  }
}

async function main() {
  // Discover dynamic routes from API
  const [projects, activities, jobs, categories] = await Promise.all([
    fetch(`${API}/public/projects`).then((r) => r.json()),
    fetch(`${API}/public/activities`).then((r) => r.json()),
    fetch(`${API}/public/jobs`).then((r) => r.json()),
    fetch(`${API}/public/project-categories`).then((r) => r.json()),
  ]);

  const asArr = (j) => (Array.isArray(j?.data) ? j.data : Array.isArray(j?.data?.data) ? j.data.data : Array.isArray(j) ? j : []);
  const projectItems = asArr(projects);
  const activityItems = asArr(activities);
  const jobItems = asArr(jobs);
  const categoryItems = asArr(categories);

  const dynamic = [];
  for (const c of categoryItems.slice(0, 11)) {
    if (c.slug) dynamic.push(`/projects/${c.slug}`);
  }
  for (const p of projectItems.slice(0, 12)) {
    const cat = p.category?.slug || p.categorySlug || p.category_slug;
    if (cat && p.slug) dynamic.push(`/projects/${cat}/${p.slug}`);
  }
  for (const a of activityItems.slice(0, 6)) {
    if (a.slug) dynamic.push(`/about/activities/${a.slug}`);
  }
  for (const j of jobItems.slice(0, 8)) {
    if (j.slug) {
      dynamic.push(`/careers/${j.slug}`);
      dynamic.push(`/careers/${j.slug}/apply`);
    }
  }

  const publicResults = [];
  for (const path of [...PUBLIC_ROUTES, ...dynamic]) {
    publicResults.push(await get(`${FE}${path}`));
  }

  const adminResults = [];
  for (const path of ADMIN_ROUTES) {
    adminResults.push(await get(`${FE}${path}`));
  }

  // Media GET verification for seeded assets + any storage URLs in projects API
  const mediaChecks = [];
  const urls = new Set();
  for (const p of projectItems) {
    for (const key of ['coverImage', 'cover_image', 'image']) {
      if (p[key]) urls.add(typeof p[key] === 'string' ? p[key] : p[key]?.url);
    }
    const gallery = p.gallery || [];
    for (const g of gallery) {
      const u = typeof g === 'string' ? g : g?.url || g?.src;
      if (u) urls.add(u);
    }
  }
  for (const s of asArr(await (await fetch(`${API}/public/services`)).json())) {
    if (s.image) urls.add(typeof s.image === 'string' ? s.image : s.image?.url);
  }
  for (const t of asArr(await (await fetch(`${API}/public/team-members`)).json())) {
    const photo = t.photo || t.image;
    if (photo) urls.add(typeof photo === 'string' ? photo : photo?.url);
  }

  function abs(u) {
    if (!u) return null;
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith('/assets/') || u.startsWith('assets/')) return `${FE}${u.startsWith('/') ? u : '/' + u}`;
    if (u.startsWith('/storage/')) return `http://127.0.0.1:8000${u}`;
    if (u.startsWith('http://localhost/storage')) return u.replace('http://localhost', 'http://127.0.0.1:8000');
    return u;
  }

  for (const u of [...urls].filter(Boolean).slice(0, 200)) {
    const finalUrl = abs(u);
    try {
      const res = await fetch(finalUrl, { method: 'GET', redirect: 'follow' });
      // drain body lightly
      await res.arrayBuffer();
      mediaChecks.push({ apiValue: u, finalUrl, status: res.status, ok: res.ok, ct: res.headers.get('content-type') });
    } catch (e) {
      mediaChecks.push({ apiValue: u, finalUrl, status: 0, ok: false, error: String(e.message || e) });
    }
  }

  const out = {
    discovered: {
      categories: categoryItems.length,
      projects: projectItems.length,
      activities: activityItems.length,
      jobs: jobItems.length,
      dynamicRoutes: dynamic.length,
    },
    publicShell: publicResults,
    adminShell: adminResults,
    mediaChecks,
    mediaSummary: {
      total: mediaChecks.length,
      working: mediaChecks.filter((m) => m.ok).length,
      broken: mediaChecks.filter((m) => !m.ok).length,
      brokenSamples: mediaChecks.filter((m) => !m.ok).slice(0, 40),
    },
    categorySlugs: categoryItems.map((c) => c.slug),
    jobSlugs: jobItems.map((j) => j.slug),
    activitySlugs: activityItems.map((a) => a.slug),
  };
  fs.writeFileSync('.tmp/audit/route-media-crawl.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify({
    publicShellOk: publicResults.filter((r) => r.ok).length,
    publicShellFail: publicResults.filter((r) => !r.ok).length,
    adminShellOk: adminResults.filter((r) => r.ok).length,
    media: out.mediaSummary,
    discovered: out.discovered,
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
