import { AboutPageShell } from '../components/AboutSection';
import { CareersHero, CareersIntro, JobList } from '../components/Careers';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getCareers } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { mapJob } from '../utils/contentMappers';

const FALLBACK_META = {
  title: 'Careers | ODEH & PARTNERS DESIGN',
  description: 'Explore career opportunities at ODEH & PARTNERS DESIGN.',
};

export default function CareersPage() {
  const { data, loading, error } = usePublicQuery(() => getCareers(), []);
  const page = data?.data?.page;
  const openJobs = (data?.data?.jobs ?? [])
    .map(mapJob)
    .filter((job) => job.status === 'open');

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PublicPageSkeleton variant="hero-grid" />
      </AboutPageShell>
    );
  }

  if (error || !page) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <p>Unable to load page content.</p>
      </AboutPageShell>
    );
  }

  const { meta, hero, intro, emptyState } = page;

  return (
    <AboutPageShell meta={meta}>
      <CareersHero {...hero} />
      <CareersIntro {...intro} />
      <JobList jobs={openJobs} emptyState={emptyState} showGlobalEmpty={openJobs.length === 0} />
    </AboutPageShell>
  );
}
