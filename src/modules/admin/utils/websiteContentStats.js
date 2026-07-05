import { projectsContent, getAllCategories } from '../../../data/projectsContent';
import { jobs } from '../../../data/careers';
import { services } from '../../../data/services';
import { teamContent } from '../../../data/teamContent';
import { activitiesContent } from '../../../data/activitiesContent';
import { initialSeoPages } from '../seo/mock/buildSeoPages';

/** Counts derived from the same data sources that power the public website. */
export function getWebsiteContentStats() {
  const openJobs = jobs.filter((job) => job.status === 'open').length;

  return {
    projects: projectsContent.projects.length,
    categories: getAllCategories().length,
    teamMembers: teamContent.members.length,
    services: services.length,
    activities: activitiesContent.activities.length,
    careers: jobs.length,
    openPositions: openJobs,
    publicPages: initialSeoPages.length,
  };
}
