import { AboutPageShell } from '../components/AboutSection';
import { ProjectsHero, CategoryGrid } from '../components/SelectedProjects';
import { projectsContent } from '../data/projectsContent';

export default function ProjectsPage() {
  const { meta, hero, categories } = projectsContent;

  return (
    <AboutPageShell meta={meta}>
      <ProjectsHero {...hero} variant="internal" />
      <CategoryGrid categories={categories} />
    </AboutPageShell>
  );
}
