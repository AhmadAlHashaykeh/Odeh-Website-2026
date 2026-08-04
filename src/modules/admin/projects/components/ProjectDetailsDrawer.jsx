import { useEffect } from 'react';
import { StatusBadge } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import styles from './ProjectDetailsDrawer.module.css';

function MetaRow({ label, value }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value || '—'}</span>
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

        <div className={styles.content} style={{ paddingTop: '3rem' }}>
          <div className={styles.statusRow}>
            <StatusBadge status={project.status} />
          </div>

          <h2 id="project-drawer-title" className={styles.title}>{project.title}</h2>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Project Information</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Project Name" value={project.title} />
              <MetaRow label="Area (m²)" value={project.area} />
              <MetaRow label="Location" value={project.location} />
              <MetaRow label="Architect" value={project.architect} />
              <MetaRow label="Category" value={project.category} />
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
