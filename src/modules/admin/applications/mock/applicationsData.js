/**
 * Mock job applications connected to existing admin job listings.
 * Frontend-only — no API integration.
 */

import { adminJobs } from '../../careers/mock/careersData';

const STATUSES = ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'];
const SOURCES = ['Website Form', 'LinkedIn', 'Referral', 'Job Board', 'Careers Page'];

const APPLICANT_POOL = [
  { name: 'Ahmad Al-Khatib', email: 'ahmad.khatib@email.com', phone: '+962 79 123 4567', location: 'Amman, Jordan', years: 4, linkedIn: 'https://linkedin.com/in/ahmad-khatib' },
  { name: 'Layla Mansour', email: 'layla.mansour@email.com', phone: '+962 78 234 5678', location: 'Irbid, Jordan', years: 6, linkedIn: 'https://linkedin.com/in/layla-mansour' },
  { name: 'Omar Haddad', email: 'omar.haddad@email.com', phone: '+962 77 345 6789', location: 'Zarqa, Jordan', years: 3, linkedIn: 'https://linkedin.com/in/omar-haddad' },
  { name: 'Sara Nasser', email: 'sara.nasser@email.com', phone: '+962 79 456 7890', location: 'Amman, Jordan', years: 8, linkedIn: 'https://linkedin.com/in/sara-nasser' },
  { name: 'Khalid Barakat', email: 'khalid.barakat@email.com', phone: '+962 78 567 8901', location: 'Aqaba, Jordan', years: 5, linkedIn: 'https://linkedin.com/in/khalid-barakat' },
  { name: 'Nour Abed', email: 'nour.abed@email.com', phone: '+962 77 678 9012', location: 'Ramallah, Palestine', years: 2, linkedIn: 'https://linkedin.com/in/nour-abed' },
  { name: 'Youssef Hamdan', email: 'youssef.hamdan@email.com', phone: '+962 79 789 0123', location: 'Amman, Jordan', years: 10, linkedIn: 'https://linkedin.com/in/youssef-hamdan' },
  { name: 'Rania Saleh', email: 'rania.saleh@email.com', phone: '+962 78 890 1234', location: 'Madaba, Jordan', years: 1, linkedIn: 'https://linkedin.com/in/rania-saleh' },
  { name: 'Tariq Zayed', email: 'tariq.zayed@email.com', phone: '+962 77 901 2345', location: 'Jerash, Jordan', years: 7, linkedIn: 'https://linkedin.com/in/tariq-zayed' },
  { name: 'Hana Qasem', email: 'hana.qasem@email.com', phone: '+962 79 012 3456', location: 'Amman, Jordan', years: 0, linkedIn: 'https://linkedin.com/in/hana-qasem' },
  { name: 'Fadi Awad', email: 'fadi.awad@email.com', phone: '+962 78 123 4560', location: 'Nablus, Palestine', years: 4, linkedIn: 'https://linkedin.com/in/fadi-awad' },
  { name: 'Maya Khoury', email: 'maya.khoury@email.com', phone: '+962 77 234 5671', location: 'Amman, Jordan', years: 3, linkedIn: 'https://linkedin.com/in/maya-khoury' },
  { name: 'Bassam Nabulsi', email: 'bassam.nabulsi@email.com', phone: '+962 79 345 6782', location: 'Salt, Jordan', years: 12, linkedIn: 'https://linkedin.com/in/bassam-nabulsi' },
  { name: 'Dina Faris', email: 'dina.faris@email.com', phone: '+962 78 456 7893', location: 'Amman, Jordan', years: 2, linkedIn: 'https://linkedin.com/in/dina-faris' },
  { name: 'Walid Suleiman', email: 'walid.suleiman@email.com', phone: '+962 77 567 8904', location: 'Karak, Jordan', years: 9, linkedIn: 'https://linkedin.com/in/walid-suleiman' },
  { name: 'Lina Hijazi', email: 'lina.hijazi@email.com', phone: '+962 79 678 9015', location: 'Amman, Jordan', years: 1, linkedIn: 'https://linkedin.com/in/lina-hijazi' },
  { name: 'Karim Darwish', email: 'karim.darwish@email.com', phone: '+962 78 789 0126', location: 'Bethlehem, Palestine', years: 5, linkedIn: 'https://linkedin.com/in/karim-darwish' },
  { name: 'Reem Odeh', email: 'reem.odeh@email.com', phone: '+962 77 890 1237', location: 'Amman, Jordan', years: 6, linkedIn: 'https://linkedin.com/in/reem-odeh' },
  { name: 'Samir Totah', email: 'samir.totah@email.com', phone: '+962 79 901 2348', location: 'Amman, Jordan', years: 4, linkedIn: 'https://linkedin.com/in/samir-totah' },
  { name: 'Yasmin Kanaan', email: 'yasmin.kanaan@email.com', phone: '+962 78 012 3459', location: 'Amman, Jordan', years: 0, linkedIn: 'https://linkedin.com/in/yasmin-kanaan' },
  { name: 'Hassan Jaber', email: 'hassan.jaber@email.com', phone: '+962 77 123 4568', location: 'Mafraq, Jordan', years: 11, linkedIn: 'https://linkedin.com/in/hassan-jaber' },
  { name: 'Amira Shammout', email: 'amira.shammout@email.com', phone: '+962 79 234 5679', location: 'Amman, Jordan', years: 3, linkedIn: 'https://linkedin.com/in/amira-shammout' },
  { name: 'Ziad Murad', email: 'ziad.murad@email.com', phone: '+962 78 345 6780', location: 'Amman, Jordan', years: 7, linkedIn: 'https://linkedin.com/in/ziad-murad' },
  { name: 'Nadia Rahhal', email: 'nadia.rahhal@email.com', phone: '+962 77 456 7891', location: 'Jerusalem', years: 2, linkedIn: 'https://linkedin.com/in/nadia-rahhal' },
  { name: 'Ibrahim Qudah', email: 'ibrahim.qudah@email.com', phone: '+962 79 567 8902', location: 'Amman, Jordan', years: 5, linkedIn: 'https://linkedin.com/in/ibrahim-qudah' },
  { name: 'Maha Sweiss', email: 'maha.sweiss@email.com', phone: '+962 78 678 9013', location: 'Amman, Jordan', years: 1, linkedIn: 'https://linkedin.com/in/maha-sweiss' },
  { name: 'George Nassar', email: 'george.nassar@email.com', phone: '+962 77 789 0124', location: 'Amman, Jordan', years: 8, linkedIn: 'https://linkedin.com/in/george-nassar' },
  { name: 'Fatima Alami', email: 'fatima.alami@email.com', phone: '+962 79 890 1235', location: 'Amman, Jordan', years: 0, linkedIn: 'https://linkedin.com/in/fatima-alami' },
  { name: 'Rami Khreis', email: 'rami.khreis@email.com', phone: '+962 78 901 2346', location: 'Amman, Jordan', years: 4, linkedIn: 'https://linkedin.com/in/rami-khreis' },
  { name: 'Salma Bdeir', email: 'salma.bdeir@email.com', phone: '+962 77 012 3457', location: 'Amman, Jordan', years: 3, linkedIn: 'https://linkedin.com/in/salma-bdeir' },
];

