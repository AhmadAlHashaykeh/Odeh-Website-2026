import styles from './LegalPagesSkeleton.module.css';

function Shimmer({ className = '' }) {
  return <div className={`${styles.shimmer} ${className}`} aria-hidden="true" />;
}

export default function LegalPagesSkeleton() {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading legal pages editor">
      <div className={styles.statsRow}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`stat-${index}`} className={styles.statCard}>
            <Shimmer className={styles.statValue} />
            <Shimmer className={styles.statLabel} />
          </div>
        ))}
      </div>

      <div className={styles.cards}>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={`card-${index}`} className={styles.card}>
            <Shimmer className={styles.titleShimmer} />
            <Shimmer className={styles.slugShimmer} />
            <Shimmer className={styles.badgesShimmer} />
            <Shimmer className={styles.previewShimmer} />
            <div className={styles.actionsShimmer}>
              <Shimmer className={styles.btnShimmer} />
              <Shimmer className={styles.btnShimmer} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
