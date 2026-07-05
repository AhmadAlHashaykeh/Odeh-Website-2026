import styles from './ServicesSkeleton.module.css';

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

function ServiceCardSkeleton() {
  return (
    <div className={styles.serviceCard}>
      <Shimmer className={styles.imageShimmer} />
      <div className={styles.cardBody}>
        <Shimmer className={styles.titleShimmer} />
        <Shimmer className={styles.descShimmer} />
        <Shimmer className={styles.descShimmerShort} />
        <div className={styles.badgeRow}>
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.badgeShimmer} />
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className={styles.tableWrap}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className={styles.tableRow}>
          <Shimmer className={styles.checkboxShimmer} />
          <Shimmer className={styles.thumbShimmer} />
          <Shimmer className={styles.cellShimmer} />
          <Shimmer className={styles.cellShimmerShort} />
          <Shimmer className={styles.cellShimmerShort} />
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.cellShimmerShort} />
          <Shimmer className={styles.cellShimmerShort} />
        </div>
      ))}
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className={styles.drawerSkeleton} aria-hidden="true">
      <Shimmer className={styles.drawerHero} />
      <div className={styles.drawerBody}>
        <div className={styles.drawerBadgeRow}>
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.badgeShimmer} />
        </div>
        <Shimmer className={styles.drawerText} />
        <Shimmer className={styles.drawerText} />
        <Shimmer className={styles.drawerTextShort} />
      </div>
    </div>
  );
}

export default function ServicesSkeleton({ viewMode = 'card', showDrawer = false }) {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading services">
      <StatsSkeleton />
      <ToolbarSkeleton />
      {viewMode === 'table' ? <TableSkeleton /> : <GridSkeleton />}
      {showDrawer && <DrawerSkeleton />}
    </div>
  );
}
