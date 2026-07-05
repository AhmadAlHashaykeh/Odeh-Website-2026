const OFFICE = '/assets/about/office';

export const overviewContent = {
  meta: {
    title: 'About Us | ODEH & PARTNERS DESIGN',
    description:
      'Welcome to the online platform of ODEH & PARTNERS DESIGN, an avant-garde structural design firm with a global vision.',
  },

  hero: {
    label: 'About Us',
    title: 'Overview',
    description:
      'A global structural engineering practice delivering innovative, transformative solutions across the Middle East and beyond.',
    backgroundImage: `${OFFICE}/img-03.webp`,
    ariaLabel: 'About Us Overview',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about/overview' },
      { label: 'Overview' },
    ],
  },

  content: {
    title: 'ODEH & PARTNERS DESIGN',
    description:
      'Welcome to the online platform of ODEH & PARTNERS DESIGN, an avant-garde structural design firm with a global vision. Our practice transcends conventional boundaries as we offer ingenious solutions to ever-evolving challenges. Our success emanates from a unique approach, encompassing innovative concepts, diverse market penetrations, profound cultural insights, and ultimately, transformative solutions. The depth of knowledge that underpins our services, spanning from initial concepts to final construction, is a testament to our collective global ingenuity.',
    image: {
      src: `${OFFICE}/img-05.webp`,
      alt: 'Engineering team collaborating at ODEH & PARTNERS DESIGN',
    },
  },

  slider: {
    label: 'Our Office',
    description:
      'A glimpse into our workspace — where engineering excellence meets collaborative design.',
    images: [
      { src: `${OFFICE}/img-01.webp`, alt: 'Glass-partitioned workspace at ODEH & PARTNERS DESIGN' },
      { src: `${OFFICE}/img-02.webp`, alt: 'Open-plan engineering office with team at work' },
      { src: `${OFFICE}/img-03.webp`, alt: 'Modern office with floor-to-ceiling windows' },
      { src: `${OFFICE}/img-04.webp`, alt: 'Overview of the ODEH & PARTNERS DESIGN workspace' },
      { src: `${OFFICE}/img-05.webp`, alt: 'Engineers reviewing structural designs together' },
    ],
  },
};
