import styles from './ContactMessagesSkeleton.module.css';

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
      {Array.from({ length: 6 }).map((_, i) => (
        <Shimmer key={i} className={styles.filterShimmer} />
      ))}
    </div>
  );
}

function MessageCardSkeleton() {
  return (
    <div className={styles.messageCard}>
      <div className={styles.cardHeader}>
        <Shimmer className={styles.checkboxShimmer} />
        <Shimmer className={styles.actionShimmer} />
      </div>
      <div className={styles.cardBody}>
        <Shimmer className={styles.nameShimmer} />
        <Shimmer className={styles.subjectShimmer} />
        <Shimmer className={styles.typeShimmer} />
        <div className={styles.badgeRow}>
          <Shimmer className={styles.badgeShimmer} />
          <Shimmer className={styles.badgeShimmer} />
        </div>
        <div className={styles.metaRow}>
          <Shimmer className={styles.metaShimmer} />
          <Shimmer className={styles.metaShimmer} />
        </div>
        <Shimmer className={styles.descShimmer} />
        <Shimmer className={styles.descShimmerShort} />
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <MessageCardSkeleton key={i} />
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
          <Shimmer className={styles.senderShimmer} />
          <Shimmer className={styles.cellShimmerShort} />
          <Shimmer className={styles.cellShimmerShort} />
          <Shimmer className={styles.badgeShimmer} />
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
        <div className={styles.timelineSkeleton}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.timelineItem}>
              <Shimmer className={styles.timelineDot} />
              <Shimmer className={styles.timelineText} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NoteModalSkeleton() {
  return (
    <div className={styles.modalSkeleton} aria-hidden="true">
      <Shimmer className={styles.modalTitle} />
      <Shimmer className={styles.modalText} />
      <Shimmer className={styles.modalTextarea} />
      <div className={styles.modalActions}>
        <Shimmer className={styles.modalBtn} />
        <Shimmer className={styles.modalBtn} />
      </div>
    </div>
  );
}

function AssignModalSkeleton() {
  return (
    <div className={styles.assignModalSkeleton} aria-hidden="true">
      <Shimmer className={styles.modalTitle} />
      <Shimmer className={styles.modalText} />
      <Shimmer className={styles.selectShimmer} />
      <div className={styles.modalActions}>
        <Shimmer className={styles.modalBtn} />
        <Shimmer className={styles.modalBtn} />
      </div>
    </div>
  );
}

export default function ContactMessagesSkeleton({
  viewMode = 'table',
  showDrawer = false,
  showNoteModal = false,
  showAssignModal = false,
}) {
  return (
    <div className={styles.full} aria-busy="true" aria-label="Loading contact messages">
      <StatsSkeleton />
      <ToolbarSkeleton />
      {viewMode === 'table' ? <TableSkeleton /> : <GridSkeleton />}
      {showDrawer && <DrawerSkeleton />}
      {showNoteModal && <NoteModalSkeleton />}
      {showAssignModal && <AssignModalSkeleton />}
    </div>
  );
}
