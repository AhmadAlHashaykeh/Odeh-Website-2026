import { StatusBadge } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import TeamMemberQuickActions from './TeamMemberQuickActions';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './TeamMembersCardView.module.css';

function MemberStatusBadge({ status }) {
  if (status === 'active') {
    return <StatusBadge status="active" label="Visible" />;
  }
  return <StatusBadge status="inactive" label="Hidden" />;
}

export default function TeamMembersCardView({
  items,
  selectedIds,
  onToggleSelect,
  onMemberClick,
  onViewMember,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {items.map((member) => (
        <article
          key={member.id}
          className={`${styles.card} ${selectedIds.has(member.id) ? styles.selected : ''}`}
        >
          <div className={styles.portraitWrap}>
            <button
              type="button"
              className={styles.portraitBtn}
              onClick={() => onMemberClick(member.id)}
              aria-label={`View ${member.fullName}`}
            >
              <img src={resolveMediaUrl(member.photo)}
                alt={member.fullName}
                className={styles.portrait}
                loading="lazy"
              />
              <div className={styles.portraitOverlay} aria-hidden="true" />
            </button>

            <div className={styles.cardTop}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedIds.has(member.id)}
                onChange={() => onToggleSelect(member.id)}
                aria-label={`Select ${member.fullName}`}
              />
              <TeamMemberQuickActions member={member} onView={onViewMember} onAction={onAction} />
            </div>

            <span className={styles.orderBadge}>#{member.displayOrder}</span>
          </div>

          <div className={styles.body}>
            <button
              type="button"
              className={styles.nameBtn}
              onClick={() => onMemberClick(member.id)}
            >
              <h3 className={styles.name}>{member.fullName}</h3>
            </button>

            <p className={styles.position}>{member.position}</p>

            <div className={styles.badges}>
              <span className={styles.categoryBadge}>{member.categoryLabel || '—'}</span>
              {member.rank?.name ? (
                <span
                  className={styles.rankBadge}
                  style={{
                    borderColor: member.rank.color,
                    color: member.rank.color,
                  }}
                >
                  {member.rank.name}
                </span>
              ) : null}
            </div>

            <div className={styles.details}>
              {member.experience ? (
                <span className={styles.experience}>{member.experience}</span>
              ) : null}
              {member.email ? (
                <a
                  href={`mailto:${member.email}`}
                  className={styles.email}
                  onClick={(e) => e.stopPropagation()}
                >
                  <AdminIcon name="messages" size={12} />
                  {member.email}
                </a>
              ) : null}
            </div>

            <div className={styles.footer}>
              <MemberStatusBadge status={member.status} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
