import { Navigate, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { ProjectsHero, ProjectGrid } from '../components/SelectedProjects';
import {
  getCategoryBySlug,
  getProjectsByCategory,
} from '../data/projectsContent';

export default function ProjectCategoryPage() {
  const { category } = useParams();
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    return <Navigate to="/projects" replace />;
  }

  const projects = getProjectsByCategory(category);

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
      <ProjectGrid projects={projects} />
    </AboutPageShell>
  );
}