const COVER_LETTERS = [
  'I am excited to apply for this role at ODEH & PARTNERS DESIGN. My background in structural engineering aligns closely with your project portfolio across the Middle East.',
  'With hands-on experience in reinforced concrete and steel design, I am confident I can contribute to your design team from day one.',
  'ODEH\'s reputation for engineering excellence is what drew me to this opportunity. I would welcome the chance to discuss how my skills fit your needs.',
  'I have followed your firm\'s work on several landmark projects and am eager to bring my technical expertise and collaborative approach to your team.',
  'Having completed multiple structural design projects using ETABS and SAFE, I am well-prepared to support your ongoing and upcoming developments.',
  'I am a motivated engineer seeking to grow within a firm that values precision, innovation, and professional development.',
  'My internship and project experience have given me a strong foundation in structural analysis, BIM coordination, and site support.',
  'I am particularly interested in contributing to complex structural systems and learning from your senior engineering team.',
];

const CV_NAMES = [
  'Ahmad_AlKhatib_CV.pdf',
  'Layla_Mansour_Resume.pdf',
  'Omar_Haddad_CV_2026.pdf',
  'Sara_Nasser_Structural_Engineer.pdf',
  'Khalid_Barakat_CV.pdf',
  'Nour_Abed_Application.pdf',
  'Youssef_Hamdan_Resume.pdf',
  'Rania_Saleh_CV.pdf',
  'Tariq_Zayed_Engineering_CV.pdf',
  'Hana_Qasem_Resume.pdf',
];

const CV_SIZES = ['245 KB', '312 KB', '189 KB', '428 KB', '276 KB', '198 KB', '356 KB', '221 KB', '387 KB', '164 KB'];

const INTERNAL_NOTES = [
  { author: 'HR Team', content: 'Strong technical background. Schedule initial screening call.' },
  { author: 'Hiring Manager', content: 'Relevant project experience with high-rise structures. Worth shortlisting.' },
  { author: 'HR Team', content: 'Follow up on missing portfolio samples mentioned in cover letter.' },
  { author: 'Engineering Lead', content: 'ETABS proficiency confirmed. Recommend moving to technical interview.' },
  { author: 'HR Team', content: 'Candidate referred by current team member — priority review.' },
];

