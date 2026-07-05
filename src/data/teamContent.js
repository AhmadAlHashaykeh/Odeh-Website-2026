const TEAM = '/assets/about/team';

function toEmail(name) {
  const parts = name.replace(/,.*$/, '').trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0].toLowerCase()}.${parts[parts.length - 1].toLowerCase()}@odehdesign.com`;
  }
  return `${parts[0].toLowerCase()}@odehdesign.com`;
}

function member(slug, name, title, experience, photoFile) {
  return {
    slug,
    name,
    title,
    experience,
    photo: `${TEAM}/${photoFile}`,
    email: toEmail(name),
  };
}

export const teamContent = {
  meta: {
    title: 'Team Members | ODEH & PARTNERS DESIGN',
    description:
      'Meet the engineers, designers, and professionals at ODEH & PARTNERS DESIGN — the team behind every structure.',
  },

  hero: {
    label: 'About Us',
    title: 'Team Members',
    subtitle: 'The Experts Behind Every Structure',
    description:
      'Meet the engineers, designers, and professionals whose expertise transforms ambitious ideas into remarkable structural achievements.',
    backgroundImage: `${TEAM}/hero.webp`,
    ariaLabel: 'About Us Team Members',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about/overview' },
      { label: 'Team Members' },
    ],
  },

  members: [
    member('member-01', 'Alexandra Reed', 'Founder & CEO', '21+ Years', 'mohammad-odeh.webp'),
    member('member-02', 'Marcus Ellington', 'Associate Partner, Projects Manager', '12+ Years', 'mohammad-al-najjar.webp'),
    member('member-03', 'Sofia Hartmann', 'Associate Partner, Senior Structural Engineer', '8+ Years', 'yazan-abu-al-hayja.webp'),
    member('member-04', 'Daniel Whitfield', 'Senior Structural Engineer', '7+ Years', 'basel-abu-asal.webp'),
    member('member-05', 'Elena Vasquez', 'Senior Structural Engineer', '7+ Years', 'khalid-dawodi.webp'),
    member('member-06', 'James Carter', 'Senior Structural QC Engineer', '7+ Years', 'mahmoud-saleh.webp'),
    member('member-07', 'Nathan Brooks', 'Steel Structures Section Head', '7+ Years', 'mazin-hijazi.webp'),
    member('member-08', 'Olivia Chen', 'Structural Engineer', '6+ Years', 'yazan-abu-alia.webp'),
    member('member-09', 'Ryan Mitchell', 'Structural Engineer / Technical Lead', '5+ Years', 'tarek-ammouri.webp'),
    member('member-10', 'Hannah Sullivan', 'Structural Engineer', '5+ Years', 'abdullah-odat.webp'),
    member('member-11', 'Lucas Bennett', 'Structural Engineer', '4+ Years', 'abdulrahman-jadallah.webp'),
    member('member-12', 'Emma Richardson', 'Structural Engineer', '3+ Years', 'malek-al-attar.webp'),
    member('member-13', 'Noah Patterson', 'Structural Engineer', '3+ Years', 'zaid-al-nwerat.webp'),
    member('member-14', 'Chloe Anderson', 'Structural Engineer', '2+ Years', 'mohammed-al-yousef.webp'),
    member('member-15', 'Ethan Cooper', 'Structural Engineer', '2+ Years', 'mohammed-al-faqi.webp'),
    member('member-16', 'Mia Thompson', 'Structural Engineer', '2+ Years', 'mohammad-bani-ahmad.webp'),
    member('member-17', 'Benjamin Hayes', 'Structural Engineer', '2+ Years', 'ahmad-mustafa.webp'),
    member('member-18', 'Isabella Wright', 'Structural Engineer', '2+ Years', 'mohammad-kuzmar.webp'),
    member('member-19', 'Samuel Foster', 'Structural Engineer', '1+ Years', 'hamzeh-sawalmeh.webp'),
    member('member-20', 'Victoria Lane', 'Senior IT Support Technician', '20+ Years', 'ashraf.webp'),
    member('member-21', 'Christopher Shaw', 'Senior Site Engineer', '12+ Years', 'mohammad-yaghi.webp'),
  ],
};
