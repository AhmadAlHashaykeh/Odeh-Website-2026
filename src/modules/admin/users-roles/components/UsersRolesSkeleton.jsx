import styles from './UsersRolesSkeleton.module.css';

function Shimmer({ className = '' }) {
  return <div className={`${styles.shimmer} ${className}`} aria-hidden="true" />;
}

export default function UsersRolesSkeleton() {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading users and roles">
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
          <div className={styles.toolbarShimmer}>
            <Shimmer className={styles.searchShimmer} />
            <Shimmer className={styles.actionsShimmer} />
          </div>

          <div className={styles.tableShimmer}>
            <Shimmer className={styles.tableHeader} />
            {Array.from({ length: 6 }).map((_, index) => (
              <Shimmer key={`row-${index}`} className={styles.tableRow} />
            ))}
          </div>

          <div className={styles.cardsShimmer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`card-${index}`} className={styles.card}>
                <Shimmer className={styles.cardAvatar} />
                <Shimmer className={styles.cardTitle} />
                <Shimmer className={styles.cardDesc} />
              </div>
            ))}
          </div>

          <div className={styles.matrixShimmer}>
            <Shimmer className={styles.matrixTitle} />
            {Array.from({ length: 5 }).map((_, index) => (
              <Shimmer key={`matrix-${index}`} className={styles.matrixRow} />
            ))}
          </div>

          <div className={styles.securityShimmer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Shimmer key={`sec-${index}`} className={styles.securityCard} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
