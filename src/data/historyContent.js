const HISTORY = '/assets/about/history';

export const historyContent = {
  meta: {
    title: 'History | ODEH & PARTNERS DESIGN',
    description:
      'Discover the journey of ODEH & PARTNERS DESIGN — from a visionary engineer\'s beginnings to Jordan\'s leading structural engineering firm.',
  },

  hero: {
    label: 'About Us',
    title: 'History',
    description:
      'Building a legacy of structural excellence through innovation, engineering precision, and continuous growth.',
    backgroundImage: `${HISTORY}/hero.webp`,
    ariaLabel: 'About Us History',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about/overview' },
      { label: 'History' },
    ],
  },

  story: {
    label: 'Our Story',
    title: 'Every Great Structure Begins with a Vision',
    lead: 'ODEH DESIGN BUREAU',
    body:
      "The journey starts with a glimpse into the inception and growth of our office-a tale woven by the visionary engineer Mohammad Odeh. In 2006, his voyage commenced, working briefly alongside prominent corporate entities within the nation. However, the seeds of distinction were sown as his boldness in crafting uncharted designs caught their attention. Following their guidance, he embarked on an independent path, driven by unbridled design prowess. As he connected with clients and honed his skills, the turning point came in 2018. With unwavering determination, he established the office. Today, we proudly stand as Jordan's leading structural design firm, a testament to Engineer Mohammad Odeh's journey from inception to excellence-a journey that continues to shape our present and inspire our future.",
  },

  counters: {
    items: [
      { label: 'Years of Experience', value: '8+' },
      { label: 'Qualified Employees', value: '30+' },
    ],
  },

  growthTable: {
    label: 'Growth Metrics',
    title: '8 Years of Continuous Growth',
    columns: [
      { key: 'year', label: 'Year' },
      { key: 'projects', label: 'Completed Projects', align: 'right' },
      { key: 'area', label: 'Area of Completed Projects (m²)', align: 'right' },
    ],
    rows: [
      { year: 2018, projects: 85, area: 160210 },
      { year: 2019, projects: 93, area: 203850 },
      { year: 2020, projects: 104, area: 167275 },
      { year: 2021, projects: 118, area: 175754 },
      { year: 2022, projects: 130, area: 406000 },
      { year: 2023, projects: 160, area: 544040 },
      { year: 2024, projects: 190, area: 612462 },
      { year: 2025, projects: 164, area: 744242 },
    ],
  },
};
