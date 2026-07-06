import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero } from '../components/AboutOverview';
import { TeamDirectory } from '../components/AboutTeam';
import PageLoader from '../components/Utility/PageLoader';
import { getTeamMembers } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { mapTeamMember } from '../utils/contentMappers';

const FALLBACK_META = {
  title: 'Team Members | About | ODEH & PARTNERS DESIGN',
  description: 'Meet the engineers and professionals behind ODEH & PARTNERS DESIGN.',
};

export default function AboutTeamPage() {
  const { data, loading, error } = usePublicQuery(() => getTeamMembers(), []);
  const page = data?.data?.page;
  const members = (data?.data?.members ?? []).map(mapTeamMember);

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
      <OverviewHero {...hero} />
      <TeamDirectory members={members} />
    </AboutPageShell>
  );
}
