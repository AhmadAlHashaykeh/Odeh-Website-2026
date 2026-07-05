import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero } from '../components/AboutOverview';
import { ActivitiesGallery } from '../components/AboutActivities';
import { activitiesContent } from '../data/activitiesContent';

export default function AboutActivitiesPage() {
  const { meta, hero, activities } = activitiesContent;

  return (
    <AboutPageShell meta={meta}>
      <OverviewHero {...hero} compact />
      <ActivitiesGallery activities={activities} />
    </AboutPageShell>
  );
}
