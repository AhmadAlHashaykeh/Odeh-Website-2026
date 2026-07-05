import styles from './ConnectPageSkeleton.module.css';

function Shimmer({ className = '' }) {
  return <div className={`${styles.shimmer} ${className}`} aria-hidden="true" />;
}

export default function ConnectPageSkeleton() {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading connect page editor">
      <div className={styles.statsRow}>
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={`stat-${index}`} className={styles.statCard}>
            <Shimmer className={styles.statValue} />
            <Shimmer className={styles.statLabel} />
          </div>
        ))}
      </div>

      <div className={styles.layout}>
        <Shimmer className={styles.previewShimmer} />
        <div className={styles.panelsShimmer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`panel-${index}`} className={styles.panel}>
              <Shimmer className={styles.titleShimmer} />
              <Shimmer className={styles.descShimmer} />
              <Shimmer className={styles.cardShimmer} />
              <Shimmer className={styles.cardShimmer} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
