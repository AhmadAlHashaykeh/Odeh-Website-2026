import styles from './TeamMembersSkeleton.module.css';

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
      {Array.from({ length: 5 }).map((_, i) => (
        <Shimmer key={i} className={styles.filterShimmer} />
      ))}
    </div>
  );
}

function PortraitCardSkeleton() {
  return (
    <div className={styles.portraitCard}>
      <Shimmer className={styles.portraitShimmer} />
      <div className={styles.cardBody}>
        <Shimmer className={styles.nameShimmer} />
        <Shimmer className={styles.positionShimmer} />
        <div className={styles.badgeRow}>
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.badgeShimmer} />
        </div>
        <Shimmer className={styles.emailShimmer} />
        <Shimmer className={styles.statusShimmer} />
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 8 }).map((_, i) => (
        <PortraitCardSkeleton key={i} />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className={styles.tableWrap}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.tableRow}>
          <Shimmer className={styles.checkboxShimmer} />
          <Shimmer className={styles.avatarShimmer} />
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

function DrawerSkeleton() {
  return (
    <div className={styles.drawerSkeleton} aria-hidden="true">
      <Shimmer className={styles.drawerHero} />
      <div className={styles.drawerBody}>
        <div className={styles.drawerBadgeRow}>
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.badgeShimmer} />
        </div>
        <Shimmer className={styles.drawerText} />
        <Shimmer className={styles.drawerTextShort} />
      </div>
    </div>
  );
}

export default function TeamMembersSkeleton({ viewMode = 'table', showDrawer = false }) {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading team members">
      <StatsSkeleton />
      <ToolbarSkeleton />
      {viewMode === 'table' ? <TableSkeleton /> : <GridSkeleton />}
      {showDrawer && <DrawerSkeleton />}
    </div>
  );
}
