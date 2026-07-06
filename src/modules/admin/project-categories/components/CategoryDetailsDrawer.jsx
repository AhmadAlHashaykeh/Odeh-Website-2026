import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, SeoDelegationNotice } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './CategoryDetailsDrawer.module.css';

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

export default function CategoryDetailsDrawer({ category, onClose }) {
  useEffect(() => {
    if (!category) return undefined;

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
  }, [category, onClose]);

  if (!category) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
          <AdminIcon name="close" size={20} />
        </button>

        <div className={styles.coverWrap}>
          <img src={resolveMediaUrl(category.coverImage)} alt={category.title} className={styles.cover} />
          <div className={styles.coverOverlay} aria-hidden="true" />
          <div className={styles.coverInfo}>
            <span className={styles.orderLabel}>Display Order #{category.displayOrder}</span>
            <h2 id="category-drawer-title" className={styles.title}>{category.title}</h2>
            <p className={styles.slug}>/{category.slug}</p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <StatusBadge
              status={category.published ? 'published' : 'draft'}
              label={category.published ? 'Published' : 'Hidden'}
            />
            <span className={`${styles.seoBadge} ${styles[category.seoStatus]}`}>
              SEO {category.seoStatus === 'complete' ? 'Ready' : 'Pending'}
            </span>
          </div>

          <p className={styles.description}>{category.description}</p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{category.projectCount}</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>#{category.displayOrder}</span>
              <span className={styles.statLabel}>Display Order</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{category.published ? 'Live' : 'Hidden'}</span>
              <span className={styles.statLabel}>Visibility</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{category.seoStatus === 'complete' ? '✓' : '…'}</span>
              <span className={styles.statLabel}>SEO Status</span>
            </div>
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Projects in Category</h3>
              <Link to="/admin/projects" className={styles.viewProjectsBtn}>
                Manage Projects
                <AdminIcon name="arrow" size={14} />
              </Link>
            </div>

            {(category.projectPreviews?.length ?? 0) > 0 ? (
              <div className={styles.projectGrid}>
                {category.projectPreviews.map((project) => (
                  <article key={project.id} className={styles.projectCard}>
                    <img src={resolveMediaUrl(project.coverImage)}
                      alt={project.title}
                      className={styles.projectImage}
                      loading="lazy"
                    />
                    <p className={styles.projectTitle}>{project.title}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.emptyProjects}>No projects assigned to this category yet.</p>
            )}
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>SEO</h3>
            <SeoDelegationNotice seoStatus={category.seoStatus} compact />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Metadata</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Category ID" value={category.id} />
              <MetaRow label="Slug" value={`/${category.slug}`} />
              <MetaRow label="Publication" value={category.publicationStatus} />
              <MetaRow label="Created" value={formatDate(category.createdAt)} />
              <MetaRow label="Last Updated" value={formatDate(category.lastUpdated)} />
              <MetaRow label="Featured Image" value={category.featuredImage.split('/').pop()} />
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
