import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero } from '../components/AboutOverview';
import { ApproachPrinciples } from '../components/AboutApproach';
import { approachContent } from '../data/approachContent';

export default function AboutApproachPage() {
  const { meta, hero, principles } = approachContent;

  return (
    <AboutPageShell meta={meta}>
      <OverviewHero {...hero} />
      <ApproachPrinciples {...principles} />
    </AboutPageShell>
  );
}
