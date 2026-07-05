/**
 * Mock contact form messages from the public Reach Out form.
 * Frontend-only — no API integration.
 */

const STATUSES = ['new', 'read', 'replied', 'archived'];
const PRIORITIES = ['normal', 'high', 'urgent'];
const INQUIRY_TYPES = [
  'general-inquiry',
  'project-request',
  'career-inquiry',
  'partnership',
  'media-press',
  'other',
];
const SOURCE_PAGES = ['Reach Out', 'Connect Page', 'Home Page Footer', 'Project Detail Page', 'Careers Page'];
const ASSIGNEES = [null, 'Sarah Al-Odeh', 'Mohammad Nasser', 'HR Team', 'Partnerships Desk', 'Project Desk'];

const SENDERS = [
  { name: 'Rami Khoury', email: 'rami.khoury@alsharqdev.com', phone: '+962 79 234 5678', company: 'Al-Sharq Development' },
  { name: 'Nadia Rahhal', email: 'nadia.rahhal@horizon.ae', phone: '+971 50 345 6789', company: 'Horizon Properties LLC' },
  { name: 'George Nassar', email: 'george.n@buildcorp.jo', phone: '+962 78 456 7890', company: 'BuildCorp Jordan' },
  { name: 'Fatima Alami', email: 'fatima.alami@designstudio.co', phone: '+962 77 567 8901', company: 'Studio Alami' },
  { name: 'Walid Suleiman', email: 'walid.s@capitalgroup.com', phone: '+962 79 678 9012', company: 'Capital Group Holdings' },
  { name: 'Maya Khoury', email: 'maya.khoury@email.com', phone: '+962 78 789 0123', company: '' },
  { name: 'Karim Darwish', email: 'karim.d@urbanplan.ps', phone: '+970 59 890 1234', company: 'Urban Plan Associates' },
  { name: 'Reem Odeh', email: 'reem.odeh@email.com', phone: '+962 77 901 2345', company: 'Independent Consultant' },
  { name: 'Samir Totah', email: 'samir.totah@megaproject.jo', phone: '+962 79 012 3456', company: 'MegaProject Engineering' },
  { name: 'Yasmin Kanaan', email: 'yasmin.k@pressmedia.com', phone: '+962 78 123 4567', company: 'Press Media Group' },
  { name: 'Hassan Jaber', email: 'hassan.jaber@university.edu.jo', phone: '+962 77 234 5678', company: 'University of Jordan' },
  { name: 'Amira Shammout', email: 'amira.s@talentbridge.com', phone: '+962 79 345 6789', company: 'TalentBridge Recruiting' },
  { name: 'Ziad Murad', email: 'ziad.murad@luxehotels.com', phone: '+962 78 456 7890', company: 'Luxe Hotels & Resorts' },
  { name: 'Ibrahim Qudah', email: 'ibrahim.q@greenfield.jo', phone: '+962 77 567 8901', company: 'Greenfield Investments' },
  { name: 'Maha Sweiss', email: 'maha.sweiss@email.com', phone: '+962 79 678 9012', company: '' },
  { name: 'Layla Mansour', email: 'layla.m@archdigest.com', phone: '+971 55 789 0123', company: 'Architecture Digest MENA' },
  { name: 'Omar Haddad', email: 'omar.haddad@retailgroup.jo', phone: '+962 78 890 1234', company: 'Retail Group International' },
  { name: 'Sara Nasser', email: 'sara.nasser@healthcare.jo', phone: '+962 77 901 2345', company: 'Healthcare Facilities Co.' },
  { name: 'Khalid Barakat', email: 'khalid.b@mixeduse.dev', phone: '+962 79 012 3456', company: 'Mixed-Use Developers' },
  { name: 'Nour Abed', email: 'nour.abed@email.com', phone: '+962 78 123 4567', company: '' },
  { name: 'Youssef Hamdan', email: 'youssef.h@infrastructure.jo', phone: '+962 77 234 5678', company: 'Infrastructure Partners' },
  { name: 'Rania Saleh', email: 'rania.s@culturaltrust.org', phone: '+962 79 345 6789', company: 'Cultural Heritage Trust' },
  { name: 'Tariq Zayed', email: 'tariq.z@smartcity.ae', phone: '+971 50 456 7890', company: 'Smart City Ventures' },
  { name: 'Hana Qasem', email: 'hana.q@student.edu', phone: '+962 78 567 8901', company: 'Graduate Student' },
  { name: 'Fadi Awad', email: 'fadi.awad@contractors.jo', phone: '+962 77 678 9012', company: 'Awad Contracting' },
  { name: 'Bassam Nabulsi', email: 'bassam.n@realestate.jo', phone: '+962 79 789 0123', company: 'Nabulsi Real Estate' },
  { name: 'Dina Faris', email: 'dina.f@boutiquehotel.com', phone: '+962 78 890 1234', company: 'Boutique Hotel Collection' },
  { name: 'Lina Hijazi', email: 'lina.h@partnership.co', phone: '+962 77 901 2345', company: 'Global Design Alliance' },
];

