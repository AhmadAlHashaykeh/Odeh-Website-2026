import styles from './CategoriesSkeleton.module.css';

function Shimmer({ className }) {
  return <div className={`${styles.shimmer} ${className || ''}`} aria-hidden="true" />;
}

function StatsSkeleton() {
  return (
    <div className={styles.statsRow}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.statCard}>
          <Shimmer className={styles.statValue} />
          <Shimmer className={styles.statLabel} />
        </div>
      ))}
    </div>
  );
}

function ToolbarSkeleton() {
  return (
    <div className={styles.toolbar}>
      <Shimmer className={styles.searchShimmer} />
      {Array.from({ length: 4 }).map((_, i) => (
        <Shimmer key={i} className={styles.filterShimmer} />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.cardSkeleton}>
          <Shimmer className={styles.imageShimmer} />
          <div className={styles.cardBody}>
            <Shimmer className={styles.titleShimmer} />
            <Shimmer className={styles.descShimmer} />
            <Shimmer className={styles.descShimmerShort} />
            <div className={styles.badgeRow}>
              <Shimmer className={styles.badgeShimmer} />
              <Shimmer className={styles.badgeShimmer} />
            </div>
            <div className={styles.thumbRow}>
              {Array.from({ length: 4 }).map((__, j) => (
                <Shimmer key={j} className={styles.thumbShimmer} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className={styles.tableWrap}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.tableRow}>
          <Shimmer className={styles.thumbColShimmer} />
          <Shimmer className={styles.cellShimmer} />
          <Shimmer className={styles.cellShimmerShort} />
          <Shimmer className={styles.cellShimmerShort} />
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.cellShimmerShort} />
        </div>
      ))}
    </div>
  );
}

export default function CategoriesSkeleton({ viewMode = 'table' }) {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading categories">
      <StatsSkeleton />
      <ToolbarSkeleton />
      {viewMode === 'table' ? <TableSkeleton /> : <GridSkeleton />}
    </div>
  );
}
