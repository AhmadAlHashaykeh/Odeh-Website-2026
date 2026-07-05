import styles from './HomePageSkeleton.module.css';

function Shimmer({ className = '' }) {
  return <div className={`${styles.shimmer} ${className}`} aria-hidden="true" />;
}

export default function HomePageSkeleton() {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading homepage editor">
      <div className={styles.statsRow}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`stat-${index}`} className={styles.statCard}>
            <Shimmer className={styles.statValue} />
            <Shimmer className={styles.statLabel} />
          </div>
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div key={`panel-${index}`} className={styles.panel}>
          <div className={styles.panelMain}>
            <Shimmer className={styles.titleShimmer} />
            <Shimmer className={styles.descShimmer} />
            <Shimmer className={styles.summaryShimmer} />
            <div className={styles.actionsShimmer}>
              <Shimmer className={styles.btnShimmer} />
              <Shimmer className={styles.btnShimmer} />
            </div>
          </div>
          <Shimmer className={styles.previewShimmer} />
        </div>
      ))}
    </div>
  );
}
