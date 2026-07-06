import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { PageContainer, SuccessState } from '../components/Utility';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { usePublicSite } from '../context/PublicSiteContext';
import styles from './ThankYouPage.module.css';

const FALLBACK_META = {
  title: 'Thank You | ODEH & PARTNERS DESIGN',
  description: 'Thank you for contacting ODEH & PARTNERS DESIGN.',
};

export default function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('from') ?? 'default';
  const { publicPages, loading } = usePublicSite();
  const thankYouContent = publicPages.thankYou ?? {};

  const content = useMemo(() => {
    const base = thankYouContent.default ?? {};
    const variant = thankYouContent[source] ?? {};

    return {
      ...base,
      ...variant,
      meta: thankYouContent.meta ?? FALLBACK_META,
    };
  }, [thankYouContent, source]);

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PublicPageSkeleton variant="centered" />
      </AboutPageShell>
    );
  }

  return (
    <AboutPageShell meta={content.meta}>
      <PageContainer className={styles.page} ariaLabel="Thank you">
        <SuccessState
          label={content.label}
          heading={content.heading}
          description={content.description}
          primaryLabel={content.primaryLabel}
          primaryTo={content.primaryTo}
          secondaryLabel={content.secondaryLabel}
          secondaryTo={content.secondaryTo}
        />
      </PageContainer>
    </AboutPageShell>
  );
}
