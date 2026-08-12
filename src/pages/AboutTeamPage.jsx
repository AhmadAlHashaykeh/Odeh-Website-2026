import { AboutPageShell, CtaPanel } from '../components/AboutSection';
import { OverviewHero } from '../components/AboutOverview';
import { TeamDirectory, TeamIntro } from '../components/AboutTeam';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getTeamMembers } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { mapTeamMember } from '../utils/contentMappers';

const FALLBACK_META = {
  title: 'Team Members | About | ODEH & PARTNERS DESIGN',
  description: 'Meet the engineers and professionals behind ODEH & PARTNERS DESIGN.',
};

const FALLBACK_INTRO = {
  label: 'Our People',
  title: 'Engineering minds. Shared craft.',
  lead: 'The experts behind every structure',
  body:
    'From board leadership to site engineers, our team brings structural precision, collaborative design, and regional experience to every project we deliver.',
};

const FALLBACK_CTA = {
  heading: 'Build with us',
  description: 'Explore open roles or reach out to start a conversation about your next project.',
  buttonLabel: 'View Careers',
  buttonTo: '/careers',
};

export default function AboutTeamPage() {
  const { data, loading, error } = usePublicQuery(() => getTeamMembers(), []);
  const page = data?.data?.page;
  const members = (data?.data?.members ?? []).map(mapTeamMember);

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PublicPageSkeleton variant="team" />
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

  const { meta, hero, intro, cta } = page;
  const introContent = {
    label: intro?.label ?? FALLBACK_INTRO.label,
    title: intro?.title ?? FALLBACK_INTRO.title,
    lead: intro?.lead ?? hero?.subtitle ?? FALLBACK_INTRO.lead,
    body: intro?.body ?? hero?.description ?? FALLBACK_INTRO.body,
  };
  const ctaContent = {
    heading: cta?.heading ?? FALLBACK_CTA.heading,
    description: cta?.description ?? FALLBACK_CTA.description,
    buttonLabel: cta?.buttonLabel ?? FALLBACK_CTA.buttonLabel,
    buttonTo: cta?.buttonTo ?? FALLBACK_CTA.buttonTo,
  };

  return (
    <AboutPageShell meta={meta}>
      <OverviewHero {...hero} />
      <TeamIntro {...introContent} />
      <TeamDirectory members={members} />
      <CtaPanel {...ctaContent} ariaLabel="Join the team" />
    </AboutPageShell>
  );
}
