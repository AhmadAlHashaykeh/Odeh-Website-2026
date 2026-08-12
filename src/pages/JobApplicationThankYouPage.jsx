import { Navigate, useLocation, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { ApplicationThankYou } from '../components/Careers';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getCareers, getJob } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { mapJob } from '../utils/contentMappers';
import { getJobApplyPath, getJobPath } from '../utils/contentPaths';

export default function JobApplicationThankYouPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { data: jobData, loading: jobLoading, error: jobError } = usePublicQuery(
    () => getJob(slug),
    [slug],
  );
  const { data: careersData, loading: careersLoading } = usePublicQuery(() => getCareers(), []);

  if (jobLoading || careersLoading) {
    return (
      <AboutPageShell meta={{ title: 'Thank You | ODEH & PARTNERS DESIGN' }}>
        <PublicPageSkeleton variant="centered" />
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

  if (job.status === 'closed') {
    return <Navigate to={getJobPath(job)} replace />;
  }

  if (!location.state?.submitted) {
    return <Navigate to={getJobApplyPath(job)} replace />;
  }

  const meta = {
    title: `Thank You | Apply for ${job.title} | ODEH & PARTNERS DESIGN`,
    description: `Your application for ${job.title} at ODEH & PARTNERS DESIGN has been received.`,
  };

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Careers', path: '/careers' },
    { label: job.title, path: getJobPath(job) },
    { label: 'Apply', path: getJobApplyPath(job) },
    { label: 'Thank You' },
  ];

  return (
    <AboutPageShell meta={meta}>
      <ApplicationThankYou
        job={job}
        backgroundImage={careersPage?.hero?.backgroundImage}
        breadcrumbs={breadcrumbs}
      />
    </AboutPageShell>
  );
}
