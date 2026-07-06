import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero } from '../components/AboutOverview';
import { ActivitiesGallery } from '../components/AboutActivities';
import PageLoader from '../components/Utility/PageLoader';
import { getActivities } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { mapActivity } from '../utils/contentMappers';

const FALLBACK_META = {
  title: 'Activities | About | ODEH & PARTNERS DESIGN',
  description: 'Browse company events, site visits, and team activities at ODEH & PARTNERS DESIGN.',
};

export default function AboutActivitiesPage() {
  const { data, loading, error } = usePublicQuery(() => getActivities(), []);
  const page = data?.data?.page;
  const activities = (data?.data?.activities ?? []).map(mapActivity);

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PageLoader />
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
      <OverviewHero {...hero} compact />
      <ActivitiesGallery activities={activities} />
    </AboutPageShell>
  );
}
