import { useEffect } from 'react';
import { StatusBadge, SeoDelegationNotice } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import GalleryPreview from './GalleryPreview';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './ProjectDetailsDrawer.module.css';

function formatDate(value) {
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

export default function ProjectDetailsDrawer({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;

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
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
          <AdminIcon name="close" size={20} />
        </button>

        <div className={styles.coverWrap}>
          <img src={resolveMediaUrl(project.coverImage)} alt={project.title} className={styles.cover} />
          <div className={styles.coverOverlay} aria-hidden="true" />
          <div className={styles.coverInfo}>
            <span className={styles.category}>{project.category}</span>
            <h2 id="project-drawer-title" className={styles.title}>{project.title}</h2>
            <p className={styles.location}>{project.location}</p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <StatusBadge status={project.status} />
            {project.featured && (
              <span className={styles.featuredBadge}>
                <AdminIcon name="star" size={12} />
                Featured
              </span>
            )}
            <span className={`${styles.seoBadge} ${styles[project.seoStatus]}`}>
              SEO {project.seoStatus === 'complete' ? 'Ready' : 'Pending'}
            </span>
          </div>

          {project.description && (
            <p className={styles.description}>{project.description}</p>
          )}

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{project.galleryCount}</span>
              <span className={styles.statLabel}>Gallery Images</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{project.servicesCount}</span>
              <span className={styles.statLabel}>Services</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{project.year}</span>
              <span className={styles.statLabel}>Year</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>#{project.displayOrder}</span>
              <span className={styles.statLabel}>Display Order</span>
            </div>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Project Information</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Slug" value={`/${project.slug}`} />
              <MetaRow label="Type" value={project.projectType} />
              <MetaRow label="Area" value={project.area} />
              <MetaRow label="Completion" value={project.completionStatus} />
              <MetaRow label="Published" value={project.published ? 'Yes' : 'No'} />
              <MetaRow label="Created" value={formatDate(project.createdAt)} />
              <MetaRow label="Last Updated" value={formatDate(project.lastUpdated)} />
            </div>
          </section>

          <section className={styles.section}>
            <GalleryPreview gallery={project.gallery} coverImage={project.coverImage} />
          </section>

          {project.services && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Related Services</h3>
              <p className={styles.services}>{project.services}</p>
            </section>
          )}

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>SEO</h3>
            <SeoDelegationNotice seoStatus={project.seoStatus} compact />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Publishing</h3>
            <div className={styles.publishingRow}>
              <div className={styles.publishItem}>
                <span className={styles.publishLabel}>Website Status</span>
                <StatusBadge status={project.status} />
              </div>
              <div className={styles.publishItem}>
                <span className={styles.publishLabel}>Visibility</span>
                <span className={styles.publishValue}>
                  {project.published ? 'Public' : 'Hidden'}
                </span>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
