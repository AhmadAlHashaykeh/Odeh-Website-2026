import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero } from '../components/AboutOverview';
import { TeamDirectory } from '../components/AboutTeam';
import { teamContent } from '../data/teamContent';

export default function AboutTeamPage() {
  const { meta, hero, members } = teamContent;

  return (
    <AboutPageShell meta={meta}>
      <OverviewHero {...hero} />
      <TeamDirectory members={members} />
    </AboutPageShell>
  );
}
