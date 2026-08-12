import {
  SkeletonBlock,
  SkeletonCard,
  SkeletonCircle,
  SkeletonLine,
  PublicSectionSkeleton,
} from './PublicSectionSkeleton';
import styles from './PublicPageSkeleton.module.css';

function HeroSkeleton({ compact = false, full = false }) {
  return (
    <section
      className={`${styles.hero} ${compact ? styles.heroCompact : ''} ${full ? styles.heroFull : ''}`}
      aria-hidden="true"
    >
      <div className={styles.heroBg} />
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.breadcrumbs}>
          <SkeletonLine width="3.5rem" />
          <SkeletonLine width="4rem" />
        </div>
        <PublicSectionSkeleton type="heading" />
      </div>
    </section>
  );
}

function CardGridSkeleton({ count = 6, wide = false }) {
  return (
    <div className={`container ${styles.section}`} aria-hidden="true">
      <div style={{ marginBottom: '2rem' }}>
        <PublicSectionSkeleton type="heading" />
      </div>
      <div className={styles.cardGrid}>
        {Array.from({ length: count }, (_, index) => (
          <SkeletonCard
            key={index}
            className={wide ? styles.cardItemWide : styles.cardItem}
          />
        ))}
      </div>
    </div>
  );
}

function TeamGridSkeleton() {
  return (
    <div className={`container ${styles.section}`} aria-hidden="true">
      <div style={{ marginBottom: '2rem' }}>
        <PublicSectionSkeleton type="heading" />
      </div>
      <div className={styles.teamGrid}>
        {Array.from({ length: 8 }, (_, index) => (
          <SkeletonCard key={index} className={styles.teamCard}>
            <SkeletonBlock className={styles.avatar} />
            <SkeletonLine width="70%" />
            <SkeletonLine width="50%" />
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

function DocumentSkeleton() {
  return (
    <div className={`container ${styles.section}`} aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className={styles.documentSection}>
          <SkeletonLine width="32%" style={{ height: '1.1rem', marginBottom: '1rem' }} />
          <PublicSectionSkeleton type="lines" lines={4} />
        </div>
      ))}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className={`container ${styles.section}`} aria-hidden="true">
      <div className={styles.twoCol}>
        <PublicSectionSkeleton type="heading" />
        <div className={styles.formGrid}>
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock key={index} className={styles.formField} />
          ))}
          <SkeletonBlock className={`${styles.formField} ${styles.formFieldWide}`} />
          <SkeletonBlock className={styles.formField} style={{ width: '40%' }} />
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <div className="container" aria-hidden="true">
        <SkeletonBlock className={styles.galleryBlock} />
      </div>
      <div className={`container ${styles.section}`} aria-hidden="true">
        <div className={styles.twoCol}>
          <PublicSectionSkeleton type="lines" lines={5} />
          <PublicSectionSkeleton type="lines" lines={4} />
        </div>
      </div>
      <CardGridSkeleton count={3} wide />
    </>
  );
}

function HomeSkeleton() {
  return (
    <>
      <HeroSkeleton full />
      <div className={`container ${styles.homeSection}`} aria-hidden="true">
        <div className={styles.homeSplit}>
          <SkeletonBlock className={styles.imageBlock} />
          <PublicSectionSkeleton type="heading" />
        </div>
      </div>
      <div className={`container ${styles.homeSection}`} aria-hidden="true">
        <div style={{ marginBottom: '2rem' }}>
          <PublicSectionSkeleton type="heading" />
        </div>
        <div className={styles.servicesRow}>
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonCard key={index} className={styles.serviceCard} />
          ))}
        </div>
      </div>
      <CardGridSkeleton count={3} wide />
    </>
  );
}

function ConnectSkeleton() {
  return (
    <div className={styles.connectColumn} aria-hidden="true">
      <div className={styles.connectHero}>
        <SkeletonCircle size={72} />
        <SkeletonLine width="55%" style={{ height: '1.5rem' }} />
        <SkeletonLine width="40%" />
      </div>
      {Array.from({ length: 5 }, (_, index) => (
        <SkeletonBlock key={index} className={styles.connectLink} />
      ))}
    </div>
  );
}

function SearchSkeleton({ resultsOnly = false }) {
  if (resultsOnly) {
    return (
      <div className={styles.resultList} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock key={index} className={styles.resultItem} />
        ))}
      </div>
    );
  }

  return (
    <>
      <HeroSkeleton compact />
      <div className={`container ${styles.section}`} aria-hidden="true">
        <SkeletonBlock className={styles.searchBar} />
        <SearchSkeleton resultsOnly />
      </div>
    </>
  );
}

function CenteredSkeleton() {
  return (
    <div className={`container ${styles.centered}`} aria-hidden="true">
      <SkeletonCircle size={64} />
      <SkeletonLine width="40%" style={{ height: '1.5rem' }} />
      <SkeletonLine width="60%" />
      <SkeletonLine width="48%" />
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <SkeletonBlock style={{ width: '8rem', height: '2.75rem', borderRadius: '9999px' }} />
        <SkeletonBlock style={{ width: '8rem', height: '2.75rem', borderRadius: '9999px' }} />
      </div>
    </div>
  );
}

function ContentSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <div className={`container ${styles.section}`} aria-hidden="true">
        <div className={styles.twoCol}>
          <PublicSectionSkeleton type="lines" lines={5} />
          <SkeletonBlock className={styles.imageBlock} />
        </div>
      </div>
      <div className={`container ${styles.sectionTight}`} aria-hidden="true">
        <div style={{ marginBottom: '1.5rem' }}>
          <PublicSectionSkeleton type="heading" />
        </div>
        <div className={styles.cardGrid}>
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonCard key={index} style={{ padding: '1.25rem', aspectRatio: 'auto', minHeight: '8rem' }}>
              <SkeletonLine width="40%" style={{ marginBottom: '0.75rem' }} />
              <PublicSectionSkeleton type="lines" lines={2} />
            </SkeletonCard>
          ))}
        </div>
      </div>
    </>
  );
}

const VARIANTS = {
  home: HomeSkeleton,
  'hero-content': ContentSkeleton,
  'hero-grid': () => (
    <>
      <HeroSkeleton />
      <CardGridSkeleton />
    </>
  ),
  detail: DetailSkeleton,
  document: () => (
    <>
      <HeroSkeleton compact />
      <DocumentSkeleton />
    </>
  ),
  form: () => (
    <>
      <HeroSkeleton />
      <FormSkeleton />
    </>
  ),
  search: () => <SearchSkeleton />,
  'search-results': () => <SearchSkeleton resultsOnly />,
  centered: CenteredSkeleton,
  connect: ConnectSkeleton,
  team: () => (
    <>
      <HeroSkeleton />
      <TeamGridSkeleton />
    </>
  ),
};

/**
 * Page-level loading placeholder for public routes.
 *
 * @param {'home'|'hero-content'|'hero-grid'|'detail'|'document'|'form'|'search'|'search-results'|'centered'|'connect'} [variant='hero-content']
 */
export default function PublicPageSkeleton({ variant = 'hero-content' }) {
  const Content = VARIANTS[variant] ?? VARIANTS['hero-content'];

  return (
    <div className={styles.skeleton} role="status" aria-live="polite">
      <span className={styles.srOnly}>Loading page content</span>
      <Content />
    </div>
  );
}
