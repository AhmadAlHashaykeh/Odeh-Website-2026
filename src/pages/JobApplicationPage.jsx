import { Navigate, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { JobApplicationHero, JobApplicationForm } from '../components/Careers';
import PageLoader from '../components/Utility/PageLoader';
import { getCareers, getJob } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { mapJob } from '../utils/contentMappers';
import { getJobPath } from '../utils/contentPaths';

export default function JobApplicationPage() {
  const { slug } = useParams();
  const { data: jobData, loading: jobLoading, error: jobError } = usePublicQuery(
    () => getJob(slug),
    [slug],
  );
  const { data: careersData, loading: careersLoading } = usePublicQuery(() => getCareers(), []);

  if (jobLoading || careersLoading) {
    return (
      <AboutPageShell meta={{ title: 'Apply | ODEH & PARTNERS DESIGN' }}>
        <PageLoader />
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

  const meta = {
    title: `Apply for ${job.title} | ODEH & PARTNERS DESIGN`,
    description: `Submit your application for the ${job.title} role at ODEH & PARTNERS DESIGN.`,
  };

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Careers', path: '/careers' },
    { label: job.title, path: getJobPath(job) },
    { label: 'Apply' },
  ];

  return (
    <AboutPageShell meta={meta}>
      <JobApplicationHero
        jobTitle={job.title}
        department={job.department}
        location={job.location}
        type={job.type}
        backgroundImage={careersPage?.hero?.backgroundImage}
        breadcrumbs={breadcrumbs}
      />
      <JobApplicationForm job={job} />
    </AboutPageShell>
  );
}
