import { useEffect } from 'react';
import { StatusBadge, SeoDelegationNotice } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import styles from './ServiceDetailsDrawer.module.css';

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

function PublicationBadge({ status }) {
  if (status === 'published') {
    return <StatusBadge status="active" label="Published" />;
  }
  if (status === 'draft') {
    return <StatusBadge status="pending" label="Draft" />;
  }
  return <StatusBadge status="inactive" label="Hidden" />;
}

export default function ServiceDetailsDrawer({ service, onClose }) {
  useEffect(() => {
    if (!service) return undefined;

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
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
          <AdminIcon name="close" size={20} />
        </button>

        <div className={styles.hero}>
          <img src={service.image} alt={service.title} className={styles.heroImage} />
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={styles.heroInfo}>
            <span className={styles.slug}>/{service.slug}</span>
            <h2 id="service-drawer-title" className={styles.title}>{service.title}</h2>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <PublicationBadge status={service.status} />
            {service.usedOnHomepage ? (
              <span className={styles.homepageBadge}>
                <AdminIcon name="home" size={12} />
                On Homepage
              </span>
            ) : (
              <span className={styles.notHomepage}>Not on Homepage</span>
            )}
            <span className={`${styles.seoBadge} ${styles[service.seoStatus]}`}>
              SEO {service.seoStatus === 'complete' ? 'Ready' : 'Pending'}
            </span>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Description</h3>
            <p className={styles.description}>{service.fullDescription}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Homepage Usage</h3>
            <div className={styles.visibilityRow}>
              <div className={styles.visibilityItem}>
                <span className={styles.visibilityLabel}>Carousel Visibility</span>
                <span className={styles.visibilityValue}>
                  {service.usedOnHomepage ? 'Visible on Homepage' : 'Not displayed on Homepage'}
                </span>
              </div>
              <div className={styles.visibilityItem}>
                <span className={styles.visibilityLabel}>Publication Status</span>
                <PublicationBadge status={service.status} />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>SEO</h3>
            <SeoDelegationNotice seoStatus={service.seoStatus} compact />
          </section>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <AdminIcon name="sort" size={16} />
              <div>
                <span className={styles.infoLabel}>Display Order</span>
                <span className={styles.infoValue}>#{service.displayOrder}</span>
              </div>
            </div>
            <div className={styles.infoCard}>
              <AdminIcon name="services" size={16} />
              <div>
                <span className={styles.infoLabel}>Service Icon</span>
                <span className={styles.infoValue}>{service.icon}</span>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Metadata</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Slug" value={service.slug} />
              <MetaRow label="Status" value={service.status} />
              <MetaRow label="Published" value={service.published ? 'Yes' : 'No'} />
              <MetaRow label="Created" value={formatDate(service.createdAt)} />
              <MetaRow label="Last Updated" value={formatDate(service.lastUpdated)} />
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Related Website Usage</h3>
            <ul className={styles.usageList}>
              {service.websiteUsage.map((usage) => (
                <li key={usage} className={styles.usageItem}>
                  <AdminIcon name="external" size={14} />
                  {usage}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}