function deterministicHash(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return hash;
}

function buildDate(baseDaysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - baseDaysAgo);
  return date.toISOString().split('T')[0];
}

function buildTimestamp(baseDaysAgo, hourOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() - baseDaysAgo);
  date.setHours(9 + hourOffset, 30, 0, 0);
  return date.toISOString();
}

function buildTimeline(status, submittedDaysAgo, lastUpdated) {
  const events = [
    {
      id: 'submitted',
      label: 'Application Submitted',
      description: 'Candidate submitted application via careers form',
      timestamp: buildTimestamp(submittedDaysAgo, 0),
      type: 'submitted',
    },
  ];

  if (status !== 'new') {
    events.push({
      id: 'reviewed',
      label: 'Marked as Reviewed',
      description: 'Application reviewed by HR team',
      timestamp: buildTimestamp(submittedDaysAgo - 1, 2),
      type: 'reviewed',
    });
  }

  if (status === 'shortlisted' || status === 'hired') {
    events.push({
      id: 'shortlisted',
      label: 'Shortlisted',
      description: 'Candidate advanced to shortlist',
      timestamp: buildTimestamp(submittedDaysAgo - 2, 4),
      type: 'shortlisted',
    });
  }

  if (status === 'rejected') {
    events.push({
      id: 'rejected',
      label: 'Application Rejected',
      description: 'Candidate notified — position filled',
      timestamp: buildTimestamp(submittedDaysAgo - 2, 3),
      type: 'rejected',
    });
  }

  if (status === 'hired') {
    events.push({
      id: 'hired',
      label: 'Offer Accepted',
      description: 'Candidate hired for the position',
      timestamp: buildTimestamp(submittedDaysAgo - 3, 1),
      type: 'hired',
    });
  }

  if (events.length > 1) {
    events.push({
      id: 'updated',
      label: 'Last Updated',
      description: 'Application record updated',
      timestamp: lastUpdated,
      type: 'system',
    });
  }

  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function buildNotes(count, appId) {
  if (count === 0) return [];

  return Array.from({ length: Math.min(count, 3) }).map((_, index) => {
    const note = INTERNAL_NOTES[(appId + index) % INTERNAL_NOTES.length];
    return {
      id: `note-${appId}-${index}`,
      author: note.author,
      content: note.content,
      createdAt: buildTimestamp(index + 1, index + 1),
    };
  });
}

function buildApplications() {
  const applications = [];
  let globalId = 1;
  let applicantIndex = 0;

  adminJobs.forEach((job) => {
    const count = job.applicationsCount;

    for (let i = 0; i < count; i += 1) {
      const applicant = APPLICANT_POOL[applicantIndex % APPLICANT_POOL.length];
      applicantIndex += 1;

      const seed = `${job.slug}-${i}`;
      const hash = deterministicHash(seed);
      const status = STATUSES[hash % STATUSES.length];
      const source = SOURCES[hash % SOURCES.length];
      const submittedDaysAgo = (hash % 60) + 1;
      const notesCount = status === 'new' ? 0 : (hash % 4);
      const submittedDate = buildDate(submittedDaysAgo);
      const lastUpdated = buildTimestamp(Math.max(submittedDaysAgo - 3, 0), hash % 6);

      const uniqueSuffix = globalId;
      const emailParts = applicant.email.split('@');

      applications.push({
        id: globalId,
        applicantName: `${applicant.name}${i > 0 ? ` (${i + 1})` : ''}`,
        email: `${emailParts[0]}+${uniqueSuffix}@${emailParts[1]}`,
        phone: applicant.phone,
        location: applicant.location,
        jobTitle: job.title,
        jobId: job.id,
        department: job.department,
        yearsOfExperience: applicant.years,
        linkedInUrl: applicant.linkedIn,
        coverLetterPreview: COVER_LETTERS[hash % COVER_LETTERS.length],
        cvFileName: CV_NAMES[hash % CV_NAMES.length],
        cvFileSize: CV_SIZES[hash % CV_SIZES.length],
        submittedDate,
        status,
        source,
        notesCount,
        lastUpdated,
        notes: buildNotes(notesCount, globalId),
        timeline: buildTimeline(status, submittedDaysAgo, lastUpdated),
      });

      globalId += 1;
    }
  });

  return applications.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
}

export const adminApplications = buildApplications();

export function getApplicationById(id) {
  return adminApplications.find((app) => app.id === id) ?? null;
}

export function getApplicationsByJobId(jobId) {
  return adminApplications.filter((app) => app.jobId === jobId);
}

export const applicationStatusLabels = {
  new: 'New',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  hired: 'Hired',
};
