import styles from './NavigationFooterSkeleton.module.css';

function Shimmer({ className = '' }) {
  return <div className={`${styles.shimmer} ${className}`} aria-hidden="true" />;
}

export default function NavigationFooterSkeleton() {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading navigation and footer editor">
      <div className={styles.statsRow}>
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={`stat-${index}`} className={styles.statCard}>
            <Shimmer className={styles.statValue} />
            <Shimmer className={styles.statLabel} />
          </div>
        ))}
      </div>

      <div className={styles.layout}>
        <Shimmer className={styles.navShimmer} />
        <div className={styles.mainShimmer}>
          {Array.from({ length: 2 }).map((_, index) => (
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
      </div>
    </div>
  );
}
