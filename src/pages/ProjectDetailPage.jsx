import { Navigate, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { GallerySlider } from '../components/Gallery';
import {
  ProjectDetailHero,
  ProjectInfo,
  RelatedProjects,
} from '../components/SelectedProjects';
import {
  getCategoryBySlug,
  getCategoryTitle,
  getProjectBySlug,
  getRelatedProjects,
} from '../data/projectsContent';

export default function ProjectDetailPage() {
  const { category, project: projectSlug } = useParams();
  const project = getProjectBySlug(category, projectSlug);
  const categoryData = getCategoryBySlug(category);

  if (!project || !categoryData) {
    return <Navigate to="/projects" replace />;
  }

  const heroImage = project.gallery[0]?.src ?? project.coverImage;
  const related = getRelatedProjects(category, projectSlug, 3);
  const categoryTitle = getCategoryTitle(category);

  const meta = {
    title: `${project.title} | ${categoryTitle} | ODEH & PARTNERS DESIGN`,
    description: project.description,
  };

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: categoryTitle, path: `/projects/${category}` },
    { label: project.title },
  ];

  return (
    <AboutPageShell meta={meta}>
      <ProjectDetailHero
        title={project.title}
        categoryTitle={categoryTitle}
        heroImage={heroImage}
        breadcrumbs={breadcrumbs}
        ariaLabel={project.title}
      />
      <GallerySlider
        gallery={project.gallery}
        title={project.title}
        ariaLabel={`${project.title} project gallery`}
      />
      <ProjectInfo project={project} />
      <RelatedProjects projects={related} categoryTitle={categoryTitle} />
    </AboutPageShell>
  );
}
