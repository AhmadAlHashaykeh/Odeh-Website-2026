import { Navigate, useLocation, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { ApplicationThankYou } from '../components/Careers';
import {
  careersContent,
  getJobApplyPath,
  getJobBySlug,
  getJobPath,
} from '../data/careers';

export default function JobApplicationThankYouPage() {
  const { slug } = useParams();
  const location = useLocation();
  const job = getJobBySlug(slug);

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
        backgroundImage={careersContent.hero.backgroundImage}
        breadcrumbs={breadcrumbs}
      />
    </AboutPageShell>
  );
}
