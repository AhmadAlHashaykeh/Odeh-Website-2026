import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero } from '../components/AboutOverview';
import { ApproachPrinciples } from '../components/AboutApproach';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getAbout } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { normalizePublicMedia } from '../utils/mediaUrl';

const FALLBACK_META = {
  title: 'Approach | About | ODEH & PARTNERS DESIGN',
  description: 'Discover the engineering principles and methodology behind ODEH & PARTNERS DESIGN projects.',
};

export default function AboutApproachPage() {
  const { data, loading, error } = usePublicQuery(() => getAbout(), []);
  const approach = data?.data?.approach ? normalizePublicMedia(data.data.approach) : undefined;

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PublicPageSkeleton variant="hero-content" />
      </AboutPageShell>
    );
  }

  if (error || !approach) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <p>Unable to load page content.</p>
      </AboutPageShell>
    );
  }

  const { meta, hero, principles } = approach;

  return (
    <AboutPageShell meta={meta}>
      <OverviewHero {...hero} />
      <ApproachPrinciples {...principles} />
    </AboutPageShell>
  );
}
