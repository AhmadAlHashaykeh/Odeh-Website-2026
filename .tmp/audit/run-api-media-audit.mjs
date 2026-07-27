/**
 * Read-only API + media audit harness for Odeh CMS.
 * Does not mutate production data except temporary login (token discarded).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API = process.env.AUDIT_API_BASE || 'http://127.0.0.1:8000/api';
const OUT = path.join(__dirname, 'api-media-results.json');

const PUBLIC_GET = [
  '/public/home',
  '/public/about',
  '/public/navigation-footer',
  '/public/connect',
  '/public/website-settings',
  '/public/reach-out',
  '/public/legal-pages',
  '/public/seo',
  '/public/seo/by-route?route=/',
  '/public/project-categories',
  '/public/projects',
  '/public/services',
  '/public/activities',
  '/public/team-members',
  '/public/careers',
  '/public/jobs',
  '/public/search?q=design',
  '/public/search/suggestions?q=des',
];

const ADMIN_GET = [
  '/admin/dashboard/stats',
  '/admin/project-categories',
  '/admin/projects',
  '/admin/services',
  '/admin/activities',
  '/admin/team-categories',
  '/admin/team-members',
  '/admin/jobs',
  '/admin/home-page',
  '/admin/about-pages',
  '/admin/navigation-footer',
  '/admin/connect-page',
  '/admin/website-settings',
  '/admin/legal-pages',
  '/admin/seo',
  '/admin/contact-messages',
  '/admin/job-applications',
  '/admin/users',
  '/admin/roles',
];

function collectUrls(value, bag = new Set(), trail = '') {
  if (value == null) return bag;
  if (typeof value === 'string') {
    const s = value.trim();
    if (
      /^https?:\/\//i.test(s) ||
      s.startsWith('/storage/') ||
      s.startsWith('/assets/') ||
      s.startsWith('storage/') ||
      /\.(png|jpe?g|webp|gif|svg|avif|mp4|webm)(\?|$)/i.test(s)
    ) {
      bag.add(JSON.stringify({ url: s, trail }));
    }
    return bag;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectUrls(v, bag, `${trail}[${i}]`));
    return bag;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (/url|image|photo|logo|cover|poster|avatar|src|media|path|thumbnail|icon/i.test(k) || typeof v === 'object') {
        collectUrls(v, bag, trail ? `${trail}.${k}` : k);
      }
    }
  }
  return bag;
}

function absolutize(u) {
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/')) return `http://127.0.0.1:8000${u}`;
  if (u.startsWith('storage/')) return `http://127.0.0.1:8000/${u}`;
  if (u.startsWith('/assets/') || u.startsWith('assets/')) {
    // Frontend static asset — check Vite origin
    const p = u.startsWith('/') ? u : `/${u}`;
    return `http://127.0.0.1:5173${p}`;
  }
  return u;
}

async function fetchJson(url, opts = {}) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      ...opts,
      headers: {
        Accept: 'application/json',
        ...(opts.headers || {}),
      },
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return {
      url,
      status: res.status,
      ok: res.ok,
      ms: Date.now() - started,
      contentType: res.headers.get('content-type'),
      isJson: json !== null,
      json,
      textSnippet: text.slice(0, 240),
    };
  } catch (err) {
    return {
      url,
      status: 0,
      ok: false,
      ms: Date.now() - started,
      error: String(err?.message || err),
    };
  }
}

async function headOrGet(url) {
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    // Some servers reject HEAD
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: 'GET', redirect: 'follow' });
    }
    return { url, status: res.status, ok: res.ok, contentType: res.headers.get('content-type') };
  } catch (err) {
    return { url, status: 0, ok: false, error: String(err?.message || err) };
  }
}

function asArray(json) {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (json.data && Array.isArray(json.data.data)) return json.data.data;
  if (json.data && Array.isArray(json.data.items)) return json.data.items;
  return [];
}

function countList(json) {
  if (!json) return null;
  if (json.meta && typeof json.meta.total === 'number') return json.meta.total;
  const arr = asArray(json);
  if (arr.length) return arr.length;
  if (json.data && typeof json.data === 'object' && !Array.isArray(json.data)) return 'object';
  if (Array.isArray(json)) return json.length;
  return 0;
}

async function main() {
  const report = {
    startedAt: new Date().toISOString(),
    apiBase: API,
    publicEndpoints: [],
    adminEndpoints: [],
    auth: {},
    media: [],
    detailEndpoints: [],
    invalidSlugChecks: [],
  };

  for (const ep of PUBLIC_GET) {
    const r = await fetchJson(`${API}${ep}`);
    report.publicEndpoints.push({
      method: 'GET',
      endpoint: ep,
      status: r.status,
      ok: r.ok,
      isJson: r.isJson,
      count: countList(r.json),
      ms: r.ms,
      error: r.error || null,
      keys: r.json && typeof r.json === 'object' ? Object.keys(r.json).slice(0, 20) : [],
    });
  }

  // Detail endpoints from list data
  const projects = await fetchJson(`${API}/public/projects`);
  const activities = await fetchJson(`${API}/public/activities`);
  const jobs = await fetchJson(`${API}/public/jobs`);
  const legal = await fetchJson(`${API}/public/legal-pages`);

  const projectItems = asArray(projects.json);
  for (const p of projectItems.slice(0, 8)) {
    const cat = p.category?.slug || p.category_slug || p.categorySlug;
    const slug = p.slug;
    if (cat && slug) {
      const r = await fetchJson(`${API}/public/projects/${cat}/${slug}`);
      report.detailEndpoints.push({ endpoint: `/public/projects/${cat}/${slug}`, status: r.status, ok: r.ok, title: p.title });
    }
  }

  for (const a of asArray(activities.json).slice(0, 5)) {
    if (a.slug) {
      const r = await fetchJson(`${API}/public/activities/${a.slug}`);
      report.detailEndpoints.push({ endpoint: `/public/activities/${a.slug}`, status: r.status, ok: r.ok, title: a.title });
    }
  }

  for (const j of asArray(jobs.json).slice(0, 5)) {
    if (j.slug) {
      const r = await fetchJson(`${API}/public/jobs/${j.slug}`);
      report.detailEndpoints.push({ endpoint: `/public/jobs/${j.slug}`, status: r.status, ok: r.ok, title: j.title });
    }
  }

  for (const l of asArray(legal.json).slice(0, 5)) {
    const slug = l.slug;
    if (slug) {
      const r = await fetchJson(`${API}/public/legal-pages/${slug}`);
      report.detailEndpoints.push({ endpoint: `/public/legal-pages/${slug}`, status: r.status, ok: r.ok, title: l.title });
    }
  }

  // Invalid slug checks
  for (const ep of [
    '/public/projects/no-cat/no-project',
    '/public/activities/does-not-exist-xyz',
    '/public/jobs/does-not-exist-xyz',
    '/public/legal-pages/does-not-exist-xyz',
  ]) {
    const r = await fetchJson(`${API}${ep}`);
    report.invalidSlugChecks.push({ endpoint: ep, status: r.status, ok: r.ok, isJson: r.isJson });
  }

  // Auth
  const login = await fetchJson(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.AUDIT_ADMIN_EMAIL || 'admin@odeh.local',
      password: process.env.AUDIT_ADMIN_PASSWORD || 'OdehLocalDev2026!',
    }),
  });
  const token = login.json?.token || login.json?.data?.token || login.json?.access_token;
  report.auth.loginStatus = login.status;
  report.auth.loginOk = login.ok;
  report.auth.hasToken = Boolean(token);
  report.auth.userKeys = login.json?.user ? Object.keys(login.json.user) : login.json?.data?.user ? Object.keys(login.json.data.user) : [];

  if (token) {
    const me = await fetchJson(`${API}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    report.auth.userStatus = me.status;
    report.auth.userEmail = me.json?.email || me.json?.data?.email || null;
    report.auth.role = me.json?.role?.slug || me.json?.data?.role?.slug || me.json?.role_slug || null;
    report.auth.permissionsSample = Array.isArray(me.json?.permissions)
      ? me.json.permissions.slice(0, 5)
      : me.json?.role?.permissions
        ? 'nested'
        : null;

    for (const ep of ADMIN_GET) {
      const r = await fetchJson(`${API}${ep}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      report.adminEndpoints.push({
        method: 'GET',
        endpoint: ep,
        status: r.status,
        ok: r.ok,
        isJson: r.isJson,
        count: countList(r.json),
        ms: r.ms,
        error: r.error || null,
        textSnippet: r.ok ? null : r.textSnippet,
      });
    }

    // Unauthenticated admin should fail
    const unauth = await fetchJson(`${API}/admin/projects`);
    report.auth.unauthenticatedAdminStatus = unauth.status;

    // Invalid login
    const bad = await fetchJson(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@odeh.local', password: 'wrong-password-audit' }),
    });
    report.auth.invalidLoginStatus = bad.status;
  }

  // Collect media from major public payloads
  const mediaSources = [
    ['home', await fetchJson(`${API}/public/home`)],
    ['about', await fetchJson(`${API}/public/about`)],
    ['nav', await fetchJson(`${API}/public/navigation-footer`)],
    ['connect', await fetchJson(`${API}/public/connect`)],
    ['settings', await fetchJson(`${API}/public/website-settings`)],
    ['projects', projects],
    ['categories', await fetchJson(`${API}/public/project-categories`)],
    ['services', await fetchJson(`${API}/public/services`)],
    ['activities', activities],
    ['team', await fetchJson(`${API}/public/team-members`)],
    ['careers', await fetchJson(`${API}/public/careers`)],
  ];

  const urlBag = new Map();
  for (const [source, payload] of mediaSources) {
    const bag = collectUrls(payload.json);
    for (const entry of bag) {
      const { url, trail } = JSON.parse(entry);
      if (!urlBag.has(url)) urlBag.set(url, { url, sources: [], trails: [] });
      const row = urlBag.get(url);
      if (!row.sources.includes(source)) row.sources.push(source);
      if (row.trails.length < 3) row.trails.push(trail);
    }
  }

  // Also include a few project detail galleries
  for (const p of projectItems.slice(0, 5)) {
    const cat = p.category?.slug || p.category_slug || p.categorySlug;
    if (!cat || !p.slug) continue;
    const detail = await fetchJson(`${API}/public/projects/${cat}/${p.slug}`);
    const bag = collectUrls(detail.json);
    for (const entry of bag) {
      const { url, trail } = JSON.parse(entry);
      if (!urlBag.has(url)) urlBag.set(url, { url, sources: [], trails: [] });
      const row = urlBag.get(url);
      if (!row.sources.includes(`project:${p.slug}`)) row.sources.push(`project:${p.slug}`);
      if (row.trails.length < 3) row.trails.push(trail);
    }
  }

  for (const row of urlBag.values()) {
    const finalUrl = absolutize(row.url);
    const check = await headOrGet(finalUrl);
    report.media.push({
      databaseOrApiValue: row.url,
      finalUrl,
      status: check.status,
      ok: check.ok,
      contentType: check.contentType || null,
      sources: row.sources,
      trails: row.trails,
      error: check.error || null,
      kind: row.url.startsWith('/assets/') || row.url.includes('/assets/')
        ? 'frontend-asset'
        : row.url.includes('/storage/') || row.url.includes('storage/')
          ? 'storage'
          : /^https?:\/\//i.test(row.url)
            ? 'absolute'
            : 'other',
    });
  }

  report.mediaSummary = {
    total: report.media.length,
    working: report.media.filter((m) => m.ok).length,
    broken: report.media.filter((m) => !m.ok).length,
    storageBroken: report.media.filter((m) => m.kind === 'storage' && !m.ok).length,
    assetBroken: report.media.filter((m) => m.kind === 'frontend-asset' && !m.ok).length,
    absoluteBroken: report.media.filter((m) => m.kind === 'absolute' && !m.ok).length,
  };

  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({
    out: OUT,
    publicOk: report.publicEndpoints.filter((e) => e.ok).length,
    publicFail: report.publicEndpoints.filter((e) => !e.ok).length,
    adminOk: report.adminEndpoints.filter((e) => e.ok).length,
    adminFail: report.adminEndpoints.filter((e) => !e.ok).length,
    media: report.mediaSummary,
    auth: {
      login: report.auth.loginStatus,
      unauthAdmin: report.auth.unauthenticatedAdminStatus,
      invalidLogin: report.auth.invalidLoginStatus,
    },
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
