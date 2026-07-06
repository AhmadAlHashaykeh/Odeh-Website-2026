import { Navigate, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { GallerySlider } from '../components/Gallery';
import {
  ProjectDetailHero,
  ProjectInfo,
  RelatedProjects,
} from '../components/SelectedProjects';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getProject, getProjects } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';

export default function ProjectDetailPage() {
  const { category, project: projectSlug } = useParams();
  const { data: projectData, loading: projectLoading, error: projectError } = usePublicQuery(
    () => getProject(category, projectSlug),
    [category, projectSlug],
  );
  const { data: projectsData, loading: projectsLoading } = usePublicQuery(() => getProjects(), []);

  if (projectLoading || projectsLoading) {
    return (
      <AboutPageShell meta={{ title: 'Project | ODEH & PARTNERS DESIGN' }}>
        <PublicPageSkeleton variant="detail" />
      </AboutPageShell>
    );
  }

  const project = projectData?.data;
  const categories = projectsData?.data?.categories ?? [];
  const allProjects = projectsData?.data?.projects ?? [];
  const categoryData = categories.find((item) => item.slug === category);

  if (projectError || !project || !categoryData) {
    return <Navigate to="/projects" replace />;
  }

  const heroImage = project.gallery?.[0]?.src ?? project.coverImage;
  const related = allProjects
    .filter((item) => item.categorySlug === category && item.slug !== projectSlug)
    .slice(0, 3);
  const categoryTitle = categoryData.title;

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
