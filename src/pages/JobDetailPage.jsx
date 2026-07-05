import { Navigate, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { JobDetailHero, JobDetails } from '../components/Careers';
import { careersContent, getJobBySlug } from '../data/careers';

export default function JobDetailPage() {
  const { slug } = useParams();
  const job = getJobBySlug(slug);

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
        heroImage={careersContent.hero.backgroundImage}
        breadcrumbs={breadcrumbs}
        ariaLabel={job.title}
      />
      <JobDetails job={job} />
    </AboutPageShell>
  );
}
