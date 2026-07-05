const OFFICE = '/assets/about/office';

export const searchContent = {
  meta: {
    title: 'Search | ODEH & PARTNERS DESIGN',
    description:
      'Search across projects, activities, careers, and pages on the ODEH & PARTNERS DESIGN website.',
  },
  hero: {
    label: 'Search',
    title: 'Search Results',
    description: 'Find projects, activities, career opportunities, and pages across our website.',
    backgroundImage: `${OFFICE}/img-03.webp`,
    compact: true,
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Search' },
    ],
  },
  empty: {
    heading: 'No results found.',
    primaryLabel: 'Return Home',
    primaryTo: '/',
  },
};
