import { ConnectHero, ConnectLinkCard } from '../../../../components/Connect';
import styles from './ConnectPagePreview.module.css';

export default function ConnectPagePreview({ hero, links }) {
  return (
    <div className={styles.preview}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.frame}>
        <div className={styles.column}>
          <ConnectHero {...hero} />
          <nav className={styles.links} aria-label="Connect page preview">
            <ul className={styles.linkList}>
              {links.map((link) => (
                <li key={link.id}>
                  <ConnectLinkCard {...link} />
                </li>
              ))}
            </ul>
          </nav>
          {links.length === 0 && (
            <p className={styles.emptyHint}>No enabled links to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
