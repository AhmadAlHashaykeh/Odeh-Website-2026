import { services } from '../../../../data/services';
import { featuredProjects } from '../../../../data/projects';

/**
 * Mock homepage CMS data derived from public website source files.
 * Hero.jsx, About.jsx, Services.jsx, Projects.jsx, HomePage.jsx
 */

export const initialHeroSection = {
  id: 'hero',
  badge: 'Trusted Structural Engineering Partner Across the Middle East',
  headingMain: 'ODEH & PARTNERS',
  headingAccent: 'DESIGN',
  description:
    'Delivering innovative structural engineering and design solutions across the Middle East with expertise, precision, and sustainability.',
  stats: [
    { value: '1000+', label: 'Projects Delivered' },
    { value: '7+', label: 'Years of Practice' },
    { value: 'Middle East', label: 'Regional Focus' },
  ],
  primaryCta: { label: 'Explore Projects', path: '/projects' },
  secondaryCta: { label: 'Reach Out', path: '/reach-out' },
  posterImage: '/hero-poster.jpg',
  videoSrc: '/video-slider.mp4',
};

export const initialAboutSection = {
  id: 'about',
  sectionLabel: 'About Us',
  titleMain: 'ODEH &',
  titleAccent: 'PARTNERS DESIGN',
  body:
    'Welcome to the online platform of ODEH & PARTNERS DESIGN, an avant-garde structural design firm with a global vision. Our practice transcends conventional boundaries by delivering innovative engineering solutions backed by technical expertise, cultural insight, and a commitment to excellence. From concept to construction, we create sustainable structures that shape the future of the built environment.',
  stats: [
    { value: '7+', label: 'Years of Excellence' },
    { value: '1000+', label: 'Projects Completed' },
  ],
  image: '/assets/about/odeh-about-office.webp',
  imageAlt: 'ODEH & PARTNERS DESIGN workspace',
  readMoreLabel: 'Read More',
  readMorePath: '/about/overview',
};

export const initialServicesSection = {
  id: 'services',
  sectionLabel: 'What We Do',
  heading: 'Our Services',
  description:
    "A dedicated section showcasing the company's primary engineering and consulting services.",
  services: services.map((service, index) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    image: service.image,
    path: service.path,
    order: index + 1,
  })),
};

export const initialProjectsSection = {
  id: 'projects',
  sectionLabel: 'Selected Projects',
  heading: 'Engineering Excellence Across the Middle East',
  description:
    'Landmark structures and infrastructure delivered with precision — a curated selection from our portfolio across the region.',
  projects: featuredProjects.slice(0, 3).map((project, index) => ({
    id: project.id,
    title: project.title,
    category: project.category,
    location: project.location,
    description: project.description,
    image: project.image,
    slug: project.slug,
    categorySlug: project.categorySlug,
    order: index + 1,
  })),
  viewAllLabel: 'View All Projects',
  viewAllPath: '/projects',
};

export const initialSeoMeta = {
  title: 'ODEH & PARTNERS DESIGN',
  description:
    'ODEH & PARTNERS DESIGN — Innovative structural engineering and design solutions across the Middle East.',
};

export const initialHomePageSections = {
  hero: initialHeroSection,
  about: initialAboutSection,
  services: initialServicesSection,
  projects: initialProjectsSection,
  seo: initialSeoMeta,
};

export const homepageLastUpdated = '2026-03-15';
