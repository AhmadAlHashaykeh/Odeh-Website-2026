import styles from './WebsiteSettingsSkeleton.module.css';

function Shimmer({ className = '' }) {
  return <div className={`${styles.shimmer} ${className}`} aria-hidden="true" />;
}

export default function WebsiteSettingsSkeleton() {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading website settings">
      <div className={styles.statsRow}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`stat-${index}`} className={styles.statCard}>
            <Shimmer className={styles.statValue} />
            <Shimmer className={styles.statLabel} />
          </div>
        ))}
      </div>

      <div className={styles.layout}>
        <Shimmer className={styles.navShimmer} />
        <div className={styles.mainShimmer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`card-${index}`} className={styles.card}>
              <Shimmer className={styles.titleShimmer} />
              <Shimmer className={styles.descShimmer} />
              <Shimmer className={styles.fieldShimmer} />
              <Shimmer className={styles.fieldShimmer} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
