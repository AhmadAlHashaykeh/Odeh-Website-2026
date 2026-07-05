import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ConnectHero, ConnectLinkCard } from '../components/Connect';
import { connectContent, getEnabledConnectLinks } from '../data/connectLinks';
import styles from './ConnectPage.module.css';

export default function ConnectPage() {
  const { meta, hero } = connectContent;
  const links = getEnabledConnectLinks();
  const heroRef = useScrollReveal();
  const linksRef = useScrollReveal(0.08);

  usePageMeta(meta);

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
