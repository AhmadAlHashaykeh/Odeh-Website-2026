import { Navigate, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { JobDetailHero, JobDetails } from '../components/Careers';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getCareers, getJob } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { mapJob } from '../utils/contentMappers';

export default function JobDetailPage() {
  const { slug } = useParams();
  const { data: jobData, loading: jobLoading, error: jobError } = usePublicQuery(
    () => getJob(slug),
    [slug],
  );
  const { data: careersData, loading: careersLoading } = usePublicQuery(() => getCareers(), []);

  if (jobLoading || careersLoading) {
    return (
      <AboutPageShell meta={{ title: 'Careers | ODEH & PARTNERS DESIGN' }}>
        <PublicPageSkeleton variant="detail" />
      </AboutPageShell>
    );
  }

  const careersPage = careersData?.data?.page;
  let job = jobData?.data ? mapJob(jobData.data) : null;

  if (!job && careersData?.data?.jobs) {
    const fallback = careersData.data.jobs.find((item) => item.slug === slug);
    job = fallback ? mapJob(fallback) : null;
  }

  if (jobError && !job) {
    return <Navigate to="/careers" replace />;
  }

  if (!job) {
    return <Navigate to="/careers" replace />;
  }

  const meta = {
    title: `${job.title} | Careers | ODEH & PARTNERS DESIGN`,
    description: job.shortDescription,
  };

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Careers', path: '/careers' },
    { label: job.title },
  ];

  return (
    <AboutPageShell meta={meta}>
      <JobDetailHero
        title={job.title}
        department={job.department}
        location={job.location}
        type={job.type}
        heroImage={careersPage?.hero?.backgroundImage}
        breadcrumbs={breadcrumbs}
        ariaLabel={job.title}
      />
      <JobDetails job={job} />
    </AboutPageShell>
  );
}
