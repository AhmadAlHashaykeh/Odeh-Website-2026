import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero, OverviewContent, OverviewOfficeSlider } from '../components/AboutOverview';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getAbout } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { normalizePublicMedia } from '../utils/mediaUrl';

const FALLBACK_META = {
  title: 'Overview | About | ODEH & PARTNERS DESIGN',
  description: 'Learn about ODEH & PARTNERS DESIGN — our vision, expertise, and commitment to structural engineering excellence.',
};

export default function AboutOverviewPage() {
  const { data, loading, error } = usePublicQuery(() => getAbout(), []);
  const overview = data?.data?.overview ? normalizePublicMedia(data.data.overview) : undefined;

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PublicPageSkeleton variant="hero-content" />
      </AboutPageShell>
    );
  }

  if (error || !overview) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <p>Unable to load page content.</p>
      </AboutPageShell>
    );
  }

  const { meta, hero, content, slider } = overview;

  return (
    <AboutPageShell meta={meta}>
      <OverviewHero {...hero} />
      <OverviewContent {...content} />
      <OverviewOfficeSlider {...slider} />
    </AboutPageShell>
  );
}
