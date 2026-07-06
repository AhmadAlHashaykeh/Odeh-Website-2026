import { useEffect } from 'react';
import { StatusBadge, SeoDelegationNotice } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import ActivityGalleryPreview from './ActivityGalleryPreview';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './ActivityDetailsDrawer.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function MetaRow({ label, value }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </div>
  );
}

function TimelineItem({ label, value, icon }) {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.timelineIcon}>
        <AdminIcon name={icon} size={14} />
      </div>
      <div className={styles.timelineContent}>
        <span className={styles.timelineLabel}>{label}</span>
        <span className={styles.timelineValue}>{value}</span>
      </div>
    </div>
  );
}

export default function ActivityDetailsDrawer({ activity, onClose }) {
  useEffect(() => {
    if (!activity) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    const adminScroll = document.querySelector('[data-admin-scroll]');
    const previousAdminOverflow = adminScroll?.style.overflow ?? '';
    if (adminScroll) adminScroll.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (adminScroll) adminScroll.style.overflow = previousAdminOverflow;
    };
  }, [activity, onClose]);

  if (!activity) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
          <AdminIcon name="close" size={20} />
        </button>

        <div className={styles.coverWrap}>
          <img src={resolveMediaUrl(activity.coverImage)} alt={activity.title} className={styles.cover} />
          <div className={styles.coverOverlay} aria-hidden="true" />
          <div className={styles.coverInfo}>
            <span className={styles.dateLabel}>{activity.activityDate}</span>
            <h2 id="activity-drawer-title" className={styles.title}>{activity.title}</h2>
            <p className={styles.location}>
              <AdminIcon name="location" size={14} />
              {activity.location}
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <StatusBadge status={activity.status} />
            {activity.featured && (
              <span className={styles.featuredBadge}>
                <AdminIcon name="star" size={12} />
                Featured
              </span>
            )}
            <span className={`${styles.seoBadge} ${styles[activity.seoStatus]}`}>
              SEO {activity.seoStatus === 'complete' ? 'Ready' : 'Pending'}
            </span>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{activity.galleryCount}</span>
              <span className={styles.statLabel}>Gallery Images</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{activity.activityYear}</span>
              <span className={styles.statLabel}>Year</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>#{activity.displayOrder}</span>
              <span className={styles.statLabel}>Display Order</span>
            </div>
          </div>

          {activity.fullDescription && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p className={styles.description}>{activity.fullDescription}</p>
            </section>
          )}

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Timeline</h3>
            <div className={styles.timeline}>
              <TimelineItem
                label="Activity Date"
                value={activity.activityDate}
                icon="calendar"
              />
              <TimelineItem
                label="Publication Date"
                value={formatDate(activity.publicationDate)}
                icon="external"
              />
              <TimelineItem
                label="Last Updated"
                value={formatDate(activity.lastUpdated)}
                icon="refresh"
              />
              <TimelineItem
                label="Created"
                value={formatDate(activity.createdAt)}
                icon="add"
              />
            </div>
          </section>

          <section className={styles.section}>
            <ActivityGalleryPreview
              gallery={activity.gallery}
              coverImage={activity.coverImage}
            />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>SEO</h3>
            <SeoDelegationNotice seoStatus={activity.seoStatus} compact />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Publication Settings</h3>
            <div className={styles.publishingRow}>
              <div className={styles.publishItem}>
                <span className={styles.publishLabel}>Website Status</span>
                <StatusBadge status={activity.publicationStatus} />
              </div>
              <div className={styles.publishItem}>
                <span className={styles.publishLabel}>Visibility</span>
                <span className={styles.publishValue}>
                  {activity.published ? 'Public' : 'Hidden'}
                </span>
              </div>
              <div className={styles.publishItem}>
                <span className={styles.publishLabel}>Featured</span>
                <span className={styles.publishValue}>
                  {activity.featured ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Metadata</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Activity ID" value={String(activity.id)} />
              <MetaRow label="Display Order" value={`#${activity.displayOrder}`} />
              <MetaRow label="Gallery Count" value={String(activity.galleryCount)} />
              <MetaRow label="Location" value={activity.location} />
            </div>
          </section>

          {activity.relatedActivities?.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Related Activities</h3>
              <div className={styles.relatedGrid}>
                {activity.relatedActivities.map((related) => (
                  <div key={related.id} className={styles.relatedCard}>
                    <div className={styles.relatedThumb}>
                      <img src={resolveMediaUrl(related.coverImage)} alt={related.title} loading="lazy" />
                    </div>
                    <div className={styles.relatedInfo}>
                      <span className={styles.relatedTitle}>{related.title}</span>
                      <span className={styles.relatedMeta}>
                        {related.date} · {related.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
