import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import styles from './CategoryCard.module.css';

export default function CategoryCard({ category, priority = false }) {
  return (
    <article className={styles.card}>
      <Link
        to={`/projects/${category.slug}`}
        className={styles.cardLink}
        aria-label={`View ${category.title} category`}
      >
        <div className={styles.imageWrap}>
          <img src={resolveMediaUrl(category.coverImage)}
            alt={category.title}
            className={styles.image}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
          <div className={styles.overlay} aria-hidden="true" />
        </div>

        <div className={styles.meta}>
          <h2 className={styles.title}>{category.title}</h2>
          <p className={styles.count}>
            {category.projectCount} {category.projectCount === 1 ? 'Project' : 'Projects'}
          </p>
          <span className={styles.action}>
            View Category
            <span className={styles.actionArrow} aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
