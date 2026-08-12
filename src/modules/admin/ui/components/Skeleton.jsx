import styles from './Skeleton.module.css';

export function Skeleton({ className = '', width, height, style = {} }) {
  return (
    <div
      className={`${styles.shimmer} ${className}`}
      aria-hidden="true"
      style={{ width, height, ...style }}
    />
  );
}

export function SkeletonStats({ count = 5 }) {
  return (
    <div className={styles.statsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.statCard}>
          <Skeleton className={styles.statValue} />
          <Skeleton className={styles.statLabel} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonToolbar({ filterCount = 4 }) {
  return (
    <div className={styles.toolbar}>
      <Skeleton className={styles.searchShimmer} />
      <div className={styles.filterRow}>
        {Array.from({ length: filterCount }).map((_, i) => (
          <Skeleton key={i} className={styles.filterShimmer} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 6, withThumb = false }) {
  return (
    <div className={styles.tableWrap}>
      <div className={styles.tableHeader}>
        {Array.from({ length: withThumb ? 6 : 5 }).map((_, i) => (
          <Skeleton key={i} className={styles.cellShimmerShort} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.tableRow}>
          <Skeleton className={styles.checkboxShimmer} />
          {withThumb && <Skeleton className={styles.thumbShimmer} />}
          <Skeleton className={styles.cellShimmer} />
          <Skeleton className={styles.cellShimmerShort} />
          <Skeleton className={styles.cellShimmerShort} />
          <Skeleton className={styles.badgeShimmer} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 6, variant = 'default' }) {
  if (variant === 'project') {
    return (
      <div className={styles.cardsGrid}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={styles.projectCard}>
            <Skeleton className={styles.cardImage} />
            <div className={styles.cardBody}>
              <Skeleton className={styles.cardTitle} />
              <Skeleton className={styles.cardMeta} />
              <Skeleton className={styles.cardLocation} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.cardsGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.cardSkeleton}>
          <Skeleton className={styles.cardTitle} />
          <Skeleton className={styles.cellShimmerShort} />
          <div className={styles.filterRow}>
            <Skeleton className={styles.badgeShimmer} />
            <Skeleton className={styles.badgeShimmer} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm({ fields = 4 }) {
  return (
    <div className={styles.formSkeleton}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className={styles.formField}>
          <Skeleton className={styles.formLabel} />
          <Skeleton className={styles.formInput} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.listItem}>
          <Skeleton className={styles.listAvatar} />
          <div className={styles.listContent}>
            <Skeleton className={styles.listTitle} />
            <Skeleton className={styles.listSubtitle} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonLoader({
  variant = 'full',
  viewMode = 'table',
  statsCount = 5,
  filterCount = 4,
  className = '',
}) {
  return (
    <div className={`${styles.full} ${className}`} aria-busy="true" aria-label="Loading content">
      {variant !== 'table' && variant !== 'cards' && variant !== 'form' && variant !== 'list' && (
        <>
          <SkeletonStats count={statsCount} />
          <SkeletonToolbar filterCount={filterCount} />
        </>
      )}
      {variant === 'full' && (
        viewMode === 'table'
          ? <SkeletonTable withThumb />
          : <SkeletonCards variant={viewMode === 'project' ? 'project' : 'default'} />
      )}
      {variant === 'table' && <SkeletonTable />}
      {variant === 'cards' && <SkeletonCards />}
      {variant === 'form' && <SkeletonForm />}
      {variant === 'list' && <SkeletonList />}
      {variant === 'stats' && <SkeletonStats count={statsCount} />}
    </div>
  );
}

Skeleton.Stats = SkeletonStats;
Skeleton.Toolbar = SkeletonToolbar;
Skeleton.Table = SkeletonTable;
Skeleton.Cards = SkeletonCards;
Skeleton.Form = SkeletonForm;
Skeleton.List = SkeletonList;
Skeleton.Loader = SkeletonLoader;

export default Skeleton;
