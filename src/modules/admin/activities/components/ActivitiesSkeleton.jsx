import styles from './ActivitiesSkeleton.module.css';

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

function EditorialCardSkeleton({ featured = false }) {
  return (
    <div className={`${styles.editorialCard} ${featured ? styles.featuredCard : ''}`}>
      <Shimmer className={styles.imageShimmer} />
      <div className={styles.cardBody}>
        <div className={styles.badgeRow}>
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.badgeShimmer} />
        </div>
        <Shimmer className={styles.titleShimmer} />
        <Shimmer className={styles.locationShimmer} />
        <Shimmer className={styles.previewShimmer} />
        <Shimmer className={styles.previewShimmerShort} />
        <Shimmer className={styles.orderShimmer} />
      </div>
    </div>
  );
}

function EditorialGridSkeleton() {
  return (
    <div className={styles.editorialGrid}>
      <EditorialCardSkeleton featured />
      <EditorialCardSkeleton />
      <EditorialCardSkeleton featured />
      <EditorialCardSkeleton />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className={styles.tableWrap}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.tableRow}>
          <Shimmer className={styles.checkboxShimmer} />
          <Shimmer className={styles.thumbShimmer} />
          <Shimmer className={styles.cellShimmer} />
          <Shimmer className={styles.cellShimmerShort} />
          <Shimmer className={styles.cellShimmerShort} />
          <Shimmer className={styles.badgeShimmer} />
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
        <div className={styles.drawerStatsRow}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Shimmer key={i} className={styles.drawerStatShimmer} />
          ))}
        </div>
        <Shimmer className={styles.drawerText} />
        <Shimmer className={styles.drawerTextShort} />
        <div className={styles.gallerySkeleton}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Shimmer key={i} className={styles.galleryThumbShimmer} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ActivitiesSkeleton({ viewMode = 'table' }) {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading activities">
      <StatsSkeleton />
      <ToolbarSkeleton />
      {viewMode === 'table' ? <TableSkeleton /> : <EditorialGridSkeleton />}
      <DrawerSkeleton />
    </div>
  );
}
