import fs from 'node:fs';
import path from 'node:path';

const FE = 'http://127.0.0.1:5173';
const API = 'http://127.0.0.1:8000/api';

async function check(u) {
  try {
    const r = await fetch(u);
    return { u, status: r.status, ok: r.ok, ct: r.headers.get('content-type') };
  } catch (e) {
    return { u, err: String(e.message || e) };
  }
}

async function main() {
  const checks = [];
  for (const u of [
    'http://localhost/storage/uploads/demo.webp',
    'http://127.0.0.1:8000/storage/uploads/demo.webp',
    `${FE}/assets/projects//cover.webp`,
    `${FE}/assets/projects/himmeh-resort/cover.webp`,
    `${FE}/odeh-logo2.png`,
    `${FE}/hero-poster.jpg`,
    `${FE}/video-slider.mp4`,
  ]) {
    checks.push(await check(u));
  }

  const search = await (await fetch(`${API}/public/search?q=design+solutions`)).json();
  const arr = Array.isArray(search.data) ? search.data : search.data?.results || search.results || [];
  const serviceHits = arr.filter((x) => String(x.path || '').includes('/services/'));

  const nav = await (await fetch(`${API}/public/navigation-footer`)).json();
  const d = nav.data || {};
  const blob = JSON.stringify(d);
  const legalMentions = blob.match(/\/(privacy-policy|terms-and-conditions|terms)/g) || [];

  // disk existence for all project covers from API
  const projectsPayload = await (await fetch(`${API}/public/projects`)).json();
  const projects = projectsPayload.data?.projects || [];
  const services = (await (await fetch(`${API}/public/services`)).json()).data || [];
  const team = (await (await fetch(`${API}/public/team-members`)).json()).data?.members || [];
  const activities = (await (await fetch(`${API}/public/activities`)).json()).data?.activities || [];

  function mediaPath(v) {
    if (!v) return null;
    if (typeof v === 'string') return v;
    return v.path || v.url || v.src || null;
  }

  const disk = { checked: 0, missing: 0, missingList: [] };
  function verify(p, record) {
    if (!p || typeof p !== 'string') return;
    if (!p.startsWith('/assets/')) return;
    disk.checked++;
    const full = path.join('public', p.replace(/^\//, ''));
    if (!fs.existsSync(full)) {
      disk.missing++;
      if (disk.missingList.length < 40) disk.missingList.push({ path: p, record, full });
    }
  }

  for (const p of projects) {
    verify(mediaPath(p.coverImage || p.cover_image), `project:${p.slug}`);
    for (const g of p.gallery || []) verify(mediaPath(g), `project-gallery:${p.slug}`);
  }
  for (const s of services) verify(mediaPath(s.image), `service:${s.slug}`);
  for (const t of team) verify(mediaPath(t.photo || t.image), `team:${t.fullName || t.name}`);
  for (const a of activities) verify(mediaPath(a.coverImage || a.cover_image), `activity:${a.slug}`);

  // empty slug project via admin token
  const login = await (
    await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@odeh.local', password: 'OdehLocalDev2026!' }),
    })
  ).json();
  const token = login.token || login.data?.token;
  const adminProjects = await (
    await fetch(`${API}/admin/projects`, { headers: { Authorization: `Bearer ${token}` } })
  ).json();
  const adminList = Array.isArray(adminProjects.data) ? adminProjects.data : adminProjects.data?.data || [];
  const emptySlug = adminList.filter((p) => !p.slug);
  const auditTeam = ((await (await fetch(`${API}/admin/team-members`, { headers: { Authorization: `Bearer ${token}` } })).json()).data || []).filter((m) => /audit/i.test(m.fullName || m.name || ''));

  const out = {
    checks,
    searchTotal: arr.length,
    serviceHits: serviceHits.slice(0, 10),
    legalMentionsInNavApi: [...new Set(legalMentions)],
    navKeys: Object.keys(d),
    disk,
    counts: {
      projects: projects.length,
      services: services.length,
      team: team.length,
      activities: activities.length,
      adminProjects: adminList.length,
      emptySlugAdmin: emptySlug.length,
      auditTeam: auditTeam.length,
    },
    emptySlugSample: emptySlug.slice(0, 3),
    auditTeamSample: auditTeam.slice(0, 3),
  };
  fs.writeFileSync('.tmp/audit/extra-checks.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
