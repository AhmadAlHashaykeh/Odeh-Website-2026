/**
 * Transforms public website team data into CMS admin records.
 * Frontend-only mock — no API integration.
 */

import { teamContent } from '../../../../data/teamContent';

const REAL_NAMES = {
  'mohammad-odeh': 'Mohammad Odeh',
  'mohammad-al-najjar': 'Mohammad Al-Najjar, M.Sc.',
  'yazan-abu-al-hayja': 'Yazan Abu Al-Hayja',
  'basel-abu-asal': 'Basel Abu Asal',
  'khalid-dawodi': 'Khalid Dawodi',
  'mahmoud-saleh': 'Mahmoud Saleh',
  'mazin-hijazi': 'Mazin Hijazi',
  'yazan-abu-alia': 'Yazan Abu Alia',
  'tarek-ammouri': 'Tarek Ammouri, M.Sc.',
  'abdullah-odat': 'Abdullah Odat, M.Sc.',
  'abdulrahman-jadallah': 'Abdulrahman Jadallah',
  'malek-al-attar': 'Malek Al Attar',
  'zaid-al-nwerat': 'Zaid Al Nwerat',
  'mohammed-al-yousef': 'Mohammed Al Yousef',
  'mohammed-al-faqi': 'Mohammed Al Faqi',
  'mohammad-bani-ahmad': 'Mohammad Bani Ahmad',
  'ahmad-mustafa': 'Ahmad Mustafa',
  'mohammad-kuzmar': 'Mohammad Kuzmar',
  'hamzeh-sawalmeh': 'Hamzeh Sawalmeh',
  'ashraf': 'Ashraf',
  'mohammad-yaghi': 'Mohammad Yaghi',
};

const HIDDEN_SLUGS = new Set(['member-14', 'member-19']);
const SEO_PENDING_SLUGS = new Set(['member-13', 'member-18', 'member-19']);

const CATEGORY_LABELS = {
  leadership: 'Leadership',
  senior: 'Senior Specialist',
  engineer: 'Engineer',
  support: 'Technical Support',
  site: 'Site Operations',
};

function extractPhotoSlug(photoPath) {
  const match = photoPath?.match(/\/([^/]+)\.webp$/);
  return match ? match[1] : '';
}

function resolveFullName(member) {
  const photoSlug = extractPhotoSlug(member.photo);
  return REAL_NAMES[photoSlug] || member.name;
}

function toEmail(name) {
  const parts = name.replace(/,.*$/, '').trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].toLowerCase()}.${parts[parts.length - 1].toLowerCase()}@odehdesign.com`;
  }
  return `${parts[0].toLowerCase()}@odehdesign.com`;
}

function parseExperienceYears(experience) {
  const match = experience?.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function resolveDepartment(title) {
  const lower = title.toLowerCase();
  if (lower.includes('founder') || lower.includes('ceo')) return 'Executive Leadership';
  if (lower.includes('projects manager')) return 'Project Management';
  if (lower.includes('associate partner')) return 'Executive Leadership';
  if (lower.includes('qc')) return 'Quality Control';
  if (lower.includes('steel')) return 'Steel Structures';
  if (lower.includes('it support')) return 'Information Technology';
  if (lower.includes('site engineer')) return 'Site Supervision';
  return 'Structural Engineering';
}

function resolveCategory(title) {
  const lower = title.toLowerCase();
  if (lower.includes('founder') || lower.includes('ceo') || lower.includes('associate partner')) {
    return 'leadership';
  }
  if (
    lower.includes('senior') ||
    lower.includes('section head') ||
    lower.includes('technical lead')
  ) {
    return 'senior';
  }
  if (lower.includes('it support')) return 'support';
  if (lower.includes('site engineer')) return 'site';
  return 'engineer';
}

function deterministicPhone(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 100000;
  }
  const segment = String(200 + (hash % 800)).padStart(3, '0');
  const suffix = String(1000 + (hash % 9000));
  return `+962 6 ${segment} ${suffix}`;
}

function deterministicDate(slug, offsetDays = 0) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 100000;
  }
  const base = new Date('2023-06-01');
  base.setDate(base.getDate() + (hash % 480) + offsetDays);
  return base.toISOString();
}

function buildBiography(fullName, position, department, experience) {
  return `${fullName} brings ${experience.toLowerCase()} of expertise in ${department.toLowerCase()}, serving as ${position} at ODEH & PARTNERS DESIGN. Known for precision, collaboration, and delivering structural solutions across landmark projects in Jordan and the region.`;
}

function buildWebsiteUsage(category, status) {
  const usage = ['About — Team Directory'];
  if (category === 'leadership') usage.push('About — Leadership Section');
  if (status === 'active') usage.push('Homepage — Team Highlights');
  return usage;
}

export function buildAdminTeamMembers() {
  return teamContent.members.map((member, index) => {
    const fullName = resolveFullName(member);
    const department = resolveDepartment(member.title);
    const category = resolveCategory(member.title);
    const status = HIDDEN_SLUGS.has(member.slug) ? 'hidden' : 'active';
    const experienceYears = parseExperienceYears(member.experience);

    return {
      id: member.slug,
      slug: member.slug,
      fullName,
      position: member.title,
      department,
      category,
      categoryLabel: CATEGORY_LABELS[category],
      experience: member.experience,
      experienceYears,
      email: toEmail(fullName),
      phone: deterministicPhone(member.slug),
      photo: member.photo,
      status,
      displayOrder: index + 1,
      biographyPreview: buildBiography(fullName, member.title, department, member.experience),
      seoStatus: SEO_PENDING_SLUGS.has(member.slug) ? 'pending' : 'complete',
      lastUpdated: deterministicDate(member.slug),
      createdAt: deterministicDate(member.slug, -120),
      websiteUsage: buildWebsiteUsage(category, status),
    };
  });
}

export const adminTeamMembers = buildAdminTeamMembers();

export const teamDepartments = [
  ...new Set(adminTeamMembers.map((member) => member.department)),
].sort();

export function getTeamMemberById(id) {
  return adminTeamMembers.find((member) => member.id === id) ?? null;
}
