import { useEffect } from 'react';
import { StatusBadge, SeoDelegationNotice } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './TeamMemberDetailsDrawer.module.css';

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

function MemberStatusBadge({ status }) {
  if (status === 'active') {
    return <StatusBadge status="active" label="Active" />;
  }
  return <StatusBadge status="inactive" label="Hidden" />;
}

export default function TeamMemberDetailsDrawer({ member, onClose }) {
  useEffect(() => {
    if (!member) return undefined;

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
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
          <AdminIcon name="close" size={20} />
        </button>

        <div className={styles.hero}>
          <img src={resolveMediaUrl(member.photo)} alt={member.fullName} className={styles.heroImage} />
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={styles.heroInfo}>
            <span className={styles.department}>{member.department}</span>
            <h2 id="member-drawer-title" className={styles.name}>{member.fullName}</h2>
            <p className={styles.position}>{member.position}</p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <MemberStatusBadge status={member.status} />
            <span className={styles.categoryBadge}>{member.categoryLabel}</span>
            <span className={`${styles.seoBadge} ${styles[member.seoStatus]}`}>
              SEO {member.seoStatus === 'complete' ? 'Ready' : 'Pending'}
            </span>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <AdminIcon name="filter" size={16} />
              <div>
                <span className={styles.infoLabel}>Experience</span>
                <span className={styles.infoValue}>{member.experience}</span>
              </div>
            </div>
            <div className={styles.infoCard}>
              <AdminIcon name="messages" size={16} />
              <div>
                <span className={styles.infoLabel}>Email</span>
                <a href={`mailto:${member.email}`} className={styles.infoLink}>{member.email}</a>
              </div>
            </div>
            <div className={styles.infoCard}>
              <AdminIcon name="connect" size={16} />
              <div>
                <span className={styles.infoLabel}>Phone</span>
                <span className={styles.infoValue}>{member.phone}</span>
              </div>
            </div>
            <div className={styles.infoCard}>
              <AdminIcon name="sort" size={16} />
              <div>
                <span className={styles.infoLabel}>Display Order</span>
                <span className={styles.infoValue}>#{member.displayOrder}</span>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Biography Preview</h3>
            <p className={styles.biography}>{member.biographyPreview}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Public Visibility</h3>
            <div className={styles.visibilityRow}>
              <div className={styles.visibilityItem}>
                <span className={styles.visibilityLabel}>Directory Status</span>
                <MemberStatusBadge status={member.status} />
              </div>
              <div className={styles.visibilityItem}>
                <span className={styles.visibilityLabel}>Website Listing</span>
                <span className={styles.visibilityValue}>
                  {member.status === 'active' ? 'Public' : 'Hidden'}
                </span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>SEO</h3>
            <SeoDelegationNotice seoStatus={member.seoStatus} compact />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Metadata</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Slug" value={member.slug} />
              <MetaRow label="Department" value={member.department} />
              <MetaRow label="Category" value={member.categoryLabel} />
              <MetaRow label="Created" value={formatDate(member.createdAt)} />
              <MetaRow label="Last Updated" value={formatDate(member.lastUpdated)} />
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Related Website Usage</h3>
            <ul className={styles.usageList}>
              {member.websiteUsage.map((usage) => (
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