const SUBJECTS = [
  'Mixed-use tower structural design consultation',
  'Partnership inquiry — regional expansion',
  'Request for proposal: commercial complex',
  'Career opportunity — senior architect role',
  'Media interview request for CEO',
  'General inquiry about firm capabilities',
  'Hospital expansion project feasibility',
  'Retail mall renovation engineering support',
  'University campus master plan collaboration',
  'Luxury hotel structural assessment',
  'Heritage building restoration consultation',
  'Smart city infrastructure partnership',
  'High-rise residential tower inquiry',
  'Green building certification support',
  'Internship and graduate program question',
  'Press coverage for landmark project',
  'Government tender pre-qualification',
  'Design-build partnership discussion',
  'Site visit and project briefing request',
  'Competitive bid documentation request',
];

const MESSAGES = [
  'We are developing a 32-story mixed-use tower in Amman and would like to discuss structural engineering services for the project. Our timeline targets design completion within 14 months.',
  'ODEH\'s portfolio across the Gulf and Levant aligns with our expansion strategy. We would welcome a conversation about a strategic design partnership for upcoming developments.',
  'Please share your capabilities and availability for a 45,000 sqm commercial complex in Abdali. We need full structural design, BIM coordination, and site supervision.',
  'I am a licensed architect with 8 years of experience in high-rise design. I noticed your open positions and would like to learn more about the senior architect role.',
  'We are preparing a feature on engineering excellence in the Middle East and would like to interview your leadership team about the King Hussein Medical City project.',
  'Could you provide an overview of your firm\'s services, typical project scale, and geographic coverage? We are evaluating consultants for future developments.',
  'Our healthcare group is planning a 200-bed hospital expansion. We need preliminary structural assessments and cost estimates for the addition.',
  'We are renovating a 15,000 sqm retail mall and require structural modifications for new anchor tenants. Can your team support phased construction?',
  'The university is updating its campus master plan and seeks a structural engineering partner for new faculty buildings and student housing.',
  'Our luxury hotel chain requires a structural assessment of an existing 12-story property before a major interior renovation and rooftop addition.',
  'We are restoring a 19th-century heritage building and need expertise in adaptive reuse and seismic retrofitting. Your Al-Hussein Mosque work is exemplary.',
  'Our smart city initiative includes bridges, transit hubs, and public buildings. We would like to explore a framework agreement for engineering services.',
  'We have acquired land for a 28-floor residential tower and need a full structural design package including foundation studies and wind analysis.',
  'Our project targets LEED Platinum certification. We need structural solutions that support sustainable design goals and green roof systems.',
  'I am a final-year civil engineering student interested in your graduate program. Could someone from HR provide details on internships and application deadlines?',
  'We would like permission to photograph your completed King Hussein Medical City project for an upcoming architecture publication.',
  'We are pre-qualifying engineering firms for a government infrastructure tender. Please confirm your registration and provide relevant project references.',
  'Our design-build team is assembling partners for a mixed-use development. We believe ODEH\'s structural expertise would strengthen our bid.',
  'We would like to schedule a site visit and project briefing for our board members who are evaluating engineering consultants for a new development.',
  'We are preparing a competitive bid and need clarification on your typical fee structure and deliverables for structural design services.',
];

const INTERNAL_NOTES = [
  { author: 'Sarah Al-Odeh', content: 'High-value project lead — schedule intro call with project desk.' },
  { author: 'Project Desk', content: 'Sent capability deck and project references. Awaiting client response.' },
  { author: 'HR Team', content: 'Forwarded to hiring manager for career inquiry follow-up.' },
  { author: 'Partnerships Desk', content: 'Partnership terms under internal review. Legal looped in.' },
  { author: 'Mohammad Nasser', content: 'Client called back — interested in phased engagement model.' },
];

