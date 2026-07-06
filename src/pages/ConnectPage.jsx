import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ConnectHero, ConnectLinkCard } from '../components/Connect';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getConnectPage } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import styles from './ConnectPage.module.css';

const FALLBACK_META = {
  title: 'Connect | ODEH & PARTNERS DESIGN',
  description: 'Access all official ODEH & PARTNERS DESIGN links, contact information, and social media.',
};

export default function ConnectPage() {
  const { data, loading, error } = usePublicQuery(() => getConnectPage(), []);
  const connect = data?.data;
  const heroRef = useScrollReveal();
  const linksRef = useScrollReveal(0.08);

  const links = (connect?.links ?? [])
    .filter((link) => link.enabled)
    .sort((a, b) => a.order - b.order);

  usePageMeta(connect?.meta ?? FALLBACK_META);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.atmosphere} aria-hidden="true" />
        <main className={styles.main}>
          <PublicPageSkeleton variant="connect" />
        </main>
      </div>
    );
  }

  if (error || !connect) {
    return (
      <div className={styles.page}>
        <div className={styles.atmosphere} aria-hidden="true" />
        <main className={styles.main}>
          <p>Unable to load page content.</p>
        </main>
      </div>
    );
  }

  const { hero } = connect;

  return (
    <div className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <main className={styles.main}>
        <div className={styles.column}>
          <div ref={heroRef} className={`reveal ${styles.heroWrap}`}>
            <ConnectHero {...hero} />
          </div>

          <nav ref={linksRef} className={`reveal reveal-delay-1 ${styles.links}`} aria-label="Company links">
            <ul className={styles.linkList}>
              {links.map((link) => (
                <li key={link.id}>
                  <ConnectLinkCard {...link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </div>
  );
}
