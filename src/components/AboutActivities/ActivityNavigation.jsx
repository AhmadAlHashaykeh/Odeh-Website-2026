import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './ActivityNavigation.module.css';

function ArrowIcon({ direction }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      {direction === 'prev' ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function ActivityNavigation({ prev, next }) {
  const navRef = useScrollReveal(0.1);

  return (
    <section className={styles.nav} aria-label="Activity navigation">
      <div className="container">
        <div ref={navRef} className={`${styles.row} reveal`}>
          {prev ? (
            <Link
              to={`/about/activities/${prev.slug}`}
              className={`${styles.card} ${styles.cardPrev}`}
            >
              <span className={styles.iconWrap} aria-hidden="true">
                <ArrowIcon direction="prev" />
              </span>
              <span className={styles.cardText}>
                <span className={styles.cardLabel}>Previous Activity</span>
                <span className={styles.cardTitle}>{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span className={styles.placeholder} aria-hidden="true" />
          )}

          <Link to="/about/activities" className={styles.backBtn}>
            <GridIcon />
            Back to Activities
          </Link>

          {next ? (
            <Link
              to={`/about/activities/${next.slug}`}
              className={`${styles.card} ${styles.cardNext}`}
            >
              <span className={styles.cardText}>
                <span className={styles.cardLabel}>Next Activity</span>
                <span className={styles.cardTitle}>{next.title}</span>
              </span>
              <span className={styles.iconWrap} aria-hidden="true">
                <ArrowIcon direction="next" />
              </span>
            </Link>
          ) : (
            <span className={styles.placeholder} aria-hidden="true" />
          )}
        </div>
      </div>
    </section>
  );
}