export const contactMessageStatusLabels = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
};

export const contactMessagePriorityLabels = {
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
};

export const inquiryTypeLabels = {
  'general-inquiry': 'General Inquiry',
  'project-request': 'Project Request',
  'career-inquiry': 'Career Inquiry',
  partnership: 'Partnership',
  'media-press': 'Media / Press',
  other: 'Other',
};

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

function buildTimeline(status, submittedDaysAgo, lastUpdated, assignedTo) {
  const events = [
    {
      id: 'submitted',
      label: 'Message Received',
      description: 'Inquiry submitted via website contact form',
      timestamp: buildTimestamp(submittedDaysAgo, 0),
      type: 'submitted',
    },
  ];

  if (status !== 'new') {
    events.push({
      id: 'read',
      label: 'Marked as Read',
      description: 'Message opened and reviewed by admin team',
      timestamp: buildTimestamp(submittedDaysAgo - 1, 1),
      type: 'read',
    });
  }

  if (assignedTo) {
    events.push({
      id: 'assigned',
      label: 'Assigned',
      description: `Assigned to ${assignedTo}`,
      timestamp: buildTimestamp(submittedDaysAgo - 1, 3),
      type: 'assigned',
    });
  }

  if (status === 'replied' || status === 'archived') {
    events.push({
      id: 'replied',
      label: 'Reply Sent',
      description: 'Response sent to sender (preview mode)',
      timestamp: buildTimestamp(submittedDaysAgo - 2, 2),
      type: 'replied',
    });
  }

  if (status === 'archived') {
    events.push({
      id: 'archived',
      label: 'Archived',
      description: 'Message moved to archive',
      timestamp: buildTimestamp(submittedDaysAgo - 2, 5),
      type: 'archived',
    });
  }

  if (events.length > 1) {
    events.push({
      id: 'updated',
      label: 'Last Updated',
      description: 'Message record updated',
      timestamp: lastUpdated,
      type: 'system',
    });
  }

  return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function buildNotes(count, msgId) {
  if (count === 0) return [];

  return Array.from({ length: Math.min(count, 3) }).map((_, index) => {
    const note = INTERNAL_NOTES[(msgId + index) % INTERNAL_NOTES.length];
    return {
      id: `note-${msgId}-${index}`,
      author: note.author,
      content: note.content,
      createdAt: buildTimestamp(index + 1, index + 2),
    };
  });
}

function buildMessages() {
  return SENDERS.map((sender, index) => {
    const seed = `contact-${index}`;
    const hash = deterministicHash(seed);
    const status = STATUSES[hash % STATUSES.length];
    const priority = PRIORITIES[(hash + 3) % PRIORITIES.length];
    const inquiryType = INQUIRY_TYPES[(hash + 1) % INQUIRY_TYPES.length];
    const sourcePage = SOURCE_PAGES[hash % SOURCE_PAGES.length];
    const assignedTo = status === 'new' ? null : ASSIGNEES[(hash + 2) % ASSIGNEES.length];
    const submittedDaysAgo = (hash % 75) + 1;
    const notesCount = status === 'new' ? 0 : (hash % 4);
    const submittedDate = buildDate(submittedDaysAgo);
    const lastUpdated = buildTimestamp(Math.max(submittedDaysAgo - 3, 0), hash % 6);
    const message = MESSAGES[index % MESSAGES.length];

    return {
      id: index + 1,
      senderName: sender.name,
      email: sender.email,
      phone: sender.phone,
      company: sender.company || '—',
      subject: SUBJECTS[index % SUBJECTS.length],
      message,
      messagePreview: message.length > 120 ? `${message.slice(0, 120)}…` : message,
      inquiryType,
      status,
      priority,
      sourcePage,
      submittedDate,
      lastUpdated,
      assignedTo,
      notesCount,
      notes: buildNotes(notesCount, index + 1),
      timeline: buildTimeline(status, submittedDaysAgo, lastUpdated, assignedTo),
    };
  }).sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
}

export const adminContactMessages = buildMessages();

export function getContactMessageById(id) {
  return adminContactMessages.find((msg) => msg.id === id) ?? null;
}
