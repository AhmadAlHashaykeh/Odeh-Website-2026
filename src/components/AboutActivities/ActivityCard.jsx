import { Link } from 'react-router-dom';
import styles from './ActivityCard.module.css';

export default function ActivityCard({
  slug,
  title,
  date,
  coverImage,
  priority = false,
}) {
  return (
    <article className={styles.card}>
      <Link
        to={`/about/activities/${slug}`}
        className={styles.cardLink}
        aria-label={`View activity: ${title}`}
      >
        <div className={styles.imageWrap}>
          <img
            src={coverImage}
            alt={title}
            className={styles.image}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>

        <div className={styles.meta}>
          <div className={styles.metaText}>
            <h2 className={styles.title}>{title}</h2>
            <time className={styles.date}>{date}</time>
          </div>

          <span className={styles.actionBtn}>
            View Activity
            <span className={styles.actionArrow} aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
