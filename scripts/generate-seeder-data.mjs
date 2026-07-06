import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'backend/database/seeders/data');
const require = createRequire(import.meta.url);

function toPhp(value, indent = 0) {
  const pad = '    '.repeat(indent);
  const padIn = '    '.repeat(indent + 1);

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((item) => `${padIn}${toPhp(item, indent + 1)},`).join('\n');
    return `[\n${items}\n${pad}]`;
  }

  const entries = Object.entries(value)
    .map(([key, val]) => `${padIn}'${key}' => ${toPhp(val, indent + 1)},`)
    .join('\n');
  return `[\n${entries}\n${pad}]`;
}

function writePhp(name, data) {
  const content = `<?php\n\nreturn ${toPhp(data)};\n`;
  fs.writeFileSync(path.join(outDir, name), content, 'utf8');
  console.log('Wrote', name);
}

// Services
const { services } = await import(pathToFileURL(path.join(root, 'src/data/services.js')).href);
writePhp(
  'services.php',
  services.map((s) => ({
    slug: s.id,
    title: s.title,
    description: s.description,
    image: s.image,
  })),
);

// Careers jobs
const careers = await import(pathToFileURL(path.join(root, 'src/data/careers.js')).href);
writePhp(
  'jobs.php',
  careers.jobs.map((job) => ({
    slug: job.slug,
    title: job.title,
    department: job.department,
    location: job.location,
    type: job.type,
    workMode: job.workMode,
    experienceLevel: job.experienceLevel,
    postedDate: job.postedDate,
    closingDate: job.closingDate,
    shortDescription: job.shortDescription,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    benefits: job.benefits,
    status: job.status,
  })),
);

// Team members
const team = await import(pathToFileURL(path.join(root, 'src/data/teamContent.js')).href);
writePhp('team_members.php', team.teamContent.members);

// Activities
const activitiesMod = await import(pathToFileURL(path.join(root, 'src/data/activitiesContent.js')).href);
writePhp('activities.php', activitiesMod.activitiesContent.activities);

console.log('Done');
