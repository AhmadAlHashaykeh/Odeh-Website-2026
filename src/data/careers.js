const CAREERS = '/assets/careers';

export const careersContent = {
  meta: {
    title: 'Careers | ODEH & PARTNERS DESIGN',
    description:
      'Explore career opportunities at ODEH & PARTNERS DESIGN. Join our structural engineering team and contribute to projects across the Middle East.',
  },
  hero: {
    label: 'Careers',
    title: 'Build Your Future With Us',
    description:
      'Join ODEH & PARTNERS DESIGN and contribute to structural engineering projects that shape communities across the Middle East.',
    backgroundImage: `${CAREERS}/hero.webp`,
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Careers' },
    ],
    ariaLabel: 'Careers at ODEH & PARTNERS DESIGN',
  },
  intro: {
    title: 'Where Engineering Talent Grows',
    description:
      'At ODEH & PARTNERS DESIGN, we believe exceptional structures are built by exceptional people. We welcome engineers, designers, and professionals who value precision, collaboration, and continuous learning.',
  },
  emptyState: {
    heading: 'No Open Positions at the Moment',
    description:
      'We are always interested in meeting talented engineers and professionals. Please check back soon for future opportunities.',
    buttonLabel: 'Reach Out',
    buttonTo: '/reach-out',
  },
};

function job(data) {
  return data;
}

