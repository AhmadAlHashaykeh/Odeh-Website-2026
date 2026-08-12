import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero } from '../components/AboutOverview';
import { HistoryStory, HistoryCounters, HistoryDataTable } from '../components/AboutHistory';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getAbout } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { normalizePublicMedia } from '../utils/mediaUrl';

const FALLBACK_META = {
  title: 'History | About | ODEH & PARTNERS DESIGN',
  description: 'Explore the history and growth of ODEH & PARTNERS DESIGN since our founding.',
};

export default function AboutHistoryPage() {
  const { data, loading, error } = usePublicQuery(() => getAbout(), []);
  const history = data?.data?.history ? normalizePublicMedia(data.data.history) : undefined;

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PublicPageSkeleton variant="hero-content" />
      </AboutPageShell>
    );
  }

  if (error || !history) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <p>Unable to load page content.</p>
      </AboutPageShell>
    );
  }

  const { meta, hero, story, counters, growthTable } = history;

  return (
    <AboutPageShell meta={meta}>
      <OverviewHero {...hero} />
      <HistoryStory {...story} />
      <HistoryCounters {...counters} />
      <HistoryDataTable {...growthTable} />
    </AboutPageShell>
  );
}
