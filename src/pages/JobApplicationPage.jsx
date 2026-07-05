import { Navigate, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { JobApplicationHero, JobApplicationForm } from '../components/Careers';
import { careersContent, getJobBySlug, getJobPath } from '../data/careers';

export default function JobApplicationPage() {
  const { slug } = useParams();
  const job = getJobBySlug(slug);

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
        backgroundImage={careersContent.hero.backgroundImage}
        breadcrumbs={breadcrumbs}
      />
      <JobApplicationForm job={job} />
    </AboutPageShell>
  );
}
