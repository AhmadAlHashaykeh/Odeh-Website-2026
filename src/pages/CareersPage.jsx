import { AboutPageShell } from '../components/AboutSection';
import { CareersHero, CareersIntro, JobList } from '../components/Careers';
import { careersContent, getOpenJobs } from '../data/careers';

export default function CareersPage() {
  const { meta, hero, intro, emptyState } = careersContent;
  const openJobs = getOpenJobs();

  return (
    <AboutPageShell meta={meta}>
      <CareersHero {...hero} />
      <CareersIntro {...intro} />
      <JobList jobs={openJobs} emptyState={emptyState} showGlobalEmpty={openJobs.length === 0} />
    </AboutPageShell>
  );
}
