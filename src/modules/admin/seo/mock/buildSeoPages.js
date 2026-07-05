import { overviewContent } from '../../../../data/overviewContent';
import { approachContent } from '../../../../data/approachContent';
import { historyContent } from '../../../../data/historyContent';
import { teamContent } from '../../../../data/teamContent';
import { activitiesContent } from '../../../../data/activitiesContent';
import { projectsContent, getAllCategories, getCategoryTitle } from '../../../../data/projectsContent';
import { careersContent, jobs, getJobPath, getJobApplyPath, getJobApplyThankYouPath } from '../../../../data/careers';
import { reachOutContent } from '../../../../data/reachOutContent';
import { searchContent } from '../../../../data/searchContent';
import { privacyPolicyContent } from '../../../../data/privacyPolicyContent';
import { termsContent } from '../../../../data/termsContent';
import { thankYouContent } from '../../../../data/thankYouContent';
import { connectContent } from '../../../../data/connectLinks';
import { services } from '../../../../data/services';
import { homepageLastUpdated } from '../../home-page/mock/homePageData';

function formatPlaceholderPageName(pathname) {
  return (
    pathname
      .replace(/^\//, '')
      .replace(/\//g, ' / ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase()) || 'Page'
  );
}

function buildPlaceholderMeta(pathname) {
  const pageName = formatPlaceholderPageName(pathname);
  return {
    title: `${pageName} | ODEH & PARTNERS DESIGN`,
    description: `${pageName} — coming soon at ODEH & PARTNERS DESIGN.`,
  };
}

function createSeoPage({
  id,
  name,
  route,
  pageType,
  metaTitle,
  metaDescription,
  publicationStatus = 'published',
  lastUpdated = '—',
  sourceModule,
  contentModule,
  contentGroup,
}) {
  return {
    id,
    name,
    route,
    pageType,
    metaTitle,
    metaDescription,
    publicationStatus,
    lastUpdated,
    sourceModule,
    contentModule,
    contentGroup,
    canonical: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    twitterTitle: null,
    twitterDescription: null,
    twitterImage: null,
    robotsIndex: null,
    robotsFollow: null,
    sitemapIncluded: null,
    sitemapPriority: null,
    sitemapChangeFrequency: null,
    structuredDataType: null,
  };
}

function buildStaticPages() {
  return [
    createSeoPage({
      id: 'home',
      name: 'Home',
      route: '/',
      pageType: 'static',
      metaTitle: 'ODEH & PARTNERS DESIGN',
      metaDescription:
        'ODEH & PARTNERS DESIGN — Innovative structural engineering and design solutions across the Middle East.',
      lastUpdated: homepageLastUpdated,
      sourceModule: 'HomePage.jsx',
      contentModule: 'website-pages',
      contentGroup: 'home',
    }),
    createSeoPage({
      id: 'about-overview',
      name: 'Overview',
      route: '/about/overview',
      pageType: 'about',
      metaTitle: overviewContent.meta.title,
      metaDescription: overviewContent.meta.description,
      sourceModule: 'overviewContent.js',
      contentModule: 'website-pages',
      contentGroup: 'about',
    }),
    createSeoPage({
      id: 'about-approach',
      name: 'Approach',
      route: '/about/approach',
      pageType: 'about',
      metaTitle: approachContent.meta.title,
      metaDescription: approachContent.meta.description,
      sourceModule: 'approachContent.js',
      contentModule: 'website-pages',
      contentGroup: 'about',
    }),
    createSeoPage({
      id: 'about-history',
      name: 'History',
      route: '/about/history',
      pageType: 'about',
      metaTitle: historyContent.meta.title,
      metaDescription: historyContent.meta.description,
      sourceModule: 'historyContent.js',
      contentModule: 'website-pages',
      contentGroup: 'about',
    }),
    createSeoPage({
      id: 'about-team',
      name: 'Team Members',
      route: '/about/team-members',
      pageType: 'about',
      metaTitle: teamContent.meta.title,
      metaDescription: teamContent.meta.description,
      sourceModule: 'teamContent.js',
      contentModule: 'website-pages',
      contentGroup: 'about',
    }),
    createSeoPage({
      id: 'about-activities',
      name: 'Activities',
      route: '/about/activities',
      pageType: 'about',
      metaTitle: activitiesContent.meta.title,
      metaDescription: activitiesContent.meta.description,
      sourceModule: 'activitiesContent.js',
      contentModule: 'activities',
      contentGroup: 'listing',
    }),
    createSeoPage({
      id: 'projects',
      name: 'Selected Projects',
      route: '/projects',
      pageType: 'listing',
      metaTitle: projectsContent.meta.title,
      metaDescription: projectsContent.meta.description,
      sourceModule: 'projectsContent.js',
      contentModule: 'projects',
      contentGroup: 'listing',
    }),
    createSeoPage({
      id: 'careers',
      name: 'Careers',
      route: '/careers',
      pageType: 'listing',
      metaTitle: careersContent.meta.title,
      metaDescription: careersContent.meta.description,
      sourceModule: 'careers.js',
      contentModule: 'careers',
      contentGroup: 'listing',
    }),
    createSeoPage({
      id: 'reach-out',
      name: 'Reach Out',
      route: '/reach-out',
      pageType: 'static',
      metaTitle: reachOutContent.meta.title,
      metaDescription: reachOutContent.meta.description,
      sourceModule: 'reachOutContent.js',
      contentModule: 'website-pages',
      contentGroup: 'reach-out',
    }),
    createSeoPage({
      id: 'search',
      name: 'Search',
      route: '/search',
      pageType: 'utility',
      metaTitle: searchContent.meta.title,
      metaDescription: searchContent.meta.description,
      sourceModule: 'searchContent.js',
      contentModule: 'utility',
      contentGroup: 'utility',
    }),
    createSeoPage({
      id: 'privacy-policy',
      name: 'Privacy Policy',
      route: '/privacy-policy',
      pageType: 'legal',
      metaTitle: privacyPolicyContent.meta.title,
      metaDescription: privacyPolicyContent.meta.description,
      lastUpdated: privacyPolicyContent.lastUpdated,
      sourceModule: 'privacyPolicyContent.js',
      contentModule: 'website-pages',
      contentGroup: 'legal',
    }),
    createSeoPage({
      id: 'terms-and-conditions',
      name: 'Terms & Conditions',
      route: '/terms-and-conditions',
      pageType: 'legal',
      metaTitle: termsContent.meta.title,
      metaDescription: termsContent.meta.description,
      lastUpdated: termsContent.lastUpdated,
      sourceModule: 'termsContent.js',
      contentModule: 'website-pages',
      contentGroup: 'legal',
    }),
    createSeoPage({
      id: 'thank-you',
      name: 'Thank You',
      route: '/thank-you',
      pageType: 'utility',
      metaTitle: thankYouContent.meta.title,
      metaDescription: thankYouContent.meta.description,
      sourceModule: 'thankYouContent.js',
      contentModule: 'utility',
      contentGroup: 'utility',
    }),
    createSeoPage({
      id: 'connect',
      name: 'Connect',
      route: '/connect',
      pageType: 'static',
      metaTitle: connectContent.meta.title,
      metaDescription: connectContent.meta.description,
      sourceModule: 'connectLinks.js',
      contentModule: 'website-pages',
      contentGroup: 'connect',
    }),
  ];
}

function buildActivityPages() {
  return activitiesContent.activities.map((activity) =>
    createSeoPage({
      id: `activity-${activity.slug}`,
      name: activity.title,
      route: `/about/activities/${activity.slug}`,
      pageType: 'activity-detail',
      metaTitle: `${activity.title} | Activities | ODEH & PARTNERS DESIGN`,
      metaDescription: `${activity.title} — ${activity.date}. Visual memories from ODEH & PARTNERS DESIGN.`,
      sourceModule: 'AboutActivityDetailPage.jsx',
      contentModule: 'activities',
      contentGroup: 'activities',
    }),
  );
}

function buildProjectCategoryPages() {
  return getAllCategories().map((category) =>
    createSeoPage({
      id: `category-${category.slug}`,
      name: category.title,
      route: `/projects/${category.slug}`,
      pageType: 'project-category',
      metaTitle: `${category.title} | Selected Projects | ODEH & PARTNERS DESIGN`,
      metaDescription: category.description,
      sourceModule: 'ProjectCategoryPage.jsx',
      contentModule: 'projects',
      contentGroup: 'categories',
    }),
  );
}

function buildProjectDetailPages() {
  return projectsContent.projects.map((project) => {
    const categoryTitle = getCategoryTitle(project.categorySlug);
    return createSeoPage({
      id: `project-${project.categorySlug}-${project.slug}`,
      name: project.title,
      route: `/projects/${project.categorySlug}/${project.slug}`,
      pageType: 'project-detail',
      metaTitle: `${project.title} | ${categoryTitle} | ODEH & PARTNERS DESIGN`,
      metaDescription: project.description,
      sourceModule: 'ProjectDetailPage.jsx',
      contentModule: 'projects',
      contentGroup: 'projects',
    });
  });
}

function buildServicePages() {
  return services.map((service) => {
    const meta = buildPlaceholderMeta(service.path);
    return createSeoPage({
      id: `service-${service.id}`,
      name: service.title,
      route: service.path,
      pageType: 'service',
      metaTitle: meta.title,
      metaDescription: meta.description,
      sourceModule: 'PlaceholderPage.jsx',
      contentModule: 'services',
      contentGroup: 'services',
    });
  });
}

function buildCareerPages() {
  const jobPages = jobs.map((job) =>
    createSeoPage({
      id: `job-${job.slug}`,
      name: job.title,
      route: getJobPath(job),
      pageType: 'career-detail',
      metaTitle: `${job.title} | Careers | ODEH & PARTNERS DESIGN`,
      metaDescription: job.shortDescription,
      publicationStatus: job.status === 'open' ? 'published' : 'archived',
      sourceModule: 'JobDetailPage.jsx',
      contentModule: 'careers',
      contentGroup: 'jobs',
    }),
  );

  const applyPages = jobs
    .filter((job) => job.status === 'open')
    .map((job) =>
      createSeoPage({
        id: `job-apply-${job.slug}`,
        name: `Apply — ${job.title}`,
        route: getJobApplyPath(job),
        pageType: 'career-apply',
        metaTitle: `Apply for ${job.title} | ODEH & PARTNERS DESIGN`,
        metaDescription: `Submit your application for the ${job.title} role at ODEH & PARTNERS DESIGN.`,
        sourceModule: 'JobApplicationPage.jsx',
        contentModule: 'careers',
        contentGroup: 'applications',
      }),
    );

  const thankYouPages = jobs
    .filter((job) => job.status === 'open')
    .map((job) =>
      createSeoPage({
        id: `job-apply-thank-you-${job.slug}`,
        name: `Application Thank You — ${job.title}`,
        route: getJobApplyThankYouPath(job),
        pageType: 'career-apply-thank-you',
        metaTitle: `Thank You | Apply for ${job.title} | ODEH & PARTNERS DESIGN`,
        metaDescription: `Your application for ${job.title} at ODEH & PARTNERS DESIGN has been received.`,
        sourceModule: 'JobApplicationThankYouPage.jsx',
        contentModule: 'careers',
        contentGroup: 'applications',
      }),
    );

  return [...jobPages, ...applyPages, ...thankYouPages];
}

export function buildSeoPagesFromRoutes() {
  const pages = [
    ...buildStaticPages(),
    ...buildActivityPages(),
    ...buildProjectCategoryPages(),
    ...buildProjectDetailPages(),
    ...buildServicePages(),
    ...buildCareerPages(),
  ];

  const seenRoutes = new Set();
  return pages.filter((page) => {
    if (seenRoutes.has(page.route)) return false;
    seenRoutes.add(page.route);
    return true;
  });
}

export const initialSeoPages = buildSeoPagesFromRoutes();
