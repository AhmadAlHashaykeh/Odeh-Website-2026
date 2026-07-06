import { Navigate, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { ProjectsHero, ProjectGrid } from '../components/SelectedProjects';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getProjects } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';

export default function ProjectCategoryPage() {
  const { category } = useParams();
  const { data, loading, error } = usePublicQuery(() => getProjects(), []);

  if (loading) {
    return (
      <AboutPageShell meta={{ title: 'Projects | ODEH & PARTNERS DESIGN' }}>
        <PublicPageSkeleton variant="hero-grid" />
      </AboutPageShell>
    );
  }

  const categories = data?.data?.categories ?? [];
  const projects = data?.data?.projects ?? [];
  const categoryData = categories.find((item) => item.slug === category);

  if (error || !categoryData) {
    return <Navigate to="/projects" replace />;
  }

  const categoryProjects = projects.filter((project) => project.categorySlug === category);

  const meta = {
    title: `${categoryData.title} | Selected Projects | ODEH & PARTNERS DESIGN`,
    description: categoryData.description,
  };

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Selected Projects', path: '/projects' },
    { label: categoryData.title },
  ];

  return (
    <AboutPageShell meta={meta}>
      <ProjectsHero
        title={categoryData.title}
        description={categoryData.description}
        backgroundImage={categoryData.coverImage}
        projectCount={categoryData.projectCount}
        breadcrumbs={breadcrumbs}
        ariaLabel={categoryData.title}
        variant="category"
      />
      <ProjectGrid projects={categoryProjects} />
    </AboutPageShell>
  );
}
