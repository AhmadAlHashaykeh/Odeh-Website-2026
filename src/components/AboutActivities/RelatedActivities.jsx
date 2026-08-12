import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import styles from './RelatedActivities.module.css';

export default function RelatedActivities({ activities }) {
  const headerRef = useScrollReveal(0.1);
  const gridRef = useScrollReveal(0.06);

  if (!activities?.length) return null;

  return (
    <section className={styles.related} aria-label="More activities">
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <span className="section-label">More Activities</span>
        </div>

        <div ref={gridRef} className={`${styles.grid} reveal reveal-delay-1`}>
          {activities.map((activity) => (
            <article key={activity.slug} className={styles.card}>
              <Link
                to={`/about/activities/${activity.slug}`}
                className={styles.cardLink}
                aria-label={`View activity: ${activity.title}`}
              >
                <div className={styles.imageWrap}>
                  <img src={resolveMediaUrl(activity.coverImage)}
                    alt={activity.title}
                    className={styles.image}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={styles.overlay} aria-hidden="true" />
                </div>
                <h2 className={styles.title}>{activity.title}</h2>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
