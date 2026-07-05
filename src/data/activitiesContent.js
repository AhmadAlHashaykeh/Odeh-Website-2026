const ACTIVITIES = '/assets/about/activities';

function img(file, alt) {
  return { src: `${ACTIVITIES}/${file}`, alt };
}

function activity({
  id,
  slug,
  title,
  date,
  location,
  description,
  coverImage,
  gallery,
}) {
  return {
    id,
    slug,
    title,
    date,
    location,
    description,
    coverImage,
    gallery,
  };
}

const activities = [
  activity({
    id: 9,
    slug: 'eftar-ramadan',
    title: 'Eftar Ramadan',
    date: '13 April 2022',
    location: 'Amman, Jordan',
    description: [
      'A shared iftar gathering bringing the ODEH & PARTNERS DESIGN team together during Ramadan — a moment of reflection, connection, and appreciation beyond the workplace.',
    ],
    coverImage: `${ACTIVITIES}/1694428846_3967.jpg`,
    gallery: [
      img('1694428846_3967.jpg', 'Eftar Ramadan gathering at ODEH & PARTNERS DESIGN'),
      img('activity_1694428846299.jpg', 'Team members during the Ramadan iftar event'),
      img('activity_1694428846502.jpg', 'Colleagues sharing an iftar meal together'),
      img('activity_1694505373998.jpg', 'Ramadan celebration with the ODEH team'),
    ],
  }),
  activity({
    id: 10,
    slug: 'site-visits',
    title: 'Site Visits',
    date: 'September 2023',
    location: 'Jordan',
    description: [
      'Regular site visits keep our engineers connected to the projects they design — observing construction progress, reviewing structural details on the ground, and collaborating with site teams in real time.',
    ],
    coverImage: `${ACTIVITIES}/1694430952_7798.jpeg`,
    gallery: [
      img('1694430952_7798.jpeg', 'Engineers on a project site visit'),
      img('activity_1694503570575.jpg', 'Structural inspection during a site visit'),
      img('activity_1694503570209.jpg', 'Team reviewing construction on site'),
      img('activity_169450357087.jpg', 'On-site engineering assessment'),
      img('activity_1694503570655.jpg', 'Site visit documentation'),
      img('activity_1694503570574.jpg', 'Engineers coordinating with site supervisors'),
      img('activity_1694503570118.jpg', 'Field review of structural elements'),
      img('activity_1694503570991.jpg', 'Construction progress observation'),
      img('activity_1694503570947.jpg', 'Site team collaboration'),
      img('activity_1694503570609.jpg', 'Structural details inspection on site'),
      img('activity_1694503570838.jpg', 'Engineering team at project site'),
      img('activity_1694504843573.jpg', 'Site visit with ODEH engineers'),
    ],
  }),
  activity({
    id: 11,
    slug: 'weddings',
    title: 'Weddings',
    date: 'September 2023',
    location: 'Jordan',
    description: [
      'Celebrating the weddings of our team members — sharing in the milestones that shape our colleagues\' lives and strengthening the bonds that make our practice a true family.',
    ],
    coverImage: `${ACTIVITIES}/1694505128_4048.jpeg`,
    gallery: [
      img('1694505128_4048.jpeg', 'Team celebration at a colleague wedding'),
      img('activity_169450512837.jpg', 'Wedding celebration with ODEH team members'),
      img('activity_1694505128269.jpg', 'Colleagues at a team member wedding'),
    ],
  }),
  activity({
    id: 12,
    slug: 'trips',
    title: 'Trips',
    date: 'September 2023',
    location: 'Jordan',
    description: [
      'Team trips beyond the office — shared experiences that build camaraderie, refresh perspective, and remind us that the strength of our practice lies in the people behind every structure.',
    ],
    coverImage: `${ACTIVITIES}/1694504294_6706.jpeg`,
    gallery: [
      img('1694504294_6706.jpeg', 'ODEH team on a group trip'),
      img('activity_1694505680583.jpg', 'Team members during a company trip'),
      img('activity_1694505711440.jpg', 'Colleagues enjoying a team outing'),
      img('activity_1694505902798.jpg', 'Group photo from a team trip'),
    ],
  }),
];

export const activitiesContent = {
  meta: {
    title: 'Activities | ODEH & PARTNERS DESIGN',
    description:
      'Explore the moments, milestones, and events that define ODEH & PARTNERS DESIGN — iftar gatherings, site visits, celebrations, and team trips.',
  },

  hero: {
    label: 'About Us',
    title: 'Activities',
    description:
      'Explore the moments, milestones, and events that define ODEH & PARTNERS DESIGN.',
    backgroundImage: `${ACTIVITIES}/hero.jpg`,
    ariaLabel: 'About Us Activities',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about/overview' },
      { label: 'Activities' },
    ],
  },

  activities,
};

export function getActivityBySlug(slug) {
  return activities.find((item) => item.slug === slug) ?? null;
}

export function getAllActivitySlugs() {
  return activities.map((item) => item.slug);
}

export function getAdjacentActivities(slug) {
  const index = activities.findIndex((item) => item.slug === slug);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? activities[index - 1] : null,
    next: index < activities.length - 1 ? activities[index + 1] : null,
  };
}

export function getRelatedActivities(slug, count = 3) {
  return activities.filter((item) => item.slug !== slug).slice(0, count);
}
