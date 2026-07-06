import { AboutPageShell } from '../components/AboutSection';
import { ReachOutHero, ContactSection, OfficeMap } from '../components/ReachOut';
import PageLoader from '../components/Utility/PageLoader';
import { getReachOutPage } from '../api/public/content';
import { usePublicSite } from '../context/PublicSiteContext';
import { usePublicQuery } from '../hooks/usePublicQuery';

const FALLBACK_META = {
  title: 'Reach Out | ODEH & PARTNERS DESIGN',
  description: 'Get in touch with ODEH & PARTNERS DESIGN for structural engineering and project inquiries.',
};

export default function ReachOutPage() {
  const { integrations } = usePublicSite();
  const { data, loading, error } = usePublicQuery(() => getReachOutPage(), []);
  const content = data?.data;

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PageLoader />
      </AboutPageShell>
    );
  }

  if (error || !content) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <p>Unable to load page content.</p>
      </AboutPageShell>
    );
  }

  const { meta, hero, form, map } = content;
  const mapWithEmbed = {
    ...map,
    embedUrl: integrations?.googleMapsEmbedUrl ?? map?.embedUrl,
  };

  return (
    <AboutPageShell meta={meta}>
      <ReachOutHero {...hero} />
      <ContactSection form={form} />
      <OfficeMap {...mapWithEmbed} />
    </AboutPageShell>
  );
}
