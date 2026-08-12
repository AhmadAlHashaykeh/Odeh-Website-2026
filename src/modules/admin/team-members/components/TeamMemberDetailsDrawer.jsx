import { useEffect } from 'react';
import { StatusBadge } from '../../cms/components';
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
    return <StatusBadge status="active" label="Visible" />;
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
            <span className={styles.department}>{member.categoryLabel || 'Section'}</span>
            <h2 id="member-drawer-title" className={styles.name}>{member.fullName}</h2>
            <p className={styles.position}>{member.position}</p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <MemberStatusBadge status={member.status} />
            <span className={styles.categoryBadge}>{member.categoryLabel}</span>
            {member.rank?.name ? (
              <span
                className={styles.categoryBadge}
                style={{ borderColor: member.rank.color, color: member.rank.color }}
              >
                {member.rank.name}
              </span>
            ) : null}
          </div>

          <div className={styles.infoGrid}>
            {member.experience ? (
              <div className={styles.infoCard}>
                <AdminIcon name="filter" size={16} />
                <div>
                  <span className={styles.infoLabel}>Experience</span>
                  <span className={styles.infoValue}>{member.experience}</span>
                </div>
              </div>
            ) : null}
            {member.email ? (
              <div className={styles.infoCard}>
                <AdminIcon name="messages" size={16} />
                <div>
                  <span className={styles.infoLabel}>Email</span>
                  <a href={`mailto:${member.email}`} className={styles.infoLink}>{member.email}</a>
                </div>
              </div>
            ) : null}
            {member.linkedinUrl ? (
              <div className={styles.infoCard}>
                <AdminIcon name="connect" size={16} />
                <div>
                  <span className={styles.infoLabel}>LinkedIn</span>
                  <a
                    href={member.linkedinUrl}
                    className={styles.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View profile
                  </a>
                </div>
              </div>
            ) : null}
            <div className={styles.infoCard}>
              <AdminIcon name="sort" size={16} />
              <div>
                <span className={styles.infoLabel}>Order in list</span>
                <span className={styles.infoValue}>#{member.displayOrder}</span>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Details</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Section" value={member.categoryLabel || '—'} />
              <MetaRow label="Rank" value={member.rank?.name || '—'} />
              <MetaRow label="Order" value={`#${member.displayOrder ?? '—'}`} />
              <MetaRow label="Updated" value={formatDate(member.lastUpdated)} />
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