export const jobs = [
  job({
    id: 1,
    slug: 'structural-design-engineer',
    title: 'Structural Design Engineer',
    department: 'Structural Engineering',
    location: 'Amman, Jordan',
    type: 'Full-time',
    experienceLevel: 'Mid-level',
    workMode: 'On-site',
    postedDate: '2026-03-01',
    closingDate: '2026-06-30',
    shortDescription:
      'Design and analyze reinforced concrete and steel structures for commercial, residential, and institutional projects.',
    description:
      'We are seeking a Structural Design Engineer to join our design team in Amman. You will work on a diverse portfolio of projects, from concept through detailed design, collaborating closely with architects, project managers, and site teams.',
    responsibilities: [
      'Prepare structural calculations, design drawings, and technical reports',
      'Develop reinforced concrete and steel structural models using industry-standard software',
      'Coordinate with architects and MEP consultants during design development',
      'Review shop drawings and respond to site queries during construction',
      'Ensure designs comply with applicable codes and client specifications',
    ],
    requirements: [
      'Bachelor\'s degree in Civil or Structural Engineering',
      '3–5 years of experience in structural design',
      'Proficiency in ETABS, SAFE, and AutoCAD',
      'Strong understanding of ACI, AISC, and local building codes',
      'Excellent communication skills in Arabic and English',
    ],
    preferredQualifications: [
      'Experience with high-rise or complex structural systems',
      'Familiarity with BIM workflows and Revit Structure',
      'Professional engineering license or equivalent certification',
    ],
    benefits: [
      'Competitive salary and performance incentives',
      'Professional development and training support',
      'Collaborative engineering environment',
      'Exposure to diverse regional project types',
      'Health insurance and paid leave',
    ],
    status: 'open',
  }),
  job({
    id: 2,
    slug: 'senior-structural-engineer',
    title: 'Senior Structural Engineer',
    department: 'Structural Engineering',
    location: 'Amman, Jordan',
    type: 'Full-time',
    experienceLevel: 'Senior',
    workMode: 'Hybrid',
    postedDate: '2026-02-15',
    closingDate: '2026-05-15',
    shortDescription:
      'Lead structural design for major projects, mentor junior engineers, and ensure technical excellence across deliverables.',
    description:
      'This senior role involves leading structural design efforts on significant projects, reviewing team outputs, and serving as a technical authority within the practice. You will guide design decisions and uphold our standards of precision and quality.',
    responsibilities: [
      'Lead structural design for assigned projects from concept to construction support',
      'Review and approve calculations, drawings, and technical submissions',
      'Mentor and develop junior and mid-level engineers',
      'Participate in client meetings and present technical solutions',
      'Contribute to office standards, templates, and quality procedures',
    ],
    requirements: [
      'Bachelor\'s degree in Civil or Structural Engineering; Master\'s preferred',
      '8+ years of structural engineering experience',
      'Demonstrated experience leading design teams on complex projects',
      'Advanced proficiency in structural analysis and design software',
      'Strong leadership, communication, and client-facing skills',
    ],
    preferredQualifications: [
      'Registered or chartered engineer status',
      'Experience with seismic design and performance-based approaches',
      'Portfolio of successfully delivered high-rise or large-span structures',
    ],
    benefits: [
      'Senior-level compensation package',
      'Leadership and mentorship opportunities',
      'Flexible hybrid working arrangement',
      'Conference and continuing education support',
      'Health insurance and paid leave',
    ],
    status: 'closed',
  }),
  job({
    id: 3,
    slug: 'bim-modeler',
    title: 'BIM Modeler',
    department: 'BIM & Digital Delivery',
    location: 'Amman, Jordan',
    type: 'Full-time',
    experienceLevel: 'Mid-level',
    workMode: 'On-site',
    postedDate: '2026-03-10',
    closingDate: '2026-07-10',
    shortDescription:
      'Develop accurate structural BIM models and support coordinated digital delivery across multidisciplinary project teams.',
    description:
      'Join our BIM team to create and maintain high-quality structural models that drive design coordination and construction documentation. You will work at the intersection of engineering and digital delivery.',
    responsibilities: [
      'Create and maintain structural BIM models in Revit Structure',
      'Coordinate models with architectural and MEP disciplines',
      'Extract quantities, schedules, and documentation from BIM models',
      'Support clash detection and model review sessions',
      'Assist in developing and maintaining BIM standards and templates',
    ],
    requirements: [
      'Diploma or Bachelor\'s degree in Civil Engineering, Architecture, or related field',
      '2–4 years of BIM modeling experience in structural projects',
      'Proficiency in Revit Structure and Navisworks',
      'Understanding of structural systems and construction sequencing',
      'Attention to detail and ability to work within team workflows',
    ],
    preferredQualifications: [
      'Autodesk Revit Professional certification',
      'Experience with Dynamo or BIM automation tools',
      'Familiarity with ISO 19650 or similar BIM standards',
    ],
    benefits: [
      'Competitive salary',
      'Hands-on exposure to advanced BIM workflows',
      'Training on latest digital delivery tools',
      'Collaborative multidisciplinary environment',
      'Health insurance and paid leave',
    ],
    status: 'open',
  }),
  job({
    id: 4,
    slug: 'site-supervision-engineer',
    title: 'Site Supervision Engineer',
    department: 'Site Supervision',
    location: 'Amman, Jordan',
    type: 'Full-time',
    experienceLevel: 'Mid-level',
    workMode: 'On-site',
    postedDate: '2026-03-05',
    closingDate: '2026-06-05',
    shortDescription:
      'Monitor construction progress on site, verify structural works, and ensure compliance with approved design documents.',
    description:
      'We are looking for a Site Supervision Engineer to represent our office on active construction sites. You will bridge design intent and field execution, ensuring structural works meet specifications and quality standards.',
    responsibilities: [
      'Conduct regular site visits and document construction progress',
      'Verify reinforcement, formwork, and structural elements against drawings',
      'Prepare site reports, non-conformance records, and progress summaries',
      'Coordinate with contractors and respond to field queries',
      'Report issues to the design team and recommend corrective actions',
    ],
    requirements: [
      'Bachelor\'s degree in Civil or Structural Engineering',
      '3–6 years of site supervision or construction experience',
      'Strong knowledge of reinforced concrete construction practices',
      'Ability to read structural drawings and specifications',
      'Valid driving license and willingness to travel to project sites',
    ],
    preferredQualifications: [
      'Prior experience with supervision of high-rise or infrastructure projects',
      'Familiarity with QA/QC procedures and site safety requirements',
    ],
    benefits: [
      'Competitive salary with site allowance',
      'Direct involvement in landmark regional projects',
      'Field experience alongside design expertise',
      'Health insurance and paid leave',
    ],
    status: 'open',
  }),
  job({
    id: 5,
    slug: 'quantity-estimation-engineer',
    title: 'Quantity Estimation Engineer',
    department: 'Estimation & Planning',
    location: 'Amman, Jordan',
    type: 'Full-time',
    experienceLevel: 'Junior',
    workMode: 'On-site',
    postedDate: '2026-03-12',
    closingDate: '2026-07-12',
    shortDescription:
      'Prepare accurate quantity take-offs and cost estimates for structural works on tender and design-build projects.',
    description:
      'Support our estimation team by preparing detailed quantity surveys and structural cost estimates. This role suits an engineer with strong numerical skills and an interest in project economics.',
    responsibilities: [
      'Perform quantity take-offs from drawings and BIM models',
      'Prepare BOQ and cost estimates for structural components',
      'Support tender submissions and bid evaluations',
      'Maintain databases of unit rates and historical project data',
      'Coordinate with design and site teams for estimate validation',
    ],
    requirements: [
      'Bachelor\'s degree in Civil Engineering',
      '1–3 years of experience in quantity surveying or estimation',
      'Proficiency in AutoCAD and Excel; experience with cost estimation software is a plus',
      'Strong analytical skills and attention to detail',
      'Good communication skills in Arabic and English',
    ],
    preferredQualifications: [
      'Experience with BIM-based quantity extraction',
      'Knowledge of local market rates and procurement practices',
    ],
    benefits: [
      'Competitive entry-to-mid level salary',
      'Exposure to full project lifecycle from estimate to delivery',
      'Professional development support',
      'Health insurance and paid leave',
    ],
    status: 'open',
  }),
  job({
    id: 6,
    slug: 'internship-structural-engineering',
    title: 'Internship — Structural Engineering',
    department: 'Structural Engineering',
    location: 'Amman, Jordan',
    type: 'Internship',
    experienceLevel: 'Entry-level',
    workMode: 'On-site',
    postedDate: '2026-04-01',
    closingDate: '2026-08-31',
    shortDescription:
      'Gain hands-on experience in structural design, analysis, and project delivery within a professional engineering practice.',
    description:
      'Our structural engineering internship offers recent graduates and final-year students the opportunity to learn from experienced engineers while contributing to real project tasks under supervision.',
    responsibilities: [
      'Assist senior engineers with calculations, drawings, and research tasks',
      'Support BIM modeling and documentation under guidance',
      'Participate in design meetings and site visit observations',
      'Complete assigned learning modules and technical exercises',
      'Prepare progress reports and present findings to the team',
    ],
    requirements: [
      'Currently pursuing or recently completed a degree in Civil or Structural Engineering',
      'Basic knowledge of structural mechanics and design principles',
      'Familiarity with AutoCAD; exposure to ETABS or Revit is advantageous',
      'Eagerness to learn and strong work ethic',
      'Good academic standing and communication skills',
    ],
    preferredQualifications: [
      'Previous internship or project experience in structural engineering',
      'Participation in university design competitions or research',
    ],
    benefits: [
      'Structured mentorship program',
      'Exposure to live project workflows',
      'Potential pathway to full-time employment',
      'Certificate of completion',
    ],
    status: 'open',
  }),
];

export function getJobBySlug(slug) {
  return jobs.find((item) => item.slug === slug) ?? null;
}

export function getOpenJobs() {
  return jobs.filter((item) => item.status === 'open');
}

export function getJobPath(job) {
  return `/careers/${job.slug}`;
}

export function getJobApplyPath(job) {
  return `/careers/${job.slug}/apply`;
}

export function getJobApplyThankYouPath(job) {
  return `/careers/${job.slug}/apply/thank-you`;
}

export function formatJobDate(dateString) {
  if (!dateString) return '';
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
