import { AboutPageShell } from '../components/AboutSection';
import { ProjectsHero, CategoryGrid } from '../components/SelectedProjects';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getProjects } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { normalizePublicMedia } from '../utils/mediaUrl';

const FALLBACK_META = {
  title: 'Selected Projects | ODEH & PARTNERS DESIGN',
  description: 'Discover a curated portfolio of structural engineering projects delivered across multiple sectors.',
};

export default function ProjectsPage() {
  const { data, loading, error } = usePublicQuery(() => getProjects(), []);
  const page = data?.data?.page ? normalizePublicMedia(data.data.page) : undefined;
  const categories = (data?.data?.categories ?? []).map(normalizePublicMedia);

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PublicPageSkeleton variant="hero-grid" />
      </AboutPageShell>
    );
  }

  if (error || !page) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <p>Unable to load page content.</p>
      </AboutPageShell>
    );
  }

  const { meta, hero } = page;

  return (
    <AboutPageShell meta={meta}>
      <ProjectsHero {...hero} variant="internal" />
      <CategoryGrid categories={categories} />
    </AboutPageShell>
  );
}
