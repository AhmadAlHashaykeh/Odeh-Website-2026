import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero, OverviewContent, OverviewOfficeSlider } from '../components/AboutOverview';
import { overviewContent } from '../data/overviewContent';

export default function AboutOverviewPage() {
  const { meta, hero, content, slider } = overviewContent;

  return (
    <AboutPageShell meta={meta}>
      <OverviewHero {...hero} />
      <OverviewContent {...content} />
      <OverviewOfficeSlider {...slider} />
    </AboutPageShell>
  );
}
