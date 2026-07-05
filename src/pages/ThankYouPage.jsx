import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { PageContainer, SuccessState } from '../components/Utility';
import { thankYouContent } from '../data/thankYouContent';
import styles from './ThankYouPage.module.css';

export default function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('from') ?? 'default';

  const content = useMemo(() => {
    const base = thankYouContent.default;
    const variant = thankYouContent[source] ?? {};

    return {
      ...base,
      ...variant,
      meta: thankYouContent.meta,
    };
  }, [source]);

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
